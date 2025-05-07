import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as accountsApi from '../services/accountsApi';
import { Account } from '../types';
import { useAuth } from './AuthContext';
// Removed to avoid circular dependency
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
  // Removed to avoid circular dependency
  // const { fetchDashboardSummary } = useDashboard();

  // Fetch accounts - API-first approach
  const fetchAccounts = useCallback(async () => {
    console.log('fetchAccounts called in AccountContext');
    setIsLoadingAccounts(true);
    try {
      console.log('Fetching accounts from API...');
      const res = await accountsApi.getAccounts();
      if (res.success && res.data) {
        setAccounts(res.data);
        console.log('Accounts fetched successfully:', res.data.length);
      } else {
        console.warn('Failed to fetch accounts or no data returned:', res);
        setAccounts([]);
      }
    } catch (e) {
      console.error('Error fetching accounts:', e);
      setAccounts([]);
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
  
  // No need for account change events with API-first approach
  // Each component will fetch fresh data when needed

  // Add account - API-first approach
  const addAccount = async (data: Partial<Omit<Account, 'id'>>) => {
    setIsLoadingAccounts(true);
    try {
      const res = await accountsApi.createAccount(data);
      if (res.success && res.data) {
        // Add to local state
        setAccounts(prev => [res.data, ...prev]);
        // Note: Dashboard will be updated separately
        return res.data;
      } else {
        throw new Error(res.message || 'Failed to create account');
      }
    } catch (e) {
      console.error('Error adding account:', e);
      throw e; // Re-throw for component to handle
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  // Update account - API-first approach
  const updateAccount = async (id: string, data: Partial<Omit<Account, 'id'>>) => {
    setIsLoadingAccounts(true);
    try {
      const res = await accountsApi.updateAccount(id, data);
      if (res.success && res.data) {
        // Update in local state
        setAccounts(prev => prev.map(acc => acc.id === id ? res.data : acc));
        // Note: Dashboard will be updated separately
        return res.data;
      } else {
        throw new Error(res.message || 'Failed to update account');
      }
    } catch (e) {
      console.error('Error updating account:', e);
      throw e; // Re-throw
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  // Delete account - API-first approach
  const deleteAccount = async (id: string) => {
    console.log('[AccountContext] deleteAccount called with id:', id);
    setIsLoadingAccounts(true);
    try {
      console.log('[AccountContext] Calling API to delete account...');
      const response = await accountsApi.deleteAccount(id);
      console.log('[AccountContext] API response for delete account:', response);
      
      if (response.success) {
        console.log('[AccountContext] Updating local state...');
        setAccounts(prev => prev.filter(acc => acc.id !== id));
        console.log('[AccountContext] Account deletion complete');
        // Optionally: trigger a transaction refresh if you want to ensure UI is up to date
        // if (typeof window !== 'undefined' && window.dispatchEvent) {
        //   window.dispatchEvent(new CustomEvent('refreshTransactions'));
        // }
        return true;
      } else {
        console.error('[AccountContext] API returned error for delete account:', response);
        throw new Error(response.message || 'Failed to delete account');
      }
    } catch (e) {
      console.error('[AccountContext] Error deleting account:', e);
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
