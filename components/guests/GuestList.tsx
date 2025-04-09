import React, { useState, useEffect } from 'react';
import { Guest } from '@/types/guests';
import { createClient } from '@/lib/supabase/client';

interface GuestListProps {
  onEdit: (guest: Guest) => void;
  onDelete: (guest: Guest) => void;
  onAdd: () => void;
  refreshTrigger?: number;
}

export default function GuestList({ onEdit, onDelete, onAdd, refreshTrigger = 0 }: GuestListProps) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [rsvpFilter, setRsvpFilter] = useState<string>('all');

  // Gäste aus Supabase laden
  useEffect(() => {
    const fetchGuests = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const supabase = createClient();
        
        const { data, error } = await supabase
          .from('guests')
          .select('*')
          .order('last_name', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        setGuests(data || []);
      } catch (err: any) {
        console.error('Fehler beim Laden der Gäste:', err);
        setError(err.message || 'Ein Fehler ist aufgetreten');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGuests();
  }, [refreshTrigger]);
  
  // Gäste filtern basierend auf Suchbegriff und RSVP-Status
  const filteredGuests = guests.filter(guest => {
    const matchesSearch = 
      searchTerm === '' || 
      `${guest.first_name} ${guest.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (guest.email && guest.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRsvp = 
      rsvpFilter === 'all' || 
      guest.rsvp_status === rsvpFilter;
    
    return matchesSearch && matchesRsvp;
  });
  
  // RSVP-Status in lesbaren Text umwandeln
  const getRsvpStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Zugesagt';
      case 'declined': return 'Abgesagt';
      case 'pending': return 'Ausstehend';
      default: return status;
    }
  };
  
  // RSVP-Status-Farbe
  const getRsvpStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Statistiken berechnen
  const stats = {
    total: guests.length,
    confirmed: guests.filter(g => g.rsvp_status === 'confirmed').length,
    declined: guests.filter(g => g.rsvp_status === 'declined').length,
    pending: guests.filter(g => g.rsvp_status === 'pending').length,
  };

  return (
    <div className="space-y-4">
      {/* Statistiken */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Gesamt</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Zugesagt</p>
          <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Abgesagt</p>
          <p className="text-2xl font-bold text-red-600">{stats.declined}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Ausstehend</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
      </div>
      
      {/* Suchleiste und Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Gäste suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div className="w-full md:w-48">
          <select
            value={rsvpFilter}
            onChange={(e) => setRsvpFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">Alle RSVP</option>
            <option value="confirmed">Zugesagt</option>
            <option value="declined">Abgesagt</option>
            <option value="pending">Ausstehend</option>
          </select>
        </div>
        <div>
          <button
            onClick={onAdd}
            className="w-full md:w-auto px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Gast hinzufügen
          </button>
        </div>
      </div>
      
      {/* Fehlermeldung */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/* Ladeindikator */}
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          <p className="mt-2 text-gray-500">Gäste werden geladen...</p>
        </div>
      )}
      
      {/* Gästeliste */}
      {!loading && filteredGuests.length === 0 && (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">Keine Gäste gefunden</p>
          <button
            onClick={onAdd}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Ersten Gast hinzufügen
          </button>
        </div>
      )}
      
      {!loading && filteredGuests.length > 0 && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredGuests.map((guest) => (
              <li key={guest.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {guest.first_name} {guest.last_name}
                          {guest.plus_one && (
                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              +1
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          {guest.email || 'Keine E-Mail'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRsvpStatusColor(guest.rsvp_status)}`}>
                        {getRsvpStatusText(guest.rsvp_status)}
                      </span>
                      <button
                        onClick={() => onEdit(guest)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => onDelete(guest)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Löschen
                      </button>
                    </div>
                  </div>
                  {(guest.phone || guest.dietary_restrictions) && (
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        {guest.phone && (
                          <p className="flex items-center text-sm text-gray-500">
                            {guest.phone}
                          </p>
                        )}
                      </div>
                      {guest.dietary_restrictions && (
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>
                            <span className="font-medium">Diät:</span> {guest.dietary_restrictions}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
