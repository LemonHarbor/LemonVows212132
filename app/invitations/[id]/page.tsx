import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import InvitationView from '@/components/invitations/InvitationView';

interface PageParams {
  id: string;
}

export default async function PublicInvitationPage({
  params,
}: {
  params: PageParams;
}) {
  const supabase = createServerComponentClient({ cookies });
  
  // Einladung anhand der ID oder benutzerdefinierten URL abrufen
  const { data: invitation } = await supabase
    .from('invitations')
    .select('*')
    .or(`id.eq.${params.id},custom_url.eq.${params.id}`)
    .eq('is_published', true)
    .single();
  
  // Wenn keine veröffentlichte Einladung gefunden wurde, 404 anzeigen
  if (!invitation) {
    notFound();
  }
  
  return <InvitationView invitation={invitation} />;
}
