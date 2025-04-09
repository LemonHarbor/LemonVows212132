'use client';

import React, { useState } from 'react';
import InvitationList from '@/components/invitations/InvitationList';
import InvitationForm from '@/components/invitations/InvitationForm';
import { Invitation } from '@/types/invitations';
import { createClient } from '@/lib/supabase/client';

export default function InvitationsPage() {
  const [showForm, setShowForm] = useState(false);
  const [currentInvitation, setCurrentInvitation] = useState<Invitation | undefined>(undefined);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [invitationToDelete, setInvitationToDelete] = useState<Invitation | undefined>(undefined);

  // Formular für neue Einladung öffnen
  const handleAddInvitation = () => {
    setCurrentInvitation(undefined);
    setShowForm(true);
  };

  // Formular für Bearbeitung öffnen
  const handleEditInvitation = (invitation: Invitation) => {
    setCurrentInvitation(invitation);
    setShowForm(true);
  };

  // Löschen-Dialog öffnen
  const handleDeleteClick = (invitation: Invitation) => {
    setInvitationToDelete(invitation);
    setShowDeleteConfirm(true);
  };

  // Einladung löschen
  const handleConfirmDelete = async () => {
    if (!invitationToDelete) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('invitations')
        .delete()
        .eq('id', invitationToDelete.id);

      if (error) throw error;

      // Liste aktualisieren
      setRefreshTrigger(prev => prev + 1);
      setShowDeleteConfirm(false);
      setInvitationToDelete(undefined);
    } catch (error) {
      console.error('Fehler beim Löschen der Einladung:', error);
      alert('Fehler beim Löschen der Einladung');
    }
  };

  // Formular schließen
  const handleCancelForm = () => {
    setShowForm(false);
    setCurrentInvitation(undefined);
  };

  // Nach erfolgreicher Speicherung
  const handleFormSuccess = () => {
    setShowForm(false);
    setCurrentInvitation(undefined);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Digitale Einladungen</h1>
        <p className="mt-1 text-gray-600">
          Erstellen und verwalten Sie Ihre digitalen Hochzeitseinladungen
        </p>
      </div>

      {showForm ? (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {currentInvitation ? 'Einladung bearbeiten' : 'Neue Einladung erstellen'}
          </h2>
          <InvitationForm
            invitation={currentInvitation}
            onSuccess={handleFormSuccess}
            onCancel={handleCancelForm}
          />
        </div>
      ) : (
        <InvitationList
          onEdit={handleEditInvitation}
          onDelete={handleDeleteClick}
          onAdd={handleAddInvitation}
          refreshTrigger={refreshTrigger}
        />
      )}

      {/* Löschen-Bestätigungsdialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Einladung löschen</h3>
            <p className="text-gray-600 mb-6">
              Sind Sie sicher, dass Sie die Einladung "{invitationToDelete?.title}" löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
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
