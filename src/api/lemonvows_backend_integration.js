// LemonVows Backend Integration
// This file contains the backend integration for the LemonVows wedding planning app

// Using Supabase for backend services
// The code is structured to work with the database schema defined in lemonvows_test_data.sql

/**
 * api/auth.js - Authentication services
 */
import { supabase } from './supabase';

export const authService = {
  // Sign in with email and password
  async signIn(email, password) {
    const { user, error } = await supabase.auth.signIn({ email, password });
    return { user, error };
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current session
  getSession() {
    return supabase.auth.session();
  },

  // Get current user
  getCurrentUser() {
    return supabase.auth.user();
  },

  // Set up auth state change listener
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },

  // Get user details from the users table
  async getUserDetails(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    return { data, error };
  },

  // Update user details
  async updateUserDetails(userId, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId);
    
    return { data, error };
  },

  // Update user language preference
  async updateUserLanguage(userId, language) {
    const { data, error } = await supabase
      .from('users')
      .update({ preferred_language: language })
      .eq('id', userId);
    
    return { data, error };
  }
};

/**
 * api/weddings.js - Wedding management services
 */

export const weddingService = {
  // Get wedding by ID
  async getWedding(weddingId) {
    const { data, error } = await supabase
      .from('weddings')
      .select('*')
      .eq('id', weddingId)
      .single();
    
    return { data, error };
  },

  // Get wedding by couple ID
  async getWeddingByCouple(coupleId) {
    const { data, error } = await supabase
      .from('weddings')
      .select('*')
      .eq('couple_id', coupleId)
      .single();
    
    return { data, error };
  },

  // Create new wedding
  async createWedding(weddingData) {
    const { data, error } = await supabase
      .from('weddings')
      .insert([weddingData]);
    
    return { data, error };
  },

  // Update wedding
  async updateWedding(weddingId, updates) {
    const { data, error } = await supabase
      .from('weddings')
      .update(updates)
      .eq('id', weddingId);
    
    return { data, error };
  },

  // Delete wedding
  async deleteWedding(weddingId) {
    const { data, error } = await supabase
      .from('weddings')
      .delete()
      .eq('id', weddingId);
    
    return { data, error };
  },

  // Get all weddings (admin only)
  async getAllWeddings() {
    const { data, error } = await supabase
      .from('weddings')
      .select(`
        *,
        users:couple_id (
          first_name,
          last_name,
          email
        )
      `)
      .order('wedding_date', { ascending: true });
    
    return { data, error };
  }
};

/**
 * api/guests.js - Guest management services
 */
import { v4 as uuidv4 } from 'uuid';

// Helper function to generate RSVP code
const generateRsvpCode = (firstName, lastName) => {
  const firstPart = firstName.substring(0, 2).toLowerCase() + lastName.substring(0, 2).toLowerCase();
  const secondPart = Math.random().toString(36).substring(2, 5);
  const thirdPart = Math.random().toString(36).substring(2, 5);
  return `${firstPart}-${secondPart}-${thirdPart}`;
};

export const guestService = {
  // Get all guests for a wedding
  async getGuests(weddingId) {
    const { data, error } = await supabase
      .from('guests')
      .select(`
        *,
        rsvp_responses (*)
      `)
      .eq('wedding_id', weddingId)
      .order('last_name', { ascending: true });
    
    return { data, error };
  },

  // Get guest by ID
  async getGuest(guestId) {
    const { data, error } = await supabase
      .from('guests')
      .select(`
        *,
        rsvp_responses (*),
        guest_allergies (
          allergies (*)
        ),
        guest_menu_selections (
          menu_options (*)
        )
      `)
      .eq('id', guestId)
      .single();
    
    return { data, error };
  },

  // Get guest by RSVP code
  async getGuestByRsvpCode(rsvpCode) {
    const { data, error } = await supabase
      .from('guests')
      .select(`
        *,
        weddings (*),
        rsvp_responses (*),
        guest_allergies (
          allergies (*)
        ),
        guest_menu_selections (
          menu_options (*)
        )
      `)
      .eq('rsvp_code', rsvpCode)
      .single();
    
    return { data, error };
  },

  // Create new guest
  async createGuest(guestData) {
    // Generate RSVP code if not provided
    if (!guestData.rsvp_code) {
      guestData.rsvp_code = generateRsvpCode(guestData.first_name, guestData.last_name);
    }
    
    const { data, error } = await supabase
      .from('guests')
      .insert([guestData]);
    
    // Create initial RSVP response with pending status
    if (data && data.length > 0) {
      await supabase
        .from('rsvp_responses')
        .insert([{
          guest_id: data[0].id,
          response_status: 'pending',
          number_of_accompanying_persons: 0,
          needs_accommodation: false
        }]);
    }
    
    return { data, error };
  },

  // Update guest
  async updateGuest(guestId, updates) {
    const { data, error } = await supabase
      .from('guests')
      .update(updates)
      .eq('id', guestId);
    
    return { data, error };
  },

  // Delete guest
  async deleteGuest(guestId) {
    // First delete related records
    await supabase.from('rsvp_responses').delete().eq('guest_id', guestId);
    await supabase.from('guest_allergies').delete().eq('guest_id', guestId);
    await supabase.from('guest_menu_selections').delete().eq('guest_id', guestId);
    await supabase.from('table_assignments').delete().eq('guest_id', guestId);
    
    // Then delete the guest
    const { data, error } = await supabase
      .from('guests')
      .delete()
      .eq('id', guestId);
    
    return { data, error };
  },

  // Bulk import guests
  async bulkImportGuests(weddingId, guests) {
    const guestsToInsert = guests.map(guest => ({
      wedding_id: weddingId,
      first_name: guest.first_name,
      last_name: guest.last_name,
      email: guest.email,
      phone: guest.phone,
      address: guest.address,
      group_name: guest.group_name,
      rsvp_code: generateRsvpCode(guest.first_name, guest.last_name),
      invitation_sent: false
    }));
    
    const { data, error } = await supabase
      .from('guests')
      .insert(guestsToInsert);
    
    // Create initial RSVP responses
    if (data && data.length > 0) {
      const rsvpResponsesToInsert = data.map(guest => ({
        guest_id: guest.id,
        response_status: 'pending',
        number_of_accompanying_persons: 0,
        needs_accommodation: false
      }));
      
      await supabase
        .from('rsvp_responses')
        .insert(rsvpResponsesToInsert);
    }
    
    return { data, error };
  },

  // Mark invitations as sent
  async markInvitationsSent(guestIds) {
    const { data, error } = await supabase
      .from('guests')
      .update({
        invitation_sent: true,
        invitation_sent_date: new Date().toISOString()
      })
      .in('id', guestIds);
    
    return { data, error };
  }
};

/**
 * api/rsvp.js - RSVP management services
 */

export const rsvpService = {
  // Get RSVP response for a guest
  async getRsvpResponse(guestId) {
    const { data, error } = await supabase
      .from('rsvp_responses')
      .select('*')
      .eq('guest_id', guestId)
      .single();
    
    return { data, error };
  },

  // Submit RSVP response
  async submitRsvpResponse(guestId, responseData) {
    // Check if response exists
    const { data: existingResponse } = await supabase
      .from('rsvp_responses')
      .select('id')
      .eq('guest_id', guestId)
      .single();
    
    let result;
    
    if (existingResponse) {
      // Update existing response
      result = await supabase
        .from('rsvp_responses')
        .update({
          ...responseData,
          response_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('guest_id', guestId);
    } else {
      // Create new response
      result = await supabase
        .from('rsvp_responses')
        .insert([{
          guest_id: guestId,
          ...responseData,
          response_date: new Date().toISOString()
        }]);
    }
    
    return result;
  },

  // Update guest allergies
  async updateGuestAllergies(guestId, allergyIds) {
    // First delete existing allergies
    await supabase
      .from('guest_allergies')
      .delete()
      .eq('guest_id', guestId);
    
    // Then insert new allergies
    if (allergyIds && allergyIds.length > 0) {
      const allergiesToInsert = allergyIds.map(allergyId => ({
        guest_id: guestId,
        allergy_id: allergyId
      }));
      
      const { data, error } = await supabase
        .from('guest_allergies')
        .insert(allergiesToInsert);
      
      return { data, error };
    }
    
    return { data: null, error: null };
  },

  // Update guest menu selections
  async updateGuestMenuSelections(guestId, menuSelections) {
    // First delete existing selections
    await supabase
      .from('guest_menu_selections')
      .delete()
      .eq('guest_id', guestId);
    
    // Then insert new selections
    if (menuSelections && Object.keys(menuSelections).length > 0) {
      const selectionsToInsert = Object.entries(menuSelections).map(([course, menuOptionId]) => ({
        guest_id: guestId,
        menu_option_id: menuOptionId
      }));
      
      const { data, error } = await supabase
        .from('guest_menu_selections')
        .insert(selectionsToInsert);
      
      return { data, error };
    }
    
    return { data: null, error: null };
  }
};

/**
 * api/menu.js - Menu management services
 */

export const menuService = {
  // Get all menu options for a wedding
  async getMenuOptions(weddingId) {
    const { data, error } = await supabase
      .from('menu_options')
      .select('*')
      .eq('wedding_id', weddingId)
      .order('course', { ascending: true });
    
    return { data, error };
  },

  // Get menu options by course
  async getMenuOptionsByCourse(weddingId, course) {
    const { data, error } = await supabase
      .from('menu_options')
      .select('*')
      .eq('wedding_id', weddingId)
      .eq('course', course);
    
    return { data, error };
  },

  // Create new menu option
  async createMenuOption(menuOptionData) {
    const { data, error } = await supabase
      .from('menu_options')
      .insert([menuOptionData]);
    
    return { data, error };
  },

  // Update menu option
  async updateMenuOption(menuOptionId, updates) {
    const { data, error } = await supabase
      .from('menu_options')
      .update(updates)
      .eq('id', menuOptionId);
    
    return { data, error };
  },

  // Delete menu option
  async deleteMenuOption(menuOptionId) {
    // First check if the menu option is used in any guest selections
    const { data: usedSelections } = await supabase
      .from('guest_menu_selections')
      .select('id')
      .eq('menu_option_id', menuOptionId);
    
    if (usedSelections && usedSelections.length > 0) {
      return {
        data: null,
        error: {
          message: 'Cannot delete menu option that is selected by guests'
        }
      };
    }
    
    const { data, error } = await supabase
      .from('menu_options')
      .delete()
      .eq('id', menuOptionId);
    
    return { data, error };
  },

  // Get all allergies
  async getAllergies() {
    const { data, error } = await supabase
      .from('allergies')
      .select('*')
      .order('name', { ascending: true });
    
    return { data, error };
  }
};

/**
 * api/tables.js - Table management services
 */

export const tableService = {
  // Get all tables for a wedding
  async getTables(weddingId) {
    const { data, error } = await supabase
      .from('tables')
      .select(`
        *,
        table_assignments (
          guests (
            id,
            first_name,
            last_name,
            rsvp_responses (*)
          )
        )
      `)
      .eq('wedding_id', weddingId)
      .order('table_name', { ascending: true });
    
    return { data, error };
  },

  // Get table by ID
  async getTable(tableId) {
    const { data, error } = await supabase
      .from('tables')
      .select(`
        *,
        table_assignments (
          guests (
            id,
            first_name,
            last_name,
            rsvp_responses (*)
          )
        )
      `)
      .eq('id', tableId)
      .single();
    
    return { data, error };
  },

  // Create new table
  async createTable(tableData) {
    const { data, error } = await supabase
      .from('tables')
      .insert([tableData]);
    
    return { data, error };
  },

  // Update table
  async updateTable(tableId, updates) {
    const { data, error } = await supabase
      .from('tables')
      .update(updates)
      .eq('id', tableId);
    
    return { data, error };
  },

  // Delete table
  async deleteTable(tableId) {
    // First delete table assignments
    await supabase
      .from('table_assignments')
      .delete()
      .eq('table_id', tableId);
    
    // Then delete the table
    const { data, error } = await supabase
      .from('tables')
      .delete()
      .eq('id', tableId);
    
    return { data, error };
  },

  // Assign guest to table
  async assignGuestToTable(tableId, guestId, seatNumber = null) {
    // First check if guest is already assigned to another table
    const { data: existingAssignment } = await supabase
      .from('table_assignments')
      .select('id, table_id')
      .eq('guest_id', guestId)
      .single();
    
    if (existingAssignment) {
      // Remove from current table
      await supabase
        .from('table_assignments')
        .delete()
        .eq('id', existingAssignment.id);
    }
    
    // Assign to new table
    const { data, error } = await supabase
      .from('table_assignments')
      .insert([{
        table_id: tableId,
        guest_id: guestId,
        seat_number: seatNumber
      }]);
    
    return { data, error };
  },

  // Remove guest from table
  async removeGuestFromTable(guestId) {
    const { data, error } = await supabase
      .from('table_assignments')
      .delete()
      .eq('guest_id', guestId);
    
    return { data, error };
  },

  // Get unassigned guests
  async getUnassignedGuests(weddingId) {
    // Get all guests for the wedding
    const { data: allGuests, error: guestsError } = await supabase
      .from('guests')
      .select(`
        id,
        first_name,
        last_name,
        rsvp_responses (*)
      `)
      .eq('wedding_id', weddingId);
    
    if (guestsError) {
      return { data: null, error: guestsError };
    }
    
    // Get all assigned guests
    const { data: assignedGuests, error: assignedError } = await supabase
      .from('table_assignments')
      .select('guest_id')
      .in('guest_id', allGuests.map(g => g.id));
    
    if (assignedError) {
      return { data: null, error: assignedError };
    }
    
    // Filter out assigned guests
    const assignedGuestIds = assignedGuests.map(a => a.guest_id);
    const unassignedGuests = allGuests.filter(g => !assignedGuestIds.includes(g.id));
    
    return { data: unassignedGuests, error: null };
  }
};

/**
 * api/statistics.js - Statistics services
 */

export const statisticsService = {
  // Get statistics for a wedding
  async getStatistics(weddingId) {
    const { data, error } = await supabase
      .from('statistics')
      .select('*')
      .eq('wedding_id', weddingId)
      .single();
    
    return { data, error };
  },

  // Get RSVP timeline data
  async getRsvpTimeline(weddingId) {
    const { data: guests, error: guestsError } = await supabase
      .from('guests')
      .select('id')
      .eq('wedding_id', weddingId);
    
    if (guestsError) {
      return { data: null, error: guestsError };
    }
    
    const guestIds = guests.map(g => g.id);
    
    const { data: responses, error: responsesError } = await supabase
      .from('rsvp_responses')
      .select('response_status, response_date')
      .in('guest_id', guestIds)
      .not('response_date', 'is', null)
      .order('response_date', { ascending: true });
    
    if (responsesError) {
      return { data: null, error: responsesError };
    }
    
    // Process data for timeline chart
    const timelineData = processTimelineData(responses);
    
    return { data: timelineData, error: null };
  },

  // Get guest group statistics
  async getGuestGroupStatistics(weddingId) {
    const { data: guests, error: guestsError } = await supabase
      .from('guests')
      .select(`
        id,
        group_name,
        rsvp_responses (
          response_status
        )
      `)
      .eq('wedding_id', weddingId);
    
    if (guestsError) {
      return { data: null, error: guestsError };
    }
    
    // Process data for group chart
    const groupData = processGroupData(guests);
    
    return { data: groupData, error: null };
  },

  // Get table statistics
  async getTableStatistics(weddingId) {
    const { data: tables, error: tablesError } = await supabase
      .from('tables')
      .select(`
        id,
        table_name,
        capacity,
        table_assignments (
          guests (
            id,
            rsvp_responses (
              response_status
            )
          )
        )
      `)
      .eq('wedding_id', weddingId);
    
    if (tablesError) {
      return { data: null, error: tablesError };
    }
    
    // Process data for table statistics
    const tableStats = processTableData(tables);
    
    return { data: tableStats, error: null };
  },

  // Export statistics as CSV
  async exportStatisticsAsCsv(weddingId) {
    // Get basic statistics
    const { data: stats } = await this.getStatistics(weddingId);
    
    // Get guest list with RSVP status
    const { data: guests } = await supabase
      .from('guests')
      .select(`
        first_name,
        last_name,
        email,
        phone,
        group_name,
        rsvp_responses (
          response_status,
          number_of_accompanying_persons,
          needs_accommodation,
          special_requests
        )
      `)
      .eq('wedding_id', weddingId);
    
    // Format data for CSV
    const csvData = formatDataForCsv(stats, guests);
    
    return csvData;
  }
};

// Helper function to process timeline data
function processTimelineData(responses) {
  // Group responses by date
  const responsesByDate = {};
  const cumulativeAccepted = {};
  const cumulativeDeclined = {};
  
  let totalAccepted = 0;
  let totalDeclined = 0;
  
  responses.forEach(response => {
    const date = new Date(response.response_date).toISOString().split('T')[0];
    
    if (!responsesByDate[date]) {
      responsesByDate[date] = { accepted: 0, declined: 0 };
    }
    
    if (response.response_status === 'accepted') {
      responsesByDate[date].accepted++;
      totalAccepted++;
    } else if (response.response_status === 'declined') {
      responsesByDate[date].declined++;
      totalDeclined++;
    }
    
    cumulativeAccepted[date] = totalAccepted;
    cumulativeDeclined[date] = totalDeclined;
  });
  
  // Sort dates
  const sortedDates = Object.keys(responsesByDate).sort();
  
  // Prepare data for chart
  const labels = sortedDates;
  const dailyAccepted = sortedDates.map(date => responsesByDate[date].accepted);
  const dailyDeclined = sortedDates.map(date => responsesByDate[date].declined);
  const cumulativeAcceptedData = sortedDates.map(date => cumulativeAccepted[date]);
  const cumulativeDeclinedData = sortedDates.map(date => cumulativeDeclined[date]);
  
  return {
    labels,
    dailyAccepted,
    dailyDeclined,
    cumulativeAccepted: cumulativeAcceptedData,
    cumulativeDeclined: cumulativeDeclinedData
  };
}

// Helper function to process group data
function processGroupData(guests) {
  // Group guests by group_name
  const groupStats = {};
  
  guests.forEach(guest => {
    const groupName = guest.group_name || 'Ungrouped';
    const responseStatus = guest.rsvp_responses[0]?.response_status || 'pending';
    
    if (!groupStats[groupName]) {
      groupStats[groupName] = { accepted: 0, declined: 0, pending: 0 };
    }
    
    groupStats[groupName][responseStatus]++;
  });
  
  // Prepare data for chart
  const labels = Object.keys(groupStats);
  const accepted = labels.map(group => groupStats[group].accepted);
  const declined = labels.map(group => groupStats[group].declined);
  const pending = labels.map(group => groupStats[group].pending);
  
  return {
    labels,
    accepted,
    declined,
    pending
  };
}

// Helper function to process table data
function processTableData(tables) {
  return tables.map(table => {
    const assigned = table.table_assignments.length;
    const accepted = table.table_assignments.filter(
      ta => ta.guests.rsvp_responses[0]?.response_status === 'accepted'
    ).length;
    const declined = table.table_assignments.filter(
      ta => ta.guests.rsvp_responses[0]?.response_status === 'declined'
    ).length;
    const pending = table.table_assignments.filter(
      ta => ta.guests.rsvp_responses[0]?.response_status === 'pending'
    ).length;
    
    const utilization = Math.round((accepted / table.capacity) * 100);
    
    return {
      id: table.id,
      name: table.table_name,
      capacity: table.capacity,
      assigned,
      accepted,
      declined,
      pending,
      available: table.capacity - assigned,
      utilization
    };
  });
}

// Helper function to format data for CSV export
function formatDataForCsv(stats, guests) {
  // Basic statistics summary
  const summary = [
    ['Wedding Statistics'],
    ['Total Guests', stats.total_guests],
    ['Accepted', stats.accepted_count],
    ['Declined', stats.declined_count],
    ['Pending', stats.pending_count],
    ['Needs Accommodation', stats.needs_accommodation_count],
    ['Vegetarian', stats.vegetarian_count],
    ['Vegan', stats.vegan_count],
    ['Gluten-free', stats.gluten_free_count],
    ['Dairy-free', stats.dairy_free_count],
    ['With Allergies', stats.with_allergies_count],
    [''],
    ['Guest List'],
    ['First Name', 'Last Name', 'Email', 'Phone', 'Group', 'RSVP Status', 'Accompanying Persons', 'Needs Accommodation', 'Special Requests']
  ];
  
  // Add guest data
  guests.forEach(guest => {
    const rsvp = guest.rsvp_responses[0] || {};
    summary.push([
      guest.first_name,
      guest.last_name,
      guest.email || '',
      guest.phone || '',
      guest.group_name || '',
      rsvp.response_status || 'pending',
      rsvp.number_of_accompanying_persons || 0,
      rsvp.needs_accommodation ? 'Yes' : 'No',
      rsvp.special_requests || ''
    ]);
  });
  
  // Convert to CSV string
  return summary.map(row => row.join(',')).join('\n');
}

/**
 * api/translations.js - Translation services
 */

export const translationService = {
  // Get all translations
  async getTranslations() {
    const { data, error } = await supabase
      .from('translations')
      .select('*');
    
    return { data, error };
  },

  // Get translations for a specific language
  async getTranslationsForLanguage(language) {
    const { data, error } = await supabase
      .from('translations')
      .select('key, ' + language);
    
    if (error) {
      return { data: null, error };
    }
    
    // Format translations as key-value pairs
    const formattedTranslations = {};
    data.forEach(item => {
      formattedTranslations[item.key] = item[language] || item.de; // Fallback to German
    });
    
    return { data: formattedTranslations, error: null };
  },

  // Add new translation
  async addTranslation(translationData) {
    const { data, error } = await supabase
      .from('translations')
      .insert([translationData]);
    
    return { data, error };
  },

  // Update translation
  async updateTranslation(key, updates) {
    const { data, error } = await supabase
      .from('translations')
      .update(updates)
      .eq('key', key);
    
    return { data, error };
  },

  // Delete translation
  async deleteTranslation(key) {
    const { data, error } = await supabase
      .from('translations')
      .delete()
      .eq('key', key);
    
    return { data, error };
  }
};

/**
 * api/admin.js - Admin services
 */

export const adminService = {
  // Get all users
  async getUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  // Get user by ID
  async getUser(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    return { data, error };
  },

  // Create new user
  async createUser(userData) {
    // In a real implementation, this would use Supabase Auth API
    // For the test environment, we'll just insert into the users table
    const { data, error } = await supabase
      .from('users')
      .insert([userData]);
    
    return { data, error };
  },

  // Update user
  async updateUser(userId, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId);
    
    return { data, error };
  },

  // Delete user
  async deleteUser(userId) {
    // In a real implementation, this would use Supabase Auth API
    // For the test environment, we'll just delete from the users table
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
    
    return { data, error };
  },

  // Get system statistics
  async getSystemStatistics() {
    // Get count of active weddings
    const { data: weddingsData, error: weddingsError } = await supabase
      .from('weddings')
      .select('id', { count: 'exact' });
    
    if (weddingsError) {
      return { data: null, error: weddingsError };
    }
    
    // Get count of registered users
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id', { count: 'exact' });
    
    if (usersError) {
      return { data: null, error: usersError };
    }
    
    // Get count of total guests
    const { data: guestsData, error: guestsError } = await supabase
      .from('guests')
      .select('id', { count: 'exact' });
    
    if (guestsError) {
      return { data: null, error: guestsError };
    }
    
    // Get RSVP response rate
    const { data: rsvpData, error: rsvpError } = await supabase
      .from('rsvp_responses')
      .select('response_status');
    
    if (rsvpError) {
      return { data: null, error: rsvpError };
    }
    
    const totalResponses = rsvpData.length;
    const respondedCount = rsvpData.filter(r => r.response_status !== 'pending').length;
    const responseRate = totalResponses > 0 ? Math.round((respondedCount / totalResponses) * 100) : 0;
    
    // Get subscription tier counts
    const { data: tiersData, error: tiersError } = await supabase
      .from('weddings')
      .select('subscription_tier');
    
    if (tiersError) {
      return { data: null, error: tiersError };
    }
    
    const tierCounts = {
      free: 0,
      basic: 0,
      premium: 0
    };
    
    tiersData.forEach(wedding => {
      if (tierCounts[wedding.subscription_tier] !== undefined) {
        tierCounts[wedding.subscription_tier]++;
      }
    });
    
    return {
      data: {
        activeWeddings: weddingsData.length,
        registeredUsers: usersData.length,
        totalGuests: guestsData.length,
        responseRate,
        subscriptionTiers: tierCounts
      },
      error: null
    };
  }
};

/**
 * hooks/useApi.js - Custom hook for API calls
 */
import { useState, useCallback } from 'react';

export function useApi(apiFunction) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiFunction(...args);
      
      if (result.error) {
        setError(result.error);
        return { data: null, error: result.error };
      }
      
      setData(result.data);
      return { data: result.data, error: null };
    } catch (err) {
      setError(err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);
  
  return {
    data,
    loading,
    error,
    execute
  };
}

/**
 * hooks/useRsvp.js - Custom hook for RSVP functionality
 */
import { useParams, useNavigate } from 'react-router-dom';

export function useRsvp() {
  const { code } = useParams();
  const navigate = useNavigate();
  
  const [guest, setGuest] = useState(null);
  const [wedding, setWedding] = useState(null);
  const [rsvpResponse, setRsvpResponse] = useState(null);
  const [menuOptions, setMenuOptions] = useState({});
  const [allergies, setAllergies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    response_status: 'pending',
    number_of_accompanying_persons: 0,
    needs_accommodation: false,
    special_requests: '',
    menu_selections: {},
    allergies: []
  });
  
  useEffect(() => {
    if (code) {
      loadRsvpData();
    }
  }, [code]);
  
  const loadRsvpData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get guest by RSVP code
      const { data: guestData, error: guestError } = await guestService.getGuestByRsvpCode(code);
      
      if (guestError) {
        setError('Invalid RSVP code');
        return;
      }
      
      setGuest(guestData);
      setWedding(guestData.weddings);
      
      // Get RSVP response
      const rsvp = guestData.rsvp_responses[0] || {
        response_status: 'pending',
        number_of_accompanying_persons: 0,
        needs_accommodation: false,
        special_requests: ''
      };
      
      setRsvpResponse(rsvp);
      
      // Get menu options
      const { data: menuData } = await menuService.getMenuOptions(guestData.wedding_id);
      
      // Group menu options by course
      const menuByType = {};
      menuData.forEach(option => {
        if (!menuByType[option.course]) {
          menuByType[option.course] = [];
        }
        menuByType[option.course].push(option);
      });
      
      setMenuOptions(menuByType);
      
      // Get allergies
      const { data: allergiesData } = await menuService.getAllergies();
      setAllergies(allergiesData);
      
      // Set initial form data
      const guestAllergies = guestData.guest_allergies.map(ga => ga.allergies.id);
      const guestMenuSelections = {};
      
      guestData.guest_menu_selections.forEach(selection => {
        const course = selection.menu_options.course;
        guestMenuSelections[course] = selection.menu_options.id;
      });
      
      setFormData({
        response_status: rsvp.response_status,
        number_of_accompanying_persons: rsvp.number_of_accompanying_persons,
        needs_accommodation: rsvp.needs_accommodation,
        special_requests: rsvp.special_requests || '',
        menu_selections: guestMenuSelections,
        allergies: guestAllergies
      });
    } catch (error) {
      console.error('Error loading RSVP data:', error);
      setError('An error occurred while loading RSVP data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleMenuSelection = (course, menuOptionId) => {
    setFormData(prev => ({
      ...prev,
      menu_selections: {
        ...prev.menu_selections,
        [course]: menuOptionId
      }
    }));
  };
  
  const handleAllergyToggle = (allergyId) => {
    setFormData(prev => {
      const allergies = [...prev.allergies];
      
      if (allergies.includes(allergyId)) {
        return {
          ...prev,
          allergies: allergies.filter(id => id !== allergyId)
        };
      } else {
        return {
          ...prev,
          allergies: [...allergies, allergyId]
        };
      }
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Submit RSVP response
      const { error: rsvpError } = await rsvpService.submitRsvpResponse(guest.id, {
        response_status: formData.response_status,
        number_of_accompanying_persons: formData.number_of_accompanying_persons,
        needs_accommodation: formData.needs_accommodation,
        special_requests: formData.special_requests
      });
      
      if (rsvpError) throw rsvpError;
      
      // Update allergies
      const { error: allergiesError } = await rsvpService.updateGuestAllergies(
        guest.id,
        formData.allergies
      );
      
      if (allergiesError) throw allergiesError;
      
      // Update menu selections
      const { error: menuError } = await rsvpService.updateGuestMenuSelections(
        guest.id,
        formData.menu_selections
      );
      
      if (menuError) throw menuError;
      
      // Navigate to confirmation page
      navigate('/rsvp/confirmation', {
        state: {
          guest,
          formData,
          menuOptions,
          allergies
        }
      });
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      setError('An error occurred while submitting your RSVP');
    } finally {
      setLoading(false);
    }
  };
  
  return {
    guest,
    wedding,
    rsvpResponse,
    menuOptions,
    allergies,
    loading,
    error,
    formData,
    handleInputChange,
    handleMenuSelection,
    handleAllergyToggle,
    handleSubmit
  };
}

/**
 * hooks/useGuests.js - Custom hook for guest management
 */
import { useUser } from '../contexts/UserContext';

export function useGuests() {
  const { userDetails } = useUser();
  
  const [guests, setGuests] = useState([]);
  const [filteredGuests, setFilteredGuests] = useState([]);
  const [wedding, setWedding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterGroup, setFilterGroup] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  
  useEffect(() => {
    if (userDetails) {
      loadGuestData();
    }
  }, [userDetails]);
  
  useEffect(() => {
    applyFiltersAndSort();
  }, [guests, searchTerm, filterStatus, filterGroup, sortBy, sortDirection]);
  
  const loadGuestData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get wedding
      const { data: weddingData, error: weddingError } = await weddingService.getWeddingByCouple(userDetails.id);
      
      if (weddingError) throw weddingError;
      
      setWedding(weddingData);
      
      // Get guests
      const { data: guestsData, error: guestsError } = await guestService.getGuests(weddingData.id);
      
      if (guestsError) throw guestsError;
      
      setGuests(guestsData);
      setFilteredGuests(guestsData);
    } catch (error) {
      console.error('Error loading guest data:', error);
      setError('An error occurred while loading guest data');
    } finally {
      setLoading(false);
    }
  };
  
  const applyFiltersAndSort = () => {
    let result = [...guests];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(guest => 
        guest.first_name.toLowerCase().includes(term) ||
        guest.last_name.toLowerCase().includes(term) ||
        (guest.email && guest.email.toLowerCase().includes(term))
      );
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(guest => {
        const status = guest.rsvp_responses[0]?.response_status || 'pending';
        return status === filterStatus;
      });
    }
    
    // Apply group filter
    if (filterGroup !== 'all') {
      result = result.filter(guest => guest.group_name === filterGroup);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'name':
          valueA = `${a.last_name} ${a.first_name}`.toLowerCase();
          valueB = `${b.last_name} ${b.first_name}`.toLowerCase();
          break;
        case 'status':
          valueA = a.rsvp_responses[0]?.response_status || 'pending';
          valueB = b.rsvp_responses[0]?.response_status || 'pending';
          break;
        case 'group':
          valueA = (a.group_name || '').toLowerCase();
          valueB = (b.group_name || '').toLowerCase();
          break;
        default:
          valueA = a[sortBy];
          valueB = b[sortBy];
      }
      
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredGuests(result);
  };
  
  const addGuest = async (guestData) => {
    try {
      setLoading(true);
      
      const { data, error } = await guestService.createGuest({
        ...guestData,
        wedding_id: wedding.id
      });
      
      if (error) throw error;
      
      // Reload guest data
      await loadGuestData();
      
      return { success: true };
    } catch (error) {
      console.error('Error adding guest:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };
  
  const updateGuest = async (guestId, updates) => {
    try {
      setLoading(true);
      
      const { error } = await guestService.updateGuest(guestId, updates);
      
      if (error) throw error;
      
      // Reload guest data
      await loadGuestData();
      
      return { success: true };
    } catch (error) {
      console.error('Error updating guest:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };
  
  const deleteGuest = async (guestId) => {
    try {
      setLoading(true);
      
      const { error } = await guestService.deleteGuest(guestId);
      
      if (error) throw error;
      
      // Reload guest data
      await loadGuestData();
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting guest:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };
  
  const bulkImportGuests = async (guestsData) => {
    try {
      setLoading(true);
      
      const { error } = await guestService.bulkImportGuests(wedding.id, guestsData);
      
      if (error) throw error;
      
      // Reload guest data
      await loadGuestData();
      
      return { success: true };
    } catch (error) {
      console.error('Error importing guests:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };
  
  const sendInvitations = async (guestIds) => {
    try {
      setLoading(true);
      
      const { error } = await guestService.markInvitationsSent(guestIds);
      
      if (error) throw error;
      
      // Reload guest data
      await loadGuestData();
      
      return { success: true };
    } catch (error) {
      console.error('Error sending invitations:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };
  
  return {
    guests: filteredGuests,
    allGuests: guests,
    wedding,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterGroup,
    setFilterGroup,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    refreshGuests: loadGuestData,
    addGuest,
    updateGuest,
    deleteGuest,
    bulkImportGuests,
    sendInvitations
  };
}

/**
 * hooks/useTables.js - Custom hook for table management
 */

export function useTables() {
  const { userDetails } = useUser();
  
  const [tables, setTables] = useState([]);
  const [unassignedGuests, setUnassignedGuests] = useState([]);
  const [wedding, setWedding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (userDetails) {
      loadTableData();
    }
  }, [userDetails]);
  
  const loadTableData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get wedding
      const { data: weddingData, error: weddingError } = await weddingService.getWeddingByCouple(userDetails.id);
      
      if (weddingError) throw weddingError;
      
      setWedding(weddingData);
      
      // Get tables
      const { data: tablesData, error: tablesError } = await tableService.getTables(weddingData.id);
      
      if (tablesError) throw tablesError;
      
      setTables(tablesData);
      
      // Get unassigned guests
      const { data: unassignedData, error: unassignedError } = await tableService.getUnassignedGuests(weddingData.id);
      
      if (unassignedError) throw unassignedError;
      
      setUnassignedGuests(unassignedData);
    } catch (error) {
      console.error('Error loading table data:', error);
      setError('An error occurred while loading table data');
    } finally {
      setLoading(false);
    }
  };
  
  const addTable = async (tableData) => {
    try {
      setLoading(true);
      
      const { data, error } = await tableService.createTable({
        ...tableData,
        wedding_id: wedding.id
      });
      
      if (error) throw error;
      
      // Reload table data
      await loadTableData();
      
      return { success: true };
    } catch (error) {
      console.error('Error adding table:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };
  
  const updateTable = async (tableId, updates) => {
    try {
      setLoading(true);
      
      const { error } = await tableService.updateTable(tableId, updates);
      
      if (error) throw error;
      
      // Reload table data
      await loadTableData();
      
      return { success: true };
    } catch (error) {
      console.error('Error updating table:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };
  
  const deleteTable = async (tableId) => {
    try {
      setLoading(true);
      
      const { error } = await tableService.deleteTable(tableId);
      
      if (error) throw error;
      
      // Reload table data
      await loadTableData();
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting table:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };
  
  const assignGuestToTable = async (tableId, guestId, seatNumber = null) => {
    try {
      setLoading(true);
      
      const { error } = await tableService.assignGuestToTable(tableId, guestId, seatNumber);
      
      if (error) throw error;
      
      // Reload table data
      await loadTableData();
      
      return { success: true };
    } catch (error) {
      console.error('Error assigning guest to table:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };
  
  const removeGuestFromTable = async (guestId) => {
    try {
      setLoading(true);
      
      const { error } = await tableService.removeGuestFromTable(guestId);
      
      if (error) throw error;
      
      // Reload table data
      await loadTableData();
      
      return { success: true };
    } catch (error) {
      console.error('Error removing guest from table:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };
  
  return {
    tables,
    unassignedGuests,
    wedding,
    loading,
    error,
    refreshTables: loadTableData,
    addTable,
    updateTable,
    deleteTable,
    assignGuestToTable,
    removeGuestFromTable
  };
}

/**
 * hooks/useMenu.js - Custom hook for menu management
 */

export function useMenu() {
  const { userDetails } = useUser();
  
  const [menuOptions, setMenuOptions] = useState([]);
  const [menuByCourse, setMenuByCourse] = useState({});
  const [allergies, setAllergies] = useState([]);
  const [wedding, setWedding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCourse, setActiveCourse] = useState('starter');
  
  useEffect(() => {
    if (userDetails) {
      loadMenuData();
    }
  }, [userDetails]);
  
  useEffect(() => {
    // Group menu options by course
    const byCourse = {};
    
    menuOptions.forEach(option => {
      if (!byCourse[option.course]) {
        byCourse[option.course] = [];
      }
      byCourse[option.course].push(option);
    });
    
    setMenuByCourse(byCourse);
  }, [menuOptions]);
  
  const loadMenuData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get wedding
      const { data: weddingData, error: weddingError } = await weddingService.getWeddingByCouple(userDetails.id);
      
      if (weddingError) throw weddingError;
      
      setWedding(weddingData);
      
      // Get menu options
      const { data: menuData, error: menuError } = await menuService.getMenuOptions(weddingData.id);
      
      if (menuError) throw menuError;
      
      setMenuOptions(menuData);
      
      // Get allergies
      const { data: allergiesData, error: allergiesError } = await menuService.getAllergies();
      
      if (allergiesError) throw allergiesError;
      
      setAllergies(allergiesData);
    } catch (error) {
      console.error('Error loading menu data:', error);
      setError('An error occurred while loading menu data');
    } finally {
      setLoading(false);
    }
  };
  
  const addMenuOption = async (menuOptionData) => {
    try {
      setLoading(true);
      
      const { data, error } = await menuService.createMenuOption({
        ...menuOptionData,
        wedding_id: wedding.id
      });
      
      if (error) throw error;
      
      // Reload menu data
      await loadMenuData();
      
      return { success: true };
    } catch (error) {
      console.error('Error adding menu option:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };
  
  const updateMenuOption = async (menuOptionId, updates) => {
    try {
      setLoading(true);
      
      const { error } = await menuService.updateMenuOption(menuOptionId, updates);
      
      if (error) throw error;
      
      // Reload menu data
      await loadMenuData();
      
      return { success: true };
    } catch (error) {
      console.error('Error updating menu option:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };
  
  const deleteMenuOption = async (menuOptionId) => {
    try {
      setLoading(true);
      
      const { error } = await menuService.deleteMenuOption(menuOptionId);
      
      if (error) throw error;
      
      // Reload menu data
      await loadMenuData();
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting menu option:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };
  
  return {
    menuOptions,
    menuByCourse,
    allergies,
    wedding,
    loading,
    error,
    activeCourse,
    setActiveCourse,
    refreshMenu: loadMenuData,
    addMenuOption,
    updateMenuOption,
    deleteMenuOption
  };
}

/**
 * hooks/useStatistics.js - Custom hook for statistics
 */

export function useStatistics() {
  const { userDetails } = useUser();
  
  const [statistics, setStatistics] = useState(null);
  const [timelineData, setTimelineData] = useState(null);
  const [groupsData, setGroupsData] = useState(null);
  const [tablesData, setTablesData] = useState(null);
  const [wedding, setWedding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (userDetails) {
      loadStatisticsData();
    }
  }, [userDetails]);
  
  const loadStatisticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get wedding
      const { data: weddingData, error: weddingError } = await weddingService.getWeddingByCouple(userDetails.id);
      
      if (weddingError) throw weddingError;
      
      setWedding(weddingData);
      
      // Get basic statistics
      const { data: statsData, error: statsError } = await statisticsService.getStatistics(weddingData.id);
      
      if (statsError) throw statsError;
      
      setStatistics(statsData);
      
      // Get timeline data
      const { data: timelineResult, error: timelineError } = await statisticsService.getRsvpTimeline(weddingData.id);
      
      if (timelineError) throw timelineError;
      
      setTimelineData(timelineResult);
      
      // Get groups data
      const { data: groupsResult, error: groupsError } = await statisticsService.getGuestGroupStatistics(weddingData.id);
      
      if (groupsError) throw groupsError;
      
      setGroupsData(groupsResult);
      
      // Get table statistics
      const { data: tablesResult, error: tablesError } = await statisticsService.getTableStatistics(weddingData.id);
      
      if (tablesError) throw tablesError;
      
      setTablesData(tablesResult);
    } catch (error) {
      console.error('Error loading statistics data:', error);
      setError('An error occurred while loading statistics data');
    } finally {
      setLoading(false);
    }
  };
  
  const exportStatistics = async (format) => {
    try {
      setLoading(true);
      
      if (format === 'csv') {
        const csvData = await statisticsService.exportStatisticsAsCsv(wedding.id);
        
        // Create a download link
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wedding_statistics_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        return { success: true };
      }
      
      // For other formats, we would call different export functions
      
      return { success: false, error: 'Export format not supported' };
    } catch (error) {
      console.error('Error exporting statistics:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };
  
  return {
    statistics,
    timelineData,
    groupsData,
    tablesData,
    wedding,
    loading,
    error,
    refreshStatistics: loadStatisticsData,
    exportStatistics
  };
}

/**
 * hooks/useAdmin.js - Custom hook for admin functionality
 */

export function useAdmin() {
  const { userDetails } = useUser();
  
  const [users, setUsers] = useState([]);
  const [weddings, setWeddings] = useState([]);
  const [systemStats, setSystemStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (userDetails && userDetails.role === 'admin') {
      loadAdminData();
    }
  }, [userDetails]);
  
  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get users
      const { data: usersData, error: usersError } = await adminService.getUsers();
      
      if (usersError) throw usersError;
      
      setUsers(usersData);
      
      // Get weddings
      const { data: weddingsData, error: weddingsError } = await weddingService.getAllWeddings();
      
      if (weddingsError) throw weddingsError;
      
      setWeddings(weddingsData);
      
      // Get system statistics
      const { data: statsData, error: statsError } = await adminService.getSystemStatistics();
      
      if (statsError) throw statsError;
      
      setSystemStats(statsData);
    } catch (error) {
      console.error('Error loading admin data:', error);
      setError('An error occurred while loading admin data');
    } finally {
      setLoading(false);
    }
  };
  
  const createUser = async (userData) => {
    try {
      setLoading(true);
      
      const { data, error } = await adminService.createUser(userData);
      
      if (error) throw error;
      
      // Reload admin data
      await loadAdminData();
      
      return { success: true };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };
  
  const updateUser = async (userId, updates) => {
    try {
      setLoading(true);
      
      const { error } = await adminService.updateUser(userId, updates);
      
      if (error) throw error;
      
      // Reload admin data
      await loadAdminData();
      
      return { success: true };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };
  
  const deleteUser = async (userId) => {
    try {
      setLoading(true);
      
      const { error } = await adminService.deleteUser(userId);
      
      if (error) throw error;
      
      // Reload admin data
      await loadAdminData();
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };
  
  const createWedding = async (weddingData) => {
    try {
      setLoading(true);
      
      const { data, error } = await weddingService.createWedding(weddingData);
      
      if (error) throw error;
      
      // Reload admin data
      await loadAdminData();
      
      return { success: true };
    } catch (error) {
      console.error('Error creating wedding:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };
  
  const updateWedding = async (weddingId, updates) => {
    try {
      setLoading(true);
      
      const { error } = await weddingService.updateWedding(weddingId, updates);
      
      if (error) throw error;
      
      // Reload admin data
      await loadAdminData();
      
      return { success: true };
    } catch (error) {
      console.error('Error updating wedding:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };
  
  const deleteWedding = async (weddingId) => {
    try {
      setLoading(true);
      
      const { error } = await weddingService.deleteWedding(weddingId);
      
      if (error) throw error;
      
      // Reload admin data
      await loadAdminData();
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting wedding:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };
  
  return {
    users,
    weddings,
    systemStats,
    loading,
    error,
    refreshAdminData: loadAdminData,
    createUser,
    updateUser,
    deleteUser,
    createWedding,
    updateWedding,
    deleteWedding
  };
}
