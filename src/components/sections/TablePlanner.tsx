"use client";

import React, { useState, useEffect } from 'react';
import { demoApi } from '../../lib/supabase-api';

interface Table {
  id: string;
  name: string;
  shape: 'round' | 'rectangular' | 'square' | 'oval' | 'custom';
  capacity: number;
  rotation: number;
  positionX: number;
  positionY: number;
}

interface Seat {
  id: string;
  tableId: string;
  guestId: string | null;
  position: number;
}

interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  groupName: string | null;
  rsvpStatus: 'confirmed' | 'pending' | 'declined' | null;
  dietaryRestrictions: string[] | null;
}

interface TablePlannerProps {
  // Props can be added as needed
}

export const TablePlanner: React.FC<TablePlannerProps> = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [showGuestAssignModal, setShowGuestAssignModal] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [draggedTable, setDraggedTable] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  
  // Form state for adding/editing tables
  const [tableForm, setTableForm] = useState<Partial<Table>>({
    name: '',
    shape: 'round',
    capacity: 8,
    rotation: 0,
    positionX: 100,
    positionY: 100
  });
  
  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);
  
  // Load tables, seats, and guests from API
  const loadData = async () => {
    setLoading(true);
    try {
      // Load tables
      const tablesResult = await demoApi.tables.getAll();
      if (tablesResult.error) throw tablesResult.error;
      setTables(tablesResult.data);
      
      // Load guests
      const guestsResult = await demoApi.guests.getAll();
      if (guestsResult.error) throw guestsResult.error;
      setGuests(guestsResult.data);
      
      // For demo purposes, we'll create seats based on tables
      // In a real app, we would load seats from the API
      const seatsData: Seat[] = [];
      tablesResult.data.forEach(table => {
        for (let i = 0; i < table.capacity; i++) {
          seatsData.push({
            id: `seat-${table.id}-${i}`,
            tableId: table.id,
            guestId: null,
            position: i
          });
        }
      });
      setSeats(seatsData);
      
    } catch (err) {
      setError('Failed to load table planner data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form input changes
  const handleTableFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setTableForm(prev => ({ ...prev, [name]: parseInt(value, 10) }));
    } else {
      setTableForm(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Handle table form submission
  const handleTableFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedTable) {
        // Update existing table
        const { data, error } = await demoApi.tables.update(selectedTable.id, tableForm);
        if (error) throw error;
        
        // Update local state
        setTables(prev => prev.map(t => t.id === selectedTable.id ? data : t));
      } else {
        // Add new table
        const { data, error } = await demoApi.tables.create(tableForm);
        if (error) throw error;
        
        // Update local state
        setTables(prev => [...prev, data]);
        
        // Create seats for the new table
        const newSeats: Seat[] = [];
        for (let i = 0; i < (tableForm.capacity || 8); i++) {
          newSeats.push({
            id: `seat-${data.id}-${i}`,
            tableId: data.id,
            guestId: null,
            position: i
          });
        }
        setSeats(prev => [...prev, ...newSeats]);
      }
      
      // Reset form and close modal
      setTableForm({
        name: '',
        shape: 'round',
        capacity: 8,
        rotation: 0,
        positionX: 100,
        positionY: 100
      });
      setSelectedTable(null);
      setShowAddTableModal(false);
    } catch (err) {
      setError('Failed to save table');
      console.error(err);
    }
  };
  
  // Handle edit table
  const handleEditTable = (table: Table) => {
    setSelectedTable(table);
    setTableForm({
      name: table.name,
      shape: table.shape,
      capacity: table.capacity,
      rotation: table.rotation,
      positionX: table.positionX,
      positionY: table.positionY
    });
    setShowAddTableModal(true);
  };
  
  // Handle delete table
  const handleDeleteTable = async (id: string) => {
    try {
      const { error } = await demoApi.tables.delete(id);
      if (error) throw error;
      
      // Update local state
      setTables(prev => prev.filter(t => t.id !== id));
      setSeats(prev => prev.filter(s => s.tableId !== id));
    } catch (err) {
      setError('Failed to delete table');
      console.error(err);
    }
  };
  
  // Handle seat click
  const handleSeatClick = (seat: Seat) => {
    setSelectedSeat(seat);
    setShowGuestAssignModal(true);
  };
  
  // Handle guest assignment
  const handleAssignGuest = (guestId: string | null) => {
    if (!selectedSeat) return;
    
    // Update seat with assigned guest
    const updatedSeat = { ...selectedSeat, guestId };
    setSeats(prev => prev.map(s => s.id === selectedSeat.id ? updatedSeat : s));
    
    // Close modal
    setShowGuestAssignModal(false);
    setSelectedSeat(null);
  };
  
  // Handle table drag start
  const handleTableDragStart = (tableId: string, e: React.MouseEvent) => {
    const table = tables.find(t => t.id === tableId);
    if (!table) return;
    
    // Calculate offset from mouse position to table position
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setDraggedTable(tableId);
    setDragOffset({ x: offsetX, y: offsetY });
  };
  
  // Handle table drag
  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!draggedTable) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;
    
    // Update table position
    setTables(prev => prev.map(t => {
      if (t.id === draggedTable) {
        return { ...t, positionX: x, positionY: y };
      }
      return t;
    }));
  };
  
  // Handle table drag end
  const handleCanvasMouseUp = async () => {
    if (!draggedTable) return;
    
    // Save table position to API
    const table = tables.find(t => t.id === draggedTable);
    if (table) {
      try {
        await demoApi.tables.update(table.id, {
          positionX: table.positionX,
          positionY: table.positionY
        });
      } catch (err) {
        console.error('Failed to save table position', err);
      }
    }
    
    setDraggedTable(null);
  };
  
  // Get guest name by ID
  const getGuestName = (guestId: string | null) => {
    if (!guestId) return '';
    const guest = guests.find(g => g.id === guestId);
    return guest ? `${guest.firstName} ${guest.lastName.charAt(0)}.` : '';
  };
  
  // Export as PDF
  const handleExportPDF = () => {
    alert('Diese Funktion würde den Tischplan als PDF exportieren.');
  };
  
  return (
    <div className="table-planner">
      <div className="table-planner__demo-notice">
        <p>Dies ist eine funktionale Demo-Version des interaktiven Tischplaners. Sie können:</p>
        <ul>
          <li>Tische per Drag & Drop platzieren</li>
          <li>Verschiedene Tischformen und -größen wählen</li>
          <li>Gäste den Tischen zuweisen</li>
          <li>Den fertigen Plan als PDF exportieren</li>
        </ul>
      </div>
      
      {error && (
        <div className="table-planner__error">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Schließen</button>
        </div>
      )}
      
      <div 
        className="table-planner__demo-canvas"
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
      >
        {loading ? (
          <div className="table-planner__loading">Tischplan wird geladen...</div>
        ) : (
          tables.map(table => (
            <div 
              key={table.id}
              className={`table-planner__table table-planner__table--${table.shape}`}
              style={{
                left: `${table.positionX}px`,
                top: `${table.positionY}px`,
                transform: `rotate(${table.rotation}deg)`,
                cursor: draggedTable === table.id ? 'grabbing' : 'grab'
              }}
              onMouseDown={(e) => handleTableDragStart(table.id, e)}
              onDoubleClick={() => handleEditTable(table)}
            >
              <div className="table-planner__table-label">{table.name}</div>
              <div className="table-planner__seats">
                {seats
                  .filter(seat => seat.tableId === table.id)
                  .map(seat => (
                    <div 
                      key={seat.id}
                      className={`table-planner__seat ${seat.guestId ? 'table-planner__seat--occupied' : 'table-planner__seat--empty'}`}
                      style={{
                        transform: `rotate(${-table.rotation}deg)` // Counter-rotate seats to keep them upright
                      }}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering table events
                        handleSeatClick(seat);
                      }}
                    >
                      {seat.guestId && (
                        <span className="table-planner__guest-name">
                          {getGuestName(seat.guestId)}
                        </span>
                      )}
                    </div>
                  ))
                }
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="table-planner__controls">
        <div className="table-planner__control-group">
          <label>Tischform:</label>
          <select 
            value={tableForm.shape}
            onChange={handleTableFormChange}
            name="shape"
          >
            <option value="round">Rund</option>
            <option value="rectangular">Rechteckig</option>
            <option value="square">Quadratisch</option>
            <option value="oval">Oval</option>
          </select>
        </div>
        
        <div className="table-planner__control-group">
          <label>Anzahl der Plätze:</label>
          <select 
            value={tableForm.capacity}
            onChange={handleTableFormChange}
            name="capacity"
          >
            <option value="6">6</option>
            <option value="8">8</option>
            <option value="10">10</option>
            <option value="12">12</option>
          </select>
        </div>
        
        <div className="table-planner__control-group">
          <button 
            className="table-planner__button"
            onClick={() => {
              setSelectedTable(null);
              setTableForm({
                name: `Tisch ${tables.length + 1}`,
                shape: 'round',
                capacity: 8,
                rotation: 0,
                positionX: Math.random() * (canvasSize.width - 200) + 100,
                positionY: Math.random() * (canvasSize.height - 200) + 100
              });
              setShowAddTableModal(true);
            }}
          >
            Tisch hinzufügen
          </button>
          <button 
            className="table-planner__button"
            onClick={handleExportPDF}
          >
            Als PDF exportieren
          </button>
        </div>
      </div>
      
      {/* Add/Edit Table Modal */}
      {showAddTableModal && (
        <div className="table-planner__modal">
          <div className="table-planner__modal-content">
            <div className="table-planner__modal-header">
              <h2>{selectedTable ? 'Tisch bearbeiten' : 'Tisch hinzufügen'}</h2>
              <button 
                className="table-planner__modal-close"
                onClick={() => setShowAddTableModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleTableFormSubmit}>
              <div className="table-planner__form-group">
                <label htmlFor="name">Tischname</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={tableForm.name || ''}
                  onChange={handleTableFormChange}
                  required
                />
              </div>
              <div className="table-planner__form-group">
                <label htmlFor="shape">Tischform</label>
                <select
                  id="shape"
                  name="shape"
                  value={tableForm.shape || 'round'}
                  onChange={handleTableFormChange}
                >
                  <option value="round">Rund</option>
                  <option value="rectangular">Rechteckig</option>
                  <option value="square">Quadratisch</option>
                  <option value="oval">Oval</option>
                </select>
              </div>
              <div className="table-planner__form-group">
                <label htmlFor="capacity">Anzahl der Plätze</label>
                <select
                  id="capacity"
                  name="capacity"
                  value={tableForm.capacity || 8}
                  onChange={handleTableFormChange}
                >
                  <option value="6">6</option>
                  <option value="8">8</option>
                  <option value="10">10</option>
                  <option value="12">12</option>
                </select>
              </div>
              <div className="table-planner__form-group">
                <label htmlFor="rotation">Rotation (Grad)</label>
                <input
                  type="number"
                  id="rotation"
                  name="rotation"
                  value={tableForm.rotation || 0}
                  onChange={handleTableFormChange}
                  min="0"
                  max="359"
                />
              </div>
              <div className="table-planner__form-actions">
                {selectedTable && (
                  <button 
                    type="button" 
                    className="table-planner__button table-planner__button--danger"
                    onClick={() => {
                      handleDeleteTable(selectedTable.id);
                      setShowAddTableModal(false);
                    }}
                  >
                    Tisch löschen
                  </button>
                )}
                <button 
                  type="button" 
                  className="table-planner__button table-planner__button--secondary"
                  onClick={() => setShowAddTableModal(false)}
                >
                  Abbrechen
                </button>
                <button 
                  type="submit" 
                  className="table-planner__button"
                >
                  {selectedTable ? 'Speichern' : 'Hinzufügen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Guest Assignment Modal */}
      {showGuestAssignModal && selectedSeat && (
        <div className="table-planner__modal">
          <div className="table-planner__modal-content">
            <div className="table-planner__modal-header">
              <h2>Gast zuweisen</h2>
              <button 
                className="table-planner__modal-close"
                onClick={() => setShowGuestAssignModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="table-planner__guest-list">
              <div 
                className="table-planner__guest-item"
                onClick={() => handleAssignGuest(null)}
              >
                <strong>Keinen Gast zuweisen</strong>
              </div>
              {guests
                .filter(guest => guest.rsvpStatus === 'confirmed')
                .map(guest => (
                  <div 
                    key={guest.id}
                    className={`table-planner__guest-item ${selectedSeat.guestId === guest.id ? 'table-planner__guest-item--selected' : ''}`}
                    onClick={() => handleAssignGuest(guest.id)}
                  >
                    <div className="table-planner__guest-name-full">
                      {guest.firstName} {guest.lastName}
                    </div>
                    <div className="table-planner__guest-details">
                      {guest.groupName && <span>{guest.groupName}</span>}
                      {guest.dietaryRestrictions && guest.dietaryRestrictions.length > 0 && (
                        <span>Allergien: {guest.dietaryRestrictions.join(', ')}</span>
                      )}
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .table-planner {
          padding: 2rem;
          background-color: #f9f9f9;
          border-radius: 8px;
        }
        
        .table-planner__demo-notice {
          background-color: #fff3cd;
          border: 1px solid #ffeeba;
          border-radius: 4px;
          padding: 1rem;
          margin-bottom: 2rem;
        }
        
        .table-planner__demo-notice p {
          margin-top: 0;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .table-planner__demo-notice ul {
          margin: 0;
          padding-left: 1.5rem;
        }
        
        .table-planner__error {
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 4px;
          padding: 1rem;
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .table-planner__error p {
          margin: 0;
          color: #721c24;
        }
        
        .table-planner__error button {
          background: none;
          border: none;
          color: #721c24;
          font-weight: bold;
          cursor: pointer;
        }
        
        .table-planner__demo-canvas {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          margin-bottom: 2rem;
          min-height: 500px;
          background-color: white;
          border: 1px dashed #ccc;
          border-radius: 8px;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }
        
        .table-planner__loading {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          color: #666;
        }
        
        .table-planner__table {
          position: absolute;
          margin: 0;
          transform-origin: center center;
        }
        
        .table-planner__table--round {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background-color: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .table-planner__table--rectangular {
          width: 300px;
          height: 150px;
          background-color: #f0f0f0;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .table-planner__table--square {
          width: 200px;
          height: 200px;
          background-color: #f0f0f0;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .table-planner__table--oval {
          width: 300px;
          height: 200px;
          background-color: #f0f0f0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .table-planner__table-label {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-weight: 600;
          color: #666;
          pointer-events: none;
        }
        
        .table-planner__seats {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        
        .table-planner__seat {
          position: absolute;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          overflow: hidden;
          pointer-events: auto;
          cursor: pointer;
        }
        
        .table-planner__seat--occupied {
          background-color: #ffbd00;
          color: white;
        }
        
        .table-planner__guest-name {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          max-width: 36px;
          text-align: center;
        }
        
        /* Position seats around round table */
        .table-planner__table--round .table-planner__seat:nth-child(1) { top: -20px; left: calc(50% - 20px); }
        .table-planner__table--round .table-planner__seat:nth-child(2) { top: calc(14.6% - 20px); right: calc(14.6% - 20px); }
        .table-planner__table--round .table-planner__seat:nth-child(3) { right: -20px; top: calc(50% - 20px); }
        .table-planner__table--round .table-planner__seat:nth-child(4) { bottom: calc(14.6% - 20px); right: calc(14.6% - 20px); }
        .table-planner__table--round .table-planner__seat:nth-child(5) { bottom: -20px; left: calc(50% - 20px); }
        .table-planner__table--round .table-planner__seat:nth-child(6) { bottom: calc(14.6% - 20px); left: calc(14.6% - 20px); }
        .table-planner__table--round .table-planner__seat:nth-child(7) { left: -20px; top: calc(50% - 20px); }
        .table-planner__table--round .table-planner__seat:nth-child(8) { top: calc(14.6% - 20px); left: calc(14.6% - 20px); }
        .table-planner__table--round .table-planner__seat:nth-child(9) { top: calc(7% - 20px); left: calc(30% - 20px); }
        .table-planner__table--round .table-planner__seat:nth-child(10) { top: calc(7% - 20px); right: calc(30% - 20px); }
        .table-planner__table--round .table-planner__seat:nth-child(11) { bottom: calc(7% - 20px); right: calc(30% - 20px); }
        .table-planner__table--round .table-planner__seat:nth-child(12) { bottom: calc(7% - 20px); left: calc(30% - 20px); }
        
        /* Position seats around rectangular table */
        .table-planner__table--rectangular .table-planner__seat:nth-child(1) { top: -20px; left: calc(25% - 20px); }
        .table-planner__table--rectangular .table-planner__seat:nth-child(2) { top: -20px; left: calc(75% - 20px); }
        .table-planner__table--rectangular .table-planner__seat:nth-child(3) { right: -20px; top: calc(50% - 20px); }
        .table-planner__table--rectangular .table-planner__seat:nth-child(4) { bottom: -20px; left: calc(75% - 20px); }
        .table-planner__table--rectangular .table-planner__seat:nth-child(5) { bottom: -20px; left: calc(25% - 20px); }
        .table-planner__table--rectangular .table-planner__seat:nth-child(6) { left: -20px; top: calc(50% - 20px); }
        .table-planner__table--rectangular .table-planner__seat:nth-child(7) { top: -20px; left: calc(50% - 20px); }
        .table-planner__table--rectangular .table-planner__seat:nth-child(8) { bottom: -20px; left: calc(50% - 20px); }
        
        /* Position seats around square table */
        .table-planner__table--square .table-planner__seat:nth-child(1) { top: -20px; left: calc(25% - 20px); }
        .table-planner__table--square .table-planner__seat:nth-child(2) { top: -20px; left: calc(75% - 20px); }
        .table-planner__table--square .table-planner__seat:nth-child(3) { right: -20px; top: calc(25% - 20px); }
        .table-planner__table--square .table-planner__seat:nth-child(4) { right: -20px; top: calc(75% - 20px); }
        .table-planner__table--square .table-planner__seat:nth-child(5) { bottom: -20px; left: calc(75% - 20px); }
        .table-planner__table--square .table-planner__seat:nth-child(6) { bottom: -20px; left: calc(25% - 20px); }
        .table-planner__table--square .table-planner__seat:nth-child(7) { left: -20px; top: calc(75% - 20px); }
        .table-planner__table--square .table-planner__seat:nth-child(8) { left: -20px; top: calc(25% - 20px); }
        
        /* Position seats around oval table */
        .table-planner__table--oval .table-planner__seat:nth-child(1) { top: -20px; left: calc(25% - 20px); }
        .table-planner__table--oval .table-planner__seat:nth-child(2) { top: -20px; left: calc(50% - 20px); }
        .table-planner__table--oval .table-planner__seat:nth-child(3) { top: -20px; left: calc(75% - 20px); }
        .table-planner__table--oval .table-planner__seat:nth-child(4) { right: -20px; top: calc(50% - 20px); }
        .table-planner__table--oval .table-planner__seat:nth-child(5) { bottom: -20px; left: calc(75% - 20px); }
        .table-planner__table--oval .table-planner__seat:nth-child(6) { bottom: -20px; left: calc(50% - 20px); }
        .table-planner__table--oval .table-planner__seat:nth-child(7) { bottom: -20px; left: calc(25% - 20px); }
        .table-planner__table--oval .table-planner__seat:nth-child(8) { left: -20px; top: calc(50% - 20px); }
        
        .table-planner__controls {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .table-planner__control-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .table-planner__control-group label {
          font-weight: 500;
          font-size: 0.9rem;
        }
        
        .table-planner__control-group select {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .table-planner__button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          background-color: #ffbd00;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .table-planner__button:hover {
          background-color: #e6a800;
        }
        
        .table-planner__button--secondary {
          background-color: #f8f9fa;
          color: #6c757d;
        }
        
        .table-planner__button--secondary:hover {
          background-color: #e2e6ea;
        }
        
        .table-planner__button--danger {
          background-color: #dc3545;
        }
        
        .table-planner__button--danger:hover {
          background-color: #c82333;
        }
        
        .table-planner__modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .table-planner__modal-content {
          background-color: white;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .table-planner__modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #eee;
        }
        
        .table-planner__modal-header h2 {
          margin: 0;
          font-size: 1.25rem;
        }
        
        .table-planner__modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
        }
        
        .table-planner__modal form {
          padding: 1.5rem;
        }
        
        .table-planner__form-group {
          margin-bottom: 1rem;
        }
        
        .table-planner__form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .table-planner__form-group input,
        .table-planner__form-group select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .table-planner__form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        
        .table-planner__guest-list {
          padding: 1.5rem;
          max-height: 400px;
          overflow-y: auto;
        }
        
        .table-planner__guest-item {
          padding: 0.75rem;
          border-radius: 4px;
          margin-bottom: 0.5rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .table-planner__guest-item:hover {
          background-color: #f8f9fa;
        }
        
        .table-planner__guest-item--selected {
          background-color: #fff3cd;
        }
        
        .table-planner__guest-name-full {
          font-weight: 500;
        }
        
        .table-planner__guest-details {
          font-size: 0.9rem;
          color: #666;
          margin-top: 0.25rem;
          display: flex;
          flex-direction: column;
        }
        
        @media (max-width: 768px) {
          .table-planner__controls {
            flex-direction: column;
          }
          
          .table-planner__control-group {
            width: 100%;
          }
          
          .table-planner__form-actions {
            flex-direction: column;
          }
          
          .table-planner__form-actions button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default TablePlanner;
