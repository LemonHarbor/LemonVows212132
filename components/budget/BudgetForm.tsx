import React, { useState, useEffect } from 'react';
import { BudgetItem, BudgetItemInsert, budgetCategories } from '@/types/budget';
import { createClient } from '@/lib/supabase/client';

interface BudgetFormProps {
  budgetItem?: BudgetItem;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function BudgetForm({ budgetItem, onSuccess, onCancel }: BudgetFormProps) {
  const [formData, setFormData] = useState<BudgetItemInsert>({
    user_id: '', // Wird beim Speichern gesetzt
    category: budgetCategories[0],
    item_name: '',
    estimated_cost: 0,
    actual_cost: null,
    paid: false,
    notes: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Formular mit vorhandenen Daten füllen, wenn ein Budget-Posten bearbeitet wird
  useEffect(() => {
    if (budgetItem) {
      setFormData({
        user_id: budgetItem.user_id,
        category: budgetItem.category,
        item_name: budgetItem.item_name,
        estimated_cost: budgetItem.estimated_cost,
        actual_cost: budgetItem.actual_cost,
        paid: budgetItem.paid,
        notes: budgetItem.notes,
      });
    }
  }, [budgetItem]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'estimated_cost' || name === 'actual_cost') {
      // Kosten als Zahl oder null speichern
      const numValue = value === '' ? (name === 'estimated_cost' ? 0 : null) : parseFloat(value);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const supabase = createClient();
      
      // Benutzer-ID abrufen
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Sie müssen angemeldet sein, um Budget-Posten zu verwalten');
      }
      
      const budgetData = {
        ...formData,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      };
      
      let result;
      
      if (budgetItem) {
        // Budget-Posten aktualisieren
        result = await supabase
          .from('budget_items')
          .update(budgetData)
          .eq('id', budgetItem.id);
      } else {
        // Neuen Budget-Posten erstellen
        result = await supabase
          .from('budget_items')
          .insert([budgetData]);
      }
      
      if (result.error) {
        throw result.error;
      }
      
      onSuccess();
    } catch (err: any) {
      console.error('Fehler beim Speichern des Budget-Postens:', err);
      setError(err.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="item_name" className="block text-sm font-medium text-gray-700">
            Bezeichnung *
          </label>
          <input
            type="text"
            id="item_name"
            name="item_name"
            value={formData.item_name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Kategorie *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            {budgetCategories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="estimated_cost" className="block text-sm font-medium text-gray-700">
            Geschätzte Kosten (€) *
          </label>
          <input
            type="number"
            id="estimated_cost"
            name="estimated_cost"
            value={formData.estimated_cost}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
        
        <div>
          <label htmlFor="actual_cost" className="block text-sm font-medium text-gray-700">
            Tatsächliche Kosten (€)
          </label>
          <input
            type="number"
            id="actual_cost"
            name="actual_cost"
            value={formData.actual_cost === null ? '' : formData.actual_cost}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="paid"
          name="paid"
          checked={formData.paid}
          onChange={handleChange}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="paid" className="ml-2 block text-sm text-gray-700">
          Bereits bezahlt
        </label>
      </div>
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notizen
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>
      
      {error && (
        <div className="text-red-500 text-sm">
          {error}
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
          disabled={loading}
        >
          {loading ? 'Wird gespeichert...' : budgetItem ? 'Aktualisieren' : 'Speichern'}
        </button>
      </div>
    </form>
  );
}
