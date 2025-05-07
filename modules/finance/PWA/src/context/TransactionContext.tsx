import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import * as transactionsApi from '../services/transactionsApi';
// IndexedDB imports commented out for API-first approach
// import * as dbService from '../services/dbService';
import { Transaction } from '../types';
import { useAuth } from './AuthContext';
// Removed to avoid circular dependency
// import { useDashboard } from './DashboardContext';

interface TransactionContextType {
  transactions: Transaction[];
  fetchTransactions: (limit?: number) => Promise<void>;
  fetchTransactionsByAccount: (accountId: string) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<Transaction | undefined>; // Return new transaction
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  isLoadingTransactions: boolean;
  isLoadingAccountTransactions: boolean;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState<boolean>(false);
  const [isLoadingAccountTransactions, setIsLoadingAccountTransactions] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();
  // Removed to avoid circular dependency
  // const { fetchDashboardSummary } = useDashboard();

  // Refs to prevent duplicate fetches
  const lastFetchedAccountRef = useRef<string | null>(null);
  const fetchingAccountTxRef = useRef<boolean>(false);
  const lastFetchedLimitRef = useRef<number>(0);
  const isFetchingTransactionsRef = useRef<boolean>(false);
  const lastFetchTimeRef = useRef<number>(0);

  // Fetch recent transactions - API-first approach with debounce
  const fetchTransactions = useCallback(async (limit: number = 20) => {
    console.log('fetchTransactions called in TransactionContext, limit:', limit);
    
    // Prevent duplicate calls within 500ms and with the same limit
    const now = Date.now();
    if (
      isFetchingTransactionsRef.current || 
      (now - lastFetchTimeRef.current < 500 && lastFetchedLimitRef.current === limit && transactions.length > 0)
    ) {
      console.log(`Skipping duplicate transaction fetch. Already fetched ${lastFetchedLimitRef.current} transactions recently.`);
      return;
    }
    
    // Update refs to prevent duplicate calls
    isFetchingTransactionsRef.current = true;
    lastFetchTimeRef.current = now;
    lastFetchedLimitRef.current = limit;
    setIsLoadingTransactions(true);
    
    try {
      console.log('Fetching recent transactions from API...');
      const res = await transactionsApi.getRecentTransactions(limit);
      
      if (res && res.success && Array.isArray(res.data)) {
        setTransactions(res.data);
        console.log(`Successfully fetched ${res.data.length} transactions from API`);
      } else {
        console.warn('Unexpected transactions data format:', res);
        setTransactions([]);
      }
    } catch (e) {
      console.error('Error fetching transactions:', e);
      setTransactions([]);
    } finally {
      setIsLoadingTransactions(false);
      // Reset fetching state after a short delay
      setTimeout(() => {
        isFetchingTransactionsRef.current = false;
      }, 500);
    }
  }, [transactions.length]);

  // Fetch transactions for a specific account - API-first approach
  const fetchTransactionsByAccount = useCallback(async (accountId: string) => {
    if (fetchingAccountTxRef.current && lastFetchedAccountRef.current === accountId) {
      console.log('Skipping duplicate fetch for account transactions:', accountId);
      return;
    }
    
    // Set fetching state and update refs
    fetchingAccountTxRef.current = true;
    lastFetchedAccountRef.current = accountId;
    setIsLoadingAccountTransactions(true);
    
    try {
      console.log('Fetching transactions for account from API:', accountId);
      const res = await transactionsApi.getAccountTransactions(accountId);
      
      if (res && res.success && Array.isArray(res.data)) {
        setTransactions(res.data);
        console.log(`Successfully fetched ${res.data.length} transactions for account ${accountId}`);
      } else {
        console.warn('Unexpected account transactions data format:', res);
        setTransactions([]);
      }
    } catch (error) {
      console.error(`Error fetching transactions for account ${accountId}:`, error);
      setTransactions([]);
    } finally {
      // Reset fetching state after a short delay
      setTimeout(() => {
        fetchingAccountTxRef.current = false;
      }, 500); 
      setIsLoadingAccountTransactions(false);
    }
  }, []);

  // Initial fetch for recent transactions only when authenticated
  // Use a ref to track if we've already done the initial fetch
  const initialFetchDoneRef = useRef(false);
  
  useEffect(() => {
    if (isAuthenticated && !initialFetchDoneRef.current && transactions.length === 0) {
      console.log('Performing initial transaction fetch');
      fetchTransactions(20); // Fetch recent 20 on load
      initialFetchDoneRef.current = true;
    }
  }, [fetchTransactions, isAuthenticated, transactions.length]);

  // Add transaction - API-first approach
  const addTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
    setIsLoadingTransactions(true);
    try {
      const response = await transactionsApi.createTransaction(transactionData as any);
      if (response.success && response.data) {
        const newTransaction = response.data;
        setTransactions(prev => [newTransaction, ...prev]);
        // Note: Dashboard will be updated separately
        return newTransaction;
      } else {
        console.error('Failed to create transaction:', response);
        throw new Error(response?.message || 'Failed to create transaction');
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    } finally {
        setIsLoadingTransactions(false);
    }
  };

  // Update transaction - API-first approach
  const updateTransaction = async (updatedTransaction: Transaction) => {
    setIsLoadingTransactions(true);
    try {
      const { id, ...transactionData } = updatedTransaction;
      const response = await transactionsApi.updateTransaction(id, transactionData as any);
      if (response.success) {
        setTransactions(prev => prev.map(t => t.id === id ? updatedTransaction : t));
        // Note: Dashboard will be updated separately
        return updatedTransaction;
      } else {
        console.error('Failed to update transaction:', response);
        throw new Error(response?.message || 'Failed to update transaction');
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    } finally {
        setIsLoadingTransactions(false);
    }
  };

  // Delete transaction - API-first approach
  const deleteTransaction = async (id: string) => {
    setIsLoadingTransactions(true);
    try {
      const response = await transactionsApi.deleteTransaction(id);
      if (response.success) {
        setTransactions(prev => prev.filter(t => t.id !== id));
        // Note: Dashboard will be updated separately
        return true;
      } else {
        console.error('Failed to delete transaction:', response);
        throw new Error(response?.message || 'Failed to delete transaction');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    } finally {
        setIsLoadingTransactions(false);
    }
  };

  // NOTE: When displaying transactions, if transaction.account is missing, show 'Closed Account'.
  // If transaction.category is missing, show 'Uncategorized'.
  // This logic should be handled in the UI components using this context.
  const value = {
    transactions,
    fetchTransactions,
    fetchTransactionsByAccount,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    isLoadingTransactions,
    isLoadingAccountTransactions,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
