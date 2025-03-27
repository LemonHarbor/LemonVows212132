import React from 'react';
import { useTranslation } from 'next-i18next';
import { Button } from '@/components/ui/Button';

interface TableProps {
  id: string;
  name: string;
  shape: 'round' | 'rectangular' | 'square' | 'oval' | 'custom';
  capacity: number;
  rotation: number;
  position: { x: number; y: number };
  seats: Array<{
    id: string;
    guestId?: string;
  }>;
}

interface GuestProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  group: string;
  rsvpStatus: 'confirmed' | 'pending' | 'declined';
  dietaryRestrictions?: string[];
  plusOne?: boolean;
  plusOneName?: string;
  notes?: string;
}

const TablePlanner: React.FC = () => {
  const { t } = useTranslation('common');
  const [tables, setTables] = React.useState<TableProps[]>([]);
  const [guests, setGuests] = React.useState<GuestProps[]>([]);
  const [selectedTable, setSelectedTable] = React.useState<string | null>(null);
  const [selectedSeat, setSelectedSeat] = React.useState<string | null>(null);
  const [selectedGuest, setSelectedGuest] = React.useState<string | null>(null);
  const [selectedTableShape, setSelectedTableShape] = React.useState<TableProps['shape']>('round');
  const [selectedTableCapacity, setSelectedTableCapacity] = React.useState(8);
  const [guestSearch, setGuestSearch] = React.useState('');
  const [isDragging, setIsDragging] = React.useState(false);
  const [draggedGuest, setDraggedGuest] = React.useState<string | null>(null);
  
  const canvasRef = React.useRef<HTMLDivElement>(null);

  // Gruppiere Gäste nach Gruppen
  const guestGroups = React.useMemo(() => {
    const groups = new Set(guests.map(guest => guest.group));
    return Array.from(groups).map(name => ({ name }));
  }, [guests]);

  // Gefilterte Gäste basierend auf Suchbegriff
  const filteredGuests = React.useMemo(() => {
    if (!guestSearch) return guests;
    const search = guestSearch.toLowerCase();
    return guests.filter(
      guest => 
        guest.firstName.toLowerCase().includes(search) || 
        guest.lastName.toLowerCase().includes(search) ||
        guest.email.toLowerCase().includes(search) ||
        guest.group.toLowerCase().includes(search)
    );
  }, [guests, guestSearch]);

  // Ausgewählter Tisch
  const getSelectedTable = React.useMemo(() => {
    if (!selectedTable) return null;
    return tables.find(table => table.id === selectedTable) || null;
  }, [tables, selectedTable]);

  // Ausgewählter Gast
  const getSelectedGuest = React.useMemo(() => {
    if (!selectedGuest) return null;
    return guests.find(guest => guest.id === selectedGuest) || null;
  }, [guests, selectedGuest]);

  // Tisch hinzufügen
  const addTable = () => {
    const newTable: TableProps = {
      id: `table-${Date.now()}`,
      name: `${t('tablePlanner.shapes.' + selectedTableShape)} ${tables.length + 1}`,
      shape: selectedTableShape,
      capacity: selectedTableCapacity,
      rotation: 0,
      position: { x: 100, y: 100 },
      seats: Array.from({ length: selectedTableCapacity }, (_, i) => ({
        id: `seat-${Date.now()}-${i}`,
      })),
    };
    setTables([...tables, newTable]);
    setSelectedTable(newTable.id);
  };

  // Tisch löschen
  const deleteTable = (tableId: string) => {
    setTables(tables.filter(table => table.id !== tableId));
    if (selectedTable === tableId) {
      setSelectedTable(null);
    }
  };

  // Tisch auswählen
  const selectTable = (tableId: string) => {
    setSelectedTable(tableId);
    setSelectedSeat(null);
    setSelectedGuest(null);
  };

  // Sitzplatz auswählen
  const selectSeat = (tableId: string, seatIndex: number) => {
    setSelectedSeat(`${tableId}-${seatIndex}`);
    setSelectedTable(tableId);
    
    const table = tables.find(t => t.id === tableId);
    if (table && table.seats[seatIndex].guestId) {
      setSelectedGuest(table.seats[seatIndex].guestId);
    } else {
      setSelectedGuest(null);
    }
  };

  // Gast auswählen
  const selectGuest = (guestId: string) => {
    setSelectedGuest(guestId);
    setSelectedTable(null);
    setSelectedSeat(null);
  };

  // Gast-Drag starten
  const startGuestDrag = (e: React.DragEvent, guestId: string) => {
    e.dataTransfer.setData('guestId', guestId);
    setDraggedGuest(guestId);
    setIsDragging(true);
  };

  // Tisch-Drag starten
  const startDrag = (e: React.MouseEvent, tableId: string) => {
    e.preventDefault();
    selectTable(tableId);
    
    const startX = e.clientX;
    const startY = e.clientY;
    
    const table = tables.find(t => t.id === tableId);
    if (!table) return;
    
    const startPosition = { ...table.position };
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      
      setTables(prevTables => 
        prevTables.map(t => 
          t.id === tableId 
            ? { 
                ...t, 
                position: { 
                  x: startPosition.x + dx, 
                  y: startPosition.y + dy 
                } 
              } 
            : t
        )
      );
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Tischstil berechnen
  const getTableStyle = (table: TableProps) => {
    let width, height;
    
    switch (table.shape) {
      case 'round':
      case 'oval':
        width = table.capacity * 20;
        height = table.shape === 'oval' ? width * 0.7 : width;
        break;
      case 'rectangular':
        width = table.capacity * 15;
        height = width * 0.5;
        break;
      case 'square':
        width = table.capacity * 12;
        height = width;
        break;
      case 'custom':
        width = table.capacity * 18;
        height = table.capacity * 18;
        break;
      default:
        width = 150;
        height = 150;
    }
    
    return {
      width: `${width}px`,
      height: `${height}px`,
      transform: `translate(${table.position.x}px, ${table.position.y}px) rotate(${table.rotation}deg)`,
    };
  };

  // Sitzplätze für einen Tisch berechnen
  const getTableSeats = (table: TableProps) => {
    return table.seats;
  };

  // Sitzplatzstil berechnen
  const getSeatStyle = (table: TableProps, index: number, totalSeats: number) => {
    const angle = (index / totalSeats) * 2 * Math.PI;
    const radius = table.shape === 'round' || table.shape === 'oval' 
      ? (table.shape === 'oval' ? { x: table.capacity * 10, y: table.capacity * 7 } : table.capacity * 10)
      : Math.min(table.capacity * 6, Math.max(table.capacity * 3, 30));
    
    let x, y;
    
    if (table.shape === 'round') {
      x = Math.sin(angle) * radius;
      y = -Math.cos(angle) * radius;
    } else if (table.shape === 'oval') {
      x = Math.sin(angle) * radius.x;
      y = -Math.cos(angle) * radius.y;
    } else if (table.shape === 'rectangular' || table.shape === 'square') {
      // Verteile Sitze gleichmäßig um den rechteckigen/quadratischen Tisch
      const perSide = Math.ceil(totalSeats / 4);
      const sideIndex = Math.floor(index / perSide);
      const positionOnSide = index % perSide;
      const sideLength = table.shape === 'square' 
        ? radius 
        : (sideIndex % 2 === 0 ? radius * 2 : radius);
      const spacing = sideLength / (perSide || 1);
      
      switch (sideIndex) {
        case 0: // Oben
          x = -sideLength / 2 + positionOnSide * spacing;
          y = -radius;
          break;
        case 1: // Rechts
          x = radius;
          y = -radius + positionOnSide * spacing * 2;
          break;
        case 2: // Unten
          x = sideLength / 2 - positionOnSide * spacing;
          y = radius;
          break;
        case 3: // Links
          x = -radius;
          y = radius - positionOnSide * spacing * 2;
          break;
        default:
          x = 0;
          y = 0;
      }
    } else {
      // Fallback für custom
      x = Math.sin(angle) * radius;
      y = -Math.cos(angle) * radius;
    }
    
    return {
      transform: `translate(${x}px, ${y}px)`,
    };
  };

  // Gaststil berechnen
  const getGuestStyle = (guestId: string | undefined) => {
    if (!guestId) return {};
    
    const guest = guests.find(g => g.id === guestId);
    if (!guest) return {};
    
    // Hier könnte man Farben basierend auf der Gruppe oder anderen Eigenschaften setzen
    return {
      backgroundColor: getGroupColor(guest.group),
    };
  };

  // Gruppenfarbe berechnen
  const getGroupColor = (groupName: string) => {
    // Einfache Hash-Funktion für konsistente Farben
    let hash = 0;
    for (let i = 0; i < groupName.length; i++) {
      hash = groupName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Konvertiere zu Farbe
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 60%)`;
  };

  // Prüfen, ob ein Gast bereits einen Sitzplatz hat
  const isGuestSeated = (guestId: string) => {
    return tables.some(table => 
      table.seats.some(seat => seat.guestId === guestId)
    );
  };

  // Tischnamen für einen Gast finden
  const getGuestTableName = (guestId: string) => {
    for (const table of tables) {
      const seatIndex = table.seats.findIndex(seat => seat.guestId === guestId);
      if (seatIndex !== -1) {
        return table.name;
      }
    }
    return '';
  };

  // Tischplan exportieren
  const exportTablePlan = () => {
    // Hier könnte man den Tischplan als PDF, PNG oder CSV exportieren
    console.log('Exporting table plan', { tables, guests });
    alert(t('tablePlanner.exportSuccess'));
  };

  return (
    <div className="table-planner">
      <div className="table-planner__header">
        <h1>{t('tablePlanner.title')}</h1>
        <p>{t('tablePlanner.description')}</p>
        
        <div className="table-planner__controls">
          <Button onClick={addTable}>
            {t('tablePlanner.addTable')}
          </Button>
          
          <div className="table-planner__shape-selector">
            <label>{t('tablePlanner.tableShape')}</label>
            <select 
              value={selectedTableShape}
              onChange={(e) => setSelectedTableShape(e.target.value as TableProps['shape'])}
              className="select"
            >
              <option value="round">{t('tablePlanner.shapes.round')}</option>
              <option value="rectangular">{t('tablePlanner.shapes.rectangular')}</option>
              <option value="square">{t('tablePlanner.shapes.square')}</option>
              <option value="oval">{t('tablePlanner.shapes.oval')}</option>
              <option value="custom">{t('tablePlanner.shapes.custom')}</option>
            </select>
          </div>
          
          <div className="table-planner__capacity-selector">
            <label>{t('tablePlanner.capacity')}</label>
            <input 
              type="number" 
              value={selectedTableCapacity}
              onChange={(e) => setSelectedTableCapacity(parseInt(e.target.value, 10))}
              min="1" 
              max="20"
              className="input"
            />
          </div>
          
          <Button 
            variant="secondary"
            onClick={exportTablePlan}
          >
            {t('tablePlanner.export')}
          </Button>
        </div>
      </div>
      
      <div className="table-planner__content">
        <div className="table-planner__canvas" ref={canvasRef}>
          {tables.map(table => (
            <div 
              key={table.id}
              className={`table-planner__table table-planner__table--${table.shape} ${selectedTable === table.id ? 'table-planner__table--selected' : ''}`}
              style={getTableStyle(table)}
              onClick={() => selectTable(table.id)}
              onMouseDown={(e) => startDrag(e, table.id)}
            >
              <div className="table-planner__table-name">{table.name}</div>
              <div className="table-planner__table-capacity">{table.capacity}</div>
              
              {getTableSeats(table).map((seat, index) => (
                <div 
                  key={`${table.id}-seat-${index}`}
                  className={`table-planner__seat ${seat.guestId ? 'table-planner__seat--occupied' : ''} ${selectedSeat === `${table.id}-${index}` ? 'table-planner__seat--selected' : ''}`}
                  style={getSeatStyle(table, index, table.seats.length)}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectSeat(table.id, index);
                  }}
                >
                  {seat.guestId && (
                    <div className="table-planner__guest-indicator">
                      <div 
                        className="table-planner__guest-avatar"
                        style={getGuestStyle(seat.guestId)}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        
        <div className="table-planner__sidebar">
          <div className="table-planner__guests">
            <h3>{t('tablePlanner.guests')}</h3>
            
            <div className="table-planner__search">
              <input 
                type="text"
                value={guestSearch}
                onChange={(e) => setGuestSearch(e.target.value)}
                placeholder={t('tablePlanner.searchGuests')}
                className="input"
              />
            </div>
            
            <div className="table-planner__guest-groups">
              {guestGroups.map(group => (
                <div key={group.name} className="table-planner__guest-group">
                  <h4>{group.name}</h4>
                  
                  {filteredGuests
                    .filter(g => g.group === group.name)
                    .map(guest => (
                      <div 
                        key={guest.id}
                        className={`table-planner__guest-item ${isGuestSeated(guest.id) ? 'table-planner__guest-item--seated' : ''} ${selectedGuest === guest.id ? 'table-planner__guest-item--selected' : ''}`}
                        draggable
                        onDragStart={(e) => startGuestDrag(e, guest.id)}
                        onClick={() => selectGuest(guest.id)}
                      >
                        <div 
                          className="table-planner__guest-avatar"
                          style={getGuestStyle(guest.id)}
                        ></div>
                        
                        <div className="table-planner__guest-info">
                          <div className="table-planner__guest-name">
                            {guest.firstName} {guest.lastName}
                          </div>
                          
                          {guest.dietaryRestrictions && guest.dietaryRestrictions.length > 0 && (
                            <div className="table-planner__guest-dietary">
                              <span role="img" aria-label="Dietary Restrictions">⚠️</span>
                            </div>
                          )}
                        </div>
                        
                        {isGuestSeated(guest.id) && (
                          <div className="table-planner__guest-table">
                            {getGuestTableName(guest.id)}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
          
          {selectedTable && getSelectedTable && (
            <div className="table-planner__table-details">
              <h3>{t('tablePlanner.tableDetails')}</h3>
              
              <div className="table-planner__form-group">
                <label>{t('tablePlanner.tableName')}</label>
                <input 
                  type="text"
                  value={getSelectedTable.name}
                  onChange={(e) => {
                    setTables(tables.map(t => 
                      t.id === selectedTable 
                        ? { ...t, name: e.target.value } 
                        : t
                    ));
                  }}
                  className="input"
                />
              </div>
              
              <div className="table-planner__form-group">
                <label>{t('tablePlanner.tableShape')}</label>
                <select 
                  value={getSelectedTable.shape}
                  onChange={(e) => {
                    setTables(tables.map(t => 
                      t.id === selectedTable 
                        ? { ...t, shape: e.target.value as TableProps['shape'] } 
                        : t
                    ));
                  }}
                  className="select"
                >
                  <option value="round">{t('tablePlanner.shapes.round')}</option>
                  <option value="rectangular">{t('tablePlanner.shapes.rectangular')}</option>
                  <option value="square">{t('tablePlanner.shapes.square')}</option>
                  <option value="oval">{t('tablePlanner.shapes.oval')}</option>
                  <option value="custom">{t('tablePlanner.shapes.custom')}</option>
                </select>
              </div>
              
              <div className="table-planner__form-group">
                <label>{t('tablePlanner.capacity')}</label>
                <input 
                  type="number"
                  value={getSelectedTable.capacity}
                  onChange={(e) => {
                    const newCapacity = parseInt(e.target.value, 10);
                    setTables(tables.map(t => {
                      if (t.id !== selectedTable) return t;
                      
                      // Aktualisiere die Anzahl der Sitze
                      let newSeats = [...t.seats];
                      if (newCapacity > t.capacity) {
                        // Füge neue Sitze hinzu
                        for (let i = t.capacity; i < newCapacity; i++) {
                          newSeats.push({ id: `seat-${Date.now()}-${i}` });
                        }
                      } else if (newCapacity < t.capacity) {
                        // Entferne überschüssige Sitze
                        newSeats = newSeats.slice(0, newCapacity);
                      }
                      
                      return { ...t, capacity: newCapacity, seats: newSeats };
                    }));
                  }}
                  min="1"
                  max="20"
                  className="input"
                />
              </div>
              
              <div className="table-planner__form-group">
                <label>{t('tablePlanner.rotation')}</label>
                <input 
                  type="range"
                  value={getSelectedTable.rotation}
                  onChange={(e) => {
                    setTables(tables.map(t => 
                      t.id === selectedTable 
                        ? { ...t, rotation: parseInt(e.target.value, 10) } 
                        : t
                    ));
                  }}
                  min="0"
                  max="359"
                  step="1"
                  className="range"
                />
                <span>{getSelectedTable.rotation}°</span>
              </div>
              
              <Button 
                variant="destructive"
                onClick={() => deleteTable(selectedTable)}
              >
                {t('tablePlanner.deleteTable')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TablePlanner;
