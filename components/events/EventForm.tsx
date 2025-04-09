import React, { useState, useEffect } from 'react';
import { Event, EventInsert } from '@/types/events';
import { createClient } from '@/lib/supabase/client';
import { format, parseISO } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface EventFormProps {
  event?: Event;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EventForm({ event, onSuccess, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState<EventInsert>({
    user_id: '', // Wird beim Speichern gesetzt
    title: '',
    description: '',
    start_time: new Date().toISOString(),
    end_time: new Date().toISOString(),
    location: '',
  });
  
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Formular mit vorhandenen Daten füllen, wenn ein Event bearbeitet wird
  useEffect(() => {
    if (event) {
      setFormData({
        user_id: event.user_id,
        title: event.title,
        description: event.description,
        start_time: event.start_time,
        end_time: event.end_time,
        location: event.location,
      });
      
      setStartDate(parseISO(event.start_time));
      setEndDate(parseISO(event.end_time));
    }
  }, [event]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      setStartDate(date);
      setFormData(prev => ({ ...prev, start_time: date.toISOString() }));
      
      // Wenn das Enddatum vor dem neuen Startdatum liegt, setze es auf das Startdatum
      if (endDate < date) {
        setEndDate(date);
        setFormData(prev => ({ ...prev, end_time: date.toISOString() }));
      }
    }
  };
  
  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      setEndDate(date);
      setFormData(prev => ({ ...prev, end_time: date.toISOString() }));
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
        throw new Error('Sie müssen angemeldet sein, um Veranstaltungen zu verwalten');
      }
      
      const eventData = {
        ...formData,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      };
      
      let result;
      
      if (event) {
        // Event aktualisieren
        result = await supabase
          .from('events')
          .update(eventData)
          .eq('id', event.id);
      } else {
        // Neues Event erstellen
        result = await supabase
          .from('events')
          .insert([eventData]);
      }
      
      if (result.error) {
        throw result.error;
      }
      
      onSuccess();
    } catch (err: any) {
      console.error('Fehler beim Speichern der Veranstaltung:', err);
      setError(err.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Titel *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Beschreibung
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">
            Startzeit *
          </label>
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="dd.MM.yyyy HH:mm"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
        
        <div>
          <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">
            Endzeit *
          </label>
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="dd.MM.yyyy HH:mm"
            minDate={startDate}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Ort
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location || ''}
          onChange={handleChange}
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
          {loading ? 'Wird gespeichert...' : event ? 'Aktualisieren' : 'Speichern'}
        </button>
      </div>
    </form>
  );
}
