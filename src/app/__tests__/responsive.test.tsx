import { render, screen } from '@testing-library/react';
import { useMediaQuery } from 'react-responsive';

// Mock components
import TablePlanner from '@/components/sections/TablePlanner';
import GuestManagement from '@/components/sections/GuestManagement';
import BudgetPlanner from '@/components/sections/BudgetPlanner';
import Moodboard from '@/components/sections/Moodboard';
import PhotoGallery from '@/components/sections/PhotoGallery';

// Mock react-responsive
jest.mock('react-responsive', () => ({
  useMediaQuery: jest.fn()
}));

describe('Responsive Design Tests', () => {
  const mockTables = [{ id: '1', name: 'Tisch 1', shape: 'round', size: 'medium', position: { x: 100, y: 100 }, seats: 8 }];
  const mockGuests = [{ id: '1', name: 'Max Mustermann', tableId: null, seatId: null }];
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });
  
  test('TablePlanner adapts to mobile view', () => {
    // Mock mobile view
    (useMediaQuery as jest.Mock).mockReturnValue(true);
    
    render(
      <TablePlanner 
        tables={mockTables} 
        guests={mockGuests} 
        onTableAdd={jest.fn()} 
        onTableMove={jest.fn()} 
        onGuestAssign={jest.fn()} 
      />
    );
    
    // Check if mobile class is applied
    const container = screen.getByTestId('table-planner-container');
    expect(container).toHaveClass('mobile-view');
  });
  
  test('TablePlanner adapts to desktop view', () => {
    // Mock desktop view
    (useMediaQuery as jest.Mock).mockReturnValue(false);
    
    render(
      <TablePlanner 
        tables={mockTables} 
        guests={mockGuests} 
        onTableAdd={jest.fn()} 
        onTableMove={jest.fn()} 
        onGuestAssign={jest.fn()} 
      />
    );
    
    // Check if desktop class is applied
    const container = screen.getByTestId('table-planner-container');
    expect(container).toHaveClass('desktop-view');
  });
  
  test('GuestManagement adapts to mobile view', () => {
    // Mock mobile view
    (useMediaQuery as jest.Mock).mockReturnValue(true);
    
    render(
      <GuestManagement 
        guests={mockGuests} 
        onGuestAdd={jest.fn()} 
        onGuestEdit={jest.fn()} 
        onGuestDelete={jest.fn()} 
        onSendInvitation={jest.fn()}
      />
    );
    
    // Check if mobile class is applied
    const container = screen.getByTestId('guest-management-container');
    expect(container).toHaveClass('mobile-view');
  });
  
  test('BudgetPlanner adapts to mobile view', () => {
    // Mock mobile view
    (useMediaQuery as jest.Mock).mockReturnValue(true);
    
    const mockCategories = [{ 
      id: '1', 
      name: 'Location', 
      budget: 5000, 
      spent: 4500,
      expenses: []
    }];
    
    render(
      <BudgetPlanner 
        categories={mockCategories} 
        totalBudget={10000}
        onCategoryAdd={jest.fn()} 
        onCategoryEdit={jest.fn()} 
        onCategoryDelete={jest.fn()} 
        onExpenseAdd={jest.fn()}
        onExpenseEdit={jest.fn()}
        onExpenseDelete={jest.fn()}
      />
    );
    
    // Check if mobile class is applied
    const container = screen.getByTestId('budget-planner-container');
    expect(container).toHaveClass('mobile-view');
  });
});
