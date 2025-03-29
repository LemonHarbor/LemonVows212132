// Guest Management & RSVP Functionality Implementation
// For LemonVows Wedding Planning App

// This file contains the implementation of the guest management and RSVP functionality
// using Supabase as the backend and WeWeb for the frontend integration.

// ----- BACKEND IMPLEMENTATION (SUPABASE) -----

/**
 * Supabase API Client Configuration
 * This would be integrated with WeWeb through their Supabase connector
 */
const supabaseConfig = {
  supabaseUrl: 'https://your-supabase-project.supabase.co',
  supabaseKey: 'your-supabase-anon-key',
};

/**
 * Guest Management Functions
 * These functions handle the core guest management operations
 */

// Function to add a new guest to the wedding
async function addGuest(weddingId, guestData) {
  const { first_name, last_name, email, phone, address, group_name } = guestData;
  
  // Generate a unique RSVP code for the guest
  const rsvpCode = generateUniqueRsvpCode(first_name, last_name);
  
  // Insert the guest into the database
  const { data, error } = await supabase
    .from('guests')
    .insert([
      {
        wedding_id: weddingId,
        first_name,
        last_name,
        email,
        phone,
        address,
        rsvp_code: rsvpCode,
        group_name,
      }
    ]);
  
  if (error) throw error;
  
  // Create a pending RSVP response for the guest
  await createPendingRsvpResponse(data[0].id);
  
  return data[0];
}

// Function to generate a unique RSVP code
function generateUniqueRsvpCode(firstName, lastName) {
  const timestamp = new Date().getTime().toString(36);
  const nameCode = `${firstName.substring(0, 2)}${lastName.substring(0, 2)}`.toLowerCase();
  const randomStr = Math.random().toString(36).substring(2, 5);
  
  return `${nameCode}-${randomStr}-${timestamp.substring(timestamp.length - 3)}`;
}

// Function to create a pending RSVP response for a new guest
async function createPendingRsvpResponse(guestId) {
  const { data, error } = await supabase
    .from('rsvp_responses')
    .insert([
      {
        guest_id: guestId,
        response_status: 'pending',
      }
    ]);
  
  if (error) throw error;
  return data[0];
}

// Function to get all guests for a wedding
async function getWeddingGuests(weddingId) {
  const { data, error } = await supabase
    .from('guests')
    .select(`
      *,
      rsvp_responses(*),
      guest_allergies(
        allergy_id,
        allergies(name, description)
      ),
      guest_menu_selections(
        menu_option_id,
        menu_options(name, description, is_vegetarian, is_vegan, is_gluten_free, is_dairy_free, course)
      ),
      table_assignments(
        table_id,
        seat_number,
        tables(table_name, capacity, shape)
      )
    `)
    .eq('wedding_id', weddingId);
  
  if (error) throw error;
  return data;
}

// Function to update guest information
async function updateGuest(guestId, guestData) {
  const { first_name, last_name, email, phone, address, group_name } = guestData;
  
  const { data, error } = await supabase
    .from('guests')
    .update({
      first_name,
      last_name,
      email,
      phone,
      address,
      group_name,
      updated_at: new Date(),
    })
    .eq('id', guestId);
  
  if (error) throw error;
  return data[0];
}

// Function to delete a guest
async function deleteGuest(guestId) {
  // First delete related records
  await supabase.from('rsvp_responses').delete().eq('guest_id', guestId);
  await supabase.from('guest_allergies').delete().eq('guest_id', guestId);
  await supabase.from('guest_menu_selections').delete().eq('guest_id', guestId);
  await supabase.from('table_assignments').delete().eq('guest_id', guestId);
  
  // Then delete the guest
  const { error } = await supabase
    .from('guests')
    .delete()
    .eq('id', guestId);
  
  if (error) throw error;
  return true;
}

// Function to mark invitations as sent
async function markInvitationsSent(guestIds) {
  const { data, error } = await supabase
    .from('guests')
    .update({
      invitation_sent: true,
      invitation_sent_date: new Date(),
      updated_at: new Date(),
    })
    .in('id', guestIds);
  
  if (error) throw error;
  return data;
}

/**
 * RSVP Functions
 * These functions handle the RSVP process
 */

// Function to get guest by RSVP code (for public RSVP page)
async function getGuestByRsvpCode(rsvpCode) {
  const { data, error } = await supabase
    .from('guests')
    .select(`
      *,
      rsvp_responses(*),
      weddings(wedding_name, wedding_date, location, description)
    `)
    .eq('rsvp_code', rsvpCode)
    .single();
  
  if (error) throw error;
  return data;
}

// Function to submit RSVP response
async function submitRsvpResponse(guestId, responseData) {
  const {
    response_status,
    number_of_accompanying_persons,
    needs_accommodation,
    special_requests
  } = responseData;
  
  const { data, error } = await supabase
    .from('rsvp_responses')
    .update({
      response_status,
      number_of_accompanying_persons,
      needs_accommodation,
      special_requests,
      response_date: new Date(),
      updated_at: new Date(),
    })
    .eq('guest_id', guestId);
  
  if (error) throw error;
  return data[0];
}

// Function to update guest allergies
async function updateGuestAllergies(guestId, allergyIds) {
  // First delete existing allergies
  await supabase
    .from('guest_allergies')
    .delete()
    .eq('guest_id', guestId);
  
  // Then add new allergies
  if (allergyIds.length > 0) {
    const allergyRecords = allergyIds.map(allergyId => ({
      guest_id: guestId,
      allergy_id: allergyId
    }));
    
    const { error } = await supabase
      .from('guest_allergies')
      .insert(allergyRecords);
    
    if (error) throw error;
  }
  
  return true;
}

// Function to update guest menu selections
async function updateGuestMenuSelections(guestId, menuOptionIds) {
  // First delete existing menu selections
  await supabase
    .from('guest_menu_selections')
    .delete()
    .eq('guest_id', guestId);
  
  // Then add new menu selections
  if (menuOptionIds.length > 0) {
    const menuRecords = menuOptionIds.map(menuOptionId => ({
      guest_id: guestId,
      menu_option_id: menuOptionId
    }));
    
    const { error } = await supabase
      .from('guest_menu_selections')
      .insert(menuRecords);
    
    if (error) throw error;
  }
  
  return true;
}

// Function to get all allergies (for dropdown selection)
async function getAllergies() {
  const { data, error } = await supabase
    .from('allergies')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data;
}

// Function to get menu options for a wedding
async function getWeddingMenuOptions(weddingId) {
  const { data, error } = await supabase
    .from('menu_options')
    .select('*')
    .eq('wedding_id', weddingId)
    .order('course', { ascending: true });
  
  if (error) throw error;
  return data;
}

// Function to export guest list with RSVP status
async function exportGuestList(weddingId) {
  const guests = await getWeddingGuests(weddingId);
  
  // Format data for export
  const exportData = guests.map(guest => {
    const rsvpResponse = guest.rsvp_responses[0] || {};
    
    return {
      'First Name': guest.first_name,
      'Last Name': guest.last_name,
      'Email': guest.email,
      'Phone': guest.phone,
      'Address': guest.address,
      'Group': guest.group_name,
      'RSVP Status': rsvpResponse.response_status || 'pending',
      'Response Date': rsvpResponse.response_date ? new Date(rsvpResponse.response_date).toLocaleDateString() : '',
      'Accompanying Persons': rsvpResponse.number_of_accompanying_persons || 0,
      'Needs Accommodation': rsvpResponse.needs_accommodation ? 'Yes' : 'No',
      'Special Requests': rsvpResponse.special_requests || '',
      'Invitation Sent': guest.invitation_sent ? 'Yes' : 'No',
      'Invitation Sent Date': guest.invitation_sent_date ? new Date(guest.invitation_sent_date).toLocaleDateString() : '',
    };
  });
  
  return exportData;
}

// ----- FRONTEND IMPLEMENTATION (WEWEB) -----

/**
 * The following sections outline the frontend components and logic
 * that would be implemented in WeWeb for the guest management and RSVP functionality.
 * 
 * Since WeWeb is a no-code platform, this is a conceptual representation
 * of the components and their interactions rather than actual code.
 */

// Guest Management Page Components:
// 1. Guest List Table
// 2. Add Guest Form
// 3. Edit Guest Modal
// 4. Send Invitations Button
// 5. Export Guest List Button
// 6. Filter and Search Controls

// RSVP Public Page Components:
// 1. RSVP Code Entry Form
// 2. Guest Welcome Section
// 3. RSVP Response Form
// 4. Menu Selection Section
// 5. Allergies Selection Section
// 6. Special Requests Text Area
// 7. Confirmation Screen

/**
 * Guest List Table Component
 * 
 * This component displays all guests for a wedding with their RSVP status
 * and provides actions for editing, deleting, and managing guests.
 */
const GuestListTable = {
  // Data binding to Supabase
  dataSource: 'getWeddingGuests(weddingId)',
  
  // Columns
  columns: [
    { field: 'first_name', header: 'First Name', sortable: true },
    { field: 'last_name', header: 'Last Name', sortable: true },
    { field: 'email', header: 'Email', sortable: true },
    { field: 'group_name', header: 'Group', sortable: true, filterable: true },
    { 
      field: 'rsvp_responses[0].response_status', 
      header: 'RSVP Status', 
      sortable: true, 
      filterable: true,
      // Status indicator with color coding
      template: `
        <span class="status-badge" :class="{
          'status-accepted': item.rsvp_responses[0].response_status === 'accepted',
          'status-declined': item.rsvp_responses[0].response_status === 'declined',
          'status-pending': item.rsvp_responses[0].response_status === 'pending'
        }">
          {{ translateRsvpStatus(item.rsvp_responses[0].response_status) }}
        </span>
      `
    },
    { 
      field: 'invitation_sent', 
      header: 'Invitation', 
      sortable: true,
      template: `
        <span v-if="item.invitation_sent">
          Sent on {{ formatDate(item.invitation_sent_date) }}
        </span>
        <span v-else>Not sent</span>
      `
    },
    {
      // Actions column
      template: `
        <div class="action-buttons">
          <button @click="editGuest(item)">Edit</button>
          <button @click="viewRsvpDetails(item)">Details</button>
          <button @click="deleteGuest(item.id)" class="danger">Delete</button>
        </div>
      `
    }
  ],
  
  // Methods
  methods: {
    translateRsvpStatus(status) {
      // This would use the translations table
      return {
        'accepted': 'Accepted',
        'declined': 'Declined',
        'pending': 'Pending'
      }[status];
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString();
    },
    
    editGuest(guest) {
      // Open edit guest modal
      this.$emit('edit-guest', guest);
    },
    
    viewRsvpDetails(guest) {
      // Open RSVP details modal
      this.$emit('view-rsvp-details', guest);
    },
    
    async deleteGuest(guestId) {
      if (confirm('Are you sure you want to delete this guest?')) {
        await deleteGuest(guestId);
        // Refresh the guest list
        this.refreshData();
      }
    },
    
    refreshData() {
      // Refresh the data from Supabase
      this.fetchData();
    }
  }
};

/**
 * Add Guest Form Component
 * 
 * This component provides a form for adding new guests to the wedding.
 */
const AddGuestForm = {
  // Form fields
  fields: [
    { name: 'first_name', label: 'First Name', type: 'text', required: true },
    { name: 'last_name', label: 'Last Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Phone', type: 'tel' },
    { name: 'address', label: 'Address', type: 'textarea' },
    { name: 'group_name', label: 'Group', type: 'text' }
  ],
  
  // Methods
  methods: {
    async submitForm(formData) {
      try {
        await addGuest(this.weddingId, formData);
        // Clear form and refresh guest list
        this.resetForm();
        this.$emit('guest-added');
      } catch (error) {
        this.showError(error.message);
      }
    },
    
    resetForm() {
      // Reset all form fields
      this.formData = {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        group_name: ''
      };
    },
    
    showError(message) {
      // Display error message
      this.errorMessage = message;
    }
  }
};

/**
 * Send Invitations Component
 * 
 * This component allows the couple to mark invitations as sent for selected guests.
 */
const SendInvitationsComponent = {
  // Properties
  props: {
    selectedGuests: Array
  },
  
  // Methods
  methods: {
    async sendInvitations() {
      if (this.selectedGuests.length === 0) {
        this.showError('Please select at least one guest');
        return;
      }
      
      try {
        const guestIds = this.selectedGuests.map(guest => guest.id);
        await markInvitationsSent(guestIds);
        this.$emit('invitations-sent');
        this.showSuccess(`Invitations marked as sent for ${guestIds.length} guests`);
      } catch (error) {
        this.showError(error.message);
      }
    },
    
    showError(message) {
      // Display error message
      this.errorMessage = message;
    },
    
    showSuccess(message) {
      // Display success message
      this.successMessage = message;
    }
  }
};

/**
 * RSVP Public Page
 * 
 * This is the public-facing page where guests can respond to their invitation.
 */
const RsvpPublicPage = {
  // State
  data: {
    rsvpCode: '',
    guest: null,
    wedding: null,
    rsvpResponse: null,
    selectedMenuOptions: [],
    selectedAllergies: [],
    availableMenuOptions: [],
    availableAllergies: [],
    step: 'code-entry', // 'code-entry', 'response-form', 'confirmation'
  },
  
  // Methods
  methods: {
    async lookupRsvpCode() {
      try {
        const result = await getGuestByRsvpCode(this.rsvpCode);
        this.guest = result;
        this.wedding = result.weddings;
        this.rsvpResponse = result.rsvp_responses[0];
        
        // Load menu options and allergies
        this.availableMenuOptions = await getWeddingMenuOptions(this.wedding.id);
        this.availableAllergies = await getAllergies();
        
        // Move to response form
        this.step = 'response-form';
      } catch (error) {
        this.showError('Invalid RSVP code. Please check and try again.');
      }
    },
    
    async submitRsvpResponse() {
      try {
        // Update RSVP response
        await submitRsvpResponse(this.guest.id, {
          response_status: this.rsvpResponse.response_status,
          number_of_accompanying_persons: this.rsvpResponse.number_of_accompanying_persons,
          needs_accommodation: this.rsvpResponse.needs_accommodation,
          special_requests: this.rsvpResponse.special_requests
        });
        
        // Update menu selections
        await updateGuestMenuSelections(this.guest.id, this.selectedMenuOptions);
        
        // Update allergies
        await updateGuestAllergies(this.guest.id, this.selectedAllergies);
        
        // Move to confirmation
        this.step = 'confirmation';
      } catch (error) {
        this.showError('There was an error submitting your RSVP. Please try again.');
      }
    },
    
    showError(message) {
      // Display error message
      this.errorMessage = message;
    }
  },
  
  // Components
  components: {
    // RSVP Code Entry Form
    RsvpCodeEntryForm: {
      template: `
        <div class="rsvp-code-entry">
          <h2>{{ translate('rsvp.enter_code') }}</h2>
          <p>{{ translate('rsvp.enter_code_description') }}</p>
          <input 
            type="text" 
            v-model="rsvpCode" 
            :placeholder="translate('rsvp.code_placeholder')"
          />
          <button @click="lookupRsvpCode">{{ translate('rsvp.submit') }}</button>
        </div>
      `
    },
    
    // RSVP Response Form
    RsvpResponseForm: {
      template: `
        <div class="rsvp-response-form">
          <h2>{{ translate('rsvp.hello') }}, {{ guest.first_name }}!</h2>
          <p>{{ translate('rsvp.invitation_to') }} {{ wedding.wedding_name }}</p>
          
          <div class="response-section">
            <h3>{{ translate('rsvp.your_response') }}</h3>
            <div class="response-buttons">
              <button 
                @click="rsvpResponse.response_status = 'accepted'"
                :class="{ active: rsvpResponse.response_status === 'accepted' }"
              >
                {{ translate('rsvp.accept') }}
              </button>
              <button 
                @click="rsvpResponse.response_status = 'declined'"
                :class="{ active: rsvpResponse.response_status === 'declined' }"
              >
                {{ translate('rsvp.decline') }}
              </button>
            </div>
          </div>
          
          <div v-if="rsvpResponse.response_status === 'accepted'" class="additional-info">
            <div class="accompanying-persons">
              <h3>{{ translate('rsvp.accompanying_persons') }}</h3>
              <input 
                type="number" 
                v-model="rsvpResponse.number_of_accompanying_persons" 
                min="0"
              />
            </div>
            
            <div class="accommodation">
              <h3>{{ translate('rsvp.need_accommodation') }}</h3>
              <label>
                <input 
                  type="checkbox" 
                  v-model="rsvpResponse.needs_accommodation" 
                />
                {{ translate('rsvp.accommodation_description') }}
              </label>
            </div>
            
            <div class="menu-selection">
              <h3>{{ translate('rsvp.menu_selection') }}</h3>
              <div v-for="course in ['starter', 'main', 'dessert']" :key="course">
                <h4>{{ translate('food.' + course) }}</h4>
                <div class="menu-options">
                  <div 
                    v-for="option in filterMenuOptionsByCourse(course)" 
                    :key="option.id"
                    class="menu-option"
                    :class="{ selected: isMenuOptionSelected(option.id) }"
                    @click="toggleMenuOption(option.id)"
                  >
                    <h5>{{ option.name }}</h5>
                    <p>{{ option.description }}</p>
                    <div class="dietary-tags">
                      <span v-if="option.is_vegetarian" class="tag vegetarian">
                        {{ translate('food.vegetarian') }}
                      </span>
                      <span v-if="option.is_vegan" class="tag vegan">
                        {{ translate('food.vegan') }}
                      </span>
                      <span v-if="option.is_gluten_free" class="tag gluten-free">
                        {{ translate('food.gluten_free') }}
                      </span>
                      <span v-if="option.is_dairy_free" class="tag dairy-free">
                        {{ translate('food.dairy_free') }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="allergies">
              <h3>{{ translate('rsvp.allergies') }}</h3>
              <p>{{ translate('rsvp.allergies_description') }}</p>
              <div class="allergy-options">
                <div 
                  v-for="allergy in availableAllergies" 
                  :key="allergy.id"
                  class="allergy-option"
                  :class="{ selected: isAllergySelected(allergy.id) }"
                  @click="toggleAllergy(allergy.id)"
                >
                  {{ allergy.name }}
                  <span v-if="allergy.description" class="allergy-description">
                    ({{ allergy.description }})
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="special-requests">
            <h3>{{ translate('rsvp.special_requests') }}</h3>
            <textarea 
              v-model="rsvpResponse.special_requests"
              :placeholder="translate('rsvp.special_requests_placeholder')"
            ></textarea>
          </div>
          
          <button @click="submitRsvpResponse" class="submit-button">
            {{ translate('rsvp.submit_response') }}
          </button>
        </div>
      `,
      
      methods: {
        filterMenuOptionsByCourse(course) {
          return this.availableMenuOptions.filter(option => option.course === course);
        },
        
        isMenuOptionSelected(optionId) {
          return this.selectedMenuOptions.includes(optionId);
        },
        
        toggleMenuOption(optionId) {
          // For each course, only one option can be selected
          const option = this.availableMenuOptions.find(o => o.id === optionId);
          
          // Remove any other selected options for this course
          this.selectedMenuOptions = this.selectedMenuOptions.filter(id => {
            const menuOption = this.availableMenuOptions.find(o => o.id === id);
            return menuOption.course !== option.course;
          });
          
          // Add the new option
          this.selectedMenuOptions.push(optionId);
        },
        
        isAllergySelected(allergyId) {
          return this.selectedAllergies.includes(allergyId);
        },
        
        toggleAllergy(allergyId) {
          if (this.isAllergySelected(allergyId)) {
            this.selectedAllergies = this.selectedAllergies.filter(id => id !== allergyId);
          } else {
            this.selectedAllergies.push(allergyId);
          }
        }
      }
    },
    
    // Confirmation Screen
    ConfirmationScreen: {
      template: `
        <div class="confirmation-screen">
          <h2>{{ translate('rsvp.thank_you') }}</h2>
          <p>{{ translate('rsvp.response_received') }}</p>
          
          <div class="response-summary">
            <h3>{{ translate('rsvp.your_response_summary') }}</h3>
            <p>
              <strong>{{ translate('rsvp.status') }}:</strong> 
              {{ translateRsvpStatus(rsvpResponse.response_status) }}
            </p>
            
            <div v-if="rsvpResponse.response_status === 'accepted'">
              <p v-if="rsvpResponse.number_of_accompanying_persons > 0">
                <strong>{{ translate('rsvp.accompanying_persons') }}:</strong> 
                {{ rsvpResponse.number_of_accompanying_persons }}
              </p>
              
              <p v-if="rsvpResponse.needs_accommodation">
                <strong>{{ translate('rsvp.accommodation') }}:</strong> 
                {{ translate('rsvp.yes') }}
              </p>
              
              <div v-if="selectedMenuOptions.length > 0" class="menu-summary">
                <h4>{{ translate('rsvp.menu_selections') }}</h4>
                <ul>
                  <li v-for="optionId in selectedMenuOptions" :key="optionId">
                    {{ getMenuOptionName(optionId) }}
                  </li>
                </ul>
              </div>
              
              <div v-if="selectedAllergies.length > 0" class="allergies-summary">
                <h4>{{ translate('rsvp.allergies') }}</h4>
                <ul>
                  <li v-for="allergyId in selectedAllergies" :key="allergyId">
                    {{ getAllergyName(allergyId) }}
                  </li>
                </ul>
              </div>
            </div>
            
            <p v-if="rsvpResponse.special_requests">
              <strong>{{ translate('rsvp.special_requests') }}:</strong> 
              {{ rsvpResponse.special_requests }}
            </p>
          </div>
          
          <p>{{ translate('rsvp.contact_couple') }}</p>
        </div>
      `,
      
      methods: {
        translateRsvpStatus(status) {
          return {
            'accepted': this.translate('rsvp.accepted'),
            'declined': this.translate('rsvp.declined'),
            'pending': this.translate('rsvp.pending')
          }[status];
        },
        
        getMenuOptionName(optionId) {
          const option = this.availableMenuOptions.find(o => o.id === optionId);
          return option ? option.name : '';
        },
        
        getAllergyName(allergyId) {
          const allergy = this.availableAllergies.find(a => a.id === allergyId);
          return allergy ? allergy.name : '';
        }
      }
    }
  }
};

// ----- MULTILINGUAL SUPPORT -----

/**
 * Translation Function
 * This function would be used throughout the application to support
 * multilingual content based on the translations table.
 */
function translate(key, language = null) {
  // If no language is specified, use the user's preferred language
  const userLanguage = language || getUserPreferredLanguage();
  
  // Get the translation from the translations table
  return getTranslation(key, userLanguage);
}

async function getTranslation(key, language) {
  const { data, error } = await supabase
    .from('translations')
    .select('*')
    .eq('key', key)
    .single();
  
  if (error) return key; // Fallback to the key itself
  
  // Return the translation in the requested language, or fall back to German
  return data[language] || data.de || key;
}

function getUserPreferredLanguage() {
  // Get the user's preferred language from their profile
  // This would be implemented based on the application's user management
  return 'de'; // Default to German
}

// ----- EXPORT FUNCTIONALITY -----

/**
 * Export Functions
 * These functions handle exporting guest data in various formats
 */

// Export to CSV
function exportToCsv(data, filename) {
  // Convert data to CSV format
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','), // Header row
    ...data.map(row => headers.map(header => {
      // Handle values with commas by wrapping in quotes
      const value = row[header] || '';
      return typeof value === 'string' && value.includes(',') 
        ? `"${value}"` 
        : value;
    }).join(','))
  ];
  
  const csvContent = csvRows.join('\n');
  
  // Create a download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  // Create a link element and trigger download
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export to Excel (XLSX)
async function exportToExcel(data, filename) {
  // This would require a library like SheetJS/xlsx
  // For WeWeb, this would typically be implemented using a plugin
  // or by sending the data to a server-side function
  
  // Conceptual implementation:
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Guests');
  XLSX.writeFile(workbook, filename);
}

// Export to PDF
async function exportToPdf(data, filename) {
  // This would require a library like jsPDF
  // For WeWeb, this would typically be implemented using a plugin
  // or by sending the data to a server-side function
  
  // Conceptual implementation:
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text('Guest List', 14, 22);
  
  // Add date
  doc.setFontSize(11);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);
  
  // Add table
  doc.autoTable({
    head: [Object.keys(data[0])],
    body: data.map(row => Object.values(row)),
    startY: 40
  });
  
  // Save the PDF
  doc.save(filename);
}

// ----- INTEGRATION WITH WEWEB -----

/**
 * The following section outlines how the above functionality would be
 * integrated with WeWeb's no-code platform.
 * 
 * In WeWeb, the implementation would involve:
 * 1. Setting up Supabase as a data source
 * 2. Creating pages and components using the WeWeb editor
 * 3. Binding data and actions to the components
 * 4. Setting up workflows for form submissions and data operations
 */

// WeWeb Page Structure:
// 1. Admin Dashboard
//    - Guest Management Tab
//    - RSVP Statistics Tab
//    - Menu Management Tab
//    - Settings Tab
// 
// 2. Public RSVP Page
//    - RSVP Code Entry
//    - RSVP Form
//    - Confirmation Screen

// WeWeb Data Bindings:
// 1. Supabase Tables:
//    - guests
//    - rsvp_responses
//    - menu_options
//    - allergies
//    - etc.
// 
// 2. Supabase Queries:
//    - getWeddingGuests
//    - getGuestByRsvpCode
//    - etc.
// 
// 3. Supabase Mutations:
//    - addGuest
//    - updateGuest
//    - submitRsvpResponse
//    - etc.

// WeWeb Workflows:
// 1. Add Guest Workflow:
//    - Trigger: Form submission
//    - Actions: Validate form, Call addGuest, Show success message, Reset form
// 
// 2. RSVP Submission Workflow:
//    - Trigger: Form submission
//    - Actions: Validate form, Call submitRsvpResponse, Call updateGuestAllergies,
//               Call updateGuestMenuSelections, Show confirmation screen
// 
// 3. Export Guest List Workflow:
//    - Trigger: Button click
//    - Actions: Call exportGuestList, Format data, Call export function based on format selection
