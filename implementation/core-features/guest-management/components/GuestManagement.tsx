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
  notes: string;
  tableAssignment: string | null;
  group: string;
}

const GuestManagement: React.FC = () => {
  const [guests, setGuests] = useState<GuestProps[]>([
    {
      id: "1",
      firstName: "Max",
      lastName: "Mustermann",
      email: "max@example.com",
      phone: "+49123456789",
      rsvpStatus: "confirmed",
      dietaryRestrictions: ["vegetarian"],
      plusOne: true,
      notes: "Allergic to nuts",
      tableAssignment: "Table 1",
      group: "Family",
    },
    {
      id: "2",
      firstName: "Anna",
      lastName: "Schmidt",
      email: "anna@example.com",
      phone: "+49987654321",
      rsvpStatus: "pending",
      dietaryRestrictions: [],
      plusOne: false,
      notes: "",
      tableAssignment: null,
      group: "Friends",
    },
    {
      id: "3",
      firstName: "Thomas",
      lastName: "Müller",
      email: "thomas@example.com",
      phone: "+49123123123",
      rsvpStatus: "declined",
      dietaryRestrictions: ["gluten-free"],
      plusOne: false,
      notes: "Cannot attend due to prior commitment",
      tableAssignment: null,
      group: "Colleagues",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<keyof GuestProps>("lastName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentGuest, setCurrentGuest] = useState<GuestProps | null>(null);
  const [filterRsvp, setFilterRsvp] = useState<string>("all");

  const handleSort = (column: keyof GuestProps) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterRsvp(e.target.value);
  };

  const handleAddGuest = () => {
    setCurrentGuest({
      id: `${guests.length + 1}`,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      rsvpStatus: "pending",
      dietaryRestrictions: [],
      plusOne: false,
      notes: "",
      tableAssignment: null,
      group: "",
    });
    setShowModal(true);
  };

  const handleEditGuest = (guest: GuestProps) => {
    setCurrentGuest(guest);
    setShowModal(true);
  };

  const handleDeleteGuest = (id: string) => {
    if (window.confirm("Are you sure you want to delete this guest?")) {
      setGuests(guests.filter((guest) => guest.id !== id));
    }
  };

  const handleSaveGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentGuest) {
      const existingIndex = guests.findIndex((g) => g.id === currentGuest.id);
      if (existingIndex >= 0) {
        // Update existing guest
        const updatedGuests = [...guests];
        updatedGuests[existingIndex] = currentGuest;
        setGuests(updatedGuests);
      } else {
        // Add new guest
        setGuests([...guests, currentGuest]);
      }
      setShowModal(false);
      setCurrentGuest(null);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (currentGuest) {
      const { name, value, type } = e.target;
      if (type === "checkbox") {
        const checked = (e.target as HTMLInputElement).checked;
        setCurrentGuest({
          ...currentGuest,
          [name]: checked,
        });
      } else {
        setCurrentGuest({
          ...currentGuest,
          [name]: value,
        });
      }
    }
  };

  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterRsvp === "all" || guest.rsvpStatus === filterRsvp;

    return matchesSearch && matchesFilter;
  });

  // Fix TypeScript error by safely accessing properties with optional chaining
  const sortedGuests = [...filteredGuests].sort((a, b) => {
    // Handle potential null or undefined values with nullish coalescing
    const aValue = a[sortBy] ?? '';
    const bValue = b[sortBy] ?? '';
    
    if (aValue < bValue) {
      return sortDirection === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === "asc" ? 1 : -1;
    }
    return 0;
  });

  const totalGuests = guests.length;
  const confirmedGuests = guests.filter(
    (guest) => guest.rsvpStatus === "confirmed"
  ).length;
  const pendingGuests = guests.filter(
    (guest) => guest.rsvpStatus === "pending"
  ).length;
  const declinedGuests = guests.filter(
    (guest) => guest.rsvpStatus === "declined"
  ).length;

  return (
    <div className="guest-management">
      <div className="guest-management__header">
        <h2>Gästeverwaltung</h2>
        <div className="guest-management__actions">
          <input
            type="text"
            placeholder="Suche nach Gästen..."
            value={searchTerm}
            onChange={handleSearch}
            className="guest-management__search-input"
          />
          <select
            value={filterRsvp}
            onChange={handleFilterChange}
            className="guest-management__filter-select"
          >
            <option value="all">Alle RSVP-Status</option>
            <option value="confirmed">Bestätigt</option>
            <option value="pending">Ausstehend</option>
            <option value="declined">Abgelehnt</option>
          </select>
          <button
            onClick={handleAddGuest}
            className="guest-management__add-button"
          >
            Gast hinzufügen
          </button>
        </div>
      </div>

      <div className="guest-management__stats">
        <div className="guest-management__stat">
          <span className="guest-management__stat-label">Gesamt:</span>
          <span className="guest-management__stat-value">{totalGuests}</span>
        </div>
        <div className="guest-management__stat">
          <span className="guest-management__stat-label">Bestätigt:</span>
          <span className="guest-management__stat-value guest-management__stat-value--confirmed">
            {confirmedGuests}
          </span>
        </div>
        <div className="guest-management__stat">
          <span className="guest-management__stat-label">Ausstehend:</span>
          <span className="guest-management__stat-value guest-management__stat-value--pending">
            {pendingGuests}
          </span>
        </div>
        <div className="guest-management__stat">
          <span className="guest-management__stat-label">Abgelehnt:</span>
          <span className="guest-management__stat-value guest-management__stat-value--declined">
            {declinedGuests}
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
                  <span>
                    {sortDirection === "asc" ? " ▲" : " ▼"}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort("lastName")}>
                Nachname
                {sortBy === "lastName" && (
                  <span>
                    {sortDirection === "asc" ? " ▲" : " ▼"}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort("email")}>
                E-Mail
                {sortBy === "email" && (
                  <span>
                    {sortDirection === "asc" ? " ▲" : " ▼"}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort("rsvpStatus")}>
                RSVP
                {sortBy === "rsvpStatus" && (
                  <span>
                    {sortDirection === "asc" ? " ▲" : " ▼"}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort("group")}>
                Gruppe
                {sortBy === "group" && (
                  <span>
                    {sortDirection === "asc" ? " ▲" : " ▼"}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort("tableAssignment")}>
                Tisch
                {sortBy === "tableAssignment" && (
                  <span>
                    {sortDirection === "asc" ? " ▲" : " ▼"}
                  </span>
                )}
              </th>
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
                    className={`guest-management__rsvp-badge guest-management__rsvp-badge--${guest.rsvpStatus}`}
                  >
                    {guest.rsvpStatus === "confirmed"
                      ? "Bestätigt"
                      : guest.rsvpStatus === "pending"
                      ? "Ausstehend"
                      : "Abgelehnt"}
                  </span>
                </td>
                <td>{guest.group}</td>
                <td>{guest.tableAssignment || "-"}</td>
                <td className="guest-management__actions-cell">
                  <button
                    onClick={() => handleEditGuest(guest)}
                    className="guest-management__edit-button"
                  >
                    Bearbeiten
                  </button>
                  <button
                    onClick={() => handleDeleteGuest(guest.id)}
                    className="guest-management__delete-button"
                  >
                    Löschen
                  </button>
                </td>
              </tr>
            ))}
            {sortedGuests.length === 0 && (
              <tr>
                <td colSpan={7} className="guest-management__empty-message">
                  Keine Gäste gefunden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && currentGuest && (
        <div className="guest-management__modal">
          <div className="guest-management__modal-content">
            <div className="guest-management__modal-header">
              <h3>
                {currentGuest.id === `${guests.length + 1}`
                  ? "Gast hinzufügen"
                  : "Gast bearbeiten"}
              </h3>
              <button
                className="guest-management__modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSaveGuest}>
              <div className="guest-management__modal-body">
                <div className="guest-management__form-group">
                  <label htmlFor="firstName">Vorname</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={currentGuest.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="guest-management__form-group">
                  <label htmlFor="lastName">Nachname</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={currentGuest.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="guest-management__form-group">
                  <label htmlFor="email">E-Mail</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={currentGuest.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="guest-management__form-group">
                  <label htmlFor="phone">Telefon</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={currentGuest.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="guest-management__form-group">
                  <label htmlFor="rsvpStatus">RSVP-Status</label>
                  <select
                    id="rsvpStatus"
                    name="rsvpStatus"
                    value={currentGuest.rsvpStatus}
                    onChange={handleInputChange}
                  >
                    <option value="pending">Ausstehend</option>
                    <option value="confirmed">Bestätigt</option>
                    <option value="declined">Abgelehnt</option>
                  </select>
                </div>
                <div className="guest-management__form-group">
                  <label htmlFor="group">Gruppe</label>
                  <input
                    type="text"
                    id="group"
                    name="group"
                    value={currentGuest.group}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="guest-management__form-group">
                  <label htmlFor="tableAssignment">Tischzuweisung</label>
                  <input
                    type="text"
                    id="tableAssignment"
                    name="tableAssignment"
                    value={currentGuest.tableAssignment || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="guest-management__form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="plusOne"
                      checked={currentGuest.plusOne}
                      onChange={handleInputChange}
                    />
                    Plus Eins
                  </label>
                </div>
                <div className="guest-management__form-group">
                  <label htmlFor="notes">Notizen</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={currentGuest.notes}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="guest-management__modal-footer">
                <button
                  type="button"
                  className="guest-management__button guest-management__button--secondary"
                  onClick={() => setShowModal(false)}
                >
                  Abbrechen
                </button>
                <button type="submit" className="guest-management__button">
                  Speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .guest-management {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .guest-management__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .guest-management__header h2 {
          margin: 0;
        }
        .guest-management__actions {
          display: flex;
          gap: 1rem;
        }
        .guest-management__search-input {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          min-width: 250px;
        }
        .guest-management__filter-select {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
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
          gap: 2rem;
          margin-bottom: 2rem;
          background-color: #f8f9fa;
          padding: 1rem;
          border-radius: 8px;
        }
        .guest-management__stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .guest-management__stat-label {
          font-size: 0.9rem;
          color: #6c757d;
        }
        .guest-management__stat-value {
          font-size: 1.5rem;
          font-weight: 600;
        }
        .guest-management__stat-value--confirmed {
          color: #198754;
        }
        .guest-management__stat-value--pending {
          color: #fd7e14;
        }
        .guest-management__stat-value--declined {
          color: #dc3545;
        }
        .guest-management__table-container {
          overflow-x: auto;
        }
        .guest-management__table {
          width: 100%;
          border-collapse: collapse;
        }
        .guest-management__table th,
        .guest-management__table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        .guest-management__table th {
          background-color: #f8f9fa;
          cursor: pointer;
        }
        .guest-management__table th:hover {
          background-color: #e9ecef;
        }
        .guest-management__table tbody tr:hover {
          background-color: #f8f9fa;
        }
        .guest-management__rsvp-badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        .guest-management__rsvp-badge--confirmed {
          background-color: #d1e7dd;
          color: #0f5132;
        }
        .guest-management__rsvp-badge--pending {
          background-color: #fff3cd;
          color: #664d03;
        }
        .guest-management__rsvp-badge--declined {
          background-color: #f8d7da;
          color: #842029;
        }
        .guest-management__empty-message {
          text-align: center;
          padding: 2rem;
          color: #6c757d;
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
