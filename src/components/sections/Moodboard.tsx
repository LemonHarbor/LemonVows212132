import React from 'react';
import { useTranslation } from 'next-i18next';
import { Button } from '@/components/ui/Button';

interface MoodboardItem {
  id: string;
  type: 'image' | 'color' | 'text';
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  zIndex: number;
}

interface MoodboardCollection {
  id: string;
  name: string;
  items: MoodboardItem[];
}

const Moodboard: React.FC = () => {
  const { t } = useTranslation('common');
  const [collections, setCollections] = React.useState<MoodboardCollection[]>([]);
  const [activeCollection, setActiveCollection] = React.useState<string | null>(null);
  const [selectedItem, setSelectedItem] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isResizing, setIsResizing] = React.useState(false);
  const [showAddItemModal, setShowAddItemModal] = React.useState(false);
  const [showAddCollectionModal, setShowAddCollectionModal] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState('');
  const [colorValue, setColorValue] = React.useState('#FFFFFF');
  const [textValue, setTextValue] = React.useState('');
  const [itemType, setItemType] = React.useState<'image' | 'color' | 'text'>('image');
  
  const canvasRef = React.useRef<HTMLDivElement>(null);

  // Initialisiere eine Standardsammlung, wenn keine vorhanden ist
  React.useEffect(() => {
    if (collections.length === 0) {
      const defaultCollection: MoodboardCollection = {
        id: 'collection-1',
        name: t('moodboard.defaultCollection'),
        items: []
      };
      setCollections([defaultCollection]);
      setActiveCollection(defaultCollection.id);
    }
  }, [t]);

  // Aktive Sammlung
  const getActiveCollection = React.useMemo(() => {
    if (!activeCollection) return null;
    return collections.find(collection => collection.id === activeCollection) || null;
  }, [collections, activeCollection]);

  // Ausgewähltes Element
  const getSelectedItem = React.useMemo(() => {
    if (!selectedItem || !getActiveCollection) return null;
    return getActiveCollection.items.find(item => item.id === selectedItem) || null;
  }, [getActiveCollection, selectedItem]);

  // Sammlung hinzufügen
  const addCollection = (name: string) => {
    const newCollection: MoodboardCollection = {
      id: `collection-${Date.now()}`,
      name,
      items: []
    };
    setCollections([...collections, newCollection]);
    setActiveCollection(newCollection.id);
    setShowAddCollectionModal(false);
  };

  // Sammlung löschen
  const deleteCollection = (collectionId: string) => {
    if (collections.length <= 1) {
      alert(t('moodboard.cannotDeleteLastCollection'));
      return;
    }
    
    if (window.confirm(t('moodboard.confirmDeleteCollection'))) {
      const newCollections = collections.filter(collection => collection.id !== collectionId);
      setCollections(newCollections);
      
      if (activeCollection === collectionId) {
        setActiveCollection(newCollections[0].id);
      }
    }
  };

  // Element hinzufügen
  const addItem = () => {
    if (!getActiveCollection) return;
    
    let content = '';
    switch (itemType) {
      case 'image':
        content = imageUrl;
        break;
      case 'color':
        content = colorValue;
        break;
      case 'text':
        content = textValue;
        break;
    }
    
    if (!content) {
      alert(t('moodboard.pleaseEnterContent'));
      return;
    }
    
    const newItem: MoodboardItem = {
      id: `item-${Date.now()}`,
      type: itemType,
      content,
      position: { x: 100, y: 100 },
      size: { width: 200, height: itemType === 'text' ? 100 : 200 },
      rotation: 0,
      zIndex: getActiveCollection.items.length + 1
    };
    
    const updatedCollections = collections.map(collection => 
      collection.id === activeCollection
        ? { ...collection, items: [...collection.items, newItem] }
        : collection
    );
    
    setCollections(updatedCollections);
    setSelectedItem(newItem.id);
    setShowAddItemModal(false);
    
    // Zurücksetzen der Eingabefelder
    setImageUrl('');
    setColorValue('#FFFFFF');
    setTextValue('');
  };

  // Element löschen
  const deleteItem = (itemId: string) => {
    if (!getActiveCollection) return;
    
    if (window.confirm(t('moodboard.confirmDeleteItem'))) {
      const updatedCollections = collections.map(collection => 
        collection.id === activeCollection
          ? { 
              ...collection, 
              items: collection.items.filter(item => item.id !== itemId) 
            }
          : collection
      );
      
      setCollections(updatedCollections);
      
      if (selectedItem === itemId) {
        setSelectedItem(null);
      }
    }
  };

  // Element auswählen
  const selectItem = (itemId: string) => {
    setSelectedItem(itemId);
  };

  // Element-Drag starten
  const startDrag = (e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    selectItem(itemId);
    
    if (isResizing) return;
    
    setIsDragging(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    
    if (!getActiveCollection) return;
    
    const item = getActiveCollection.items.find(item => item.id === itemId);
    if (!item) return;
    
    const startPosition = { ...item.position };
    
    // Bring item to front
    const updatedCollections = collections.map(collection => 
      collection.id === activeCollection
        ? { 
            ...collection, 
            items: collection.items.map(i => 
              i.id === itemId 
                ? { ...i, zIndex: Math.max(...collection.items.map(item => item.zIndex)) + 1 }
                : i
            ) 
          }
        : collection
    );
    
    setCollections(updatedCollections);
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging) return;
      
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      
      setCollections(prevCollections => 
        prevCollections.map(collection => 
          collection.id === activeCollection
            ? { 
                ...collection, 
                items: collection.items.map(i => 
                  i.id === itemId 
                    ? { 
                        ...i, 
                        position: { 
                          x: startPosition.x + dx, 
                          y: startPosition.y + dy 
                        } 
                      } 
                    : i
                ) 
              }
            : collection
        )
      );
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Element-Resize starten
  const startResize = (e: React.MouseEvent, itemId: string, corner: 'se' | 'sw' | 'ne' | 'nw') => {
    e.preventDefault();
    e.stopPropagation();
    
    selectItem(itemId);
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    
    if (!getActiveCollection) return;
    
    const item = getActiveCollection.items.find(item => item.id === itemId);
    if (!item) return;
    
    const startSize = { ...item.size };
    const startPosition = { ...item.position };
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isResizing) return;
      
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      
      let newWidth = startSize.width;
      let newHeight = startSize.height;
      let newX = startPosition.x;
      let newY = startPosition.y;
      
      switch (corner) {
        case 'se':
          newWidth = Math.max(50, startSize.width + dx);
          newHeight = Math.max(50, startSize.height + dy);
          break;
        case 'sw':
          newWidth = Math.max(50, startSize.width - dx);
          newHeight = Math.max(50, startSize.height + dy);
          newX = startPosition.x + dx;
          break;
        case 'ne':
          newWidth = Math.max(50, startSize.width + dx);
          newHeight = Math.max(50, startSize.height - dy);
          newY = startPosition.y + dy;
          break;
        case 'nw':
          newWidth = Math.max(50, startSize.width - dx);
          newHeight = Math.max(50, startSize.height - dy);
          newX = startPosition.x + dx;
          newY = startPosition.y + dy;
          break;
      }
      
      setCollections(prevCollections => 
        prevCollections.map(collection => 
          collection.id === activeCollection
            ? { 
                ...collection, 
                items: collection.items.map(i => 
                  i.id === itemId 
                    ? { 
                        ...i, 
                        size: { width: newWidth, height: newHeight },
                        position: { x: newX, y: newY }
                      } 
                    : i
                ) 
              }
            : collection
        )
      );
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Element rotieren
  const rotateItem = (itemId: string, angle: number) => {
    if (!getActiveCollection) return;
    
    setCollections(prevCollections => 
      prevCollections.map(collection => 
        collection.id === activeCollection
          ? { 
              ...collection, 
              items: collection.items.map(item => 
                item.id === itemId 
                  ? { ...item, rotation: item.rotation + angle } 
                  : item
              ) 
            }
          : collection
      )
    );
  };

  // Moodboard exportieren
  const exportMoodboard = () => {
    // Hier könnte man das Moodboard als Bild exportieren
    console.log('Exporting moodboard', getActiveCollection);
    alert(t('moodboard.exportSuccess'));
  };

  // Moodboard aus Pinterest importieren
  const importFromPinterest = () => {
    // Hier könnte man eine Integration mit Pinterest implementieren
    alert(t('moodboard.pinterestIntegrationNotImplemented'));
  };

  // Farbanalyse durchführen
  const analyzeColors = () => {
    // Hier könnte man eine Farbanalyse der Bilder im Moodboard durchführen
    alert(t('moodboard.colorAnalysisNotImplemented'));
  };

  return (
    <div className="moodboard">
      <div className="moodboard__header">
        <h1>{t('moodboard.title')}</h1>
        <p>{t('moodboard.description')}</p>
        
        <div className="moodboard__controls">
          <div className="moodboard__collections">
            <select 
              value={activeCollection || ''}
              onChange={(e) => setActiveCollection(e.target.value)}
              className="select"
            >
              {collections.map(collection => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>
            
            <Button 
              variant="secondary"
              onClick={() => setShowAddCollectionModal(true)}
            >
              {t('moodboard.newCollection')}
            </Button>
            
            {collections.length > 1 && (
              <Button 
                variant="secondary"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => activeCollection && deleteCollection(activeCollection)}
              >
                {t('moodboard.deleteCollection')}
              </Button>
            )}
          </div>
          
          <div className="moodboard__actions">
            <Button onClick={() => setShowAddItemModal(true)}>
              {t('moodboard.addItem')}
            </Button>
            
            <Button 
              variant="secondary"
              onClick={exportMoodboard}
            >
              {t('moodboard.export')}
            </Button>
            
            <Button 
              variant="secondary"
              onClick={importFromPinterest}
            >
              {t('moodboard.importFromPinterest')}
            </Button>
            
            <Button 
              variant="secondary"
              onClick={analyzeColors}
            >
              {t('moodboard.analyzeColors')}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="moodboard__canvas-container">
        <div 
          className="moodboard__canvas"
          ref={canvasRef}
          onClick={() => setSelectedItem(null)}
        >
          {getActiveCollection && getActiveCollection.items.map(item => (
            <div 
              key={item.id}
              className={`moodboard__item moodboard__item--${item.type} ${selectedItem === item.id ? 'selected' : ''}`}
              style={{
                left: `${item.position.x}px`,
                top: `${item.position.y}px`,
                width: `${item.size.width}px`,
                height: `${item.size.height}px`,
                transform: `rotate(${item.rotation}deg)`,
                zIndex: item.zIndex
              }}
              onClick={(e) => {
                e.stopPropagation();
                selectItem(item.id);
              }}
              onMouseDown={(e) => startDrag(e, item.id)}
            >
              {item.type === 'image' && (
                <img 
                  src={item.content} 
                  alt="Moodboard item" 
                  className="moodboard__item-content"
                />
              )}
              
              {item.type === 'color' && (
                <div 
                  className="moodboard__item-content"
                  style={{ backgroundColor: item.content }}
                ></div>
              )}
              
              {item.type === 'text' && (
                <div className="moodboard__item-content moodboard__text-content">
                  {item.content}
                </div>
              )}
              
              {selectedItem === item.id && (
                <>
                  <div 
                    className="moodboard__resize-handle moodboard__resize-handle--nw"
                    onMouseDown={(e) => startResize(e, item.id, 'nw')}
                  ></div>
                  <div 
                    className="moodboard__resize-handle moodboard__resize-handle--ne"
                    onMouseDown={(e) => startResize(e, item.id, 'ne')}
                  ></div>
                  <div 
                    className="moodboard__resize-handle moodboard__resize-handle--sw"
                    onMouseDown={(e) => startResize(e, item.id, 'sw')}
                  ></div>
                  <div 
                    className="moodboard__resize-handle moodboard__resize-handle--se"
                    onMouseDown={(e) => startResize(e, item.id, 'se')}
                  ></div>
                  
                  <div className="moodboard__item-controls">
                    <button 
                      className="moodboard__item-control"
                      onClick={(e) => {
                        e.stopPropagation();
                        rotateItem(item.id, -15);
                      }}
                    >
                      <span role="img" aria-label="Rotate Left">↺</span>
                    </button>
                    
                    <button 
                      className="moodboard__item-control"
                      onClick={(e) => {
                        e.stopPropagation();
                        rotateItem(item.id, 15);
                      }}
                    >
                      <span role="img" aria-label="Rotate Right">↻</span>
                    </button>
                    
                    <button 
                      className="moodboard__item-control"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteItem(item.id);
                      }}
                    >
                      <span role="img" aria-label="Delete">🗑️</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Modals */}
      {showAddItemModal && (
        <div className="moodboard__modal">
          <div className="moodboard__modal-content">
            <h3>{t('moodboard.addItem')}</h3>
            
            <div className="moodboard__modal-form">
              <div className="moodboard__form-group">
                <label>{t('moodboard.itemType')}</label>
                <div className="moodboard__radio-group">
                  <label>
                    <input 
                      type="radio"
                      name="itemType"
                      value="image"
                      checked={itemType === 'image'}
                      onChange={() => setItemType('image')}
                    />
                    {t('moodboard.image')}
                  </label>
                  
                  <label>
                    <input 
                      type="radio"
                      name="itemType"
                      value="color"
                      checked={itemType === 'color'}
                      onChange={() => setItemType('color')}
                    />
                    {t('moodboard.color')}
                  </label>
                  
                  <label>
                    <input 
                      type="radio"
                      name="itemType"
                      value="text"
                      checked={itemType === 'text'}
                      onChange={() => setItemType('text')}
                    />
                    {t('moodboard.text')}
                  </label>
                </div>
              </div>
              
              {itemType === 'image' && (
                <div className="moodboard__form-group">
                  <label>{t('moodboard.imageUrl')}</label>
                  <input 
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="input"
                  />
                </div>
              )}
              
              {itemType === 'color' && (
                <div className="moodboard__form-group">
                  <label>{t('moodboard.color')}</label>
                  <input 
                    type="color"
                    value={colorValue}
                    onChange={(e) => setColorValue(e.target.value)}
                    className="input"
                  />
                </div>
              )}
              
              {itemType === 'text' && (
                <div className="moodboard__form-group">
                  <label>{t('moodboard.text')}</label>
                  <textarea 
                    value={textValue}
                    onChange={(e) => setTextValue(e.target.value)}
                    placeholder={t('moodboard.enterText')}
                    className="textarea"
                  ></textarea>
                </div>
              )}
            </div>
            
            <div className="moodboard__modal-actions">
              <Button onClick={addItem}>
                {t('moodboard.add')}
              </Button>
              
              <Button 
                variant="secondary"
                onClick={() => setShowAddItemModal(false)}
              >
                {t('moodboard.cancel')}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {showAddCollectionModal && (
        <div className="moodboard__modal">
          <div className="moodboard__modal-content">
            <h3>{t('moodboard.newCollection')}</h3>
            
            <div className="moodboard__modal-form">
              <div className="moodboard__form-group">
                <label>{t('moodboard.collectionName')}</label>
                <input 
                  type="text"
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  placeholder={t('moodboard.enterCollectionName')}
                  className="input"
                />
              </div>
            </div>
            
            <div className="moodboard__modal-actions">
              <Button 
                onClick={() => {
                  if (textValue.trim()) {
                    addCollection(textValue);
                    setTextValue('');
                  } else {
                    alert(t('moodboard.pleaseEnterName'));
                  }
                }}
              >
                {t('moodboard.create')}
              </Button>
              
              <Button 
                variant="secondary"
                onClick={() => {
                  setShowAddCollectionModal(false);
                  setTextValue('');
                }}
              >
                {t('moodboard.cancel')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Moodboard;
