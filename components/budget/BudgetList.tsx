import React, { useState, useEffect } from 'react';
import { BudgetItem, budgetCategories } from '@/types/budget';
import { createClient } from '@/lib/supabase/client';

interface BudgetListProps {
  onEdit: (budgetItem: BudgetItem) => void;
  onDelete: (budgetItem: BudgetItem) => void;
  onAdd: () => void;
  refreshTrigger?: number;
}

export default function BudgetList({ onEdit, onDelete, onAdd, refreshTrigger = 0 }: BudgetListProps) {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [paidFilter, setPaidFilter] = useState<string>('all');

  // Budget-Posten aus Supabase laden
  useEffect(() => {
    const fetchBudgetItems = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const supabase = createClient();
        
        const { data, error } = await supabase
          .from('budget_items')
          .select('*')
          .order('category', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        setBudgetItems(data || []);
      } catch (err: any) {
        console.error('Fehler beim Laden der Budget-Posten:', err);
        setError(err.message || 'Ein Fehler ist aufgetreten');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBudgetItems();
  }, [refreshTrigger]);
  
  // Budget-Posten filtern basierend auf Suchbegriff, Kategorie und Bezahlstatus
  const filteredBudgetItems = budgetItems.filter(item => {
    const matchesSearch = 
      searchTerm === '' || 
      item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = 
      categoryFilter === 'all' || 
      item.category === categoryFilter;
    
    const matchesPaid = 
      paidFilter === 'all' || 
      (paidFilter === 'paid' && item.paid) || 
      (paidFilter === 'unpaid' && !item.paid);
    
    return matchesSearch && matchesCategory && matchesPaid;
  });
  
  // Preis formatieren
  const formatPrice = (price: number | null) => {
    if (price === null) return '-';
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price);
  };
  
  // Budget-Zusammenfassung berechnen
  const budgetSummary = {
    totalEstimated: budgetItems.reduce((sum, item) => sum + item.estimated_cost, 0),
    totalActual: budgetItems.reduce((sum, item) => sum + (item.actual_cost || 0), 0),
    totalPaid: budgetItems.reduce((sum, item) => sum + (item.paid ? (item.actual_cost || item.estimated_cost) : 0), 0),
    totalUnpaid: budgetItems.reduce((sum, item) => sum + (!item.paid ? (item.actual_cost || item.estimated_cost) : 0), 0),
  };
  
  // Verfügbare Kategorien aus den Budget-Posten extrahieren
  const availableCategories = Array.from(new Set(budgetItems.map(item => item.category)));

  return (
    <div className="space-y-4">
      {/* Budget-Zusammenfassung */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Geschätztes Budget</p>
          <p className="text-2xl font-bold">{formatPrice(budgetSummary.totalEstimated)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Tatsächliche Kosten</p>
          <p className="text-2xl font-bold">{formatPrice(budgetSummary.totalActual)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Bereits bezahlt</p>
          <p className="text-2xl font-bold text-green-600">{formatPrice(budgetSummary.totalPaid)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Noch zu bezahlen</p>
          <p className="text-2xl font-bold text-red-600">{formatPrice(budgetSummary.totalUnpaid)}</p>
        </div>
      </div>
      
      {/* Suchleiste, Filter und Hinzufügen-Button */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Budget-Posten suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div className="w-full md:w-48">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">Alle Kategorien</option>
            {availableCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-48">
          <select
            value={paidFilter}
            onChange={(e) => setPaidFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">Alle Posten</option>
            <option value="paid">Bezahlt</option>
            <option value="unpaid">Unbezahlt</option>
          </select>
        </div>
        <div>
          <button
            onClick={onAdd}
            className="w-full md:w-auto px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Posten hinzufügen
          </button>
        </div>
      </div>
      
      {/* Fehlermeldung */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/* Ladeindikator */}
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          <p className="mt-2 text-gray-500">Budget-Posten werden geladen...</p>
        </div>
      )}
      
      {/* Keine Budget-Posten gefunden */}
      {!loading && filteredBudgetItems.length === 0 && (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">Keine Budget-Posten gefunden</p>
          <button
            onClick={onAdd}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Ersten Budget-Posten hinzufügen
          </button>
        </div>
      )}
      
      {/* Budget-Tabelle */}
      {!loading && filteredBudgetItems.length > 0 && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bezeichnung
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategorie
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Geschätzt
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tatsächlich
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBudgetItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.item_name}</div>
                      {item.notes && (
                        <div className="text-xs text-gray-500 truncate max-w-xs">{item.notes}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatPrice(item.estimated_cost)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatPrice(item.actual_cost)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.paid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {item.paid ? 'Bezahlt' : 'Unbezahlt'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => onEdit(item)}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Löschen
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
