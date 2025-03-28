"use client";

import React, { useState, useEffect } from 'react';
import { demoApi } from '../../lib/supabase-api';

interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  category: string;
}

interface ChecklistsProps {
  // Props can be added as needed
}

export const ChecklistsComponent: React.FC<ChecklistsProps> = () => {
  const [checklists, setChecklists] = useState<{[key: string]: ChecklistItem[]}>({
    'planning': [
      {
        id: '1',
        title: 'Hochzeitsdatum festlegen',
        completed: true,
        priority: 'high',
        dueDate: '12 Monate vorher',
        category: 'planning'
      },
      {
        id: '2',
        title: 'Budget festlegen',
        completed: true,
        priority: 'high',
        dueDate: '12 Monate vorher',
        category: 'planning'
      },
      {
        id: '3',
        title: 'Gästeliste erstellen',
        completed: true,
        priority: 'high',
        dueDate: '10 Monate vorher',
        category: 'planning'
      },
      {
        id: '4',
        title: 'Location besichtigen und buchen',
        completed: true,
        priority: 'high',
        dueDate: '9 Monate vorher',
        category: 'planning'
      },
      {
        id: '5',
        title: 'Catering auswählen',
        completed: true,
        priority: 'medium',
        dueDate: '8 Monate vorher',
        category: 'planning'
      },
      {
        id: '6',
        title: 'Fotografen buchen',
        completed: true,
        priority: 'medium',
        dueDate: '8 Monate vorher',
        category: 'planning'
      },
      {
        id: '7',
        title: 'DJ oder Band buchen',
        completed: false,
        priority: 'medium',
        dueDate: '7 Monate vorher',
        category: 'planning'
      },
      {
        id: '8',
        title: 'Hochzeitskleid anprobieren',
        completed: false,
        priority: 'high',
        dueDate: '7 Monate vorher',
        category: 'planning'
      }
    ],
    'preparation': [
      {
        id: '9',
        title: 'Einladungen versenden',
        completed: true,
        priority: 'high',
        dueDate: '6 Monate vorher',
        category: 'preparation'
      },
      {
        id: '10',
        title: 'Eheringe auswählen',
        completed: false,
        priority: 'medium',
        dueDate: '4 Monate vorher',
        category: 'preparation'
      },
      {
        id: '11',
        title: 'Menü festlegen',
        completed: false,
        priority: 'medium',
        dueDate: '3 Monate vorher',
        category: 'preparation'
      },
      {
        id: '12',
        title: 'Hochzeitstorte bestellen',
        completed: false,
        priority: 'medium',
        dueDate: '3 Monate vorher',
        category: 'preparation'
      }
    ],
    'lastWeek': [
      {
        id: '13',
        title: 'Finale Gästeliste bestätigen',
        completed: false,
        priority: 'high',
        dueDate: '1 Woche vorher',
        category: 'lastWeek'
      },
      {
        id: '14',
        title: 'Sitzplan finalisieren',
        completed: false,
        priority: 'high',
        dueDate: '1 Woche vorher',
        category: 'lastWeek'
      },
      {
        id: '15',
        title: 'Zeitplan mit allen Dienstleistern bestätigen',
        completed: false,
        priority: 'high',
        dueDate: '1 Woche vorher',
        category: 'lastWeek'
      }
    ],
    'weddingDay': [
      {
        id: '16',
        title: 'Ringe mitnehmen',
        completed: false,
        priority: 'high',
        dueDate: 'Am Hochzeitstag',
        category: 'weddingDay'
      },
      {
        id: '17',
        title: 'Notfall-Kit vorbereiten',
        completed: false,
        priority: 'medium',
        dueDate: 'Am Hochzeitstag',
        category: 'weddingDay'
      },
      {
        id: '18',
        title: 'Dokumente für Standesamt bereithalten',
        completed: false,
        priority: 'high',
        dueDate: 'Am Hochzeitstag',
        category: 'weddingDay'
      }
    ]
  });
  
  const [activeTab, setActiveTab] = useState<string>('planning');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddItemModal, setShowAddItemModal] = useState<boolean>(false);
  const [newItem, setNewItem] = useState<Partial<ChecklistItem>>({
    title: '',
    priority: 'medium',
    dueDate: '',
    category: activeTab,
    completed: false
  });
  
  // Calculate progress for active tab
  const calculateProgress = (category: string) => {
    const items = checklists[category] || [];
    if (items.length === 0) return 0;
    
    const completedItems = items.filter(item => item.completed).length;
    return Math.round((completedItems / items.length) * 100);
  };
  
  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setNewItem(prev => ({ ...prev, category: tab }));
  };
  
  // Handle checkbox change
  const handleCheckboxChange = (id: string) => {
    setChecklists(prev => {
      const updatedChecklists = { ...prev };
      
      // Find the category that contains this item
      Object.keys(updatedChecklists).forEach(category => {
        updatedChecklists[category] = updatedChecklists[category].map(item => {
          if (item.id === id) {
            return { ...item, completed: !item.completed };
          }
          return item;
        });
      });
      
      return updatedChecklists;
    });
  };
  
  // Handle new item input change
  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle add new item
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItem.title || !newItem.dueDate) {
      setError('Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }
    
    const category = newItem.category || activeTab;
    
    // Create new item
    const item: ChecklistItem = {
      id: `new-${Date.now()}`,
      title: newItem.title || '',
      completed: false,
      priority: newItem.priority as 'high' | 'medium' | 'low' || 'medium',
      dueDate: newItem.dueDate || '',
      category
    };
    
    // Add to checklists
    setChecklists(prev => {
      const updatedChecklists = { ...prev };
      if (!updatedChecklists[category]) {
        updatedChecklists[category] = [];
      }
      updatedChecklists[category] = [...updatedChecklists[category], item];
      return updatedChecklists;
    });
    
    // Reset form and close modal
    setNewItem({
      title: '',
      priority: 'medium',
      dueDate: '',
      category: activeTab,
      completed: false
    });
    setShowAddItemModal(false);
    setError(null);
  };
  
  // Handle export checklist
  const handleExportChecklist = () => {
    alert('Diese Funktion würde die Checkliste als PDF oder CSV exportieren.');
  };
  
  return (
    <div className="checklists">
      <div className="checklists__demo-notice">
        <p>Dies ist eine funktionale Demo-Version der Checklisten. Sie können:</p>
        <ul>
          <li>Zwischen verschiedenen Phasen der Hochzeitsplanung wechseln</li>
          <li>Aufgaben als erledigt markieren</li>
          <li>Neue Aufgaben hinzufügen</li>
          <li>Den Fortschritt für jede Phase verfolgen</li>
          <li>Checklisten exportieren</li>
        </ul>
      </div>
      
      {error && (
        <div className="checklists__error">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Schließen</button>
        </div>
      )}
      
      <div className="checklists__tabs">
        <button 
          className={`checklists__tab ${activeTab === 'planning' ? 'checklists__tab--active' : ''}`}
          onClick={() => handleTabChange('planning')}
        >
          Planung (12-6 Monate)
        </button>
        <button 
          className={`checklists__tab ${activeTab === 'preparation' ? 'checklists__tab--active' : ''}`}
          onClick={() => handleTabChange('preparation')}
        >
          Vorbereitung (6-2 Monate)
        </button>
        <button 
          className={`checklists__tab ${activeTab === 'lastWeek' ? 'checklists__tab--active' : ''}`}
          onClick={() => handleTabChange('lastWeek')}
        >
          Letzte Woche
        </button>
        <button 
          className={`checklists__tab ${activeTab === 'weddingDay' ? 'checklists__tab--active' : ''}`}
          onClick={() => handleTabChange('weddingDay')}
        >
          Hochzeitstag
        </button>
      </div>
      
      <div className="checklists__content">
        <div className="checklists__header">
          <h3>
            {activeTab === 'planning' && 'Planung (12-6 Monate vor der Hochzeit)'}
            {activeTab === 'preparation' && 'Vorbereitung (6-2 Monate vor der Hochzeit)'}
            {activeTab === 'lastWeek' && 'Letzte Woche vor der Hochzeit'}
            {activeTab === 'weddingDay' && 'Hochzeitstag'}
          </h3>
          <div className="checklists__progress">
            <div className="checklists__progress-bar">
              <div 
                className="checklists__progress-fill" 
                style={{ width: `${calculateProgress(activeTab)}%` }}
              ></div>
            </div>
            <div className="checklists__progress-text">
              {calculateProgress(activeTab)}% abgeschlossen
            </div>
          </div>
        </div>
        
        <div className="checklists__list">
          {checklists[activeTab]?.map(item => (
            <div 
              key={item.id} 
              className={`checklists__item ${item.completed ? 'checklists__item--completed' : ''}`}
            >
              <div className="checklists__item-checkbox">
                <input 
                  type="checkbox" 
                  checked={item.completed} 
                  onChange={() => handleCheckboxChange(item.id)}
                />
              </div>
              <div className="checklists__item-content">
                <div className="checklists__item-title">{item.title}</div>
                <div className="checklists__item-details">
                  <span className={`checklists__item-priority checklists__item-priority--${item.priority}`}>
                    {item.priority === 'high' && 'Hohe Priorität'}
                    {item.priority === 'medium' && 'Mittlere Priorität'}
                    {item.priority === 'low' && 'Niedrige Priorität'}
                  </span>
                  <span className="checklists__item-due">Fällig: {item.dueDate}</span>
                </div>
              </div>
            </div>
          ))}
          
          {checklists[activeTab]?.length === 0 && (
            <div className="checklists__empty">
              Keine Aufgaben in dieser Kategorie. Fügen Sie neue Aufgaben hinzu.
            </div>
          )}
        </div>
      </div>
      
      <div className="checklists__controls">
        <button 
          className="checklists__button"
          onClick={() => setShowAddItemModal(true)}
        >
          Aufgabe hinzufügen
        </button>
        <button 
          className="checklists__button"
          onClick={() => {
            const newCategory = prompt('Geben Sie einen Namen für die neue Checkliste ein:');
            if (newCategory && newCategory.trim() !== '') {
              setChecklists(prev => ({ ...prev, [newCategory.trim()]: [] }));
              handleTabChange(newCategory.trim());
            }
          }}
        >
          Neue Checkliste erstellen
        </button>
        <button 
          className="checklists__button"
          onClick={handleExportChecklist}
        >
          Checkliste exportieren
        </button>
      </div>
      
      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="checklists__modal">
          <div className="checklists__modal-content">
            <div className="checklists__modal-header">
              <h2>Neue Aufgabe hinzufügen</h2>
              <button 
                className="checklists__modal-close"
                onClick={() => {
                  setShowAddItemModal(false);
                  setError(null);
                }}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddItem}>
              <div className="checklists__form-group">
                <label htmlFor="title">Aufgabentitel</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newItem.title || ''}
                  onChange={handleNewItemChange}
                  required
                />
              </div>
              <div className="checklists__form-group">
                <label htmlFor="priority">Priorität</label>
                <select
                  id="priority"
                  name="priority"
                  value={newItem.priority || 'medium'}
                  onChange={handleNewItemChange}
                >
                  <option value="high">Hoch</option>
                  <option value="medium">Mittel</option>
                  <option value="low">Niedrig</option>
                </select>
              </div>
              <div className="checklists__form-group">
                <label htmlFor="dueDate">Fälligkeitsdatum</label>
                <input
                  type="text"
                  id="dueDate"
                  name="dueDate"
                  value={newItem.dueDate || ''}
                  onChange={handleNewItemChange}
                  placeholder="z.B. 3 Monate vorher"
                  required
                />
              </div>
              <div className="checklists__form-group">
                <label htmlFor="category">Kategorie</label>
                <select
                  id="category"
                  name="category"
                  value={newItem.category || activeTab}
                  onChange={handleNewItemChange}
                >
                  {Object.keys(checklists).map(category => (
                    <option key={category} value={category}>
                      {category === 'planning' && 'Planung (12-6 Monate)'}
                      {category === 'preparation' && 'Vorbereitung (6-2 Monate)'}
                      {category === 'lastWeek' && 'Letzte Woche'}
                      {category === 'weddingDay' && 'Hochzeitstag'}
                      {!['planning', 'preparation', 'lastWeek', 'weddingDay'].includes(category) && category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="checklists__form-actions">
                <button 
                  type="button" 
                  className="checklists__button checklists__button--secondary"
                  onClick={() => {
                    setShowAddItemModal(false);
                    setError(null);
                  }}
                >
                  Abbrechen
                </button>
                <button 
                  type="submit" 
                  className="checklists__button"
                >
                  Hinzufügen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
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
        
        .checklists__error {
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 4px;
          padding: 1rem;
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .checklists__error p {
          margin: 0;
          color: #721c24;
        }
        
        .checklists__error button {
          background: none;
          border: none;
          color: #721c24;
          font-weight: bold;
          cursor: pointer;
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
        
        .checklists__empty {
          padding: 2rem;
          text-align: center;
          color: #666;
          background-color: #f9f9f9;
          border-radius: 4px;
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
        
        .checklists__item--completed .checklists__item-title {
          text-decoration: line-through;
        }
        
        .checklists__item-checkbox {
          display: flex;
          align-items: flex-start;
          padding-top: 0.25rem;
        }
        
        .checklists__item-checkbox input {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
        
        .checklists__item-content {
          flex: 1;
        }
        
        .checklists__item-title {
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: #333;
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
        
        .checklists__button--secondary {
          background-color: #f8f9fa;
          color: #6c757d;
        }
        
        .checklists__button--secondary:hover {
          background-color: #e2e6ea;
        }
        
        .checklists__button--disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .checklists__modal {
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
        
        .checklists__modal-content {
          background-color: white;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .checklists__modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #eee;
        }
        
        .checklists__modal-header h2 {
          margin: 0;
          font-size: 1.25rem;
        }
        
        .checklists__modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
        }
        
        .checklists__modal form {
          padding: 1.5rem;
        }
        
        .checklists__form-group {
          margin-bottom: 1rem;
        }
        
        .checklists__form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .checklists__form-group input,
        .checklists__form-group select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .checklists__form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        
        @media (max-width: 768px) {
          .checklists__tabs {
            flex-direction: column;
          }
          
          .checklists__tab {
            text-align: left;
            border-bottom: 1px solid #eee;
          }
          
          .checklists__tab--active {
            border-bottom: 1px solid #ffbd00;
          }
          
          .checklists__controls {
            flex-direction: column;
          }
          
          .checklists__form-actions {
            flex-direction: column;
          }
          
          .checklists__form-actions button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ChecklistsComponent;
