import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://jodqlliylhmwgpurfzxm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZHFsbGl5bGhtd2dwdXJmenhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5ODI4ODgsImV4cCI6MjA1ODU1ODg4OH0.7vcXDTNdjsIpnpe-06qSyuu3K-pQVwtYpLueUuzDzDk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions
export interface Wedding {
  id: string;
  name: string;
  date: string;
  location: string;
  couple_names: string;
  theme: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Table {
  id: string;
  wedding_id: string;
  name: string;
  capacity: number;
  shape: 'round' | 'rectangle' | 'square' | 'oval';
  position_x: number;
  position_y: number;
  created_at: string;
  updated_at: string;
}

export interface BudgetItem {
  id: string;
  wedding_id: string;
  category: string;
  name: string;
  estimated_cost: number;
  actual_cost: number;
  paid: boolean;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface MusicRequest {
  id: string;
  wedding_id: string;
  song_title: string;
  artist: string;
  requested_by: string;
  votes: number;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  wedding_id: string;
  url: string;
  caption: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

// Wedding API functions
export const createWedding = async (weddingData: Omit<Wedding, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('weddings')
    .insert([
      { 
        ...weddingData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ])
    .select()
    .single();
  
  return { data, error };
};

export const getWedding = async (weddingId: string) => {
  const { data, error } = await supabase
    .from('weddings')
    .select('*')
    .eq('id', weddingId)
    .single();
  
  return { data, error };
};

export const updateWedding = async (weddingId: string, updates: Partial<Wedding>) => {
  const { data, error } = await supabase
    .from('weddings')
    .update({ 
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', weddingId)
    .select()
    .single();
  
  return { data, error };
};

// Table API functions
export const createTable = async (tableData: Omit<Table, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('tables')
    .insert([
      { 
        ...tableData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ])
    .select()
    .single();
  
  return { data, error };
};

export const getTables = async (weddingId: string) => {
  const { data, error } = await supabase
    .from('tables')
    .select('*')
    .eq('wedding_id', weddingId)
    .order('name');
  
  return { data, error };
};

export const updateTable = async (tableId: string, updates: Partial<Table>) => {
  const { data, error } = await supabase
    .from('tables')
    .update({ 
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', tableId)
    .select()
    .single();
  
  return { data, error };
};

export const deleteTable = async (tableId: string) => {
  const { error } = await supabase
    .from('tables')
    .delete()
    .eq('id', tableId);
  
  return { error };
};

// Budget API functions
export const createBudgetItem = async (budgetItemData: Omit<BudgetItem, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('budget_items')
    .insert([
      { 
        ...budgetItemData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ])
    .select()
    .single();
  
  return { data, error };
};

export const getBudgetItems = async (weddingId: string) => {
  const { data, error } = await supabase
    .from('budget_items')
    .select('*')
    .eq('wedding_id', weddingId)
    .order('category');
  
  return { data, error };
};

export const updateBudgetItem = async (itemId: string, updates: Partial<BudgetItem>) => {
  const { data, error } = await supabase
    .from('budget_items')
    .update({ 
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', itemId)
    .select()
    .single();
  
  return { data, error };
};

export const deleteBudgetItem = async (itemId: string) => {
  const { error } = await supabase
    .from('budget_items')
    .delete()
    .eq('id', itemId);
  
  return { error };
};

// Music API functions
export const createMusicRequest = async (musicRequestData: Omit<MusicRequest, 'id' | 'votes' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('music_requests')
    .insert([
      { 
        ...musicRequestData,
        votes: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ])
    .select()
    .single();
  
  return { data, error };
};

export const getMusicRequests = async (weddingId: string) => {
  const { data, error } = await supabase
    .from('music_requests')
    .select('*')
    .eq('wedding_id', weddingId)
    .order('votes', { ascending: false });
  
  return { data, error };
};

export const voteMusicRequest = async (requestId: string, currentVotes: number) => {
  const { data, error } = await supabase
    .from('music_requests')
    .update({ 
      votes: currentVotes + 1,
      updated_at: new Date().toISOString()
    })
    .eq('id', requestId)
    .select()
    .single();
  
  return { data, error };
};

export const deleteMusicRequest = async (requestId: string) => {
  const { error } = await supabase
    .from('music_requests')
    .delete()
    .eq('id', requestId);
  
  return { error };
};

// Gallery API functions
export const uploadImage = async (weddingId: string, file: File, caption: string, uploadedBy: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `${weddingId}/${fileName}`;
  
  const { error: uploadError } = await supabase.storage
    .from('gallery')
    .upload(filePath, file);
  
  if (uploadError) {
    return { data: null, error: uploadError };
  }
  
  const { data: urlData } = supabase.storage
    .from('gallery')
    .getPublicUrl(filePath);
  
  const url = urlData.publicUrl;
  
  const { data, error } = await supabase
    .from('gallery_images')
    .insert([
      { 
        wedding_id: weddingId,
        url,
        caption,
        uploaded_by: uploadedBy,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ])
    .select()
    .single();
  
  return { data, error };
};

export const getGalleryImages = async (weddingId: string) => {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('wedding_id', weddingId)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const deleteGalleryImage = async (imageId: string) => {
  // First get the image to get the URL
  const { data: image, error: getError } = await supabase
    .from('gallery_images')
    .select('url')
    .eq('id', imageId)
    .single();
  
  if (getError || !image) {
    return { error: getError };
  }
  
  // Extract the path from the URL
  const url = new URL(image.url);
  const pathParts = url.pathname.split('/');
  const filePath = pathParts[pathParts.length - 2] + '/' + pathParts[pathParts.length - 1];
  
  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('gallery')
    .remove([filePath]);
  
  if (storageError) {
    return { error: storageError };
  }
  
  // Delete from database
  const { error } = await supabase
    .from('gallery_images')
    .delete()
    .eq('id', imageId);
  
  return { error };
};

// Settings API functions
export const getWeddingSettings = async (weddingId: string) => {
  const { data, error } = await supabase
    .from('weddings')
    .select('settings')
    .eq('id', weddingId)
    .single();
  
  return { data: data?.settings, error };
};

export const updateWeddingSettings = async (weddingId: string, settings: Record<string, any>) => {
  const { data, error } = await supabase
    .from('weddings')
    .update({ 
      settings,
      updated_at: new Date().toISOString()
    })
    .eq('id', weddingId)
    .select()
    .single();
  
  return { data, error };
};

// Realtime subscriptions
export const subscribeToGuests = (weddingId: string, callback: (payload: any) => void) => {
  const subscription = supabase
    .channel('guests-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'guests',
      filter: `wedding_id=eq.${weddingId}`
    }, callback)
    .subscribe();
  
  return subscription;
};

export const subscribeToTables = (weddingId: string, callback: (payload: any) => void) => {
  const subscription = supabase
    .channel('tables-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'tables',
      filter: `wedding_id=eq.${weddingId}`
    }, callback)
    .subscribe();
  
  return subscription;
};

export const subscribeToBudget = (weddingId: string, callback: (payload: any) => void) => {
  const subscription = supabase
    .channel('budget-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'budget_items',
      filter: `wedding_id=eq.${weddingId}`
    }, callback)
    .subscribe();
  
  return subscription;
};

export const subscribeToMusicRequests = (weddingId: string, callback: (payload: any) => void) => {
  const subscription = supabase
    .channel('music-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'music_requests',
      filter: `wedding_id=eq.${weddingId}`
    }, callback)
    .subscribe();
  
  return subscription;
};

export const subscribeToGallery = (weddingId: string, callback: (payload: any) => void) => {
  const subscription = supabase
    .channel('gallery-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'gallery_images',
      filter: `wedding_id=eq.${weddingId}`
    }, callback)
    .subscribe();
  
  return subscription;
};

// Database setup and validation
export const validateDatabase = async () => {
  const tables = [
    'weddings',
    'guests',
    'tables',
    'budget_items',
    'music_requests',
    'gallery_images'
  ];
  
  const results: Record<string, { exists: boolean; error: any }> = {};
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('id').limit(1);
      results[table] = { exists: !error, error };
    } catch (error) {
      results[table] = { exists: false, error };
    }
  }
  
  return results;
};

// Authentication functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { data, error };
};

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  return { data, error };
};

export const updatePassword = async (password: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });
  
  return { data, error };
};
