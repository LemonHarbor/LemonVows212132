import React, { useState, useEffect } from 'react';
import { Invitation } from '@/types/invitations';
import { createClient } from '@/lib/supabase/client';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

interface InvitationListProps {
  onEdit: (invitation: Invitation) => void;
  onDelete: (invitation: Invitation) => void;
  onAdd: () => void;
  refreshTrigger?: number;
}

export default function InvitationList({ onEdit, onDelete, onAdd, refreshTrigger = 0 }: InvitationListProps) {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [publishedFilter, setPublishedFilter] = useState<string>('all');

  // Einladungen aus Supabase laden
  useEffect(() => {
    const fetchInvitations = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const supabase = createClient();
        
        const { data, error } = await supabase
          .from('invitations')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setInvitations(data || []);
      } catch (err: any) {
        console.error('Fehler beim Laden der Einladungen:', err);
        setError(err.message || 'Ein Fehler ist aufgetreten');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvitations();
  }, [refreshTrigger]);
  
  // Einladungen filtern basierend auf Suchbegriff und Veröffentlichungsstatus
  const filteredInvitations = invitations.filter(invitation => {
    const matchesSearch = 
      searchTerm === '' || 
      invitation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invitation.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPublished = 
      publishedFilter === 'all' || 
      (publishedFilter === 'published' && invitation.is_published) || 
      (publishedFilter === 'draft' && !invitation.is_published);
    
    return matchesSearch && matchesPublished;
  });
  
  // Datum formatieren
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'dd. MMMM yyyy, HH:mm', { locale: de });
  };
  
  // Theme-Namen abrufen
  const getThemeName = (themeId: string) => {
    const themes = {
      'classic': 'Klassisch',
      'modern': 'Modern',
      'rustic': 'Rustikal',
      'elegant': 'Elegant',
      'minimalist': 'Minimalistisch'
    };
    return themes[themeId as keyof typeof themes] || themeId;
  };

  return (
    <div className="space-y-4">
      {/* Suchleiste, Filter und Hinzufügen-Button */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Einladungen suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div className="w-full md:w-48">
          <select
            value={publishedFilter}
            onChange={(e) => setPublishedFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">Alle Einladungen</option>
            <option value="published">Veröffentlicht</option>
            <option value="draft">Entwurf</option>
          </select>
        </div>
        <div>
          <button
            onClick={onAdd}
            className="w-full md:w-auto px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Einladung erstellen
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
          <p className="mt-2 text-gray-500">Einladungen werden geladen...</p>
        </div>
      )}
      
      {/* Keine Einladungen gefunden */}
      {!loading && filteredInvitations.length === 0 && (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">Keine Einladungen gefunden</p>
          <button
            onClick={onAdd}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Erste Einladung erstellen
          </button>
        </div>
      )}
      
      {/* Einladungsliste */}
      {!loading && filteredInvitations.length > 0 && (
        <div className="space-y-4">
          {filteredInvitations.map((invitation) => (
            <div key={invitation.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {invitation.title}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Erstellt am {formatDate(invitation.created_at)}
                    {invitation.created_at !== invitation.updated_at && 
                      ` • Aktualisiert am ${formatDate(invitation.updated_at)}`}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEdit(invitation)}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    Bearbeiten
                  </button>
                  <button
                    onClick={() => onDelete(invitation)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Löschen
                  </button>
                </div>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${invitation.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {invitation.is_published ? 'Veröffentlicht' : 'Entwurf'}
                      </span>
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Design-Thema</dt>
                    <dd className="mt-1 text-sm text-gray-900">{getThemeName(invitation.theme)}</dd>
                  </div>
                  {invitation.is_published && (
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Öffentliche URL</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <a 
                          href={`/invitations/${invitation.custom_url || invitation.id}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-900 hover:underline"
                        >
                          {window.location.origin}/invitations/{invitation.custom_url || invitation.id}
                        </a>
                      </dd>
                    </div>
                  )}
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Vorschau des Inhalts</dt>
                    <dd className="mt-1 text-sm text-gray-900 prose max-w-none">
                      {invitation.content.length > 200 
                        ? `${invitation.content.substring(0, 200)}...` 
                        : invitation.content}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
