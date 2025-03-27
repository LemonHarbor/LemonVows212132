// LemonVows Frontend-Backend Integration
// This file connects the frontend components with the backend API service

import { createApp } from 'vue';
import App from './App.vue';
import apiService from './services/api-service';
import { createI18n } from 'vue-i18n';
import translations from './locales/translations.json';

// Create Vue app
const app = createApp(App);

// Add API service to global properties
app.config.globalProperties.$api = apiService;

// Setup internationalization
const i18n = createI18n({
  locale: 'de', // Default language
  fallbackLocale: 'en',
  messages: translations
});

app.use(i18n);

// Create a store for global state management
const store = {
  state: {
    currentUser: null,
    currentWedding: null,
    isLoading: false,
    error: null,
    language: 'de'
  },
  
  setCurrentUser(user) {
    this.state.currentUser = user;
  },
  
  setCurrentWedding(wedding) {
    this.state.currentWedding = wedding;
    
    // Update language based on wedding settings
    if (wedding && wedding.language) {
      this.setLanguage(wedding.language);
    }
  },
  
  setLoading(isLoading) {
    this.state.isLoading = isLoading;
  },
  
  setError(error) {
    this.state.error = error;
  },
  
  setLanguage(language) {
    this.state.language = language;
    i18n.global.locale = language;
  },
  
  // Authentication methods
  async login(email, password) {
    this.setLoading(true);
    this.setError(null);
    
    try {
      const result = await apiService.login(email, password);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      // Get user data
      const userResult = await apiService.getCurrentUser();
      
      if (!userResult.success) {
        throw new Error(userResult.error);
      }
      
      this.setCurrentUser(userResult.data);
      
      // Get user's weddings
      const weddingsResult = await apiService.getWeddings();
      
      if (weddingsResult.success && weddingsResult.data.length > 0) {
        this.setCurrentWedding(weddingsResult.data[0]);
      }
      
      return { success: true };
    } catch (error) {
      this.setError(error.message);
      return { success: false, error: error.message };
    } finally {
      this.setLoading(false);
    }
  },
  
  async register(email, password, firstName, lastName) {
    this.setLoading(true);
    this.setError(null);
    
    try {
      const result = await apiService.register(email, password, firstName, lastName);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return { success: true };
    } catch (error) {
      this.setError(error.message);
      return { success: false, error: error.message };
    } finally {
      this.setLoading(false);
    }
  },
  
  async logout() {
    this.setLoading(true);
    this.setError(null);
    
    try {
      const result = await apiService.logout();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      this.setCurrentUser(null);
      this.setCurrentWedding(null);
      
      return { success: true };
    } catch (error) {
      this.setError(error.message);
      return { success: false, error: error.message };
    } finally {
      this.setLoading(false);
    }
  },
  
  // Wedding methods
  async createWedding(weddingData) {
    this.setLoading(true);
    this.setError(null);
    
    try {
      const result = await apiService.createWedding(weddingData);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      this.setCurrentWedding(result.data);
      
      return { success: true, data: result.data };
    } catch (error) {
      this.setError(error.message);
      return { success: false, error: error.message };
    } finally {
      this.setLoading(false);
    }
  },
  
  async updateWedding(id, weddingData) {
    this.setLoading(true);
    this.setError(null);
    
    try {
      const result = await apiService.updateWedding(id, weddingData);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      this.setCurrentWedding(result.data);
      
      return { success: true, data: result.data };
    } catch (error) {
      this.setError(error.message);
      return { success: false, error: error.message };
    } finally {
      this.setLoading(false);
    }
  },
  
  // Guest methods
  async getGuests() {
    if (!this.state.currentWedding) {
      return { success: false, error: 'No wedding selected' };
    }
    
    this.setLoading(true);
    this.setError(null);
    
    try {
      const result = await apiService.getGuests(this.state.currentWedding.id);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return { success: true, data: result.data };
    } catch (error) {
      this.setError(error.message);
      return { success: false, error: error.message };
    } finally {
      this.setLoading(false);
    }
  },
  
  async createGuest(guestData) {
    if (!this.state.currentWedding) {
      return { success: false, error: 'No wedding selected' };
    }
    
    this.setLoading(true);
    this.setError(null);
    
    try {
      const result = await apiService.createGuest(this.state.currentWedding.id, guestData);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return { success: true, data: result.data };
    } catch (error) {
      this.setError(error.message);
      return { success: false, error: error.message };
    } finally {
      this.setLoading(false);
    }
  },
  
  // Table methods
  async getTables() {
    if (!this.state.currentWedding) {
      return { success: false, error: 'No wedding selected' };
    }
    
    this.setLoading(true);
    this.setError(null);
    
    try {
      const result = await apiService.getTables(this.state.currentWedding.id);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return { success: true, data: result.data };
    } catch (error) {
      this.setError(error.message);
      return { success: false, error: error.message };
    } finally {
      this.setLoading(false);
    }
  },
  
  async createTable(tableData) {
    if (!this.state.currentWedding) {
      return { success: false, error: 'No wedding selected' };
    }
    
    this.setLoading(true);
    this.setError(null);
    
    try {
      const result = await apiService.createTable(this.state.currentWedding.id, tableData);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return { success: true, data: result.data };
    } catch (error) {
      this.setError(error.message);
      return { success: false, error: error.message };
    } finally {
      this.setLoading(false);
    }
  },
  
  // Budget methods
  async getBudgetItems() {
    if (!this.state.currentWedding) {
      return { success: false, error: 'No wedding selected' };
    }
    
    this.setLoading(true);
    this.setError(null);
    
    try {
      const result = await apiService.getBudgetItems(this.state.currentWedding.id);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return { success: true, data: result.data };
    } catch (error) {
      this.setError(error.message);
      return { success: false, error: error.message };
    } finally {
      this.setLoading(false);
    }
  },
  
  // Timeline methods
  async getTimelineEvents() {
    if (!this.state.currentWedding) {
      return { success: false, error: 'No wedding selected' };
    }
    
    this.setLoading(true);
    this.setError(null);
    
    try {
      const result = await apiService.getTimelineEvents(this.state.currentWedding.id);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return { success: true, data: result.data };
    } catch (error) {
      this.setError(error.message);
      return { success: false, error: error.message };
    } finally {
      this.setLoading(false);
    }
  },
  
  // Witness tasks methods
  async getWitnessTasks() {
    if (!this.state.currentWedding) {
      return { success: false, error: 'No wedding selected' };
    }
    
    this.setLoading(true);
    this.setError(null);
    
    try {
      const result = await apiService.getWitnessTasks(this.state.currentWedding.id);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return { success: true, data: result.data };
    } catch (error) {
      this.setError(error.message);
      return { success: false, error: error.message };
    } finally {
      this.setLoading(false);
    }
  },
  
  // Moodboard methods
  async getMoodboardImages() {
    if (!this.state.currentWedding) {
      return { success: false, error: 'No wedding selected' };
    }
    
    this.setLoading(true);
    this.setError(null);
    
    try {
      const result = await apiService.getMoodboardImages(this.state.currentWedding.id);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return { success: true, data: result.data };
    } catch (error) {
      this.setError(error.message);
      return { success: false, error: error.message };
    } finally {
      this.setLoading(false);
    }
  }
};

// Add store to global properties
app.config.globalProperties.$store = store;

// Initialize app
async function initApp() {
  // Check if user is already logged in
  const userResult = await apiService.getCurrentUser();
  
  if (userResult.success) {
    store.setCurrentUser(userResult.data);
    
    // Get user's weddings
    const weddingsResult = await apiService.getWeddings();
    
    if (weddingsResult.success && weddingsResult.data.length > 0) {
      store.setCurrentWedding(weddingsResult.data[0]);
    }
  }
  
  // Mount app
  app.mount('#app');
}

// Start the app
initApp();
