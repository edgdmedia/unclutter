import { api } from './apiClient';
import { Budget } from '../types';

// Get all budgets for a specific month and year
export const getBudgets = async (month?: number, year?: number): Promise<Budget[]> => {
  try {
    const currentDate = new Date();
    const queryMonth = month || currentDate.getMonth() + 1;
    const queryYear = year || currentDate.getFullYear();
    
    const response = await api.get(`/budgets`, {
      params: { month: queryMonth, year: queryYear }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return [];
  }
};

// Create a new budget
export const createBudget = async (budget: Omit<Budget, 'id'>): Promise<Budget | null> => {
  try {
    const response = await api.post(`/budgets`, budget);
    return response.data;
  } catch (error) {
    console.error('Error creating budget:', error);
    return null;
  }
};

// Update an existing budget
export const updateBudget = async (budget: Budget): Promise<Budget | null> => {
  try {
    const response = await api.put(`/budgets/${budget.id}`, budget);
    return response.data;
  } catch (error) {
    console.error('Error updating budget:', error);
    return null;
  }
};

// Delete a budget
export const deleteBudget = async (budgetId: string): Promise<boolean> => {
  try {
    await api.delete(`/budgets/${budgetId}`);
    return true;
  } catch (error) {
    console.error('Error deleting budget:', error);
    return false;
  }
};

// Copy budgets from previous month
export const copyBudgetsFromPreviousMonth = async (targetMonth: number, targetYear: number): Promise<Budget[]> => {
  try {
    // Calculate previous month
    let prevMonth = targetMonth - 1;
    let prevYear = targetYear;
    
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear -= 1;
    }
    
    const response = await api.post(`/budgets/copy`, {
      sourceMonth: prevMonth,
      sourceYear: prevYear,
      targetMonth,
      targetYear
    });
    
    return response.data;
  } catch (error) {
    console.error('Error copying budgets:', error);
    return [];
  }
};
