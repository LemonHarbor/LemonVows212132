import React, { useState, useEffect } from "react";

interface GuestProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  rsvpStatus: "pending" | "confirmed" | "declined";
  dietaryRestrictions: string[];
  plusOne: boolean;
  tableId: string | null;
  notes: string;
}

const GuestManagement: React.FC = () => {
  const [guests, setGuests] = useState<GuestProps[]>([
    {
      id: "guest1",
      firstName: "Max",
      lastName: "Mustermann",
      email: "max.mustermann@example.com",
      phone: "+49 123 456789",
      rsvpStatus: "confirmed",
      dietaryRestrictions: ["vegetarian"],
      plusOne: false,
      tableId: null,
      notes: ""
    },
    {
      id: "guest2",
      firstName: "Anna",
      lastName: "Schmidt",
      email: "anna.schmidt@example.com",
      phone: "+49 987 654321",
      rsvpStatus: "pending",
      dietaryRestrictions: [],
      plusOne: true,
      tableId: null,
      notes: "Kommt mit Partner"
    },
    {
      id: "guest3",
      firstName: "Thomas",
      lastName: "Müller",
      email: "thomas.mueller@example.com",
      phone: "+49 555 123456",
      rsvpStatus: "declined",
      dietaryRestrictions: ["lactose-intolerant"],
      plusOne: false,
      tableId: null,
      notes: "Kann leider nicht kommen"
    }
  ]);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [currentGuest, setCurrentGuest] = useState<GuestProps | null>(null);
  const [newGuest, setNewGuest] = useState<Omit<GuestProps, "id">>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    rsvpStatus: "pending",
    dietaryRestrictions: [],
    plusOne: false,
    tableId: null,
    notes: ""
  });
  const [filter, setFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<keyof GuestProps>("lastName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleAddGuest = () => {
    const id = `guest${guests.length + 1}`;
    setGuests([...guests, { id, ...newGuest }]);
    setShowAddModal(false);
    setNewGuest({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      rsvpStatus: "pending",
      dietaryRestrictions: [],
      plusOne: false,
      tableId: null,
      notes: ""
    });
  };

  const handleEditGuest = () => {
    if (currentGuest) {
      setGuests(
        guests.map((guest) =>
          guest.id === currentGuest.id ? currentGuest : guest
        )
      );
      setShowEditModal(false);
      setCurrentGuest(null);
    }
  };

  const handleDeleteGuest = (id: string) => {
    setGuests(guests.filter((guest) => guest.id !== id));
  };

  const handleSort = (key: keyof GuestProps) => {
    if (sortBy === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortDirection("asc");
    }
  };

  const filteredGuests = guests.filter(
    (guest) =>
      guest.firstName.toLowerCase().includes(filter.toLowerCase()) ||
      guest.lastName.toLowerCase().includes(filter.toLowerCase()) ||
      guest.email.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedGuests = [...filteredGuests].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) {
      return sortDirection === "asc" ? -1 : 1;
    }
    if (a[sortBy] > b[sortBy]) {
      return sortDirection === "asc" ? 1 : -1;
    }
    return 0;
  });

  const getRsvpStatusColor = (status: "pending" | "confirmed" | "declined") => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "declined":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="guest-management">
      <div className="guest-management__header">
        <h2>Gästeverwaltung</h2>
        <div className="guest-management__actions">
          <div className="guest-management__search">
            <input
              type="text"
              placeholder="Suchen..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="guest-management__search-input"
            />
          </div>
          <button
            className="guest-management__add-button"
            onClick={() => setShowAddModal(true)}
          >
            Gast hinzufügen
          </button>
        </div>
      </div>

      <div className="guest-management__stats">
        <div className="guest-management__stat">
          <span className="guest-management__stat-label">Gesamt</span>
          <span className="guest-management__stat-value">{guests.length}</span>
        </div>
        <div className="guest-management__stat">
          <span className="guest-management__stat-label">Zugesagt</span>
          <span className="guest-management__stat-value">
            {guests.filter((g) => g.rsvpStatus === "confirmed").length}
          </span>
        </div>
        <div className="guest-management__stat">
          <span className="guest-management__stat-label">Ausstehend</span>
          <span className="guest-management__stat-value">
            {guests.filter((g) => g.rsvpStatus === "pending").length}
          </span>
        </div>
        <div className="guest-management__stat">
          <span className="guest-management__stat-label">Abgesagt</span>
          <span className="guest-management__stat-value">
            {guests.filter((g) => g.rsvpStatus === "declined").length}
          </span>
        </div>
      </div>

      <div className="guest-management__table-container">
        <table className="guest-management__table">
          <thead>
            <tr>
              <th onClick={() => handleSort("firstName")}>
                Vorname
                {sortBy === "firstName" && (
                  <span>{sortDirection === "asc" ? " ↑" : " ↓"}</span>
                )}
              </th>
              <th onClick={() => handleSort("lastName")}>
                Nachname
                {sortBy === "lastName" && (
                  <span>{sortDirection === "asc" ? " ↑" : " ↓"}</span>
                )}
              </th>
              <th onClick={() => handleSort("email")}>
                E-Mail
                {sortBy === "email" && (
                  <span>{sortDirection === "asc" ? " ↑" : " ↓"}</span>
                )}
              </th>
              <th onClick={() => handleSort("rsvpStatus")}>
                RSVP
                {sortBy === "rsvpStatus" && (
                  <span>{sortDirection === "asc" ? " ↑" : " ↓"}</span>
                )}
              </th>
              <th>Besonderheiten</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {sortedGuests.map((guest) => (
              <tr key={guest.id}>
                <td>{guest.firstName}</td>
                <td>{guest.lastName}</td>
                <td>{guest.email}</td>
                <td>
                  <span
                    className={`guest-management__rsvp-badge ${getRsvpStatusColor(
                      guest.rsvpStatus
                    )}`}
                  >
                    {guest.rsvpStatus === "confirmed"
                      ? "Zugesagt"
                      : guest.rsvpStatus === "declined"
                      ? "Abgesagt"
                      : "Ausstehend"}
                  </span>
                </td>
                <td>
                  {guest.dietaryRestrictions.length > 0 && (
                    <span className="guest-management__dietary">
                      {guest.dietaryRestrictions.join(", ")}
                    </span>
                  )}
                  {guest.plusOne && (
                    <span className="guest-management__plus-one">+1</span>
                  )}
                </td>
                <td>
                  <div className="guest-management__actions-cell">
                    <button
                      className="guest-management__edit-button"
                      onClick={() => {
                        setCurrentGuest(guest);
                        setShowEditModal(true);
                      }}
                    >
                      Bearbeiten
                    </button>
                    <button
                      className="guest-management__delete-button"
                      onClick={() => handleDeleteGuest(guest.id)}
                    >
                      Löschen
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="guest-management__modal">
          <div className="guest-management__modal-content">
            <div className="guest-management__modal-header">
              <h3>Neuen Gast hinzufügen</h3>
              <button
                className="guest-management__modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            <div className="guest-management__modal-body">
              <div className="guest-management__form-group">
                <label htmlFor="firstName">Vorname</label>
                <input
                  type="text"
                  id="firstName"
                  value={newGuest.firstName}
                  onChange={(e) =>
                    setNewGuest({ ...newGuest, firstName: e.target.value })
                  }
                />
              </div>
              <div className="guest-management__form-group">
                <label htmlFor="lastName">Nachname</label>
                <input
                  type="text"
                  id="lastName"
                  value={newGuest.lastName}
                  onChange={(e) =>
                    setNewGuest({ ...newGuest, lastName: e.target.value })
                  }
                />
              </div>
              <div className="guest-management__form-group">
                <label htmlFor="email">E-Mail</label>
                <input
                  type="email"
                  id="email"
                  value={newGuest.email}
                  onChange={(e) =>
                    setNewGuest({ ...newGuest, email: e.target.value })
                  }
                />
              </div>
              <div className="guest-management__form-group">
                <label htmlFor="phone">Telefon</label>
                <input
                  type="tel"
                  id="phone"
                  value={newGuest.phone}
                  onChange={(e) =>
                    setNewGuest({ ...newGuest, phone: e.target.value })
                  }
                />
              </div>
              <div className="guest-management__form-group">
                <label htmlFor="rsvpStatus">RSVP Status</label>
                <select
                  id="rsvpStatus"
                  value={newGuest.rsvpStatus}
                  onChange={(e) =>
                    setNewGuest({
                      ...newGuest,
                      rsvpStatus: e.target.value as "pending" | "confirmed" | "declined"
                    })
                  }
                >
                  <option value="pending">Ausstehend</option>
                  <option value="confirmed">Zugesagt</option>
                  <option value="declined">Abgesagt</option>
                </select>
              </div>
              <div className="guest-management__form-group">
                <label>Besonderheiten</label>
                <div className="guest-management__checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={newGuest.dietaryRestrictions.includes("vegetarian")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewGuest({
                            ...newGuest,
                            dietaryRestrictions: [...newGuest.dietaryRestrictions, "vegetarian"]
                          });
                        } else {
                          setNewGuest({
                            ...newGuest,
                            dietaryRestrictions: newGuest.dietaryRestrictions.filter(
                              (r) => r !== "vegetarian"
                            )
                          });
                        }
                      }}
                    />
                    Vegetarisch
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={newGuest.dietaryRestrictions.includes("vegan")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewGuest({
                            ...newGuest,
                            dietaryRestrictions: [...newGuest.dietaryRestrictions, "vegan"]
                          });
                        } else {
                          setNewGuest({
                            ...newGuest,
                            dietaryRestrictions: newGuest.dietaryRestrictions.filter(
                              (r) => r !== "vegan"
                            )
                          });
                        }
                      }}
                    />
                    Vegan
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={newGuest.dietaryRestrictions.includes("gluten-free")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewGuest({
                            ...newGuest,
                            dietaryRestrictions: [...newGuest.dietaryRestrictions, "gluten-free"]
                          });
                        } else {
                          setNewGuest({
                            ...newGuest,
                            dietaryRestrictions: newGuest.dietaryRestrictions.filter(
                              (r) => r !== "gluten-free"
                            )
                          });
                        }
                      }}
                    />
                    Glutenfrei
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={newGuest.dietaryRestrictions.includes("lactose-intolerant")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewGuest({
                            ...newGuest,
                            dietaryRestrictions: [...newGuest.dietaryRestrictions, "lactose-intolerant"]
                          });
                        } else {
                          setNewGuest({
                            ...newGuest,
                            dietaryRestrictions: newGuest.dietaryRestrictions.filter(
                              (r) => r !== "lactose-intolerant"
                            )
                          });
                        }
                      }}
                    />
                    Laktosefrei
                  </label>
                </div>
              </div>
              <div className="guest-management__form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={newGuest.plusOne}
                    onChange={(e) =>
                      setNewGuest({ ...newGuest, plusOne: e.target.checked })
                    }
                  />
                  Begleitung (+1)
                </label>
              </div>
              <div className="guest-management__form-group">
                <label htmlFor="notes">Notizen</label>
                <textarea
                  id="notes"
                  value={newGuest.notes}
                  onChange={(e) =>
                    setNewGuest({ ...newGuest, notes: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="guest-management__modal-footer">
              <button
                className="guest-management__button guest-management__button--secondary"
                onClick={() => setShowAddModal(false)}
              >
                Abbrechen
              </button>
              <button
                className="guest-management__button"
                onClick={handleAddGuest}
              >
                Hinzufügen
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && currentGuest && (
        <div className="guest-management__modal">
          <div className="guest-management__modal-content">
            <div className="guest-management__modal-header">
              <h3>Gast bearbeiten</h3>
              <button
                className="guest-management__modal-close"
                onClick={() => {
                  setShowEditModal(false);
                  setCurrentGuest(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="guest-management__modal-body">
              <div className="guest-management__form-group">
                <label htmlFor="editFirstName">Vorname</label>
                <input
                  type="text"
                  id="editFirstName"
                  value={currentGuest.firstName}
                  onChange={(e) =>
                    setCurrentGuest({
                      ...currentGuest,
                      firstName: e.target.value
                    })
                  }
                />
              </div>
              <div className="guest-management__form-group">
                <label htmlFor="editLastName">Nachname</label>
                <input
                  type="text"
                  id="editLastName"
                  value={currentGuest.lastName}
                  onChange={(e) =>
                    setCurrentGuest({
                      ...currentGuest,
                      lastName: e.target.value
                    })
                  }
                />
              </div>
              <div className="guest-management__form-group">
                <label htmlFor="editEmail">E-Mail</label>
                <input
                  type="email"
                  id="editEmail"
                  value={currentGuest.email}
                  onChange={(e) =>
                    setCurrentGuest({ ...currentGuest, email: e.target.value })
                  }
                />
              </div>
              <div className="guest-management__form-group">
                <label htmlFor="editPhone">Telefon</label>
                <input
                  type="tel"
                  id="editPhone"
                  value={currentGuest.phone}
                  onChange={(e) =>
                    setCurrentGuest({ ...currentGuest, phone: e.target.value })
                  }
                />
              </div>
              <div className="guest-management__form-group">
                <label htmlFor="editRsvpStatus">RSVP Status</label>
                <select
                  id="editRsvpStatus"
                  value={currentGuest.rsvpStatus}
                  onChange={(e) =>
                    setCurrentGuest({
                      ...currentGuest,
                      rsvpStatus: e.target.value as "pending" | "confirmed" | "declined"
                    })
                  }
                >
                  <option value="pending">Ausstehend</option>
                  <option value="confirmed">Zugesagt</option>
                  <option value="declined">Abgesagt</option>
                </select>
              </div>
              <div className="guest-management__form-group">
                <label>Besonderheiten</label>
                <div className="guest-management__checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={currentGuest.dietaryRestrictions.includes("vegetarian")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCurrentGuest({
                            ...currentGuest,
                            dietaryRestrictions: [...currentGuest.dietaryRestrictions, "vegetarian"]
                          });
                        } else {
                          setCurrentGuest({
                            ...currentGuest,
                            dietaryRestrictions: currentGuest.dietaryRestrictions.filter(
                              (r) => r !== "vegetarian"
                            )
                          });
                        }
                      }}
                    />
                    Vegetarisch
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={currentGuest.dietaryRestrictions.includes("vegan")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCurrentGuest({
                            ...currentGuest,
                            dietaryRestrictions: [...currentGuest.dietaryRestrictions, "vegan"]
                          });
                        } else {
                          setCurrentGuest({
                            ...currentGuest,
                            dietaryRestrictions: currentGuest.dietaryRestrictions.filter(
                              (r) => r !== "vegan"
                            )
                          });
                        }
                      }}
                    />
                    Vegan
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={currentGuest.dietaryRestrictions.includes("gluten-free")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCurrentGuest({
                            ...currentGuest,
                            dietaryRestrictions: [...currentGuest.dietaryRestrictions, "gluten-free"]
                          });
                        } else {
                          setCurrentGuest({
                            ...currentGuest,
                            dietaryRestrictions: currentGuest.dietaryRestrictions.filter(
                              (r) => r !== "gluten-free"
                            )
                          });
                        }
                      }}
                    />
                    Glutenfrei
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={currentGuest.dietaryRestrictions.includes("lactose-intolerant")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCurrentGuest({
                            ...currentGuest,
                            dietaryRestrictions: [...currentGuest.dietaryRestrictions, "lactose-intolerant"]
                          });
                        } else {
                          setCurrentGuest({
                            ...currentGuest,
                            dietaryRestrictions: currentGuest.dietaryRestrictions.filter(
                              (r) => r !== "lactose-intolerant"
                            )
                          });
                        }
                      }}
                    />
                    Laktosefrei
                  </label>
                </div>
              </div>
              <div className="guest-management__form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={currentGuest.plusOne}
                    onChange={(e) =>
                      setCurrentGuest({
                        ...currentGuest,
                        plusOne: e.target.checked
                      })
                    }
                  />
                  Begleitung (+1)
                </label>
              </div>
              <div className="guest-management__form-group">
                <label htmlFor="editNotes">Notizen</label>
                <textarea
                  id="editNotes"
                  value={currentGuest.notes}
                  onChange={(e) =>
                    setCurrentGuest({
                      ...currentGuest,
                      notes: e.target.value
                    })
                  }
                />
              </div>
            </div>
            <div className="guest-management__modal-footer">
              <button
                className="guest-management__button guest-management__button--secondary"
                onClick={() => {
                  setShowEditModal(false);
                  setCurrentGuest(null);
                }}
              >
                Abbrechen
              </button>
              <button
                className="guest-management__button"
                onClick={handleEditGuest}
              >
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .guest-management {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          color: #333;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .guest-management__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .guest-management__header h2 {
          margin: 0;
          font-size: 1.8rem;
        }

        .guest-management__actions {
          display: flex;
          gap: 1rem;
        }

        .guest-management__search {
          position: relative;
        }

        .guest-management__search-input {
          padding: 0.5rem 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          min-width: 250px;
        }

        .guest-management__add-button {
          padding: 0.5rem 1rem;
          background-color: #ffbd00;
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .guest-management__add-button:hover {
          background-color: #e6a800;
        }

        .guest-management__stats {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .guest-management__stat {
          background-color: white;
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .guest-management__stat-label {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.25rem;
        }

        .guest-management__stat-value {
          font-size: 1.5rem;
          font-weight: 600;
        }

        .guest-management__table-container {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          overflow-x: auto;
        }

        .guest-management__table {
          width: 100%;
          border-collapse: collapse;
        }

        .guest-management__table th {
          text-align: left;
          padding: 1rem;
          border-bottom: 1px solid #eee;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .guest-management__table th:hover {
          background-color: #f8f9fa;
        }

        .guest-management__table td {
          padding: 1rem;
          border-bottom: 1px solid #eee;
        }

        .guest-management__table tr:last-child td {
          border-bottom: none;
        }

        .guest-management__rsvp-badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .guest-management__dietary {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          background-color: #e9ecef;
          border-radius: 4px;
          font-size: 0.8rem;
          margin-right: 0.5rem;
        }

        .guest-management__plus-one {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          background-color: #cff4fc;
          color: #055160;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .guest-management__actions-cell {
          display: flex;
          gap: 0.5rem;
        }

        .guest-management__edit-button {
          padding: 0.25rem 0.5rem;
          background-color: #f8f9fa;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .guest-management__edit-button:hover {
          background-color: #e9ecef;
        }

        .guest-management__delete-button {
          padding: 0.25rem 0.5rem;
          background-color: #f8d7da;
          border: 1px solid #f5c2c7;
          color: #842029;
          border-radius: 4px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .guest-management__delete-button:hover {
          background-color: #f5c2c7;
        }

        .guest-management__modal {
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

        .guest-management__modal-content {
          background-color: white;
          border-radius: 8px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .guest-management__modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #eee;
        }

        .guest-management__modal-header h3 {
          margin: 0;
          font-size: 1.25rem;
        }

        .guest-management__modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
        }

        .guest-management__modal-body {
          padding: 1.5rem;
        }

        .guest-management__form-group {
          margin-bottom: 1rem;
        }

        .guest-management__form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .guest-management__form-group input[type="text"],
        .guest-management__form-group input[type="email"],
        .guest-management__form-group input[type="tel"],
        .guest-management__form-group select,
        .guest-management__form-group textarea {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .guest-management__form-group textarea {
          min-height: 100px;
          resize: vertical;
        }

        .guest-management__checkbox-group {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .guest-management__checkbox-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: normal;
        }

        .guest-management__modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding: 1rem 1.5rem;
          border-top: 1px solid #eee;
        }

        .guest-management__button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .guest-management__button {
          background-color: #ffbd00;
          color: white;
        }

        .guest-management__button:hover {
          background-color: #e6a800;
        }

        .guest-management__button--secondary {
          background-color: #f8f9fa;
          color: #6c757d;
        }

        .guest-management__button--secondary:hover {
          background-color: #e2e6ea;
        }

        @media (max-width: 768px) {
          .guest-management {
            padding: 1rem;
          }

          .guest-management__header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .guest-management__actions {
            width: 100%;
            flex-direction: column;
          }

          .guest-management__search-input {
            width: 100%;
          }

          .guest-management__add-button {
            width: 100%;
          }

          .guest-management__stats {
            flex-direction: column;
            gap: 0.5rem;
          }

          .guest-management__table th,
          .guest-management__table td {
            padding: 0.75rem 0.5rem;
          }

          .guest-management__actions-cell {
            flex-direction: column;
          }

          .guest-management__modal-footer {
            flex-direction: column;
          }

          .guest-management__modal-footer button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default GuestManagement;
