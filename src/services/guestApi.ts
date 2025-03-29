import { Guest, GuestFormData } from '../types/Guest';
import { supabase } from './supabase';

// Define the GuestAPI interface to ensure consistent structure
interface GuestAPI {
  guests: {
    getAll: () => Promise<{ data: Guest[] | null; error: any }>;
    getById: (id: string) => Promise<{ data: Guest | null; error: any }>;
    create: (guest: GuestFormData) => Promise<{ data: Guest | null; error: any }>;
    update: (id: string, updates: Partial<Guest>) => Promise<{ data: Guest | null; error: any }>;
    delete: (id: string) => Promise<{ error: any }>;
    updateStatus: (id: string, status: 'pending' | 'confirmed' | 'declined') => Promise<{ data: Guest | null; error: any }>;
    getByTable: (tableId: string) => Promise<{ data: Guest[] | null; error: any }>;
    getWithoutTable: () => Promise<{ data: Guest[] | null; error: any }>;
    assignToTable: (guestId: string, tableId: string) => Promise<{ data: Guest | null; error: any }>;
    removeFromTable: (guestId: string) => Promise<{ data: Guest | null; error: any }>;
  }
}

// Real API implementation using Supabase
const guestApiImplementation = {
  getAll: async (): Promise<{ data: Guest[] | null; error: any }> => {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .order('name');
    
    return { data, error };
  },
  
  getById: async (id: string): Promise<{ data: Guest | null; error: any }> => {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  },
  
  create: async (guest: GuestFormData): Promise<{ data: Guest | null; error: any }> => {
    const { data, error } = await supabase
      .from('guests')
      .insert([
        { 
          ...guest,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ])
      .select()
      .single();
    
    return { data, error };
  },
  
  update: async (id: string, updates: Partial<Guest>): Promise<{ data: Guest | null; error: any }> => {
    const { data, error } = await supabase
      .from('guests')
      .update({ 
        ...updates,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },
  
  delete: async (id: string): Promise<{ error: any }> => {
    const { error } = await supabase
      .from('guests')
      .delete()
      .eq('id', id);
    
    return { error };
  },
  
  updateStatus: async (id: string, status: 'pending' | 'confirmed' | 'declined'): Promise<{ data: Guest | null; error: any }> => {
    return await guestApiImplementation.update(id, { status });
  },
  
  getByTable: async (tableId: string): Promise<{ data: Guest[] | null; error: any }> => {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('tableId', tableId)
      .order('name');
    
    return { data, error };
  },
  
  getWithoutTable: async (): Promise<{ data: Guest[] | null; error: any }> => {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .is('tableId', null)
      .order('name');
    
    return { data, error };
  },
  
  assignToTable: async (guestId: string, tableId: string): Promise<{ data: Guest | null; error: any }> => {
    return await guestApiImplementation.update(guestId, { tableId });
  },
  
  removeFromTable: async (guestId: string): Promise<{ data: Guest | null; error: any }> => {
    return await guestApiImplementation.update(guestId, { tableId: undefined });
  }
};

// Demo API implementation for the interactive demo
const demoApiImplementation = {
  getAll: async (): Promise<{ data: Guest[] | null; error: any }> => {
    // Return mock data for demo
    return {
      data: [
        {
          id: '1',
          name: 'Sarah Schmidt',
          email: 'sarah@example.com',
          phone: '+49 123 456789',
          status: 'confirmed',
          plusOne: true,
          dietaryRestrictions: 'Vegetarian',
          tableId: '1',
          notes: 'Bride\'s sister',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          name: 'Thomas Müller',
          email: 'thomas@example.com',
          phone: '+49 987 654321',
          status: 'confirmed',
          plusOne: false,
          dietaryRestrictions: '',
          tableId: '1',
          notes: 'Groom\'s brother',
          createdAt: '2024-01-15T10:05:00Z',
          updatedAt: '2024-01-15T10:05:00Z'
        },
        {
          id: '3',
          name: 'Julia Weber',
          email: 'julia@example.com',
          phone: '+49 555 123456',
          status: 'pending',
          plusOne: true,
          dietaryRestrictions: 'Gluten-free',
          tableId: '2',
          notes: '',
          createdAt: '2024-01-15T10:10:00Z',
          updatedAt: '2024-01-15T10:10:00Z'
        },
        {
          id: '4',
          name: 'Michael Fischer',
          email: 'michael@example.com',
          phone: '+49 555 654321',
          status: 'declined',
          plusOne: false,
          dietaryRestrictions: '',
          tableId: undefined,
          notes: 'Cannot attend due to prior commitment',
          createdAt: '2024-01-15T10:15:00Z',
          updatedAt: '2024-01-15T10:15:00Z'
        },
        {
          id: '5',
          name: 'Anna Becker',
          email: 'anna@example.com',
          phone: '+49 333 123456',
          status: 'confirmed',
          plusOne: true,
          dietaryRestrictions: 'Vegan',
          tableId: '2',
          notes: '',
          createdAt: '2024-01-15T10:20:00Z',
          updatedAt: '2024-01-15T10:20:00Z'
        }
      ],
      error: null
    };
  },
  
  getById: async (id: string): Promise<{ data: Guest | null; error: any }> => {
    const { data } = await demoApiImplementation.getAll();
    const guest = data?.find(g => g.id === id) || null;
    return { data: guest, error: null };
  },
  
  create: async (guest: GuestFormData): Promise<{ data: Guest | null; error: any }> => {
    // Simulate creating a new guest
    const newGuest: Guest = {
      id: Math.random().toString(36).substring(2, 11),
      ...guest,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return { data: newGuest, error: null };
  },
  
  update: async (id: string, updates: Partial<Guest>): Promise<{ data: Guest | null; error: any }> => {
    // Simulate updating a guest
    const { data: guest } = await demoApiImplementation.getById(id);
    
    if (!guest) {
      return { data: null, error: 'Guest not found' };
    }
    
    const updatedGuest: Guest = {
      ...guest,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return { data: updatedGuest, error: null };
  },
  
  delete: async (_id: string): Promise<{ error: any }> => {
    // Simulate deleting a guest
    return { error: null };
  },
  
  updateStatus: async (id: string, status: 'pending' | 'confirmed' | 'declined'): Promise<{ data: Guest | null; error: any }> => {
    return await demoApiImplementation.update(id, { status });
  },
  
  getByTable: async (tableId: string): Promise<{ data: Guest[] | null; error: any }> => {
    const { data } = await demoApiImplementation.getAll();
    const filteredGuests = data?.filter(guest => guest.tableId === tableId) || [];
    return { data: filteredGuests, error: null };
  },
  
  getWithoutTable: async (): Promise<{ data: Guest[] | null; error: any }> => {
    const { data } = await demoApiImplementation.getAll();
    const filteredGuests = data?.filter(guest => !guest.tableId) || [];
    return { data: filteredGuests, error: null };
  },
  
  assignToTable: async (guestId: string, tableId: string): Promise<{ data: Guest | null; error: any }> => {
    return await demoApiImplementation.update(guestId, { tableId });
  },
  
  removeFromTable: async (guestId: string): Promise<{ data: Guest | null; error: any }> => {
    return await demoApiImplementation.update(guestId, { tableId: undefined });
  }
};

// Export the APIs with the nested structure
export const guestApi: GuestAPI = {
  guests: guestApiImplementation
};

export const demoApi: GuestAPI = {
  guests: demoApiImplementation
};
