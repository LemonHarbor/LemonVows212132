"use client";

import React, { useState, useEffect } from 'react';

interface MoodboardProps {
  // Props can be added as needed
}

interface MoodboardItem {
  id: string;
  type: 'image' | 'color' | 'text';
  content: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
}

export const Moodboard: React.FC<MoodboardProps> = () => {
  const [items, setItems] = useState<MoodboardItem[]>([
    {
      id: 'item-1',
      type: 'image',
      content: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      positionX: 100,
      positionY: 100,
      width: 200,
      height: 150,
      rotation: 0,
      zIndex: 1
    },
    {
      id: 'item-2',
      type: 'color',
      content: '#FFD1DC', // Pastel pink
      positionX: 350,
      positionY: 150,
      width: 100,
      height: 100,
      rotation: 0,
      zIndex: 2
    },
    {
      id: 'item-3',
      type: 'text',
      content: 'Romantisch & Elegant',
      positionX: 150,
      positionY: 300,
      width: 200,
      height: 50,
      rotation: 0,
      zIndex: 3
    },
    {
      id: 'item-4',
      type: 'image',
      content: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
      positionX: 400,
      positionY: 250,
      width: 180,
      height: 120,
      rotation: -5,
      zIndex: 4
    },
    {
      id: 'item-5',
      type: 'color',
      content: '#B0E0E6', // Powder blue
      positionX: 500,
      positionY: 100,
      width: 80,
      height: 80,
      rotation: 0,
      zIndex: 5
    }
  ]);
  
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItemType, setNewItemType] = useState<'image' | 'color' | 'text'>('image');
  const [newItemContent, setNewItemContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Handle item selection
  const handleItemClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedItem(id);
    
    // Bring selected item to front
    setItems(prev => {
      const maxZIndex = Math.max(...prev.map(item => item.zIndex));
      return prev.map(item => {
        if (item.id === id) {
          return { ...item, zIndex: maxZIndex + 1 };
        }
        return item;
      });
    });
  };
  
  // Handle drag start
  const handleDragStart = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const item = items.find(item => item.id === id);
    if (!item) return;
    
    // Calculate offset from mouse position to item position
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setDraggedItem(id);
    setDragOffset({ x: offsetX, y: offsetY });
  };
  
  // Handle drag
  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!draggedItem) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;
    
    // Update item position
    setItems(prev => prev.map(item => {
      if (item.id === draggedItem) {
        return { ...item, positionX: x, positionY: y };
      }
      return item;
    }));
  };
  
  // Handle drag end
  const handleCanvasMouseUp = () => {
    setDraggedItem(null);
  };
  
  // Handle canvas click (deselect)
  const handleCanvasClick = () => {
    setSelectedItem(null);
  };
  
  // Handle item deletion
  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    setSelectedItem(null);
  };
  
  // Handle item rotation
  const handleRotateItem = (id: string, direction: 'left' | 'right') => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const rotationChange = direction === 'left' ? -15 : 15;
        return { ...item, rotation: item.rotation + rotationChange };
      }
      return item;
    }));
  };
  
  // Handle item resize
  const handleResizeItem = (id: string, change: { width?: number, height?: number }) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { 
          ...item, 
          width: change.width ? Math.max(50, item.width + change.width) : item.width,
          height: change.height ? Math.max(50, item.height + change.height) : item.height
        };
      }
      return item;
    }));
  };
  
  // Handle add new item
  const handleAddItem = () => {
    if (!newItemContent) {
      setError('Bitte geben Sie einen Inhalt ein.');
      return;
    }
    
    // Validate content based on type
    if (newItemType === 'image' && !newItemContent.startsWith('http')) {
      setError('Bitte geben Sie eine gültige Bild-URL ein.');
      return;
    }
    
    if (newItemType === 'color' && !newItemContent.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
      setError('Bitte geben Sie einen gültigen Hex-Farbcode ein (z.B. #FF5733).');
      return;
    }
    
    // Create new item
    const newItem: MoodboardItem = {
      id: `item-${Date.now()}`,
      type: newItemType,
      content: newItemContent,
      positionX: Math.random() * 400 + 100,
      positionY: Math.random() * 300 + 100,
      width: newItemType === 'text' ? 200 : 150,
      height: newItemType === 'text' ? 50 : 150,
      rotation: 0,
      zIndex: Math.max(...items.map(item => item.zIndex), 0) + 1
    };
    
    setItems(prev => [...prev, newItem]);
    setNewItemType('image');
    setNewItemContent('');
    setShowAddItemModal(false);
    setError(null);
  };
  
  // Handle export moodboard
  const handleExportMoodboard = () => {
    alert('Diese Funktion würde das Moodboard als Bild exportieren.');
  };
  
  return (
    <div className="moodboard">
      <div className="moodboard__demo-notice">
        <p>Dies ist eine funktionale Demo-Version des Moodboards. Sie können:</p>
        <ul>
          <li>Elemente per Drag & Drop verschieben</li>
          <li>Bilder, Farben und Texte hinzufügen</li>
          <li>Elemente drehen und in der Größe ändern</li>
          <li>Das fertige Moodboard exportieren</li>
        </ul>
      </div>
      
      {error && (
        <div className="moodboard__error">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Schließen</button>
        </div>
      )}
      
      <div 
        className="moodboard__canvas"
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
        onClick={handleCanvasClick}
      >
        {items.map(item => (
          <div 
            key={item.id}
            className={`moodboard__item ${selectedItem === item.id ? 'moodboard__item--selected' : ''}`}
            style={{
              left: `${item.positionX}px`,
              top: `${item.positionY}px`,
              width: `${item.width}px`,
              height: `${item.height}px`,
              transform: `rotate(${item.rotation}deg)`,
              zIndex: item.zIndex,
              cursor: draggedItem === item.id ? 'grabbing' : 'grab'
            }}
            onClick={(e) => handleItemClick(item.id, e)}
            onMouseDown={(e) => handleDragStart(item.id, e)}
          >
            {item.type === 'image' && (
              <img 
                src={item.content} 
                alt="Moodboard item" 
                className="moodboard__item-image"
                draggable="false"
              />
            )}
            
            {item.type === 'color' && (
              <div 
                className="moodboard__item-color"
                style={{ backgroundColor: item.content }}
              ></div>
            )}
            
            {item.type === 'text' && (
              <div className="moodboard__item-text">
                {item.content}
              </div>
            )}
            
            {selectedItem === item.id && (
              <div className="moodboard__item-controls">
                <button 
                  className="moodboard__item-control moodboard__item-control--rotate-left"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRotateItem(item.id, 'left');
                  }}
                >
                  ↺
                </button>
                <button 
                  className="moodboard__item-control moodboard__item-control--rotate-right"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRotateItem(item.id, 'right');
                  }}
                >
                  ↻
                </button>
                <button 
                  className="moodboard__item-control moodboard__item-control--delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteItem(item.id);
                  }}
                >
                  ×
                </button>
                <button 
                  className="moodboard__item-control moodboard__item-control--resize-larger"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResizeItem(item.id, { width: 20, height: 20 });
                  }}
                >
                  +
                </button>
                <button 
                  className="moodboard__item-control moodboard__item-control--resize-smaller"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResizeItem(item.id, { width: -20, height: -20 });
                  }}
                >
                  -
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="moodboard__controls">
        <button 
          className="moodboard__button"
          onClick={() => setShowAddItemModal(true)}
        >
          Element hinzufügen
        </button>
        <button 
          className="moodboard__button"
          onClick={handleExportMoodboard}
        >
          Als Bild exportieren
        </button>
      </div>
      
      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="moodboard__modal">
          <div className="moodboard__modal-content">
            <div className="moodboard__modal-header">
              <h2>Element hinzufügen</h2>
              <button 
                className="moodboard__modal-close"
                onClick={() => {
                  setShowAddItemModal(false);
                  setError(null);
                }}
              >
                &times;
              </button>
            </div>
            <div className="moodboard__modal-body">
              <div className="moodboard__form-group">
                <label>Elementtyp</label>
                <div className="moodboard__radio-group">
                  <label className="moodboard__radio-label">
                    <input 
                      type="radio" 
                      name="itemType" 
                      value="image" 
                      checked={newItemType === 'image'} 
                      onChange={() => setNewItemType('image')}
                    />
                    Bild
                  </label>
                  <label className="moodboard__radio-label">
                    <input 
                      type="radio" 
                      name="itemType" 
                      value="color" 
                      checked={newItemType === 'color'} 
                      onChange={() => setNewItemType('color')}
                    />
                    Farbe
                  </label>
                  <label className="moodboard__radio-label">
                    <input 
                      type="radio" 
                      name="itemType" 
                      value="text" 
                      checked={newItemType === 'text'} 
                      onChange={() => setNewItemType('text')}
                    />
                    Text
                  </label>
                </div>
              </div>
              
              <div className="moodboard__form-group">
                <label>
                  {newItemType === 'image' && 'Bild-URL'}
                  {newItemType === 'color' && 'Farbcode (Hex)'}
                  {newItemType === 'text' && 'Text'}
                </label>
                <input 
                  type="text" 
                  value={newItemContent} 
                  onChange={(e) => setNewItemContent(e.target.value)}
                  placeholder={
                    newItemType === 'image' ? 'https://example.com/image.jpg' : 
                    newItemType === 'color' ? '#FF5733' : 
                    'Ihr Text hier'
                  }
                />
                {newItemType === 'color' && (
                  <input 
                    type="color" 
                    value={newItemContent || '#FF5733'} 
                    onChange={(e) => setNewItemContent(e.target.value)}
                    className="moodboard__color-picker"
                  />
                )}
              </div>
              
              <div className="moodboard__form-actions">
                <button 
                  className="moodboard__button moodboard__button--secondary"
                  onClick={() => {
                    setShowAddItemModal(false);
                    setError(null);
                  }}
                >
                  Abbrechen
                </button>
                <button 
                  className="moodboard__button"
                  onClick={handleAddItem}
                >
                  Hinzufügen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .moodboard {
          padding: 2rem;
          background-color: #f9f9f9;
          border-radius: 8px;
        }
        
        .moodboard__demo-notice {
          background-color: #fff3cd;
          border: 1px solid #ffeeba;
          border-radius: 4px;
          padding: 1rem;
          margin-bottom: 2rem;
        }
        
        .moodboard__demo-notice p {
          margin-top: 0;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .moodboard__demo-notice ul {
          margin: 0;
          padding-left: 1.5rem;
        }
        
        .moodboard__error {
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 4px;
          padding: 1rem;
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .moodboard__error p {
          margin: 0;
          color: #721c24;
        }
        
        .moodboard__error button {
          background: none;
          border: none;
          color: #721c24;
          font-weight: bold;
          cursor: pointer;
        }
        
        .moodboard__canvas {
          position: relative;
          width: 100%;
          height: 600px;
          background-color: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin-bottom: 2rem;
          overflow: hidden;
        }
        
        .moodboard__item {
          position: absolute;
          transform-origin: center center;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.2s ease;
          overflow: hidden;
        }
        
        .moodboard__item--selected {
          box-shadow: 0 0 0 2px #ffbd00, 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        
        .moodboard__item-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
        }
        
        .moodboard__item-color {
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        
        .moodboard__item-text {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-size: 1.2rem;
          font-weight: 500;
          color: #333;
          background-color: rgba(255, 255, 255, 0.8);
          padding: 0.5rem;
          pointer-events: none;
        }
        
        .moodboard__item-controls {
          position: absolute;
          top: -30px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .moodboard__item-control {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: white;
          border: 1px solid #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .moodboard__item-control:hover {
          background-color: #f0f0f0;
        }
        
        .moodboard__item-control--delete {
          background-color: #f8d7da;
          border-color: #f5c6cb;
          color: #721c24;
        }
        
        .moodboard__item-control--delete:hover {
          background-color: #f5c6cb;
        }
        
        .moodboard__controls {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .moodboard__button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          background-color: #ffbd00;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .moodboard__button:hover {
          background-color: #e6a800;
        }
        
        .moodboard__button--secondary {
          background-color: #f8f9fa;
          color: #6c757d;
        }
        
        .moodboard__button--secondary:hover {
          background-color: #e2e6ea;
        }
        
        .moodboard__modal {
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
        
        .moodboard__modal-content {
          background-color: white;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .moodboard__modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #eee;
        }
        
        .moodboard__modal-header h2 {
          margin: 0;
          font-size: 1.25rem;
        }
        
        .moodboard__modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
        }
        
        .moodboard__modal-body {
          padding: 1.5rem;
        }
        
        .moodboard__form-group {
          margin-bottom: 1.5rem;
        }
        
        .moodboard__form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .moodboard__form-group input[type="text"] {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .moodboard__radio-group {
          display: flex;
          gap: 1rem;
        }
        
        .moodboard__radio-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }
        
        .moodboard__color-picker {
          display: block;
          width: 100%;
          height: 40px;
          margin-top: 0.5rem;
          padding: 0;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .moodboard__form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        
        @media (max-width: 768px) {
          .moodboard__canvas {
            height: 400px;
          }
          
          .moodboard__controls {
            flex-direction: column;
          }
          
          .moodboard__radio-group {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .moodboard__form-actions {
            flex-direction: column;
          }
          
          .moodboard__form-actions button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Moodboard;
