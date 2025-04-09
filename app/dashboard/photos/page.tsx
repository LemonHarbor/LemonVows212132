'use client';

import React, { useState } from 'react';
import PhotoGallery from '@/components/photos/PhotoGallery';
import PhotoUpload from '@/components/photos/PhotoUpload';
import { Photo, PhotoInsert } from '@/types/photos';
import { createClient } from '@/lib/supabase/client';

export default function PhotosPage() {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<Photo | undefined>(undefined);

  // Upload-Formular öffnen
  const handleAddPhoto = () => {
    setShowUploadForm(true);
  };

  // Löschen-Dialog öffnen
  const handleDeleteClick = (photo: Photo) => {
    setPhotoToDelete(photo);
    setShowDeleteConfirm(true);
  };

  // Foto löschen
  const handleConfirmDelete = async () => {
    if (!photoToDelete) return;

    try {
      const supabase = createClient();
      
      // Zuerst den Datenbankeintrag löschen
      const { error: dbError } = await supabase
        .from('photos')
        .delete()
        .eq('id', photoToDelete.id);

      if (dbError) throw dbError;

      // Dann die Datei aus dem Storage löschen
      const { error: storageError } = await supabase.storage
        .from('photos')
        .remove([photoToDelete.storage_path]);

      if (storageError) {
        console.error('Warnung: Datei konnte nicht aus dem Storage gelöscht werden:', storageError);
        // Wir setzen fort, auch wenn die Datei nicht gelöscht werden konnte
      }

      // Liste aktualisieren
      setRefreshTrigger(prev => prev + 1);
      setShowDeleteConfirm(false);
      setPhotoToDelete(undefined);
    } catch (error) {
      console.error('Fehler beim Löschen des Fotos:', error);
      alert('Fehler beim Löschen des Fotos');
    }
  };

  // Upload-Formular schließen
  const handleCancelUpload = () => {
    setShowUploadForm(false);
  };

  // Nach erfolgreicher Speicherung
  const handleUploadSuccess = async (photoData: PhotoInsert) => {
    try {
      const supabase = createClient();
      
      // Foto in der Datenbank speichern
      const { error } = await supabase
        .from('photos')
        .insert([photoData]);
      
      if (error) throw error;
      
      // Liste aktualisieren
      setShowUploadForm(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Fehler beim Speichern des Fotos in der Datenbank:', error);
      alert('Foto wurde hochgeladen, konnte aber nicht in der Datenbank gespeichert werden');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fotos</h1>
          <p className="mt-1 text-gray-600">
            Teilen und verwalten Sie Ihre Hochzeitsfotos
          </p>
        </div>
        {!showUploadForm && (
          <button
            onClick={handleAddPhoto}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Foto hochladen
          </button>
        )}
      </div>

      {showUploadForm ? (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Neues Foto hochladen</h2>
          <PhotoUpload
            onSuccess={handleUploadSuccess}
            onCancel={handleCancelUpload}
          />
        </div>
      ) : (
        <PhotoGallery
          onDelete={handleDeleteClick}
          refreshTrigger={refreshTrigger}
        />
      )}

      {/* Löschen-Bestätigungsdialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Foto löschen</h3>
            <p className="text-gray-600 mb-6">
              Sind Sie sicher, dass Sie dieses Foto löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Abbrechen
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
