// Food Selection & Allergy Tracking Implementation
// For LemonVows Wedding Planning App

// This file contains the implementation of the food selection and allergy tracking functionality
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
 * Menu Management Functions
 * These functions handle the creation and management of menu options
 */

// Function to add a new menu option
async function addMenuOption(weddingId, menuData) {
  const {
    name,
    description,
    is_vegetarian,
    is_vegan,
    is_gluten_free,
    is_dairy_free,
    course
  } = menuData;
  
  const { data, error } = await supabase
    .from('menu_options')
    .insert([
      {
        wedding_id: weddingId,
        name,
        description,
        is_vegetarian: is_vegetarian || false,
        is_vegan: is_vegan || false,
        is_gluten_free: is_gluten_free || false,
        is_dairy_free: is_dairy_free || false,
        course
      }
    ]);
  
  if (error) throw error;
  return data[0];
}

// Function to update a menu option
async function updateMenuOption(menuOptionId, menuData) {
  const {
    name,
    description,
    is_vegetarian,
    is_vegan,
    is_gluten_free,
    is_dairy_free,
    course
  } = menuData;
  
  const { data, error } = await supabase
    .from('menu_options')
    .update({
      name,
      description,
      is_vegetarian: is_vegetarian || false,
      is_vegan: is_vegan || false,
      is_gluten_free: is_gluten_free || false,
      is_dairy_free: is_dairy_free || false,
      course,
      updated_at: new Date()
    })
    .eq('id', menuOptionId);
  
  if (error) throw error;
  return data[0];
}

// Function to delete a menu option
async function deleteMenuOption(menuOptionId) {
  // First check if any guests have selected this menu option
  const { data: selections, error: selectionsError } = await supabase
    .from('guest_menu_selections')
    .select('id')
    .eq('menu_option_id', menuOptionId);
  
  if (selectionsError) throw selectionsError;
  
  // If there are selections, delete them first
  if (selections.length > 0) {
    const { error: deleteSelectionsError } = await supabase
      .from('guest_menu_selections')
      .delete()
      .eq('menu_option_id', menuOptionId);
    
    if (deleteSelectionsError) throw deleteSelectionsError;
  }
  
  // Then delete the menu option
  const { error } = await supabase
    .from('menu_options')
    .delete()
    .eq('id', menuOptionId);
  
  if (error) throw error;
  return true;
}

// Function to get all menu options for a wedding
async function getWeddingMenuOptions(weddingId) {
  const { data, error } = await supabase
    .from('menu_options')
    .select('*')
    .eq('wedding_id', weddingId)
    .order('course', { ascending: true });
  
  if (error) throw error;
  return data;
}

// Function to get menu options by course
async function getMenuOptionsByCourse(weddingId, course) {
  const { data, error } = await supabase
    .from('menu_options')
    .select('*')
    .eq('wedding_id', weddingId)
    .eq('course', course)
    .order('name');
  
  if (error) throw error;
  return data;
}

/**
 * Allergy Management Functions
 * These functions handle the management of allergies and dietary restrictions
 */

// Function to add a new allergy
async function addAllergy(allergyData) {
  const { name, description } = allergyData;
  
  const { data, error } = await supabase
    .from('allergies')
    .insert([
      {
        name,
        description
      }
    ]);
  
  if (error) throw error;
  return data[0];
}

// Function to update an allergy
async function updateAllergy(allergyId, allergyData) {
  const { name, description } = allergyData;
  
  const { data, error } = await supabase
    .from('allergies')
    .update({
      name,
      description,
      updated_at: new Date()
    })
    .eq('id', allergyId);
  
  if (error) throw error;
  return data[0];
}

// Function to delete an allergy
async function deleteAllergy(allergyId) {
  // First check if any guests have this allergy
  const { data: guestAllergies, error: guestAllergiesError } = await supabase
    .from('guest_allergies')
    .select('id')
    .eq('allergy_id', allergyId);
  
  if (guestAllergiesError) throw guestAllergiesError;
  
  // If there are guest allergies, delete them first
  if (guestAllergies.length > 0) {
    const { error: deleteGuestAllergiesError } = await supabase
      .from('guest_allergies')
      .delete()
      .eq('allergy_id', allergyId);
    
    if (deleteGuestAllergiesError) throw deleteGuestAllergiesError;
  }
  
  // Then delete the allergy
  const { error } = await supabase
    .from('allergies')
    .delete()
    .eq('id', allergyId);
  
  if (error) throw error;
  return true;
}

// Function to get all allergies
async function getAllergies() {
  const { data, error } = await supabase
    .from('allergies')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data;
}

// Function to get allergies for a specific guest
async function getGuestAllergies(guestId) {
  const { data, error } = await supabase
    .from('guest_allergies')
    .select(`
      allergy_id,
      allergies(id, name, description)
    `)
    .eq('guest_id', guestId);
  
  if (error) throw error;
  return data.map(item => item.allergies);
}

// Function to add an allergy to a guest
async function addGuestAllergy(guestId, allergyId) {
  // Check if the guest already has this allergy
  const { data: existingAllergy, error: existingAllergyError } = await supabase
    .from('guest_allergies')
    .select('id')
    .eq('guest_id', guestId)
    .eq('allergy_id', allergyId)
    .single();
  
  if (existingAllergyError && existingAllergyError.code !== 'PGRST116') {
    // PGRST116 is the error code for "no rows returned", which is expected if the allergy doesn't exist
    throw existingAllergyError;
  }
  
  // If the guest already has this allergy, return
  if (existingAllergy) return existingAllergy;
  
  // Otherwise, add the allergy
  const { data, error } = await supabase
    .from('guest_allergies')
    .insert([
      {
        guest_id: guestId,
        allergy_id: allergyId
      }
    ]);
  
  if (error) throw error;
  return data[0];
}

// Function to remove an allergy from a guest
async function removeGuestAllergy(guestId, allergyId) {
  const { error } = await supabase
    .from('guest_allergies')
    .delete()
    .eq('guest_id', guestId)
    .eq('allergy_id', allergyId);
  
  if (error) throw error;
  return true;
}

/**
 * Guest Menu Selection Functions
 * These functions handle the selection of menu options by guests
 */

// Function to get menu selections for a specific guest
async function getGuestMenuSelections(guestId) {
  const { data, error } = await supabase
    .from('guest_menu_selections')
    .select(`
      menu_option_id,
      menu_options(id, name, description, is_vegetarian, is_vegan, is_gluten_free, is_dairy_free, course)
    `)
    .eq('guest_id', guestId);
  
  if (error) throw error;
  return data.map(item => item.menu_options);
}

// Function to add a menu selection for a guest
async function addGuestMenuSelection(guestId, menuOptionId) {
  // Get the menu option to check its course
  const { data: menuOption, error: menuOptionError } = await supabase
    .from('menu_options')
    .select('course')
    .eq('id', menuOptionId)
    .single();
  
  if (menuOptionError) throw menuOptionError;
  
  // Check if the guest already has a selection for this course
  const { data: existingSelections, error: existingSelectionsError } = await supabase
    .from('guest_menu_selections')
    .select(`
      id,
      menu_option_id,
      menu_options(course)
    `)
    .eq('guest_id', guestId);
  
  if (existingSelectionsError) throw existingSelectionsError;
  
  // Filter existing selections to find any for the same course
  const existingSelectionForCourse = existingSelections.find(
    selection => selection.menu_options.course === menuOption.course
  );
  
  // If there's an existing selection for this course, update it
  if (existingSelectionForCourse) {
    const { error: updateError } = await supabase
      .from('guest_menu_selections')
      .update({
        menu_option_id: menuOptionId,
        updated_at: new Date()
      })
      .eq('id', existingSelectionForCourse.id);
    
    if (updateError) throw updateError;
    return { id: existingSelectionForCourse.id, menu_option_id: menuOptionId };
  }
  
  // Otherwise, add a new selection
  const { data, error } = await supabase
    .from('guest_menu_selections')
    .insert([
      {
        guest_id: guestId,
        menu_option_id: menuOptionId
      }
    ]);
  
  if (error) throw error;
  return data[0];
}

// Function to remove a menu selection from a guest
async function removeGuestMenuSelection(guestId, menuOptionId) {
  const { error } = await supabase
    .from('guest_menu_selections')
    .delete()
    .eq('guest_id', guestId)
    .eq('menu_option_id', menuOptionId);
  
  if (error) throw error;
  return true;
}

/**
 * Dietary Statistics Functions
 * These functions provide statistics about dietary preferences and allergies
 */

// Function to get dietary statistics for a wedding
async function getWeddingDietaryStatistics(weddingId) {
  // Get the statistics record for the wedding
  const { data: statistics, error: statisticsError } = await supabase
    .from('statistics')
    .select('*')
    .eq('wedding_id', weddingId)
    .single();
  
  if (statisticsError) throw statisticsError;
  
  // Get additional statistics that aren't stored in the statistics table
  
  // Count menu selections by course and option
  const { data: menuSelections, error: menuSelectionsError } = await supabase
    .from('guest_menu_selections')
    .select(`
      menu_options(id, name, course),
      count
    `)
    .eq('menu_options.wedding_id', weddingId)
    .group('menu_options.id, menu_options.name, menu_options.course');
  
  if (menuSelectionsError) throw menuSelectionsError;
  
  // Format menu selections by course
  const menuSelectionsByCourse = {};
  menuSelections.forEach(selection => {
    const course = selection.menu_options.course;
    if (!menuSelectionsByCourse[course]) {
      menuSelectionsByCourse[course] = [];
    }
    menuSelectionsByCourse[course].push({
      name: selection.menu_options.name,
      count: selection.count
    });
  });
  
  // Count allergies
  const { data: allergyStats, error: allergyStatsError } = await supabase
    .from('guest_allergies')
    .select(`
      allergies(id, name),
      count
    `)
    .eq('guests.wedding_id', weddingId)
    .group('allergies.id, allergies.name');
  
  if (allergyStatsError) throw allergyStatsError;
  
  // Format allergy statistics
  const allergyStatistics = allergyStats.map(stat => ({
    name: stat.allergies.name,
    count: stat.count
  }));
  
  // Return combined statistics
  return {
    ...statistics,
    menu_selections_by_course: menuSelectionsByCourse,
    allergy_statistics: allergyStatistics
  };
}

// Function to export dietary requirements for catering
async function exportDietaryRequirements(weddingId) {
  // Get all guests with their menu selections and allergies
  const { data: guests, error: guestsError } = await supabase
    .from('guests')
    .select(`
      id,
      first_name,
      last_name,
      rsvp_responses(response_status),
      guest_menu_selections(
        menu_options(name, course, is_vegetarian, is_vegan, is_gluten_free, is_dairy_free)
      ),
      guest_allergies(
        allergies(name)
      ),
      table_assignments(
        table_id,
        tables(table_name)
      )
    `)
    .eq('wedding_id', weddingId)
    .eq('rsvp_responses.response_status', 'accepted');
  
  if (guestsError) throw guestsError;
  
  // Format the data for export
  const exportData = guests.map(guest => {
    // Get menu selections by course
    const menuSelections = {};
    guest.guest_menu_selections.forEach(selection => {
      menuSelections[selection.menu_options.course] = selection.menu_options.name;
    });
    
    // Get dietary restrictions
    const dietaryRestrictions = [];
    if (guest.guest_menu_selections.some(s => s.menu_options.is_vegetarian)) {
      dietaryRestrictions.push('Vegetarian');
    }
    if (guest.guest_menu_selections.some(s => s.menu_options.is_vegan)) {
      dietaryRestrictions.push('Vegan');
    }
    if (guest.guest_menu_selections.some(s => s.menu_options.is_gluten_free)) {
      dietaryRestrictions.push('Gluten-Free');
    }
    if (guest.guest_menu_selections.some(s => s.menu_options.is_dairy_free)) {
      dietaryRestrictions.push('Dairy-Free');
    }
    
    // Get allergies
    const allergies = guest.guest_allergies.map(a => a.allergies.name);
    
    // Get table assignment
    const tableAssignment = guest.table_assignments.length > 0
      ? guest.table_assignments[0].tables.table_name
      : 'Not Assigned';
    
    return {
      'Guest Name': `${guest.first_name} ${guest.last_name}`,
      'Table': tableAssignment,
      'Starter': menuSelections.starter || 'Not Selected',
      'Main Course': menuSelections.main || 'Not Selected',
      'Dessert': menuSelections.dessert || 'Not Selected',
      'Dietary Restrictions': dietaryRestrictions.join(', '),
      'Allergies': allergies.join(', ')
    };
  });
  
  return exportData;
}

// ----- FRONTEND IMPLEMENTATION (WEWEB) -----

/**
 * The following sections outline the frontend components and logic
 * that would be implemented in WeWeb for the food selection and allergy tracking functionality.
 * 
 * Since WeWeb is a no-code platform, this is a conceptual representation
 * of the components and their interactions rather than actual code.
 */

// Menu Management Page Components:
// 1. Menu Options Table
// 2. Add Menu Option Form
// 3. Edit Menu Option Modal
// 4. Menu Preview Section

// Allergy Management Page Components:
// 1. Allergies Table
// 2. Add Allergy Form
// 3. Edit Allergy Modal

// Guest Dietary Requirements Page Components:
// 1. Guest Dietary Requirements Table
// 2. Export Dietary Requirements Button
// 3. Filter and Search Controls

/**
 * Menu Options Table Component
 * 
 * This component displays all menu options for a wedding with their details
 * and provides actions for editing and deleting menu options.
 */
const MenuOptionsTable = {
  // Data binding to Supabase
  dataSource: 'getWeddingMenuOptions(weddingId)',
  
  // Columns
  columns: [
    { field: 'name', header: 'Name', sortable: true },
    { field: 'description', header: 'Description', sortable: true },
    { 
      field: 'course', 
      header: 'Course', 
      sortable: true, 
      filterable: true,
      // Course indicator with color coding
      template: `
        <span class="course-badge" :class="{
          'course-starter': item.course === 'starter',
          'course-main': item.course === 'main',
          'course-dessert': item.course === 'dessert'
        }">
          {{ translateCourse(item.course) }}
        </span>
      `
    },
    { 
      field: 'dietary_restrictions', 
      header: 'Dietary Restrictions', 
      // Dietary restrictions with icons
      template: `
        <div class="dietary-restrictions">
          <span v-if="item.is_vegetarian" class="dietary-badge vegetarian" title="Vegetarian">
            <i class="icon-vegetarian"></i>
          </span>
          <span v-if="item.is_vegan" class="dietary-badge vegan" title="Vegan">
            <i class="icon-vegan"></i>
          </span>
          <span v-if="item.is_gluten_free" class="dietary-badge gluten-free" title="Gluten-Free">
            <i class="icon-gluten-free"></i>
          </span>
          <span v-if="item.is_dairy_free" class="dietary-badge dairy-free" title="Dairy-Free">
            <i class="icon-dairy-free"></i>
          </span>
        </div>
      `
    },
    {
      // Actions column
      template: `
        <div class="action-buttons">
          <button @click="editMenuOption(item)">Edit</button>
          <button @click="deleteMenuOption(item.id)" class="danger">Delete</button>
        </div>
      `
    }
  ],
  
  // Methods
  methods: {
    translateCourse(course) {
      // This would use the translations table
      return {
        'starter': 'Starter',
        'main': 'Main Course',
        'dessert': 'Dessert'
      }[course];
    },
    
    editMenuOption(menuOption) {
      // Open edit menu option modal
      this.$emit('edit-menu-option', menuOption);
    },
    
    async deleteMenuOption(menuOptionId) {
      if (confirm('Are you sure you want to delete this menu option?')) {
        await deleteMenuOption(menuOptionId);
        // Refresh the menu options list
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
 * Add Menu Option Form Component
 * 
 * This component provides a form for adding new menu options to the wedding.
 */
const AddMenuOptionForm = {
  // Form fields
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { 
      name: 'course', 
      label: 'Course', 
      type: 'select', 
      required: true,
      options: [
        { value: 'starter', label: 'Starter' },
        { value: 'main', label: 'Main Course' },
        { value: 'dessert', label: 'Dessert' }
      ]
    },
    { name: 'is_vegetarian', label: 'Vegetarian', type: 'checkbox' },
    { name: 'is_vegan', label: 'Vegan', type: 'checkbox' },
    { name: 'is_gluten_free', label: 'Gluten-Free', type: 'checkbox' },
    { name: 'is_dairy_free', label: 'Dairy-Free', type: 'checkbox' }
  ],
  
  // Methods
  methods: {
    async submitForm(formData) {
      try {
        await addMenuOption(this.weddingId, formData);
        // Clear form and refresh menu options list
        this.resetForm();
        this.$emit('menu-option-added');
      } catch (error) {
        this.showError(error.message);
      }
    },
    
    resetForm() {
      // Reset all form fields
      this.formData = {
        name: '',
        description: '',
        course: 'main',
        is_vegetarian: false,
        is_vegan: false,
        is_gluten_free: false,
        is_dairy_free: false
      };
    },
    
    showError(message) {
      // Display error message
      this.errorMessage = message;
    }
  }
};

/**
 * Menu Preview Component
 * 
 * This component displays a preview of the menu as it would appear to guests.
 */
const MenuPreviewComponent = {
  // Data
  data: {
    menuOptions: [],
    courses: ['starter', 'main', 'dessert']
  },
  
  // Computed properties
  computed: {
    menuOptionsByCourse() {
      const result = {};
      this.courses.forEach(course => {
        result[course] = this.menuOptions.filter(option => option.course === course);
      });
      return result;
    }
  },
  
  // Template
  template: `
    <div class="menu-preview">
      <h2>{{ translate('menu.preview_title') }}</h2>
      <p>{{ translate('menu.preview_description') }}</p>
      
      <div class="menu-courses">
        <div v-for="course in courses" :key="course" class="menu-course">
          <h3>{{ translateCourse(course) }}</h3>
          <div class="menu-options">
            <div v-for="option in menuOptionsByCourse[course]" :key="option.id" class="menu-option">
              <h4>{{ option.name }}</h4>
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
    </div>
  `,
  
  // Methods
  methods: {
    translateCourse(course) {
      return {
        'starter': this.translate('menu.starter'),
        'main': this.translate('menu.main_course'),
        'dessert': this.translate('menu.dessert')
      }[course];
    },
    
    async loadMenuOptions() {
      try {
        this.menuOptions = await getWeddingMenuOptions(this.weddingId);
      } catch (error) {
        this.showError(error.message);
      }
    },
    
    showError(message) {
      // Display error message
      this.errorMessage = message;
    }
  },
  
  // Lifecycle hooks
  mounted() {
    this.loadMenuOptions();
  }
};

/**
 * Allergies Table Component
 * 
 * This component displays all allergies with their details
 * and provides actions for editing and deleting allergies.
 */
const AllergiesTable = {
  // Data binding to Supabase
  dataSource: 'getAllergies()',
  
  // Columns
  columns: [
    { field: 'name', header: 'Name', sortable: true },
    { field: 'description', header: 'Description', sortable: true },
    {
      // Actions column
      template: `
        <div class="action-buttons">
          <button @click="editAllergy(item)">Edit</button>
          <button @click="deleteAllergy(item.id)" class="danger">Delete</button>
        </div>
      `
    }
  ],
  
  // Methods
  methods: {
    editAllergy(allergy) {
      // Open edit allergy modal
      this.$emit('edit-allergy', allergy);
    },
    
    async deleteAllergy(allergyId) {
      if (confirm('Are you sure you want to delete this allergy?')) {
        await deleteAllergy(allergyId);
        // Refresh the allergies list
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
 * Add Allergy Form Component
 * 
 * This component provides a form for adding new allergies.
 */
const AddAllergyForm = {
  // Form fields
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' }
  ],
  
  // Methods
  methods: {
    async submitForm(formData) {
      try {
        await addAllergy(formData);
        // Clear form and refresh allergies list
        this.resetForm();
        this.$emit('allergy-added');
      } catch (error) {
        this.showError(error.message);
      }
    },
    
    resetForm() {
      // Reset all form fields
      this.formData = {
        name: '',
        description: ''
      };
    },
    
    showError(message) {
      // Display error message
      this.errorMessage = message;
    }
  }
};

/**
 * Guest Dietary Requirements Table Component
 * 
 * This component displays dietary requirements for all guests who have RSVP'd.
 */
const GuestDietaryRequirementsTable = {
  // Data binding to Supabase
  dataSource: 'getWeddingGuests(weddingId)',
  
  // Data filtering
  dataFilter: 'guest => guest.rsvp_responses[0]?.response_status === "accepted"',
  
  // Columns
  columns: [
    { field: 'first_name', header: 'First Name', sortable: true },
    { field: 'last_name', header: 'Last Name', sortable: true },
    { 
      field: 'table', 
      header: 'Table', 
      sortable: true,
      template: `
        <span v-if="item.table_assignments && item.table_assignments.length > 0">
          {{ item.table_assignments[0].tables.table_name }}
        </span>
        <span v-else>Not Assigned</span>
      `
    },
    { 
      field: 'starter', 
      header: 'Starter', 
      template: `
        <span v-if="getMenuSelectionByCourse(item, 'starter')">
          {{ getMenuSelectionByCourse(item, 'starter').name }}
        </span>
        <span v-else class="not-selected">Not Selected</span>
      `
    },
    { 
      field: 'main', 
      header: 'Main Course', 
      template: `
        <span v-if="getMenuSelectionByCourse(item, 'main')">
          {{ getMenuSelectionByCourse(item, 'main').name }}
        </span>
        <span v-else class="not-selected">Not Selected</span>
      `
    },
    { 
      field: 'dessert', 
      header: 'Dessert', 
      template: `
        <span v-if="getMenuSelectionByCourse(item, 'dessert')">
          {{ getMenuSelectionByCourse(item, 'dessert').name }}
        </span>
        <span v-else class="not-selected">Not Selected</span>
      `
    },
    { 
      field: 'dietary_restrictions', 
      header: 'Dietary Restrictions', 
      template: `
        <div class="dietary-restrictions">
          <span v-if="hasDietaryRestriction(item, 'vegetarian')" class="dietary-badge vegetarian">
            {{ translate('food.vegetarian') }}
          </span>
          <span v-if="hasDietaryRestriction(item, 'vegan')" class="dietary-badge vegan">
            {{ translate('food.vegan') }}
          </span>
          <span v-if="hasDietaryRestriction(item, 'gluten_free')" class="dietary-badge gluten-free">
            {{ translate('food.gluten_free') }}
          </span>
          <span v-if="hasDietaryRestriction(item, 'dairy_free')" class="dietary-badge dairy-free">
            {{ translate('food.dairy_free') }}
          </span>
        </div>
      `
    },
    { 
      field: 'allergies', 
      header: 'Allergies', 
      template: `
        <div class="allergies">
          <span v-for="allergy in getAllergies(item)" :key="allergy.id" class="allergy-badge">
            {{ allergy.name }}
          </span>
          <span v-if="getAllergies(item).length === 0">None</span>
        </div>
      `
    },
    {
      // Actions column
      template: `
        <div class="action-buttons">
          <button @click="editDietaryRequirements(item)">Edit</button>
        </div>
      `
    }
  ],
  
  // Methods
  methods: {
    getMenuSelectionByCourse(guest, course) {
      if (!guest.guest_menu_selections) return null;
      
      const selection = guest.guest_menu_selections.find(
        s => s.menu_options.course === course
      );
      
      return selection ? selection.menu_options : null;
    },
    
    hasDietaryRestriction(guest, restriction) {
      if (!guest.guest_menu_selections) return false;
      
      return guest.guest_menu_selections.some(
        s => s.menu_options[`is_${restriction}`]
      );
    },
    
    getAllergies(guest) {
      if (!guest.guest_allergies) return [];
      
      return guest.guest_allergies.map(a => a.allergies);
    },
    
    editDietaryRequirements(guest) {
      // Open edit dietary requirements modal
      this.$emit('edit-dietary-requirements', guest);
    },
    
    refreshData() {
      // Refresh the data from Supabase
      this.fetchData();
    }
  }
};

/**
 * Edit Guest Dietary Requirements Modal Component
 * 
 * This component provides a modal for editing a guest's dietary requirements.
 */
const EditGuestDietaryRequirementsModal = {
  // Props
  props: {
    guest: Object,
    menuOptions: Array,
    allergies: Array
  },
  
  // Data
  data: {
    selectedMenuOptions: [],
    selectedAllergies: [],
    specialRequests: ''
  },
  
  // Computed properties
  computed: {
    menuOptionsByCourse() {
      const result = {};
      ['starter', 'main', 'dessert'].forEach(course => {
        result[course] = this.menuOptions.filter(option => option.course === course);
      });
      return result;
    }
  },
  
  // Template
  template: `
    <div class="modal edit-dietary-requirements-modal">
      <div class="modal-content">
        <h2>{{ translate('dietary.edit_title') }}</h2>
        <p>{{ translate('dietary.edit_description', { name: guest.first_name + ' ' + guest.last_name }) }}</p>
        
        <div class="menu-selection">
          <h3>{{ translate('dietary.menu_selection') }}</h3>
          <div v-for="course in ['starter', 'main', 'dessert']" :key="course">
            <h4>{{ translateCourse(course) }}</h4>
            <div class="menu-options">
              <div 
                v-for="option in menuOptionsByCourse[course]" 
                :key="option.id"
                class="menu-option"
                :class="{ selected: isMenuOptionSelected(option.id) }"
                @click="toggleMenuOption(option.id, course)"
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
          <h3>{{ translate('dietary.allergies') }}</h3>
          <p>{{ translate('dietary.allergies_description') }}</p>
          <div class="allergy-options">
            <div 
              v-for="allergy in allergies" 
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
        
        <div class="special-requests">
          <h3>{{ translate('dietary.special_requests') }}</h3>
          <textarea 
            v-model="specialRequests"
            :placeholder="translate('dietary.special_requests_placeholder')"
          ></textarea>
        </div>
        
        <div class="modal-actions">
          <button @click="cancel" class="cancel-button">{{ translate('common.cancel') }}</button>
          <button @click="save" class="save-button">{{ translate('common.save') }}</button>
        </div>
      </div>
    </div>
  `,
  
  // Methods
  methods: {
    translateCourse(course) {
      return {
        'starter': this.translate('menu.starter'),
        'main': this.translate('menu.main_course'),
        'dessert': this.translate('menu.dessert')
      }[course];
    },
    
    isMenuOptionSelected(optionId) {
      return this.selectedMenuOptions.includes(optionId);
    },
    
    toggleMenuOption(optionId, course) {
      // For each course, only one option can be selected
      // Remove any other selected options for this course
      const optionsForCourse = this.menuOptionsByCourse[course].map(o => o.id);
      this.selectedMenuOptions = this.selectedMenuOptions.filter(id => !optionsForCourse.includes(id));
      
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
    },
    
    initialize() {
      // Initialize selected menu options from guest data
      this.selectedMenuOptions = this.guest.guest_menu_selections
        ? this.guest.guest_menu_selections.map(s => s.menu_option_id)
        : [];
      
      // Initialize selected allergies from guest data
      this.selectedAllergies = this.guest.guest_allergies
        ? this.guest.guest_allergies.map(a => a.allergy_id)
        : [];
      
      // Initialize special requests from guest data
      this.specialRequests = this.guest.rsvp_responses && this.guest.rsvp_responses.length > 0
        ? this.guest.rsvp_responses[0].special_requests || ''
        : '';
    },
    
    async save() {
      try {
        // Update menu selections
        await updateGuestMenuSelections(this.guest.id, this.selectedMenuOptions);
        
        // Update allergies
        await updateGuestAllergies(this.guest.id, this.selectedAllergies);
        
        // Update special requests
        if (this.guest.rsvp_responses && this.guest.rsvp_responses.length > 0) {
          await submitRsvpResponse(this.guest.id, {
            ...this.guest.rsvp_responses[0],
            special_requests: this.specialRequests
          });
        }
        
        this.$emit('saved');
        this.close();
      } catch (error) {
        this.showError(error.message);
      }
    },
    
    cancel() {
      this.close();
    },
    
    close() {
      this.$emit('close');
    },
    
    showError(message) {
      // Display error message
      this.errorMessage = message;
    }
  },
  
  // Lifecycle hooks
  mounted() {
    this.initialize();
  }
};

/**
 * Export Dietary Requirements Component
 * 
 * This component provides functionality to export dietary requirements for catering.
 */
const ExportDietaryRequirementsComponent = {
  // Methods
  methods: {
    async exportDietaryRequirements(format) {
      try {
        const data = await exportDietaryRequirements(this.weddingId);
        
        switch (format) {
          case 'csv':
            exportToCsv(data, 'dietary_requirements.csv');
            break;
          case 'excel':
            exportToExcel(data, 'dietary_requirements.xlsx');
            break;
          case 'pdf':
            exportToPdf(data, 'dietary_requirements.pdf');
            break;
          default:
            throw new Error('Unsupported export format');
        }
        
        this.showSuccess(`Dietary requirements exported as ${format.toUpperCase()}`);
      } catch (error) {
        this.showError(error.message);
      }
    },
    
    showSuccess(message) {
      // Display success message
      this.successMessage = message;
    },
    
    showError(message) {
      // Display error message
      this.errorMessage = message;
    }
  }
};

// ----- MULTILINGUAL SUPPORT -----

/**
 * Translation keys for food selection and allergy tracking
 * These would be added to the translations table
 */
const foodAllergyTranslations = [
  // Menu management
  { key: 'menu.management_title', de: 'Menüverwaltung', en: 'Menu Management', fr: 'Gestion du Menu', es: 'Gestión del Menú' },
  { key: 'menu.add_option', de: 'Menüoption hinzufügen', en: 'Add Menu Option', fr: 'Ajouter une Option de Menu', es: 'Añadir Opción de Menú' },
  { key: 'menu.edit_option', de: 'Menüoption bearbeiten', en: 'Edit Menu Option', fr: 'Modifier l\'Option de Menu', es: 'Editar Opción de Menú' },
  { key: 'menu.preview_title', de: 'Menüvorschau', en: 'Menu Preview', fr: 'Aperçu du Menu', es: 'Vista Previa del Menú' },
  { key: 'menu.preview_description', de: 'So wird das Menü für Ihre Gäste angezeigt', en: 'This is how the menu will appear to your guests', fr: 'Voici comment le menu apparaîtra à vos invités', es: 'Así es como el menú aparecerá a sus invitados' },
  { key: 'menu.starter', de: 'Vorspeise', en: 'Starter', fr: 'Entrée', es: 'Entrante' },
  { key: 'menu.main_course', de: 'Hauptgang', en: 'Main Course', fr: 'Plat Principal', es: 'Plato Principal' },
  { key: 'menu.dessert', de: 'Nachspeise', en: 'Dessert', fr: 'Dessert', es: 'Postre' },
  
  // Food options
  { key: 'food.vegetarian', de: 'Vegetarisch', en: 'Vegetarian', fr: 'Végétarien', es: 'Vegetariano' },
  { key: 'food.vegan', de: 'Vegan', en: 'Vegan', fr: 'Végétalien', es: 'Vegano' },
  { key: 'food.gluten_free', de: 'Glutenfrei', en: 'Gluten-Free', fr: 'Sans Gluten', es: 'Sin Gluten' },
  { key: 'food.dairy_free', de: 'Laktosefrei', en: 'Dairy-Free', fr: 'Sans Lactose', es: 'Sin Lácteos' },
  
  // Allergy management
  { key: 'allergy.management_title', de: 'Allergieverwaltung', en: 'Allergy Management', fr: 'Gestion des Allergies', es: 'Gestión de Alergias' },
  { key: 'allergy.add_allergy', de: 'Allergie hinzufügen', en: 'Add Allergy', fr: 'Ajouter une Allergie', es: 'Añadir Alergia' },
  { key: 'allergy.edit_allergy', de: 'Allergie bearbeiten', en: 'Edit Allergy', fr: 'Modifier l\'Allergie', es: 'Editar Alergia' },
  
  // Dietary requirements
  { key: 'dietary.requirements_title', de: 'Ernährungsanforderungen', en: 'Dietary Requirements', fr: 'Exigences Alimentaires', es: 'Requisitos Dietéticos' },
  { key: 'dietary.export', de: 'Exportieren', en: 'Export', fr: 'Exporter', es: 'Exportar' },
  { key: 'dietary.edit_title', de: 'Ernährungsanforderungen bearbeiten', en: 'Edit Dietary Requirements', fr: 'Modifier les Exigences Alimentaires', es: 'Editar Requisitos Dietéticos' },
  { key: 'dietary.edit_description', de: 'Bearbeiten Sie die Ernährungsanforderungen für {name}', en: 'Edit dietary requirements for {name}', fr: 'Modifier les exigences alimentaires pour {name}', es: 'Editar requisitos dietéticos para {name}' },
  { key: 'dietary.menu_selection', de: 'Menüauswahl', en: 'Menu Selection', fr: 'Sélection du Menu', es: 'Selección de Menú' },
  { key: 'dietary.allergies', de: 'Allergien', en: 'Allergies', fr: 'Allergies', es: 'Alergias' },
  { key: 'dietary.allergies_description', de: 'Wählen Sie alle zutreffenden Allergien aus', en: 'Select all applicable allergies', fr: 'Sélectionnez toutes les allergies applicables', es: 'Seleccione todas las alergias aplicables' },
  { key: 'dietary.special_requests', de: 'Besondere Anfragen', en: 'Special Requests', fr: 'Demandes Spéciales', es: 'Solicitudes Especiales' },
  { key: 'dietary.special_requests_placeholder', de: 'Geben Sie besondere Anfragen oder Anmerkungen ein', en: 'Enter any special requests or notes', fr: 'Entrez toutes demandes spéciales ou notes', es: 'Ingrese cualquier solicitud especial o notas' },
  
  // Common
  { key: 'common.save', de: 'Speichern', en: 'Save', fr: 'Enregistrer', es: 'Guardar' },
  { key: 'common.cancel', de: 'Abbrechen', en: 'Cancel', fr: 'Annuler', es: 'Cancelar' },
  { key: 'common.delete', de: 'Löschen', en: 'Delete', fr: 'Supprimer', es: 'Eliminar' },
  { key: 'common.edit', de: 'Bearbeiten', en: 'Edit', fr: 'Modifier', es: 'Editar' },
  { key: 'common.yes', de: 'Ja', en: 'Yes', fr: 'Oui', es: 'Sí' },
  { key: 'common.no', de: 'Nein', en: 'No', fr: 'Non', es: 'No' }
];

// ----- EXPORT FUNCTIONALITY -----

/**
 * Export Functions
 * These functions handle exporting dietary requirements in various formats
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
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Dietary Requirements');
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
  doc.text('Dietary Requirements', 14, 22);
  
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
//    - Menu Management Tab
//    - Allergy Management Tab
//    - Dietary Requirements Tab
// 
// 2. Public RSVP Page
//    - Menu Selection Section
//    - Allergies Selection Section

// WeWeb Data Bindings:
// 1. Supabase Tables:
//    - menu_options
//    - allergies
//    - guest_menu_selections
//    - guest_allergies
// 
// 2. Supabase Queries:
//    - getWeddingMenuOptions
//    - getAllergies
//    - getGuestMenuSelections
//    - getGuestAllergies
// 
// 3. Supabase Mutations:
//    - addMenuOption
//    - updateMenuOption
//    - deleteMenuOption
//    - addAllergy
//    - updateAllergy
//    - deleteAllergy
//    - updateGuestMenuSelections
//    - updateGuestAllergies

// WeWeb Workflows:
// 1. Add Menu Option Workflow:
//    - Trigger: Form submission
//    - Actions: Validate form, Call addMenuOption, Show success message, Reset form
// 
// 2. Edit Menu Option Workflow:
//    - Trigger: Form submission
//    - Actions: Validate form, Call updateMenuOption, Show success message, Close modal
// 
// 3. Add Allergy Workflow:
//    - Trigger: Form submission
//    - Actions: Validate form, Call addAllergy, Show success message, Reset form
// 
// 4. Edit Allergy Workflow:
//    - Trigger: Form submission
//    - Actions: Validate form, Call updateAllergy, Show success message, Close modal
// 
// 5. Edit Guest Dietary Requirements Workflow:
//    - Trigger: Form submission
//    - Actions: Validate form, Call updateGuestMenuSelections, Call updateGuestAllergies,
//               Show success message, Close modal
// 
// 6. Export Dietary Requirements Workflow:
//    - Trigger: Button click
//    - Actions: Call exportDietaryRequirements, Format data, Call export function based on format selection
