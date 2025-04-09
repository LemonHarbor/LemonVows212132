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
      
      // Handle null data by providing an empty array as fallback
      const tableData = tablesResult.data || [];
      setTables(tableData as Table[]);
      
      // Load guests
      const guestsResult = await demoApi.guests.getAll();
      if (guestsResult.error) throw guestsResult.error;
      
      // Handle null data by providing an empty array as fallback
      const guestData = guestsResult.data || [];
      setGuests(guestData as Guest[]);
      
      // For demo purposes, we'll create seats based on tables
      // In a real app, we would load seats from the API
      const seatsData: Seat[] = [];
      tableData.forEach(table => {
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
  
  // Handle table selection
  const handleTableClick = (table: Table) => {
    setSelectedTable(selectedTable?.id === table.id ? null : table);
  };
  
  // Handle table drag start
  const handleTableDragStart = (e: React.DragEvent, tableId: string, tableElement: HTMLElement) => {
    const rect = tableElement.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setDragOffset({ x: offsetX, y: offsetY });
    setDraggedTable(tableId);
    
    e.dataTransfer.setData('text/plain', tableId);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  // Handle table drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  // Handle table drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (draggedTable) {
      const tableId = draggedTable;
      const canvasRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      
      const newX = e.clientX - canvasRect.left - dragOffset.x;
      const newY = e.clientY - canvasRect.top - dragOffset.y;
      
      // Update table position
      setTables(prevTables => 
        prevTables.map(table => 
          table.id === tableId 
            ? { ...table, positionX: newX, positionY: newY } 
            : table
        )
      );
      
      setDraggedTable(null);
    }
  };
  
  // Handle adding a new table
  const handleAddTable = () => {
    setTableForm({
      name: '',
      shape: 'round',
      capacity: 8,
      rotation: 0,
      positionX: 100,
      positionY: 100
    });
    setShowAddTableModal(true);
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setTableForm({
        ...tableForm,
        [name]: parseInt(value, 10)
      });
    } else {
      setTableForm({
        ...tableForm,
        [name]: value
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedTable) {
        // Update existing table
        const { error } = await demoApi.tables.update(selectedTable.id, tableForm as Table);
        if (error) throw error;
        
        setTables(prevTables => 
          prevTables.map(table => 
            table.id === selectedTable.id ? { ...table, ...tableForm } : table
          )
        );
      } else {
        // Add new table
        const { data, error } = await demoApi.tables.add(tableForm as Table);
        if (error) throw error;
        
        if (data) {
          setTables([...tables, data as Table]);
          
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
          setSeats([...seats, ...newSeats]);
        }
      }
      
      setShowAddTableModal(false);
      setSelectedTable(null);
    } catch (err) {
      setError('Failed to save table');
      console.error(err);
    }
  };
  
  // Handle deleting a table
  const handleDeleteTable = async (tableId: string) => {
    try {
      const { error } = await demoApi.tables.delete(tableId);
      if (error) throw error;
      
      setTables(tables.filter(table => table.id !== tableId));
      setSeats(seats.filter(seat => seat.tableId !== tableId));
      setSelectedTable(null);
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
  
  // Handle assigning a guest to a seat
  const handleAssignGuest = async (guestId: string | null) => {
    if (!selectedSeat) return;
    
    try {
      const updatedSeat = { ...selectedSeat, guestId };
      
      // In a real app, we would update the seat in the database
      // For demo purposes, we'll just update the local state
      setSeats(prevSeats => 
        prevSeats.map(seat => 
          seat.id === selectedSeat.id ? updatedSeat : seat
        )
      );
      
      setShowGuestAssignModal(false);
      setSelectedSeat(null);
    } catch (err) {
      setError('Failed to assign guest');
      console.error(err);
    }
  };
  
  // Get guest name by ID
  const getGuestName = (guestId: string | null) => {
    if (!guestId) return '';
    
    const guest = guests.find(g => g.id === guestId);
    return guest ? `${guest.firstName} ${guest.lastName}` : '';
  };
  
  // Render a table with its seats
  const renderTable = (table: Table) => {
    const isSelected = selectedTable?.id === table.id;
    const tableSeats = seats.filter(seat => seat.tableId === table.id);
    
    // Calculate seat positions based on table shape and capacity
    const getSeatPosition = (position: number, totalSeats: number) => {
      const angle = (position / totalSeats) * 2 * Math.PI;
      const radius = table.shape === 'rectangular' ? 
        (position % 2 === 0 ? 40 : 80) : 
        60;
      
      let x = 0;
      let y = 0;
      
      if (table.shape === 'rectangular') {
        const side = Math.floor(position / (totalSeats / 4));
        switch (side) {
          case 0: // Top
            x = (position % (totalSeats / 4)) / (totalSeats / 4 - 1) * 100 - 50;
            y = -40;
            break;
          case 1: // Right
            x = 50;
            y = (position % (totalSeats / 4)) / (totalSeats / 4 - 1) * 80 - 40;
            break;
          case 2: // Bottom
            x = (1 - (position % (totalSeats / 4)) / (totalSeats / 4 - 1)) * 100 - 50;
            y = 40;
            break;
          case 3: // Left
            x = -50;
            y = (1 - (position % (totalSeats / 4)) / (totalSeats / 4 - 1)) * 80 - 40;
            break;
        }
      } else {
        x = Math.cos(angle) * radius;
        y = Math.sin(angle) * radius;
      }
      
      return { x, y };
    };
    
    return (
      <div
        key={table.id}
        className={`table-planner__table table-planner__table--${table.shape} ${
          isSelected ? 'table-planner__table--selected' : ''
        }`}
        style={{
          transform: `translate(${table.positionX}px, ${table.positionY}px) rotate(${table.rotation}deg)`,
        }}
        onClick={() => handleTableClick(table)}
        draggable
        onDragStart={(e) => handleTableDragStart(e, table.id, e.currentTarget)}
      >
        <div className="table-planner__table-name">{table.name}</div>
        
        {tableSeats.map(seat => {
          const position = getSeatPosition(seat.position, table.capacity);
          const guestName = getGuestName(seat.guestId);
          
          return (
            <div
              key={seat.id}
              className={`table-planner__seat ${
                seat.guestId ? 'table-planner__seat--occupied' : ''
              }`}
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleSeatClick(seat);
              }}
            >
              {guestName && (
                <div className="table-planner__seat-name">
                  {guestName.split(' ')[0]}
                </div>
              )}
            </div>
          );
        })}
        
        {isSelected && (
          <button
            className="table-planner__table-delete"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteTable(table.id);
            }}
          >
            ×
          </button>
        )}
      </div>
    );
  };
  
  return (
    <div className="table-planner">
      {error && (
        <div className="table-planner__error">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
      
      <div className="table-planner__controls">
        <div className="table-planner__control-group">
          <button className="table-planner__button" onClick={handleAddTable}>
            Tisch hinzufügen
          </button>
        </div>
        
        <div className="table-planner__control-group">
          <label>Tischform</label>
          <select
            value={selectedTable?.shape || 'all'}
            onChange={(e) => {
              if (selectedTable) {
                setTables(prevTables => 
                  prevTables.map(table => 
                    table.id === selectedTable.id 
                      ? { ...table, shape: e.target.value as any } 
                      : table
                  )
                );
              }
            }}
            disabled={!selectedTable}
          >
            <option value="all" disabled>Tischform wählen</option>
            <option value="round">Rund</option>
            <option value="rectangular">Rechteckig</option>
            <option value="square">Quadratisch</option>
            <option value="oval">Oval</option>
          </select>
        </div>
        
        <div className="table-planner__control-group">
          <label>Rotation</label>
          <input
            type="range"
            min="0"
            max="359"
            value={selectedTable?.rotation || 0}
            onChange={(e) => {
              if (selectedTable) {
                setTables(prevTables => 
                  prevTables.map(table => 
                    table.id === selectedTable.id 
                      ? { ...table, rotation: parseInt(e.target.value, 10) } 
                      : table
                  )
                );
              }
            }}
            disabled={!selectedTable}
          />
        </div>
      </div>
      
      <div 
        className="table-planner__layout"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {loading ? (
          <div className="table-planner__loading">Tischplan wird geladen...</div>
        ) : (
          tables.map(table => renderTable(table))
        )}
      </div>
      
      {/* Add/Edit Table Modal */}
      {showAddTableModal && (
        <div className="table-planner__modal">
          <div className="table-planner__modal-content">
            <div className="table-planner__modal-header">
              <h2>{selectedTable ? 'Tisch bearbeiten' : 'Neuen Tisch hinzufügen'}</h2>
              <button
                className="table-planner__modal-close"
                onClick={() => {
                  setShowAddTableModal(false);
                  setSelectedTable(null);
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="table-planner__form-group">
                <label htmlFor="name">Tischname</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={tableForm.name || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="table-planner__form-group">
                <label htmlFor="shape">Tischform</label>
                <select
                  id="shape"
                  name="shape"
                  value={tableForm.shape || 'round'}
                  onChange={handleInputChange}
                >
                  <option value="round">Rund</option>
                  <option value="rectangular">Rechteckig</option>
                  <option value="square">Quadratisch</option>
                  <option value="oval">Oval</option>
                </select>
              </div>
              
              <div className="table-planner__form-group">
                <label htmlFor="capacity">Anzahl Sitzplätze</label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  min="1"
                  max="20"
                  value={tableForm.capacity || 8}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="table-planner__form-actions">
                <button
                  type="button"
                  className="table-planner__button table-planner__button--secondary"
                  onClick={() => {
                    setShowAddTableModal(false);
                    setSelectedTable(null);
                  }}
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="table-planner__button"
                >
                  {selectedTable ? 'Speichern' : 'Tisch erstellen'}
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
                onClick={() => {
                  setShowGuestAssignModal(false);
                  setSelectedSeat(null);
                }}
              >
                ×
              </button>
            </div>
            
            <div className="table-planner__guest-list">
              <div
                className="table-planner__guest-item"
                onClick={() => handleAssignGuest(null)}
              >
                <div className="table-planner__guest-name-full">Keinen Gast zuweisen</div>
              </div>
              
              {guests
                .filter(guest => guest.rsvpStatus === 'confirmed')
                .map(guest => {
                  const isAssigned = seats.some(seat => 
                    seat.guestId === guest.id && 
                    (!selectedSeat || seat.id !== selectedSeat.id)
                  );
                  
                  return (
                    <div
                      key={guest.id}
                      className={`table-planner__guest-item ${
                        isAssigned ? 'table-planner__guest-item--assigned' : ''
                      } ${
                        selectedSeat.guestId === guest.id ? 'table-planner__guest-item--selected' : ''
                      }`}
                      onClick={() => !isAssigned && handleAssignGuest(guest.id)}
                    >
                      <div className="table-planner__guest-name-full">
                        {guest.firstName} {guest.lastName}
                      </div>
                      <div className="table-planner__guest-details">
                        {isAssigned && <span>Bereits zugewiesen</span>}
                        {guest.groupName && <span>Gruppe: {guest.groupName}</span>}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .table-planner {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .table-planner__error {
          background-color: #f8d7da;
          color: #721c24;
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .table-planner__error button {
          background: none;
          border: none;
          font-size: 1.25rem;
          cursor: pointer;
          color: #721c24;
        }
        
        .table-planner__loading {
          text-align: center;
          padding: 2rem;
        }
        
        .table-planner__layout {
          position: relative;
          width: 100%;
          height: 600px;
          background-color: #f8f9fa;
          border-radius: 8px;
          margin-top: 1rem;
          overflow: hidden;
        }
        
        .table-planner__table {
          position: absolute;
          cursor: grab;
          transition: box-shadow 0.2s ease;
          transform-origin: center center;
        }
        
        .table-planner__table--selected {
          box-shadow: 0 0 0 2px #ffbd00;
          z-index: 10;
        }
        
        .table-planner__table--round {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background-color: white;
          border: 1px solid #ddd;
        }
        
        .table-planner__table--rectangular {
          width: 160px;
          height: 80px;
          border-radius: 4px;
          background-color: white;
          border: 1px solid #ddd;
        }
        
        .table-planner__table--square {
          width: 100px;
          height: 100px;
          border-radius: 4px;
          background-color: white;
          border: 1px solid #ddd;
        }
        
        .table-planner__table--oval {
          width: 140px;
          height: 90px;
          border-radius: 45px;
          background-color: white;
          border: 1px solid #ddd;
        }
        
        .table-planner__table-name {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-weight: 500;
          text-align: center;
          pointer-events: none;
        }
        
        .table-planner__table-delete {
          position: absolute;
          top: -10px;
          right: -10px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: #dc3545;
          color: white;
          border: none;
          font-size: 16px;
          line-height: 1;
          cursor: pointer;
          z-index: 11;
        }
        
        .table-planner__seat {
          position: absolute;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #e9ecef;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: background-color 0.2s ease;
          transform-origin: center center;
        }
        
        .table-planner__seat:hover {
          background-color: #dee2e6;
        }
        
        .table-planner__seat--occupied {
          background-color: #ffbd00;
          color: white;
        }
        
        .table-planner__seat-name {
          font-size: 0.7rem;
          font-weight: 500;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 100%;
          padding: 0 2px;
        }
        
        .table-planner__table--round .table-planner__seat:nth-child(2) { top: -20px; left: calc(50% - 15px); }
        .table-planner__table--round .table-planner__seat:nth-child(3) { top: calc(15% - 15px); right: calc(15% - 15px); }
        .table-planner__table--round .table-planner__seat:nth-child(4) { right: -20px; top: calc(50% - 15px); }
        .table-planner__table--round .table-planner__seat:nth-child(5) { bottom: calc(15% - 15px); right: calc(15% - 15px); }
        .table-planner__table--round .table-planner__seat:nth-child(6) { bottom: -20px; left: calc(50% - 15px); }
        .table-planner__table--round .table-planner__seat:nth-child(7) { bottom: calc(15% - 15px); left: calc(15% - 15px); }
        .table-planner__table--round .table-planner__seat:nth-child(8) { left: -20px; top: calc(50% - 15px); }
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
