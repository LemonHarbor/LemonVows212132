import React, { useState, useEffect } from "react";

interface TableProps {
  id: string;
  type: "round" | "rectangular" | "oval";
  seats: number;
  position: { x: number; y: number };
  name: string;
}

interface GuestProps {
  id: string;
  name: string;
  tableId: string | null;
  seatIndex: number | null;
}

const TablePlannerDemo: React.FC = () => {
  const [tables, setTables] = useState<TableProps[]>([
    { id: "table1", type: "round", seats: 8, position: { x: 200, y: 200 }, name: "Tisch 1" },
    { id: "table2", type: "rectangular", seats: 6, position: { x: 500, y: 200 }, name: "Tisch 2" },
    { id: "table3", type: "oval", seats: 10, position: { x: 350, y: 400 }, name: "Tisch 3" },
  ]);
  
  const [guests, setGuests] = useState<GuestProps[]>([
    { id: "guest1", name: "Max Mustermann", tableId: null, seatIndex: null },
    { id: "guest2", name: "Anna Schmidt", tableId: null, seatIndex: null },
    { id: "guest3", name: "Thomas Müller", tableId: null, seatIndex: null },
    { id: "guest4", name: "Laura Weber", tableId: null, seatIndex: null },
    { id: "guest5", name: "Michael Becker", tableId: null, seatIndex: null },
    { id: "guest6", name: "Sophie Wagner", tableId: null, seatIndex: null },
  ]);
  
  const [activeTable, setActiveTable] = useState<string | null>(null);
  const [draggedGuest, setDraggedGuest] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newTableType, setNewTableType] = useState<"round" | "rectangular" | "oval">("round");
  const [newTableSeats, setNewTableSeats] = useState<number>(8);
  const [newTableName, setNewTableName] = useState<string>("");
  
  const handleDragStart = (e: React.DragEvent, guestId: string) => {
    setDraggedGuest(guestId);
    e.dataTransfer.setData("text/plain", guestId);
    e.dataTransfer.effectAllowed = "move";
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  
  const handleDrop = (e: React.DragEvent, tableId: string, seatIndex: number) => {
    e.preventDefault();
    
    if (draggedGuest) {
      // Check if seat is already occupied
      const isSeatOccupied = guests.some(
        (g) => g.tableId === tableId && g.seatIndex === seatIndex
      );
      
      if (!isSeatOccupied) {
        setGuests((prevGuests) =>
          prevGuests.map((guest) =>
            guest.id === draggedGuest
              ? { ...guest, tableId, seatIndex }
              : guest
          )
        );
      }
      
      setDraggedGuest(null);
    }
  };
  
  const handleTableClick = (tableId: string) => {
    setActiveTable(activeTable === tableId ? null : tableId);
  };
  
  const handleAddTable = () => {
    setShowModal(true);
  };
  
  const handleCreateTable = () => {
    const newTable: TableProps = {
      id: `table${tables.length + 1}`,
      type: newTableType,
      seats: newTableSeats,
      position: { x: 300, y: 300 },
      name: newTableName || `Tisch ${tables.length + 1}`,
    };
    
    setTables([...tables, newTable]);
    setShowModal(false);
    setNewTableName("");
    setNewTableType("round");
    setNewTableSeats(8);
  };
  
  const handleRemoveTable = (tableId: string) => {
    // Remove table and reset guests assigned to this table
    setTables(tables.filter((table) => table.id !== tableId));
    setGuests(
      guests.map((guest) =>
        guest.tableId === tableId
          ? { ...guest, tableId: null, seatIndex: null }
          : guest
      )
    );
    setActiveTable(null);
  };
  
  const handleResetGuest = (guestId: string) => {
    setGuests(
      guests.map((guest) =>
        guest.id === guestId
          ? { ...guest, tableId: null, seatIndex: null }
          : guest
      )
    );
  };
  
  const renderTable = (table: TableProps) => {
    const isActive = activeTable === table.id;
    const tableSeats = [];
    
    for (let i = 0; i < table.seats; i++) {
      const assignedGuest = guests.find(
        (g) => g.tableId === table.id && g.seatIndex === i
      );
      
      tableSeats.push(
        <div
          key={`${table.id}-seat-${i}`}
          className={`table-planner__seat ${
            assignedGuest ? "table-planner__seat--occupied" : ""
          }`}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, table.id, i)}
        >
          {assignedGuest && (
            <div className="table-planner__guest-name">
              {assignedGuest.name.split(" ")[0]}
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div
        className={`table-planner__table table-planner__table--${table.type} ${
          isActive ? "table-planner__table--active" : ""
        }`}
        style={{
          left: `${table.position.x}px`,
          top: `${table.position.y}px`,
        }}
        onClick={() => handleTableClick(table.id)}
      >
        <div className="table-planner__table-name">{table.name}</div>
        {tableSeats}
        {isActive && (
          <button
            className="table-planner__table-remove"
            onClick={() => handleRemoveTable(table.id)}
          >
            ×
          </button>
        )}
      </div>
    );
  };
  
  return (
    <div className="table-planner">
      <div className="table-planner__controls">
        <div className="table-planner__control-group">
          <button className="table-planner__button" onClick={handleAddTable}>
            Tisch hinzufügen
          </button>
        </div>
      </div>
      
      <div className="table-planner__layout">
        {tables.map((table) => renderTable(table))}
      </div>
      
      <div className="table-planner__guest-panel">
        <h3>Gästeliste</h3>
        <div className="table-planner__guest-list">
          {guests.map((guest) => (
            <div
              key={guest.id}
              className={`table-planner__guest-item ${
                guest.tableId ? "table-planner__guest-item--assigned" : ""
              }`}
              draggable
              onDragStart={(e) => handleDragStart(e, guest.id)}
            >
              <div className="table-planner__guest-name-full">{guest.name}</div>
              <div className="table-planner__guest-details">
                {guest.tableId ? (
                  <>
                    <span>
                      {tables.find((t) => t.id === guest.tableId)?.name}, Platz{" "}
                      {(guest.seatIndex || 0) + 1}
                    </span>
                    <button
                      className="table-planner__button table-planner__button--small"
                      onClick={() => handleResetGuest(guest.id)}
                    >
                      Zurücksetzen
                    </button>
                  </>
                ) : (
                  <span>Noch nicht zugewiesen</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {showModal && (
        <div className="table-planner__modal">
          <div className="table-planner__modal-content">
            <div className="table-planner__modal-header">
              <h2>Neuen Tisch erstellen</h2>
              <button
                className="table-planner__modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <form>
              <div className="table-planner__form-group">
                <label htmlFor="tableName">Tischname</label>
                <input
                  type="text"
                  id="tableName"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  placeholder="z.B. Familientisch"
                />
              </div>
              <div className="table-planner__form-group">
                <label htmlFor="tableType">Tischform</label>
                <select
                  id="tableType"
                  value={newTableType}
                  onChange={(e) =>
                    setNewTableType(e.target.value as "round" | "rectangular" | "oval")
                  }
                >
                  <option value="round">Rund</option>
                  <option value="rectangular">Rechteckig</option>
                  <option value="oval">Oval</option>
                </select>
              </div>
              <div className="table-planner__form-group">
                <label htmlFor="tableSeats">Anzahl Sitzplätze</label>
                <select
                  id="tableSeats"
                  value={newTableSeats}
                  onChange={(e) => setNewTableSeats(Number(e.target.value))}
                >
                  {[4, 6, 8, 10, 12].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
              <div className="table-planner__form-actions">
                <button
                  type="button"
                  className="table-planner__button table-planner__button--secondary"
                  onClick={() => setShowModal(false)}
                >
                  Abbrechen
                </button>
                <button
                  type="button"
                  className="table-planner__button"
                  onClick={handleCreateTable}
                >
                  Tisch erstellen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .table-planner {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }
        
        .table-planner__layout {
          position: relative;
          width: 100%;
          height: 600px;
          background-color: #f8f9fa;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .table-planner__table {
          position: absolute;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .table-planner__table--active {
          z-index: 10;
          box-shadow: 0 0 0 2px #ffbd00;
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
        
        .table-planner__table-remove {
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
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #e9ecef;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .table-planner__seat--occupied {
          background-color: #ffbd00;
          color: white;
        }
        
        .table-planner__guest-name {
          font-size: 0.8rem;
          font-weight: 500;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 100%;
          padding: 0 4px;
        }
        
        .table-planner__table--round {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background-color: white;
          border: 1px solid #ddd;
        }
        
        .table-planner__table--rectangular {
          width: 200px;
          height: 100px;
          border-radius: 4px;
          background-color: white;
          border: 1px solid #ddd;
        }
        
        .table-planner__table--oval {
          width: 180px;
          height: 120px;
          border-radius: 60px;
          background-color: white;
          border: 1px solid #ddd;
        }
        
        .table-planner__table--round .table-planner__seat:nth-child(2) { top: -20px; left: calc(50% - 20px); }
        .table-planner__table--round .table-planner__seat:nth-child(3) { top: calc(15% - 20px); right: calc(15% - 20px); }
        .table-planner__table--round .table-planner__seat:nth-child(4) { right: -20px; top: calc(50% - 20px); }
        .table-planner__table--round .table-planner__seat:nth-child(5) { bottom: calc(15% - 20px); right: calc(15% - 20px); }
        .table-planner__table--round .table-planner__seat:nth-child(6) { bottom: -20px; left: calc(50% - 20px); }
        .table-planner__table--round .table-planner__seat:nth-child(7) { bottom: calc(15% - 20px); left: calc(15% - 20px); }
        .table-planner__table--round .table-planner__seat:nth-child(8) { left: -20px; top: calc(50% - 20px); }
        .table-planner__table--round .table-planner__seat:nth-child(9) { top: calc(15% - 20px); left: calc(15% - 20px); }
        
        .table-planner__table--rectangular .table-planner__seat:nth-child(2) { top: -20px; left: calc(25% - 20px); }
        .table-planner__table--rectangular .table-planner__seat:nth-child(3) { top: -20px; left: calc(75% - 20px); }
        .table-planner__table--rectangular .table-planner__seat:nth-child(4) { right: -20px; top: calc(50% - 20px); }
        .table-planner__table--rectangular .table-planner__seat:nth-child(5) { bottom: -20px; left: calc(75% - 20px); }
        .table-planner__table--rectangular .table-planner__seat:nth-child(6) { bottom: -20px; left: calc(25% - 20px); }
        .table-planner__table--rectangular .table-planner__seat:nth-child(7) { left: -20px; top: calc(50% - 20px); }
        
        .table-planner__table--oval .table-planner__seat:nth-child(2) { top: -20px; left: calc(25% - 20px); }
        .table-planner__table--oval .table-planner__seat:nth-child(3) { top: -20px; left: calc(75% - 20px); }
        .table-planner__table--oval .table-planner__seat:nth-child(4) { right: -20px; top: calc(25% - 20px); }
        .table-planner__table--oval .table-planner__seat:nth-child(5) { right: -20px; top: calc(75% - 20px); }
        .table-planner__table--oval .table-planner__seat:nth-child(6) { bottom: -20px; left: calc(75% - 20px); }
        .table-planner__table--oval .table-planner__seat:nth-child(7) { bottom: -20px; left: calc(25% - 20px); }
        .table-planner__table--oval .table-planner__seat:nth-child(8) { left: -20px; top: calc(25% - 20px); }
        .table-planner__table--oval .table-planner__seat:nth-child(9) { left: -20px; top: calc(75% - 20px); }
        
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
        
        .table-planner__button--small {
          padding: 0.25rem 0.5rem;
          font-size: 0.8rem;
          margin-top: 0.25rem;
        }
        
        .table-planner__guest-panel {
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .table-planner__guest-panel h3 {
          margin-top: 0;
          margin-bottom: 1rem;
        }
        
        .table-planner__guest-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .table-planner__guest-item {
          padding: 0.75rem;
          border-radius: 4px;
          background-color: #f8f9fa;
          cursor: grab;
          transition: background-color 0.2s ease;
        }
        
        .table-planner__guest-item:hover {
          background-color: #e9ecef;
        }
        
        .table-planner__guest-item--assigned {
          background-color: #fff3cd;
        }
        
        .table-planner__guest-name-full {
          font-weight: 500;
        }
        
        .table-planner__guest-details {
          font-size: 0.9rem;
          color: #6c757d;
          margin-top: 0.25rem;
          display: flex;
          flex-direction: column;
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
        
        .table-planner__form-group {
          margin-bottom: 1rem;
          padding: 0 1.5rem;
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
          padding: 0 1.5rem 1.5rem;
        }
        
        @media (max-width: 768px) {
          .table-planner {
            padding: 1rem;
          }
          
          .table-planner__layout {
            height: 400px;
          }
          
          .table-planner__controls {
            flex-direction: column;
          }
          
          .table-planner__table--round {
            width: 120px;
            height: 120px;
          }
          
          .table-planner__table--rectangular {
            width: 160px;
            height: 80px;
          }
          
          .table-planner__table--oval {
            width: 140px;
            height: 100px;
          }
          
          .table-planner__seat {
            width: 30px;
            height: 30px;
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

export default TablePlannerDemo;
