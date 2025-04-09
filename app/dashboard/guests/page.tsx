'use client';

import React, { useState, useEffect } from 'react';
import GuestList from '@/components/guests/GuestList';
import GuestForm from '@/components/guests/GuestForm';
import { Guest } from '@/types/guests';
import { createClient } from '@/lib/supabase/client';

export default function GuestsPage() {
  const [showForm, setShowForm] = useState(false);
  const [currentGuest, setCurrentGuest] = useState<Guest | undefined>(undefined);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [guestToDelete, setGuestToDelete] = useState<Guest | undefined>(undefined);

  // Formular für neuen Gast öffnen
  const handleAddGuest = () => {
    setCurrentGuest(undefined);
    setShowForm(true);
  };

  // Formular für Bearbeitung öffnen
  const handleEditGuest = (guest: Guest) => {
    setCurrentGuest(guest);
    setShowForm(true);
  };

  // Löschen-Dialog öffnen
  const handleDeleteClick = (guest: Guest) => {
    setGuestToDelete(guest);
    setShowDeleteConfirm(true);
  };

  // Gast löschen
  const handleConfirmDelete = async () => {
    if (!guestToDelete) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', guestToDelete.id);

      if (error) throw error;

      // Liste aktualisieren
      setRefreshTrigger(prev => prev + 1);
      setShowDeleteConfirm(false);
      setGuestToDelete(undefined);
    } catch (error) {
      console.error('Fehler beim Löschen des Gastes:', error);
      alert('Fehler beim Löschen des Gastes');
    }
  };

  // Formular schließen
  const handleCancelForm = () => {
    setShowForm(false);
    setCurrentGuest(undefined);
  };

  // Nach erfolgreicher Speicherung
  const handleFormSuccess = () => {
    setShowForm(false);
    setCurrentGuest(undefined);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gästeliste</h1>
        <p className="mt-1 text-gray-600">
          Verwalten Sie Ihre Gäste und verfolgen Sie RSVP-Status
        </p>
      </div>

      {showForm ? (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {currentGuest ? 'Gast bearbeiten' : 'Neuen Gast hinzufügen'}
          </h2>
          <GuestForm
            guest={currentGuest}
            onSuccess={handleFormSuccess}
            onCancel={handleCancelForm}
          />
        </div>
      ) : (
        <GuestList
          onEdit={handleEditGuest}
          onDelete={handleDeleteClick}
          onAdd={handleAddGuest}
          refreshTrigger={refreshTrigger}
        />
      )}

      {/* Löschen-Bestätigungsdialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Gast löschen</h3>
            <p className="text-gray-600 mb-6">
              Sind Sie sicher, dass Sie {guestToDelete?.first_name} {guestToDelete?.last_name} aus Ihrer Gästeliste löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
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
