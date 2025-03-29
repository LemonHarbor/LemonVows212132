import React, { useState, useEffect } from "react";

interface BudgetCategory {
  id: string;
  name: string;
  plannedAmount: number;
  actualAmount: number;
  items: BudgetItem[];
}

interface BudgetItem {
  id: string;
  name: string;
  plannedAmount: number;
  actualAmount: number;
  paid: boolean;
  notes: string;
}

const BudgetPlanner: React.FC = () => {
  const [categories, setCategories] = useState<BudgetCategory[]>([
    {
      id: "cat1",
      name: "Location",
      plannedAmount: 5000,
      actualAmount: 5500,
      items: [
        {
          id: "item1",
          name: "Miete Festsaal",
          plannedAmount: 4000,
          actualAmount: 4200,
          paid: true,
          notes: "Anzahlung geleistet"
        },
        {
          id: "item2",
          name: "Dekoration",
          plannedAmount: 1000,
          actualAmount: 1300,
          paid: false,
          notes: "Blumen und Tischdeko"
        }
      ]
    },
    {
      id: "cat2",
      name: "Catering",
      plannedAmount: 3500,
      actualAmount: 3200,
      items: [
        {
          id: "item3",
          name: "Menü",
          plannedAmount: 2500,
          actualAmount: 2300,
          paid: true,
          notes: "3-Gänge-Menü"
        },
        {
          id: "item4",
          name: "Getränke",
          plannedAmount: 1000,
          actualAmount: 900,
          paid: false,
          notes: "Offene Bar für 4 Stunden"
        }
      ]
    },
    {
      id: "cat3",
      name: "Kleidung",
      plannedAmount: 2000,
      actualAmount: 2200,
      items: [
        {
          id: "item5",
          name: "Brautkleid",
          plannedAmount: 1500,
          actualAmount: 1700,
          paid: true,
          notes: "Inklusive Änderungen"
        },
        {
          id: "item6",
          name: "Anzug",
          plannedAmount: 500,
          actualAmount: 500,
          paid: true,
          notes: ""
        }
      ]
    }
  ]);

  const [totalBudget, setTotalBudget] = useState<number>(15000);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);
  const [showAddItemModal, setShowAddItemModal] = useState<boolean>(false);
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState<Omit<BudgetCategory, "id" | "items" | "actualAmount">>({
    name: "",
    plannedAmount: 0
  });
  const [newItem, setNewItem] = useState<Omit<BudgetItem, "id">>({
    name: "",
    plannedAmount: 0,
    actualAmount: 0,
    paid: false,
    notes: ""
  });
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const totalPlannedAmount = categories.reduce(
    (sum, category) => sum + category.plannedAmount,
    0
  );

  const totalActualAmount = categories.reduce(
    (sum, category) => sum + category.actualAmount,
    0
  );

  const remainingBudget = totalBudget - totalActualAmount;

  const handleAddCategory = () => {
    const newCategoryObj: BudgetCategory = {
      id: `cat${categories.length + 1}`,
      name: newCategory.name,
      plannedAmount: newCategory.plannedAmount,
      actualAmount: 0,
      items: []
    };

    setCategories([...categories, newCategoryObj]);
    setShowAddCategoryModal(false);
    setNewCategory({
      name: "",
      plannedAmount: 0
    });
  };

  const handleAddItem = () => {
    if (currentCategoryId) {
      const newItemObj: BudgetItem = {
        id: `item${Math.random().toString(36).substr(2, 9)}`,
        name: newItem.name,
        plannedAmount: newItem.plannedAmount,
        actualAmount: newItem.actualAmount,
        paid: newItem.paid,
        notes: newItem.notes
      };

      const updatedCategories = categories.map((category) => {
        if (category.id === currentCategoryId) {
          const updatedItems = [...category.items, newItemObj];
          const updatedActualAmount = updatedItems.reduce(
            (sum, item) => sum + item.actualAmount,
            0
          );
          return {
            ...category,
            items: updatedItems,
            actualAmount: updatedActualAmount
          };
        }
        return category;
      });

      setCategories(updatedCategories);
      setShowAddItemModal(false);
      setCurrentCategoryId(null);
      setNewItem({
        name: "",
        plannedAmount: 0,
        actualAmount: 0,
        paid: false,
        notes: ""
      });
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter((category) => category.id !== categoryId));
  };

  const handleDeleteItem = (categoryId: string, itemId: string) => {
    const updatedCategories = categories.map((category) => {
      if (category.id === categoryId) {
        const updatedItems = category.items.filter((item) => item.id !== itemId);
        const updatedActualAmount = updatedItems.reduce(
          (sum, item) => sum + item.actualAmount,
          0
        );
        return {
          ...category,
          items: updatedItems,
          actualAmount: updatedActualAmount
        };
      }
      return category;
    });

    setCategories(updatedCategories);
  };

  const handleUpdateItem = (
    categoryId: string,
    itemId: string,
    field: keyof BudgetItem,
    value: any
  ) => {
    const updatedCategories = categories.map((category) => {
      if (category.id === categoryId) {
        const updatedItems = category.items.map((item) => {
          if (item.id === itemId) {
            return { ...item, [field]: value };
          }
          return item;
        });

        const updatedActualAmount = updatedItems.reduce(
          (sum, item) => sum + item.actualAmount,
          0
        );

        return {
          ...category,
          items: updatedItems,
          actualAmount: updatedActualAmount
        };
      }
      return category;
    });

    setCategories(updatedCategories);
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories({
      ...expandedCategories,
      [categoryId]: !expandedCategories[categoryId]
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR"
    }).format(amount);
  };

  const getBudgetStatusColor = (planned: number, actual: number) => {
    if (actual > planned) {
      return "budget-planner__amount--over";
    } else if (actual === planned) {
      return "budget-planner__amount--equal";
    } else {
      return "budget-planner__amount--under";
    }
  };

  return (
    <div className="budget-planner">
      <div className="budget-planner__header">
        <h2>Budgetplaner</h2>
        <div className="budget-planner__actions">
          <button
            className="budget-planner__add-button"
            onClick={() => setShowAddCategoryModal(true)}
          >
            Kategorie hinzufügen
          </button>
        </div>
      </div>

      <div className="budget-planner__summary">
        <div className="budget-planner__summary-item">
          <span className="budget-planner__summary-label">Gesamtbudget</span>
          <div className="budget-planner__summary-value-container">
            <input
              type="number"
              className="budget-planner__budget-input"
              value={totalBudget}
              onChange={(e) => setTotalBudget(Number(e.target.value))}
            />
            <span className="budget-planner__currency">€</span>
          </div>
        </div>
        <div className="budget-planner__summary-item">
          <span className="budget-planner__summary-label">Geplante Ausgaben</span>
          <span className="budget-planner__summary-value">
            {formatCurrency(totalPlannedAmount)}
          </span>
        </div>
        <div className="budget-planner__summary-item">
          <span className="budget-planner__summary-label">Tatsächliche Ausgaben</span>
          <span className="budget-planner__summary-value">
            {formatCurrency(totalActualAmount)}
          </span>
        </div>
        <div className="budget-planner__summary-item">
          <span className="budget-planner__summary-label">Verbleibendes Budget</span>
          <span
            className={`budget-planner__summary-value ${
              remainingBudget < 0
                ? "budget-planner__amount--over"
                : "budget-planner__amount--under"
            }`}
          >
            {formatCurrency(remainingBudget)}
          </span>
        </div>
      </div>

      <div className="budget-planner__progress">
        <div className="budget-planner__progress-bar">
          <div
            className="budget-planner__progress-fill"
            style={{
              width: `${Math.min(
                (totalActualAmount / totalBudget) * 100,
                100
              )}%`,
              backgroundColor:
                totalActualAmount > totalBudget ? "#dc3545" : "#28a745"
            }}
          ></div>
        </div>
        <div className="budget-planner__progress-labels">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      <div className="budget-planner__categories">
        {categories.map((category) => (
          <div key={category.id} className="budget-planner__category">
            <div
              className="budget-planner__category-header"
              onClick={() => toggleCategoryExpansion(category.id)}
            >
              <div className="budget-planner__category-name">
                <span
                  className={`budget-planner__expand-icon ${
                    expandedCategories[category.id] ? "expanded" : ""
                  }`}
                >
                  {expandedCategories[category.id] ? "▼" : "►"}
                </span>
                {category.name}
              </div>
              <div className="budget-planner__category-amounts">
                <div className="budget-planner__amount-group">
                  <span className="budget-planner__amount-label">Geplant:</span>
                  <span className="budget-planner__amount">
                    {formatCurrency(category.plannedAmount)}
                  </span>
                </div>
                <div className="budget-planner__amount-group">
                  <span className="budget-planner__amount-label">Tatsächlich:</span>
                  <span
                    className={`budget-planner__amount ${getBudgetStatusColor(
                      category.plannedAmount,
                      category.actualAmount
                    )}`}
                  >
                    {formatCurrency(category.actualAmount)}
                  </span>
                </div>
                <button
                  className="budget-planner__delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategory(category.id);
                  }}
                >
                  ×
                </button>
              </div>
            </div>
            {expandedCategories[category.id] && (
              <div className="budget-planner__category-content">
                <table className="budget-planner__items-table">
                  <thead>
                    <tr>
                      <th>Position</th>
                      <th>Geplant</th>
                      <th>Tatsächlich</th>
                      <th>Bezahlt</th>
                      <th>Notizen</th>
                      <th>Aktionen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>
                          <div className="budget-planner__input-group">
                            <input
                              type="number"
                              value={item.plannedAmount}
                              onChange={(e) =>
                                handleUpdateItem(
                                  category.id,
                                  item.id,
                                  "plannedAmount",
                                  Number(e.target.value)
                                )
                              }
                              className="budget-planner__amount-input"
                            />
                            <span className="budget-planner__currency">€</span>
                          </div>
                        </td>
                        <td>
                          <div className="budget-planner__input-group">
                            <input
                              type="number"
                              value={item.actualAmount}
                              onChange={(e) =>
                                handleUpdateItem(
                                  category.id,
                                  item.id,
                                  "actualAmount",
                                  Number(e.target.value)
                                )
                              }
                              className={`budget-planner__amount-input ${getBudgetStatusColor(
                                item.plannedAmount,
                                item.actualAmount
                              )}`}
                            />
                            <span className="budget-planner__currency">€</span>
                          </div>
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={item.paid}
                            onChange={(e) =>
                              handleUpdateItem(
                                category.id,
                                item.id,
                                "paid",
                                e.target.checked
                              )
                            }
                            className="budget-planner__checkbox"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={item.notes}
                            onChange={(e) =>
                              handleUpdateItem(
                                category.id,
                                item.id,
                                "notes",
                                e.target.value
                              )
                            }
                            className="budget-planner__notes-input"
                          />
                        </td>
                        <td>
                          <button
                            className="budget-planner__delete-item-button"
                            onClick={() =>
                              handleDeleteItem(category.id, item.id)
                            }
                          >
                            Löschen
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  className="budget-planner__add-item-button"
                  onClick={() => {
                    setCurrentCategoryId(category.id);
                    setShowAddItemModal(true);
                  }}
                >
                  Position hinzufügen
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showAddCategoryModal && (
        <div className="budget-planner__modal">
          <div className="budget-planner__modal-content">
            <div className="budget-planner__modal-header">
              <h3>Neue Kategorie hinzufügen</h3>
              <button
                className="budget-planner__modal-close"
                onClick={() => setShowAddCategoryModal(false)}
              >
                ×
              </button>
            </div>
            <div className="budget-planner__modal-body">
              <div className="budget-planner__form-group">
                <label htmlFor="categoryName">Name</label>
                <input
                  type="text"
                  id="categoryName"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                />
              </div>
              <div className="budget-planner__form-group">
                <label htmlFor="categoryPlannedAmount">Geplanter Betrag</label>
                <div className="budget-planner__input-group">
                  <input
                    type="number"
                    id="categoryPlannedAmount"
                    value={newCategory.plannedAmount}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        plannedAmount: Number(e.target.value)
                      })
                    }
                  />
                  <span className="budget-planner__currency">€</span>
                </div>
              </div>
            </div>
            <div className="budget-planner__modal-footer">
              <button
                className="budget-planner__button budget-planner__button--secondary"
                onClick={() => setShowAddCategoryModal(false)}
              >
                Abbrechen
              </button>
              <button
                className="budget-planner__button"
                onClick={handleAddCategory}
              >
                Hinzufügen
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddItemModal && (
        <div className="budget-planner__modal">
          <div className="budget-planner__modal-content">
            <div className="budget-planner__modal-header">
              <h3>Neue Position hinzufügen</h3>
              <button
                className="budget-planner__modal-close"
                onClick={() => {
                  setShowAddItemModal(false);
                  setCurrentCategoryId(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="budget-planner__modal-body">
              <div className="budget-planner__form-group">
                <label htmlFor="itemName">Name</label>
                <input
                  type="text"
                  id="itemName"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                />
              </div>
              <div className="budget-planner__form-group">
                <label htmlFor="itemPlannedAmount">Geplanter Betrag</label>
                <div className="budget-planner__input-group">
                  <input
                    type="number"
                    id="itemPlannedAmount"
                    value={newItem.plannedAmount}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        plannedAmount: Number(e.target.value)
                      })
                    }
                  />
                  <span className="budget-planner__currency">€</span>
                </div>
              </div>
              <div className="budget-planner__form-group">
                <label htmlFor="itemActualAmount">Tatsächlicher Betrag</label>
                <div className="budget-planner__input-group">
                  <input
                    type="number"
                    id="itemActualAmount"
                    value={newItem.actualAmount}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        actualAmount: Number(e.target.value)
                      })
                    }
                  />
                  <span className="budget-planner__currency">€</span>
                </div>
              </div>
              <div className="budget-planner__form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={newItem.paid}
                    onChange={(e) =>
                      setNewItem({ ...newItem, paid: e.target.checked })
                    }
                  />
                  Bezahlt
                </label>
              </div>
              <div className="budget-planner__form-group">
                <label htmlFor="itemNotes">Notizen</label>
                <textarea
                  id="itemNotes"
                  value={newItem.notes}
                  onChange={(e) =>
                    setNewItem({ ...newItem, notes: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="budget-planner__modal-footer">
              <button
                className="budget-planner__button budget-planner__button--secondary"
                onClick={() => {
                  setShowAddItemModal(false);
                  setCurrentCategoryId(null);
                }}
              >
                Abbrechen
              </button>
              <button
                className="budget-planner__button"
                onClick={handleAddItem}
              >
                Hinzufügen
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .budget-planner {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          color: #333;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .budget-planner__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .budget-planner__header h2 {
          margin: 0;
          font-size: 1.8rem;
        }

        .budget-planner__add-button {
          padding: 0.5rem 1rem;
          background-color: #ffbd00;
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .budget-planner__add-button:hover {
          background-color: #e6a800;
        }

        .budget-planner__summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .budget-planner__summary-item {
          background-color: white;
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
        }

        .budget-planner__summary-label {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.5rem;
        }

        .budget-planner__summary-value {
          font-size: 1.5rem;
          font-weight: 600;
        }

        .budget-planner__summary-value-container {
          display: flex;
          align-items: center;
        }

        .budget-planner__budget-input {
          font-size: 1.5rem;
          font-weight: 600;
          width: 100%;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 0.25rem 0.5rem;
        }

        .budget-planner__currency {
          margin-left: 0.25rem;
        }

        .budget-planner__progress {
          margin-bottom: 2rem;
        }

        .budget-planner__progress-bar {
          height: 10px;
          background-color: #e9ecef;
          border-radius: 5px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .budget-planner__progress-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .budget-planner__progress-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: #666;
        }

        .budget-planner__categories {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .budget-planner__category {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .budget-planner__category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .budget-planner__category-header:hover {
          background-color: #f8f9fa;
        }

        .budget-planner__category-name {
          font-weight: 500;
          display: flex;
          align-items: center;
        }

        .budget-planner__expand-icon {
          margin-right: 0.5rem;
          font-size: 0.8rem;
          transition: transform 0.2s ease;
        }

        .budget-planner__expand-icon.expanded {
          transform: rotate(0deg);
        }

        .budget-planner__category-amounts {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .budget-planner__amount-group {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .budget-planner__amount-label {
          font-size: 0.9rem;
          color: #666;
        }

        .budget-planner__amount {
          font-weight: 500;
        }

        .budget-planner__amount--over {
          color: #dc3545;
        }

        .budget-planner__amount--equal {
          color: #fd7e14;
        }

        .budget-planner__amount--under {
          color: #28a745;
        }

        .budget-planner__delete-button {
          background-color: #f8d7da;
          border: none;
          color: #842029;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.2rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .budget-planner__delete-button:hover {
          background-color: #f5c2c7;
        }

        .budget-planner__category-content {
          padding: 1rem;
          border-top: 1px solid #eee;
        }

        .budget-planner__items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1rem;
        }

        .budget-planner__items-table th {
          text-align: left;
          padding: 0.75rem 0.5rem;
          border-bottom: 1px solid #eee;
          font-weight: 500;
        }

        .budget-planner__items-table td {
          padding: 0.75rem 0.5rem;
          border-bottom: 1px solid #eee;
        }

        .budget-planner__items-table tr:last-child td {
          border-bottom: none;
        }

        .budget-planner__input-group {
          display: flex;
          align-items: center;
        }

        .budget-planner__amount-input {
          width: 100px;
          padding: 0.25rem 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .budget-planner__checkbox {
          width: 18px;
          height: 18px;
        }

        .budget-planner__notes-input {
          width: 100%;
          padding: 0.25rem 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .budget-planner__delete-item-button {
          padding: 0.25rem 0.5rem;
          background-color: #f8d7da;
          border: 1px solid #f5c2c7;
          color: #842029;
          border-radius: 4px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .budget-planner__delete-item-button:hover {
          background-color: #f5c2c7;
        }

        .budget-planner__add-item-button {
          padding: 0.5rem 1rem;
          background-color: #e9ecef;
          border: none;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .budget-planner__add-item-button:hover {
          background-color: #dee2e6;
        }

        .budget-planner__modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .budget-planner__modal-content {
          background-color: white;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .budget-planner__modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #eee;
        }

        .budget-planner__modal-header h3 {
          margin: 0;
          font-size: 1.25rem;
        }

        .budget-planner__modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
        }

        .budget-planner__modal-body {
          padding: 1.5rem;
        }

        .budget-planner__form-group {
          margin-bottom: 1rem;
        }

        .budget-planner__form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .budget-planner__form-group input[type="text"],
        .budget-planner__form-group input[type="number"],
        .budget-planner__form-group textarea {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .budget-planner__form-group textarea {
          min-height: 100px;
          resize: vertical;
        }

        .budget-planner__modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding: 1rem 1.5rem;
          border-top: 1px solid #eee;
        }

        .budget-planner__button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .budget-planner__button {
          background-color: #ffbd00;
          color: white;
        }

        .budget-planner__button:hover {
          background-color: #e6a800;
        }

        .budget-planner__button--secondary {
          background-color: #f8f9fa;
          color: #6c757d;
        }

        .budget-planner__button--secondary:hover {
          background-color: #e2e6ea;
        }

        @media (max-width: 768px) {
          .budget-planner {
            padding: 1rem;
          }

          .budget-planner__header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .budget-planner__add-button {
            width: 100%;
          }

          .budget-planner__summary {
            grid-template-columns: 1fr;
          }

          .budget-planner__category-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .budget-planner__category-amounts {
            width: 100%;
            flex-wrap: wrap;
          }

          .budget-planner__items-table {
            display: block;
            overflow-x: auto;
          }

          .budget-planner__modal-footer {
            flex-direction: column;
          }

          .budget-planner__modal-footer button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default BudgetPlanner;
