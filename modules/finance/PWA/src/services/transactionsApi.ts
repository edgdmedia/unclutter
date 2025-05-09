import { api } from './apiClient';
import { CreateTransactionData } from '../types';

// Get recent transactions (default to 5) - API-first approach
export const getRecentTransactions = async (limit: number = 5) => {
  try {
    console.log(`Fetching ${limit} recent transactions from API`);
    const res = await api.get('/transactions', {
      params: {
        per_page: limit,
        page: 1,
        order: 'desc',
        order_by: 'transaction_date'
      }
    });
    
    console.log('API Response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error getting recent transactions:', error);
    throw error;
  }
};

// Get transaction by ID - API-first approach
export const getTransaction = async (id: string) => {
  try {
    console.log(`Fetching transaction ${id} from API`);
    const res = await api.get(`/transactions/${id}`);
    console.log('API Response:', res.data);
    return res.data;
  } catch (error) {
    console.error(`Error getting transaction ${id}:`, error);
    throw error;
  }
};

// Get transactions for a specific account - API-first approach
export const getAccountTransactions = async (accountId: string) => {
  try {
    console.log(`Fetching transactions for account ${accountId} from API`);
    const res = await api.get('/transactions', {
      params: {
        account_id: accountId,
        per_page: 100, // Get more transactions for accounts
        page: 1,
        order: 'desc',
        order_by: 'transaction_date'
      }
    });
    
    console.log('API Response:', res.data);
    return res.data;
  } catch (error) {
    console.error(`Error getting transactions for account ${accountId}:`, error);
    throw error;
  }
};



export const createTransaction = async (data: CreateTransactionData) => {
  try {
    console.log('Creating transaction via API:', data);
    const res = await api.post('/transactions', data);
    console.log('API Response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

// Update a transaction - API-first approach
export const updateTransaction = async (id: string, data: Partial<CreateTransactionData>) => {
  try {
    console.log(`Updating transaction ${id} via API:`, data);
    const res = await api.put(`/transactions/${id}`, data);
    console.log('API Response:', res.data);
    return res.data;
  } catch (error) {
    console.error(`Error updating transaction ${id}:`, error);
    throw error;
  }
};

// Delete a transaction - API-first approach
export const deleteTransaction = async (id: string) => {
  try {
    console.log(`Deleting transaction ${id} via API`);
    const res = await api.delete(`/transactions/${id}`);
    console.log('API Response:', res.data);
    return res.data;
  } catch (error) {
    console.error(`Error deleting transaction ${id}:`, error);
    throw error;
  }
};
