'use client';

import React, { useEffect, useState } from 'react';
import { useData } from '../../lib/data-context';
import { Table } from '../../lib/mock-data';

export default function TablePlannerDemo() {
  const { tables, loadTables, addTable, updateTable, deleteTable, loading, error, isStaticMode } = useData();
  const [formData, setFormData] = useState<Omit<Table, 'id'>>({
    name: '',
    shape: 'round',
    capacity: 8,
    positionX: 100,
    positionY: 100,
    rotation: 0
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [draggedTable, setDraggedTable] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });

  // Load tables on component mount
  useEffect(() => {
    loadTables();
  }, [loadTables]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData({ ...formData, [name]: parseInt(value, 10) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await updateTable(editingId, formData);
        setEditingId(null);
      } else {
        await addTable(formData);
      }
      
      // Reset form
      setFormData({
        name: '',
        shape: 'round',
        capacity: 8,
        positionX: 100,
        positionY: 100,
        rotation: 0
      });
      setIsFormVisible(false);
    } catch (err) {
      console.error('Error saving table:', err);
    }
  };

  const handleEdit = (table: Table) => {
    setFormData({
      name: table.name,
      shape: table.shape,
      capacity: table.capacity,
      positionX: table.positionX,
      positionY: table.positionY,
      rotation: table.rotation,
      guests: table.guests
    });
    setEditingId(table.id);
    setIsFormVisible(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie diesen Tisch löschen möchten?')) {
      try {
        await deleteTable(id);
      } catch (err) {
        console.error('Error deleting table:', err);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      shape: 'round',
      capacity: 8,
      positionX: 100,
      positionY: 100,
      rotation: 0
    });
    setEditingId(null);
    setIsFormVisible(false);
  };

  const handleDragStart = (id: string) => {
    setDraggedTable(id);
  };

  const handleDragEnd = () => {
    setDraggedTable(null);
  };

  const handleDrag = (e: React.DragEvent, id: string) => {
    if (draggedTable === id) {
      const table = tables.find(t => t.id === id);
      if (table) {
        const newX = Math.max(0, Math.min(e.clientX - 50, canvasSize.width - 100));
        const newY = Math.max(0, Math.min(e.clientY - 50, canvasSize.height - 100));
        
        updateTable(id, {
          positionX: newX,
          positionY: newY
        });
      }
    }
  };

  const handleRotate = (id: string, direction: 'clockwise' | 'counterclockwise') => {
    const table = tables.find(t => t.id === id);
    if (table) {
      const currentRotation = table.rotation || 0;
      const rotationChange = direction === 'clockwise' ? 15 : -15;
      const newRotation = (currentRotation + rotationChange + 360) % 360;
      
      updateTable(id, { rotation: newRotation });
    }
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
        <h3 className="text-xl font-semibold">Tischplaner</h3>
        {!isFormVisible && (
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => setIsFormVisible(true)}
          >
            Tisch hinzufügen
          </button>
        )}
      </div>
      
      {isFormVisible && (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
          <h4 className="text-lg font-medium mb-4">{editingId ? 'Tisch bearbeiten' : 'Neuer Tisch'}</h4>
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Form</label>
              <select
                name="shape"
                value={formData.shape}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="round">Rund</option>
                <option value="rectangular">Rechteckig</option>
                <option value="oval">Oval</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kapazität</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                min="1"
                max="20"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Position X</label>
                <input
                  type="number"
                  name="positionX"
                  value={formData.positionX}
                  onChange={handleInputChange}
                  min="0"
                  max={canvasSize.width}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-800 dark:border-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Position Y</label>
                <input
                  type="number"
                  name="positionY"
                  value={formData.positionY}
                  onChange={handleInputChange}
                  min="0"
                  max={canvasSize.height}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-800 dark:border-gray-600"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rotation (Grad)</label>
              <input
                type="number"
                name="rotation"
                value={formData.rotation}
                onChange={handleInputChange}
                min="0"
                max="359"
                step="15"
                required
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
        <div className="space-y-6">
          <div 
            className="relative bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg"
            style={{ width: `${canvasSize.width}px`, height: `${canvasSize.height}px` }}
          >
            {tables.map((table) => (
              <div
                key={table.id}
                draggable
                onDragStart={() => handleDragStart(table.id)}
                onDrag={(e) => handleDrag(e, table.id)}
                onDragEnd={handleDragEnd}
                className="absolute cursor-move"
                style={{
                  left: `${table.positionX}px`,
                  top: `${table.positionY}px`,
                  transform: `rotate(${table.rotation || 0}deg)`,
                  transition: draggedTable === table.id ? 'none' : 'all 0.3s ease'
                }}
              >
                <div 
                  className={`flex items-center justify-center bg-yellow-500 dark:bg-yellow-600 text-white font-bold text-sm
                    ${table.shape === 'round' ? 'rounded-full' : table.shape === 'oval' ? 'rounded-full' : 'rounded-md'}`}
                  style={{
                    width: table.shape === 'oval' ? '120px' : '100px',
                    height: table.shape === 'oval' ? '80px' : table.shape === 'rectangular' ? '80px' : '100px'
                  }}
                >
                  <div className="text-center">
                    <div>{table.name}</div>
                    <div>{table.capacity} Plätze</div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 -mt-2 -mr-2 flex space-x-1">
                  <button
                    onClick={() => handleRotate(table.id, 'counterclockwise')}
                    className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    title="Gegen den Uhrzeigersinn drehen"
                  >
                    ↺
                  </button>
                  <button
                    onClick={() => handleRotate(table.id, 'clockwise')}
                    className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    title="Im Uhrzeigersinn drehen"
                  >
                    ↻
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Form
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Kapazität
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Position
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {tables.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      Keine Tische vorhanden. Fügen Sie Ihren ersten Tisch hinzu!
                    </td>
                  </tr>
                ) : (
                  tables.map((table) => (
                    <tr key={table.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {table.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {table.shape === 'round' && 'Rund'}
                        {table.shape === 'rectangular' && 'Rechteckig'}
                        {table.shape === 'oval' && 'Oval'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {table.capacity} Plätze
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        X: {table.positionX}, Y: {table.positionY}, Rotation: {table.rotation || 0}°
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(table)}
                          className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 mr-4"
                        >
                          Bearbeiten
                        </button>
                        <button
                          onClick={() => handleDelete(table.id)}
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
        </div>
      )}
    </div>
  );
}
