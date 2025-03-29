// This file ensures Supabase environment variables are properly loaded
// It's used by both the application and testing scripts

const { createClient } = require('@supabase/supabase-js');

// Get environment variables with fallback to .env.local
const getSupabaseConfig = () => {
  // Try to get from process.env first
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // If not available, try to load from .env.local directly
  if (!supabaseUrl || !supabaseAnonKey) {
    try {
      const fs = require('fs');
      const path = require('path');
      const dotenv = require('dotenv');
      
      const envPath = path.resolve(process.cwd(), '.env.local');
      if (fs.existsSync(envPath)) {
        const envConfig = dotenv.parse(fs.readFileSync(envPath));
        
        supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL || supabaseUrl;
        supabaseAnonKey = envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY || supabaseAnonKey;
      }
    } catch (error) {
      console.error('Error loading environment variables:', error);
    }
  }
  
  return { supabaseUrl, supabaseAnonKey };
};

// Export the configuration and a helper to create clients
module.exports = {
  getSupabaseConfig,
  createSupabaseClient: () => {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase configuration is missing. Please check your .env.local file.');
    }
    return createClient(supabaseUrl, supabaseAnonKey);
  }
};
