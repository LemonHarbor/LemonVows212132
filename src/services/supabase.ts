import { createClient } from '@supabase/supabase-js';

// Use environment variables with fallback values for local development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jodqlliylhmwgpurfzxm.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZHFsbGl5bGhtd2dwdXJmenhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5ODI4ODgsImV4cCI6MjA1ODU1ODg4OH0.7vcXDTNdjsIpnpe-06qSyuu3K-pQVwtYpLueUuzDzDk';

// Create a single supabase client for interacting with the database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth functions
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  return { data, error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { data, error };
};

// Wedding data functions
export const createWedding = async (weddingData) => {
  const { data, error } = await supabase
    .from('weddings')
    .insert([weddingData])
    .select();
  return { data, error };
};

export const getWedding = async (weddingId) => {
  const { data, error } = await supabase
    .from('weddings')
    .select('*')
    .eq('id', weddingId)
    .single();
  return { data, error };
};

export const updateWedding = async (weddingId, weddingData) => {
  const { data, error } = await supabase
    .from('weddings')
    .update(weddingData)
    .eq('id', weddingId)
    .select();
  return { data, error };
};

// Guest management functions
export const createGuest = async (guestData) => {
  const { data, error } = await supabase
    .from('guests')
    .insert([guestData])
    .select();
  return { data, error };
};

export const getGuests = async (weddingId) => {
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .eq('wedding_id', weddingId);
  return { data, error };
};

export const updateGuest = async (guestId, guestData) => {
  const { data, error } = await supabase
    .from('guests')
    .update(guestData)
    .eq('id', guestId)
    .select();
  return { data, error };
};

export const deleteGuest = async (guestId) => {
  const { error } = await supabase
    .from('guests')
    .delete()
    .eq('id', guestId);
  return { error };
};

export const updateGuestRsvp = async (guestId, rsvpStatus) => {
  const { data, error } = await supabase
    .from('guests')
    .update({ rsvp_status: rsvpStatus })
    .eq('id', guestId)
    .select();
  return { data, error };
};

// Table planner functions
export const createTable = async (tableData) => {
  const { data, error } = await supabase
    .from('tables')
    .insert([tableData])
    .select();
  return { data, error };
};

export const getTables = async (weddingId) => {
  const { data, error } = await supabase
    .from('tables')
    .select('*')
    .eq('wedding_id', weddingId);
  return { data, error };
};

export const updateTable = async (tableId, tableData) => {
  const { data, error } = await supabase
    .from('tables')
    .update(tableData)
    .eq('id', tableId)
    .select();
  return { data, error };
};

export const deleteTable = async (tableId) => {
  const { error } = await supabase
    .from('tables')
    .delete()
    .eq('id', tableId);
  return { error };
};

export const assignGuestToTable = async (guestId, tableId) => {
  const { data, error } = await supabase
    .from('guests')
    .update({ table_id: tableId })
    .eq('id', guestId)
    .select();
  return { data, error };
};

// Budget planner functions
export const createBudgetItem = async (budgetItemData) => {
  const { data, error } = await supabase
    .from('budget_items')
    .insert([budgetItemData])
    .select();
  return { data, error };
};

export const getBudgetItems = async (weddingId) => {
  const { data, error } = await supabase
    .from('budget_items')
    .select('*')
    .eq('wedding_id', weddingId);
  return { data, error };
};

export const updateBudgetItem = async (budgetItemId, budgetItemData) => {
  const { data, error } = await supabase
    .from('budget_items')
    .update(budgetItemData)
    .eq('id', budgetItemId)
    .select();
  return { data, error };
};

export const deleteBudgetItem = async (budgetItemId) => {
  const { error } = await supabase
    .from('budget_items')
    .delete()
    .eq('id', budgetItemId);
  return { error };
};

// Music playlist functions
export const createMusicRequest = async (musicRequestData) => {
  const { data, error } = await supabase
    .from('music_requests')
    .insert([musicRequestData])
    .select();
  return { data, error };
};

export const getMusicRequests = async (weddingId) => {
  const { data, error } = await supabase
    .from('music_requests')
    .select('*')
    .eq('wedding_id', weddingId);
  return { data, error };
};

export const updateMusicRequest = async (musicRequestId, musicRequestData) => {
  const { data, error } = await supabase
    .from('music_requests')
    .update(musicRequestData)
    .eq('id', musicRequestId)
    .select();
  return { data, error };
};

export const deleteMusicRequest = async (musicRequestId) => {
  const { error } = await supabase
    .from('music_requests')
    .delete()
    .eq('id', musicRequestId);
  return { error };
};

export const voteMusicRequest = async (musicRequestId, voteType) => {
  // Get current votes
  const { data: currentData, error: fetchError } = await supabase
    .from('music_requests')
    .select('upvotes, downvotes')
    .eq('id', musicRequestId)
    .single();
  
  if (fetchError) return { error: fetchError };
  
  // Update votes
  const updateData = voteType === 'up' 
    ? { upvotes: (currentData.upvotes || 0) + 1 }
    : { downvotes: (currentData.downvotes || 0) + 1 };
  
  const { data, error } = await supabase
    .from('music_requests')
    .update(updateData)
    .eq('id', musicRequestId)
    .select();
  
  return { data, error };
};

// Gallery functions
export const uploadImage = async (weddingId, file, metadata = {}) => {
  const fileName = `${weddingId}/${Date.now()}-${file.name}`;
  
  // Upload image
  const { data, error } = await supabase.storage
    .from('gallery')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });
  
  if (error) return { error };
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from('gallery')
    .getPublicUrl(fileName);
  
  // Create gallery entry
  const galleryEntry = {
    wedding_id: weddingId,
    url: urlData.publicUrl,
    title: metadata.title || file.name,
    uploaded_by: metadata.uploaded_by || 'Unknown',
    is_private: metadata.is_private || false,
    upload_date: new Date().toISOString(),
  };
  
  const { data: galleryData, error: galleryError } = await supabase
    .from('gallery_images')
    .insert([galleryEntry])
    .select();
  
  return { data: galleryData, error: galleryError };
};

export const getGalleryImages = async (weddingId, includePrivate = false) => {
  let query = supabase
    .from('gallery_images')
    .select('*')
    .eq('wedding_id', weddingId);
  
  if (!includePrivate) {
    query = query.eq('is_private', false);
  }
  
  const { data, error } = await query;
  return { data, error };
};

export const updateGalleryImage = async (imageId, imageData) => {
  const { data, error } = await supabase
    .from('gallery_images')
    .update(imageData)
    .eq('id', imageId)
    .select();
  return { data, error };
};

export const deleteGalleryImage = async (imageId, fileName) => {
  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('gallery')
    .remove([fileName]);
  
  // Delete from database
  const { error } = await supabase
    .from('gallery_images')
    .delete()
    .eq('id', imageId);
  
  return { error: error || storageError };
};

// Admin functions
export const getUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*');
  return { data, error };
};

export const updateUserRole = async (userId, role) => {
  const { data, error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', userId)
    .select();
  return { data, error };
};

export const getWeddingSettings = async (weddingId) => {
  const { data, error } = await supabase
    .from('weddings')
    .select('settings')
    .eq('id', weddingId)
    .single();
  return { data, error };
};

export const updateWeddingSettings = async (weddingId, settings) => {
  const { data, error } = await supabase
    .from('weddings')
    .update({ settings })
    .eq('id', weddingId)
    .select();
  return { data, error };
};

// Subscription functions for real-time updates
export const subscribeToGuests = (weddingId, callback) => {
  return supabase
    .channel('guests-channel')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'guests',
      filter: `wedding_id=eq.${weddingId}`
    }, callback)
    .subscribe();
};

export const subscribeToTables = (weddingId, callback) => {
  return supabase
    .channel('tables-channel')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'tables',
      filter: `wedding_id=eq.${weddingId}`
    }, callback)
    .subscribe();
};

export const subscribeToBudget = (weddingId, callback) => {
  return supabase
    .channel('budget-channel')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'budget_items',
      filter: `wedding_id=eq.${weddingId}`
    }, callback)
    .subscribe();
};

export const subscribeToMusicRequests = (weddingId, callback) => {
  return supabase
    .channel('music-channel')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'music_requests',
      filter: `wedding_id=eq.${weddingId}`
    }, callback)
    .subscribe();
};

export const subscribeToGallery = (weddingId, callback) => {
  return supabase
    .channel('gallery-channel')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'gallery_images',
      filter: `wedding_id=eq.${weddingId}`
    }, callback)
    .subscribe();
};

// Health check function to verify Supabase connection
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('weddings').select('id').limit(1);
    if (error) throw error;
    return { connected: true, data };
  } catch (error) {
    console.error('Supabase connection error:', error);
    return { connected: false, error };
  }
};

// Function to initialize database schema if needed
export const initializeDatabase = async () => {
  // This function would be used to create tables if they don't exist
  // For Supabase, this is typically done through the Supabase dashboard
  // But we can check if tables exist and report status
  
  const tables = ['weddings', 'guests', 'tables', 'budget_items', 'music_requests', 'gallery_images'];
  const results = {};
  
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
