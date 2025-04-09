import React from 'react';

interface InstanceManagementProps {
  // Props can be added as needed
}

export const InstanceManagement: React.FC<InstanceManagementProps> = () => {
  return (
    <div className="instance-management">
      <div className="instance-management__header">
        <h2>Instanzverwaltung</h2>
        <button className="btn btn-primary">Instanz erstellen</button>
      </div>
      
      <div className="instance-management__filters">
        <div className="instance-management__search">
          <input type="text" placeholder="Instanzen suchen..." className="input" />
        </div>
        
        <div className="instance-management__filter">
          <select className="select">
            <option value="">Alle Pläne</option>
            <option value="free">Kostenlos</option>
            <option value="basic">Standard</option>
            <option value="premium">Premium</option>
          </select>
        </div>
        
        <div className="instance-management__filter">
          <select className="select">
            <option value="">Alle Status</option>
            <option value="active">Aktiv</option>
            <option value="inactive">Inaktiv</option>
            <option value="pending">Ausstehend</option>
          </select>
        </div>
      </div>
      
      <div className="instance-management__table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Domain</th>
              <th>Besitzer</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Erstellt am</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Hochzeit Schmidt & Müller</td>
              <td>schmidt-mueller.lemonvows.com</td>
              <td>
                Julia Schmidt
                <div className="instance-management__owner-email">julia@example.com</div>
              </td>
              <td><span className="badge badge--premium">Premium</span></td>
              <td><span className="badge badge--active">Aktiv</span></td>
              <td>15.03.2025</td>
              <td>
                <div className="instance-management__actions">
                  <button className="btn-icon">✎</button>
                  <button className="btn-icon">⚙</button>
                  <button className="btn-icon btn-icon--danger">×</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>Hochzeit Weber & König</td>
              <td>weber-koenig.lemonvows.com</td>
              <td>
                Sarah Weber
                <div className="instance-management__owner-email">sarah@example.com</div>
              </td>
              <td><span className="badge badge--premium">Premium</span></td>
              <td><span className="badge badge--active">Aktiv</span></td>
              <td>12.03.2025</td>
              <td>
                <div className="instance-management__actions">
                  <button className="btn-icon">✎</button>
                  <button className="btn-icon">⚙</button>
                  <button className="btn-icon btn-icon--danger">×</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>Hochzeit Schneider & Bauer</td>
              <td>schneider-bauer.lemonvows.com</td>
              <td>
                Anna Schneider
                <div className="instance-management__owner-email">anna@example.com</div>
              </td>
              <td><span className="badge badge--basic">Standard</span></td>
              <td><span className="badge badge--active">Aktiv</span></td>
              <td>10.03.2025</td>
              <td>
                <div className="instance-management__actions">
                  <button className="btn-icon">✎</button>
                  <button className="btn-icon">⚙</button>
                  <button className="btn-icon btn-icon--danger">×</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>Hochzeit Fischer & Meyer</td>
              <td>fischer-meyer.lemonvows.com</td>
              <td>
                Michael König
                <div className="instance-management__owner-email">michael@example.com</div>
              </td>
              <td><span className="badge badge--free">Kostenlos</span></td>
              <td><span className="badge badge--inactive">Inaktiv</span></td>
              <td>05.03.2025</td>
              <td>
                <div className="instance-management__actions">
                  <button className="btn-icon">✎</button>
                  <button className="btn-icon">⚙</button>
                  <button className="btn-icon btn-icon--danger">×</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>Hochzeit Hoffmann & Wagner</td>
              <td>hoffmann-wagner.lemonvows.com</td>
              <td>
                Thomas Müller
                <div className="instance-management__owner-email">thomas@example.com</div>
              </td>
              <td><span className="badge badge--basic">Standard</span></td>
              <td><span className="badge badge--pending">Ausstehend</span></td>
              <td>01.03.2025</td>
              <td>
                <div className="instance-management__actions">
                  <button className="btn-icon">✎</button>
                  <button className="btn-icon">⚙</button>
                  <button className="btn-icon btn-icon--danger">×</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InstanceManagement;
