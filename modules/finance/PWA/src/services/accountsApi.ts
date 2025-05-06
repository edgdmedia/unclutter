import { api } from './apiClient';

export const getAccounts = async () => {
  const res = await api.get('/accounts');
  return res.data;
};

export const getAccount = async (id: string) => {
  const res = await api.get(`/accounts/${id}`);
  return res.data;
};

export const createAccount = async (data: any) => {
  const res = await api.post('/accounts', data);
  return res.data;
};

export const updateAccount = async (id: string, data: any) => {
  const res = await api.put(`/accounts/${id}`, data);
  return res.data;
};

export const deleteAccount = async (id: string) => {
  console.log('[accountsApi] Deleting account with ID:', id);
  try {
    const res = await api.delete(`/accounts/${id}`);
    console.log('[accountsApi] Delete account API response:', res.data);
    return res.data;
  } catch (error) {
    console.error('[accountsApi] Error in deleteAccount API call:', error);
    console.log('[accountsApi] Error response:', error.response?.data);
    throw error;
  }
};

export const getAccountBalanceHistory = async (
  id: string,
  params: { start_date: string; end_date: string }
) => {
  const res = await api.get(`/accounts/${id}/balance-history`, { params });
  return res.data;
};

export const searchAccounts = async (search: string) => {
  const res = await api.get(`/accounts/search`, { params: { search } });
  return res.data;
};

export const getAccountTransactions = async (
  account_id: string,
  params: { start_date: string; end_date: string; per_page?: number; page?: number; order?: string; order_by?: string }
) => {
  const res = await api.get(`/transactions`, {
    params: { account_id, ...params },
  });
  return res.data;
};
