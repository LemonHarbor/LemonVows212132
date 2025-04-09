import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  // Server-side Authentifizierung prüfen
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  // Wenn angemeldet, zum Dashboard umleiten
  if (session) {
    redirect('/dashboard');
  }
  
  // Ansonsten zur Anmeldeseite umleiten
  redirect('/auth/signin');
}
