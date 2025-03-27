import { render, screen, fireEvent } from '@testing-library/react';
import TablePlanner from '@/components/sections/TablePlanner';

// Mock der Drag-and-Drop-Funktionalität
jest.mock('react-dnd', () => ({
  useDrag: () => [{ isDragging: false }, jest.fn()],
  useDrop: () => [{}, jest.fn()],
  DndProvider: ({ children }) => children,
}));

jest.mock('react-dnd-html5-backend', () => ({
  HTML5Backend: jest.fn(),
}));

describe('TablePlanner', () => {
  const mockTables = [
    { id: '1', name: 'Tisch 1', shape: 'round', size: 'medium', position: { x: 100, y: 100 }, seats: 8 },
    { id: '2', name: 'Tisch 2', shape: 'rectangular', size: 'large', position: { x: 300, y: 200 }, seats: 12 },
  ];

  const mockGuests = [
    { id: '1', name: 'Max Mustermann', tableId: '1', seatId: '1-1' },
    { id: '2', name: 'Anna Beispiel', tableId: '1', seatId: '1-2' },
    { id: '3', name: 'John Doe', tableId: null, seatId: null },
  ];

  test('renders table planner with tables', () => {
    render(
      <TablePlanner 
        tables={mockTables} 
        guests={mockGuests} 
        onTableAdd={jest.fn()} 
        onTableMove={jest.fn()} 
        onGuestAssign={jest.fn()} 
      />
    );
    
    expect(screen.getByText('Tisch 1')).toBeInTheDocument();
    expect(screen.getByText('Tisch 2')).toBeInTheDocument();
  });

  test('renders unassigned guests list', () => {
    render(
      <TablePlanner 
        tables={mockTables} 
        guests={mockGuests} 
        onTableAdd={jest.fn()} 
        onTableMove={jest.fn()} 
        onGuestAssign={jest.fn()} 
      />
    );
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('allows adding a new table', () => {
    const mockOnTableAdd = jest.fn();
    
    render(
      <TablePlanner 
        tables={mockTables} 
        guests={mockGuests} 
        onTableAdd={mockOnTableAdd} 
        onTableMove={jest.fn()} 
        onGuestAssign={jest.fn()} 
      />
    );
    
    const addButton = screen.getByText('Tisch hinzufügen');
    fireEvent.click(addButton);
    
    expect(mockOnTableAdd).toHaveBeenCalled();
  });
});
