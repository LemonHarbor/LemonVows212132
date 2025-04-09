import React, { useState, useEffect } from 'react';
import { Registry } from '@/types/registry';
import { createClient } from '@/lib/supabase/client';

interface RegistryListProps {
  onEdit: (registry: Registry) => void;
  onDelete: (registry: Registry) => void;
  onAdd: () => void;
  refreshTrigger?: number;
}

export default function RegistryList({ onEdit, onDelete, onAdd, refreshTrigger = 0 }: RegistryListProps) {
  const [registries, setRegistries] = useState<Registry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Registries aus Supabase laden
  useEffect(() => {
    const fetchRegistries = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const supabase = createClient();
        
        const { data, error } = await supabase
          .from('registries')
          .select('*')
          .order('name', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        setRegistries(data || []);
      } catch (err: any) {
        console.error('Fehler beim Laden der Registry-Links:', err);
        setError(err.message || 'Ein Fehler ist aufgetreten');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRegistries();
  }, [refreshTrigger]);
  
  // Registries filtern basierend auf Suchbegriff
  const filteredRegistries = registries.filter(registry => {
    const matchesSearch = 
      searchTerm === '' || 
      registry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (registry.description && registry.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Suchleiste und Hinzufügen-Button */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Registry-Links suchen..."
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
            Registry-Link hinzufügen
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
          <p className="mt-2 text-gray-500">Registry-Links werden geladen...</p>
        </div>
      )}
      
      {/* Keine Registries gefunden */}
      {!loading && filteredRegistries.length === 0 && (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">Keine Registry-Links gefunden</p>
          <button
            onClick={onAdd}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Ersten Registry-Link hinzufügen
          </button>
        </div>
      )}
      
      {/* Registry-Liste */}
      {!loading && filteredRegistries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRegistries.map((registry) => (
            <div key={registry.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{registry.name}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(registry)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      Bearbeiten
                    </button>
                    <button
                      onClick={() => onDelete(registry)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Löschen
                    </button>
                  </div>
                </div>
                
                {registry.logo_url && (
                  <div className="mt-3 h-12 flex items-center">
                    <img 
                      src={registry.logo_url} 
                      alt={`${registry.name} Logo`} 
                      className="max-h-full object-contain"
                    />
                  </div>
                )}
                
                {registry.description && (
                  <p className="mt-3 text-sm text-gray-600">
                    {registry.description}
                  </p>
                )}
                
                <div className="mt-4">
                  <a
                    href={registry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Zur Registry
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
