import React from 'react';
import { useTranslation } from 'next-i18next';
import { Button } from '@/components/ui/Button';

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
  accommodationNeeded?: boolean;
}

interface GuestGroupProps {
  name: string;
  color?: string;
}

const GuestManagement: React.FC = () => {
  const { t } = useTranslation('common');
  const [guests, setGuests] = React.useState<GuestProps[]>([]);
  const [selectedGuest, setSelectedGuest] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState('');
  const [rsvpFilter, setRsvpFilter] = React.useState('all');
  const [groupFilter, setGroupFilter] = React.useState('all');
  const [dietaryFilter, setDietaryFilter] = React.useState('all');
  const [sortKey, setSortKey] = React.useState('lastName');
  const [sortDirection, setSortDirection] = React.useState('asc');
  const [showAddGuestModal, setShowAddGuestModal] = React.useState(false);
  const [showImportModal, setShowImportModal] = React.useState(false);
  const [showRSVPLinkModal, setShowRSVPLinkModal] = React.useState(false);
  const [editingGuest, setEditingGuest] = React.useState<GuestProps | null>(null);

  // Gästegruppen
  const guestGroups = React.useMemo<GuestGroupProps[]>(() => {
    const groups = new Set(guests.map(guest => guest.group));
    return Array.from(groups).map(name => ({ name }));
  }, [guests]);

  // Statistiken
  const totalGuests = guests.length;
  const confirmedGuests = guests.filter(guest => guest.rsvpStatus === 'confirmed').length;
  const pendingGuests = guests.filter(guest => guest.rsvpStatus === 'pending').length;
  const declinedGuests = guests.filter(guest => guest.rsvpStatus === 'declined').length;

  // Gefilterte und sortierte Gäste
  const filteredAndSortedGuests = React.useMemo(() => {
    // Filtern
    let filtered = [...guests];
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(guest => 
        guest.firstName.toLowerCase().includes(searchLower) ||
        guest.lastName.toLowerCase().includes(searchLower) ||
        guest.email.toLowerCase().includes(searchLower) ||
        guest.group.toLowerCase().includes(searchLower)
      );
    }
    
    if (rsvpFilter !== 'all') {
      filtered = filtered.filter(guest => guest.rsvpStatus === rsvpFilter);
    }
    
    if (groupFilter !== 'all') {
      filtered = filtered.filter(guest => guest.group === groupFilter);
    }
    
    if (dietaryFilter !== 'all') {
      if (dietaryFilter === 'any') {
        filtered = filtered.filter(guest => 
          guest.dietaryRestrictions && guest.dietaryRestrictions.length > 0
        );
      } else if (dietaryFilter === 'none') {
        filtered = filtered.filter(guest => 
          !guest.dietaryRestrictions || guest.dietaryRestrictions.length === 0
        );
      } else {
        filtered = filtered.filter(guest => 
          guest.dietaryRestrictions && guest.dietaryRestrictions.includes(dietaryFilter)
        );
      }
    }
    
    // Sortieren
    return filtered.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortKey) {
        case 'lastName':
          valueA = a.lastName.toLowerCase();
          valueB = b.lastName.toLowerCase();
          break;
        case 'email':
          valueA = a.email.toLowerCase();
          valueB = b.email.toLowerCase();
          break;
        case 'group':
          valueA = a.group.toLowerCase();
          valueB = b.group.toLowerCase();
          break;
        case 'rsvpStatus':
          valueA = a.rsvpStatus;
          valueB = b.rsvpStatus;
          break;
        default:
          valueA = a.lastName.toLowerCase();
          valueB = b.lastName.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    });
  }, [guests, search, rsvpFilter, groupFilter, dietaryFilter, sortKey, sortDirection]);

  // Ausgewählter Gast
  const getSelectedGuest = React.useMemo(() => {
    if (!selectedGuest) return null;
    return guests.find(guest => guest.id === selectedGuest) || null;
  }, [guests, selectedGuest]);

  // Sortierung ändern
  const sortBy = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Gast auswählen
  const selectGuest = (guestId: string) => {
    setSelectedGuest(guestId);
  };

  // Gast bearbeiten
  const editGuest = (guestId: string) => {
    const guest = guests.find(g => g.id === guestId);
    if (guest) {
      setEditingGuest({ ...guest });
      setShowAddGuestModal(true);
    }
  };

  // Gast löschen
  const deleteGuest = (guestId: string) => {
    if (window.confirm(t('guestManagement.confirmDelete'))) {
      setGuests(guests.filter(guest => guest.id !== guestId));
      if (selectedGuest === guestId) {
        setSelectedGuest(null);
      }
    }
  };

  // Gast hinzufügen/bearbeiten Modal anzeigen
  const handleShowAddGuestModal = () => {
    setEditingGuest(null);
    setShowAddGuestModal(true);
  };

  // Import Modal anzeigen
  const handleShowImportModal = () => {
    setShowImportModal(true);
  };

  // RSVP Link Modal anzeigen
  const handleShowRSVPLinkModal = (guestId?: string) => {
    if (guestId) {
      setSelectedGuest(guestId);
    }
    setShowRSVPLinkModal(true);
  };

  // Gästeliste exportieren
  const exportGuestList = () => {
    // Hier könnte man die Gästeliste als CSV oder Excel exportieren
    console.log('Exporting guest list', guests);
    alert(t('guestManagement.exportSuccess'));
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

  // Initialen eines Gastes
  const getInitials = (guest: GuestProps) => {
    return `${guest.firstName.charAt(0)}${guest.lastName.charAt(0)}`;
  };

  // Gast speichern (hinzufügen oder aktualisieren)
  const saveGuest = (guest: GuestProps) => {
    if (editingGuest) {
      // Gast aktualisieren
      setGuests(guests.map(g => g.id === guest.id ? guest : g));
    } else {
      // Neuen Gast hinzufügen
      setGuests([...guests, { ...guest, id: `guest-${Date.now()}` }]);
    }
    setShowAddGuestModal(false);
    setEditingGuest(null);
  };

  // Gäste importieren
  const importGuests = (importedGuests: GuestProps[]) => {
    setGuests([...guests, ...importedGuests]);
    setShowImportModal(false);
  };

  return (
    <div className="guest-management">
      <div className="guest-management__header">
        <h1>{t('guestManagement.title')}</h1>
        <p>{t('guestManagement.description')}</p>
        
        <div className="guest-management__controls">
          <Button onClick={handleShowAddGuestModal}>
            {t('guestManagement.addGuest')}
          </Button>
          
          <Button 
            variant="secondary"
            onClick={handleShowImportModal}
          >
            {t('guestManagement.importGuests')}
          </Button>
          
          <Button 
            variant="secondary"
            onClick={exportGuestList}
          >
            {t('guestManagement.exportGuestList')}
          </Button>
          
          <Button 
            variant="secondary"
            onClick={() => handleShowRSVPLinkModal()}
          >
            {t('guestManagement.generateRSVPLinks')}
          </Button>
        </div>
      </div>
      
      <div className="guest-management__content">
        <div className="guest-management__filters">
          <div className="guest-management__search">
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('guestManagement.searchGuests')}
              className="input"
            />
          </div>
          
          <div className="guest-management__filter-group">
            <label>{t('guestManagement.filterByRSVP')}</label>
            <select 
              value={rsvpFilter}
              onChange={(e) => setRsvpFilter(e.target.value)}
              className="select"
            >
              <option value="all">{t('guestManagement.all')}</option>
              <option value="confirmed">{t('guestManagement.confirmed')}</option>
              <option value="pending">{t('guestManagement.pending')}</option>
              <option value="declined">{t('guestManagement.declined')}</option>
            </select>
          </div>
          
          <div className="guest-management__filter-group">
            <label>{t('guestManagement.filterByGroup')}</label>
            <select 
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="select"
            >
              <option value="all">{t('guestManagement.all')}</option>
              {guestGroups.map(group => (
                <option key={group.name} value={group.name}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="guest-management__filter-group">
            <label>{t('guestManagement.filterByDietary')}</label>
            <select 
              value={dietaryFilter}
              onChange={(e) => setDietaryFilter(e.target.value)}
              className="select"
            >
              <option value="all">{t('guestManagement.all')}</option>
              <option value="any">{t('guestManagement.anyRestrictions')}</option>
              <option value="none">{t('guestManagement.noRestrictions')}</option>
              <option value="vegetarian">{t('guestManagement.vegetarian')}</option>
              <option value="vegan">{t('guestManagement.vegan')}</option>
              <option value="gluten-free">{t('guestManagement.glutenFree')}</option>
              <option value="lactose-free">{t('guestManagement.lactoseFree')}</option>
            </select>
          </div>
        </div>
        
        <div className="guest-management__stats">
          <div className="guest-management__stat-item">
            <div className="guest-management__stat-value">{totalGuests}</div>
            <div className="guest-management__stat-label">{t('guestManagement.totalGuests')}</div>
          </div>
          
          <div className="guest-management__stat-item">
            <div className="guest-management__stat-value">{confirmedGuests}</div>
            <div className="guest-management__stat-label">{t('guestManagement.confirmed')}</div>
          </div>
          
          <div className="guest-management__stat-item">
            <div className="guest-management__stat-value">{pendingGuests}</div>
            <div className="guest-management__stat-label">{t('guestManagement.pending')}</div>
          </div>
          
          <div className="guest-management__stat-item">
            <div className="guest-management__stat-value">{declinedGuests}</div>
            <div className="guest-management__stat-label">{t('guestManagement.declined')}</div>
          </div>
        </div>
        
        <div className="guest-management__table-container">
          <table className="guest-management__table">
            <thead>
              <tr>
                <th onClick={() => sortBy('lastName')}>
                  {t('guestManagement.name')}
                  {sortKey === 'lastName' && (
                    <span className="sort-icon">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th onClick={() => sortBy('email')}>
                  {t('guestManagement.email')}
                  {sortKey === 'email' && (
                    <span className="sort-icon">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th onClick={() => sortBy('group')}>
                  {t('guestManagement.group')}
                  {sortKey === 'group' && (
                    <span className="sort-icon">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th onClick={() => sortBy('rsvpStatus')}>
                  {t('guestManagement.rsvpStatus')}
                  {sortKey === 'rsvpStatus' && (
                    <span className="sort-icon">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th>{t('guestManagement.plusOne')}</th>
                <th>{t('guestManagement.dietaryRestrictions')}</th>
                <th>{t('guestManagement.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedGuests.length > 0 ? (
                filteredAndSortedGuests.map(guest => (
                  <tr 
                    key={guest.id}
                    onClick={() => selectGuest(guest.id)}
                    className={selectedGuest === guest.id ? 'selected' : ''}
                  >
                    <td>{guest.firstName} {guest.lastName}</td>
                    <td>{guest.email}</td>
                    <td>
                      <span 
                        className="guest-group-tag"
                        style={{ backgroundColor: getGroupColor(guest.group) }}
                      >
                        {guest.group}
                      </span>
                    </td>
                    <td>
                      <span className={`rsvp-status rsvp-status--${guest.rsvpStatus}`}>
                        {t(`guestManagement.rsvpStatuses.${guest.rsvpStatus}`)}
                      </span>
                    </td>
                    <td>
                      {guest.plusOne ? (
                        <div>
                          <span className="plus-one-icon">✓</span>
                          {guest.plusOneName && <span> {guest.plusOneName}</span>}
                        </div>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td>
                      {guest.dietaryRestrictions && guest.dietaryRestrictions.length > 0 ? (
                        <div className="dietary-restrictions">
                          {guest.dietaryRestrictions.map((restriction, index) => (
                            <span key={index} className="dietary-tag">
                              {restriction}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td>
                      <div className="guest-actions">
                        <button 
                          className="btn-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            editGuest(guest.id);
                          }}
                        >
                          <span role="img" aria-label="Edit">✏️</span>
                        </button>
                        
                        <button 
                          className="btn-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowRSVPLinkModal(guest.id);
                          }}
                        >
                          <span role="img" aria-label="Send RSVP">📧</span>
                        </button>
                        
                        <button 
                          className="btn-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteGuest(guest.id);
                          }}
                        >
                          <span role="img" aria-label="Delete">🗑️</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="empty-state">
                    {t('guestManagement.noGuestsFound')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Gast-Details Sidebar */}
      {selectedGuest && getSelectedGuest && (
        <div className="guest-management__sidebar">
          <div className="guest-management__sidebar-header">
            <h3>{t('guestManagement.guestDetails')}</h3>
            <button 
              className="btn-icon"
              onClick={() => setSelectedGuest(null)}
            >
              <span role="img" aria-label="Close">✖️</span>
            </button>
          </div>
          
          <div className="guest-management__guest-profile">
            <div 
              className="guest-management__guest-avatar"
              style={{ backgroundColor: getGroupColor(getSelectedGuest.group) }}
            >
              {getInitials(getSelectedGuest)}
            </div>
            
            <h4>{getSelectedGuest.firstName} {getSelectedGuest.lastName}</h4>
            <p>{getSelectedGuest.email}</p>
          </div>
          
          <div className="guest-management__guest-details">
            <div className="detail-item">
              <div className="detail-label">{t('guestManagement.rsvpStatus')}</div>
              <div className="detail-value">
                <span className={`rsvp-status rsvp-status--${getSelectedGuest.rsvpStatus}`}>
                  {t(`guestManagement.rsvpStatuses.${getSelectedGuest.rsvpStatus}`)}
                </span>
              </div>
            </div>
            
            <div className="detail-item">
              <div className="detail-label">{t('guestManagement.group')}</div>
              <div className="detail-value">
                <span 
                  className="guest-group-tag"
                  style={{ backgroundColor: getGroupColor(getSelectedGuest.group) }}
                >
                  {getSelectedGuest.group}
                </span>
              </div>
            </div>
            
            {getSelectedGuest.plusOne && (
              <div className="detail-item">
                <div className="detail-label">{t('guestManagement.plusOne')}</div>
                <div className="detail-value">
                  {getSelectedGuest.plusOneName || t('guestManagement.unnamed')}
                </div>
              </div>
            )}
            
            {getSelectedGuest.accommodationNeeded && (
              <div className="detail-item">
                <div className="detail-label">{t('guestManagement.accommodation')}</div>
                <div className="detail-value">
                  <span className="accommodation-needed">
                    {t('guestManagement.accommodationNeeded')}
                  </span>
                </div>
              </div>
            )}
            
            {getSelectedGuest.dietaryRestrictions && getSelectedGuest.dietaryRestrictions.length > 0 && (
              <div className="detail-item">
                <div className="detail-label">{t('guestManagement.dietaryRestrictions')}</div>
                <div className="detail-value">
                  <div className="dietary-restrictions">
                    {getSelectedGuest.dietaryRestrictions.map((restriction, index) => (
                      <span key={index} className="dietary-tag">
                        {restriction}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {getSelectedGuest.notes && (
              <div className="detail-item">
                <div className="detail-label">{t('guestManagement.notes')}</div>
                <div className="detail-value notes">
                  {getSelectedGuest.notes}
                </div>
              </div>
            )}
          </div>
          
          <div className="guest-management__sidebar-actions">
            <Button 
              onClick={() => editGuest(selectedGuest)}
            >
              {t('guestManagement.editGuest')}
            </Button>
            
            <Button 
              variant="secondary"
              onClick={() => handleShowRSVPLinkModal(selectedGuest)}
            >
              {t('guestManagement.sendRSVP')}
            </Button>
          </div>
        </div>
      )}
      
      {/* Hier könnten die Modals für Gast hinzufügen/bearbeiten, Import und RSVP-Links implementiert werden */}
    </div>
  );
};

export default GuestManagement;
