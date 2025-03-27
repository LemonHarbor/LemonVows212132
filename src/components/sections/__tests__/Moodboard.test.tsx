import { render, screen, fireEvent } from '@testing-library/react';
import Moodboard from '@/components/sections/Moodboard';

// Mock der Drag-and-Drop-Funktionalität
jest.mock('react-dnd', () => ({
  useDrag: () => [{ isDragging: false }, jest.fn()],
  useDrop: () => [{}, jest.fn()],
  DndProvider: ({ children }) => children,
}));

jest.mock('react-dnd-html5-backend', () => ({
  HTML5Backend: jest.fn(),
}));

describe('Moodboard', () => {
  const mockCollections = [
    { 
      id: '1', 
      name: 'Farbschema', 
      items: [
        { id: '1-1', type: 'color', value: '#FFD700', position: { x: 100, y: 100 }, size: { width: 100, height: 100 } },
        { id: '1-2', type: 'color', value: '#87CEEB', position: { x: 220, y: 100 }, size: { width: 100, height: 100 } },
      ]
    },
    { 
      id: '2', 
      name: 'Blumen', 
      items: [
        { id: '2-1', type: 'image', src: '/images/flower1.jpg', position: { x: 100, y: 100 }, size: { width: 200, height: 150 } },
      ]
    },
  ];

  test('renders moodboard collections', () => {
    render(
      <Moodboard 
        collections={mockCollections} 
        onCollectionAdd={jest.fn()} 
        onCollectionEdit={jest.fn()} 
        onCollectionDelete={jest.fn()} 
        onItemAdd={jest.fn()}
        onItemEdit={jest.fn()}
        onItemDelete={jest.fn()}
        onItemMove={jest.fn()}
        onItemResize={jest.fn()}
      />
    );
    
    expect(screen.getByText('Farbschema')).toBeInTheDocument();
    expect(screen.getByText('Blumen')).toBeInTheDocument();
  });

  test('allows adding a new collection', () => {
    const mockOnCollectionAdd = jest.fn();
    
    render(
      <Moodboard 
        collections={mockCollections} 
        onCollectionAdd={mockOnCollectionAdd} 
        onCollectionEdit={jest.fn()} 
        onCollectionDelete={jest.fn()} 
        onItemAdd={jest.fn()}
        onItemEdit={jest.fn()}
        onItemDelete={jest.fn()}
        onItemMove={jest.fn()}
        onItemResize={jest.fn()}
      />
    );
    
    const addButton = screen.getByText('Sammlung hinzufügen');
    fireEvent.click(addButton);
    
    expect(mockOnCollectionAdd).toHaveBeenCalled();
  });

  test('displays collection items when a collection is selected', () => {
    render(
      <Moodboard 
        collections={mockCollections} 
        onCollectionAdd={jest.fn()} 
        onCollectionEdit={jest.fn()} 
        onCollectionDelete={jest.fn()} 
        onItemAdd={jest.fn()}
        onItemEdit={jest.fn()}
        onItemDelete={jest.fn()}
        onItemMove={jest.fn()}
        onItemResize={jest.fn()}
      />
    );
    
    // Click on a collection to view items
    const collectionTab = screen.getByText('Farbschema');
    fireEvent.click(collectionTab);
    
    // Check if color items are rendered (we can't directly check for the colors,
    // but we can check for the color item containers)
    const colorItems = document.querySelectorAll('.color-item');
    expect(colorItems.length).toBe(2);
  });

  test('allows adding a new item to a collection', () => {
    const mockOnItemAdd = jest.fn();
    
    render(
      <Moodboard 
        collections={mockCollections} 
        onCollectionAdd={jest.fn()} 
        onCollectionEdit={jest.fn()} 
        onCollectionDelete={jest.fn()} 
        onItemAdd={mockOnItemAdd}
        onItemEdit={jest.fn()}
        onItemDelete={jest.fn()}
        onItemMove={jest.fn()}
        onItemResize={jest.fn()}
      />
    );
    
    // Click on a collection to view items
    const collectionTab = screen.getByText('Farbschema');
    fireEvent.click(collectionTab);
    
    // Click on add item button
    const addItemButton = screen.getByText('Element hinzufügen');
    fireEvent.click(addItemButton);
    
    expect(mockOnItemAdd).toHaveBeenCalledWith('1'); // Called with collection ID
  });
});
