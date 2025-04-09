import React, { useState, useEffect } from 'react';
import { Invitation, InvitationInsert } from '@/types/invitations-extended';
import { createClient } from '@/lib/supabase/client';

interface InvitationFormProps {
  invitation?: Invitation;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function InvitationForm({ invitation, onSuccess, onCancel }: InvitationFormProps) {
  const [formData, setFormData] = useState<InvitationInsert>({
    user_id: '', // Wird beim Speichern gesetzt
    title: '',
    content: '',
    theme: 'classic',
    is_published: false,
    custom_url: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Verfügbare Themes
  const themes = [
    { id: 'classic', name: 'Klassisch' },
    { id: 'modern', name: 'Modern' },
    { id: 'rustic', name: 'Rustikal' },
    { id: 'elegant', name: 'Elegant' },
    { id: 'minimalist', name: 'Minimalistisch' },
  ];
  
  // Formular mit vorhandenen Daten füllen, wenn eine Einladung bearbeitet wird
  useEffect(() => {
    if (invitation) {
      setFormData({
        user_id: invitation.user_id,
        title: invitation.title,
        content: invitation.content,
        theme: invitation.theme,
        is_published: invitation.is_published,
        custom_url: invitation.custom_url || '',
      });
      
      if (invitation.is_published) {
        setPreviewUrl(`/invitations/${invitation.id}`);
      }
    }
  }, [invitation]);
  
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
        throw new Error('Sie müssen angemeldet sein, um Einladungen zu verwalten');
      }
      
      const invitationData = {
        ...formData,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      };
      
      let result;
      
      if (invitation) {
        // Einladung aktualisieren
        result = await supabase
          .from('invitations')
          .update(invitationData)
          .eq('id', invitation.id);
      } else {
        // Neue Einladung erstellen
        result = await supabase
          .from('invitations')
          .insert([invitationData]);
      }
      
      if (result.error) {
        throw result.error;
      }
      
      onSuccess();
    } catch (err: any) {
      console.error('Fehler beim Speichern der Einladung:', err);
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
          placeholder="z.B. Hochzeitseinladung von Anna & Max"
        />
      </div>
      
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Inhalt *
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows={8}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder="Geben Sie hier den Text Ihrer Einladung ein..."
        />
        <p className="mt-1 text-xs text-gray-500">
          Hinweis: Sie können einfache Formatierungen wie **fett** und *kursiv* verwenden.
        </p>
      </div>
      
      <div>
        <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
          Design-Thema *
        </label>
        <select
          id="theme"
          name="theme"
          value={formData.theme}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          {themes.map(theme => (
            <option key={theme.id} value={theme.id}>
              {theme.name}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="custom_url" className="block text-sm font-medium text-gray-700">
          Benutzerdefinierte URL
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
            /invitations/
          </span>
          <input
            type="text"
            id="custom_url"
            name="custom_url"
            value={formData.custom_url}
            onChange={handleChange}
            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
            placeholder="anna-und-max"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Optional. Lassen Sie dieses Feld leer, um eine automatisch generierte URL zu verwenden.
        </p>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_published"
          name="is_published"
          checked={formData.is_published}
          onChange={handleChange}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="is_published" className="ml-2 block text-sm text-gray-700">
          Veröffentlichen (für Gäste sichtbar machen)
        </label>
      </div>
      
      {previewUrl && (
        <div className="bg-blue-50 p-4 rounded-md">
          <p className="text-sm text-blue-700">
            Diese Einladung ist veröffentlicht und kann unter folgender URL aufgerufen werden:
          </p>
          <a 
            href={previewUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-1 block text-blue-600 hover:underline"
          >
            {window.location.origin}{previewUrl}
          </a>
        </div>
      )}
      
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
          {loading ? 'Wird gespeichert...' : invitation ? 'Aktualisieren' : 'Speichern'}
        </button>
      </div>
    </form>
  );
}
