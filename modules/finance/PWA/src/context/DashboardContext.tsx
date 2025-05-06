import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as dashboardApi from '../services/dashboardApi';
// Removed for API-first approach
// import * as dbService from '../services/dbService';
import { DashboardSummary, DashboardTrends } from '../types';
import { useAuth } from './AuthContext'; // If needed

interface DashboardContextType {
  dashboardSummary: DashboardSummary | null;
  dashboardTrends: DashboardTrends | null;
  fetchDashboardSummary: () => Promise<void>;
  fetchDashboardTrends: () => Promise<void>;
  isLoadingSummary: boolean;
  isLoadingTrends: boolean;
  // Expose a way to calculate financial summary if needed outside context
  getFinancialSummary: () => { totalBalance: number; income: number; expenses: number; savings: number }; 
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null);
  const [dashboardTrends, setDashboardTrends] = useState<DashboardTrends | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(false);
  const [isLoadingTrends, setIsLoadingTrends] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();

  // Fetch dashboard summary - API-first approach
  const fetchDashboardSummary = useCallback(async () => {
    console.log('fetchDashboardSummary called in DashboardContext');
    setIsLoadingSummary(true);
    try {
      const res = await dashboardApi.getDashboardSummary();
      if (res.success && res.data) {
        setDashboardSummary(res.data);
      } else {
        setDashboardSummary(null); // Clear on failure or no data
        console.warn('Failed to fetch dashboard summary or no data returned:', res);
      }
    } catch (e) {
      console.error('Error fetching dashboard summary:', e);
      setDashboardSummary(null); // Clear on error
    } finally {
      setIsLoadingSummary(false);
    }
  }, []);

  // Fetch dashboard trends - API-first approach
  const fetchDashboardTrends = useCallback(async () => {
    console.log('fetchDashboardTrends called in DashboardContext');
    setIsLoadingTrends(true);
    try {
      const res = await dashboardApi.getDashboardTrends();
      if (res.success && res.data) {
        setDashboardTrends(res.data);
      } else {
        setDashboardTrends(null); // Clear on failure or no data
        console.warn('Failed to fetch dashboard trends or no data returned:', res);
      }
    } catch (e) {
      console.error('Error fetching dashboard trends:', e);
      setDashboardTrends(null); // Clear on error
    } finally {
      setIsLoadingTrends(false);
    }
  }, []);

  // Initial fetch for both summary and trends only when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardSummary();
      fetchDashboardTrends();
    }
  }, [fetchDashboardSummary, fetchDashboardTrends, isAuthenticated]);
  
    // Calculate financial summary derived state
    const getFinancialSummary = useCallback(() => {
        return {
            totalBalance: dashboardSummary?.net_balance || 0,
            income: dashboardSummary?.total_income || 0,
            expenses: dashboardSummary?.total_expenses || 0,
            savings: dashboardSummary ? (dashboardSummary.total_income - dashboardSummary.total_expenses) : 0
        };
    }, [dashboardSummary]);

  const value = {
    dashboardSummary,
    dashboardTrends,
    fetchDashboardSummary,
    fetchDashboardTrends,
    isLoadingSummary,
    isLoadingTrends,
    getFinancialSummary
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
