"use client";
import React, { useState, useEffect } from 'react';
import { demoApi } from '../../lib/supabase-api';

interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  groupName: string | null;
  rsvpStatus: 'confirmed' | 'pending' | 'declined' | null;
  dietaryRestrictions: string[] | null;
  plusOne: boolean;
  plusOneName: string | null;
  accommodationNeeded: boolean;
  notes: string | null;
}

// Define the API response type to match what's coming from the server
interface ApiGuest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  rsvpStatus: string;
  dietaryRestrictions: string[];
  plusOne: boolean;
  notes: string;
  tableAssignment?: string | null;
  group?: string;
}

interface GuestManagementProps {
  // Props can be added as needed
}

export const GuestManagement: React.FC<GuestManagementProps> = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [rsvpFilter, setRsvpFilter] = useState<'all' | 'confirmed' | 'pending' | 'declined'>('all');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [menuFilter, setMenuFilter] = useState<string>('all');
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<string | null>(null);
  
  // Form state for adding/editing guests
  const [formData, setFormData] = useState<Partial<Guest>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    groupName: '',
    rsvpStatus: 'pending',
    dietaryRestrictions: [],
    plusOne: false,
    plusOneName: '',
    accommodationNeeded: false,
    notes: ''
  });
  
  // Available groups for filtering
  const [availableGroups, setAvailableGroups] = useState<string[]>([]);
  
  // Load guests on component mount
  useEffect(() => {
    loadGuests();
  }, []);
  
  // Extract available groups when guests change
  useEffect(() => {
    const groups = guests
      .map(guest => guest.groupName)
      .filter((group): group is string => group !== null && group !== '')
      .filter((group, index, self) => self.indexOf(group) === index);
    
    setAvailableGroups(groups);
  }, [guests]);
  
  // Convert API guest format to our internal Guest format
  const convertApiGuest = (apiGuest: any): Guest => {
    return {
      id: apiGuest.id,
      firstName: apiGuest.firstName,
      lastName: apiGuest.lastName,
      email: apiGuest.email || null,
      phone: apiGuest.phone || null,
      groupName: apiGuest.group || null,
      rsvpStatus: apiGuest.rsvpStatus as 'confirmed' | 'pending' | 'declined' | null,
      dietaryRestrictions: apiGuest.dietaryRestrictions || null,
      plusOne: apiGuest.plusOne,
      plusOneName: null, // This field might not be in the API response
      accommodationNeeded: false, // This field might not be in the API response
      notes: apiGuest.notes || null
    };
  };
  
  // Load guests from API
  const loadGuests = async () => {
    setLoading(true);
    try {
      const { data, error } = await demoApi.guests.getAll();
      if (error) throw error;
      
      // Handle null data by providing an empty array as fallback
      const guestData = data || [];
      
      // Convert API format to our internal format
      const convertedGuests = guestData.map(convertApiGuest);
      
      setGuests(convertedGuests);
    } catch (err) {
      setError('Failed to load guests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Handle dietary restriction changes
  const handleDietaryChange = (restriction: string, checked: boolean) => {
    const currentRestrictions = formData.dietaryRestrictions || [];
    
    if (checked) {
      setFormData({
        ...formData,
        dietaryRestrictions: [...currentRestrictions, restriction]
      });
    } else {
      setFormData({
        ...formData,
        dietaryRestrictions: currentRestrictions.filter(r => r !== restriction)
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingGuest) {
        // Update existing guest
        const { error } = await demoApi.guests.update(editingGuest.id, formData);
        if (error) throw error;
        
        setGuests(prevGuests => 
          prevGuests.map(guest => 
            guest.id === editingGuest.id ? { ...guest, ...formData } as Guest : guest
          )
        );
      } else {
        // Add new guest
        const { data, error } = await demoApi.guests.create(formData as Guest);
        if (error) throw error;
        
        if (data) {
          setGuests([...guests, convertApiGuest(data)]);
        }
      }
      
      setShowAddGuestModal(false);
      setEditingGuest(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        groupName: '',
        rsvpStatus: 'pending',
        dietaryRestrictions: [],
        plusOne: false,
        plusOneName: '',
        accommodationNeeded: false,
        notes: ''
      });
    } catch (err) {
      setError('Failed to save guest');
      console.error(err);
    }
  };
  
  // Handle editing a guest
  const handleEditGuest = (guest: Guest) => {
    setEditingGuest(guest);
    setFormData({
      ...guest
    });
    setShowAddGuestModal(true);
  };
  
  // Handle deleting a guest
  const handleDeleteGuest = async (id: string) => {
    try {
      const { error } = await demoApi.guests.delete(id);
      if (error) throw error;
      
      setGuests(guests.filter(guest => guest.id !== id));
      setShowDeleteConfirmation(null);
    } catch (err) {
      setError('Failed to delete guest');
      console.error(err);
    }
  };
  
  // Filter guests based on search term and filters
  const filteredGuests = guests.filter(guest => {
    const matchesSearch = 
      searchTerm === '' || 
      `${guest.firstName} ${guest.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (guest.email && guest.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (guest.phone && guest.phone.includes(searchTerm));
    
    const matchesRsvp = 
      rsvpFilter === 'all' || 
      guest.rsvpStatus === rsvpFilter;
    
    const matchesGroup = 
      groupFilter === 'all' || 
      guest.groupName === groupFilter;
    
    const matchesMenu = 
      menuFilter === 'all' || 
      (menuFilter === 'dietary' && guest.dietaryRestrictions && guest.dietaryRestrictions.length > 0) ||
      (menuFilter === 'no-dietary' && (!guest.dietaryRestrictions || guest.dietaryRestrictions.length === 0));
    
    return matchesSearch && matchesRsvp && matchesGroup && matchesMenu;
  });
  
  // Sort guests by last name
  const sortedGuests = [...filteredGuests].sort((a, b) => {
    return a.lastName.localeCompare(b.lastName);
  });
  
  // Get RSVP counts
  const rsvpCounts = {
    total: guests.length,
    confirmed: guests.filter(guest => guest.rsvpStatus === 'confirmed').length,
    pending: guests.filter(guest => guest.rsvpStatus === 'pending').length,
    declined: guests.filter(guest => guest.rsvpStatus === 'declined').length
  };
  
  return (
    <div className="guest-management">
      {error && (
        <div className="guest-management__error">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
      
      <div className="guest-management__header">
        <h2>Gästeverwaltung</h2>
        <div className="guest-management__stats">
          <div className="guest-management__stat">
            <span className="guest-management__stat-label">Gesamt:</span>
            <span className="guest-management__stat-value">{rsvpCounts.total}</span>
          </div>
          <div className="guest-management__stat guest-management__stat--confirmed">
            <span className="guest-management__stat-label">Zugesagt:</span>
            <span className="guest-management__stat-value">{rsvpCounts.confirmed}</span>
          </div>
          <div className="guest-management__stat guest-management__stat--pending">
            <span className="guest-management__stat-label">Ausstehend:</span>
            <span className="guest-management__stat-value">{rsvpCounts.pending}</span>
          </div>
          <div className="guest-management__stat guest-management__stat--declined">
            <span className="guest-management__stat-label">Abgesagt:</span>
            <span className="guest-management__stat-value">{rsvpCounts.declined}</span>
          </div>
        </div>
      </div>
      
      <div className="guest-management__controls">
        <div className="guest-management__search">
          <input
            type="text"
            placeholder="Suche nach Namen, E-Mail oder Telefon"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="guest-management__filters">
          <div className="guest-management__filter">
            <label>RSVP Status</label>
            <select
              value={rsvpFilter}
              onChange={(e) => setRsvpFilter(e.target.value as any)}
            >
              <option value="all">Alle</option>
              <option value="confirmed">Zugesagt</option>
              <option value="pending">Ausstehend</option>
              <option value="declined">Abgesagt</option>
            </select>
          </div>
          
          <div className="guest-management__filter">
            <label>Gruppe</label>
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
            >
              <option value="all">Alle</option>
              {availableGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
          
          <div className="guest-management__filter">
            <label>Menü</label>
            <select
              value={menuFilter}
              onChange={(e) => setMenuFilter(e.target.value)}
            >
              <option value="all">Alle</option>
              <option value="dietary">Mit Einschränkungen</option>
              <option value="no-dietary">Ohne Einschränkungen</option>
            </select>
          </div>
        </div>
        
        <button
          className="guest-management__add-button"
          onClick={() => {
            setEditingGuest(null);
            setFormData({
              firstName: '',
              lastName: '',
              email: '',
              phone: '',
              groupName: '',
              rsvpStatus: 'pending',
              dietaryRestrictions: [],
              plusOne: false,
              plusOneName: '',
              accommodationNeeded: false,
              notes: ''
            });
            setShowAddGuestModal(true);
          }}
        >
          Gast hinzufügen
        </button>
      </div>
      
      {loading ? (
        <div className="guest-management__loading">Gästeliste wird geladen...</div>
      ) : (
        <div className="guest-management__table-container">
          <table className="guest-management__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>E-Mail</th>
                <th>Telefon</th>
                <th>Gruppe</th>
                <th>RSVP</th>
                <th>Diät</th>
                <th>+1</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {sortedGuests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="guest-management__empty">
                    Keine Gäste gefunden
                  </td>
                </tr>
              ) : (
                sortedGuests.map(guest => (
                  <tr key={guest.id}>
                    <td>{guest.firstName} {guest.lastName}</td>
                    <td>{guest.email || '-'}</td>
                    <td>{guest.phone || '-'}</td>
                    <td>{guest.groupName || '-'}</td>
                    <td>
                      <span className={`guest-management__rsvp guest-management__rsvp--${guest.rsvpStatus}`}>
                        {guest.rsvpStatus === 'confirmed' && 'Zugesagt'}
                        {guest.rsvpStatus === 'pending' && 'Ausstehend'}
                        {guest.rsvpStatus === 'declined' && 'Abgesagt'}
                        {!guest.rsvpStatus && '-'}
                      </span>
                    </td>
                    <td>
                      {guest.dietaryRestrictions && guest.dietaryRestrictions.length > 0 ? (
                        <span className="guest-management__dietary">Ja</span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>{guest.plusOne ? 'Ja' : 'Nein'}</td>
                    <td>
                      <div className="guest-management__actions">
                        <button
                          className="guest-management__action-button"
                          onClick={() => handleEditGuest(guest)}
                        >
                          Bearbeiten
                        </button>
                        <button
                          className="guest-management__action-button guest-management__action-button--danger"
                          onClick={() => setShowDeleteConfirmation(guest.id)}
                        >
                          Löschen
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Add/Edit Guest Modal */}
      {showAddGuestModal && (
        <div className="guest-management__modal">
          <div className="guest-management__modal-content">
            <div className="guest-management__modal-header">
              <h2>{editingGuest ? 'Gast bearbeiten' : 'Neuen Gast hinzufügen'}</h2>
              <button
                className="guest-management__modal-close"
                onClick={() => {
                  setShowAddGuestModal(false);
                  setEditingGuest(null);
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="guest-management__form-row">
                <div className="guest-management__form-group">
                  <label htmlFor="firstName">Vorname</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="guest-management__form-group">
                  <label htmlFor="lastName">Nachname</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="guest-management__form-row">
                <div className="guest-management__form-group">
                  <label htmlFor="email">E-Mail</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="guest-management__form-group">
                  <label htmlFor="phone">Telefon</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="guest-management__form-row">
                <div className="guest-management__form-group">
                  <label htmlFor="groupName">Gruppe</label>
                  <input
                    type="text"
                    id="groupName"
                    name="groupName"
                    value={formData.groupName || ''}
                    onChange={handleInputChange}
                    list="groupSuggestions"
                  />
                  <datalist id="groupSuggestions">
                    {availableGroups.map(group => (
                      <option key={group} value={group} />
                    ))}
                  </datalist>
                </div>
                
                <div className="guest-management__form-group">
                  <label htmlFor="rsvpStatus">RSVP Status</label>
                  <select
                    id="rsvpStatus"
                    name="rsvpStatus"
                    value={formData.rsvpStatus || 'pending'}
                    onChange={handleInputChange}
                  >
                    <option value="confirmed">Zugesagt</option>
                    <option value="pending">Ausstehend</option>
                    <option value="declined">Abgesagt</option>
                  </select>
                </div>
              </div>
              
              <div className="guest-management__form-group">
                <label>Diätanforderungen</label>
                <div className="guest-management__checkbox-group">
                  {['Vegetarisch', 'Vegan', 'Glutenfrei', 'Laktosefrei', 'Nussallergie'].map(restriction => (
                    <label key={restriction} className="guest-management__checkbox-label">
                      <input
                        type="checkbox"
                        checked={(formData.dietaryRestrictions || []).includes(restriction)}
                        onChange={(e) => handleDietaryChange(restriction, e.target.checked)}
                      />
                      {restriction}
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="guest-management__form-group">
                <label className="guest-management__checkbox-label">
                  <input
                    type="checkbox"
                    name="plusOne"
                    checked={formData.plusOne || false}
                    onChange={handleInputChange}
                  />
                  Begleitung (+1)
                </label>
              </div>
              
              {formData.plusOne && (
                <div className="guest-management__form-group">
                  <label htmlFor="plusOneName">Name der Begleitung</label>
                  <input
                    type="text"
                    id="plusOneName"
                    name="plusOneName"
                    value={formData.plusOneName || ''}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              
              <div className="guest-management__form-group">
                <label className="guest-management__checkbox-label">
                  <input
                    type="checkbox"
                    name="accommodationNeeded"
                    checked={formData.accommodationNeeded || false}
                    onChange={handleInputChange}
                  />
                  Unterkunft benötigt
                </label>
              </div>
              
              <div className="guest-management__form-group">
                <label htmlFor="notes">Notizen</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes || ''}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              <div className="guest-management__form-actions">
                <button
                  type="button"
                  className="guest-management__button guest-management__button--secondary"
                  onClick={() => {
                    setShowAddGuestModal(false);
                    setEditingGuest(null);
                  }}
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="guest-management__button"
                >
                  {editingGuest ? 'Speichern' : 'Gast hinzufügen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="guest-management__modal">
          <div className="guest-management__modal-content guest-management__modal-content--small">
            <div className="guest-management__modal-header">
              <h2>Gast löschen</h2>
              <button
                className="guest-management__modal-close"
                onClick={() => setShowDeleteConfirmation(null)}
              >
                ×
              </button>
            </div>
            
            <div className="guest-management__modal-body">
              <p>Sind Sie sicher, dass Sie diesen Gast löschen möchten?</p>
              <p>Diese Aktion kann nicht rückgängig gemacht werden.</p>
            </div>
            
            <div className="guest-management__form-actions">
              <button
                className="guest-management__button guest-management__button--secondary"
                onClick={() => setShowDeleteConfirmation(null)}
              >
                Abbrechen
              </button>
              <button
                className="guest-management__button guest-management__button--danger"
                onClick={() => handleDeleteGuest(showDeleteConfirmation)}
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .guest-management {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .guest-management__error {
          background-color: #f8d7da;
          color: #721c24;
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .guest-management__error button {
          background: none;
          border: none;
          font-size: 1.25rem;
          cursor: pointer;
          color: #721c24;
        }
        
        .guest-management__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .guest-management__header h2 {
          margin: 0;
        }
        
        .guest-management__stats {
          display: flex;
          gap: 1rem;
        }
        
        .guest-management__stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.5rem 1rem;
          background-color: #f8f9fa;
          border-radius: 4px;
          min-width: 80px;
        }
        
        .guest-management__stat--confirmed {
          background-color: #d4edda;
          color: #155724;
        }
        
        .guest-management__stat--pending {
          background-color: #fff3cd;
          color: #856404;
        }
        
        .guest-management__stat--declined {
          background-color: #f8d7da;
          color: #721c24;
        }
        
        .guest-management__stat-label {
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .guest-management__stat-value {
          font-size: 1.25rem;
          font-weight: 700;
        }
        
        .guest-management__controls {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
          align-items: flex-end;
        }
        
        .guest-management__search {
          flex: 1;
          min-width: 250px;
        }
        
        .guest-management__search input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .guest-management__filters {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        
        .guest-management__filter {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .guest-management__filter label {
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .guest-management__filter select {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          min-width: 120px;
        }
        
        .guest-management__add-button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          background-color: #ffbd00;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
          white-space: nowrap;
        }
        
        .guest-management__add-button:hover {
          background-color: #e6a800;
        }
        
        .guest-management__loading {
          text-align: center;
          padding: 2rem;
        }
        
        .guest-management__table-container {
          overflow-x: auto;
        }
        
        .guest-management__table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .guest-management__table th,
        .guest-management__table td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        
        .guest-management__table th {
          background-color: #f8f9fa;
          font-weight: 500;
        }
        
        .guest-management__table tbody tr:hover {
          background-color: #f8f9fa;
        }
        
        .guest-management__empty {
          text-align: center;
          padding: 2rem;
          color: #6c757d;
        }
        
        .guest-management__rsvp {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .guest-management__rsvp--confirmed {
          background-color: #d4edda;
          color: #155724;
        }
        
        .guest-management__rsvp--pending {
          background-color: #fff3cd;
          color: #856404;
        }
        
        .guest-management__rsvp--declined {
          background-color: #f8d7da;
          color: #721c24;
        }
        
        .guest-management__dietary {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
          background-color: #e2e3e5;
          color: #383d41;
        }
        
        .guest-management__actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .guest-management__action-button {
          padding: 0.25rem 0.5rem;
          border: none;
          border-radius: 4px;
          background-color: #f8f9fa;
          color: #212529;
          font-size: 0.8rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .guest-management__action-button:hover {
          background-color: #e2e6ea;
        }
        
        .guest-management__action-button--danger {
          background-color: #f8d7da;
          color: #721c24;
        }
        
        .guest-management__action-button--danger:hover {
          background-color: #f5c6cb;
        }
        
        .guest-management__modal {
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
        
        .guest-management__modal-content {
          background-color: white;
          border-radius: 8px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .guest-management__modal-content--small {
          max-width: 400px;
        }
        
        .guest-management__modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #eee;
        }
        
        .guest-management__modal-header h2 {
          margin: 0;
          font-size: 1.25rem;
        }
        
        .guest-management__modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
        }
        
        .guest-management__modal-body {
          padding: 1.5rem;
        }
        
        .guest-management__modal form {
          padding: 1.5rem;
        }
        
        .guest-management__form-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .guest-management__form-group {
          flex: 1;
          margin-bottom: 1rem;
        }
        
        .guest-management__form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .guest-management__form-group input,
        .guest-management__form-group select,
        .guest-management__form-group textarea {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .guest-management__checkbox-group {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .guest-management__checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }
        
        .guest-management__form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        
        .guest-management__button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          background-color: #ffbd00;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .guest-management__button:hover {
          background-color: #e6a800;
        }
        
        .guest-management__button--secondary {
          background-color: #f8f9fa;
          color: #6c757d;
        }
        
        .guest-management__button--secondary:hover {
          background-color: #e2e6ea;
        }
        
        .guest-management__button--danger {
          background-color: #dc3545;
          color: white;
        }
        
        .guest-management__button--danger:hover {
          background-color: #c82333;
        }
        
        @media (max-width: 768px) {
          .guest-management__header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .guest-management__form-row {
            flex-direction: column;
            gap: 0;
          }
          
          .guest-management__form-actions {
            flex-direction: column;
          }
          
          .guest-management__form-actions button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
export default GuestManagement;
