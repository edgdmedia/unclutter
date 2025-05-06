import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as accountsApi from '../services/accountsApi';
import * as dbService from '../services/dbService';
import { Account } from '../types';
// Import useAuth to check authentication status if needed, though fetching might be triggered externally
import { useAuth } from './AuthContext'; 
// Import a potential DashboardContext hook if needed for triggering updates
// import { useDashboard } from './DashboardContext'; 

interface AccountContextType {
  accounts: Account[];
  fetchAccounts: () => Promise<void>;
  addAccount: (data: Partial<Omit<Account, 'id'>>) => Promise<Account | undefined>; // Return the new account
  updateAccount: (id: string, data: Partial<Account>) => Promise<Account | undefined>; // Return the updated account
  deleteAccount: (id: string) => Promise<void>;
  getAccount: (id: string) => Promise<Account | null>; // Keep this for detail views
  isLoadingAccounts: boolean;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState<boolean>(false);
  const { isAuthenticated } = useAuth(); // Get auth status
  // const { fetchDashboardSummary } = useDashboard(); // Get dashboard update function

  // Fetch accounts from API with IndexedDB caching
  const fetchAccounts = useCallback(async () => {
    console.log('fetchAccounts called in AccountContext');
    setIsLoadingAccounts(true);
    try {
      const shouldSync = await dbService.shouldSync('accounts');
      if (!shouldSync) {
        const cachedAccounts = await dbService.getAccounts();
        if (cachedAccounts && cachedAccounts.length > 0) {
          console.log('Using cached accounts from IndexedDB');
          setAccounts(cachedAccounts);
          setIsLoadingAccounts(false);
          return;
        }
      }

      console.log('Fetching accounts from API...');
      const res = await accountsApi.getAccounts();
      let accountsData: Account[] = [];

      if (res && res.success && Array.isArray(res.data)) {
        accountsData = res.data;
      } else if (res && res.data && Array.isArray(res.data)) {
        accountsData = res.data;
      } else if (Array.isArray(res)) {
        accountsData = res;
      } else {
        console.warn('Unexpected accounts data format:', res);
      }

      if (accountsData.length > 0) {
        await dbService.saveAccounts(accountsData);
      }
      setAccounts(accountsData);
    } catch (e) {
      console.error('Error fetching accounts:', e);
      try {
        const cachedAccounts = await dbService.getAccounts();
        if (cachedAccounts && cachedAccounts.length > 0) {
          console.log('Using cached accounts as fallback:');
          setAccounts(cachedAccounts);
        } else {
          setAccounts([]);
        }
      } catch (dbError) {
        console.error('Error fetching accounts from IndexedDB fallback:', dbError);
        setAccounts([]);
      }
    } finally {
      setIsLoadingAccounts(false);
    }
  }, []); // No dependencies needed if fetch isn't conditional on auth here

  // Fetch accounts only when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('[AccountContext] Authenticated, fetching accounts...');
      fetchAccounts();
    }
  }, [isAuthenticated, fetchAccounts]);

  // Add account
  const addAccount = async (data: Partial<Omit<Account, 'id'>>) => {
    setIsLoadingAccounts(true);
    try {
      const response = await accountsApi.createAccount(data);
      if (response && response.success && response.account) {
        const newAccount = response.account;
        setAccounts(prev => [...prev, newAccount]);
        await dbService.saveAccount(newAccount);
        // await fetchDashboardSummary(); // Trigger dashboard update if needed
        return newAccount;
      } else {
        console.error('Failed to add account:', response);
        throw new Error(response?.message || 'Failed to add account');
      }
    } catch (e) {
      console.error('Error adding account:', e);
      throw e; // Re-throw
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  // Update account
  const updateAccount = async (id: string, data: Partial<Account>) => {
    setIsLoadingAccounts(true);
    try {
      const response = await accountsApi.updateAccount(id, data);
      if (response && response.success && response.account) {
        const updatedAccount = response.account;
        setAccounts(prev => prev.map(acc => acc.id === id ? updatedAccount : acc));
        await dbService.saveAccount(updatedAccount);
        // await fetchDashboardSummary(); // Trigger dashboard update
        return updatedAccount;
      } else {
        console.error('Failed to update account:', response);
        throw new Error(response?.message || 'Failed to update account');
      }
    } catch (e) {
      console.error('Error updating account:', e);
      throw e; // Re-throw
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  // Delete account
  const deleteAccount = async (id: string) => {
    setIsLoadingAccounts(true);
    try {
      await accountsApi.deleteAccount(id);
      setAccounts(prev => prev.filter(acc => acc.id !== id));
      await dbService.deleteAccount(id);
      // await fetchDashboardSummary(); // Trigger dashboard update
    } catch (e) {
      console.error('Error deleting account:', e);
      throw e; // Re-throw
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  // Get single account (likely unchanged)
  const getAccount = async (id: string): Promise<Account | null> => {
    // Check local state first?
    const localAccount = accounts.find(acc => acc.id === id);
    if (localAccount) return localAccount;
    
    // Then check DB?
    try {
       const dbAccount = await dbService.getAccount(id);
       if(dbAccount) return dbAccount;
    } catch(e) {
        console.error('Error fetching account from DB', e)
    }

    // Fallback to API
    try {
      const res = await accountsApi.getAccount(id);
      return res.data || null;
    } catch (e) {
      console.error('Error fetching account from API:', e);
      return null;
    }
  };

  const value = {
    accounts,
    fetchAccounts,
    addAccount,
    updateAccount,
    deleteAccount,
    getAccount,
    isLoadingAccounts
  };

  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccounts = () => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccounts must be used within an AccountProvider');
  }
  return context;
};
