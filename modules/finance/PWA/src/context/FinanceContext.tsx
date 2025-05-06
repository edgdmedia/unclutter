import React from 'react';
import { BudgetProvider, useBudgets } from './BudgetContext';
import { GoalProvider, useGoals } from './GoalContext';

// For debugging - log when FinanceContext is loaded
console.log('FinanceContext loaded - Now a wrapper for BudgetProvider and GoalProvider');

/**
 * FinanceProvider is now a wrapper component that provides both BudgetContext and GoalContext
 * This maintains backward compatibility while allowing for more granular context usage
 */
export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BudgetProvider>
      <GoalProvider>
        {children}
      </GoalProvider>
    </BudgetProvider>
  );
};

/**
 * useFinance hook combines the functionality of useBudgets and useGoals
 * This maintains backward compatibility while we transition to more specific hooks
 */
export const useFinance = () => {
  const budgetContext = useBudgets();
  const goalContext = useGoals();
  
  // Combine both contexts to maintain the original interface
  return {
    ...budgetContext,
    ...goalContext,
    // Override any conflicting properties if needed
    isLoading: budgetContext.isLoading || goalContext.isLoading,
  };
};