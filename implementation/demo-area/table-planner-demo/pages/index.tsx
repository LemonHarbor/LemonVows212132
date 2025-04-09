import React from 'react';
import TablePlannerDemo from '../components/TablePlannerDemo';

const TablePlannerDemoPage: React.FC = () => {
  return (
    <div className="demo-page">
      <header className="demo-header">
        <h1>LemonVows Tischplaner Demo</h1>
        <p>Erstellen Sie Ihren Sitzplan mit unserem interaktiven Drag & Drop Tischplaner</p>
      </header>
      
      <main className="demo-content">
        <div className="demo-instructions">
          <h2>So funktioniert's:</h2>
          <ol>
            <li>Fügen Sie Tische hinzu und wählen Sie die Form (rund, rechteckig oder oval)</li>
            <li>Ziehen Sie Gäste aus der Liste auf die gewünschten Sitzplätze</li>
            <li>Klicken Sie auf einen Tisch, um ihn zu bearbeiten oder zu entfernen</li>
          </ol>
        </div>
        
        <div className="demo-container">
          <TablePlannerDemo />
        </div>
      </main>
      
      <footer className="demo-footer">
        <p>Dies ist eine Demo-Version. <a href="#">Jetzt registrieren</a> für alle Funktionen.</p>
      </footer>
      
      <style jsx>{`
        .demo-page {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          color: #333;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
        
        .demo-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .demo-header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          color: #ffbd00;
        }
        
        .demo-header p {
          font-size: 1.2rem;
          color: #666;
        }
        
        .demo-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .demo-instructions {
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .demo-instructions h2 {
          margin-top: 0;
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }
        
        .demo-instructions ol {
          padding-left: 1.5rem;
          margin-bottom: 0;
        }
        
        .demo-instructions li {
          margin-bottom: 0.5rem;
        }
        
        .demo-container {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }
        
        .demo-footer {
          margin-top: 2rem;
          text-align: center;
          font-size: 0.9rem;
          color: #666;
        }
        
        .demo-footer a {
          color: #ffbd00;
          text-decoration: none;
          font-weight: 500;
        }
        
        .demo-footer a:hover {
          text-decoration: underline;
        }
        
        @media (max-width: 768px) {
          .demo-page {
            padding: 1rem;
          }
          
          .demo-header h1 {
            font-size: 2rem;
          }
          
          .demo-header p {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default TablePlannerDemoPage;
