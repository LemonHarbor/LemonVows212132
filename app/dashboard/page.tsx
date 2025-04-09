import React from 'react';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function Dashboard() {
  const supabase = createClient();
  
  // Statistiken abrufen
  const { data: { user } } = await supabase.auth.getUser();
  
  // Gäste zählen
  const { count: guestCount } = await supabase
    .from('guests')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user?.id);
  
  // Veranstaltungen zählen
  const { count: eventCount } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user?.id);
  
  // Fotos zählen
  const { count: photoCount } = await supabase
    .from('photos')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user?.id);
  
  // Dienstleister zählen
  const { count: vendorCount } = await supabase
    .from('vendors')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user?.id);
  
  // Feature-Karten definieren
  const features = [
    {
      title: 'Gästeliste',
      description: 'Verwalten Sie Ihre Gäste und verfolgen Sie RSVP-Status',
      count: guestCount || 0,
      link: '/dashboard/guests',
      color: 'bg-blue-500',
      priority: 'Priorität 1'
    },
    {
      title: 'Veranstaltungen',
      description: 'Planen Sie Ihre Hochzeitsveranstaltungen',
      count: eventCount || 0,
      link: '/dashboard/events',
      color: 'bg-green-500',
      priority: 'Priorität 2'
    },
    {
      title: 'Fotos',
      description: 'Teilen und verwalten Sie Ihre Hochzeitsfotos',
      count: photoCount || 0,
      link: '/dashboard/photos',
      color: 'bg-purple-500',
      priority: 'Priorität 3'
    },
    {
      title: 'Dienstleister',
      description: 'Verwalten Sie Ihre Hochzeitsdienstleister',
      count: vendorCount || 0,
      link: '/dashboard/vendors',
      color: 'bg-yellow-500'
    },
    {
      title: 'Budget',
      description: 'Verfolgen Sie Ihre Hochzeitsausgaben',
      link: '/dashboard/budget',
      color: 'bg-red-500'
    },
    {
      title: 'Einladungen',
      description: 'Erstellen Sie digitale Einladungen',
      link: '/dashboard/invitations',
      color: 'bg-pink-500'
    },
    {
      title: 'Geschenkliste',
      description: 'Verwalten Sie Ihre Geschenkwünsche',
      link: '/dashboard/registry',
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Willkommen bei LemonVows</h1>
        <p className="mt-1 text-gray-600">
          Ihre persönliche Hochzeitsplanungs-Plattform
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Link 
            key={index} 
            href={feature.link}
            className="block group"
          >
            <div className={`h-full rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all duration-200 group-hover:shadow-lg`}>
              <div className={`${feature.color} h-2`}></div>
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                  {feature.priority && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {feature.priority}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-gray-600">{feature.description}</p>
                {feature.count !== undefined && (
                  <div className="mt-4 flex items-center">
                    <span className="text-2xl font-bold text-gray-900">{feature.count}</span>
                    <span className="ml-2 text-sm text-gray-500">Einträge</span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
