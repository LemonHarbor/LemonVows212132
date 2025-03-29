import { createClient } from '@supabase/supabase-js';

// Diese Umgebungsvariablen müssen in .env.local definiert werden
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jodqlliylhmwgpurfzxm.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZHFsbGl5bGhtd2dwdXJmenhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5ODI4ODgsImV4cCI6MjA1ODU1ODg4OH0.7vcXDTNdjsIpnpe-06qSyuu3K-pQVwtYpLueUuzDzDk';

// Supabase-Client erstellen
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
