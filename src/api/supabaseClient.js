// Global Supabase client for the application
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
const globalSupabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// Export for use throughout the application
export { globalSupabaseClient };
