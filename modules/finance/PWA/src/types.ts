import { DashboardSummary, DashboardTrends } from './services/dashboardApi';

// Define types based on API responses
export interface User {
  id: string;
  name: string;
  email: string;
}


// User profile interface
export interface UserProfile {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

// User preferences interface
export interface UserPreferences {
  currency: string;
  dateFormat: string;
  startOfMonth: string;
  language: string;
}

// User notification settings interface
export interface UserNotifications {
  emailNotifications: boolean;
  pushNotifications: boolean;
  budgetAlerts: boolean;
  goalReminders: boolean;
  weeklyReports: boolean;
}

export interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  institution: string;
  color: string;
}

export interface Transaction {
  id: string;
  profile_id?: string;
  account_id: string;
  destination_account_id?: string;
  category_id: string;
  amount: string | number;
  transaction_date: string;
  description: string | null;
  notes: string | null;
  type: string;
  created_at?: string;
  updated_at?: string;
  account_name?: string;
  category_name?: string;
  tags?: Tag[];
  attachments?: any[];
  _synced?: boolean;
  _pendingAction?: 'create' | 'update' | 'delete';
  _localId?: string;
}

export interface TransactionsResponse {
  success: boolean;
  data: Transaction[];
  pagination: {
    total: number;
    per_page: number;
    page: number;
    total_pages: number;
  };
}

// Create a new transaction - API-first approach
export interface CreateTransactionData {
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  transaction_date: string;
  category_id: number | string;
  description?: string;
  notes?: string;
  account_id: number | string;
  tags?: Tag[];
  attachments?: any[];
}

export interface Budget {
  id: string;
  category: Category;
  budgetAmount: number;
  spentAmount: number;
  month: number;
  year: number;
}

export interface Goal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  status: string;
}

export interface Category {
  id: string;
  name: string;
  type: string;
  parent_id: string;
  description: string;
  is_active: string;
  profile_id: string;
  color?: string; // HEX or CSS color string
}

export interface Tag {
  id: string;
  name: string;
  color: string; // HEX or CSS color string
  type: 'tag';
}

// Create a new category
export interface CreateCategoryData {
  name: string;
  type: 'income' | 'expense' | 'account_type' | 'tag';
  parent_id?: string | null;
  description?: string;
  is_active?: string;
  profile_id?: string;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

export interface DashboardSummary {
  total_income: number;
  total_expenses: number;
  net_balance: number;
  accounts: {
    items?: {
      id: string;
      profile_id: string;
      name: string;
      type_id: string;
      balance: string;
      description: string;
      institution: string;
      is_active: string;
      created_at: string;
      updated_at: string;
      type_name: string;
      category_type: string;
    }[];
  } | {
    id: string;
    profile_id: string;
    name: string;
    type_id: string;
    balance: string;
    description: string;
    institution: string;
    is_active: string;
    created_at: string;
    updated_at: string;
    type_name: string;
    category_type: string;
  }[];
  budgets?: any[];
  goals?: any[];
}

export interface DashboardTrends {
  labels: string[];
  income: number[];
  expenses: number[];
}
