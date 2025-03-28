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
  
  // Load guests from API
  const loadGuests = async () => {
    setLoading(true);
    try {
      const { data, error } = await demoApi.guests.getAll();
      if (error) throw error;
      setGuests(data);
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
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingGuest) {
        // Update existing guest
        const { data, error } = await demoApi.guests.update(editingGuest.id, formData);
        if (error) throw error;
        
        // Update local state
        setGuests(prev => prev.map(g => g.id === editingGuest.id ? data : g));
      } else {
        // Add new guest
        const { data, error } = await demoApi.guests.create(formData);
        if (error) throw error;
        
        // Update local state
        setGuests(prev => [...prev, data]);
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
    setFormData({
      firstName: guest.firstName,
      lastName: guest.lastName,
      email: guest.email,
      phone: guest.phone,
      groupName: guest.groupName,
      rsvpStatus: guest.rsvpStatus,
      dietaryRestrictions: guest.dietaryRestrictions,
      plusOne: guest.plusOne,
      plusOneName: guest.plusOneName,
      accommodationNeeded: guest.accommodationNeeded,
      notes: guest.notes
    });
    setShowAddGuestModal(true);
  };
  
  // Handle delete guest
  const handleDeleteGuest = async (id: string) => {
    try {
      const { error } = await demoApi.guests.delete(id);
      if (error) throw error;
      
      // Update local state
      setGuests(prev => prev.filter(g => g.id !== id));
      setShowDeleteConfirmation(null);
    } catch (err) {
      setError('Failed to delete guest');
      console.error(err);
    }
  };
  
  // Handle sending email to selected guests
  const handleSendEmail = () => {
    alert('Diese Funktion würde E-Mails an ausgewählte Gäste senden.');
  };
  
  // Handle exporting guest list
  const handleExportGuestList = () => {
    alert('Diese Funktion würde die Gästeliste als CSV oder PDF exportieren.');
  };
  
  return (
    <div className="guest-management">
      <div className="guest-management__demo-notice">
        <p>Dies ist eine funktionale Demo-Version der Gästeverwaltung. Sie können:</p>
        <ul>
          <li>Gäste hinzufügen, bearbeiten und löschen</li>
          <li>Nach Gästen suchen und filtern</li>
          <li>RSVP-Status verfolgen</li>
          <li>Menüpräferenzen und Allergien erfassen</li>
          <li>Übernachtungsbedarf verwalten</li>
        </ul>
      </div>
      
      {error && (
        <div className="guest-management__error">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Schließen</button>
        </div>
      )}
      
      <div className="guest-management__filters">
        <div className="guest-management__search">
          <input 
            type="text" 
            placeholder="Gäste suchen..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="guest-management__search-button">Suchen</button>
        </div>
        
        <div className="guest-management__filter-group">
          <label>RSVP-Status:</label>
          <select 
            value={rsvpFilter}
            onChange={(e) => setRsvpFilter(e.target.value as any)}
          >
            <option value="all">Alle</option>
            <option value="confirmed">Zugesagt</option>
            <option value="declined">Abgesagt</option>
            <option value="pending">Ausstehend</option>
          </select>
        </div>
        
        <div className="guest-management__filter-group">
          <label>Gruppe:</label>
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
        
        <div className="guest-management__filter-group">
          <label>Menüpräferenz:</label>
          <select 
            value={menuFilter}
            onChange={(e) => setMenuFilter(e.target.value)}
          >
            <option value="all">Alle</option>
            <option value="meat">Fleisch</option>
            <option value="fish">Fisch</option>
            <option value="vegetarian">Vegetarisch</option>
            <option value="vegan">Vegan</option>
          </select>
        </div>
      </div>
      
      <div className="guest-management__table">
        {loading ? (
          <div className="guest-management__loading">Gäste werden geladen...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>E-Mail</th>
                <th>RSVP</th>
                <th>Gruppe</th>
                <th>Menüpräferenz</th>
                <th>Allergien</th>
                <th>Übernachtung</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="guest-management__no-results">
                    Keine Gäste gefunden
                  </td>
                </tr>
              ) : (
                filteredGuests.map(guest => (
                  <tr key={guest.id}>
                    <td>{`${guest.firstName} ${guest.lastName}`}</td>
                    <td>{guest.email || '-'}</td>
                    <td>
                      <span className={`guest-management__status guest-management__status--${guest.rsvpStatus || 'pending'}`}>
                        {guest.rsvpStatus === 'confirmed' ? 'Zugesagt' : 
                         guest.rsvpStatus === 'declined' ? 'Abgesagt' : 'Ausstehend'}
                      </span>
                    </td>
                    <td>{guest.groupName || '-'}</td>
                    <td>-</td> {/* Placeholder for menu preference */}
                    <td>{guest.dietaryRestrictions?.join(', ') || '-'}</td>
                    <td>
                      <span className="guest-management__accommodation">
                        {guest.accommodationNeeded ? 'Ja' : 'Nein'}
                      </span>
                    </td>
                    <td>
                      <div className="guest-management__actions">
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
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
      
      <div className="guest-management__controls">
        <button 
          className="guest-management__button"
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
        <button 
          className="guest-management__button"
          onClick={handleSendEmail}
        >
          E-Mail an ausgewählte Gäste
        </button>
        <button 
          className="guest-management__button"
          onClick={handleExportGuestList}
        >
          Gästeliste exportieren
        </button>
      </div>
      
      {/* Add/Edit Guest Modal */}
      {showAddGuestModal && (
        <div className="guest-management__modal">
          <div className="guest-management__modal-content">
            <div className="guest-management__modal-header">
              <h2>{editingGuest ? 'Gast bearbeiten' : 'Gast hinzufügen'}</h2>
              <button 
                className="guest-management__modal-close"
                onClick={() => setShowAddGuestModal(false)}
              >
                &times;
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
                  list="groupList"
                />
                <datalist id="groupList">
                  {availableGroups.map(group => (
                    <option key={group} value={group} />
                  ))}
                </datalist>
              </div>
              <div className="guest-management__form-group">
                <label htmlFor="rsvpStatus">RSVP-Status</label>
                <select
                  id="rsvpStatus"
                  name="rsvpStatus"
                  value={formData.rsvpStatus || 'pending'}
                  onChange={handleInputChange}
                >
                  <option value="confirmed">Zugesagt</option>
                  <option value="declined">Abgesagt</option>
                  <option value="pending">Ausstehend</option>
                </select>
              </div>
              <div className="guest-management__form-group">
                <label htmlFor="dietaryRestrictions">Allergien/Unverträglichkeiten</label>
                <input
                  type="text"
                  id="dietaryRestrictions"
                  name="dietaryRestrictions"
                  value={formData.dietaryRestrictions?.join(', ') || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      dietaryRestrictions: value ? value.split(',').map(item => item.trim()) : []
                    }));
                  }}
                  placeholder="Kommagetrennte Liste, z.B. Nüsse, Laktose"
                />
              </div>
              <div className="guest-management__form-group guest-management__form-checkbox">
                <input
                  type="checkbox"
                  id="plusOne"
                  name="plusOne"
                  checked={formData.plusOne || false}
                  onChange={handleInputChange}
                />
                <label htmlFor="plusOne">Begleitung</label>
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
              <div className="guest-management__form-group guest-management__form-checkbox">
                <input
                  type="checkbox"
                  id="accommodationNeeded"
                  name="accommodationNeeded"
                  checked={formData.accommodationNeeded || false}
                  onChange={handleInputChange}
                />
                <label htmlFor="accommodationNeeded">Übernachtung benötigt</label>
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
                  onClick={() => setShowAddGuestModal(false)}
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
                &times;
              </button>
            </div>
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
      )}
      
      <style jsx>{`
        .guest-management {
          padding: 2rem;
          background-color: #f9f9f9;
          border-radius: 8px;
        }
        
        .guest-management__demo-notice {
          background-color: #fff3cd;
          border: 1px solid #ffeeba;
          border-radius: 4px;
          padding: 1rem;
          margin-bottom: 2rem;
        }
        
        .guest-management__demo-notice p {
          margin-top: 0;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .guest-management__demo-notice ul {
          margin: 0;
          padding-left: 1.5rem;
        }
        
        .guest-management__error {
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 4px;
          padding: 1rem;
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .guest-management__error p {
          margin: 0;
          color: #721c24;
        }
        
        .guest-management__error button {
          background: none;
          border: none;
          color: #721c24;
          font-weight: bold;
          cursor: pointer;
        }
        
        .guest-management__filters {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2rem;
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .guest-management__search {
          display: flex;
          flex: 1;
          min-width: 250px;
        }
        
        .guest-management__search input {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px 0 0 4px;
        }
        
        .guest-management__search-button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 0 4px 4px 0;
          background-color: #ffbd00;
          color: white;
          cursor: pointer;
        }
        
        .guest-management__search-button:hover {
          background-color: #e6a800;
        }
        
        .guest-management__filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          min-width: 150px;
        }
        
        .guest-management__filter-group label {
          font-weight: 500;
          font-size: 0.9rem;
        }
        
        .guest-management__filter-group select {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .guest-management__table {
          margin-bottom: 2rem;
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .guest-management__loading,
        .guest-management__no-results {
          padding: 2rem;
          text-align: center;
          color: #666;
        }
        
        .guest-management__table table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .guest-management__table th {
          text-align: left;
          padding: 1rem;
          background-color: #f5f5f5;
          font-weight: 600;
          color: #333;
        }
        
        .guest-management__table td {
          padding: 1rem;
          border-top: 1px solid #eee;
        }
        
        .guest-management__status {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .guest-management__status--confirmed {
          background-color: #d4edda;
          color: #155724;
        }
        
        .guest-management__status--declined {
          background-color: #f8d7da;
          color: #721c24;
        }
        
        .guest-management__status--pending {
          background-color: #fff3cd;
          color: #856404;
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
