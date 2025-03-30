// lib/netlifyApi.js
/**
 * Client-side API utilities for interacting with Netlify Functions
 */

// Base URL for Netlify Functions
const API_BASE = '/.netlify/functions/api';

// Helper function to make API requests
async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const fetchOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  if (fetchOptions.body && typeof fetchOptions.body !== 'string') {
    fetchOptions.body = JSON.stringify(fetchOptions.body);
  }

  try {
    const response = await fetch(url, fetchOptions);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'An error occurred');
    }
    
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Auth functions
export const auth = {
  // Sign up a new user
  signUp: (email, password) => {
    return fetchApi('/auth/signup', {
      method: 'POST',
      body: { email, password },
    });
  },

  // Sign in an existing user
  signIn: (email, password) => {
    return fetchApi('/auth/signin', {
      method: 'POST',
      body: { email, password },
    });
  },

  // Sign out the current user
  signOut: () => {
    return fetchApi('/auth/signout', {
      method: 'POST',
    });
  },

  // Get the current user
  getUser: () => {
    return fetchApi('/auth/user', {
      method: 'GET',
    });
  },

  // Reset password
  resetPassword: (email) => {
    return fetchApi('/auth/reset-password', {
      method: 'POST',
      body: { email },
    });
  },
};

// Guest management functions
export const guests = {
  // Get all guests for a wedding
  getAll: (weddingId) => {
    return fetchApi(`/guests?weddingId=${weddingId}`, {
      method: 'GET',
    });
  },

  // Get a single guest by ID
  getById: (guestId) => {
    return fetchApi(`/guests/${guestId}`, {
      method: 'GET',
    });
  },

  // Create a new guest
  create: (guestData) => {
    return fetchApi('/guests', {
      method: 'POST',
      body: guestData,
    });
  },

  // Update an existing guest
  update: (guestId, guestData) => {
    return fetchApi(`/guests/${guestId}`, {
      method: 'PUT',
      body: guestData,
    });
  },

  // Delete a guest
  delete: (guestId) => {
    return fetchApi(`/guests/${guestId}`, {
      method: 'DELETE',
    });
  },
};

// RSVP functions
export const rsvp = {
  // Get RSVP by code
  getByCode: (code) => {
    return fetchApi(`/rsvp/code?code=${code}`, {
      method: 'GET',
    });
  },

  // Submit RSVP response
  submitResponse: (rsvpData) => {
    return fetchApi('/rsvp/submit', {
      method: 'POST',
      body: rsvpData,
    });
  },

  // Get all RSVP responses for a wedding
  getResponses: (weddingId) => {
    return fetchApi(`/rsvp/responses?weddingId=${weddingId}`, {
      method: 'GET',
    });
  },
};

// Menu and food preferences functions
export const menu = {
  // Get all menu options for a wedding
  getOptions: (weddingId) => {
    return fetchApi(`/menu/options?weddingId=${weddingId}`, {
      method: 'GET',
    });
  },

  // Get all food preferences for a wedding
  getPreferences: (weddingId) => {
    return fetchApi(`/menu/preferences?weddingId=${weddingId}`, {
      method: 'GET',
    });
  },

  // Submit food preferences
  submitPreferences: (preferenceData) => {
    return fetchApi('/menu/preferences', {
      method: 'POST',
      body: preferenceData,
    });
  },
};

// Table planning functions
export const tables = {
  // Get all tables for a wedding
  getAll: (weddingId) => {
    return fetchApi(`/tables/all?weddingId=${weddingId}`, {
      method: 'GET',
    });
  },

  // Get table assignments for a wedding
  getAssignments: (weddingId) => {
    return fetchApi(`/tables/assignments?weddingId=${weddingId}`, {
      method: 'GET',
    });
  },

  // Assign a guest to a table
  assignGuest: (assignmentData) => {
    return fetchApi('/tables/assignments', {
      method: 'POST',
      body: assignmentData,
    });
  },
};

// Wedding management functions
export const weddings = {
  // Get wedding details
  getDetails: (weddingId) => {
    return fetchApi(`/weddings/details?weddingId=${weddingId}`, {
      method: 'GET',
    });
  },

  // Update wedding details
  updateDetails: (weddingId, weddingData) => {
    return fetchApi(`/weddings/details?weddingId=${weddingId}`, {
      method: 'PUT',
      body: weddingData,
    });
  },
};

// Statistics functions
export const statistics = {
  // Get RSVP statistics for a wedding
  getRsvpStats: (weddingId) => {
    return fetchApi(`/statistics/rsvp?weddingId=${weddingId}`, {
      method: 'GET',
    });
  },

  // Get menu preference statistics for a wedding
  getMenuStats: (weddingId) => {
    return fetchApi(`/statistics/menu?weddingId=${weddingId}`, {
      method: 'GET',
    });
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
};
