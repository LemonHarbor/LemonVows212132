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
      // Convert API response to our internal Guest format
      const guestData = data || [];
      const convertedGuests = guestData.map((apiGuest: any) => convertApiGuest(apiGuest));
      setGuests(convertedGuests);
    } catch (err) {
      setError('Failed to load guests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Filter guests based on search and filters
  const filteredGuests = guests.filter(guest => {
    const fullName = `${guest.firstName} ${guest.lastName}`.toLowerCase();
    const matchesSearch = searchTerm === '' || fullName.includes(searchTerm.toLowerCase());
    const matchesRsvp = rsvpFilter === 'all' || guest.rsvpStatus === rsvpFilter;
    const matchesGroup = groupFilter === 'all' || guest.groupName === groupFilter;
    
    // For menu filter, we'd need to add a menu preference field to the guest type
    // This is a simplified version
    const matchesMenu = menuFilter === 'all'; // Placeholder
    
    return matchesSearch && matchesRsvp && matchesGroup && matchesMenu;
  });
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Handle dietary restrictions changes
  const handleDietaryChange = (restriction: string, isChecked: boolean) => {
    const currentRestrictions = formData.dietaryRestrictions || [];
    
    if (isChecked) {
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
        const { data, error } = await demoApi.guests.update(editingGuest.id, formData as Guest);
        if (error) throw error;
        
        setGuests(guests.map(g => g.id === editingGuest.id ? { ...g, ...formData } : g));
      } else {
        // Add new guest
        const { data, error } = await demoApi.guests.create(formData as Guest);
        if (error) throw error;
        
        if (data) {
          setGuests([...guests, data as Guest]);
        }
      }
      
      // Reset form and close modal
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
      setEditingGuest(null);
      setShowAddGuestModal(false);
    } catch (err) {
      setError('Failed to save guest');
      console.error(err);
    }
  };
  
  // Handle edit guest
  const handleEditGuest = (guest: Guest) => {
    setEditingGuest(guest);
    setFormData({ ...guest });
    setShowAddGuestModal(true);
  };
  
  // Handle delete guest
  const handleDeleteGuest = async (id: string) => {
    try {
      const { error } = await demoApi.guests.delete(id);
      if (error) throw error;
      
      setGuests(guests.filter(g => g.id !== id));
      setShowDeleteConfirmation(null);
    } catch (err) {
      setError('Failed to delete guest');
      console.error(err);
    }
  };
  
  // Handle RSVP status change
  const handleRsvpChange = async (id: string, status: 'confirmed' | 'pending' | 'declined') => {
    try {
      const { error } = await demoApi.guests.update(id, { rsvpStatus: status });
      if (error) throw error;
      
      setGuests(guests.map(g => g.id === id ? { ...g, rsvpStatus: status } : g));
    } catch (err) {
      setError('Failed to update RSVP status');
      console.error(err);
    }
  };
  
  return (
    <div className="guest-management">
      {error && (
        <div className="guest-management__error">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
      
      <div className="guest-management__controls">
        <button 
          className="guest-management__button"
          onClick={() => setShowAddGuestModal(true)}
        >
          Gast hinzufügen
        </button>
        
        <div className="guest-management__search">
          <input
            type="text"
            placeholder="Gäste suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="guest-management__filters">
        <div className="guest-management__filter">
          <label>RSVP Status:</label>
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
          <label>Gruppe:</label>
          <select 
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
          >
            <option value="all">Alle Gruppen</option>
            {availableGroups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="guest-management__loading">Gäste werden geladen...</div>
      ) : (
        <>
          <div className="guest-management__stats">
            <div className="guest-management__stat">
              <span className="guest-management__stat-label">Gesamt:</span>
              <span className="guest-management__stat-value">{guests.length}</span>
            </div>
            <div className="guest-management__stat">
              <span className="guest-management__stat-label">Zugesagt:</span>
              <span className="guest-management__stat-value">
                {guests.filter(g => g.rsvpStatus === 'confirmed').length}
              </span>
            </div>
            <div className="guest-management__stat">
              <span className="guest-management__stat-label">Ausstehend:</span>
              <span className="guest-management__stat-value">
                {guests.filter(g => g.rsvpStatus === 'pending').length}
              </span>
            </div>
            <div className="guest-management__stat">
              <span className="guest-management__stat-label">Abgesagt:</span>
              <span className="guest-management__stat-value">
                {guests.filter(g => g.rsvpStatus === 'declined').length}
              </span>
            </div>
          </div>
          
          <div className="guest-management__table-container">
            <table className="guest-management__table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Kontakt</th>
                  <th>Gruppe</th>
                  <th>RSVP</th>
                  <th>Besonderheiten</th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="guest-management__empty">
                      Keine Gäste gefunden.
                    </td>
                  </tr>
                ) : (
                  filteredGuests.map(guest => (
                    <tr key={guest.id}>
                      <td>
                        <div className="guest-management__name">
                          {guest.firstName} {guest.lastName}
                          {guest.plusOne && (
                            <span className="guest-management__plus-one">
                              +1 {guest.plusOneName && `(${guest.plusOneName})`}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="guest-management__contact">
                          {guest.email && <div>{guest.email}</div>}
                          {guest.phone && <div>{guest.phone}</div>}
                        </div>
                      </td>
                      <td>{guest.groupName || '-'}</td>
                      <td>
                        <select
                          value={guest.rsvpStatus || 'pending'}
                          onChange={(e) => handleRsvpChange(
                            guest.id, 
                            e.target.value as 'confirmed' | 'pending' | 'declined'
                          )}
                          className={`guest-management__rsvp guest-management__rsvp--${guest.rsvpStatus || 'pending'}`}
                        >
                          <option value="confirmed">Zugesagt</option>
                          <option value="pending">Ausstehend</option>
                          <option value="declined">Abgesagt</option>
                        </select>
                      </td>
                      <td>
                        {guest.dietaryRestrictions && guest.dietaryRestrictions.length > 0 && (
                          <div className="guest-management__dietary">
                            {guest.dietaryRestrictions.join(', ')}
                          </div>
                        )}
                        {guest.accommodationNeeded && (
                          <div className="guest-management__accommodation">
                            Unterkunft benötigt
                          </div>
                        )}
                      </td>
                      <td className="guest-management__actions">
                        <button
                          className="guest-management__action-button"
                          onClick={() => handleEditGuest(guest)}
                        >
                          Bearbeiten
                        </button>
                        <button
                          className="guest-management__action-button"
                          onClick={() => setShowDeleteConfirmation(guest.id)}
                        >
                          Löschen
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
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
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
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
              
              <div className="guest-management__form-group">
                <label>Ernährungsbesonderheiten</label>
                <div className="guest-management__form-checkbox">
                  <input
                    type="checkbox"
                    id="vegetarian"
                    checked={(formData.dietaryRestrictions || []).includes('vegetarisch')}
                    onChange={(e) => handleDietaryChange('vegetarisch', e.target.checked)}
                  />
                  <label htmlFor="vegetarian">Vegetarisch</label>
                </div>
                <div className="guest-management__form-checkbox">
                  <input
                    type="checkbox"
                    id="vegan"
                    checked={(formData.dietaryRestrictions || []).includes('vegan')}
                    onChange={(e) => handleDietaryChange('vegan', e.target.checked)}
                  />
                  <label htmlFor="vegan">Vegan</label>
                </div>
                <div className="guest-management__form-checkbox">
                  <input
                    type="checkbox"
                    id="glutenFree"
                    checked={(formData.dietaryRestrictions || []).includes('glutenfrei')}
                    onChange={(e) => handleDietaryChange('glutenfrei', e.target.checked)}
                  />
                  <label htmlFor="glutenFree">Glutenfrei</label>
                </div>
                <div className="guest-management__form-checkbox">
                  <input
                    type="checkbox"
                    id="lactoseFree"
                    checked={(formData.dietaryRestrictions || []).includes('laktosefrei')}
                    onChange={(e) => handleDietaryChange('laktosefrei', e.target.checked)}
                  />
                  <label htmlFor="lactoseFree">Laktosefrei</label>
                </div>
              </div>
              
              <div className="guest-management__form-group">
                <div className="guest-management__form-checkbox">
                  <input
                    type="checkbox"
                    id="plusOne"
                    name="plusOne"
                    checked={formData.plusOne || false}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="plusOne">Begleitung</label>
                </div>
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
                <div className="guest-management__form-checkbox">
                  <input
                    type="checkbox"
                    id="accommodationNeeded"
                    name="accommodationNeeded"
                    checked={formData.accommodationNeeded || false}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="accommodationNeeded">Unterkunft benötigt</label>
                </div>
              </div>
              
              <div className="guest-management__form-group">
                <label htmlFor="notes">Notizen</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes || ''}
                  onChange={handleInputChange}
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
                  {editingGuest ? 'Speichern' : 'Hinzufügen'}
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
            
            <div style={{ padding: '1.5rem' }}>
              <p>Sind Sie sicher, dass Sie diesen Gast löschen möchten?</p>
              
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
        
        .guest-management__loading {
          text-align: center;
          padding: 2rem;
        }
        
        .guest-management__filters {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin: 1rem 0;
        }
        
        .guest-management__filter {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .guest-management__filter select {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .guest-management__stats {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .guest-management__stat {
          background-color: white;
          padding: 0.75rem 1rem;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .guest-management__stat-label {
          font-weight: 500;
          margin-right: 0.5rem;
        }
        
        .guest-management__table-container {
          overflow-x: auto;
        }
        
        .guest-management__table {
          width: 100%;
          border-collapse: collapse;
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .guest-management__table th,
        .guest-management__table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        
        .guest-management__table th {
          background-color: #f8f9fa;
          font-weight: 500;
        }
        
        .guest-management__empty {
          text-align: center;
          padding: 2rem;
          color: #6c757d;
        }
        
        .guest-management__name {
          font-weight: 500;
        }
        
        .guest-management__plus-one {
          display: inline-block;
          margin-left: 0.5rem;
          font-size: 0.8rem;
          color: #6c757d;
        }
        
        .guest-management__contact {
          font-size: 0.9rem;
          color: #6c757d;
        }
        
        .guest-management__rsvp {
          padding: 0.25rem;
          border-radius: 4px;
          border: 1px solid #ddd;
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
        
        .guest-management__accommodation {
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
          color: #6c757d;
          font-size: 0.8rem;
          cursor: pointer;
        }
        
        .guest-management__action-button:hover {
          background-color: #e2e6ea;
        }
        
        .guest-management__controls {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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
        }
        
        .guest-management__button--danger:hover {
          background-color: #c82333;
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
        
        .guest-management__modal form {
          padding: 1.5rem;
        }
        
        .guest-management__form-group {
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
        
        .guest-management__form-group textarea {
          min-height: 100px;
          resize: vertical;
        }
        
        .guest-management__form-checkbox {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .guest-management__form-checkbox input {
          width: auto;
        }
        
        .guest-management__form-checkbox label {
          margin-bottom: 0;
        }
        
        .guest-management__form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        
        @media (max-width: 768px) {
          .guest-management__filters {
            flex-direction: column;
          }
          
          .guest-management__table {
            overflow-x: auto;
          }
          
          .guest-management__controls {
            flex-direction: column;
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
