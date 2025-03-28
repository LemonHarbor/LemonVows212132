import React from 'react';

interface GuestManagementProps {
  // Props can be added as needed
}

export const GuestManagement: React.FC<GuestManagementProps> = () => {
  return (
    <div className="guest-management">
      <div className="guest-management__demo-notice">
        <p>Dies ist eine Demo-Version der Gästeverwaltung. In der vollständigen Version können Sie:</p>
        <ul>
          <li>Gäste einladen und verwalten</li>
          <li>RSVP-Status verfolgen</li>
          <li>Menüpräferenzen und Allergien erfassen</li>
          <li>Übernachtungsbedarf verwalten</li>
          <li>Gäste nach verschiedenen Kriterien filtern</li>
        </ul>
      </div>
      
      <div className="guest-management__filters">
        <div className="guest-management__search">
          <input type="text" placeholder="Gäste suchen..." disabled />
          <button className="guest-management__search-button" disabled>Suchen</button>
        </div>
        
        <div className="guest-management__filter-group">
          <label>RSVP-Status:</label>
          <select disabled>
            <option>Alle</option>
            <option>Zugesagt</option>
            <option>Abgesagt</option>
            <option>Ausstehend</option>
          </select>
        </div>
        
        <div className="guest-management__filter-group">
          <label>Gruppe:</label>
          <select disabled>
            <option>Alle</option>
            <option>Familie Braut</option>
            <option>Familie Bräutigam</option>
            <option>Freunde</option>
            <option>Kollegen</option>
          </select>
        </div>
        
        <div className="guest-management__filter-group">
          <label>Menüpräferenz:</label>
          <select disabled>
            <option>Alle</option>
            <option>Fleisch</option>
            <option>Fisch</option>
            <option>Vegetarisch</option>
            <option>Vegan</option>
          </select>
        </div>
      </div>
      
      <div className="guest-management__table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>E-Mail</th>
              <th>RSVP</th>
              <th>Gruppe</th>
              <th>Menüpräferenz</th>
              <th>Allergien</th>
              <th>Übernachtung</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Julia Schmidt</td>
              <td>julia@example.com</td>
              <td><span className="guest-management__status guest-management__status--confirmed">Zugesagt</span></td>
              <td>Familie Braut</td>
              <td>Vegetarisch</td>
              <td>Nüsse</td>
              <td><span className="guest-management__accommodation">Ja</span></td>
              <td>
                <div className="guest-management__actions">
                  <button className="guest-management__action-button" disabled>Bearbeiten</button>
                  <button className="guest-management__action-button" disabled>Löschen</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>Thomas Müller</td>
              <td>thomas@example.com</td>
              <td><span className="guest-management__status guest-management__status--confirmed">Zugesagt</span></td>
              <td>Freunde</td>
              <td>Fleisch</td>
              <td>-</td>
              <td><span className="guest-management__accommodation">Ja</span></td>
              <td>
                <div className="guest-management__actions">
                  <button className="guest-management__action-button" disabled>Bearbeiten</button>
                  <button className="guest-management__action-button" disabled>Löschen</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>Sarah Weber</td>
              <td>sarah@example.com</td>
              <td><span className="guest-management__status guest-management__status--pending">Ausstehend</span></td>
              <td>Kollegen</td>
              <td>-</td>
              <td>-</td>
              <td><span className="guest-management__accommodation">Nein</span></td>
              <td>
                <div className="guest-management__actions">
                  <button className="guest-management__action-button" disabled>Bearbeiten</button>
                  <button className="guest-management__action-button" disabled>Löschen</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>Michael König</td>
              <td>michael@example.com</td>
              <td><span className="guest-management__status guest-management__status--declined">Abgesagt</span></td>
              <td>Familie Bräutigam</td>
              <td>-</td>
              <td>-</td>
              <td><span className="guest-management__accommodation">-</span></td>
              <td>
                <div className="guest-management__actions">
                  <button className="guest-management__action-button" disabled>Bearbeiten</button>
                  <button className="guest-management__action-button" disabled>Löschen</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>Anna Schneider</td>
              <td>anna@example.com</td>
              <td><span className="guest-management__status guest-management__status--confirmed">Zugesagt</span></td>
              <td>Freunde</td>
              <td>Fisch</td>
              <td>Laktose</td>
              <td><span className="guest-management__accommodation">Ja</span></td>
              <td>
                <div className="guest-management__actions">
                  <button className="guest-management__action-button" disabled>Bearbeiten</button>
                  <button className="guest-management__action-button" disabled>Löschen</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="guest-management__controls">
        <button className="guest-management__button guest-management__button--disabled">Gast hinzufügen</button>
        <button className="guest-management__button guest-management__button--disabled">E-Mail an ausgewählte Gäste</button>
        <button className="guest-management__button guest-management__button--disabled">Gästeliste exportieren</button>
      </div>
      
      <style jsx>{`
        .guest-management {
          padding: 2rem;
          background-color: #f9f9f9;
          border-radius: 8px;
        }
        
        .guest-management__demo-notice {
          background-color: #fff3cd;
          border: 1px solid #ffeeba;
          border-radius: 4px;
          padding: 1rem;
          margin-bottom: 2rem;
        }
        
        .guest-management__demo-notice p {
          margin-top: 0;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .guest-management__demo-notice ul {
          margin: 0;
          padding-left: 1.5rem;
        }
        
        .guest-management__filters {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2rem;
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .guest-management__search {
          display: flex;
          flex: 1;
          min-width: 250px;
        }
        
        .guest-management__search input {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px 0 0 4px;
          background-color: #f9f9f9;
          cursor: not-allowed;
        }
        
        .guest-management__search-button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 0 4px 4px 0;
          background-color: #ddd;
          color: #666;
          cursor: not-allowed;
        }
        
        .guest-management__filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          min-width: 150px;
        }
        
        .guest-management__filter-group label {
          font-weight: 500;
          font-size: 0.9rem;
        }
        
        .guest-management__filter-group select {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          background-color: #f9f9f9;
          cursor: not-allowed;
        }
        
        .guest-management__table {
          margin-bottom: 2rem;
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .guest-management__table table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .guest-management__table th {
          text-align: left;
          padding: 1rem;
          background-color: #f5f5f5;
          font-weight: 600;
          color: #333;
        }
        
        .guest-management__table td {
          padding: 1rem;
          border-top: 1px solid #eee;
        }
        
        .guest-management__status {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .guest-management__status--confirmed {
          background-color: #d4edda;
          color: #155724;
        }
        
        .guest-management__status--declined {
          background-color: #f8d7da;
          color: #721c24;
        }
        
        .guest-management__status--pending {
          background-color: #fff3cd;
          color: #856404;
        }
        
        .guest-management__accommodation {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
          background-color: #e2e3e5;
          color: #383d41;
        }
        
        .guest-management__actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .guest-management__action-button {
          padding: 0.25rem 0.5rem;
          border: none;
          border-radius: 4px;
          background-color: #f8f9fa;
          color: #6c757d;
          font-size: 0.8rem;
          cursor: not-allowed;
        }
        
        .guest-management__controls {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .guest-management__button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          background-color: #ffbd00;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .guest-management__button:hover {
          background-color: #e6a800;
        }
        
        .guest-management__button--disabled {
          background-color: #ddd;
          color: #666;
          cursor: not-allowed;
        }
        
        .guest-management__button--disabled:hover {
          background-color: #ddd;
        }
        
        @media (max-width: 768px) {
          .guest-management__filters {
            flex-direction: column;
          }
          
          .guest-management__table {
            overflow-x: auto;
          }
          
          .guest-management__controls {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default GuestManagement;
