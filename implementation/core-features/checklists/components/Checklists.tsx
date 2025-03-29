import React, { useState, useEffect } from "react";

interface ChecklistCategory {
  id: string;
  name: string;
  description: string;
  checklists: Checklist[];
}

interface Checklist {
  id: string;
  name: string;
  description: string;
  dueDate: string | null;
  items: ChecklistItem[];
}

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  assignedTo: string | null;
  notes: string;
}

const Checklists: React.FC = () => {
  const [categories, setCategories] = useState<ChecklistCategory[]>([
    {
      id: "cat1",
      name: "Vor der Hochzeit",
      description: "Aufgaben, die vor dem großen Tag erledigt werden müssen",
      checklists: [
        {
          id: "list1",
          name: "12 Monate vorher",
          description: "Wichtige Entscheidungen und Buchungen",
          dueDate: null,
          items: [
            {
              id: "item1",
              text: "Hochzeitstermin festlegen",
              completed: true,
              priority: "high",
              assignedTo: null,
              notes: ""
            },
            {
              id: "item2",
              text: "Budget festlegen",
              completed: true,
              priority: "high",
              assignedTo: null,
              notes: ""
            },
            {
              id: "item3",
              text: "Location besichtigen und buchen",
              completed: false,
              priority: "high",
              assignedTo: null,
              notes: "Termine für Besichtigungen vereinbaren"
            },
            {
              id: "item4",
              text: "Gästeliste erstellen",
              completed: false,
              priority: "medium",
              assignedTo: null,
              notes: ""
            }
          ]
        },
        {
          id: "list2",
          name: "6 Monate vorher",
          description: "Wichtige Dienstleister buchen",
          dueDate: null,
          items: [
            {
              id: "item5",
              text: "Fotografen buchen",
              completed: false,
              priority: "high",
              assignedTo: null,
              notes: ""
            },
            {
              id: "item6",
              text: "Catering auswählen",
              completed: false,
              priority: "high",
              assignedTo: null,
              notes: ""
            },
            {
              id: "item7",
              text: "Hochzeitskleid/Anzug auswählen",
              completed: false,
              priority: "medium",
              assignedTo: null,
              notes: ""
            }
          ]
        }
      ]
    },
    {
      id: "cat2",
      name: "Hochzeitstag",
      description: "Aufgaben für den Tag der Hochzeit",
      checklists: [
        {
          id: "list3",
          name: "Vorbereitung",
          description: "Vorbereitungen am Morgen",
          dueDate: null,
          items: [
            {
              id: "item8",
              text: "Ringe bereitstellen",
              completed: false,
              priority: "high",
              assignedTo: "Trauzeuge",
              notes: ""
            },
            {
              id: "item9",
              text: "Styling und Make-up",
              completed: false,
              priority: "medium",
              assignedTo: "Braut",
              notes: "Termin um 10:00 Uhr"
            }
          ]
        },
        {
          id: "list4",
          name: "Zeremonie",
          description: "Während der Trauung",
          dueDate: null,
          items: [
            {
              id: "item10",
              text: "Musik für Einzug",
              completed: false,
              priority: "medium",
              assignedTo: "DJ",
              notes: ""
            },
            {
              id: "item11",
              text: "Blumenstreuen",
              completed: false,
              priority: "low",
              assignedTo: "Blumenkinder",
              notes: ""
            }
          ]
        }
      ]
    }
  ]);

  const [activeCategory, setActiveCategory] = useState<string | null>("cat1");
  const [activeChecklist, setActiveChecklist] = useState<string | null>("list1");
  const [showAddItemModal, setShowAddItemModal] = useState<boolean>(false);
  const [showAddChecklistModal, setShowAddChecklistModal] = useState<boolean>(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);
  const [newItem, setNewItem] = useState<Omit<ChecklistItem, "id">>({
    text: "",
    completed: false,
    priority: "medium",
    assignedTo: null,
    notes: ""
  });
  const [newChecklist, setNewChecklist] = useState<Omit<Checklist, "id" | "items">>({
    name: "",
    description: "",
    dueDate: null
  });
  const [newCategory, setNewCategory] = useState<Omit<ChecklistCategory, "id" | "checklists">>({
    name: "",
    description: ""
  });
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">("all");

  const handleAddItem = () => {
    if (activeCategory && activeChecklist) {
      const newItemObj: ChecklistItem = {
        id: `item${Math.random().toString(36).substr(2, 9)}`,
        ...newItem
      };

      const updatedCategories = categories.map((category) => {
        if (category.id === activeCategory) {
          const updatedChecklists = category.checklists.map((checklist) => {
            if (checklist.id === activeChecklist) {
              return {
                ...checklist,
                items: [...checklist.items, newItemObj]
              };
            }
            return checklist;
          });
          return {
            ...category,
            checklists: updatedChecklists
          };
        }
        return category;
      });

      setCategories(updatedCategories);
      setShowAddItemModal(false);
      setNewItem({
        text: "",
        completed: false,
        priority: "medium",
        assignedTo: null,
        notes: ""
      });
    }
  };

  const handleAddChecklist = () => {
    if (activeCategory) {
      const newChecklistObj: Checklist = {
        id: `list${Math.random().toString(36).substr(2, 9)}`,
        ...newChecklist,
        items: []
      };

      const updatedCategories = categories.map((category) => {
        if (category.id === activeCategory) {
          return {
            ...category,
            checklists: [...category.checklists, newChecklistObj]
          };
        }
        return category;
      });

      setCategories(updatedCategories);
      setShowAddChecklistModal(false);
      setNewChecklist({
        name: "",
        description: "",
        dueDate: null
      });
      setActiveChecklist(newChecklistObj.id);
    }
  };

  const handleAddCategory = () => {
    const newCategoryObj: ChecklistCategory = {
      id: `cat${Math.random().toString(36).substr(2, 9)}`,
      ...newCategory,
      checklists: []
    };

    setCategories([...categories, newCategoryObj]);
    setShowAddCategoryModal(false);
    setNewCategory({
      name: "",
      description: ""
    });
    setActiveCategory(newCategoryObj.id);
    setActiveChecklist(null);
  };

  const handleToggleItem = (
    categoryId: string,
    checklistId: string,
    itemId: string
  ) => {
    const updatedCategories = categories.map((category) => {
      if (category.id === categoryId) {
        const updatedChecklists = category.checklists.map((checklist) => {
          if (checklist.id === checklistId) {
            const updatedItems = checklist.items.map((item) => {
              if (item.id === itemId) {
                return { ...item, completed: !item.completed };
              }
              return item;
            });
            return { ...checklist, items: updatedItems };
          }
          return checklist;
        });
        return { ...category, checklists: updatedChecklists };
      }
      return category;
    });

    setCategories(updatedCategories);
  };

  const handleUpdateItem = (
    categoryId: string,
    checklistId: string,
    itemId: string,
    field: keyof ChecklistItem,
    value: any
  ) => {
    const updatedCategories = categories.map((category) => {
      if (category.id === categoryId) {
        const updatedChecklists = category.checklists.map((checklist) => {
          if (checklist.id === checklistId) {
            const updatedItems = checklist.items.map((item) => {
              if (item.id === itemId) {
                return { ...item, [field]: value };
              }
              return item;
            });
            return { ...checklist, items: updatedItems };
          }
          return checklist;
        });
        return { ...category, checklists: updatedChecklists };
      }
      return category;
    });

    setCategories(updatedCategories);
  };

  const handleDeleteItem = (
    categoryId: string,
    checklistId: string,
    itemId: string
  ) => {
    const updatedCategories = categories.map((category) => {
      if (category.id === categoryId) {
        const updatedChecklists = category.checklists.map((checklist) => {
          if (checklist.id === checklistId) {
            return {
              ...checklist,
              items: checklist.items.filter((item) => item.id !== itemId)
            };
          }
          return checklist;
        });
        return { ...category, checklists: updatedChecklists };
      }
      return category;
    });

    setCategories(updatedCategories);
  };

  const handleDeleteChecklist = (categoryId: string, checklistId: string) => {
    const updatedCategories = categories.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          checklists: category.checklists.filter(
            (checklist) => checklist.id !== checklistId
          )
        };
      }
      return category;
    });

    setCategories(updatedCategories);
    
    // If the active checklist is deleted, set the first available checklist as active
    if (activeChecklist === checklistId) {
      const category = updatedCategories.find((cat) => cat.id === categoryId);
      if (category && category.checklists.length > 0) {
        setActiveChecklist(category.checklists[0].id);
      } else {
        setActiveChecklist(null);
      }
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    const updatedCategories = categories.filter(
      (category) => category.id !== categoryId
    );

    setCategories(updatedCategories);
    
    // If the active category is deleted, set the first available category as active
    if (activeCategory === categoryId) {
      if (updatedCategories.length > 0) {
        setActiveCategory(updatedCategories[0].id);
        if (updatedCategories[0].checklists.length > 0) {
          setActiveChecklist(updatedCategories[0].checklists[0].id);
        } else {
          setActiveChecklist(null);
        }
      } else {
        setActiveCategory(null);
        setActiveChecklist(null);
      }
    }
  };

  const getActiveCategory = () => {
    return categories.find((category) => category.id === activeCategory);
  };

  const getActiveChecklist = () => {
    const category = getActiveCategory();
    if (category) {
      return category.checklists.find(
        (checklist) => checklist.id === activeChecklist
      );
    }
    return null;
  };

  const getFilteredItems = () => {
    const checklist = getActiveChecklist();
    if (!checklist) return [];

    switch (filter) {
      case "completed":
        return checklist.items.filter((item) => item.completed);
      case "incomplete":
        return checklist.items.filter((item) => !item.completed);
      default:
        return checklist.items;
    }
  };

  const getCompletionPercentage = (checklist: Checklist) => {
    if (checklist.items.length === 0) return 0;
    const completedItems = checklist.items.filter((item) => item.completed).length;
    return Math.round((completedItems / checklist.items.length) * 100);
  };

  const getPriorityClass = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case "high":
        return "checklists__priority--high";
      case "medium":
        return "checklists__priority--medium";
      case "low":
        return "checklists__priority--low";
      default:
        return "";
    }
  };

  return (
    <div className="checklists">
      <div className="checklists__header">
        <h2>Checklisten</h2>
        <button
          className="checklists__add-button"
          onClick={() => setShowAddCategoryModal(true)}
        >
          Kategorie hinzufügen
        </button>
      </div>

      <div className="checklists__container">
        <div className="checklists__sidebar">
          {categories.map((category) => (
            <div key={category.id} className="checklists__category">
              <div
                className={`checklists__category-header ${
                  activeCategory === category.id
                    ? "checklists__category-header--active"
                    : ""
                }`}
                onClick={() => {
                  setActiveCategory(category.id);
                  if (category.checklists.length > 0) {
                    setActiveChecklist(category.checklists[0].id);
                  } else {
                    setActiveChecklist(null);
                  }
                }}
              >
                <h3>{category.name}</h3>
                <button
                  className="checklists__delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategory(category.id);
                  }}
                >
                  ×
                </button>
              </div>
              {activeCategory === category.id && (
                <div className="checklists__category-content">
                  <p className="checklists__category-description">
                    {category.description}
                  </p>
                  <div className="checklists__checklists">
                    {category.checklists.map((checklist) => (
                      <div
                        key={checklist.id}
                        className={`checklists__checklist ${
                          activeChecklist === checklist.id
                            ? "checklists__checklist--active"
                            : ""
                        }`}
                        onClick={() => setActiveChecklist(checklist.id)}
                      >
                        <div className="checklists__checklist-header">
                          <h4>{checklist.name}</h4>
                          <div className="checklists__checklist-progress">
                            <div className="checklists__progress-bar">
                              <div
                                className="checklists__progress-fill"
                                style={{
                                  width: `${getCompletionPercentage(checklist)}%`
                                }}
                              ></div>
                            </div>
                            <span className="checklists__progress-text">
                              {getCompletionPercentage(checklist)}%
                            </span>
                          </div>
                        </div>
                        <div className="checklists__checklist-actions">
                          <button
                            className="checklists__delete-button checklists__delete-button--small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteChecklist(category.id, checklist.id);
                            }}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      className="checklists__add-checklist-button"
                      onClick={() => setShowAddChecklistModal(true)}
                    >
                      + Checkliste hinzufügen
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="checklists__content">
          {activeChecklist ? (
            <>
              <div className="checklists__content-header">
                <h3>{getActiveChecklist()?.name}</h3>
                <p>{getActiveChecklist()?.description}</p>
                {getActiveChecklist()?.dueDate && (
                  <div className="checklists__due-date">
                    Fällig bis: {new Date(getActiveChecklist()?.dueDate as string).toLocaleDateString()}
                  </div>
                )}
              </div>

              <div className="checklists__filters">
                <button
                  className={`checklists__filter-button ${
                    filter === "all" ? "checklists__filter-button--active" : ""
                  }`}
                  onClick={() => setFilter("all")}
                >
                  Alle
                </button>
                <button
                  className={`checklists__filter-button ${
                    filter === "incomplete"
                      ? "checklists__filter-button--active"
                      : ""
                  }`}
                  onClick={() => setFilter("incomplete")}
                >
                  Offen
                </button>
                <button
                  className={`checklists__filter-button ${
                    filter === "completed"
                      ? "checklists__filter-button--active"
                      : ""
                  }`}
                  onClick={() => setFilter("completed")}
                >
                  Erledigt
                </button>
                <button
                  className="checklists__add-item-button"
                  onClick={() => setShowAddItemModal(true)}
                >
                  + Aufgabe hinzufügen
                </button>
              </div>

              <div className="checklists__items">
                {getFilteredItems().map((item) => (
                  <div
                    key={item.id}
                    className={`checklists__item ${
                      item.completed ? "checklists__item--completed" : ""
                    }`}
                  >
                    <div className="checklists__item-header">
                      <div className="checklists__item-checkbox">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() =>
                            handleToggleItem(
                              activeCategory as string,
                              activeChecklist,
                              item.id
                            )
                          }
                        />
                        <span className="checklists__item-text">{item.text}</span>
                      </div>
                      <div className="checklists__item-actions">
                        <span
                          className={`checklists__priority ${getPriorityClass(
                            item.priority
                          )}`}
                        >
                          {item.priority === "high"
                            ? "Hoch"
                            : item.priority === "medium"
                            ? "Mittel"
                            : "Niedrig"}
                        </span>
                        <button
                          className="checklists__delete-button checklists__delete-button--small"
                          onClick={() =>
                            handleDeleteItem(
                              activeCategory as string,
                              activeChecklist,
                              item.id
                            )
                          }
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    <div className="checklists__item-details">
                      {item.assignedTo && (
                        <div className="checklists__item-assigned">
                          Zugewiesen an: {item.assignedTo}
                        </div>
                      )}
                      {item.notes && (
                        <div className="checklists__item-notes">{item.notes}</div>
                      )}
                    </div>
                  </div>
                ))}
                {getFilteredItems().length === 0 && (
                  <div className="checklists__empty">
                    Keine Aufgaben gefunden. Füge eine neue Aufgabe hinzu!
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="checklists__empty-state">
              <h3>Keine Checkliste ausgewählt</h3>
              <p>
                Wähle eine Checkliste aus oder erstelle eine neue, um Aufgaben zu
                verwalten.
              </p>
            </div>
          )}
        </div>
      </div>

      {showAddItemModal && (
        <div className="checklists__modal">
          <div className="checklists__modal-content">
            <div className="checklists__modal-header">
              <h3>Neue Aufgabe hinzufügen</h3>
              <button
                className="checklists__modal-close"
                onClick={() => setShowAddItemModal(false)}
              >
                ×
              </button>
            </div>
            <div className="checklists__modal-body">
              <div className="checklists__form-group">
                <label htmlFor="itemText">Aufgabe</label>
                <input
                  type="text"
                  id="itemText"
                  value={newItem.text}
                  onChange={(e) =>
                    setNewItem({ ...newItem, text: e.target.value })
                  }
                />
              </div>
              <div className="checklists__form-group">
                <label htmlFor="itemPriority">Priorität</label>
                <select
                  id="itemPriority"
                  value={newItem.priority}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      priority: e.target.value as "low" | "medium" | "high"
                    })
                  }
                >
                  <option value="low">Niedrig</option>
                  <option value="medium">Mittel</option>
                  <option value="high">Hoch</option>
                </select>
              </div>
              <div className="checklists__form-group">
                <label htmlFor="itemAssignedTo">Zugewiesen an</label>
                <input
                  type="text"
                  id="itemAssignedTo"
                  value={newItem.assignedTo || ""}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      assignedTo: e.target.value || null
                    })
                  }
                />
              </div>
              <div className="checklists__form-group">
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
            <div className="checklists__modal-footer">
              <button
                className="checklists__button checklists__button--secondary"
                onClick={() => setShowAddItemModal(false)}
              >
                Abbrechen
              </button>
              <button
                className="checklists__button"
                onClick={handleAddItem}
              >
                Hinzufügen
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddChecklistModal && (
        <div className="checklists__modal">
          <div className="checklists__modal-content">
            <div className="checklists__modal-header">
              <h3>Neue Checkliste hinzufügen</h3>
              <button
                className="checklists__modal-close"
                onClick={() => setShowAddChecklistModal(false)}
              >
                ×
              </button>
            </div>
            <div className="checklists__modal-body">
              <div className="checklists__form-group">
                <label htmlFor="checklistName">Name</label>
                <input
                  type="text"
                  id="checklistName"
                  value={newChecklist.name}
                  onChange={(e) =>
                    setNewChecklist({ ...newChecklist, name: e.target.value })
                  }
                />
              </div>
              <div className="checklists__form-group">
                <label htmlFor="checklistDescription">Beschreibung</label>
                <textarea
                  id="checklistDescription"
                  value={newChecklist.description}
                  onChange={(e) =>
                    setNewChecklist({
                      ...newChecklist,
                      description: e.target.value
                    })
                  }
                />
              </div>
              <div className="checklists__form-group">
                <label htmlFor="checklistDueDate">Fälligkeitsdatum (optional)</label>
                <input
                  type="date"
                  id="checklistDueDate"
                  value={newChecklist.dueDate || ""}
                  onChange={(e) =>
                    setNewChecklist({
                      ...newChecklist,
                      dueDate: e.target.value || null
                    })
                  }
                />
              </div>
            </div>
            <div className="checklists__modal-footer">
              <button
                className="checklists__button checklists__button--secondary"
                onClick={() => setShowAddChecklistModal(false)}
              >
                Abbrechen
              </button>
              <button
                className="checklists__button"
                onClick={handleAddChecklist}
              >
                Hinzufügen
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddCategoryModal && (
        <div className="checklists__modal">
          <div className="checklists__modal-content">
            <div className="checklists__modal-header">
              <h3>Neue Kategorie hinzufügen</h3>
              <button
                className="checklists__modal-close"
                onClick={() => setShowAddCategoryModal(false)}
              >
                ×
              </button>
            </div>
            <div className="checklists__modal-body">
              <div className="checklists__form-group">
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
              <div className="checklists__form-group">
                <label htmlFor="categoryDescription">Beschreibung</label>
                <textarea
                  id="categoryDescription"
                  value={newCategory.description}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      description: e.target.value
                    })
                  }
                />
              </div>
            </div>
            <div className="checklists__modal-footer">
              <button
                className="checklists__button checklists__button--secondary"
                onClick={() => setShowAddCategoryModal(false)}
              >
                Abbrechen
              </button>
              <button
                className="checklists__button"
                onClick={handleAddCategory}
              >
                Hinzufügen
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .checklists {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          color: #333;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .checklists__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .checklists__header h2 {
          margin: 0;
          font-size: 1.8rem;
        }

        .checklists__add-button {
          padding: 0.5rem 1rem;
          background-color: #ffbd00;
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .checklists__add-button:hover {
          background-color: #e6a800;
        }

        .checklists__container {
          display: flex;
          gap: 2rem;
          min-height: 600px;
        }

        .checklists__sidebar {
          width: 300px;
          flex-shrink: 0;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .checklists__category {
          border-bottom: 1px solid #eee;
        }

        .checklists__category:last-child {
          border-bottom: none;
        }

        .checklists__category-header {
          padding: 1rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .checklists__category-header:hover {
          background-color: #f8f9fa;
        }

        .checklists__category-header--active {
          background-color: #fff3cd;
        }

        .checklists__category-header h3 {
          margin: 0;
          font-size: 1.1rem;
        }

        .checklists__category-content {
          padding: 0 1rem 1rem;
        }

        .checklists__category-description {
          margin-top: 0;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          color: #666;
        }

        .checklists__checklists {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .checklists__checklist {
          padding: 0.75rem;
          border-radius: 4px;
          background-color: #f8f9fa;
          cursor: pointer;
          transition: background-color 0.2s ease;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .checklists__checklist:hover {
          background-color: #e9ecef;
        }

        .checklists__checklist--active {
          background-color: #e9ecef;
          border-left: 3px solid #ffbd00;
        }

        .checklists__checklist-header {
          flex: 1;
        }

        .checklists__checklist-header h4 {
          margin: 0;
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }

        .checklists__checklist-progress {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .checklists__progress-bar {
          flex: 1;
          height: 6px;
          background-color: #dee2e6;
          border-radius: 3px;
          overflow: hidden;
        }

        .checklists__progress-fill {
          height: 100%;
          background-color: #28a745;
          transition: width 0.3s ease;
        }

        .checklists__progress-text {
          font-size: 0.8rem;
          color: #666;
          min-width: 30px;
          text-align: right;
        }

        .checklists__add-checklist-button {
          padding: 0.5rem;
          background-color: transparent;
          border: 1px dashed #ddd;
          border-radius: 4px;
          color: #666;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
          text-align: center;
          margin-top: 0.5rem;
        }

        .checklists__add-checklist-button:hover {
          background-color: #f8f9fa;
        }

        .checklists__content {
          flex: 1;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
        }

        .checklists__content-header {
          margin-bottom: 1.5rem;
        }

        .checklists__content-header h3 {
          margin: 0;
          margin-bottom: 0.5rem;
          font-size: 1.5rem;
        }

        .checklists__content-header p {
          margin: 0;
          color: #666;
        }

        .checklists__due-date {
          margin-top: 0.5rem;
          font-size: 0.9rem;
          color: #666;
          background-color: #e9ecef;
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }

        .checklists__filters {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .checklists__filter-button {
          padding: 0.5rem 1rem;
          background-color: #f8f9fa;
          border: none;
          border-radius: 4px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .checklists__filter-button:hover {
          background-color: #e9ecef;
        }

        .checklists__filter-button--active {
          background-color: #ffbd00;
          color: white;
        }

        .checklists__add-item-button {
          padding: 0.5rem 1rem;
          background-color: #e9ecef;
          border: none;
          border-radius: 4px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
          margin-left: auto;
        }

        .checklists__add-item-button:hover {
          background-color: #dee2e6;
        }

        .checklists__items {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          overflow-y: auto;
        }

        .checklists__item {
          padding: 1rem;
          border-radius: 8px;
          background-color: #f8f9fa;
          transition: background-color 0.2s ease;
        }

        .checklists__item--completed {
          background-color: #f8f9fa;
          opacity: 0.7;
        }

        .checklists__item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }

        .checklists__item-checkbox {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .checklists__item-checkbox input[type="checkbox"] {
          width: 18px;
          height: 18px;
          margin-top: 0.2rem;
        }

        .checklists__item-text {
          font-weight: 500;
        }

        .checklists__item--completed .checklists__item-text {
          text-decoration: line-through;
          color: #6c757d;
        }

        .checklists__item-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .checklists__priority {
          font-size: 0.8rem;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-weight: 500;
        }

        .checklists__priority--high {
          background-color: #f8d7da;
          color: #842029;
        }

        .checklists__priority--medium {
          background-color: #fff3cd;
          color: #664d03;
        }

        .checklists__priority--low {
          background-color: #d1e7dd;
          color: #0f5132;
        }

        .checklists__delete-button {
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

        .checklists__delete-button:hover {
          background-color: #f5c2c7;
        }

        .checklists__delete-button--small {
          width: 20px;
          height: 20px;
          font-size: 1rem;
        }

        .checklists__item-details {
          padding-left: 2rem;
          font-size: 0.9rem;
          color: #666;
        }

        .checklists__item-assigned {
          margin-bottom: 0.25rem;
        }

        .checklists__item-notes {
          white-space: pre-line;
        }

        .checklists__empty {
          text-align: center;
          padding: 2rem;
          color: #6c757d;
        }

        .checklists__empty-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          color: #6c757d;
        }

        .checklists__empty-state h3 {
          margin-bottom: 0.5rem;
        }

        .checklists__empty-state p {
          margin: 0;
        }

        .checklists__modal {
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

        .checklists__modal-content {
          background-color: white;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .checklists__modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #eee;
        }

        .checklists__modal-header h3 {
          margin: 0;
          font-size: 1.25rem;
        }

        .checklists__modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
        }

        .checklists__modal-body {
          padding: 1.5rem;
        }

        .checklists__form-group {
          margin-bottom: 1rem;
        }

        .checklists__form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .checklists__form-group input[type="text"],
        .checklists__form-group input[type="date"],
        .checklists__form-group select,
        .checklists__form-group textarea {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .checklists__form-group textarea {
          min-height: 100px;
          resize: vertical;
        }

        .checklists__modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding: 1rem 1.5rem;
          border-top: 1px solid #eee;
        }

        .checklists__button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .checklists__button {
          background-color: #ffbd00;
          color: white;
        }

        .checklists__button:hover {
          background-color: #e6a800;
        }

        .checklists__button--secondary {
          background-color: #f8f9fa;
          color: #6c757d;
        }

        .checklists__button--secondary:hover {
          background-color: #e2e6ea;
        }

        @media (max-width: 768px) {
          .checklists {
            padding: 1rem;
          }

          .checklists__header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .checklists__add-button {
            width: 100%;
          }

          .checklists__container {
            flex-direction: column;
          }

          .checklists__sidebar {
            width: 100%;
          }

          .checklists__filters {
            flex-direction: column;
          }

          .checklists__add-item-button {
            width: 100%;
            margin-left: 0;
          }

          .checklists__modal-footer {
            flex-direction: column;
          }

          .checklists__modal-footer button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Checklists;
