'use client';

import React, { useState } from 'react';
import BudgetList from '@/components/budget/BudgetList';
import BudgetForm from '@/components/budget/BudgetForm';
import { BudgetItem } from '@/types/budget';
import { createClient } from '@/lib/supabase/client';

export default function BudgetPage() {
  const [showForm, setShowForm] = useState(false);
  const [currentBudgetItem, setCurrentBudgetItem] = useState<BudgetItem | undefined>(undefined);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<BudgetItem | undefined>(undefined);

  // Formular für neuen Budget-Posten öffnen
  const handleAddItem = () => {
    setCurrentBudgetItem(undefined);
    setShowForm(true);
  };

  // Formular für Bearbeitung öffnen
  const handleEditItem = (item: BudgetItem) => {
    setCurrentBudgetItem(item);
    setShowForm(true);
  };

  // Löschen-Dialog öffnen
  const handleDeleteClick = (item: BudgetItem) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  // Budget-Posten löschen
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('budget_items')
        .delete()
        .eq('id', itemToDelete.id);

      if (error) throw error;

      // Liste aktualisieren
      setRefreshTrigger(prev => prev + 1);
      setShowDeleteConfirm(false);
      setItemToDelete(undefined);
    } catch (error) {
      console.error('Fehler beim Löschen des Budget-Postens:', error);
      alert('Fehler beim Löschen des Budget-Postens');
    }
  };

  // Formular schließen
  const handleCancelForm = () => {
    setShowForm(false);
    setCurrentBudgetItem(undefined);
  };

  // Nach erfolgreicher Speicherung
  const handleFormSuccess = () => {
    setShowForm(false);
    setCurrentBudgetItem(undefined);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Budget</h1>
        <p className="mt-1 text-gray-600">
          Verwalten und verfolgen Sie Ihr Hochzeitsbudget
        </p>
      </div>

      {showForm ? (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {currentBudgetItem ? 'Budget-Posten bearbeiten' : 'Neuen Budget-Posten hinzufügen'}
          </h2>
          <BudgetForm
            budgetItem={currentBudgetItem}
            onSuccess={handleFormSuccess}
            onCancel={handleCancelForm}
          />
        </div>
      ) : (
        <BudgetList
          onEdit={handleEditItem}
          onDelete={handleDeleteClick}
          onAdd={handleAddItem}
          refreshTrigger={refreshTrigger}
        />
      )}

      {/* Löschen-Bestätigungsdialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Budget-Posten löschen</h3>
            <p className="text-gray-600 mb-6">
              Sind Sie sicher, dass Sie den Budget-Posten "{itemToDelete?.item_name}" löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
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
