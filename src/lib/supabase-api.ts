// This file defines the types used by the Supabase API
// to ensure compatibility with the Netlify deployment

export interface Guest {
  id: string;
  name: string;
  email: string | null; // Allow null for compatibility with Supabase
  phone?: string | null;
  status: 'pending' | 'confirmed' | 'declined';
  plusOne: boolean;
  dietaryRestrictions?: string | null;
  tableId?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GuestFormData {
  name: string;
  email: string | null; // Allow null for compatibility with Supabase
  phone?: string | null;
  status: 'pending' | 'confirmed' | 'declined';
  plusOne: boolean;
  dietaryRestrictions?: string | null;
  tableId?: string | null;
  notes?: string | null;
}
