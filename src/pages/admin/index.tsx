import React from 'react';
import { ContentEditor } from '../../components/admin/ContentEditor';
import demoContent from '../../data/demo-content.json';

const AdminPage: React.FC = () => {
  const handleSaveContent = (content: any) => {
    console.log('Content saved:', content);
    // In a real implementation, this would save to the database
  };

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
              <li>
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
              <li className="active">
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
          <ContentEditor content={demoContent} onSave={handleSaveContent} />
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
