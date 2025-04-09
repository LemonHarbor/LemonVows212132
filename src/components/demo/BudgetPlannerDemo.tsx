'use client';

import React, { useEffect, useState } from 'react';
import { useData } from '../../lib/data-context';
import { BudgetItem } from '../../lib/mock-data';

export default function BudgetPlannerDemo() {
  const { budgetItems, loadBudgetItems, addBudgetItem, updateBudgetItem, deleteBudgetItem, 
          budgetSummary, loadBudgetSummary, loading, error, isStaticMode } = useData();
  const [formData, setFormData] = useState<Omit<BudgetItem, 'id'>>({
    category: '',
    description: '',
    estimatedCost: 0,
    actualCost: undefined,
    paid: false,
    dueDate: undefined,
    notes: undefined
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Load budget items and summary on component mount
  useEffect(() => {
    loadBudgetItems();
    loadBudgetSummary();
  }, [loadBudgetItems, loadBudgetSummary]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'number') {
      setFormData({ ...formData, [name]: parseFloat(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await updateBudgetItem(editingId, formData);
        setEditingId(null);
      } else {
        await addBudgetItem(formData);
      }
      
      // Reset form
      setFormData({
        category: '',
        description: '',
        estimatedCost: 0,
        actualCost: undefined,
        paid: false,
        dueDate: undefined,
        notes: undefined
      });
      setIsFormVisible(false);
      
      // Reload budget summary
      loadBudgetSummary();
    } catch (err) {
      console.error('Error saving budget item:', err);
    }
  };

  const handleEdit = (item: BudgetItem) => {
    setFormData({
      category: item.category,
      description: item.description,
      estimatedCost: item.estimatedCost,
      actualCost: item.actualCost,
      paid: item.paid,
      dueDate: item.dueDate,
      notes: item.notes
    });
    setEditingId(item.id);
    setIsFormVisible(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie diesen Budgetposten löschen möchten?')) {
      try {
        await deleteBudgetItem(id);
        // Reload budget summary
        loadBudgetSummary();
      } catch (err) {
        console.error('Error deleting budget item:', err);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      category: '',
      description: '',
      estimatedCost: 0,
      actualCost: undefined,
      paid: false,
      dueDate: undefined,
      notes: undefined
    });
    setEditingId(null);
    setIsFormVisible(false);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  // Calculate budget progress
  const calculateProgress = () => {
    if (budgetSummary.total === 0) return 0;
    return (budgetSummary.spent / budgetSummary.total) * 100;
  };

  return (
    <div className="space-y-6">
      {isStaticMode && (
        <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-md mb-4">
          <p className="text-blue-800 dark:text-blue-200">
            Demo-Modus: Änderungen werden nur temporär gespeichert und nicht an einen Server gesendet.
          </p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded-md mb-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Budgetplaner</h3>
        {!isFormVisible && (
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => setIsFormVisible(true)}
          >
            Budgetposten hinzufügen
          </button>
        )}
      </div>
      
      {/* Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Gesamtbudget</h4>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(budgetSummary.total)}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Ausgegeben</h4>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{formatCurrency(budgetSummary.spent)}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Verbleibend</h4>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(budgetSummary.remaining)}</p>
        </div>
      </div>
      
      {/* Budget Progress */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Budgetfortschritt</h4>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
          <div 
            className="bg-yellow-500 h-4 rounded-full"
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {calculateProgress().toFixed(1)}% des Budgets ausgegeben
        </p>
      </div>
      
      {isFormVisible && (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
          <h4 className="text-lg font-medium mb-4">{editingId ? 'Budgetposten bearbeiten' : 'Neuer Budgetposten'}</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kategorie</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Beschreibung</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Geschätzte Kosten (€)</label>
                <input
                  type="number"
                  name="estimatedCost"
                  value={formData.estimatedCost}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-800 dark:border-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tatsächliche Kosten (€)</label>
                <input
                  type="number"
                  name="actualCost"
                  value={formData.actualCost || ''}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-800 dark:border-gray-600"
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="paid"
                checked={formData.paid}
                onChange={handleInputChange}
                className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Bezahlt
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fälligkeitsdatum</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notizen</label>
              <textarea
                name="notes"
                value={formData.notes || ''}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold py-2 px-4 rounded"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
              >
                {editingId ? 'Aktualisieren' : 'Hinzufügen'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Kategorie
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Beschreibung
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Geschätzt
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tatsächlich
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Fälligkeit
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {budgetItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Keine Budgetposten vorhanden. Fügen Sie Ihren ersten Budgetposten hinzu!
                  </td>
                </tr>
              ) : (
                budgetItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatCurrency(item.estimatedCost)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.actualCost !== undefined ? formatCurrency(item.actualCost) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.paid ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Bezahlt
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          Ausstehend
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.dueDate ? new Date(item.dueDate).toLocaleDateString('de-DE') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 mr-4"
                      >
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Löschen
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
