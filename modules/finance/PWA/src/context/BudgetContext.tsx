import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as budgetsApi from '../services/budgetsApi';
import { Budget } from '../types';
import { useAuth } from './AuthContext';

interface BudgetContextType {
  budgets: Budget[];
  isLoading: boolean;
  fetchBudgets: (month?: number, year?: number) => Promise<void>;
  createBudget: (budget: Omit<Budget, 'id'>) => Promise<Budget | null>;
  updateBudget: (budget: Budget) => Promise<Budget | null>;
  deleteBudget: (budgetId: string) => Promise<boolean>;
  copyBudgetsFromPreviousMonth: (targetMonth: number, targetYear: number) => Promise<void>;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();
  
  const fetchBudgets = useCallback(async (month?: number, year?: number) => {
    setIsLoading(true);
    try {
      const data = await budgetsApi.getBudgets(month, year);
      setBudgets(data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createBudget = async (budget: Omit<Budget, 'id'>) => {
    const newBudget = await budgetsApi.createBudget(budget);
    if (newBudget) {
      setBudgets(prev => [...prev, newBudget]);
    }
    return newBudget;
  };

  const updateBudget = async (budget: Budget) => {
    const updatedBudget = await budgetsApi.updateBudget(budget);
    if (updatedBudget) {
      setBudgets(prev => prev.map(b => b.id === updatedBudget.id ? updatedBudget : b));
    }
    return updatedBudget;
  };

  const deleteBudget = async (budgetId: string) => {
    const success = await budgetsApi.deleteBudget(budgetId);
    if (success) {
      setBudgets(prev => prev.filter(b => b.id !== budgetId));
    }
    return success;
  };

  const copyBudgetsFromPreviousMonth = async (targetMonth: number, targetYear: number) => {
    const newBudgets = await budgetsApi.copyBudgetsFromPreviousMonth(targetMonth, targetYear);
    if (newBudgets.length > 0) {
      setBudgets(newBudgets);
    }
  };

  // Fetch initial budget data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchBudgets();
    }
  }, [fetchBudgets, isAuthenticated]);

  const value = {
    budgets,
    isLoading,
    fetchBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
    copyBudgetsFromPreviousMonth,
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudgets = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudgets must be used within a BudgetProvider');
  }
  return context;
};
