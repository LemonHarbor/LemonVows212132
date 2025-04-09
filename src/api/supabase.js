import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://jodqlliylhmwgpurfzxm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZHFsbGl5bGhtd2dwdXJmenhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5ODI4ODgsImV4cCI6MjA1ODU1ODg4OH0.7vcXDTNdjsIpnpe-06qSyuu3K-pQVwtYpLueUuzDzDk';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication functions
export const auth = {
  // Sign up a new user
  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  },

  // Sign in an existing user
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign out the current user
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get the current user
  getUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    return { data, error };
  },

  // Reset password
  resetPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
  },
};

// Guest management functions
export const guests = {
  // Get all guests for a wedding
  getAll: async (weddingId) => {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('wedding_id', weddingId);
    return { data, error };
  },

  // Get a single guest by ID
  getById: async (guestId) => {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('id', guestId)
      .single();
    return { data, error };
  },

  // Create a new guest
  create: async (guestData) => {
    const { data, error } = await supabase
      .from('guests')
      .insert([guestData])
      .select();
    return { data, error };
  },

  // Update an existing guest
  update: async (guestId, guestData) => {
    const { data, error } = await supabase
      .from('guests')
      .update(guestData)
      .eq('id', guestId)
      .select();
    return { data, error };
  },

  // Delete a guest
  delete: async (guestId) => {
    const { error } = await supabase
      .from('guests')
      .delete()
      .eq('id', guestId);
    return { error };
  },
};

// RSVP functions
export const rsvp = {
  // Get RSVP by code
  getByCode: async (code) => {
    const { data, error } = await supabase
      .from('rsvp_codes')
      .select('*, guests(*)')
      .eq('code', code)
      .single();
    return { data, error };
  },

  // Submit RSVP response
  submitResponse: async (rsvpData) => {
    const { data, error } = await supabase
      .from('rsvp_responses')
      .insert([rsvpData])
      .select();
    return { data, error };
  },

  // Get all RSVP responses for a wedding
  getResponses: async (weddingId) => {
    const { data, error } = await supabase
      .from('rsvp_responses')
      .select('*, guests(*)')
      .eq('wedding_id', weddingId);
    return { data, error };
  },
};

// Menu and food preferences functions
export const menu = {
  // Get all menu options for a wedding
  getOptions: async (weddingId) => {
    const { data, error } = await supabase
      .from('menu_options')
      .select('*')
      .eq('wedding_id', weddingId);
    return { data, error };
  },

  // Get all food preferences for a wedding
  getPreferences: async (weddingId) => {
    const { data, error } = await supabase
      .from('food_preferences')
      .select('*, guests(*)')
      .eq('wedding_id', weddingId);
    return { data, error };
  },

  // Submit food preferences
  submitPreferences: async (preferenceData) => {
    const { data, error } = await supabase
      .from('food_preferences')
      .insert([preferenceData])
      .select();
    return { data, error };
  },
};

// Table planning functions
export const tables = {
  // Get all tables for a wedding
  getAll: async (weddingId) => {
    const { data, error } = await supabase
      .from('tables')
      .select('*')
      .eq('wedding_id', weddingId);
    return { data, error };
  },

  // Get table assignments for a wedding
  getAssignments: async (weddingId) => {
    const { data, error } = await supabase
      .from('table_assignments')
      .select('*, guests(*), tables(*)')
      .eq('wedding_id', weddingId);
    return { data, error };
  },

  // Assign a guest to a table
  assignGuest: async (assignmentData) => {
    const { data, error } = await supabase
      .from('table_assignments')
      .insert([assignmentData])
      .select();
    return { data, error };
  },
};

// Wedding management functions
export const weddings = {
  // Get wedding details
  getDetails: async (weddingId) => {
    const { data, error } = await supabase
      .from('weddings')
      .select('*')
      .eq('id', weddingId)
      .single();
    return { data, error };
  },

  // Update wedding details
  updateDetails: async (weddingId, weddingData) => {
    const { data, error } = await supabase
      .from('weddings')
      .update(weddingData)
      .eq('id', weddingId)
      .select();
    return { data, error };
  },
};

// Statistics functions
export const statistics = {
  // Get RSVP statistics for a wedding
  getRsvpStats: async (weddingId) => {
    const { data, error } = await supabase
      .rpc('get_rsvp_statistics', { wedding_id: weddingId });
    return { data, error };
  },

  // Get menu preference statistics for a wedding
  getMenuStats: async (weddingId) => {
    const { data, error } = await supabase
      .rpc('get_menu_statistics', { wedding_id: weddingId });
    return { data, error };
  },
};

export default {
  auth,
  guests,
  rsvp,
  menu,
  tables,
  weddings,
  statistics,
  supabase,
};
