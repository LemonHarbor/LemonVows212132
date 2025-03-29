import React, { useState, useEffect } from 'react';
import { demoApi } from '../../../lib/supabase-api';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  assignedTo: string;
  category: string;
}

const ChecklistsComponent: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<Partial<ChecklistItem>>({
    title: '',
    description: '',
    dueDate: '',
    completed: false,
    priority: 'medium',
    assignedTo: '',
    category: 'Venue',
  });

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await demoApi.checklists.getItems();
      if (data && !error) {
        setItems(data);
      }
    };

    fetchItems();
  }, []);

  const categories = ['all', ...Array.from(new Set(items.map(item => item.category)))];

  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter(item => item.category === activeCategory);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const handleAddItem = () => {
    setCurrentItem({
      title: '',
      description: '',
      dueDate: '',
      completed: false,
      priority: 'medium',
      assignedTo: '',
      category: 'Venue',
    });
    setShowModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setCurrentItem(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentItem.id) {
      // Update existing item
      const { data, error } = await demoApi.checklists.updateItem(currentItem.id, currentItem);
      if (data && !error) {
        setItems(items.map(item => item.id === currentItem.id ? data as ChecklistItem : item));
      }
    } else {
      // Add new item
      const { data, error } = await demoApi.checklists.addItem(currentItem as ChecklistItem);
      if (data && !error) {
        setItems([...items, data as ChecklistItem]);
      }
    }
    
    setShowModal(false);
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    const { data, error } = await demoApi.checklists.updateItem(id, { completed: !completed });
    if (data && !error) {
      setItems(items.map(item => item.id === id ? { ...item, completed: !completed } : item));
    }
  };

  const handleEditItem = (item: ChecklistItem) => {
    setCurrentItem(item);
    setShowModal(true);
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie diesen Eintrag löschen möchten?')) {
      const { error } = await demoApi.checklists.deleteItem(id);
      if (!error) {
        setItems(items.filter(item => item.id !== id));
      }
    }
  };

  return (
    <div className="checklists">
      <div className="checklists__controls">
        <button className="checklists__button" onClick={handleAddItem}>
          Aufgabe hinzufügen
        </button>
      </div>
      
      <div className="checklists__tabs">
        {categories.map(category => (
          <button
            key={category}
            className={`checklists__tab ${activeCategory === category ? 'checklists__tab--active' : ''}`}
            onClick={() => handleCategoryChange(category)}
          >
            {category === 'all' ? 'Alle Kategorien' : category}
          </button>
        ))}
      </div>
      
      <div className="checklists__list">
        {filteredItems.length === 0 ? (
          <div className="checklists__empty">
            Keine Aufgaben gefunden.
          </div>
        ) : (
          filteredItems.map(item => (
            <div
              key={item.id}
              className={`checklists__item ${item.completed ? 'checklists__item--completed' : ''}`}
            >
              <div className="checklists__item-checkbox">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => handleToggleComplete(item.id, item.completed)}
                />
              </div>
              <div className="checklists__item-content">
                <div className="checklists__item-title">{item.title}</div>
                <div className="checklists__item-description">{item.description}</div>
                <div className="checklists__item-details">
                  <span className={`checklists__item-priority checklists__item-priority--${item.priority}`}>
                    {item.priority === 'high' ? 'Hoch' : item.priority === 'medium' ? 'Mittel' : 'Niedrig'}
                  </span>
                  <span className="checklists__item-due">
                    Fällig: {new Date(item.dueDate).toLocaleDateString('de-DE')}
                  </span>
                  <span className="checklists__item-assigned">
                    Zugewiesen an: {item.assignedTo}
                  </span>
                </div>
              </div>
              <div className="checklists__item-actions">
                <button
                  className="checklists__button checklists__button--secondary"
                  onClick={() => handleEditItem(item)}
                >
                  Bearbeiten
                </button>
                <button
                  className="checklists__button checklists__button--secondary"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  Löschen
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {showModal && (
        <div className="checklists__modal">
          <div className="checklists__modal-content">
            <div className="checklists__modal-header">
              <h2>{currentItem.id ? 'Aufgabe bearbeiten' : 'Neue Aufgabe'}</h2>
              <button
                className="checklists__modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="checklists__form-group">
                <label htmlFor="title">Titel</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={currentItem.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="checklists__form-group">
                <label htmlFor="description">Beschreibung</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={currentItem.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="checklists__form-group">
                <label htmlFor="dueDate">Fälligkeitsdatum</label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={currentItem.dueDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="checklists__form-group">
                <label htmlFor="priority">Priorität</label>
                <select
                  id="priority"
                  name="priority"
                  value={currentItem.priority}
                  onChange={handleInputChange}
                >
                  <option value="high">Hoch</option>
                  <option value="medium">Mittel</option>
                  <option value="low">Niedrig</option>
                </select>
              </div>
              <div className="checklists__form-group">
                <label htmlFor="assignedTo">Zugewiesen an</label>
                <input
                  type="text"
                  id="assignedTo"
                  name="assignedTo"
                  value={currentItem.assignedTo}
                  onChange={handleInputChange}
                />
              </div>
              <div className="checklists__form-group">
                <label htmlFor="category">Kategorie</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={currentItem.category}
                  onChange={handleInputChange}
                />
              </div>
              <div className="checklists__form-group">
                <label>
                  <input
                    type="checkbox"
                    name="completed"
                    checked={currentItem.completed}
                    onChange={handleInputChange}
                  />
                  Abgeschlossen
                </label>
              </div>
              <div className="checklists__form-actions">
                <button
                  type="button"
                  className="checklists__button checklists__button--secondary"
                  onClick={() => setShowModal(false)}
                >
                  Abbrechen
                </button>
                <button type="submit" className="checklists__button">
                  Speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .checklists {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .checklists__tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin: 2rem 0;
        }
        
        .checklists__tab {
          padding: 0.5rem 1rem;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .checklists__tab:hover {
          color: #ffbd00;
        }
        
        .checklists__tab--active {
          border-bottom: 2px solid #ffbd00;
          color: #ffbd00;
          font-weight: 500;
        }
        
        .checklists__list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .checklists__empty {
          padding: 2rem;
          text-align: center;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .checklists__item {
          display: flex;
          gap: 1rem;
          background-color: white;
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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
