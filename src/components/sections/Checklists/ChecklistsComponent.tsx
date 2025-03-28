import React from 'react';

interface ChecklistsComponentProps {
  // Props can be added as needed
}

export const ChecklistsComponent: React.FC<ChecklistsComponentProps> = () => {
  return (
    <div className="checklists">
      <div className="checklists__demo-notice">
        <p>Dies ist eine Demo-Version der Checklisten. In der vollständigen Version können Sie:</p>
        <ul>
          <li>Vorgefertigte und anpassbare Checklisten nutzen</li>
          <li>Fortschritt für jede Planungsphase verfolgen</li>
          <li>Erinnerungen für wichtige Termine erhalten</li>
          <li>Aufgaben an Helfer zuweisen</li>
          <li>Eigene Checklisten erstellen</li>
        </ul>
      </div>
      
      <div className="checklists__tabs">
        <button className="checklists__tab checklists__tab--active">Planung (12-6 Monate)</button>
        <button className="checklists__tab">Vorbereitung (6-2 Monate)</button>
        <button className="checklists__tab">Letzte Woche</button>
        <button className="checklists__tab">Hochzeitstag</button>
      </div>
      
      <div className="checklists__content">
        <div className="checklists__header">
          <h3>Planung (12-6 Monate vor der Hochzeit)</h3>
          <div className="checklists__progress">
            <div className="checklists__progress-bar">
              <div className="checklists__progress-fill" style={{ width: '75%' }}></div>
            </div>
            <div className="checklists__progress-text">75% abgeschlossen</div>
          </div>
        </div>
        
        <div className="checklists__list">
          <div className="checklists__item checklists__item--completed">
            <div className="checklists__item-checkbox">
              <input type="checkbox" checked disabled />
            </div>
            <div className="checklists__item-content">
              <div className="checklists__item-title">Hochzeitsdatum festlegen</div>
              <div className="checklists__item-details">
                <span className="checklists__item-priority checklists__item-priority--high">Hohe Priorität</span>
                <span className="checklists__item-due">Fällig: 12 Monate vorher</span>
              </div>
            </div>
          </div>
          
          <div className="checklists__item checklists__item--completed">
            <div className="checklists__item-checkbox">
              <input type="checkbox" checked disabled />
            </div>
            <div className="checklists__item-content">
              <div className="checklists__item-title">Budget festlegen</div>
              <div className="checklists__item-details">
                <span className="checklists__item-priority checklists__item-priority--high">Hohe Priorität</span>
                <span className="checklists__item-due">Fällig: 12 Monate vorher</span>
              </div>
            </div>
          </div>
          
          <div className="checklists__item checklists__item--completed">
            <div className="checklists__item-checkbox">
              <input type="checkbox" checked disabled />
            </div>
            <div className="checklists__item-content">
              <div className="checklists__item-title">Gästeliste erstellen</div>
              <div className="checklists__item-details">
                <span className="checklists__item-priority checklists__item-priority--high">Hohe Priorität</span>
                <span className="checklists__item-due">Fällig: 10 Monate vorher</span>
              </div>
            </div>
          </div>
          
          <div className="checklists__item checklists__item--completed">
            <div className="checklists__item-checkbox">
              <input type="checkbox" checked disabled />
            </div>
            <div className="checklists__item-content">
              <div className="checklists__item-title">Location besichtigen und buchen</div>
              <div className="checklists__item-details">
                <span className="checklists__item-priority checklists__item-priority--high">Hohe Priorität</span>
                <span className="checklists__item-due">Fällig: 9 Monate vorher</span>
              </div>
            </div>
          </div>
          
          <div className="checklists__item checklists__item--completed">
            <div className="checklists__item-checkbox">
              <input type="checkbox" checked disabled />
            </div>
            <div className="checklists__item-content">
              <div className="checklists__item-title">Catering auswählen</div>
              <div className="checklists__item-details">
                <span className="checklists__item-priority checklists__item-priority--medium">Mittlere Priorität</span>
                <span className="checklists__item-due">Fällig: 8 Monate vorher</span>
              </div>
            </div>
          </div>
          
          <div className="checklists__item checklists__item--completed">
            <div className="checklists__item-checkbox">
              <input type="checkbox" checked disabled />
            </div>
            <div className="checklists__item-content">
              <div className="checklists__item-title">Fotografen buchen</div>
              <div className="checklists__item-details">
                <span className="checklists__item-priority checklists__item-priority--medium">Mittlere Priorität</span>
                <span className="checklists__item-due">Fällig: 8 Monate vorher</span>
              </div>
            </div>
          </div>
          
          <div className="checklists__item">
            <div className="checklists__item-checkbox">
              <input type="checkbox" disabled />
            </div>
            <div className="checklists__item-content">
              <div className="checklists__item-title">DJ oder Band buchen</div>
              <div className="checklists__item-details">
                <span className="checklists__item-priority checklists__item-priority--medium">Mittlere Priorität</span>
                <span className="checklists__item-due">Fällig: 7 Monate vorher</span>
              </div>
            </div>
          </div>
          
          <div className="checklists__item">
            <div className="checklists__item-checkbox">
              <input type="checkbox" disabled />
            </div>
            <div className="checklists__item-content">
              <div className="checklists__item-title">Hochzeitskleid anprobieren</div>
              <div className="checklists__item-details">
                <span className="checklists__item-priority checklists__item-priority--high">Hohe Priorität</span>
                <span className="checklists__item-due">Fällig: 7 Monate vorher</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="checklists__controls">
        <button className="checklists__button checklists__button--disabled">Aufgabe hinzufügen</button>
        <button className="checklists__button checklists__button--disabled">Neue Checkliste erstellen</button>
        <button className="checklists__button checklists__button--disabled">Checkliste exportieren</button>
      </div>
      
      <style jsx>{`
        .checklists {
          padding: 2rem;
          background-color: #f9f9f9;
          border-radius: 8px;
        }
        
        .checklists__demo-notice {
          background-color: #fff3cd;
          border: 1px solid #ffeeba;
          border-radius: 4px;
          padding: 1rem;
          margin-bottom: 2rem;
        }
        
        .checklists__demo-notice p {
          margin-top: 0;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .checklists__demo-notice ul {
          margin: 0;
          padding-left: 1.5rem;
        }
        
        .checklists__tabs {
          display: flex;
          overflow-x: auto;
          margin-bottom: 1.5rem;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .checklists__tab {
          padding: 1rem 1.5rem;
          border: none;
          background: none;
          font-size: 0.9rem;
          color: #666;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }
        
        .checklists__tab:hover {
          color: #333;
        }
        
        .checklists__tab--active {
          color: #ffbd00;
          border-bottom: 2px solid #ffbd00;
          font-weight: 500;
        }
        
        .checklists__content {
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .checklists__header {
          margin-bottom: 1.5rem;
        }
        
        .checklists__header h3 {
          margin-top: 0;
          margin-bottom: 1rem;
          font-size: 1.2rem;
          color: #333;
        }
        
        .checklists__progress {
          margin-bottom: 1rem;
        }
        
        .checklists__progress-bar {
          height: 8px;
          background-color: #f0f0f0;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }
        
        .checklists__progress-fill {
          height: 100%;
          background-color: #ffbd00;
          border-radius: 4px;
        }
        
        .checklists__progress-text {
          font-size: 0.9rem;
          color: #666;
          text-align: right;
        }
        
        .checklists__list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .checklists__item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          border-radius: 4px;
          background-color: #f9f9f9;
          transition: background-color 0.2s ease;
        }
        
        .checklists__item:hover {
          background-color: #f5f5f5;
        }
        
        .checklists__item--completed {
          opacity: 0.7;
        }
        
        .checklists__item-checkbox {
          display: flex;
          align-items: flex-start;
          padding-top: 0.25rem;
        }
        
        .checklists__item-checkbox input {
          width: 18px;
          height: 18px;
          cursor: not-allowed;
        }
        
        .checklists__item-content {
          flex: 1;
        }
        
        .checklists__item-title {
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: #333;
        }
        
        .checklists__item--completed .checklists__item-title {
          text-decoration: line-through;
          color: #888;
        }
        
        .checklists__item-details {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          font-size: 0.8rem;
        }
        
        .checklists__item-priority {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-weight: 500;
        }
        
        .checklists__item-priority--high {
          background-color: #f8d7da;
          color: #721c24;
        }
        
        .checklists__item-priority--medium {
          background-color: #fff3cd;
          color: #856404;
        }
        
        .checklists__item-priority--low {
          background-color: #d1ecf1;
          color: #0c5460;
        }
        
        .checklists__item-due {
          color: #666;
        }
        
        .checklists__controls {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .checklists__button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          background-color: #ffbd00;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .checklists__button:hover {
          background-color: #e6a800;
        }
        
        .checklists__button--disabled {
          background-color: #ddd;
          color: #666;
          cursor: not-allowed;
        }
        
        .checklists__button--disabled:hover {
          background-color: #ddd;
        }
        
        @media (max-width: 768px) {
          .checklists__tabs {
            padding: 0;
          }
          
          .checklists__tab {
            padding: 0.75rem 1rem;
            font-size: 0.8rem;
          }
          
          .checklists__controls {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default ChecklistsComponent;
