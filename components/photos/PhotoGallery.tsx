'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Photo } from '@/types/photos';

interface PhotoGalleryProps {
  onDelete: (photo: Photo) => void;
  refreshTrigger?: number;
}

export default function PhotoGallery({ onDelete, refreshTrigger = 0 }: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // Fotos aus Supabase laden
  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const supabase = createClient();
        
        const { data, error } = await supabase
          .from('photos')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setPhotos(data || []);
      } catch (err: any) {
        console.error('Fehler beim Laden der Fotos:', err);
        setError(err.message || 'Ein Fehler ist aufgetreten');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPhotos();
  }, [refreshTrigger]);

  // Öffentliche URL für ein Foto abrufen
  const getPhotoUrl = (photo: Photo) => {
    const supabase = createClient();
    const { data } = supabase.storage
      .from('photos')
      .getPublicUrl(photo.storage_path);
    
    return data.publicUrl;
  };

  // Foto-Modal öffnen
  const openPhotoModal = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  // Foto-Modal schließen
  const closePhotoModal = () => {
    setSelectedPhoto(null);
  };

  return (
    <div>
      {/* Fehlermeldung */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/* Ladeindikator */}
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          <p className="mt-2 text-gray-500">Fotos werden geladen...</p>
        </div>
      )}
      
      {/* Keine Fotos gefunden */}
      {!loading && photos.length === 0 && (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">Keine Fotos gefunden</p>
          <p className="mt-2 text-sm text-gray-500">Laden Sie Ihre ersten Hochzeitsfotos hoch</p>
        </div>
      )}
      
      {/* Fotogalerie */}
      {!loading && photos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <div className="aspect-square overflow-hidden rounded-lg shadow-md bg-gray-100">
                <img
                  src={getPhotoUrl(photo)}
                  alt={photo.title || 'Hochzeitsfoto'}
                  className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                  onClick={() => openPhotoModal(photo)}
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                  <button
                    onClick={() => openPhotoModal(photo)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                    title="Vergrößern"
                  >
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(photo)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                    title="Löschen"
                  >
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
              {photo.title && (
                <div className="mt-2">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{photo.title}</h3>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Foto-Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={closePhotoModal}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <img
              src={getPhotoUrl(selectedPhoto)}
              alt={selectedPhoto.title || 'Hochzeitsfoto'}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            <div className="mt-4 bg-white p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900">{selectedPhoto.title || 'Unbenanntes Foto'}</h3>
              {selectedPhoto.description && (
                <p className="mt-1 text-gray-600">{selectedPhoto.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
