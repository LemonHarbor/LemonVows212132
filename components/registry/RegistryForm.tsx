import React, { useState, useEffect } from 'react';
import { Registry, RegistryInsert } from '@/types/registry';
import { createClient } from '@/lib/supabase/client';

interface RegistryFormProps {
  registry?: Registry;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function RegistryForm({ registry, onSuccess, onCancel }: RegistryFormProps) {
  const [formData, setFormData] = useState<RegistryInsert>({
    user_id: '', // Wird beim Speichern gesetzt
    name: '',
    url: '',
    description: '',
    logo_url: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Formular mit vorhandenen Daten füllen, wenn ein Registry bearbeitet wird
  useEffect(() => {
    if (registry) {
      setFormData({
        user_id: registry.user_id,
        name: registry.name,
        url: registry.url,
        description: registry.description || '',
        logo_url: registry.logo_url || '',
      });
    }
  }, [registry]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        throw new Error('Sie müssen angemeldet sein, um Registry-Links zu verwalten');
      }
      
      // URL validieren
      if (!formData.url.startsWith('http://') && !formData.url.startsWith('https://')) {
        formData.url = 'https://' + formData.url;
      }
      
      const registryData = {
        ...formData,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      };
      
      let result;
      
      if (registry) {
        // Registry aktualisieren
        result = await supabase
          .from('registries')
          .update(registryData)
          .eq('id', registry.id);
      } else {
        // Neue Registry erstellen
        result = await supabase
          .from('registries')
          .insert([registryData]);
      }
      
      if (result.error) {
        throw result.error;
      }
      
      onSuccess();
    } catch (err: any) {
      console.error('Fehler beim Speichern des Registry-Links:', err);
      setError(err.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name des Geschäfts/der Registry *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder="z.B. Amazon Wunschliste"
        />
      </div>
      
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700">
          URL *
        </label>
        <input
          type="text"
          id="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder="https://www.beispiel.de/wunschliste"
        />
        <p className="mt-1 text-xs text-gray-500">
          Vollständige URL zur Registry oder Wunschliste
        </p>
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Beschreibung
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder="Kurze Beschreibung oder Hinweise für Ihre Gäste"
        />
      </div>
      
      <div>
        <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700">
          Logo URL
        </label>
        <input
          type="text"
          id="logo_url"
          name="logo_url"
          value={formData.logo_url}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder="https://www.beispiel.de/logo.png"
        />
        <p className="mt-1 text-xs text-gray-500">
          Optional. URL zu einem Logo des Geschäfts oder der Registry-Plattform.
        </p>
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
          {loading ? 'Wird gespeichert...' : registry ? 'Aktualisieren' : 'Speichern'}
        </button>
      </div>
    </form>
  );
}
