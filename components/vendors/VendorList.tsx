import React, { useState, useEffect } from 'react';
import { Vendor } from '@/types/vendors';
import { createClient } from '@/lib/supabase/client';

interface VendorListProps {
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendor: Vendor) => void;
  onAdd: () => void;
  refreshTrigger?: number;
}

export default function VendorList({ onEdit, onDelete, onAdd, refreshTrigger = 0 }: VendorListProps) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);

  // Dienstleister aus Supabase laden
  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const supabase = createClient();
        
        const { data, error } = await supabase
          .from('vendors')
          .select('*')
          .order('name', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        setVendors(data || []);
        
        // Verfügbare Kategorien extrahieren
        if (data && data.length > 0) {
          const uniqueCategories = Array.from(new Set(data.map(vendor => vendor.category)));
          setCategories(uniqueCategories);
        }
      } catch (err: any) {
        console.error('Fehler beim Laden der Dienstleister:', err);
        setError(err.message || 'Ein Fehler ist aufgetreten');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVendors();
  }, [refreshTrigger]);
  
  // Dienstleister filtern basierend auf Suchbegriff und Kategorie
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = 
      searchTerm === '' || 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vendor.contact_name && vendor.contact_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vendor.notes && vendor.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = 
      categoryFilter === 'all' || 
      vendor.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Preis formatieren
  const formatPrice = (price: number | null) => {
    if (price === null) return '-';
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price);
  };

  return (
    <div className="space-y-4">
      {/* Suchleiste, Filter und Hinzufügen-Button */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Dienstleister suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div className="w-full md:w-48">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">Alle Kategorien</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div>
          <button
            onClick={onAdd}
            className="w-full md:w-auto px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Dienstleister hinzufügen
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
          <p className="mt-2 text-gray-500">Dienstleister werden geladen...</p>
        </div>
      )}
      
      {/* Keine Dienstleister gefunden */}
      {!loading && filteredVendors.length === 0 && (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">Keine Dienstleister gefunden</p>
          <button
            onClick={onAdd}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Ersten Dienstleister hinzufügen
          </button>
        </div>
      )}
      
      {/* Dienstleisterliste */}
      {!loading && filteredVendors.length > 0 && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredVendors.map((vendor) => (
              <li key={vendor.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{vendor.name}</h3>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {vendor.category}
                        </span>
                        {vendor.price !== null && (
                          <span className="ml-2">
                            | {formatPrice(vendor.price)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEdit(vendor)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => onDelete(vendor)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Löschen
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      {vendor.contact_name && (
                        <p className="flex items-center text-sm text-gray-500">
                          <span className="mr-1 font-medium">Kontakt:</span> {vendor.contact_name}
                        </p>
                      )}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      {vendor.phone && (
                        <p className="mr-4">
                          <span className="mr-1 font-medium">Tel:</span> {vendor.phone}
                        </p>
                      )}
                      {vendor.email && (
                        <p>
                          <span className="mr-1 font-medium">E-Mail:</span> {vendor.email}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {(vendor.website || vendor.notes) && (
                    <div className="mt-2">
                      {vendor.website && (
                        <p className="text-sm text-primary-600 hover:text-primary-900">
                          <a href={vendor.website} target="_blank" rel="noopener noreferrer">
                            Website besuchen
                          </a>
                        </p>
                      )}
                      {vendor.notes && (
                        <p className="mt-1 text-sm text-gray-600">
                          <span className="font-medium">Notizen:</span> {vendor.notes}
                        </p>
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
