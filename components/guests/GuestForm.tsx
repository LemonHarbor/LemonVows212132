import React, { useState, useEffect } from 'react';
import { Guest, GuestInsert, rsvpStatusOptions } from '@/types/guests';
import { createClient } from '@/lib/supabase/client';

interface GuestFormProps {
  guest?: Guest;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function GuestForm({ guest, onSuccess, onCancel }: GuestFormProps) {
  const [formData, setFormData] = useState<GuestInsert>({
    user_id: '', // Wird beim Speichern gesetzt
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    rsvp_status: 'pending',
    dietary_restrictions: '',
    plus_one: false,
    notes: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Formular mit vorhandenen Daten füllen, wenn ein Gast bearbeitet wird
  useEffect(() => {
    if (guest) {
      setFormData({
        user_id: guest.user_id,
        first_name: guest.first_name,
        last_name: guest.last_name,
        email: guest.email,
        phone: guest.phone,
        rsvp_status: guest.rsvp_status,
        dietary_restrictions: guest.dietary_restrictions,
        plus_one: guest.plus_one,
        notes: guest.notes,
      });
    }
  }, [guest]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
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
        throw new Error('Sie müssen angemeldet sein, um Gäste zu verwalten');
      }
      
      const guestData = {
        ...formData,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      };
      
      let result;
      
      if (guest) {
        // Gast aktualisieren
        result = await supabase
          .from('guests')
          .update(guestData)
          .eq('id', guest.id);
      } else {
        // Neuen Gast erstellen
        result = await supabase
          .from('guests')
          .insert([guestData]);
      }
      
      if (result.error) {
        throw result.error;
      }
      
      onSuccess();
    } catch (err: any) {
      console.error('Fehler beim Speichern des Gastes:', err);
      setError(err.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
            Vorname *
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
        
        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
            Nachname *
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
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
        <label htmlFor="rsvp_status" className="block text-sm font-medium text-gray-700">
          RSVP-Status
        </label>
        <select
          id="rsvp_status"
          name="rsvp_status"
          value={formData.rsvp_status}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          {rsvpStatusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="dietary_restrictions" className="block text-sm font-medium text-gray-700">
          Diätanforderungen
        </label>
        <textarea
          id="dietary_restrictions"
          name="dietary_restrictions"
          value={formData.dietary_restrictions || ''}
          onChange={handleChange}
          rows={2}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="plus_one"
          name="plus_one"
          checked={formData.plus_one}
          onChange={handleChange}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="plus_one" className="ml-2 block text-sm text-gray-700">
          Plus-One (Begleitung)
        </label>
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
          {loading ? 'Wird gespeichert...' : guest ? 'Aktualisieren' : 'Speichern'}
        </button>
      </div>
    </form>
  );
}
