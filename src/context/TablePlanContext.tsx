import { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@services/supabase';

export interface Guest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: 'confirmed' | 'pending' | 'declined';
  plusOne: boolean;
  dietary?: string;
  allergies?: string;
  accommodation?: boolean;
  notes?: string;
  tableId?: string;
  group?: string;
}

export interface Table {
  id: string;
  name: string;
  size: number;
  shape: 'round' | 'rectangular' | 'square';
  position: { x: number; y: number };
}

interface TablePlanContextType {
  guests: Guest[];
  tables: Table[];
  loading: boolean;
  error: string | null;
  addGuest: (guest: Omit<Guest, 'id'>) => Promise<void>;
  updateGuest: (id: string, updates: Partial<Guest>) => Promise<void>;
  deleteGuest: (id: string) => Promise<void>;
  addTable: (table: Omit<Table, 'id'>) => Promise<void>;
  updateTable: (id: string, updates: Partial<Table>) => Promise<void>;
  deleteTable: (id: string) => Promise<void>;
  assignGuestToTable: (guestId: string, tableId: string | null) => Promise<void>;
  moveTable: (id: string, position: { x: number; y: number }) => Promise<void>;
}

export const TablePlanContext = createContext<TablePlanContextType>({
  guests: [],
  tables: [],
  loading: true,
  error: null,
  addGuest: async () => {},
  updateGuest: async () => {},
  deleteGuest: async () => {},
  addTable: async () => {},
  updateTable: async () => {},
  deleteTable: async () => {},
  assignGuestToTable: async () => {},
  moveTable: async () => {},
});

interface TablePlanProviderProps {
  children: ReactNode;
  weddingId: string;
}

export const TablePlanProvider = ({ children, weddingId }: TablePlanProviderProps) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch guests
        const { data: guestsData, error: guestsError } = await supabase
          .from('guests')
          .select('*')
          .eq('wedding_id', weddingId);
          
        if (guestsError) throw guestsError;
        
        // Fetch tables
        const { data: tablesData, error: tablesError } = await supabase
          .from('tables')
          .select('*')
          .eq('wedding_id', weddingId);
          
        if (tablesError) throw tablesError;
        
        setGuests(guestsData.map(g => ({
          id: g.id,
          name: g.name,
          email: g.email,
          phone: g.phone,
          status: g.status,
          plusOne: g.plus_one,
          dietary: g.dietary,
          allergies: g.allergies,
          accommodation: g.accommodation,
          notes: g.notes,
          tableId: g.table_id,
          group: g.group
        })));
        
        setTables(tablesData.map(t => ({
          id: t.id,
          name: t.name,
          size: t.size,
          shape: t.shape,
          position: t.position
        })));
      } catch (err) {
        console.error('Error fetching table plan data:', err);
        setError('Failed to load table plan data');
      } finally {
        setLoading(false);
      }
    };
    
    if (weddingId) {
      fetchData();
    }
  }, [weddingId]);

  const addGuest = async (guest: Omit<Guest, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .insert([{
          wedding_id: weddingId,
          name: guest.name,
          email: guest.email,
          phone: guest.phone,
          status: guest.status,
          plus_one: guest.plusOne,
          dietary: guest.dietary,
          allergies: guest.allergies,
          accommodation: guest.accommodation,
          notes: guest.notes,
          table_id: guest.tableId,
          group: guest.group
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      setGuests(prev => [...prev, {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        status: data.status,
        plusOne: data.plus_one,
        dietary: data.dietary,
        allergies: data.allergies,
        accommodation: data.accommodation,
        notes: data.notes,
        tableId: data.table_id,
        group: data.group
      }]);
    } catch (err) {
      console.error('Error adding guest:', err);
      setError('Failed to add guest');
    }
  };

  const updateGuest = async (id: string, updates: Partial<Guest>) => {
    try {
      const { error } = await supabase
        .from('guests')
        .update({
          name: updates.name,
          email: updates.email,
          phone: updates.phone,
          status: updates.status,
          plus_one: updates.plusOne,
          dietary: updates.dietary,
          allergies: updates.allergies,
          accommodation: updates.accommodation,
          notes: updates.notes,
          table_id: updates.tableId,
          group: updates.group
        })
        .eq('id', id);
        
      if (error) throw error;
      
      setGuests(prev => prev.map(guest => 
        guest.id === id ? { ...guest, ...updates } : guest
      ));
    } catch (err) {
      console.error('Error updating guest:', err);
      setError('Failed to update guest');
    }
  };

  const deleteGuest = async (id: string) => {
    try {
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setGuests(prev => prev.filter(guest => guest.id !== id));
    } catch (err) {
      console.error('Error deleting guest:', err);
      setError('Failed to delete guest');
    }
  };

  const addTable = async (table: Omit<Table, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('tables')
        .insert([{
          wedding_id: weddingId,
          name: table.name,
          size: table.size,
          shape: table.shape,
          position: table.position
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      setTables(prev => [...prev, {
        id: data.id,
        name: data.name,
        size: data.size,
        shape: data.shape,
        position: data.position
      }]);
    } catch (err) {
      console.error('Error adding table:', err);
      setError('Failed to add table');
    }
  };

  const updateTable = async (id: string, updates: Partial<Table>) => {
    try {
      const { error } = await supabase
        .from('tables')
        .update({
          name: updates.name,
          size: updates.size,
          shape: updates.shape,
          position: updates.position
        })
        .eq('id', id);
        
      if (error) throw error;
      
      setTables(prev => prev.map(table => 
        table.id === id ? { ...table, ...updates } : table
      ));
    } catch (err) {
      console.error('Error updating table:', err);
      setError('Failed to update table');
    }
  };

  const deleteTable = async (id: string) => {
    try {
      // First, unassign all guests from this table
      await supabase
        .from('guests')
        .update({ table_id: null })
        .eq('table_id', id);
        
      // Then delete the table
      const { error } = await supabase
        .from('tables')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update guests state to reflect unassignment
      setGuests(prev => prev.map(guest => 
        guest.tableId === id ? { ...guest, tableId: undefined } : guest
      ));
      
      // Remove table from state
      setTables(prev => prev.filter(table => table.id !== id));
    } catch (err) {
      console.error('Error deleting table:', err);
      setError('Failed to delete table');
    }
  };

  const assignGuestToTable = async (guestId: string, tableId: string | null) => {
    try {
      const { error } = await supabase
        .from('guests')
        .update({ table_id: tableId })
        .eq('id', guestId);
        
      if (error) throw error;
      
      setGuests(prev => prev.map(guest => 
        guest.id === guestId ? { ...guest, tableId: tableId || undefined } : guest
      ));
    } catch (err) {
      console.error('Error assigning guest to table:', err);
      setError('Failed to assign guest to table');
    }
  };

  const moveTable = async (id: string, position: { x: number; y: number }) => {
    try {
      const { error } = await supabase
        .from('tables')
        .update({ position })
        .eq('id', id);
        
      if (error) throw error;
      
      setTables(prev => prev.map(table => 
        table.id === id ? { ...table, position } : table
      ));
    } catch (err) {
      console.error('Error moving table:', err);
      setError('Failed to move table');
    }
  };

  return (
    <TablePlanContext.Provider
      value={{
        guests,
        tables,
        loading,
        error,
        addGuest,
        updateGuest,
        deleteGuest,
        addTable,
        updateTable,
        deleteTable,
        assignGuestToTable,
        moveTable,
      }}
    >
      {children}
    </TablePlanContext.Provider>
  );
};
