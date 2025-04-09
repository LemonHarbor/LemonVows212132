'use client';

import React, { useState } from 'react';
import RegistryList from '@/components/registry/RegistryList';
import RegistryForm from '@/components/registry/RegistryForm';
import { Registry } from '@/types/registry';
import { createClient } from '@/lib/supabase/client';

export default function RegistryPage() {
  const [showForm, setShowForm] = useState(false);
  const [currentRegistry, setCurrentRegistry] = useState<Registry | undefined>(undefined);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [registryToDelete, setRegistryToDelete] = useState<Registry | undefined>(undefined);

  // Formular für neuen Registry-Link öffnen
  const handleAddRegistry = () => {
    setCurrentRegistry(undefined);
    setShowForm(true);
  };

  // Formular für Bearbeitung öffnen
  const handleEditRegistry = (registry: Registry) => {
    setCurrentRegistry(registry);
    setShowForm(true);
  };

  // Löschen-Dialog öffnen
  const handleDeleteClick = (registry: Registry) => {
    setRegistryToDelete(registry);
    setShowDeleteConfirm(true);
  };

  // Registry-Link löschen
  const handleConfirmDelete = async () => {
    if (!registryToDelete) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('registries')
        .delete()
        .eq('id', registryToDelete.id);

      if (error) throw error;

      // Liste aktualisieren
      setRefreshTrigger(prev => prev + 1);
      setShowDeleteConfirm(false);
      setRegistryToDelete(undefined);
    } catch (error) {
      console.error('Fehler beim Löschen des Registry-Links:', error);
      alert('Fehler beim Löschen des Registry-Links');
    }
  };

  // Formular schließen
  const handleCancelForm = () => {
    setShowForm(false);
    setCurrentRegistry(undefined);
  };

  // Nach erfolgreicher Speicherung
  const handleFormSuccess = () => {
    setShowForm(false);
    setCurrentRegistry(undefined);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Geschenk-Registries</h1>
        <p className="mt-1 text-gray-600">
          Verwalten Sie Ihre Wunschlisten und Registry-Links
        </p>
      </div>

      {showForm ? (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {currentRegistry ? 'Registry-Link bearbeiten' : 'Neuen Registry-Link hinzufügen'}
          </h2>
          <RegistryForm
            registry={currentRegistry}
            onSuccess={handleFormSuccess}
            onCancel={handleCancelForm}
          />
        </div>
      ) : (
        <RegistryList
          onEdit={handleEditRegistry}
          onDelete={handleDeleteClick}
          onAdd={handleAddRegistry}
          refreshTrigger={refreshTrigger}
        />
      )}

      {/* Löschen-Bestätigungsdialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Registry-Link löschen</h3>
            <p className="text-gray-600 mb-6">
              Sind Sie sicher, dass Sie den Registry-Link "{registryToDelete?.name}" löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
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
