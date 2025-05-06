import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import * as transactionsApi from '../services/transactionsApi';
import * as dbService from '../services/dbService';
import { Transaction } from '../types';
import { useAuth } from './AuthContext'; // If needed
// import { useDashboard } from './DashboardContext'; // If needed

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
  // const { fetchDashboardSummary } = useDashboard(); // Get dashboard update function

  // Ref to prevent duplicate fetches for the same account ID rapidly
  const lastFetchedAccountRef = useRef<string | null>(null);
  const fetchingAccountTxRef = useRef<boolean>(false);

  // Fetch recent transactions
  const fetchTransactions = useCallback(async (limit: number = 20) => {
    console.log('fetchTransactions called in TransactionContext, limit:', limit);
    setIsLoadingTransactions(true);
    try {
       // Decide if we should use cache or fetch fresh
       const shouldSync = await dbService.shouldSync('transactions', limit); // Modify shouldSync if needed

       if (!shouldSync) {
          const cachedTransactions = await dbService.getTransactions(limit);
          if (cachedTransactions && cachedTransactions.length > 0) {
             console.log('Using cached transactions from IndexedDB');
             setTransactions(cachedTransactions);
             setIsLoadingTransactions(false);
             return;
          }
       }

      console.log('Fetching recent transactions from API...');
      const res = await transactionsApi.getRecentTransactions(limit);
      let transactionsData: Transaction[] = [];

      if (res && res.success && Array.isArray(res.data)) {
        transactionsData = res.data;
      } else if (res && res.data && Array.isArray(res.data)) {
         transactionsData = res.data;
      } else if (Array.isArray(res)) {
        transactionsData = res;
      } else {
        console.warn('Unexpected transactions data format:', res);
      }

      if (transactionsData.length > 0) {
          await dbService.saveTransactions(transactionsData); // Bulk save
      }
      setTransactions(transactionsData);

    } catch (e) {
      console.error('Error fetching transactions:', e);
       try {
          const cachedTransactions = await dbService.getTransactions(limit);
          if (cachedTransactions && cachedTransactions.length > 0) {
             console.log('Using cached transactions as fallback:');
             setTransactions(cachedTransactions);
          } else {
            setTransactions([]);
          }
       } catch (dbError) {
          console.error('Error fetching transactions from IndexedDB fallback:', dbError);
          setTransactions([]);
       }
    } finally {
      setIsLoadingTransactions(false);
    }
  }, []);

  // Fetch transactions for a specific account
  const fetchTransactionsByAccount = useCallback(async (accountId: string) => {
    if (fetchingAccountTxRef.current && lastFetchedAccountRef.current === accountId) {
      console.log('Skipping duplicate fetch for account transactions:', accountId);
      return;
    }
    console.log('fetchTransactionsByAccount called for account:', accountId);
    fetchingAccountTxRef.current = true;
    lastFetchedAccountRef.current = accountId;
    setIsLoadingAccountTransactions(true);

    try {
      // Check cache first (implement dbService.getTransactionsByAccount if needed)
       const shouldSync = await dbService.shouldSync(`transactions_${accountId}`); // Example cache key
       if (!shouldSync) {
          const cachedAccountTransactions = await dbService.getTransactionsByAccount(accountId);
          if (cachedAccountTransactions && cachedAccountTransactions.length > 0) {
              console.log('Using cached account transactions from IndexedDB for account:', accountId);
              setTransactions(cachedAccountTransactions);
              fetchingAccountTxRef.current = false;
              setIsLoadingAccountTransactions(false);
              return;
          }
       }

      console.log('Fetching transactions for account from API:', accountId);
      const res = await transactionsApi.getTransactionsByAccount(accountId);
      let accountTransactionsData: Transaction[] = [];

      if (res && res.success && Array.isArray(res.data)) {
        accountTransactionsData = res.data;
      } else if (Array.isArray(res)) {
         accountTransactionsData = res;
      } else {
        console.warn('Unexpected account transactions data format:', res);
      }
      
      setTransactions(accountTransactionsData); // Overwrite general transactions with account-specific ones
      if (accountTransactionsData.length > 0) {
          await dbService.saveTransactionsForAccount(accountId, accountTransactionsData);
      }

    } catch (error) {
      console.error(`Error fetching transactions for account ${accountId}:`, error);
       try {
          const cachedAccountTransactions = await dbService.getTransactionsByAccount(accountId);
          if (cachedAccountTransactions && cachedAccountTransactions.length > 0) {
              console.log('Using cached account transactions as fallback for account:', accountId);
              setTransactions(cachedAccountTransactions);
          } else {
              // Decide: Clear transactions or keep potentially stale global ones?
              // setTransactions([]); 
              console.warn('No fallback transactions found for account:', accountId);
          }
       } catch (dbError) {
          console.error('Error fetching account transactions from IndexedDB fallback:', dbError);
       }
       // Maybe re-throw if the component needs to know about the error
       // throw error;
    } finally {
      // Reset fetching state after a short delay
      setTimeout(() => {
        fetchingAccountTxRef.current = false;
      }, 500); 
      setIsLoadingAccountTransactions(false);
    }
  }, []);

  // Initial fetch for recent transactions only when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions(20); // Fetch recent 20 on load
    }
  }, [fetchTransactions, isAuthenticated]);

  // Add transaction
  const addTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
    setIsLoadingTransactions(true);
    try {
      const response = await transactionsApi.createTransaction(transactionData as any);
      if (response.success && response.data) {
        const newTransaction = response.data;
        setTransactions(prev => [newTransaction, ...prev]);
        await dbService.saveTransaction(newTransaction);
        // await fetchDashboardSummary(); // Trigger dashboard update
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

  // Update transaction
  const updateTransaction = async (updatedTransaction: Transaction) => {
    setIsLoadingTransactions(true);
    try {
      const { id, ...transactionData } = updatedTransaction;
      const response = await transactionsApi.updateTransaction(id, transactionData as any);
      if (response.success) {
        setTransactions(prev => prev.map(t => t.id === id ? updatedTransaction : t));
        await dbService.saveTransaction(updatedTransaction);
        // await fetchDashboardSummary(); // Trigger dashboard update
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

  // Delete transaction
  const deleteTransaction = async (id: string) => {
    setIsLoadingTransactions(true);
    try {
      const response = await transactionsApi.deleteTransaction(id);
      if (response.success) {
        setTransactions(prev => prev.filter(t => t.id !== id));
        await dbService.deleteTransaction(id);
        // await fetchDashboardSummary(); // Trigger dashboard update
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
