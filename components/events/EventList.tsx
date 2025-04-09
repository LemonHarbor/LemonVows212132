import React, { useState, useEffect } from 'react';
import { Event } from '@/types/events';
import { createClient } from '@/lib/supabase/client';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

interface EventListProps {
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
  onAdd: () => void;
  refreshTrigger?: number;
}

export default function EventList({ onEdit, onDelete, onAdd, refreshTrigger = 0 }: EventListProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Events aus Supabase laden
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const supabase = createClient();
        
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('start_time', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        setEvents(data || []);
      } catch (err: any) {
        console.error('Fehler beim Laden der Veranstaltungen:', err);
        setError(err.message || 'Ein Fehler ist aufgetreten');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [refreshTrigger]);
  
  // Events filtern basierend auf Suchbegriff
  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      searchTerm === '' || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });
  
  // Datum formatieren
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'dd. MMMM yyyy', { locale: de });
  };
  
  // Zeit formatieren
  const formatTime = (dateString: string) => {
    return format(parseISO(dateString), 'HH:mm');
  };
  
  // Events nach Datum gruppieren
  const groupedEvents = filteredEvents.reduce<Record<string, Event[]>>((groups, event) => {
    const date = formatDate(event.start_time);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {});

  return (
    <div className="space-y-4">
      {/* Suchleiste und Hinzufügen-Button */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Veranstaltungen suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <button
            onClick={onAdd}
            className="w-full md:w-auto px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Veranstaltung hinzufügen
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
          <p className="mt-2 text-gray-500">Veranstaltungen werden geladen...</p>
        </div>
      )}
      
      {/* Keine Events gefunden */}
      {!loading && filteredEvents.length === 0 && (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">Keine Veranstaltungen gefunden</p>
          <button
            onClick={onAdd}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Erste Veranstaltung hinzufügen
          </button>
        </div>
      )}
      
      {/* Veranstaltungsliste */}
      {!loading && filteredEvents.length > 0 && (
        <div className="space-y-6">
          {Object.entries(groupedEvents).map(([date, dayEvents]) => (
            <div key={date} className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">{date}</h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {dayEvents.map((event) => (
                  <li key={event.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{event.title}</h4>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <span className="mr-2">
                              {formatTime(event.start_time)} - {formatTime(event.end_time)}
                            </span>
                            {event.location && (
                              <span className="ml-2">
                                | {event.location}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onEdit(event)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            Bearbeiten
                          </button>
                          <button
                            onClick={() => onDelete(event)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Löschen
                          </button>
                        </div>
                      </div>
                      {event.description && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">{event.description}</p>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
