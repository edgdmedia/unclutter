import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as categoriesApi from '../services/categoriesApi';
import * as dbService from '../services/dbService';
import { Category } from '../types';
import { useAuth } from './AuthContext'; // If needed

interface CategoryContextType {
  categories: Category[];
  fetchCategories: () => Promise<void>;
  // Potential future functions: addCategory, updateCategory, deleteCategory
  isLoadingCategories: boolean;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(false);
  const { isAuthenticated } = useAuth(); // If fetching depends on auth

  const fetchCategories = useCallback(async () => {
    console.log('fetchCategories called in CategoryContext');
    setIsLoadingCategories(true);
    try {
      const shouldSync = await dbService.shouldSync('categories');
      if (!shouldSync) {
        const cachedCategories = await dbService.getCategories();
        if (cachedCategories && cachedCategories.length > 0) {
          console.log('Using cached categories from IndexedDB');
          setCategories(cachedCategories);
          setIsLoadingCategories(false);
          return;
        }
      }

      console.log('Fetching categories from API...');
      const res = await categoriesApi.getCategories();
      let categoriesData: Category[] = [];

      if (res && res.success && Array.isArray(res.data)) {
        categoriesData = res.data;
      } else if (res && res.data && Array.isArray(res.data)) {
         categoriesData = res.data;
      } else if (Array.isArray(res)) {
        categoriesData = res;
      } else {
        console.warn('Unexpected categories data format:', res);
      }

      if (categoriesData.length > 0) {
        await dbService.saveCategories(categoriesData);
      }
      setCategories(categoriesData);
    } catch (e) {
      console.error('Error fetching categories:', e);
      try {
        const cachedCategories = await dbService.getCategories();
        if (cachedCategories && cachedCategories.length > 0) {
          console.log('Using cached categories as fallback:');
          setCategories(cachedCategories);
        } else {
           setCategories([]);
        }
      } catch (dbError) {
        console.error('Error fetching categories from IndexedDB fallback:', dbError);
        setCategories([]);
      }
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  // Initial fetch only when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
    }
  }, [fetchCategories, isAuthenticated]);

  // Add functions for add/update/delete categories here if needed
  // Example:
  // const addCategory = async (categoryData) => { ... };

  const value = {
    categories,
    fetchCategories,
    isLoadingCategories,
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};
