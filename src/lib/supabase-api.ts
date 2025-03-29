import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PostgrestError } from '@supabase/supabase-js';

// Type definitions for API responses
export interface ApiResponse<T> {
  data: T | null;
  error: PostgrestError | Error | null;
  status: 'success' | 'error';
  message?: string;
}

// Type definitions for data models
export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  rsvpStatus: 'confirmed' | 'declined' | 'pending';
  dietaryRestrictions: string[];
  plusOne: boolean;
  notes: string;
  tableAssignment: string | null;
  group: string;
}

export interface Table {
  id: string;
  name: string;
  type: 'round' | 'rectangular' | 'oval';
  seats: number;
  position: { x: number; y: number };
}

export interface BudgetItem {
  id: string;
  category: string;
  description: string;
  estimatedCost: number;
  actualCost: number | null;
  paid: boolean;
  notes: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  completed: boolean;
  category: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  votes: number;
  addedBy: string;
}

export interface Couple {
  id: string;
  partner1Name: string;
  partner2Name: string;
  weddingDate: string;
  venue: string;
  contactEmail: string;
  contactPhone: string;
  websiteUrl: string | null;
  settings: Record<string, any>;
}

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jodqliylhmwgpurfzxm.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZHFsaXlsaG13Z3B1cmZ6eG0iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcxNjIxNmpvZHFsaXlsaG13Z3B1cmZ6eG0iLCJleHAiOjE3MTYyMTZJmpvZHFsaXlsaG13Z3B1cmZ6eG0ifQ.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZHFsaXlsaG13Z3B1cmZ6eG0iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcxNjIxNmpvZHFsaXlsaG13Z3B1cmZ6eG0iLCJleHAiOjE3MTYyMTZJmpvZHFsaXlsaG13Z3B1cmZ6eG0ifQ';

// Initialize Supabase client
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to handle API responses
const handleApiResponse = <T>(data: T | null, error: PostgrestError | Error | null): ApiResponse<T> => {
  if (error) {
    console.error('API Error:', error);
    return {
      data: null,
      error,
      status: 'error',
      message: error.message || 'An error occurred'
    };
  }
  return {
    data,
    error: null,
    status: 'success'
  };
};

// Helper function to handle errors in try-catch blocks
const handleApiError = <T>(error: unknown): ApiResponse<T> => {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  console.error('API Error:', errorObj);
  return {
    data: null,
    error: errorObj,
    status: 'error',
    message: errorObj.message
  };
};

// Production API
export const api = {
  // Guest Management
  guests: {
    getAll: async (): Promise<ApiResponse<Guest[]>> => {
      try {
        const { data, error } = await supabase.from('guests').select('*');
        return handleApiResponse<Guest[]>(data, error);
      } catch (error) {
        return handleApiError<Guest[]>(error);
      }
    },
    getById: async (id: string): Promise<ApiResponse<Guest>> => {
      try {
        const { data, error } = await supabase.from('guests').select('*').eq('id', id).single();
        return handleApiResponse<Guest>(data, error);
      } catch (error) {
        return handleApiError<Guest>(error);
      }
    },
    add: async (guest: Omit<Guest, 'id'>): Promise<ApiResponse<Guest>> => {
      try {
        const { data, error } = await supabase.from('guests').insert([guest]).select();
        return handleApiResponse<Guest>(data?.[0] || null, error);
      } catch (error) {
        return handleApiError<Guest>(error);
      }
    },
    update: async (id: string, updates: Partial<Guest>): Promise<ApiResponse<Guest>> => {
      try {
        const { data, error } = await supabase
          .from('guests')
          .update(updates)
          .eq('id', id)
          .select();
        return handleApiResponse<Guest>(data?.[0] || null, error);
      } catch (error) {
        return handleApiError<Guest>(error);
      }
    },
    delete: async (id: string): Promise<ApiResponse<null>> => {
      try {
        const { error } = await supabase.from('guests').delete().eq('id', id);
        return handleApiResponse<null>(null, error);
      } catch (error) {
        return handleApiError<null>(error);
      }
    },
    updateRsvp: async (id: string, status: Guest['rsvpStatus']): Promise<ApiResponse<Guest>> => {
      try {
        const { data, error } = await supabase
          .from('guests')
          .update({ rsvpStatus: status })
          .eq('id', id)
          .select();
        return handleApiResponse<Guest>(data?.[0] || null, error);
      } catch (error) {
        return handleApiError<Guest>(error);
      }
    },
  },
  // Table Planner
  tables: {
    getAll: async (): Promise<ApiResponse<Table[]>> => {
      try {
        const { data, error } = await supabase.from('tables').select('*');
        return handleApiResponse<Table[]>(data, error);
      } catch (error) {
        return handleApiError<Table[]>(error);
      }
    },
    add: async (table: Omit<Table, 'id'>): Promise<ApiResponse<Table>> => {
      try {
        const { data, error } = await supabase.from('tables').insert([table]).select();
        return handleApiResponse<Table>(data?.[0] || null, error);
      } catch (error) {
        return handleApiError<Table>(error);
      }
    },
    update: async (id: string, updates: Partial<Table>): Promise<ApiResponse<Table>> => {
      try {
        const { data, error } = await supabase
          .from('tables')
          .update(updates)
          .eq('id', id)
          .select();
        return handleApiResponse<Table>(data?.[0] || null, error);
      } catch (error) {
        return handleApiError<Table>(error);
      }
    },
    delete: async (id: string): Promise<ApiResponse<null>> => {
      try {
        const { error } = await supabase.from('tables').delete().eq('id', id);
        return handleApiResponse<null>(null, error);
      } catch (error) {
        return handleApiError<null>(error);
      }
    },
    assignGuest: async (tableId: string, guestId: string, seatIndex: number): Promise<ApiResponse<Guest>> => {
      try {
        const { data, error } = await supabase
          .from('guests')
          .update({ tableAssignment: tableId, seatIndex })
          .eq('id', guestId)
          .select();
        return handleApiResponse<Guest>(data?.[0] || null, error);
      } catch (error) {
        return handleApiError<Guest>(error);
      }
    },
    removeGuest: async (guestId: string): Promise<ApiResponse<Guest>> => {
      try {
        const { data, error } = await supabase
          .from('guests')
          .update({ tableAssignment: null, seatIndex: null })
          .eq('id', guestId)
          .select();
        return handleApiResponse<Guest>(data?.[0] || null, error);
      } catch (error) {
        return handleApiError<Guest>(error);
      }
    },
  },
  // Budget Planner
  budget: {
    getItems: async (): Promise<ApiResponse<BudgetItem[]>> => {
      try {
        const { data, error } = await supabase.from('budget_items').select('*');
        return handleApiResponse<BudgetItem[]>(data, error);
      } catch (error) {
        return handleApiError<BudgetItem[]>(error);
      }
    },
    addItem: async (item: Omit<BudgetItem, 'id'>): Promise<ApiResponse<BudgetItem>> => {
      try {
        const { data, error } = await supabase.from('budget_items').insert([item]).select();
        return handleApiResponse<BudgetItem>(data?.[0] || null, error);
      } catch (error) {
        return handleApiError<BudgetItem>(error);
      }
    },
    updateItem: async (id: string, updates: Partial<BudgetItem>): Promise<ApiResponse<BudgetItem>> => {
      try {
        const { data, error } = await supabase
          .from('budget_items')
          .update(updates)
          .eq('id', id)
          .select();
        return handleApiResponse<BudgetItem>(data?.[0] || null, error);
      } catch (error) {
        return handleApiError<BudgetItem>(error);
      }
    },
    deleteItem: async (id: string): Promise<ApiResponse<null>> => {
      try {
        const { error } = await supabase.from('budget_items').delete().eq('id', id);
        return handleApiResponse<null>(null, error);
      } catch (error) {
        return handleApiError<null>(error);
      }
    },
  },
  // Checklists
  checklists: {
    getItems: async (): Promise<ApiResponse<ChecklistItem[]>> => {
      try {
        const { data, error } = await supabase.from('checklist_items').select('*');
        return handleApiResponse<ChecklistItem[]>(data, error);
      } catch (error) {
        return handleApiError<ChecklistItem[]>(error);
      }
    },
    addItem: async (item: Omit<ChecklistItem, 'id'>): Promise<ApiResponse<ChecklistItem>> => {
      try {
        const { data, error } = await supabase.from('checklist_items').insert([item]).select();
        return handleApiResponse<ChecklistItem>(data?.[0] || null, error);
      } catch (error) {
        return handleApiError<ChecklistItem>(error);
      }
    },
    updateItem: async (id: string, updates: Partial<ChecklistItem>): Promise<ApiResponse<ChecklistItem>> => {
      try {
        const { data, error } = await supabase
          .from('checklist_items')
          .update(updates)
          .eq('id', id)
          .select();
        return handleApiResponse<ChecklistItem>(data?.[0] || null, error);
      } catch (error) {
        return handleApiError<ChecklistItem>(error);
      }
    },
    deleteItem: async (id: string): Promise<ApiResponse<null>> => {
      try {
        const { error } = await supabase.from('checklist_items').delete().eq('id', id);
        return handleApiResponse<null>(null, error);
      } catch (error) {
        return handleApiError<null>(error);
      }
    },
  },
  // Music Voting
  music: {
    getSongs: async (): Promise<ApiResponse<Song[]>> => {
      try {
        const { data, error } = await supabase.from('songs').select('*');
        return handleApiResponse<Song[]>(data, error);
      } catch (error) {
        return handleApiError<Song[]>(error);
      }
    },
    addSong: async (song: Omit<Song, 'id'>): Promise<ApiResponse<Song>> => {
      try {
        const { data, error } = await supabase.from('songs').insert([song]).select();
        return handleApiResponse<Song>(data?.[0] || null, error);
      } catch (error) {
        return handleApiError<Song>(error);
      }
    },
    voteSong: async (id: string, increment = true): Promise<ApiResponse<Song>> => {
      try {
        // Get current votes
        const { data: currentData, error: fetchError } = await supabase
          .from('songs')
          .select('votes')
          .eq('id', id)
          .single();
        
        if (fetchError) {
          return handleApiResponse<Song>(null, fetchError);
        }
        
        const currentVotes = currentData?.votes || 0;
        
        // Update votes
        const newVotes = increment ? currentVotes + 1 : Math.max(0, currentVotes - 1);
        
        const { data, error } = await supabase
          .from('songs')
          .update({ votes: newVotes })
          .eq('id', id)
          .select();
        
        return handleApiResponse<Song>(data?.[0] || null, error);
      } catch (error) {
        return handleApiError<Song>(error);
      }
    },
    deleteSong: async (id: string): Promise<ApiResponse<null>> => {
      try {
        const { error } = await supabase.from('songs').delete().eq('id', id);
        return handleApiResponse<null>(null, error);
      } catch (error) {
        return handleApiError<null>(error);
      }
    },
  },
  // Couple Management
  couples: {
    getDetails: async (): Promise<ApiResponse<Couple>> => {
      try {
        const { data, error } = await supabase.from('couples').select('*').single();
        return handleApiResponse<Couple>(data, error);
      } catch (error) {
        return handleApiError<Couple>(error);
      }
    },
    updateDetails: async (id: string, updates: Partial<Couple>): Promise<ApiResponse<Couple>> => {
      try {
        const { data, error } = await supabase
          .from('couples')
          .update(updates)
          .eq('id', id)
          .select();
        return handleApiResponse<Couple>(data?.[0] || null, error);
      } catch (error) {
        return handleApiError<Couple>(error);
      }
    },
  },
  // Authentication (using Supabase Auth)
  auth: {
    signIn: async (email: string, password: string): Promise<ApiResponse<any>> => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        return handleApiResponse<any>(data, error);
      } catch (error) {
        return handleApiError<any>(error);
      }
    },
    signUp: async (email: string, password: string): Promise<ApiResponse<any>> => {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        return handleApiResponse<any>(data, error);
      } catch (error) {
        return handleApiError<any>(error);
      }
    },
    signOut: async (): Promise<ApiResponse<{ success: boolean }>> => {
      try {
        const { error } = await supabase.auth.signOut();
        return handleApiResponse<{ success: boolean }>({ success: !error }, error);
      } catch (error) {
        return handleApiError<{ success: boolean }>(error);
      }
    },
    resetPassword: async (email: string): Promise<ApiResponse<any>> => {
      try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email);
        return handleApiResponse<any>(data, error);
      } catch (error) {
        return handleApiError<any>(error);
      }
    },
    getCurrentUser: async (): Promise<ApiResponse<any>> => {
      try {
        const { data, error } = await supabase.auth.getUser();
        return handleApiResponse<any>(data?.user || null, error);
      } catch (error) {
        return handleApiError<any>(error);
      }
    },
    getSession: async (): Promise<ApiResponse<any>> => {
      try {
        const { data, error } = await supabase.auth.getSession();
        return handleApiResponse<any>(data?.session || null, error);
      } catch (error) {
        return handleApiError<any>(error);
      }
    },
  },
};

// Demo API for development and testing
export const demoApi = {
  // Guest Management
  guests: {
    getAll: async (): Promise<ApiResponse<Guest[]>> => {
      try {
        // For demo purposes, return mock data
        const mockGuests: Guest[] = [
          {
            id: '1',
            firstName: 'Max',
            lastName: 'Mustermann',
            email: 'max@example.com',
            phone: '+49123456789',
            rsvpStatus: 'confirmed',
            dietaryRestrictions: ['vegetarian'],
            plusOne: true,
            notes: 'Allergic to nuts',
            tableAssignment: 'Table 1',
            group: 'Family',
          },
          {
            id: '2',
            firstName: 'Anna',
            lastName: 'Schmidt',
            email: 'anna@example.com',
            phone: '+49987654321',
            rsvpStatus: 'pending',
            dietaryRestrictions: [],
            plusOne: false,
            notes: '',
            tableAssignment: null,
            group: 'Friends',
          },
          {
            id: '3',
            firstName: 'Thomas',
            lastName: 'Müller',
            email: 'thomas@example.com',
            phone: '+49123123123',
            rsvpStatus: 'declined',
            dietaryRestrictions: ['lactose-free'],
            plusOne: true,
            notes: 'Coming from Berlin',
            tableAssignment: 'Table 2',
            group: 'Friends',
          },
        ];
        return handleApiResponse<Guest[]>(mockGuests, null);
      } catch (error) {
        return handleApiError<Guest[]>(error);
      }
    },
    getById: async (id: string): Promise<ApiResponse<Guest>> => {
      try {
        // Simulate API call
        const mockGuest: Guest = {
          id,
          firstName: 'Max',
          lastName: 'Mustermann',
          email: 'max@example.com',
          phone: '+49123456789',
          rsvpStatus: 'confirmed',
          dietaryRestrictions: ['vegetarian'],
          plusOne: true,
          notes: 'Allergic to nuts',
          tableAssignment: 'Table 1',
          group: 'Family',
        };
        return handleApiResponse<Guest>(mockGuest, null);
      } catch (error) {
        return handleApiError<Guest>(error);
      }
    },
    add: async (guest: Omit<Guest, 'id'>): Promise<ApiResponse<Guest>> => {
      try {
        // Simulate API call
        const newGuest: Guest = {
          ...guest as Guest,
          id: Math.random().toString(36).substring(2, 11),
        };
        return handleApiResponse<Guest>(newGuest, null);
      } catch (error) {
        return handleApiError<Guest>(error);
      }
    },
    update: async (id: string, updates: Partial<Guest>): Promise<ApiResponse<Guest>> => {
      try {
        // Simulate API call
        const updatedGuest: Guest = {
          id,
          firstName: updates.firstName || 'Updated',
          lastName: updates.lastName || 'Guest',
          email: updates.email || 'updated@example.com',
          phone: updates.phone || '+49000000000',
          rsvpStatus: updates.rsvpStatus || 'pending',
          dietaryRestrictions: updates.dietaryRestrictions || [],
          plusOne: updates.plusOne !== undefined ? updates.plusOne : false,
          notes: updates.notes || '',
          tableAssignment: updates.tableAssignment || null,
          group: updates.group || 'Other',
        };
        return handleApiResponse<Guest>(updatedGuest, null);
      } catch (error) {
        return handleApiError<Guest>(error);
      }
    },
    delete: async (id: string): Promise<ApiResponse<null>> => {
      try {
        // Simulate API call
        return handleApiResponse<null>(null, null);
      } catch (error) {
        return handleApiError<null>(error);
      }
    },
    updateRsvp: async (id: string, status: Guest['rsvpStatus']): Promise<ApiResponse<Guest>> => {
      try {
        // Simulate API call
        const updatedGuest: Guest = {
          id,
          firstName: 'Max',
          lastName: 'Mustermann',
          email: 'max@example.com',
          phone: '+49123456789',
          rsvpStatus: status,
          dietaryRestrictions: ['vegetarian'],
          plusOne: true,
          notes: 'Allergic to nuts',
          tableAssignment: 'Table 1',
          group: 'Family',
        };
        return handleApiResponse<Guest>(updatedGuest, null);
      } catch (error) {
        return handleApiError<Guest>(error);
      }
    },
  },
  // Table Planner
  tables: {
    getAll: async (): Promise<ApiResponse<Table[]>> => {
      try {
        // For demo purposes, return mock data
        const mockTables: Table[] = [
          {
            id: '1',
            name: 'Table 1',
            type: 'round',
            seats: 8,
            position: { x: 100, y: 100 },
          },
          {
            id: '2',
            name: 'Table 2',
            type: 'rectangular',
            seats: 6,
            position: { x: 300, y: 100 },
          },
          {
            id: '3',
            name: 'Table 3',
            type: 'oval',
            seats: 10,
            position: { x: 200, y: 300 },
          },
        ];
        return handleApiResponse<Table[]>(mockTables, null);
      } catch (error) {
        return handleApiError<Table[]>(error);
      }
    },
    add: async (table: Omit<Table, 'id'>): Promise<ApiResponse<Table>> => {
      try {
        // Simulate API call
        const newTable: Table = {
          ...table as Table,
          id: Math.random().toString(36).substring(2, 11),
        };
        return handleApiResponse<Table>(newTable, null);
      } catch (error) {
        return handleApiError<Table>(error);
      }
    },
    update: async (id: string, updates: Partial<Table>): Promise<ApiResponse<Table>> => {
      try {
        // Simulate API call
        const updatedTable: Table = {
          id,
          name: updates.name || 'Updated Table',
          type: updates.type || 'round',
          seats: updates.seats || 8,
          position: updates.position || { x: 100, y: 100 },
        };
        return handleApiResponse<Table>(updatedTable, null);
      } catch (error) {
        return handleApiError<Table>(error);
      }
    },
    delete: async (id: string): Promise<ApiResponse<null>> => {
      try {
        // Simulate API call
        return handleApiResponse<null>(null, null);
      } catch (error) {
        return handleApiError<null>(error);
      }
    },
    assignGuest: async (tableId: string, guestId: string, seatIndex: number): Promise<ApiResponse<Guest>> => {
      try {
        // Simulate API call
        const updatedGuest: Guest = {
          id: guestId,
          firstName: 'Max',
          lastName: 'Mustermann',
          email: 'max@example.com',
          phone: '+49123456789',
          rsvpStatus: 'confirmed',
          dietaryRestrictions: ['vegetarian'],
          plusOne: true,
          notes: 'Allergic to nuts',
          tableAssignment: tableId,
          group: 'Family',
        };
        return handleApiResponse<Guest>(updatedGuest, null);
      } catch (error) {
        return handleApiError<Guest>(error);
      }
    },
    removeGuest: async (guestId: string): Promise<ApiResponse<Guest>> => {
      try {
        // Simulate API call
        const updatedGuest: Guest = {
          id: guestId,
          firstName: 'Max',
          lastName: 'Mustermann',
          email: 'max@example.com',
          phone: '+49123456789',
          rsvpStatus: 'confirmed',
          dietaryRestrictions: ['vegetarian'],
          plusOne: true,
          notes: 'Allergic to nuts',
          tableAssignment: null,
          group: 'Family',
        };
        return handleApiResponse<Guest>(updatedGuest, null);
      } catch (error) {
        return handleApiError<Guest>(error);
      }
    },
  },
  // Budget Planner
  budget: {
    getItems: async (): Promise<ApiResponse<BudgetItem[]>> => {
      try {
        // For demo purposes, return mock data
        const mockBudgetItems: BudgetItem[] = [
          {
            id: '1',
            category: 'Venue',
            description: 'Wedding Venue Rental',
            estimatedCost: 5000,
            actualCost: 5200,
            paid: true,
            notes: 'Includes tables and chairs',
          },
          {
            id: '2',
            category: 'Catering',
            description: 'Dinner Service',
            estimatedCost: 3000,
            actualCost: null,
            paid: false,
            notes: 'Need to confirm final guest count',
          },
          {
            id: '3',
            category: 'Photography',
            description: 'Wedding Photographer',
            estimatedCost: 1500,
            actualCost: 1500,
            paid: true,
            notes: '8 hours of coverage',
          },
        ];
        return handleApiResponse<BudgetItem[]>(mockBudgetItems, null);
      } catch (error) {
        return handleApiError<BudgetItem[]>(error);
      }
    },
    addItem: async (item: Omit<BudgetItem, 'id'>): Promise<ApiResponse<BudgetItem>> => {
      try {
        // Simulate API call
        const newItem: BudgetItem = {
          ...item as BudgetItem,
          id: Math.random().toString(36).substring(2, 11),
        };
        return handleApiResponse<BudgetItem>(newItem, null);
      } catch (error) {
        return handleApiError<BudgetItem>(error);
      }
    },
    updateItem: async (id: string, updates: Partial<BudgetItem>): Promise<ApiResponse<BudgetItem>> => {
      try {
        // Simulate API call
        const updatedItem: BudgetItem = {
          id,
          category: updates.category || 'Updated Category',
          description: updates.description || 'Updated Description',
          estimatedCost: updates.estimatedCost !== undefined ? updates.estimatedCost : 0,
          actualCost: updates.actualCost !== undefined ? updates.actualCost : null,
          paid: updates.paid !== undefined ? updates.paid : false,
          notes: updates.notes || '',
        };
        return handleApiResponse<BudgetItem>(updatedItem, null);
      } catch (error) {
        return handleApiError<BudgetItem>(error);
      }
    },
    deleteItem: async (id: string): Promise<ApiResponse<null>> => {
      try {
        // Simulate API call
        return handleApiResponse<null>(null, null);
      } catch (error) {
        return handleApiError<null>(error);
      }
    },
  },
  // Checklists
  checklists: {
    getItems: async (): Promise<ApiResponse<ChecklistItem[]>> => {
      try {
        // For demo purposes, return mock data
        const mockChecklistItems: ChecklistItem[] = [
          {
            id: '1',
            title: 'Book Venue',
            description: 'Find and book the perfect wedding venue',
            dueDate: '2023-06-01',
            completed: true,
            category: 'Venue',
          },
          {
            id: '2',
            title: 'Send Invitations',
            description: 'Design, print, and mail wedding invitations',
            dueDate: '2023-07-15',
            completed: false,
            category: 'Planning',
          },
          {
            id: '3',
            title: 'Hire Photographer',
            description: 'Find and book a wedding photographer',
            dueDate: '2023-06-15',
            completed: true,
            category: 'Vendors',
          },
        ];
        return handleApiResponse<ChecklistItem[]>(mockChecklistItems, null);
      } catch (error) {
        return handleApiError<ChecklistItem[]>(error);
      }
    },
    addItem: async (item: Omit<ChecklistItem, 'id'>): Promise<ApiResponse<ChecklistItem>> => {
      try {
        // Simulate API call
        const newItem: ChecklistItem = {
          ...item as ChecklistItem,
          id: Math.random().toString(36).substring(2, 11),
        };
        return handleApiResponse<ChecklistItem>(newItem, null);
      } catch (error) {
        return handleApiError<ChecklistItem>(error);
      }
    },
    updateItem: async (id: string, updates: Partial<ChecklistItem>): Promise<ApiResponse<ChecklistItem>> => {
      try {
        // Simulate API call
        const updatedItem: ChecklistItem = {
          id,
          title: updates.title || 'Updated Task',
          description: updates.description || 'Updated Description',
          dueDate: updates.dueDate || null,
          completed: updates.completed !== undefined ? updates.completed : false,
          category: updates.category || 'Other',
        };
        return handleApiResponse<ChecklistItem>(updatedItem, null);
      } catch (error) {
        return handleApiError<ChecklistItem>(error);
      }
    },
    deleteItem: async (id: string): Promise<ApiResponse<null>> => {
      try {
        // Simulate API call
        return handleApiResponse<null>(null, null);
      } catch (error) {
        return handleApiError<null>(error);
      }
    },
  },
  // Music Voting
  music: {
    getSongs: async (): Promise<ApiResponse<Song[]>> => {
      try {
        // For demo purposes, return mock data
        const mockSongs: Song[] = [
          {
            id: '1',
            title: 'Perfect',
            artist: 'Ed Sheeran',
            votes: 15,
            addedBy: 'Bride',
          },
          {
            id: '2',
            title: 'Thinking Out Loud',
            artist: 'Ed Sheeran',
            votes: 10,
            addedBy: 'Groom',
          },
          {
            id: '3',
            title: 'All of Me',
            artist: 'John Legend',
            votes: 8,
            addedBy: 'Maid of Honor',
          },
        ];
        return handleApiResponse<Song[]>(mockSongs, null);
      } catch (error) {
        return handleApiError<Song[]>(error);
      }
    },
    addSong: async (song: Omit<Song, 'id'>): Promise<ApiResponse<Song>> => {
      try {
        // Simulate API call
        const newSong: Song = {
          ...song as Song,
          id: Math.random().toString(36).substring(2, 11),
        };
        return handleApiResponse<Song>(newSong, null);
      } catch (error) {
        return handleApiError<Song>(error);
      }
    },
    voteSong: async (id: string, increment = true): Promise<ApiResponse<Song>> => {
      try {
        // Simulate API call
        const updatedSong: Song = {
          id,
          title: 'Perfect',
          artist: 'Ed Sheeran',
          votes: increment ? 16 : 14, // Increment or decrement from 15
          addedBy: 'Bride',
        };
        return handleApiResponse<Song>(updatedSong, null);
      } catch (error) {
        return handleApiError<Song>(error);
      }
    },
    deleteSong: async (id: string): Promise<ApiResponse<null>> => {
      try {
        // Simulate API call
        return handleApiResponse<null>(null, null);
      } catch (error) {
        return handleApiError<null>(error);
      }
    },
  },
  // Couple Management
  couples: {
    getDetails: async (): Promise<ApiResponse<Couple>> => {
      try {
        // For demo purposes, return mock data
        const mockCouple: Couple = {
          id: '1',
          partner1Name: 'Max Mustermann',
          partner2Name: 'Anna Musterfrau',
          weddingDate: '2023-09-15',
          venue: 'Grand Hotel Berlin',
          contactEmail: 'wedding@example.com',
          contactPhone: '+49123456789',
          websiteUrl: 'https://max-anna-wedding.com',
          settings: {
            theme: 'classic',
            colors: ['#f5a623', '#4a90e2'],
            showRSVP: true,
            showRegistry: true,
          },
        };
        return handleApiResponse<Couple>(mockCouple, null);
      } catch (error) {
        return handleApiError<Couple>(error);
      }
    },
    updateDetails: async (id: string, updates: Partial<Couple>): Promise<ApiResponse<Couple>> => {
      try {
        // Simulate API call
        const updatedCouple: Couple = {
          id,
          partner1Name: updates.partner1Name || 'Max Mustermann',
          partner2Name: updates.partner2Name || 'Anna Musterfrau',
          weddingDate: updates.weddingDate || '2023-09-15',
          venue: updates.venue || 'Grand Hotel Berlin',
          contactEmail: updates.contactEmail || 'wedding@example.com',
          contactPhone: updates.contactPhone || '+49123456789',
          websiteUrl: updates.websiteUrl || 'https://max-anna-wedding.com',
          settings: updates.settings || {
            theme: 'classic',
            colors: ['#f5a623', '#4a90e2'],
            showRSVP: true,
            showRegistry: true,
          },
        };
        return handleApiResponse<Couple>(updatedCouple, null);
      } catch (error) {
        return handleApiError<Couple>(error);
      }
    },
  },
  // Authentication (using Supabase Auth)
  auth: {
    signIn: async (email: string, password: string): Promise<ApiResponse<any>> => {
      try {
        // Simulate API call
        if (email === 'demo@example.com' && password === 'password') {
          return handleApiResponse<any>({
            user: {
              id: '1',
              email: 'demo@example.com',
              role: 'authenticated',
            },
            session: {
              access_token: 'mock-token',
              expires_at: Date.now() + 3600000,
            },
          }, null);
        } else {
          throw new Error('Invalid email or password');
        }
      } catch (error) {
        return handleApiError<any>(error);
      }
    },
    signUp: async (email: string, password: string): Promise<ApiResponse<any>> => {
      try {
        // Simulate API call
        return handleApiResponse<any>({
          user: {
            id: Math.random().toString(36).substring(2, 11),
            email,
            role: 'authenticated',
          },
          session: {
            access_token: 'mock-token',
            expires_at: Date.now() + 3600000,
          },
        }, null);
      } catch (error) {
        return handleApiError<any>(error);
      }
    },
    signOut: async (): Promise<ApiResponse<{ success: boolean }>> => {
      try {
        // Simulate API call
        return handleApiResponse<{ success: boolean }>({ success: true }, null);
      } catch (error) {
        return handleApiError<{ success: boolean }>(error);
      }
    },
    resetPassword: async (email: string): Promise<ApiResponse<any>> => {
      try {
        // Simulate API call
        return handleApiResponse<any>({ success: true }, null);
      } catch (error) {
        return handleApiError<any>(error);
      }
    },
    getCurrentUser: async (): Promise<ApiResponse<any>> => {
      try {
        // Simulate API call
        return handleApiResponse<any>({
          id: '1',
          email: 'demo@example.com',
          role: 'authenticated',
        }, null);
      } catch (error) {
        return handleApiError<any>(error);
      }
    },
    getSession: async (): Promise<ApiResponse<any>> => {
      try {
        // Simulate API call
        return handleApiResponse<any>({
          access_token: 'mock-token',
          expires_at: Date.now() + 3600000,
        }, null);
      } catch (error) {
        return handleApiError<any>(error);
      }
    },
  },
};

// Use demo API for development and testing
export default process.env.NODE_ENV === 'production' ? api : demoApi;
