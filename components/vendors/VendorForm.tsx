import React, { useState, useEffect } from 'react';
import { Vendor, VendorInsert, vendorCategories } from '@/types/vendors';
import { createClient } from '@/lib/supabase/client';

interface VendorFormProps {
  vendor?: Vendor;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function VendorForm({ vendor, onSuccess, onCancel }: VendorFormProps) {
  const [formData, setFormData] = useState<VendorInsert>({
    user_id: '', // Wird beim Speichern gesetzt
    name: '',
    category: vendorCategories[0],
    contact_name: '',
    phone: '',
    email: '',
    website: '',
    price: null,
    notes: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Formular mit vorhandenen Daten füllen, wenn ein Dienstleister bearbeitet wird
  useEffect(() => {
    if (vendor) {
      setFormData({
        user_id: vendor.user_id,
        name: vendor.name,
        category: vendor.category,
        contact_name: vendor.contact_name,
        phone: vendor.phone,
        email: vendor.email,
        website: vendor.website,
        price: vendor.price,
        notes: vendor.notes,
      });
    }
  }, [vendor]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'price') {
      // Preis als Zahl oder null speichern
      const numValue = value === '' ? null : parseFloat(value);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const supabase = createClient();
      
      // Benutzer-ID abrufen
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Sie müssen angemeldet sein, um Dienstleister zu verwalten');
      }
      
      const vendorData = {
        ...formData,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      };
      
      let result;
      
      if (vendor) {
        // Dienstleister aktualisieren
        result = await supabase
          .from('vendors')
          .update(vendorData)
          .eq('id', vendor.id);
      } else {
        // Neuen Dienstleister erstellen
        result = await supabase
          .from('vendors')
          .insert([vendorData]);
      }
      
      if (result.error) {
        throw result.error;
      }
      
      onSuccess();
    } catch (err: any) {
      console.error('Fehler beim Speichern des Dienstleisters:', err);
      setError(err.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>
      
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Kategorie *
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          {vendorCategories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700">
            Kontaktperson
          </label>
          <input
            type="text"
            id="contact_name"
            name="contact_name"
            value={formData.contact_name || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
        
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Preis (€)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price === null ? '' : formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            E-Mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Telefon
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
          Website
        </label>
        <input
          type="url"
          id="website"
          name="website"
          value={formData.website || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder="https://example.com"
        />
      </div>
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notizen
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>
      
      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          disabled={loading}
        >
          Abbrechen
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          disabled={loading}
        >
          {loading ? 'Wird gespeichert...' : vendor ? 'Aktualisieren' : 'Speichern'}
        </button>
      </div>
    </form>
  );
}
