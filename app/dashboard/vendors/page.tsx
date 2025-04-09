'use client';

import React, { useState } from 'react';
import VendorList from '@/components/vendors/VendorList';
import VendorForm from '@/components/vendors/VendorForm';
import { Vendor } from '@/types/vendors';
import { createClient } from '@/lib/supabase/client';

export default function VendorsPage() {
  const [showForm, setShowForm] = useState(false);
  const [currentVendor, setCurrentVendor] = useState<Vendor | undefined>(undefined);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<Vendor | undefined>(undefined);

  // Formular für neuen Dienstleister öffnen
  const handleAddVendor = () => {
    setCurrentVendor(undefined);
    setShowForm(true);
  };

  // Formular für Bearbeitung öffnen
  const handleEditVendor = (vendor: Vendor) => {
    setCurrentVendor(vendor);
    setShowForm(true);
  };

  // Löschen-Dialog öffnen
  const handleDeleteClick = (vendor: Vendor) => {
    setVendorToDelete(vendor);
    setShowDeleteConfirm(true);
  };

  // Dienstleister löschen
  const handleConfirmDelete = async () => {
    if (!vendorToDelete) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('vendors')
        .delete()
        .eq('id', vendorToDelete.id);

      if (error) throw error;

      // Liste aktualisieren
      setRefreshTrigger(prev => prev + 1);
      setShowDeleteConfirm(false);
      setVendorToDelete(undefined);
    } catch (error) {
      console.error('Fehler beim Löschen des Dienstleisters:', error);
      alert('Fehler beim Löschen des Dienstleisters');
    }
  };

  // Formular schließen
  const handleCancelForm = () => {
    setShowForm(false);
    setCurrentVendor(undefined);
  };

  // Nach erfolgreicher Speicherung
  const handleFormSuccess = () => {
    setShowForm(false);
    setCurrentVendor(undefined);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dienstleister</h1>
        <p className="mt-1 text-gray-600">
          Verwalten Sie Ihre Hochzeitsdienstleister
        </p>
      </div>

      {showForm ? (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {currentVendor ? 'Dienstleister bearbeiten' : 'Neuen Dienstleister hinzufügen'}
          </h2>
          <VendorForm
            vendor={currentVendor}
            onSuccess={handleFormSuccess}
            onCancel={handleCancelForm}
          />
        </div>
      ) : (
        <VendorList
          onEdit={handleEditVendor}
          onDelete={handleDeleteClick}
          onAdd={handleAddVendor}
          refreshTrigger={refreshTrigger}
        />
      )}

      {/* Löschen-Bestätigungsdialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Dienstleister löschen</h3>
            <p className="text-gray-600 mb-6">
              Sind Sie sicher, dass Sie den Dienstleister "{vendorToDelete?.name}" löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
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
