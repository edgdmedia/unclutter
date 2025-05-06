import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import * as dbService from '@/services/dbService'; // Import dbService
import { Budget, Goal } from '../types'; // Use centralized types

// For debugging - log when FinanceContext is loaded
console.log('FinanceContext loaded');

// Retain Budget and Goal interfaces if they are defined here uniquely, otherwise import from types.ts
// Assuming Budget and Goal are now in types.ts

interface FinanceContextType {
  budgets: Budget[];
  goals: Goal[];
  // Add any budget/goal specific functions here if needed in the future
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [db, setDb] = useState<any>(null); // Keep DB init if needed for budgets/goals later
  
  // Initialize database when component mounts
  useEffect(() => {
    const initializeDb = async () => {
      try {
        // Assuming dbService is still needed for budgets/goals
        const database = await dbService.initDB(); 
        setDb(database);
        console.log('Database initialized successfully in FinanceProvider (for Budgets/Goals)');
      } catch (error) {
        console.error('Error initializing database in FinanceProvider:', error);
      }
    };
    
    initializeDb();
  }, []);

  // Fetch budget/goal data here if applicable
  // useEffect(() => { ... }, []);

  const value = {
    budgets,
    goals,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};