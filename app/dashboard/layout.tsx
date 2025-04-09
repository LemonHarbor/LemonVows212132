import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side Authentifizierung prüfen
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    // Wenn nicht angemeldet, zur Login-Seite umleiten
    redirect('/auth/signin');
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-primary-500 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/dashboard" className="font-bold text-xl">
                  LemonVows
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <form action="/auth/signout" method="post">
                <button 
                  type="submit"
                  className="px-3 py-2 rounded text-sm font-medium hover:bg-primary-600"
                >
                  Abmelden
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Dashboard</h3>
              </div>
              <nav className="py-2">
                <ul>
                  <li>
                    <Link 
                      href="/dashboard/guests" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      Gästeliste
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/dashboard/events" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      Veranstaltungen
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/dashboard/photos" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      Fotos
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/dashboard/vendors" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      Dienstleister
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/dashboard/budget" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      Budget
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/dashboard/invitations" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      Einladungen
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/dashboard/registry" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      Geschenkliste
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          
          {/* Hauptinhalt */}
          <div className="flex-1">
            <div className="bg-white shadow rounded-lg">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
