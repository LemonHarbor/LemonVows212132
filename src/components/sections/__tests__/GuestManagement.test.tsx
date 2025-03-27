import { render, screen, fireEvent } from '@testing-library/react';
import GuestManagement from '@/components/sections/GuestManagement';

describe('GuestManagement', () => {
  const mockGuests = [
    { 
      id: '1', 
      firstName: 'Max', 
      lastName: 'Mustermann', 
      email: 'max@example.com', 
      rsvpStatus: 'confirmed', 
      group: 'Familie', 
      dietaryRestrictions: ['Vegetarisch'],
      plusOne: false,
      accommodation: true
    },
    { 
      id: '2', 
      firstName: 'Anna', 
      lastName: 'Beispiel', 
      email: 'anna@example.com', 
      rsvpStatus: 'pending', 
      group: 'Freunde', 
      dietaryRestrictions: [],
      plusOne: true,
      accommodation: false
    },
    { 
      id: '3', 
      firstName: 'John', 
      lastName: 'Doe', 
      email: 'john@example.com', 
      rsvpStatus: 'declined', 
      group: 'Arbeit', 
      dietaryRestrictions: ['Laktosefrei'],
      plusOne: false,
      accommodation: false
    },
  ];

  test('renders guest list with all guests', () => {
    render(
      <GuestManagement 
        guests={mockGuests} 
        onGuestAdd={jest.fn()} 
        onGuestEdit={jest.fn()} 
        onGuestDelete={jest.fn()} 
        onSendInvitation={jest.fn()}
      />
    );
    
    expect(screen.getByText('Max Mustermann')).toBeInTheDocument();
    expect(screen.getByText('Anna Beispiel')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('allows filtering guests by RSVP status', () => {
    render(
      <GuestManagement 
        guests={mockGuests} 
        onGuestAdd={jest.fn()} 
        onGuestEdit={jest.fn()} 
        onGuestDelete={jest.fn()} 
        onSendInvitation={jest.fn()}
      />
    );
    
    // Filter by confirmed status
    const filterSelect = screen.getByLabelText('RSVP-Status');
    fireEvent.change(filterSelect, { target: { value: 'confirmed' } });
    
    // Should show only Max Mustermann
    expect(screen.getByText('Max Mustermann')).toBeInTheDocument();
    expect(screen.queryByText('Anna Beispiel')).not.toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  test('allows adding a new guest', () => {
    const mockOnGuestAdd = jest.fn();
    
    render(
      <GuestManagement 
        guests={mockGuests} 
        onGuestAdd={mockOnGuestAdd} 
        onGuestEdit={jest.fn()} 
        onGuestDelete={jest.fn()} 
        onSendInvitation={jest.fn()}
      />
    );
    
    const addButton = screen.getByText('Gast hinzufügen');
    fireEvent.click(addButton);
    
    expect(mockOnGuestAdd).toHaveBeenCalled();
  });

  test('displays guest details when a guest is selected', () => {
    render(
      <GuestManagement 
        guests={mockGuests} 
        onGuestAdd={jest.fn()} 
        onGuestEdit={jest.fn()} 
        onGuestDelete={jest.fn()} 
        onSendInvitation={jest.fn()}
      />
    );
    
    // Click on a guest to view details
    const guestRow = screen.getByText('Max Mustermann').closest('tr');
    fireEvent.click(guestRow);
    
    // Check if details are displayed
    expect(screen.getByText('E-Mail:')).toBeInTheDocument();
    expect(screen.getByText('max@example.com')).toBeInTheDocument();
    expect(screen.getByText('RSVP-Status:')).toBeInTheDocument();
    expect(screen.getByText('Bestätigt')).toBeInTheDocument();
    expect(screen.getByText('Gruppe:')).toBeInTheDocument();
    expect(screen.getByText('Familie')).toBeInTheDocument();
    expect(screen.getByText('Ernährungseinschränkungen:')).toBeInTheDocument();
    expect(screen.getByText('Vegetarisch')).toBeInTheDocument();
  });
});
