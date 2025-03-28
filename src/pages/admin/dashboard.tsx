import React from 'react';
import { UserManagement } from '../../components/admin/dashboard/UserManagement';
import { InstanceManagement } from '../../components/admin/dashboard/InstanceManagement';
import { ContentEditor } from '../../components/admin/ContentEditor';
import demoContent from '../../data/demo-content.json';

const Dashboard: React.FC = () => {
  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div className="admin-page__logo">
          <img src="/logo.png" alt="LemonVows Logo" />
          <h1>LemonVows Admin</h1>
        </div>
        <div className="admin-page__actions">
          <button className="btn btn-outline-light">Vorschau</button>
          <button className="btn btn-light">Abmelden</button>
        </div>
      </header>
      
      <div className="admin-page__content">
        <aside className="admin-page__sidebar">
          <nav className="admin-page__nav">
            <h2>Hauptmenü</h2>
            <ul>
              <li className="active">
                <a href="/admin/dashboard">
                  <i className="icon-dashboard"></i>
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/admin/instances">
                  <i className="icon-instances"></i>
                  Instanzen
                </a>
              </li>
              <li>
                <a href="/admin/users">
                  <i className="icon-users"></i>
                  Benutzer
                </a>
              </li>
              <li>
                <a href="/admin">
                  <i className="icon-edit"></i>
                  Content-Editor
                </a>
              </li>
              <li>
                <a href="/admin/settings">
                  <i className="icon-settings"></i>
                  Einstellungen
                </a>
              </li>
            </ul>
          </nav>
          
          <div className="admin-page__status">
            <div className="admin-page__status-item">
              <span className="admin-page__status-label">Status:</span>
              <span className="admin-page__status-value admin-page__status-value--active">Aktiv</span>
            </div>
            <div className="admin-page__status-item">
              <span className="admin-page__status-label">Version:</span>
              <span className="admin-page__status-value">1.0.0</span>
            </div>
          </div>
        </aside>
        
        <main className="admin-page__main">
          <div className="dashboard__stats">
            <div className="dashboard__stat-card">
              <div className="dashboard__stat-icon icon-instances"></div>
              <div className="dashboard__stat-content">
                <div className="dashboard__stat-value">24</div>
                <div className="dashboard__stat-label">Aktive Instanzen</div>
              </div>
            </div>
            
            <div className="dashboard__stat-card">
              <div className="dashboard__stat-icon icon-users"></div>
              <div className="dashboard__stat-content">
                <div className="dashboard__stat-value">156</div>
                <div className="dashboard__stat-label">Registrierte Benutzer</div>
              </div>
            </div>
            
            <div className="dashboard__stat-card">
              <div className="dashboard__stat-icon icon-calendar"></div>
              <div className="dashboard__stat-content">
                <div className="dashboard__stat-value">8</div>
                <div className="dashboard__stat-label">Hochzeiten diesen Monat</div>
              </div>
            </div>
            
            <div className="dashboard__stat-card">
              <div className="dashboard__stat-icon icon-revenue"></div>
              <div className="dashboard__stat-content">
                <div className="dashboard__stat-value">€1.245</div>
                <div className="dashboard__stat-label">Monatliche Einnahmen</div>
              </div>
            </div>
          </div>
          
          <div className="dashboard__recent-activity">
            <h2>Letzte Aktivitäten</h2>
            
            <div className="dashboard__activity-list">
              <div className="dashboard__activity-item">
                <div className="dashboard__activity-icon icon-user-add"></div>
                <div className="dashboard__activity-content">
                  <div className="dashboard__activity-title">Neuer Benutzer registriert</div>
                  <div className="dashboard__activity-details">Julia Schmidt hat sich registriert</div>
                  <div className="dashboard__activity-time">Vor 2 Stunden</div>
                </div>
              </div>
              
              <div className="dashboard__activity-item">
                <div className="dashboard__activity-icon icon-instance-add"></div>
                <div className="dashboard__activity-content">
                  <div className="dashboard__activity-title">Neue Instanz erstellt</div>
                  <div className="dashboard__activity-details">Instanz für "Hochzeit Schmidt & Müller" erstellt</div>
                  <div className="dashboard__activity-time">Vor 3 Stunden</div>
                </div>
              </div>
              
              <div className="dashboard__activity-item">
                <div className="dashboard__activity-icon icon-payment"></div>
                <div className="dashboard__activity-content">
                  <div className="dashboard__activity-title">Zahlung eingegangen</div>
                  <div className="dashboard__activity-details">Premium-Paket für "Hochzeit Weber & König"</div>
                  <div className="dashboard__activity-time">Vor 5 Stunden</div>
                </div>
              </div>
              
              <div className="dashboard__activity-item">
                <div className="dashboard__activity-icon icon-content-edit"></div>
                <div className="dashboard__activity-content">
                  <div className="dashboard__activity-title">Content aktualisiert</div>
                  <div className="dashboard__activity-details">Preispläne wurden aktualisiert</div>
                  <div className="dashboard__activity-time">Vor 1 Tag</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="dashboard__quick-actions">
            <h2>Schnellzugriff</h2>
            
            <div className="dashboard__action-buttons">
              <button className="btn btn-primary">Benutzer hinzufügen</button>
              <button className="btn btn-primary">Instanz erstellen</button>
              <button className="btn btn-primary">Content bearbeiten</button>
              <button className="btn btn-primary">Einstellungen ändern</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
