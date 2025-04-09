'use client';

import React, { useEffect, useState } from 'react';
import { useData } from '../../lib/data-context';
import { Guest } from '../../lib/mock-data';

export default function GuestManagementDemo() {
  const { guests, loadGuests, addGuest, updateGuest, deleteGuest, loading, error, isStaticMode } = useData();
  const [formData, setFormData] = useState<Omit<Guest, 'id'>>({
    name: '',
    email: '',
    rsvp: 'pending',
    plusOne: false,
    notes: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Load guests on component mount
  useEffect(() => {
    loadGuests();
  }, [loadGuests]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await updateGuest(editingId, formData);
        setEditingId(null);
      } else {
        await addGuest(formData);
      }
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        rsvp: 'pending',
        plusOne: false,
        notes: ''
      });
      setIsFormVisible(false);
    } catch (err) {
      console.error('Error saving guest:', err);
    }
  };

  const handleEdit = (guest: Guest) => {
    setFormData({
      name: guest.name,
      email: guest.email,
      rsvp: guest.rsvp,
      plusOne: guest.plusOne,
      mealPreference: guest.mealPreference,
      notes: guest.notes
    });
    setEditingId(guest.id);
    setIsFormVisible(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie diesen Gast löschen möchten?')) {
      try {
        await deleteGuest(id);
      } catch (err) {
        console.error('Error deleting guest:', err);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      email: '',
      rsvp: 'pending',
      plusOne: false,
      notes: ''
    });
    setEditingId(null);
    setIsFormVisible(false);
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
        <h3 className="text-xl font-semibold">Gästeliste</h3>
        {!isFormVisible && (
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => setIsFormVisible(true)}
          >
            Gast hinzufügen
          </button>
        )}
      </div>
      
      {isFormVisible && (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
          <h4 className="text-lg font-medium mb-4">{editingId ? 'Gast bearbeiten' : 'Neuer Gast'}</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-Mail</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">RSVP</label>
              <select
                name="rsvp"
                value={formData.rsvp}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="pending">Ausstehend</option>
                <option value="yes">Zusage</option>
                <option value="no">Absage</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Essenspräferenz</label>
              <input
                type="text"
                name="mealPreference"
                value={formData.mealPreference || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="plusOne"
                checked={formData.plusOne}
                onChange={handleInputChange}
                className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Begleitung
              </label>
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
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  E-Mail
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  RSVP
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Begleitung
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Essenspräferenz
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {guests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Keine Gäste vorhanden. Fügen Sie Ihren ersten Gast hinzu!
                  </td>
                </tr>
              ) : (
                guests.map((guest) => (
                  <tr key={guest.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {guest.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {guest.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {guest.rsvp === 'yes' && <span className="text-green-600 dark:text-green-400">Zusage</span>}
                      {guest.rsvp === 'no' && <span className="text-red-600 dark:text-red-400">Absage</span>}
                      {guest.rsvp === 'pending' && <span className="text-yellow-600 dark:text-yellow-400">Ausstehend</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {guest.plusOne ? 'Ja' : 'Nein'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {guest.mealPreference || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(guest)}
                        className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 mr-4"
                      >
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => handleDelete(guest.id)}
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
