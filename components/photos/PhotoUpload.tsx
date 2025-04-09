'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { PhotoInsert } from '@/types/photos';

interface PhotoUploadProps {
  onSuccess: (photoData: PhotoInsert) => void;
  onCancel: () => void;
}

export default function PhotoUpload({ onSuccess, onCancel }: PhotoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Vorschau erstellen, wenn eine Datei ausgewählt wird
  useEffect(() => {
    if (!selectedFile) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // Bereinigen, wenn die Komponente unmounted wird
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      return;
    }

    const file = e.target.files[0];
    
    // Überprüfen, ob es sich um ein Bild handelt
    if (!file.type.startsWith('image/')) {
      setError('Bitte wählen Sie eine Bilddatei aus (JPEG, PNG, etc.)');
      return;
    }
    
    // Größenbeschränkung (10 MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Die Datei ist zu groß. Maximale Größe: 10 MB');
      return;
    }

    setSelectedFile(file);
    setError(null);
    
    // Titel aus Dateinamen extrahieren, wenn noch kein Titel gesetzt ist
    if (!title) {
      const fileName = file.name.split('.')[0];
      setTitle(fileName);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Bitte wählen Sie ein Bild aus');
      return;
    }
    
    setLoading(true);
    setError(null);
    setUploadProgress(0);
    
    try {
      const supabase = createClient();
      
      // Benutzer-ID abrufen
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Sie müssen angemeldet sein, um Fotos hochzuladen');
      }
      
      // Eindeutigen Dateinamen generieren
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      // Datei zu Supabase Storage hochladen
      const { error: uploadError, data } = await supabase.storage
        .from('photos')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percentage = Math.round((progress.loaded / progress.total) * 100);
            setUploadProgress(percentage);
          }
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Öffentliche URL abrufen
      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);
      
      // Foto-Eintrag in der Datenbank erstellen
      const photoData: PhotoInsert = {
        user_id: user.id,
        storage_path: filePath,
        title: title || 'Unbenanntes Foto',
        description: description || null,
      };
      
      onSuccess(photoData);
    } catch (err: any) {
      console.error('Fehler beim Hochladen des Fotos:', err);
      setError(err.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          id="photo"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={loading}
        />
        
        {!preview ? (
          <div>
            <label
              htmlFor="photo"
              className="cursor-pointer block text-gray-500 hover:text-gray-700"
            >
              <div className="flex flex-col items-center justify-center py-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p className="mt-2 text-sm font-medium">Klicken Sie hier, um ein Foto auszuwählen</p>
                <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF bis zu 10MB</p>
              </div>
            </label>
          </div>
        ) : (
          <div className="relative">
            <img
              src={preview}
              alt="Vorschau"
              className="max-h-64 mx-auto rounded-lg"
            />
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setPreview(null);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              disabled={loading}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <label
              htmlFor="photo"
              className="block mt-4 text-sm text-primary-600 hover:text-primary-700 cursor-pointer"
            >
              Anderes Foto auswählen
            </label>
          </div>
        )}
      </div>
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Titel
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          disabled={loading}
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Beschreibung
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          disabled={loading}
        />
      </div>
      
      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}
      
      {loading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary-500 h-2.5 rounded-full"
            style={{ width: `${uploadProgress}%` }}
          ></div>
          <p className="text-xs text-gray-500 mt-1 text-right">{uploadProgress}% hochgeladen</p>
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
          disabled={loading || !selectedFile}
        >
          {loading ? 'Wird hochgeladen...' : 'Hochladen'}
        </button>
      </div>
    </form>
  );
}
