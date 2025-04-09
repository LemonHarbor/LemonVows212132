import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const supabase = createRouteHandlerClient({ cookies });

  // Abmelden
  await supabase.auth.signOut();

  // Zur Startseite umleiten
  return NextResponse.redirect(`${requestUrl.origin}/`, {
    status: 302,
  });
}
