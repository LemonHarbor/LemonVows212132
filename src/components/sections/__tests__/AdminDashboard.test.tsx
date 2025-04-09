import { render, screen, fireEvent } from '@testing-library/react';
import AdminDashboard from '@/components/sections/AdminDashboard';

describe('AdminDashboard', () => {
  const mockUsers = [
    { 
      id: '1', 
      name: 'Max Mustermann', 
      email: 'max@example.com', 
      plan: 'premium',
      createdAt: '2025-01-15T10:30:00Z',
      weddings: [
        { id: '1-1', name: 'Hochzeit Max & Anna', date: '2025-06-15', guests: 120 }
      ]
    },
    { 
      id: '2', 
      name: 'John Doe', 
      email: 'john@example.com', 
      plan: 'basic',
      createdAt: '2025-02-10T14:45:00Z',
      weddings: [
        { id: '2-1', name: 'Hochzeit John & Jane', date: '2025-08-22', guests: 45 }
      ]
    },
  ];

  const mockStats = {
    totalUsers: 25,
    activeWeddings: 18,
    totalRevenue: 1250.75,
    userGrowth: 15,
    revenueGrowth: 22
  };

  test('renders admin dashboard with statistics', () => {
    render(
      <AdminDashboard 
        users={mockUsers} 
        stats={mockStats}
        onUserAdd={jest.fn()} 
        onUserEdit={jest.fn()} 
        onUserDelete={jest.fn()} 
        onWeddingManage={jest.fn()}
      />
    );
    
    expect(screen.getByText('Benutzer insgesamt:')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('Aktive Hochzeiten:')).toBeInTheDocument();
    expect(screen.getByText('18')).toBeInTheDocument();
    expect(screen.getByText('Gesamtumsatz:')).toBeInTheDocument();
    expect(screen.getByText('1.250,75 €')).toBeInTheDocument();
  });

  test('renders user list', () => {
    render(
      <AdminDashboard 
        users={mockUsers} 
        stats={mockStats}
        onUserAdd={jest.fn()} 
        onUserEdit={jest.fn()} 
        onUserDelete={jest.fn()} 
        onWeddingManage={jest.fn()}
      />
    );
    
    expect(screen.getByText('Max Mustermann')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('allows adding a new user', () => {
    const mockOnUserAdd = jest.fn();
    
    render(
      <AdminDashboard 
        users={mockUsers} 
        stats={mockStats}
        onUserAdd={mockOnUserAdd} 
        onUserEdit={jest.fn()} 
        onUserDelete={jest.fn()} 
        onWeddingManage={jest.fn()}
      />
    );
    
    const addButton = screen.getByText('Benutzer hinzufügen');
    fireEvent.click(addButton);
    
    expect(mockOnUserAdd).toHaveBeenCalled();
  });

  test('displays user details when a user is selected', () => {
    render(
      <AdminDashboard 
        users={mockUsers} 
        stats={mockStats}
        onUserAdd={jest.fn()} 
        onUserEdit={jest.fn()} 
        onUserDelete={jest.fn()} 
        onWeddingManage={jest.fn()}
      />
    );
    
    // Click on a user to view details
    const userRow = screen.getByText('Max Mustermann').closest('tr');
    fireEvent.click(userRow);
    
    // Check if details are displayed
    expect(screen.getByText('E-Mail:')).toBeInTheDocument();
    expect(screen.getByText('max@example.com')).toBeInTheDocument();
    expect(screen.getByText('Plan:')).toBeInTheDocument();
    expect(screen.getByText('Premium')).toBeInTheDocument();
    expect(screen.getByText('Hochzeiten:')).toBeInTheDocument();
    expect(screen.getByText('Hochzeit Max & Anna')).toBeInTheDocument();
  });

  test('allows managing a wedding', () => {
    const mockOnWeddingManage = jest.fn();
    
    render(
      <AdminDashboard 
        users={mockUsers} 
        stats={mockStats}
        onUserAdd={jest.fn()} 
        onUserEdit={jest.fn()} 
        onUserDelete={jest.fn()} 
        onWeddingManage={mockOnWeddingManage}
      />
    );
    
    // Click on a user to view details
    const userRow = screen.getByText('Max Mustermann').closest('tr');
    fireEvent.click(userRow);
    
    // Click on manage wedding button
    const manageButton = screen.getByText('Hochzeit verwalten');
    fireEvent.click(manageButton);
    
    expect(mockOnWeddingManage).toHaveBeenCalledWith('1-1');
  });
});
