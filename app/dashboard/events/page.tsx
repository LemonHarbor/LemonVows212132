'use client';

import React, { useState, useEffect } from 'react';
import EventList from '@/components/events/EventList';
import EventForm from '@/components/events/EventForm';
import { Event } from '@/types/events';
import { createClient } from '@/lib/supabase/client';

export default function EventsPage() {
  const [showForm, setShowForm] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | undefined>(undefined);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | undefined>(undefined);

  // Formular für neue Veranstaltung öffnen
  const handleAddEvent = () => {
    setCurrentEvent(undefined);
    setShowForm(true);
  };

  // Formular für Bearbeitung öffnen
  const handleEditEvent = (event: Event) => {
    setCurrentEvent(event);
    setShowForm(true);
  };

  // Löschen-Dialog öffnen
  const handleDeleteClick = (event: Event) => {
    setEventToDelete(event);
    setShowDeleteConfirm(true);
  };

  // Veranstaltung löschen
  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventToDelete.id);

      if (error) throw error;

      // Liste aktualisieren
      setRefreshTrigger(prev => prev + 1);
      setShowDeleteConfirm(false);
      setEventToDelete(undefined);
    } catch (error) {
      console.error('Fehler beim Löschen der Veranstaltung:', error);
      alert('Fehler beim Löschen der Veranstaltung');
    }
  };

  // Formular schließen
  const handleCancelForm = () => {
    setShowForm(false);
    setCurrentEvent(undefined);
  };

  // Nach erfolgreicher Speicherung
  const handleFormSuccess = () => {
    setShowForm(false);
    setCurrentEvent(undefined);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Veranstaltungen</h1>
        <p className="mt-1 text-gray-600">
          Planen und verwalten Sie Ihre Hochzeitsveranstaltungen
        </p>
      </div>

      {showForm ? (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {currentEvent ? 'Veranstaltung bearbeiten' : 'Neue Veranstaltung hinzufügen'}
          </h2>
          <EventForm
            event={currentEvent}
            onSuccess={handleFormSuccess}
            onCancel={handleCancelForm}
          />
        </div>
      ) : (
        <EventList
          onEdit={handleEditEvent}
          onDelete={handleDeleteClick}
          onAdd={handleAddEvent}
          refreshTrigger={refreshTrigger}
        />
      )}

      {/* Löschen-Bestätigungsdialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Veranstaltung löschen</h3>
            <p className="text-gray-600 mb-6">
              Sind Sie sicher, dass Sie die Veranstaltung "{eventToDelete?.title}" löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
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
