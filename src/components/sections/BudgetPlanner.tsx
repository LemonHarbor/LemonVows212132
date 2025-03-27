import React from 'react';
import { useTranslation } from 'next-i18next';
import { Button } from '@/components/ui/Button';

interface BudgetCategory {
  id: string;
  name: string;
  plannedAmount: number;
  color?: string;
}

interface BudgetExpense {
  id: string;
  categoryId: string;
  description: string;
  amount: number;
  date: string;
  paid: boolean;
  receipt?: string;
  notes?: string;
}

const BudgetPlanner: React.FC = () => {
  const { t } = useTranslation('common');
  const [totalBudget, setTotalBudget] = React.useState(20000);
  const [categories, setCategories] = React.useState<BudgetCategory[]>([]);
  const [expenses, setExpenses] = React.useState<BudgetExpense[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [selectedExpense, setSelectedExpense] = React.useState<string | null>(null);
  const [_showAddExpenseModal, _setShowAddExpenseModal] = React.useState(false);
  const [_showAddCategoryModal, _setShowAddCategoryModal] = React.useState(false);
  const [editingExpense, setEditingExpense] = React.useState<BudgetExpense | null>(null);
  const [editingCategory, setEditingCategory] = React.useState<BudgetCategory | null>(null);
  const [filterPaid, setFilterPaid] = React.useState<boolean | null>(null);
  const [sortKey, setSortKey] = React.useState('date');
  const [sortDirection, setSortDirection] = React.useState('desc');

  // Initialisiere Standardkategorien, wenn keine vorhanden sind
  React.useEffect(() => {
    if (categories.length === 0) {
      const defaultCategories: BudgetCategory[] = [
        { id: 'cat-1', name: t('budgetPlanner.categories.venue'), plannedAmount: 8000, color: '#FF5A5F' },
        { id: 'cat-2', name: t('budgetPlanner.categories.catering'), plannedAmount: 5000, color: '#00A699' },
        { id: 'cat-3', name: t('budgetPlanner.categories.attire'), plannedAmount: 2000, color: '#FC642D' },
        { id: 'cat-4', name: t('budgetPlanner.categories.photography'), plannedAmount: 2500, color: '#767676' },
        { id: 'cat-5', name: t('budgetPlanner.categories.music'), plannedAmount: 1000, color: '#FFBD00' },
        { id: 'cat-6', name: t('budgetPlanner.categories.decoration'), plannedAmount: 800, color: '#7B0051' },
        { id: 'cat-7', name: t('budgetPlanner.categories.invitations'), plannedAmount: 300, color: '#00D1C1' },
        { id: 'cat-8', name: t('budgetPlanner.categories.transportation'), plannedAmount: 400, color: '#8CE071' },
      ];
      setCategories(defaultCategories);
    }
  }, [t]);

  // Berechnete Werte
  const totalSpent = React.useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const remainingBudget = totalBudget - totalSpent;
  const budgetProgress = (totalSpent / totalBudget) * 100;
  const isOverBudget = totalSpent > totalBudget;

  // Ausgaben nach Kategorie
  const expensesByCategory = React.useMemo(() => {
    const result: Record<string, number> = {};
    categories.forEach(category => {
      result[category.id] = 0;
    });
    
    expenses.forEach(expense => {
      if (result[expense.categoryId] !== undefined) {
        result[expense.categoryId] += expense.amount;
      }
    });
    
    return result;
  }, [categories, expenses]);

  // Kategorie-Fortschritt
  const categoryProgress = React.useMemo(() => {
    const result: Record<string, { spent: number, percentage: number, isOver: boolean }> = {};
    
    categories.forEach(category => {
      const spent = expensesByCategory[category.id] || 0;
      const percentage = category.plannedAmount > 0 
        ? (spent / category.plannedAmount) * 100 
        : 0;
      
      result[category.id] = {
        spent,
        percentage,
        isOver: spent > category.plannedAmount
      };
    });
    
    return result;
  }, [categories, expensesByCategory]);

  // Gefilterte und sortierte Ausgaben
  const filteredAndSortedExpenses = React.useMemo(() => {
    let filtered = [...expenses];
    
    // Nach Kategorie filtern
    if (selectedCategory) {
      filtered = filtered.filter(expense => expense.categoryId === selectedCategory);
    }
    
    // Nach Bezahlstatus filtern
    if (filterPaid !== null) {
      filtered = filtered.filter(expense => expense.paid === filterPaid);
    }
    
    // Sortieren
    return filtered.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortKey) {
        case 'date':
          valueA = new Date(a.date).getTime();
          valueB = new Date(b.date).getTime();
          break;
        case 'amount':
          valueA = a.amount;
          valueB = b.amount;
          break;
        case 'description':
          valueA = a.description.toLowerCase();
          valueB = b.description.toLowerCase();
          break;
        case 'category':
          const categoryA = categories.find(c => c.id === a.categoryId)?.name || '';
          const categoryB = categories.find(c => c.id === b.categoryId)?.name || '';
          valueA = categoryA.toLowerCase();
          valueB = categoryB.toLowerCase();
          break;
        default:
          valueA = new Date(a.date).getTime();
          valueB = new Date(b.date).getTime();
      }
      
      if (sortDirection === 'asc') {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    });
  }, [expenses, selectedCategory, filterPaid, sortKey, sortDirection, categories]);

  // Sortierung ändern
  const sortBy = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  // Kategorie auswählen
  const selectCategory = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setSelectedExpense(null);
  };

  // Ausgabe auswählen
  const selectExpense = (expenseId: string) => {
    setSelectedExpense(expenseId);
  };

  // Ausgabe bearbeiten
  const editExpense = (expenseId: string) => {
    const expense = expenses.find(e => e.id === expenseId);
    if (expense) {
    setEditingExpense({ ...expense });
    _setShowAddExpenseModal(true);
    }
  };

  // Kategorie bearbeiten
  const editCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setEditingCategory({ ...category });
      _setShowAddCategoryModal(true);
    }
  };

  // Ausgabe löschen
  const deleteExpense = (expenseId: string) => {
    if (window.confirm(t('budgetPlanner.confirmDeleteExpense'))) {
      setExpenses(expenses.filter(expense => expense.id !== expenseId));
      if (selectedExpense === expenseId) {
        setSelectedExpense(null);
      }
    }
  };

  // Kategorie löschen
  const deleteCategory = (categoryId: string) => {
    if (window.confirm(t('budgetPlanner.confirmDeleteCategory'))) {
      // Prüfen, ob Ausgaben mit dieser Kategorie existieren
      const hasExpenses = expenses.some(expense => expense.categoryId === categoryId);
      
      if (hasExpenses) {
        alert(t('budgetPlanner.cannotDeleteCategoryWithExpenses'));
        return;
      }
      
      setCategories(categories.filter(category => category.id !== categoryId));
      if (selectedCategory === categoryId) {
        setSelectedCategory(null);
      }
    }
  };

  // Ausgabe hinzufügen/bearbeiten Modal anzeigen
  const handleShowAddExpenseModal = () => {
    setEditingExpense(null);
    _setShowAddExpenseModal(true);
  };

  // Kategorie hinzufügen/bearbeiten Modal anzeigen
  const handleShowAddCategoryModal = () => {
    setEditingCategory(null);
    _setShowAddCategoryModal(true);
  };

  // Ausgabe speichern (hinzufügen oder aktualisieren)
  const saveExpense = (expense: BudgetExpense) => {
    if (editingExpense) {
      // Ausgabe aktualisieren
      setExpenses(expenses.map(e => e.id === expense.id ? expense : e));
    } else {
      // Neue Ausgabe hinzufügen
      setExpenses([...expenses, { ...expense, id: `expense-${Date.now()}` }]);
    }
    _setShowAddExpenseModal(false);
    setEditingExpense(null);
  };

  // Kategorie speichern (hinzufügen oder aktualisieren)
  const saveCategory = (category: BudgetCategory) => {
    if (editingCategory) {
      // Kategorie aktualisieren
      setCategories(categories.map(c => c.id === category.id ? category : c));
    } else {
      // Neue Kategorie hinzufügen
      setCategories([...categories, { ...category, id: `cat-${Date.now()}` }]);
    }
    _setShowAddCategoryModal(false);
    setEditingCategory(null);
  };

  // Formatiere Währung
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Formatiere Datum
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  return (
    <div className="budget-planner">
      <div className="budget-planner__header">
        <h1>{t('budgetPlanner.title')}</h1>
        <p>{t('budgetPlanner.description')}</p>
        
        <div className="budget-planner__controls">
          <div className="budget-planner__total-budget">
            <label>{t('budgetPlanner.totalBudget')}</label>
            <input 
              type="number"
              value={totalBudget}
              onChange={(e) => setTotalBudget(parseFloat(e.target.value) || 0)}
              className="input"
            />
          </div>
          
          <Button onClick={handleShowAddExpenseModal}>
            {t('budgetPlanner.addExpense')}
          </Button>
          
          <Button 
            variant="secondary"
            onClick={handleShowAddCategoryModal}
          >
            {t('budgetPlanner.addCategory')}
          </Button>
        </div>
      </div>
      
      <div className="budget-planner__overview">
        <div className="budget-planner__summary">
          <div className="budget-planner__summary-item">
            <div className="budget-planner__summary-label">{t('budgetPlanner.totalBudget')}</div>
            <div className="budget-planner__summary-value">{formatCurrency(totalBudget)}</div>
          </div>
          
          <div className="budget-planner__summary-item">
            <div className="budget-planner__summary-label">{t('budgetPlanner.spent')}</div>
            <div className="budget-planner__summary-value">{formatCurrency(totalSpent)}</div>
          </div>
          
          <div className="budget-planner__summary-item">
            <div className="budget-planner__summary-label">{t('budgetPlanner.remaining')}</div>
            <div className={`budget-planner__summary-value ${isOverBudget ? 'over-budget' : ''}`}>
              {formatCurrency(remainingBudget)}
            </div>
          </div>
        </div>
        
        <div className="budget-planner__progress">
          <div className="budget-planner__progress-bar">
            <div 
              className={`budget-planner__progress-fill ${isOverBudget ? 'over-budget' : ''}`}
              style={{ width: `${Math.min(budgetProgress, 100)}%` }}
            ></div>
          </div>
          <div className="budget-planner__progress-label">
            {budgetProgress.toFixed(1)}% {isOverBudget ? t('budgetPlanner.overBudget') : ''}
          </div>
        </div>
      </div>
      
      <div className="budget-planner__content">
        <div className="budget-planner__categories">
          <h3>{t('budgetPlanner.categories')}</h3>
          
          <div className="budget-planner__category-list">
            <div 
              className={`budget-planner__category-item ${selectedCategory === null ? 'active' : ''}`}
              onClick={() => selectCategory(null)}
            >
              <div className="budget-planner__category-name">{t('budgetPlanner.allCategories')}</div>
              <div className="budget-planner__category-amount">
                {formatCurrency(totalSpent)} / {formatCurrency(totalBudget)}
              </div>
              <div className="budget-planner__category-progress">
                <div className="budget-planner__category-progress-bar">
                  <div 
                    className={`budget-planner__category-progress-fill ${isOverBudget ? 'over-budget' : ''}`}
                    style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {categories.map(category => {
              const progress = categoryProgress[category.id];
              
              return (
                <div 
                  key={category.id}
                  className={`budget-planner__category-item ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => selectCategory(category.id)}
                >
                  <div className="budget-planner__category-color" style={{ backgroundColor: category.color }}></div>
                  <div className="budget-planner__category-name">{category.name}</div>
                  <div className="budget-planner__category-amount">
                    {formatCurrency(progress.spent)} / {formatCurrency(category.plannedAmount)}
                  </div>
                  <div className="budget-planner__category-progress">
                    <div className="budget-planner__category-progress-bar">
                      <div 
                        className={`budget-planner__category-progress-fill ${progress.isOver ? 'over-budget' : ''}`}
                        style={{ 
                          width: `${Math.min(progress.percentage, 100)}%`,
                          backgroundColor: category.color 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="budget-planner__category-actions">
                    <button 
                      className="btn-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        editCategory(category.id);
                      }}
                    >
                      <span role="img" aria-label="Edit">✏️</span>
                    </button>
                    
                    <button 
                      className="btn-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCategory(category.id);
                      }}
                    >
                      <span role="img" aria-label="Delete">🗑️</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="budget-planner__expenses">
          <div className="budget-planner__expenses-header">
            <h3>
              {selectedCategory 
                ? `${t('budgetPlanner.expensesFor')} ${categories.find(c => c.id === selectedCategory)?.name}`
                : t('budgetPlanner.allExpenses')
              }
            </h3>
            
            <div className="budget-planner__expenses-filters">
              <div className="budget-planner__filter-group">
                <label>{t('budgetPlanner.filterByStatus')}</label>
                <select 
                  value={filterPaid === null ? 'all' : filterPaid ? 'paid' : 'unpaid'}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFilterPaid(value === 'all' ? null : value === 'paid');
                  }}
                  className="select"
                >
                  <option value="all">{t('budgetPlanner.all')}</option>
                  <option value="paid">{t('budgetPlanner.paid')}</option>
                  <option value="unpaid">{t('budgetPlanner.unpaid')}</option>
                </select>
              </div>
              
              <Button 
                variant="secondary"
                onClick={handleShowAddExpenseModal}
              >
                {t('budgetPlanner.addExpense')}
              </Button>
            </div>
          </div>
          
          <div className="budget-planner__expenses-table-container">
            <table className="budget-planner__expenses-table">
              <thead>
                <tr>
                  <th onClick={() => sortBy('date')}>
                    {t('budgetPlanner.date')}
                    {sortKey === 'date' && (
                      <span className="sort-icon">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th onClick={() => sortBy('description')}>
                    {t('budgetPlanner.description')}
                    {sortKey === 'description' && (
                      <span className="sort-icon">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th onClick={() => sortBy('category')}>
                    {t('budgetPlanner.category')}
                    {sortKey === 'category' && (
                      <span className="sort-icon">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th onClick={() => sortBy('amount')}>
                    {t('budgetPlanner.amount')}
                    {sortKey === 'amount' && (
                      <span className="sort-icon">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th>{t('budgetPlanner.status')}</th>
                  <th>{t('budgetPlanner.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedExpenses.length > 0 ? (
                  filteredAndSortedExpenses.map(expense => {
                    const category = categories.find(c => c.id === expense.categoryId);
                    
                    return (
                      <tr 
                        key={expense.id}
                        onClick={() => selectExpense(expense.id)}
                        className={selectedExpense === expense.id ? 'selected' : ''}
                      >
                        <td>{formatDate(expense.date)}</td>
                        <td>{expense.description}</td>
                        <td>
                          {category && (
                            <span 
                              className="category-tag"
                              style={{ backgroundColor: category.color }}
                            >
                              {category.name}
                            </span>
                          )}
                        </td>
                        <td>{formatCurrency(expense.amount)}</td>
                        <td>
                          <span className={`status-badge ${expense.paid ? 'paid' : 'unpaid'}`}>
                            {expense.paid ? t('budgetPlanner.paid') : t('budgetPlanner.unpaid')}
                          </span>
                        </td>
                        <td>
                          <div className="expense-actions">
                            <button 
                              className="btn-icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                editExpense(expense.id);
                              }}
                            >
                              <span role="img" aria-label="Edit">✏️</span>
                            </button>
                            
                            <button 
                              className="btn-icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Toggle bezahlt-Status
                                setExpenses(expenses.map(e => 
                                  e.id === expense.id 
                                    ? { ...e, paid: !e.paid } 
                                    : e
                                ));
                              }}
                            >
                              <span role="img" aria-label="Toggle Paid">
                                {expense.paid ? '❌' : '✅'}
                              </span>
                            </button>
                            
                            <button 
                              className="btn-icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteExpense(expense.id);
                              }}
                            >
                              <span role="img" aria-label="Delete">🗑️</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="empty-state">
                      {t('budgetPlanner.noExpensesFound')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Hier könnten die Modals für Ausgabe hinzufügen/bearbeiten und Kategorie hinzufügen/bearbeiten implementiert werden */}
    </div>
  );
};

export default BudgetPlanner;
