import { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@services/supabase';

export interface BudgetItem {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  paid: boolean;
  vendor?: string;
}

interface BudgetContextType {
  budgetItems: BudgetItem[];
  totalBudget: number;
  loading: boolean;
  error: string | null;
  addBudgetItem: (item: Omit<BudgetItem, 'id'>) => Promise<void>;
  updateBudgetItem: (id: string, updates: Partial<BudgetItem>) => Promise<void>;
  deleteBudgetItem: (id: string) => Promise<void>;
  setTotalBudget: (amount: number) => Promise<void>;
  getTotalSpent: () => number;
  getRemainingBudget: () => number;
}

export const BudgetContext = createContext<BudgetContextType>({
  budgetItems: [],
  totalBudget: 0,
  loading: true,
  error: null,
  addBudgetItem: async () => {},
  updateBudgetItem: async () => {},
  deleteBudgetItem: async () => {},
  setTotalBudget: async () => {},
  getTotalSpent: () => 0,
  getRemainingBudget: () => 0,
});

interface BudgetProviderProps {
  children: ReactNode;
  weddingId: string;
}

export const BudgetProvider = ({ children, weddingId }: BudgetProviderProps) => {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [totalBudget, setTotalBudgetState] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch budget items
        const { data: budgetData, error: budgetError } = await supabase
          .from('budget_items')
          .select('*')
          .eq('wedding_id', weddingId);
          
        if (budgetError) throw budgetError;
        
        // Fetch wedding settings for total budget
        const { data: weddingData, error: weddingError } = await supabase
          .from('weddings')
          .select('total_budget')
          .eq('id', weddingId)
          .single();
          
        if (weddingError) throw weddingError;
        
        setBudgetItems(budgetData.map(item => ({
          id: item.id,
          category: item.category,
          description: item.description,
          amount: item.amount,
          date: item.date,
          paid: item.paid,
          vendor: item.vendor
        })));
        
        setTotalBudgetState(weddingData.total_budget || 0);
      } catch (err) {
        console.error('Error fetching budget data:', err);
        setError('Failed to load budget data');
      } finally {
        setLoading(false);
      }
    };
    
    if (weddingId) {
      fetchData();
    }
  }, [weddingId]);

  const addBudgetItem = async (item: Omit<BudgetItem, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('budget_items')
        .insert([{
          wedding_id: weddingId,
          category: item.category,
          description: item.description,
          amount: item.amount,
          date: item.date,
          paid: item.paid,
          vendor: item.vendor
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      setBudgetItems(prev => [...prev, {
        id: data.id,
        category: data.category,
        description: data.description,
        amount: data.amount,
        date: data.date,
        paid: data.paid,
        vendor: data.vendor
      }]);
    } catch (err) {
      console.error('Error adding budget item:', err);
      setError('Failed to add budget item');
    }
  };

  const updateBudgetItem = async (id: string, updates: Partial<BudgetItem>) => {
    try {
      const { error } = await supabase
        .from('budget_items')
        .update({
          category: updates.category,
          description: updates.description,
          amount: updates.amount,
          date: updates.date,
          paid: updates.paid,
          vendor: updates.vendor
        })
        .eq('id', id);
        
      if (error) throw error;
      
      setBudgetItems(prev => prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ));
    } catch (err) {
      console.error('Error updating budget item:', err);
      setError('Failed to update budget item');
    }
  };

  const deleteBudgetItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('budget_items')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setBudgetItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting budget item:', err);
      setError('Failed to delete budget item');
    }
  };

  const setTotalBudget = async (amount: number) => {
    try {
      const { error } = await supabase
        .from('weddings')
        .update({ total_budget: amount })
        .eq('id', weddingId);
        
      if (error) throw error;
      
      setTotalBudgetState(amount);
    } catch (err) {
      console.error('Error setting total budget:', err);
      setError('Failed to set total budget');
    }
  };

  const getTotalSpent = () => {
    return budgetItems.reduce((total, item) => total + item.amount, 0);
  };

  const getRemainingBudget = () => {
    return totalBudget - getTotalSpent();
  };

  return (
    <BudgetContext.Provider
      value={{
        budgetItems,
        totalBudget,
        loading,
        error,
        addBudgetItem,
        updateBudgetItem,
        deleteBudgetItem,
        setTotalBudget,
        getTotalSpent,
        getRemainingBudget,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};
