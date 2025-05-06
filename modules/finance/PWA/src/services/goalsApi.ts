import { api } from './apiClient';
import { Goal } from '../types';

// Get all goals
export const getGoals = async (): Promise<Goal[]> => {
  try {
    const response = await api.get('/goals');
    return response.data;
  } catch (error) {
    console.error('Error fetching goals:', error);
    return [];
  }
};

// Create a new goal
export const createGoal = async (goal: Omit<Goal, 'id'>): Promise<Goal | null> => {
  try {
    const response = await api.post('/goals', goal);
    return response.data;
  } catch (error) {
    console.error('Error creating goal:', error);
    return null;
  }
};

// Update an existing goal
export const updateGoal = async (goal: Goal): Promise<Goal | null> => {
  try {
    const response = await api.put(`/goals/${goal.id}`, goal);
    return response.data;
  } catch (error) {
    console.error('Error updating goal:', error);
    return null;
  }
};

// Delete a goal
export const deleteGoal = async (goalId: string): Promise<boolean> => {
  try {
    await api.delete(`/goals/${goalId}`);
    return true;
  } catch (error) {
    console.error('Error deleting goal:', error);
    return false;
  }
};

// Get goal details
export const getGoalDetails = async (goalId: string): Promise<Goal | null> => {
  try {
    const response = await api.get(`/goals/${goalId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching goal ${goalId}:`, error);
    return null;
  }
};
