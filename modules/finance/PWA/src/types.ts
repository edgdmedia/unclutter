import { DashboardSummary, DashboardTrends } from './services/dashboardApi';
import { Transaction } from './services/transactionsApi';
import { Category } from './services/categoriesApi'; // Assuming this is the primary Category type

// Define types based on API responses
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  institution: string;
}

// Re-exporting Transaction from services for consistency
export type { Transaction };

export interface Budget {
  id: string;
  category_id: string;
  amount: number;
  spent: number;
  period: string;
  category_name: string;
}

export interface Goal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  status: string;
}

// Re-exporting Category from services for consistency
export type { Category };

// Re-exporting Dashboard types
export type { DashboardSummary, DashboardTrends };
