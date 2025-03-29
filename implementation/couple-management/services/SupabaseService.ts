import { createClient } from '@supabase/supabase-js';

// Supabase connection details
const supabaseUrl = 'https://jodqliylhmwgpurfzxm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZHFsaXlsaG13Z3B1cmZ6eG0iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcxNjk2MzA1OCwiZXhwIjoyMDMyNTM5MDU4fQ.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZHFsaXlsaG13Z3B1cmZ6eG0iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcxNjk2MzA1OCwiZXhwIjoyMDMyNTM5MDU4fQ.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZHFsaXlsaG13Z3B1cmZ6eG0iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcxNjk2MzA1OCwiZXhwIjoyMDMyNTM5MDU4fQ';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// User authentication services
export const authService = {
  // Register a new user
  register: async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },
  
  // Login user
  login: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },
  
  // Logout user
  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  },
  
  // Get current user
  getCurrentUser: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },
  
  // Reset password
  resetPassword: async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },
  
  // Update user
  updateUser: async (userData: any) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: userData
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
};

// Couple management services
export const coupleService = {
  // Create a new couple
  createCouple: async (coupleData: any) => {
    try {
      const { data, error } = await supabase
        .from('couples')
        .insert([coupleData])
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating couple:', error);
      throw error;
    }
  },
  
  // Get couple by ID
  getCoupleById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('couples')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting couple:', error);
      throw error;
    }
  },
  
  // Get couple by user ID
  getCoupleByUserId: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('couples')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting couple by user ID:', error);
      throw error;
    }
  },
  
  // Update couple
  updateCouple: async (id: string, coupleData: any) => {
    try {
      const { data, error } = await supabase
        .from('couples')
        .update(coupleData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating couple:', error);
      throw error;
    }
  },
  
  // Delete couple
  deleteCouple: async (id: string) => {
    try {
      const { error } = await supabase
        .from('couples')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting couple:', error);
      throw error;
    }
  },
  
  // Get all couples (admin only)
  getAllCouples: async () => {
    try {
      const { data, error } = await supabase
        .from('couples')
        .select('*');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting all couples:', error);
      throw error;
    }
  }
};

// Wedding management services
export const weddingService = {
  // Create a new wedding
  createWedding: async (weddingData: any) => {
    try {
      const { data, error } = await supabase
        .from('weddings')
        .insert([weddingData])
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating wedding:', error);
      throw error;
    }
  },
  
  // Get wedding by ID
  getWeddingById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('weddings')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting wedding:', error);
      throw error;
    }
  },
  
  // Get wedding by couple ID
  getWeddingByCoupleId: async (coupleId: string) => {
    try {
      const { data, error } = await supabase
        .from('weddings')
        .select('*')
        .eq('couple_id', coupleId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting wedding by couple ID:', error);
      throw error;
    }
  },
  
  // Update wedding
  updateWedding: async (id: string, weddingData: any) => {
    try {
      const { data, error } = await supabase
        .from('weddings')
        .update(weddingData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating wedding:', error);
      throw error;
    }
  },
  
  // Delete wedding
  deleteWedding: async (id: string) => {
    try {
      const { error } = await supabase
        .from('weddings')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting wedding:', error);
      throw error;
    }
  }
};

// Guest management services
export const guestService = {
  // Create a new guest
  createGuest: async (guestData: any) => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .insert([guestData])
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating guest:', error);
      throw error;
    }
  },
  
  // Get guest by ID
  getGuestById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting guest:', error);
      throw error;
    }
  },
  
  // Get guests by wedding ID
  getGuestsByWeddingId: async (weddingId: string) => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('wedding_id', weddingId);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting guests by wedding ID:', error);
      throw error;
    }
  },
  
  // Update guest
  updateGuest: async (id: string, guestData: any) => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .update(guestData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating guest:', error);
      throw error;
    }
  },
  
  // Delete guest
  deleteGuest: async (id: string) => {
    try {
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting guest:', error);
      throw error;
    }
  },
  
  // Bulk create guests
  bulkCreateGuests: async (guestsData: any[]) => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .insert(guestsData)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error bulk creating guests:', error);
      throw error;
    }
  }
};

// Table planner services
export const tablePlannerService = {
  // Create a new table
  createTable: async (tableData: any) => {
    try {
      const { data, error } = await supabase
        .from('tables')
        .insert([tableData])
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating table:', error);
      throw error;
    }
  },
  
  // Get tables by wedding ID
  getTablesByWeddingId: async (weddingId: string) => {
    try {
      const { data, error } = await supabase
        .from('tables')
        .select('*')
        .eq('wedding_id', weddingId);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting tables by wedding ID:', error);
      throw error;
    }
  },
  
  // Update table
  updateTable: async (id: string, tableData: any) => {
    try {
      const { data, error } = await supabase
        .from('tables')
        .update(tableData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating table:', error);
      throw error;
    }
  },
  
  // Delete table
  deleteTable: async (id: string) => {
    try {
      const { error } = await supabase
        .from('tables')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting table:', error);
      throw error;
    }
  },
  
  // Assign guest to table
  assignGuestToTable: async (guestId: string, tableId: string, seatIndex: number) => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .update({
          table_id: tableId,
          seat_index: seatIndex
        })
        .eq('id', guestId)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error assigning guest to table:', error);
      throw error;
    }
  },
  
  // Remove guest from table
  removeGuestFromTable: async (guestId: string) => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .update({
          table_id: null,
          seat_index: null
        })
        .eq('id', guestId)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error removing guest from table:', error);
      throw error;
    }
  }
};

// Music voting services
export const musicService = {
  // Add song to playlist
  addSong: async (songData: any) => {
    try {
      const { data, error } = await supabase
        .from('songs')
        .insert([songData])
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding song:', error);
      throw error;
    }
  },
  
  // Get songs by wedding ID
  getSongsByWeddingId: async (weddingId: string) => {
    try {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('wedding_id', weddingId)
        .order('votes', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting songs by wedding ID:', error);
      throw error;
    }
  },
  
  // Vote for song
  voteSong: async (songId: string, voteType: 'up' | 'down') => {
    try {
      // First get current votes
      const { data: songData, error: fetchError } = await supabase
        .from('songs')
        .select('votes')
        .eq('id', songId)
        .single();
      
      if (fetchError) throw fetchError;
      
      const currentVotes = songData.votes || 0;
      const newVotes = voteType === 'up' ? currentVotes + 1 : Math.max(0, currentVotes - 1);
      
      const { data, error } = await supabase
        .from('songs')
        .update({ votes: newVotes })
        .eq('id', songId)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error voting for song:', error);
      throw error;
    }
  },
  
  // Delete song
  deleteSong: async (songId: string) => {
    try {
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', songId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting song:', error);
      throw error;
    }
  }
};

// Budget planner services
export const budgetService = {
  // Create budget category
  createBudgetCategory: async (categoryData: any) => {
    try {
      const { data, error } = await supabase
        .from('budget_categories')
        .insert([categoryData])
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating budget category:', error);
      throw error;
    }
  },
  
  // Get budget categories by wedding ID
  getBudgetCategoriesByWeddingId: async (weddingId: string) => {
    try {
      const { data, error } = await supabase
        .from('budget_categories')
        .select('*, budget_items(*)')
        .eq('wedding_id', weddingId);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting budget categories:', error);
      throw error;
    }
  },
  
  // Update budget category
  updateBudgetCategory: async (id: string, categoryData: any) => {
    try {
      const { data, error } = await supabase
        .from('budget_categories')
        .update(categoryData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating budget category:', error);
      throw error;
    }
  },
  
  // Delete budget category
  deleteBudgetCategory: async (id: string) => {
    try {
      const { error } = await supabase
        .from('budget_categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting budget category:', error);
      throw error;
    }
  },
  
  // Create budget item
  createBudgetItem: async (itemData: any) => {
    try {
      const { data, error } = await supabase
        .from('budget_items')
        .insert([itemData])
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating budget item:', error);
      throw error;
    }
  },
  
  // Update budget item
  updateBudgetItem: async (id: string, itemData: any) => {
    try {
      const { data, error } = await supabase
        .from('budget_items')
        .update(itemData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating budget item:', error);
      throw error;
    }
  },
  
  // Delete budget item
  deleteBudgetItem: async (id: string) => {
    try {
      const { error } = await supabase
        .from('budget_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting budget item:', error);
      throw error;
    }
  }
};

// Checklist services
export const checklistService = {
  // Create checklist category
  createChecklistCategory: async (categoryData: any) => {
    try {
      const { data, error } = await supabase
        .from('checklist_categories')
        .insert([categoryData])
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating checklist category:', error);
      throw error;
    }
  },
  
  // Get checklist categories by wedding ID
  getChecklistCategoriesByWeddingId: async (weddingId: string) => {
    try {
      const { data, error } = await supabase
        .from('checklist_categories')
        .select('*, checklists(*)')
        .eq('wedding_id', weddingId);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting checklist categories:', error);
      throw error;
    }
  },
  
  // Create checklist
  createChecklist: async (checklistData: any) => {
    try {
      const { data, error } = await supabase
        .from('checklists')
        .insert([checklistData])
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating checklist:', error);
      throw error;
    }
  },
  
  // Get checklists by category ID
  getChecklistsByCategoryId: async (categoryId: string) => {
    try {
      const { data, error } = await supabase
        .from('checklists')
        .select('*, checklist_items(*)')
        .eq('category_id', categoryId);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting checklists:', error);
      throw error;
    }
  },
  
  // Create checklist item
  createChecklistItem: async (itemData: any) => {
    try {
      const { data, error } = await supabase
        .from('checklist_items')
        .insert([itemData])
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating checklist item:', error);
      throw error;
    }
  },
  
  // Update checklist item
  updateChecklistItem: async (id: string, itemData: any) => {
    try {
      const { data, error } = await supabase
        .from('checklist_items')
        .update(itemData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating checklist item:', error);
      throw error;
    }
  },
  
  // Toggle checklist item completion
  toggleChecklistItemCompletion: async (id: string, completed: boolean) => {
    try {
      const { data, error } = await supabase
        .from('checklist_items')
        .update({ completed })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error toggling checklist item completion:', error);
      throw error;
    }
  }
};

// Export the Supabase client for direct access if needed
export default supabase;
