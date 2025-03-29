'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from './supabase';
import * as mockData from './mock-data';

// Define the data context type
interface DataContextType {
  // Guest management
  guests: mockData.Guest[];
  loadGuests: () => Promise<void>;
  addGuest: (guest: Omit<mockData.Guest, "id">) => Promise<mockData.Guest>;
  updateGuest: (id: string, updates: Partial<mockData.Guest>) => Promise<mockData.Guest>;
  deleteGuest: (id: string) => Promise<void>;
  
  // Table management
  tables: mockData.Table[];
  loadTables: () => Promise<void>;
  addTable: (table: Omit<mockData.Table, "id">) => Promise<mockData.Table>;
  updateTable: (id: string, updates: Partial<mockData.Table>) => Promise<mockData.Table>;
  deleteTable: (id: string) => Promise<void>;
  
  // Budget management
  budgetItems: mockData.BudgetItem[];
  loadBudgetItems: () => Promise<void>;
  addBudgetItem: (item: Omit<mockData.BudgetItem, "id">) => Promise<mockData.BudgetItem>;
  updateBudgetItem: (id: string, updates: Partial<mockData.BudgetItem>) => Promise<mockData.BudgetItem>;
  deleteBudgetItem: (id: string) => Promise<void>;
  
  // Budget summary
  budgetSummary: { total: number; spent: number; remaining: number };
  loadBudgetSummary: () => Promise<void>;
  
  // Status
  loading: boolean;
  error: string | null;
  isStaticMode: boolean;
}

// Create the context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Provider component
export function DataProvider({ children }: { children: ReactNode }) {
  // State for data
  const [guests, setGuests] = useState<mockData.Guest[]>([]);
  const [tables, setTables] = useState<mockData.Table[]>([]);
  const [budgetItems, setBudgetItems] = useState<mockData.BudgetItem[]>([]);
  const [budgetSummary, setBudgetSummary] = useState({ total: 0, spent: 0, remaining: 0 });
  
  // Status state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStaticMode, setIsStaticMode] = useState(false);

  // Determine if we should use static mode
  useEffect(() => {
    const checkStaticMode = async () => {
      try {
        // Try to connect to Supabase
        const { data, error } = await supabase.from('guests').select('count');
        
        // If there's an error or we're in a static export, use static mode
        if (error || typeof window !== 'undefined' && window.location.hostname.includes('netlify')) {
          console.log('Using static mode due to:', error?.message || 'Netlify deployment');
          setIsStaticMode(true);
        } else {
          console.log('Using Supabase connection');
          setIsStaticMode(false);
        }
      } catch (err) {
        console.error('Error checking connection:', err);
        setIsStaticMode(true);
      }
    };
    
    checkStaticMode();
  }, []);

  // Guest management functions
  const loadGuests = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (isStaticMode) {
        // Use mock data in static mode
        const data = await mockData.getGuests();
        setGuests(data);
      } else {
        // Use Supabase in connected mode
        const { data, error } = await supabase.from('guests').select('*');
        
        if (error) throw error;
        setGuests(data || []);
      }
    } catch (err: any) {
      console.error('Error loading guests:', err);
      setError(err.message || 'Failed to load guests');
      
      // Fallback to mock data on error
      const data = await mockData.getGuests();
      setGuests(data);
    } finally {
      setLoading(false);
    }
  };
  
  const addGuest = async (guest: Omit<mockData.Guest, "id">) => {
    setLoading(true);
    setError(null);
    
    try {
      if (isStaticMode) {
        // Use mock data in static mode
        const newGuest = await mockData.addGuest(guest);
        setGuests([...guests, newGuest]);
        return newGuest;
      } else {
        // Use Supabase in connected mode
        const { data, error } = await supabase.from('guests').insert(guest).select().single();
        
        if (error) throw error;
        if (data) {
          setGuests([...guests, data]);
          return data as mockData.Guest;
        }
        throw new Error('Failed to add guest');
      }
    } catch (err: any) {
      console.error('Error adding guest:', err);
      setError(err.message || 'Failed to add guest');
      
      // Fallback to mock data on error
      const newGuest = await mockData.addGuest(guest);
      setGuests([...guests, newGuest]);
      return newGuest;
    } finally {
      setLoading(false);
    }
  };
  
  const updateGuest = async (id: string, updates: Partial<mockData.Guest>) => {
    setLoading(true);
    setError(null);
    
    try {
      if (isStaticMode) {
        // Use mock data in static mode
        const updatedGuest = await mockData.updateGuest(id, updates);
        setGuests(guests.map(g => g.id === id ? updatedGuest : g));
        return updatedGuest;
      } else {
        // Use Supabase in connected mode
        const { data, error } = await supabase.from('guests').update(updates).eq('id', id).select().single();
        
        if (error) throw error;
        if (data) {
          setGuests(guests.map(g => g.id === id ? data as mockData.Guest : g));
          return data as mockData.Guest;
        }
        throw new Error('Failed to update guest');
      }
    } catch (err: any) {
      console.error('Error updating guest:', err);
      setError(err.message || 'Failed to update guest');
      
      // Fallback to mock data on error
      const updatedGuest = await mockData.updateGuest(id, updates);
      setGuests(guests.map(g => g.id === id ? updatedGuest : g));
      return updatedGuest;
    } finally {
      setLoading(false);
    }
  };
  
  const deleteGuest = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      if (isStaticMode) {
        // Use mock data in static mode
        await mockData.deleteGuest(id);
        setGuests(guests.filter(g => g.id !== id));
      } else {
        // Use Supabase in connected mode
        const { error } = await supabase.from('guests').delete().eq('id', id);
        
        if (error) throw error;
        setGuests(guests.filter(g => g.id !== id));
      }
    } catch (err: any) {
      console.error('Error deleting guest:', err);
      setError(err.message || 'Failed to delete guest');
      
      // Fallback to mock data on error
      await mockData.deleteGuest(id);
      setGuests(guests.filter(g => g.id !== id));
    } finally {
      setLoading(false);
    }
  };

  // Table management functions
  const loadTables = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (isStaticMode) {
        // Use mock data in static mode
        const data = await mockData.getTables();
        setTables(data);
      } else {
        // Use Supabase in connected mode
        const { data, error } = await supabase.from('tables').select('*');
        
        if (error) throw error;
        setTables(data || []);
      }
    } catch (err: any) {
      console.error('Error loading tables:', err);
      setError(err.message || 'Failed to load tables');
      
      // Fallback to mock data on error
      const data = await mockData.getTables();
      setTables(data);
    } finally {
      setLoading(false);
    }
  };
  
  const addTable = async (table: Omit<mockData.Table, "id">) => {
    setLoading(true);
    setError(null);
    
    try {
      if (isStaticMode) {
        // Use mock data in static mode
        const newTable = await mockData.addTable(table);
        setTables([...tables, newTable]);
        return newTable;
      } else {
        // Use Supabase in connected mode
        const { data, error } = await supabase.from('tables').insert(table).select().single();
        
        if (error) throw error;
        if (data) {
          setTables([...tables, data]);
          return data as mockData.Table;
        }
        throw new Error('Failed to add table');
      }
    } catch (err: any) {
      console.error('Error adding table:', err);
      setError(err.message || 'Failed to add table');
      
      // Fallback to mock data on error
      const newTable = await mockData.addTable(table);
      setTables([...tables, newTable]);
      return newTable;
    } finally {
      setLoading(false);
    }
  };
  
  const updateTable = async (id: string, updates: Partial<mockData.Table>) => {
    setLoading(true);
    setError(null);
    
    try {
      if (isStaticMode) {
        // Use mock data in static mode
        const updatedTable = await mockData.updateTable(id, updates);
        setTables(tables.map(t => t.id === id ? updatedTable : t));
        return updatedTable;
      } else {
        // Use Supabase in connected mode
        const { data, error } = await supabase.from('tables').update(updates).eq('id', id).select().single();
        
        if (error) throw error;
        if (data) {
          setTables(tables.map(t => t.id === id ? data as mockData.Table : t));
          return data as mockData.Table;
        }
        throw new Error('Failed to update table');
      }
    } catch (err: any) {
      console.error('Error updating table:', err);
      setError(err.message || 'Failed to update table');
      
      // Fallback to mock data on error
      const updatedTable = await mockData.updateTable(id, updates);
      setTables(tables.map(t => t.id === id ? updatedTable : t));
      return updatedTable;
    } finally {
      setLoading(false);
    }
  };
  
  const deleteTable = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      if (isStaticMode) {
        // Use mock data in static mode
        await mockData.deleteTable(id);
        setTables(tables.filter(t => t.id !== id));
      } else {
        // Use Supabase in connected mode
        const { error } = await supabase.from('tables').delete().eq('id', id);
        
        if (error) throw error;
        setTables(tables.filter(t => t.id !== id));
      }
    } catch (err: any) {
      console.error('Error deleting table:', err);
      setError(err.message || 'Failed to delete table');
      
      // Fallback to mock data on error
      await mockData.deleteTable(id);
      setTables(tables.filter(t => t.id !== id));
    } finally {
      setLoading(false);
    }
  };

  // Budget management functions
  const loadBudgetItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (isStaticMode) {
        // Use mock data in static mode
        const data = await mockData.getBudgetItems();
        setBudgetItems(data);
      } else {
        // Use Supabase in connected mode
        const { data, error } = await supabase.from('budget_items').select('*');
        
        if (error) throw error;
        setBudgetItems(data || []);
      }
    } catch (err: any) {
      console.error('Error loading budget items:', err);
      setError(err.message || 'Failed to load budget items');
      
      // Fallback to mock data on error
      const data = await mockData.getBudgetItems();
      setBudgetItems(data);
    } finally {
      setLoading(false);
    }
  };
  
  const addBudgetItem = async (item: Omit<mockData.BudgetItem, "id">) => {
    setLoading(true);
    setError(null);
    
    try {
      if (isStaticMode) {
        // Use mock data in static mode
        const newItem = await mockData.addBudgetItem(item);
        setBudgetItems([...budgetItems, newItem]);
        return newItem;
      } else {
        // Use Supabase in connected mode
        const { data, error } = await supabase.from('budget_items').insert(item).select().single();
        
        if (error) throw error;
        if (data) {
          setBudgetItems([...budgetItems, data]);
          return data as mockData.BudgetItem;
        }
        throw new Error('Failed to add budget item');
      }
    } catch (err: any) {
      console.error('Error adding budget item:', err);
      setError(err.message || 'Failed to add budget item');
      
      // Fallback to mock data on error
      const newItem = await mockData.addBudgetItem(item);
      setBudgetItems([...budgetItems, newItem]);
      return newItem;
    } finally {
      setLoading(false);
    }
  };
  
  const updateBudgetItem = async (id: string, updates: Partial<mockData.BudgetItem>) => {
    setLoading(true);
    setError(null);
    
    try {
      if (isStaticMode) {
        // Use mock data in static mode
        const updatedItem = await mockData.updateBudgetItem(id, updates);
        setBudgetItems(budgetItems.map(i => i.id === id ? updatedItem : i));
        return updatedItem;
      } else {
        // Use Supabase in connected mode
        const { data, error } = await supabase.from('budget_items').update(updates).eq('id', id).select().single();
        
        if (error) throw error;
        if (data) {
          setBudgetItems(budgetItems.map(i => i.id === id ? data as mockData.BudgetItem : i));
          return data as mockData.BudgetItem;
        }
        throw new Error('Failed to update budget item');
      }
    } catch (err: any) {
      console.error('Error updating budget item:', err);
      setError(err.message || 'Failed to update budget item');
      
      // Fallback to mock data on error
      const updatedItem = await mockData.updateBudgetItem(id, updates);
      setBudgetItems(budgetItems.map(i => i.id === id ? updatedItem : i));
      return updatedItem;
    } finally {
      setLoading(false);
    }
  };
  
  const deleteBudgetItem = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      if (isStaticMode) {
        // Use mock data in static mode
        await mockData.deleteBudgetItem(id);
        setBudgetItems(budgetItems.filter(i => i.id !== id));
      } else {
        // Use Supabase in connected mode
        const { error } = await supabase.from('budget_items').delete().eq('id', id);
        
        if (error) throw error;
        setBudgetItems(budgetItems.filter(i => i.id !== id));
      }
    } catch (err: any) {
      console.error('Error deleting budget item:', err);
      setError(err.message || 'Failed to delete budget item');
      
      // Fallback to mock data on error
      await mockData.deleteBudgetItem(id);
      setBudgetItems(budgetItems.filter(i => i.id !== id));
    } finally {
      setLoading(false);
    }
  };

  // Budget summary function
  const loadBudgetSummary = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (isStaticMode) {
        // Use mock data in static mode
        const summary = await mockData.getBudgetSummary();
        setBudgetSummary(summary);
      } else {
        // Use Supabase in connected mode
        // This would typically be a more complex query or a stored procedure
        // For simplicity, we'll calculate it from the budget items
        const { data, error } = await supabase.from('budget_items').select('*');
        
        if (error) throw error;
        
        if (data) {
          const total = data.reduce((sum, item) => sum + (item.estimatedCost || 0), 0);
          const spent = data.reduce((sum, item) => sum + (item.actualCost || 0), 0);
          
          setBudgetSummary({
            total,
            spent,
            remaining: total - spent
          });
        }
      }
    } catch (err: any) {
      console.error('Error loading budget summary:', err);
      setError(err.message || 'Failed to load budget summary');
      
      // Fallback to mock data on error
      const summary = await mockData.getBudgetSummary();
      setBudgetSummary(summary);
    } finally {
      setLoading(false);
    }
  };

  // Provide the context value
  const contextValue: DataContextType = {
    // Guest management
    guests,
    loadGuests,
    addGuest,
    updateGuest,
    deleteGuest,
    
    // Table management
    tables,
    loadTables,
    addTable,
    updateTable,
    deleteTable,
    
    // Budget management
    budgetItems,
    loadBudgetItems,
    addBudgetItem,
    updateBudgetItem,
    deleteBudgetItem,
    
    // Budget summary
    budgetSummary,
    loadBudgetSummary,
    
    // Status
    loading,
    error,
    isStaticMode
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
}

// Custom hook to use the data context
export function useData() {
  const context = useContext(DataContext);
  
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  
  return context;
}
