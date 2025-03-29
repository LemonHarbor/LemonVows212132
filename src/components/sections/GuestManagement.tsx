import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Guest, GuestFormData } from '../../types/Guest';
import { guestApi, demoApi } from '../../services/guestApi';
import { TranslatedText } from '../TranslatedText';
import { TranslatedButton } from '../TranslatedButton';
import { FormLabel } from '../FormLabel';
import { ResponsiveTable } from '../ResponsiveTable';
import { ResponsiveCard } from '../ResponsiveCard';

interface GuestManagementProps {
  isDemo?: boolean;
  weddingId?: string;
}

// Styled components
const Container = styled.div`
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin: 0;
  color: var(--text-primary);
`;

const ActionButton = styled.button`
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--disabled);
    cursor: not-allowed;
  }
`;

const Form = styled.form`
  background-color: var(--background-paper);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const FormGroup = styled.div`
  flex: 1;
  min-width: 0;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const CancelButton = styled.button`
  background-color: var(--background-paper);
  color: var(--text-primary);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--background-default);
  }
`;

const SubmitButton = styled.button`
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--primary-dark);
  }
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
          color: var(--success-dark);
        `;
      case 'declined':
        return `
          background-color: var(--error-light);
          color: var(--error-dark);
        `;
      default:
        return `
          background-color: var(--warning-light);
          color: var(--warning-dark);
        `;
    }
  }}
`;

const GuestManagement: React.FC<GuestManagementProps> = ({ isDemo = false, weddingId = 'demo' }) => {
  // State
  const [guests, setGuests] = useState<Guest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<GuestFormData>({
    name: '',
    email: '',
    phone: '',
    status: 'pending',
    plusOne: false,
    dietaryRestrictions: '',
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Select the appropriate API based on isDemo flag
  const api = isDemo ? demoApi : guestApi;
  
  // Fetch guests on component mount
  useEffect(() => {
    const fetchGuests = async () => {
      try {
        setLoading(true);
        const { data, error } = await api.guests.getAll();
        
        if (error) throw error;
        
        setGuests(data || []);
      } catch (err) {
        console.error('Error fetching guests:', err);
        setError('Failed to load guests. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGuests();
  }, [api]);
  
  // Reset form
  const resetForm = () => {
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
  };
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
        const { error } = await api.guests.update(editingId, formData);
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
        const { data, error } = await api.guests.create(formData);
        if (error) throw error;
        
        // Update local state
        if (data) {
          setGuests(prev => [...prev, data]);
        }
      }
      
      // Reset form
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error('Error saving guest:', err);
      setError('Failed to save guest. Please try again.');
    }
  };
  
  // Handle edit guest
  const handleEdit = async (id: string) => {
    try {
      const { data, error } = await api.guests.getById(id);
      
      if (error) throw error;
      
      if (data) {
        setFormData({
          name: data.name,
          email: data.email || '',
          phone: data.phone || '',
          status: data.status,
          plusOne: data.plusOne,
          dietaryRestrictions: data.dietaryRestrictions || '',
          notes: data.notes || ''
        });
        
        setEditingId(id);
        setShowForm(true);
      }
    } catch (err) {
      console.error('Error fetching guest details:', err);
      setError('Failed to load guest details. Please try again.');
    }
  };
  
  // Handle delete guest
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this guest?')) {
      return;
    }
    
    try {
      const { error } = await api.guests.delete(id);
      
      if (error) throw error;
      
      // Update local state
      setGuests(prev => prev.filter(guest => guest.id !== id));
    } catch (err) {
      console.error('Error deleting guest:', err);
      setError('Failed to delete guest. Please try again.');
    }
  };
  
  // Handle status update
  const handleStatusUpdate = async (id: string, status: 'pending' | 'confirmed' | 'declined') => {
    try {
      const { error } = await api.guests.updateStatus(id, status);
      
      if (error) throw error;
      
      // Update local state
      setGuests(prev => 
        prev.map(guest => 
          guest.id === id ? { ...guest, status } : guest
        )
      );
    } catch (err) {
      console.error('Error updating guest status:', err);
      setError('Failed to update guest status. Please try again.');
    }
  };
  
  // Cancel form
  const handleCancel = () => {
    resetForm();
    setShowForm(false);
  };
  
  // Render status badge
  const renderStatus = (status: 'pending' | 'confirmed' | 'declined') => {
    return <StatusBadge status={status}>{status}</StatusBadge>;
  };
  
  // Render action buttons
  const renderActions = (guest: Guest) => {
    return (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <ActionButton onClick={() => handleEdit(guest.id)}>
          <TranslatedText i18nKey="common.edit" defaultText="Edit" />
        </ActionButton>
        <ActionButton onClick={() => handleDelete(guest.id)}>
          <TranslatedText i18nKey="common.delete" defaultText="Delete" />
        </ActionButton>
      </div>
    );
  };
  
  return (
    <Container>
      <Header>
        <Title>
          <TranslatedText i18nKey="guests.title" defaultText="Guest Management" />
        </Title>
        <ActionButton onClick={() => { resetForm(); setShowForm(!showForm); }}>
          {showForm ? 
            <TranslatedText i18nKey="common.cancel" defaultText="Cancel" /> : 
            <TranslatedText i18nKey="guests.addGuest" defaultText="Add Guest" />
          }
        </ActionButton>
      </Header>
      
      {error && (
        <ResponsiveCard style={{ marginBottom: '1rem', backgroundColor: 'var(--error-light)', color: 'var(--error-dark)' }}>
          {error}
        </ResponsiveCard>
      )}
      
      {showForm && (
        <Form onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <FormLabel htmlFor="name">
                <TranslatedText i18nKey="guests.name" defaultText="Name" />*
              </FormLabel>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="email">
                <TranslatedText i18nKey="guests.email" defaultText="Email" />
              </FormLabel>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleChange}
              />
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <FormLabel htmlFor="phone">
                <TranslatedText i18nKey="guests.phone" defaultText="Phone" />
              </FormLabel>
              <Input
                id="phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="status">
                <TranslatedText i18nKey="guests.status" defaultText="Status" />*
              </FormLabel>
              <Select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="pending">
                  <TranslatedText i18nKey="guests.status.pending" defaultText="Pending" />
                </option>
                <option value="confirmed">
                  <TranslatedText i18nKey="guests.status.confirmed" defaultText="Confirmed" />
                </option>
                <option value="declined">
                  <TranslatedText i18nKey="guests.status.declined" defaultText="Declined" />
                </option>
              </Select>
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <FormLabel htmlFor="dietaryRestrictions">
                <TranslatedText i18nKey="guests.dietaryRestrictions" defaultText="Dietary Restrictions" />
              </FormLabel>
              <Input
                id="dietaryRestrictions"
                name="dietaryRestrictions"
                value={formData.dietaryRestrictions || ''}
                onChange={handleChange}
              />
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <FormLabel htmlFor="notes">
                <TranslatedText i18nKey="guests.notes" defaultText="Notes" />
              </FormLabel>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes || ''}
                onChange={handleChange}
              />
            </FormGroup>
          </FormRow>
          
          <Checkbox>
            <Input
              id="plusOne"
              name="plusOne"
              type="checkbox"
              checked={formData.plusOne}
              onChange={handleChange}
              style={{ width: 'auto' }}
            />
            <FormLabel htmlFor="plusOne" style={{ marginBottom: 0 }}>
              <TranslatedText i18nKey="guests.plusOne" defaultText="Plus One" />
            </FormLabel>
          </Checkbox>
          
          <ButtonGroup>
            <CancelButton type="button" onClick={handleCancel}>
              <TranslatedText i18nKey="common.cancel" defaultText="Cancel" />
            </CancelButton>
            <SubmitButton type="submit">
              {editingId ? 
                <TranslatedText i18nKey="common.update" defaultText="Update" /> : 
                <TranslatedText i18nKey="common.save" defaultText="Save" />
              }
            </SubmitButton>
          </ButtonGroup>
        </Form>
      )}
      
      {loading ? (
        <p><TranslatedText i18nKey="common.loading" defaultText="Loading..." /></p>
      ) : guests.length === 0 ? (
        <ResponsiveCard>
          <TranslatedText i18nKey="guests.noGuests" defaultText="No guests added yet. Click 'Add Guest' to get started." />
        </ResponsiveCard>
      ) : (
        <ResponsiveTable
          data={guests}
          columns={[
            { 
              header: <TranslatedText i18nKey="guests.name" defaultText="Name" />, 
              accessor: 'name' 
            },
            { 
              header: <TranslatedText i18nKey="guests.email" defaultText="Email" />, 
              accessor: 'email',
              cell: (value) => value || '-'
            },
            { 
              header: <TranslatedText i18nKey="guests.phone" defaultText="Phone" />, 
              accessor: 'phone',
              cell: (value) => value || '-'
            },
            { 
              header: <TranslatedText i18nKey="guests.status" defaultText="Status" />, 
              accessor: 'status',
              cell: (value) => renderStatus(value)
            },
            { 
              header: <TranslatedText i18nKey="guests.plusOne" defaultText="Plus One" />, 
              accessor: 'plusOne',
              cell: (value) => value ? 'Yes' : 'No'
            },
            { 
              header: <TranslatedText i18nKey="common.actions" defaultText="Actions" />, 
              accessor: 'id',
              cell: (_, rowData) => renderActions(rowData as Guest)
            }
          ]}
        />
      )}
    </Container>
  );
};

export default GuestManagement;
