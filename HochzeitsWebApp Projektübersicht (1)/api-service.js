// LemonVows API Service
// This file provides a service to connect the frontend with the Supabase backend

import { createClient } from '@supabase/supabase-js';

class ApiService {
  constructor() {
    // Initialize Supabase client
    this.supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    this.supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
    
    // Get current user session
    this.session = null;
    this.loadSession();
  }
  
  // Load user session
  async loadSession() {
    const { data, error } = await this.supabase.auth.getSession();
    if (data && !error) {
      this.session = data.session;
    }
  }
  
  // Authentication methods
  
  async register(email, password, firstName, lastName) {
    try {
      // Register user with Supabase Auth
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });
      
      if (authError) throw authError;
      
      // Create user profile
      if (authData.user) {
        const { error: profileError } = await this.supabase
          .from('user_profiles')
          .insert([{
            id: authData.user.id,
            first_name: firstName,
            last_name: lastName,
            email: email,
            role: 'couple'
          }]);
        
        if (profileError) throw profileError;
      }
      
      return { success: true, data: authData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async login(email, password) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      this.session = data.session;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async logout() {
    try {
      const { error } = await this.supabase.auth.signOut();
      
      if (error) throw error;
      
      this.session = null;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async getCurrentUser() {
    if (!this.session) await this.loadSession();
    
    if (!this.session) {
      return { success: false, error: 'No active session' };
    }
    
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser();
      
      if (error) throw error;
      
      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  // Wedding methods
  
  async getWeddings() {
    try {
      const { data, error } = await this.supabase
        .from('weddings')
        .select('*');
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async getWedding(id) {
    try {
      const { data, error } = await this.supabase
        .from('weddings')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async createWedding(weddingData) {
    try {
      const { data, error } = await this.supabase
        .from('weddings')
        .insert([{
          user_id: this.session.user.id,
          partner_id: weddingData.partnerId || null,
          title: weddingData.title,
          date: weddingData.date,
          location: weddingData.location,
          venue: weddingData.venue,
          style: weddingData.style,
          primary_color: weddingData.primaryColor,
          secondary_color: weddingData.secondaryColor,
          language: weddingData.language || 'de'
        }])
        .select();
      
      if (error) throw error;
      
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async updateWedding(id, weddingData) {
    try {
      const { data, error } = await this.supabase
        .from('weddings')
        .update({
          title: weddingData.title,
          date: weddingData.date,
          location: weddingData.location,
          venue: weddingData.venue,
          style: weddingData.style,
          primary_color: weddingData.primaryColor,
          secondary_color: weddingData.secondaryColor,
          language: weddingData.language,
          partner_id: weddingData.partnerId
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async deleteWedding(id) {
    try {
      const { error } = await this.supabase
        .from('weddings')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  // Guest methods
  
  async getGuests(weddingId) {
    try {
      const { data, error } = await this.supabase
        .from('guests')
        .select('*')
        .eq('wedding_id', weddingId);
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async createGuest(weddingId, guestData) {
    try {
      const { data, error } = await this.supabase
        .from('guests')
        .insert([{
          wedding_id: weddingId,
          first_name: guestData.firstName,
          last_name: guestData.lastName,
          email: guestData.email,
          phone: guestData.phone,
          address: guestData.address,
          group_name: guestData.groupName,
          rsvp_status: guestData.rsvpStatus || 'pending',
          plus_one: guestData.plusOne || false,
          plus_one_name: guestData.plusOneName,
          meal_preference: guestData.mealPreference,
          dietary_restrictions: guestData.dietaryRestrictions,
          accommodation_needed: guestData.accommodationNeeded || false,
          is_witness: guestData.isWitness || false,
          notes: guestData.notes
        }])
        .select();
      
      if (error) throw error;
      
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async updateGuest(id, guestData) {
    try {
      const { data, error } = await this.supabase
        .from('guests')
        .update({
          first_name: guestData.firstName,
          last_name: guestData.lastName,
          email: guestData.email,
          phone: guestData.phone,
          address: guestData.address,
          group_name: guestData.groupName,
          rsvp_status: guestData.rsvpStatus,
          rsvp_date: guestData.rsvpStatus !== 'pending' ? new Date().toISOString() : null,
          plus_one: guestData.plusOne,
          plus_one_name: guestData.plusOneName,
          meal_preference: guestData.mealPreference,
          dietary_restrictions: guestData.dietaryRestrictions,
          accommodation_needed: guestData.accommodationNeeded,
          is_witness: guestData.isWitness,
          notes: guestData.notes
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async deleteGuest(id) {
    try {
      const { error } = await this.supabase
        .from('guests')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  // Table methods
  
  async getTables(weddingId) {
    try {
      const { data, error } = await this.supabase
        .from('tables')
        .select('*')
        .eq('wedding_id', weddingId);
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async createTable(weddingId, tableData) {
    try {
      const { data, error } = await this.supabase
        .from('tables')
        .insert([{
          wedding_id: weddingId,
          name: tableData.name,
          shape: tableData.shape || 'round',
          capacity: tableData.capacity || 8,
          position_x: tableData.positionX || 0,
          position_y: tableData.positionY || 0,
          width: tableData.width || 100,
          height: tableData.height || 100,
          rotation: tableData.rotation || 0
        }])
        .select();
      
      if (error) throw error;
      
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async updateTable(id, tableData) {
    try {
      const { data, error } = await this.supabase
        .from('tables')
        .update({
          name: tableData.name,
          shape: tableData.shape,
          capacity: tableData.capacity,
          position_x: tableData.positionX,
          position_y: tableData.positionY,
          width: tableData.width,
          height: tableData.height,
          rotation: tableData.rotation
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async deleteTable(id) {
    try {
      const { error } = await this.supabase
        .from('tables')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  // Seating methods
  
  async getSeatings(tableId) {
    try {
      const { data, error } = await this.supabase
        .from('seatings')
        .select('*, guests(*)')
        .eq('table_id', tableId);
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async createSeating(tableId, guestId, seatNumber) {
    try {
      const { data, error } = await this.supabase
        .from('seatings')
        .insert([{
          table_id: tableId,
          guest_id: guestId,
          seat_number: seatNumber
        }])
        .select();
      
      if (error) throw error;
      
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async updateSeating(id, seatNumber) {
    try {
      const { data, error } = await this.supabase
        .from('seatings')
        .update({
          seat_number: seatNumber
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async deleteSeating(id) {
    try {
      const { error } = await this.supabase
        .from('seatings')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  // Budget methods
  
  async getBudgetCategories(weddingId) {
    try {
      const { data, error } = await this.supabase
        .from('budget_categories')
        .select('*')
        .eq('wedding_id', weddingId);
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async getBudgetItems(weddingId) {
    try {
      const { data, error } = await this.supabase
        .from('budget_items')
        .select('*, budget_categories(*)')
        .eq('wedding_id', weddingId);
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async createBudgetItem(weddingId, budgetItemData) {
    try {
      const { data, error } = await this.supabase
        .from('budget_items')
        .insert([{
          wedding_id: weddingId,
          category_id: budgetItemData.categoryId,
          name: budgetItemData.name,
          description: budgetItemData.description,
          estimated_cost: budgetItemData.estimatedCost,
          actual_cost: budgetItemData.actualCost || 0,
          is_paid: budgetItemData.isPaid || false,
          payment_date: budgetItemData.paymentDate,
          vendor: budgetItemData.vendor,
          notes: budgetItemData.notes
        }])
        .select();
      
      if (error) throw error;
      
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  // Timeline methods
  
  async getTimelinePhases(weddingId) {
    try {
      const { data, error } = await this.supabase
        .from('timeline_phases')
        .select('*')
        .eq('wedding_id', weddingId)
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async getTimelineEvents(weddingId) {
    try {
      const { data, error } = await this.supabase
        .from('timeline_events')
        .select('*, timeline_phases(*)')
        .eq('wedding_id', weddingId)
        .order('date', { ascending: true });
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async createTimelineEvent(weddingId, eventData) {
    try {
      const { data, error } = await this.supabase
        .from('timeline_events')
        .insert([{
          wedding_id: weddingId,
          phase_id: eventData.phaseId,
          title: eventData.title,
          description: eventData.description,
          date: eventData.date,
          status: eventData.status || 'upcoming',
          assignee: eventData.assignee,
          is_milestone: eventData.isMilestone || false,
          notes: eventData.notes
        }])
        .select();
      
      if (error) throw error;
      
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  // Witness tasks methods
  
  async getWitnessTasks(weddingId) {
    try {
      const { data, error } = await this.supabase
        .from('witness_tasks')
        .select('*, guests(*)')
        .eq('wedding_id', weddingId);
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async createWitnessTask(weddingId, taskData) {
    try {
      const { data, error } = await this.supabase
        .from('witness_tasks')
        .insert([{
          wedding_id: weddingId,
          assigned_to: taskData.assignedTo,
          title: taskData.title,
          description: taskData.description,
          due_date: taskData.dueDate,
          status: taskData.status || 'pending',
          priority: taskData.priority || 'medium',
          category: taskData.category || 'general',
          notes: taskData.notes
        }])
        .select();
      
      if (error) throw error;
      
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  // Moodboard methods
  
  async getMoodboardCategories(weddingId) {
    try {
      const { data, error } = await this.supabase
        .from('moodboard_categories')
        .select('*')
        .eq('wedding_id', weddingId);
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async getMoodboardImages(weddingId) {
    try {
      const { data, error } = await this.supabase
        .from('moodboard_images')
        .select('*, moodboard_categories(*)')
        .eq('wedding_id', weddingId);
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async createMoodboardImage(weddingId, imageData) {
    try {
      const { data, error } = await this.supabase
        .from('moodboard_images')
        .insert([{
          wedding_id: weddingId,
          category_id: imageData.categoryId,
          title: imageData.title,
          url: imageData.url,
          colors: imageData.colors || [],
          is_featured: imageData.isFeatured || false,
          notes: imageData.notes,
          source: imageData.source || 'url'
        }])
        .select();
      
      if (error) throw error;
      
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  // File storage methods
  
  async uploadFile(bucket, path, file) {
    try {
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .upload(path, file);
      
      if (error) throw error;
      
      // Get public URL
      const { data: urlData } = this.supabase.storage
        .from(bucket)
        .getPublicUrl(path);
      
      return { success: true, data: { ...data, publicUrl: urlData.publicUrl } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async deleteFile(bucket, path) {
    try {
      const { error } = await this.supabase.storage
        .from(bucket)
        .remove([path]);
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  // Subscription methods
  
  async updateSubscription(weddingId, tier) {
    try {
      const { data, error } = await this.supabase
        .from('weddings')
        .update({
          subscription_tier: tier,
          subscription_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year from now
        })
        .eq('id', weddingId)
        .select();
      
      if (error) throw error;
      
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
