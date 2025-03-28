import React from 'react';

interface UserManagementProps {
  // Props can be added as needed
}

export const UserManagement: React.FC<UserManagementProps> = () => {
  return (
    <div className="user-management">
      <div className="user-management__header">
        <h2>Benutzerverwaltung</h2>
        <button className="btn btn-primary">Benutzer hinzufügen</button>
      </div>
      
      <div className="user-management__filters">
        <div className="user-management__search">
          <input type="text" placeholder="Benutzer suchen..." className="input" />
        </div>
        
        <div className="user-management__filter">
          <select className="select">
            <option value="">Alle Rollen</option>
            <option value="admin">Admin</option>
            <option value="customer">Kunde</option>
          </select>
        </div>
        
        <div className="user-management__filter">
          <select className="select">
            <option value="">Alle Status</option>
            <option value="active">Aktiv</option>
            <option value="inactive">Inaktiv</option>
          </select>
        </div>
      </div>
      
      <div className="user-management__table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>E-Mail</th>
              <th>Rolle</th>
              <th>Status</th>
              <th>Registriert am</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Julia Schmidt</td>
              <td>julia@example.com</td>
              <td><span className="badge badge--customer">Kunde</span></td>
              <td><span className="badge badge--active">Aktiv</span></td>
              <td>15.03.2025</td>
              <td>
                <div className="user-management__actions">
                  <button className="btn-icon">✎</button>
                  <button className="btn-icon btn-icon--danger">×</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>Thomas Müller</td>
              <td>thomas@example.com</td>
              <td><span className="badge badge--customer">Kunde</span></td>
              <td><span className="badge badge--active">Aktiv</span></td>
              <td>12.03.2025</td>
              <td>
                <div className="user-management__actions">
                  <button className="btn-icon">✎</button>
                  <button className="btn-icon btn-icon--danger">×</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>Sarah Weber</td>
              <td>sarah@example.com</td>
              <td><span className="badge badge--admin">Admin</span></td>
              <td><span className="badge badge--active">Aktiv</span></td>
              <td>10.03.2025</td>
              <td>
                <div className="user-management__actions">
                  <button className="btn-icon">✎</button>
                  <button className="btn-icon btn-icon--danger">×</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>Michael König</td>
              <td>michael@example.com</td>
              <td><span className="badge badge--customer">Kunde</span></td>
              <td><span className="badge badge--inactive">Inaktiv</span></td>
              <td>05.03.2025</td>
              <td>
                <div className="user-management__actions">
                  <button className="btn-icon">✎</button>
                  <button className="btn-icon btn-icon--danger">×</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>Anna Schneider</td>
              <td>anna@example.com</td>
              <td><span className="badge badge--customer">Kunde</span></td>
              <td><span className="badge badge--active">Aktiv</span></td>
              <td>01.03.2025</td>
              <td>
                <div className="user-management__actions">
                  <button className="btn-icon">✎</button>
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

export default UserManagement;
