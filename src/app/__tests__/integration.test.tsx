import { render, screen } from '@testing-library/react';
import App from '@/app/page';

// Mock the components
jest.mock('@/components/sections/TablePlanner', () => {
  return function MockTablePlanner() {
    return <div data-testid="table-planner">TablePlanner Mock</div>;
  };
});

jest.mock('@/components/sections/GuestManagement', () => {
  return function MockGuestManagement() {
    return <div data-testid="guest-management">GuestManagement Mock</div>;
  };
});

jest.mock('@/components/sections/BudgetPlanner', () => {
  return function MockBudgetPlanner() {
    return <div data-testid="budget-planner">BudgetPlanner Mock</div>;
  };
});

describe('App Integration', () => {
  test('renders main components', () => {
    render(<App />);
    
    expect(screen.getByTestId('table-planner')).toBeInTheDocument();
    expect(screen.getByTestId('guest-management')).toBeInTheDocument();
    expect(screen.getByTestId('budget-planner')).toBeInTheDocument();
  });

  test('renders navigation', () => {
    render(<App />);
    
    expect(screen.getByText('Tischplan')).toBeInTheDocument();
    expect(screen.getByText('Gäste')).toBeInTheDocument();
    expect(screen.getByText('Budget')).toBeInTheDocument();
  });
});
