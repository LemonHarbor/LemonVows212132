import { render, screen, fireEvent } from '@testing-library/react';
import BudgetPlanner from '@/components/sections/BudgetPlanner';

describe('BudgetPlanner', () => {
  const mockCategories = [
    { 
      id: '1', 
      name: 'Location', 
      budget: 5000, 
      spent: 4500,
      expenses: [
        { id: '1-1', name: 'Anzahlung', amount: 1500, date: '2025-01-15', paid: true },
        { id: '1-2', name: 'Restzahlung', amount: 3000, date: '2025-05-01', paid: true },
      ]
    },
    { 
      id: '2', 
      name: 'Catering', 
      budget: 3000, 
      spent: 1000,
      expenses: [
        { id: '2-1', name: 'Anzahlung', amount: 1000, date: '2025-02-10', paid: true },
      ]
    },
    { 
      id: '3', 
      name: 'Dekoration', 
      budget: 1000, 
      spent: 0,
      expenses: []
    },
  ];

  test('renders budget categories', () => {
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
    
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Catering')).toBeInTheDocument();
    expect(screen.getByText('Dekoration')).toBeInTheDocument();
  });

  test('displays budget summary', () => {
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
    
    expect(screen.getByText('Gesamtbudget:')).toBeInTheDocument();
    expect(screen.getByText('10.000,00 €')).toBeInTheDocument();
    expect(screen.getByText('Ausgegeben:')).toBeInTheDocument();
    expect(screen.getByText('5.500,00 €')).toBeInTheDocument();
    expect(screen.getByText('Verbleibend:')).toBeInTheDocument();
    expect(screen.getByText('4.500,00 €')).toBeInTheDocument();
  });

  test('allows adding a new category', () => {
    const mockOnCategoryAdd = jest.fn();
    
    render(
      <BudgetPlanner 
        categories={mockCategories} 
        totalBudget={10000}
        onCategoryAdd={mockOnCategoryAdd} 
        onCategoryEdit={jest.fn()} 
        onCategoryDelete={jest.fn()} 
        onExpenseAdd={jest.fn()}
        onExpenseEdit={jest.fn()}
        onExpenseDelete={jest.fn()}
      />
    );
    
    const addButton = screen.getByText('Kategorie hinzufügen');
    fireEvent.click(addButton);
    
    expect(mockOnCategoryAdd).toHaveBeenCalled();
  });

  test('displays category details when a category is selected', () => {
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
    
    // Click on a category to view details
    const categoryRow = screen.getByText('Location').closest('tr');
    fireEvent.click(categoryRow);
    
    // Check if expenses are displayed
    expect(screen.getByText('Anzahlung')).toBeInTheDocument();
    expect(screen.getByText('1.500,00 €')).toBeInTheDocument();
    expect(screen.getByText('Restzahlung')).toBeInTheDocument();
    expect(screen.getByText('3.000,00 €')).toBeInTheDocument();
  });
});
