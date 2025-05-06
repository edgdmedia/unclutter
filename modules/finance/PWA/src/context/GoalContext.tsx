import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as goalsApi from '../services/goalsApi';
import { Goal } from '../types';
import { useAuth } from './AuthContext';

interface GoalContextType {
  goals: Goal[];
  isLoading: boolean;
  fetchGoals: () => Promise<void>;
  createGoal: (goal: Omit<Goal, 'id'>) => Promise<Goal | null>;
  updateGoal: (goal: Goal) => Promise<Goal | null>;
  deleteGoal: (goalId: string) => Promise<boolean>;
  getGoalDetails: (goalId: string) => Promise<Goal | null>;
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();
  
  const fetchGoals = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await goalsApi.getGoals();
      setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createGoal = async (goal: Omit<Goal, 'id'>) => {
    const newGoal = await goalsApi.createGoal(goal);
    if (newGoal) {
      setGoals(prev => [...prev, newGoal]);
    }
    return newGoal;
  };

  const updateGoal = async (goal: Goal) => {
    const updatedGoal = await goalsApi.updateGoal(goal);
    if (updatedGoal) {
      setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
    }
    return updatedGoal;
  };

  const deleteGoal = async (goalId: string) => {
    const success = await goalsApi.deleteGoal(goalId);
    if (success) {
      setGoals(prev => prev.filter(g => g.id !== goalId));
    }
    return success;
  };

  const getGoalDetails = async (goalId: string) => {
    return await goalsApi.getGoalDetails(goalId);
  };

  // Fetch initial goal data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchGoals();
    }
  }, [fetchGoals, isAuthenticated]);

  const value = {
    goals,
    isLoading,
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    getGoalDetails
  };

  return (
    <GoalContext.Provider value={value}>
      {children}
    </GoalContext.Provider>
  );
};

export const useGoals = () => {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalProvider');
  }
  return context;
};
