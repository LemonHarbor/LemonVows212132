import React from 'react';

interface TablePlannerProps {
  // Props can be added as needed
}

export const TablePlanner: React.FC<TablePlannerProps> = () => {
  return (
    <div className="table-planner">
      <div className="table-planner__demo-notice">
        <p>Dies ist eine Demo-Version des interaktiven Tischplaners. In der vollständigen Version können Sie:</p>
        <ul>
          <li>Tische per Drag & Drop platzieren</li>
          <li>Verschiedene Tischformen und -größen wählen</li>
          <li>Gäste den Tischen zuweisen</li>
          <li>Menüpräferenzen und Allergien anzeigen</li>
          <li>Den fertigen Plan als PDF, PNG oder CSV exportieren</li>
        </ul>
      </div>
      
      <div className="table-planner__demo-canvas">
        <div className="table-planner__table table-planner__table--round">
          <div className="table-planner__table-label">Tisch 1</div>
          <div className="table-planner__seats">
            <div className="table-planner__seat table-planner__seat--occupied">
              <span className="table-planner__guest-name">Julia S.</span>
            </div>
            <div className="table-planner__seat table-planner__seat--occupied">
              <span className="table-planner__guest-name">Thomas M.</span>
            </div>
            <div className="table-planner__seat table-planner__seat--occupied">
              <span className="table-planner__guest-name">Sarah W.</span>
            </div>
            <div className="table-planner__seat table-planner__seat--empty"></div>
            <div className="table-planner__seat table-planner__seat--occupied">
              <span className="table-planner__guest-name">Michael K.</span>
            </div>
            <div className="table-planner__seat table-planner__seat--occupied">
              <span className="table-planner__guest-name">Anna S.</span>
            </div>
            <div className="table-planner__seat table-planner__seat--empty"></div>
            <div className="table-planner__seat table-planner__seat--occupied">
              <span className="table-planner__guest-name">David L.</span>
            </div>
          </div>
        </div>
        
        <div className="table-planner__table table-planner__table--rectangular">
          <div className="table-planner__table-label">Tisch 2</div>
          <div className="table-planner__seats table-planner__seats--rectangular">
            <div className="table-planner__seat table-planner__seat--occupied">
              <span className="table-planner__guest-name">Lisa M.</span>
            </div>
            <div className="table-planner__seat table-planner__seat--occupied">
              <span className="table-planner__guest-name">Mark B.</span>
            </div>
            <div className="table-planner__seat table-planner__seat--empty"></div>
            <div className="table-planner__seat table-planner__seat--occupied">
              <span className="table-planner__guest-name">Sophie R.</span>
            </div>
            <div className="table-planner__seat table-planner__seat--occupied">
              <span className="table-planner__guest-name">Peter H.</span>
            </div>
            <div className="table-planner__seat table-planner__seat--occupied">
              <span className="table-planner__guest-name">Laura K.</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="table-planner__controls">
        <div className="table-planner__control-group">
          <label>Tischform:</label>
          <select disabled>
            <option>Rund</option>
            <option>Rechteckig</option>
            <option>Quadratisch</option>
            <option>Oval</option>
          </select>
        </div>
        
        <div className="table-planner__control-group">
          <label>Anzahl der Plätze:</label>
          <select disabled>
            <option>6</option>
            <option>8</option>
            <option>10</option>
            <option>12</option>
          </select>
        </div>
        
        <div className="table-planner__control-group">
          <button className="table-planner__button table-planner__button--disabled">Tisch hinzufügen</button>
          <button className="table-planner__button table-planner__button--disabled">Als PDF exportieren</button>
        </div>
      </div>
      
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
        
        .table-planner__demo-canvas {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          margin-bottom: 2rem;
          min-height: 300px;
          background-color: white;
          border: 1px dashed #ccc;
          border-radius: 8px;
          padding: 2rem;
          position: relative;
        }
        
        .table-planner__table {
          position: relative;
          margin: 0 auto;
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
        
        .table-planner__table-label {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-weight: 600;
          color: #666;
        }
        
        .table-planner__seats {
          position: absolute;
          width: 100%;
          height: 100%;
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
        
        /* Position seats around rectangular table */
        .table-planner__table--rectangular .table-planner__seat:nth-child(1) { top: -20px; left: calc(25% - 20px); }
        .table-planner__table--rectangular .table-planner__seat:nth-child(2) { top: -20px; left: calc(75% - 20px); }
        .table-planner__table--rectangular .table-planner__seat:nth-child(3) { right: -20px; top: calc(50% - 20px); }
        .table-planner__table--rectangular .table-planner__seat:nth-child(4) { bottom: -20px; left: calc(75% - 20px); }
        .table-planner__table--rectangular .table-planner__seat:nth-child(5) { bottom: -20px; left: calc(25% - 20px); }
        .table-planner__table--rectangular .table-planner__seat:nth-child(6) { left: -20px; top: calc(50% - 20px); }
        
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
          background-color: #f9f9f9;
          cursor: not-allowed;
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
        
        .table-planner__button--disabled {
          background-color: #ddd;
          cursor: not-allowed;
        }
        
        .table-planner__button--disabled:hover {
          background-color: #ddd;
        }
        
        @media (max-width: 768px) {
          .table-planner__controls {
            flex-direction: column;
          }
          
          .table-planner__control-group {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default TablePlanner;
