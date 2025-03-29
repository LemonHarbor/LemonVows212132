import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { media } from '../../styles/ResponsiveComponents';
import TranslatedText from '../TranslatedText';
import TranslatedButton from '../TranslatedButton';
import ResponsiveTable from '../ResponsiveTable';
import { Guest, GuestFormData } from '../../types/Guest';
import { guestApi, demoApi } from '../../services/guestApi';

interface GuestManagementProps {
  isDemo?: boolean;
  weddingId?: string;
}

const Container = styled.div`
  padding: 2rem;
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  ${media.sm} {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Title = styled.h2`
  font-size: 1.75rem;
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  ${media.sm} {
    width: 100%;
    justify-content: space-between;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
  overflow-x: auto;
  padding-bottom: 0.5rem;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? 'var(--text-on-primary)' : 'var(--text-color)'};
  border: ${props => props.active ? 'none' : '1px solid var(--border-color)'};
  border-radius: var(--border-radius-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  white-space: nowrap;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--background-hover)'};
  }
`;

const FormContainer = styled.div`
  background-color: var(--background-light);
  border-radius: var(--border-radius-sm);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const FormTitle = styled.h3`
  font-size: 1.25rem;
  margin: 0 0 1.5rem 0;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormLabel = styled.label`
  margin-bottom: 0.5rem;
  font-weight: var(--font-weight-medium);
`;

const FormInput = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  font-size: 1rem;
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 3px rgba(249, 202, 36, 0.2);
  }
`;

const FormSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  font-size: 1rem;
  background-color: var(--background-color);
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 3px rgba(249, 202, 36, 0.2);
  }
`;

const FormTextarea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 3px rgba(249, 202, 36, 0.2);
  }
`;

const FormCheckbox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

const FormActions = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const StatusBadge = styled.span<{ status: 'pending' | 'confirmed' | 'declined' }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: var(--font-weight-medium);
  
  ${props => {
    switch (props.status) {
      case 'confirmed':
        return `
          background-color: var(--success-light);
          color: var(--success-color);
        `;
      case 'declined':
        return `
          background-color: var(--error-light);
          color: var(--error-color);
        `;
      default:
        return `
          background-color: var(--warning-light);
          color: var(--warning-color);
        `;
    }
  }}
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  padding: 0.25rem;
  margin-right: 0.5rem;
  
  &:hover {
    color: var(--primary-dark);
  }
`;

const GuestManagement: React.FC<GuestManagementProps> = ({ isDemo = false, weddingId = 'demo' }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'confirmed' | 'pending' | 'declined'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<GuestFormData>({
    name: '',
    email: '',
    phone: '',
    status: 'pending',
    plusOne: false,
    dietaryRestrictions: '',
    notes: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Choose the appropriate API based on whether this is a demo
  const api = isDemo ? demoApi : guestApi;
  
  // Load guests
  useEffect(() => {
    const loadGuests = async () => {
      setLoading(true);
      try {
        const { data, error } = await api.getAll();
        if (error) throw error;
        setGuests(data || []);
      } catch (error) {
        console.error('Error loading guests:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadGuests();
  }, [api]);
  
  // Filter guests based on active tab
  const filteredGuests = guests.filter(guest => {
    if (activeTab === 'all') return true;
    return guest.status === activeTab;
  });
  
  // Format guests for table display
  const guestsTableData = filteredGuests.map(guest => ({
    id: guest.id,
    Name: guest.name,
    Email: guest.email,
    Phone: guest.phone,
    Status: (
      <StatusBadge status={guest.status}>
        {guest.status === 'confirmed' ? 'Zugesagt' : 
         guest.status === 'declined' ? 'Abgesagt' : 'Ausstehend'}
      </StatusBadge>
    ),
    PlusOne: guest.plusOne ? 'Ja' : 'Nein',
    DietaryRestrictions: guest.dietaryRestrictions || '-',
    Actions: (
      <>
        <ActionButton onClick={() => handleEdit(guest.id)} title="Bearbeiten">
          ✏️
        </ActionButton>
        <ActionButton onClick={() => handleDelete(guest.id)} title="Löschen">
          🗑️
        </ActionButton>
        {guest.status === 'pending' && (
          <>
            <ActionButton onClick={() => handleUpdateStatus(guest.id, 'confirmed')} title="Zusagen">
              ✅
            </ActionButton>
            <ActionButton onClick={() => handleUpdateStatus(guest.id, 'declined')} title="Absagen">
              ❌
            </ActionButton>
          </>
        )}
      </>
    )
  }));
  
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
      if (editingId) {
        // Update existing guest
        const { error } = await api.update(editingId, formData);
        if (error) throw error;
        
        // Update local state
        setGuests(prev => 
          prev.map(guest => 
            guest.id === editingId ? { ...guest, ...formData } : guest
          )
        );
        
        setEditingId(null);
      } else {
        // Create new guest
        const { data, error } = await api.create(formData);
        if (error) throw error;
        
        // Update local state
        if (data) {
          setGuests(prev => [...prev, data]);
        }
      }
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        status: 'pending',
        plusOne: false,
        dietaryRestrictions: '',
        notes: ''
      });
      
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving guest:', error);
    }
  };
  
  // Handle edit button click
  const handleEdit = async (id: string) => {
    try {
      const { data, error } = await api.getById(id);
      if (error) throw error;
      
      if (data) {
        setFormData({
          name: data.name,
          email: data.email,
          phone: data.phone,
          status: data.status,
          plusOne: data.plusOne,
          dietaryRestrictions: data.dietaryRestrictions || '',
          notes: data.notes || ''
        });
        
        setEditingId(id);
        setShowAddForm(true);
      }
    } catch (error) {
      console.error('Error loading guest for edit:', error);
    }
  };
  
  // Handle delete button click
  const handleDelete = async (id: string) => {
    if (!window.confirm('Sind Sie sicher, dass Sie diesen Gast löschen möchten?')) {
      return;
    }
    
    try {
      const { error } = await api.delete(id);
      if (error) throw error;
      
      // Update local state
      setGuests(prev => prev.filter(guest => guest.id !== id));
    } catch (error) {
      console.error('Error deleting guest:', error);
    }
  };
  
  // Handle status update
  const handleUpdateStatus = async (id: string, status: 'pending' | 'confirmed' | 'declined') => {
    try {
      const { error } = await api.updateStatus(id, status);
      if (error) throw error;
      
      // Update local state
      setGuests(prev => 
        prev.map(guest => 
          guest.id === id ? { ...guest, status } : guest
        )
      );
    } catch (error) {
      console.error('Error updating guest status:', error);
    }
  };
  
  // Cancel form
  const handleCancelForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      status: 'pending',
      plusOne: false,
      dietaryRestrictions: '',
      notes: ''
    });
    
    setEditingId(null);
    setShowAddForm(false);
  };
  
  if (loading) {
    return (
      <Container>
        <div className="loading">
          <div className="loading-spinner"></div>
          <div className="loading-text">
            <TranslatedText i18nKey="guests.loading" defaultText="Gäste werden geladen..." />
          </div>
        </div>
      </Container>
    );
  }
  
  return (
    <Container>
      <Header>
        <Title>
          <TranslatedText i18nKey="guests.title" defaultText="Gästeverwaltung" />
        </Title>
        <ActionButtons>
          <TranslatedButton
            i18nKey="guests.addGuest"
            defaultText="Gast hinzufügen"
            onClick={() => setShowAddForm(true)}
            variant="primary"
          />
        </ActionButtons>
      </Header>
      
      {showAddForm && (
        <FormContainer>
          <FormTitle>
            {editingId ? (
              <TranslatedText i18nKey="guests.editGuest" defaultText="Gast bearbeiten" />
            ) : (
              <TranslatedText i18nKey="guests.addGuest" defaultText="Gast hinzufügen" />
            )}
          </FormTitle>
          
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel>
                <TranslatedText i18nKey="guests.name" defaultText="Name" />
              </FormLabel>
              <FormInput
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel>
                <TranslatedText i18nKey="guests.email" defaultText="E-Mail" />
              </FormLabel>
              <FormInput
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel>
                <TranslatedText i18nKey="guests.phone" defaultText="Telefon" />
              </FormLabel>
              <FormInput
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel>
                <TranslatedText i18nKey="guests.status" defaultText="Status" />
              </FormLabel>
              <FormSelect
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="pending">Ausstehend</option>
                <option value="confirmed">Zugesagt</option>
                <option value="declined">Abgesagt</option>
              </FormSelect>
            </FormGroup>
            
            <FormGroup>
              <FormLabel>
                <TranslatedText i18nKey="guests.dietaryRestrictions" defaultText="Ernährungseinschränkungen" />
              </FormLabel>
              <FormInput
                type="text"
                name="dietaryRestrictions"
                value={formData.dietaryRestrictions}
                onChange={handleInputChange}
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel>
                <TranslatedText i18nKey="guests.notes" defaultText="Notizen" />
              </FormLabel>
              <FormTextarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
              />
            </FormGroup>
            
            <FormGroup>
              <FormCheckbox>
                <FormInput
                  type="checkbox"
                  name="plusOne"
                  checked={formData.plusOne}
                  onChange={handleInputChange}
                />
                <FormLabel>
                  <TranslatedText i18nKey="guests.plusOne" defaultText="Mit Begleitung" />
                </FormLabel>
              </FormCheckbox>
            </FormGroup>
            
            <FormActions>
              <TranslatedButton
                i18nKey="guests.cancel"
                defaultText="Abbrechen"
                type="button"
                onClick={handleCancelForm}
                variant="outline"
              />
              <TranslatedButton
                i18nKey={editingId ? "guests.saveChanges" : "guests.addGuest"}
                defaultText={editingId ? "Änderungen speichern" : "Gast hinzufügen"}
                type="submit"
                variant="primary"
              />
            </FormActions>
          </Form>
        </FormContainer>
      )}
      
      <Tabs>
        <Tab
          active={activeTab === 'all'}
          onClick={() => setActiveTab('all')}
        >
          <TranslatedText i18nKey="guests.allGuests" defaultText="Alle Gäste" />
          {' '}({guests.length})
        </Tab>
        <Tab
          active={activeTab === 'confirmed'}
          onClick={() => setActiveTab('confirmed')}
        >
          <TranslatedText i18nKey="guests.confirmed" defaultText="Zugesagt" />
          {' '}({guests.filter(g => g.status === 'confirmed').length})
        </Tab>
        <Tab
          active={activeTab === 'pending'}
          onClick={() => setActiveTab('pending')}
        >
          <TranslatedText i18nKey="guests.pending" defaultText="Ausstehend" />
          {' '}({guests.filter(g => g.status === 'pending').length})
        </Tab>
        <Tab
          active={activeTab === 'declined'}
          onClick={() => setActiveTab('declined')}
        >
          <TranslatedText i18nKey="guests.declined" defaultText="Abgesagt" />
          {' '}({guests.filter(g => g.status === 'declined').length})
        </Tab>
      </Tabs>
      
      <ResponsiveTable
        headers={['Name', 'Email', 'Phone', 'Status', 'PlusOne', 'DietaryRestrictions', 'Actions']}
        data={guestsTableData}
        keyField="id"
      />
    </Container>
  );
};

export default GuestManagement;
