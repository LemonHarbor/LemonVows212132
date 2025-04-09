import React, { useState, useEffect } from "react";

// Define interface for form data to use throughout the component
interface CoupleFormData {
  weddingName: string;
  weddingDate: string;
  location: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  websiteEnabled: boolean;
  musicVotingEnabled: boolean;
  tablePlannerEnabled: boolean;
  guestListEnabled: boolean;
  budgetEnabled: boolean;
  checklistEnabled: boolean;
  [key: string]: string | boolean | Date;
}

const CoupleManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("details");
  const [formData, setFormData] = useState<CoupleFormData>({
    weddingName: "Anna & Thomas",
    weddingDate: "2025-06-15",
    location: "Schloss Elmau, Bayern",
    primaryColor: "#ffbd00",
    secondaryColor: "#ffffff",
    accentColor: "#333333",
    websiteEnabled: true,
    musicVotingEnabled: true,
    tablePlannerEnabled: true,
    guestListEnabled: true,
    budgetEnabled: true,
    checklistEnabled: true,
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [musicVotingLink, setMusicVotingLink] = useState<string>(
    "https://lemonvows.com/music/anna-thomas"
  );
  const [linkCopied, setLinkCopied] = useState<boolean>(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Here would be API call to save data
    setIsEditing(false);
    alert("Änderungen gespeichert!");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    // Fix TypeScript error by explicitly typing the parameter
    setFormData((prev: CoupleFormData) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(musicVotingLink).then(
      () => {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      },
      (err) => {
        console.error("Konnte nicht in die Zwischenablage kopieren: ", err);
      }
    );
  };

  const renderDetailsTab = () => {
    return (
      <div className="couple-management__details">
        <div className="couple-management__actions">
          {!isEditing ? (
            <button
              onClick={handleEditToggle}
              className="couple-management__button"
            >
              Bearbeiten
            </button>
          ) : (
            <div className="couple-management__details-actions">
              <button
                onClick={handleSave}
                className="couple-management__button"
              >
                Speichern
              </button>
              <button
                onClick={handleEditToggle}
                className="couple-management__button couple-management__button--secondary"
              >
                Abbrechen
              </button>
            </div>
          )}
        </div>

        <div className="couple-management__details-grid">
          <div className="couple-management__detail-group">
            <label>Hochzeitsname</label>
            {isEditing ? (
              <input
                type="text"
                name="weddingName"
                value={formData.weddingName}
                onChange={handleInputChange}
              />
            ) : (
              <p>{formData.weddingName}</p>
            )}
          </div>

          <div className="couple-management__detail-group">
            <label>Hochzeitsdatum</label>
            {isEditing ? (
              <input
                type="date"
                name="weddingDate"
                value={formData.weddingDate}
                onChange={handleInputChange}
              />
            ) : (
              <p>{new Date(formData.weddingDate).toLocaleDateString("de-DE")}</p>
            )}
          </div>

          <div className="couple-management__detail-group">
            <label>Ort</label>
            {isEditing ? (
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
              />
            ) : (
              <p>{formData.location}</p>
            )}
          </div>

          <div className="couple-management__detail-group">
            <label>Farbschema</label>
            {isEditing ? (
              <div className="couple-management__colors">
                <div className="couple-management__color-picker">
                  <span>Primär</span>
                  <input
                    type="color"
                    name="primaryColor"
                    value={formData.primaryColor}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="couple-management__color-picker">
                  <span>Sekundär</span>
                  <input
                    type="color"
                    name="secondaryColor"
                    value={formData.secondaryColor}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="couple-management__color-picker">
                  <span>Akzent</span>
                  <input
                    type="color"
                    name="accentColor"
                    value={formData.accentColor}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            ) : (
              <div className="couple-management__colors">
                <div
                  className="couple-management__color-sample"
                  style={{ backgroundColor: formData.primaryColor }}
                ></div>
                <div
                  className="couple-management__color-sample"
                  style={{ backgroundColor: formData.secondaryColor }}
                ></div>
                <div
                  className="couple-management__color-sample"
                  style={{ backgroundColor: formData.accentColor }}
                ></div>
              </div>
            )}
          </div>

          <div className="couple-management__detail-group">
            <label>Aktivierte Funktionen</label>
            {isEditing ? (
              <div className="couple-management__features">
                <label>
                  <input
                    type="checkbox"
                    name="websiteEnabled"
                    checked={formData.websiteEnabled}
                    onChange={handleInputChange}
                  />
                  Hochzeitswebsite
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="musicVotingEnabled"
                    checked={formData.musicVotingEnabled}
                    onChange={handleInputChange}
                  />
                  Musikabstimmung
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="tablePlannerEnabled"
                    checked={formData.tablePlannerEnabled}
                    onChange={handleInputChange}
                  />
                  Tischplaner
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="guestListEnabled"
                    checked={formData.guestListEnabled}
                    onChange={handleInputChange}
                  />
                  Gästeliste
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="budgetEnabled"
                    checked={formData.budgetEnabled}
                    onChange={handleInputChange}
                  />
                  Budget
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="checklistEnabled"
                    checked={formData.checklistEnabled}
                    onChange={handleInputChange}
                  />
                  Checkliste
                </label>
              </div>
            ) : (
              <div className="couple-management__features">
                <p>
                  {[
                    formData.websiteEnabled ? "Hochzeitswebsite" : null,
                    formData.musicVotingEnabled ? "Musikabstimmung" : null,
                    formData.tablePlannerEnabled ? "Tischplaner" : null,
                    formData.guestListEnabled ? "Gästeliste" : null,
                    formData.budgetEnabled ? "Budget" : null,
                    formData.checklistEnabled ? "Checkliste" : null,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderWebsiteTab = () => {
    return (
      <div className="couple-management__website">
        <div className="couple-management__website-actions">
          <button className="couple-management__button">
            Website bearbeiten
          </button>
          <button className="couple-management__button couple-management__button--secondary">
            Vorschau öffnen
          </button>
        </div>

        <div className="couple-management__website-preview">
          <h3>Website-Vorschau</h3>
          <div className="couple-management__website-frame">
            <div className="couple-management__website-placeholder">
              <h3>{formData.weddingName}</h3>
              <p>{new Date(formData.weddingDate).toLocaleDateString("de-DE")}</p>
              <p>{formData.location}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMusicTab = () => {
    return (
      <div className="couple-management__music">
        <div className="couple-management__music-link">
          <h3>Musikabstimmungs-Link</h3>
          <p>
            Teilen Sie diesen Link mit Ihren Gästen, damit sie für ihre
            Lieblingslieder abstimmen können.
          </p>
          <div className="couple-management__copy-link">
            <input type="text" value={musicVotingLink} readOnly />
            <button
              onClick={copyToClipboard}
              className="couple-management__button"
            >
              {linkCopied ? "Kopiert!" : "Kopieren"}
            </button>
          </div>
        </div>

        <div className="couple-management__music-sections">
          <div className="couple-management__music-section">
            <h3>Top-Songs</h3>
            <ul className="couple-management__music-list">
              <li>
                <span>Dancing Queen - ABBA</span>
                <span>24 Stimmen</span>
              </li>
              <li>
                <span>I Gotta Feeling - Black Eyed Peas</span>
                <span>18 Stimmen</span>
              </li>
              <li>
                <span>Shut Up and Dance - WALK THE MOON</span>
                <span>15 Stimmen</span>
              </li>
              <li>
                <span>Don't Stop Me Now - Queen</span>
                <span>12 Stimmen</span>
              </li>
              <li>
                <span>Uptown Funk - Mark Ronson ft. Bruno Mars</span>
                <span>10 Stimmen</span>
              </li>
            </ul>
          </div>

          <div className="couple-management__music-section">
            <h3>Zuletzt hinzugefügt</h3>
            <ul className="couple-management__music-list">
              <li>
                <span>Perfect - Ed Sheeran</span>
                <span>5 Stimmen</span>
              </li>
              <li>
                <span>Can't Stop the Feeling! - Justin Timberlake</span>
                <span>3 Stimmen</span>
              </li>
              <li>
                <span>Love On Top - Beyoncé</span>
                <span>2 Stimmen</span>
              </li>
              <li>
                <span>September - Earth, Wind & Fire</span>
                <span>1 Stimme</span>
              </li>
              <li>
                <span>Happy - Pharrell Williams</span>
                <span>0 Stimmen</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderTablePlannerTab = () => {
    return (
      <div className="couple-management__table-planner">
        <div className="couple-management__placeholder">
          <h3>Tischplaner</h3>
          <p>
            Hier können Sie Ihre Tischanordnung planen und Gäste den Tischen
            zuweisen.
          </p>
          <button className="couple-management__button">
            Tischplaner öffnen
          </button>
        </div>
      </div>
    );
  };

  const renderChecklistTab = () => {
    return (
      <div className="couple-management__checklist">
        <h3>Hochzeits-Checkliste</h3>

        <div className="couple-management__checklist-filters">
          <select className="couple-management__filter-select">
            <option value="all">Alle Aufgaben</option>
            <option value="completed">Abgeschlossen</option>
            <option value="pending">Ausstehend</option>
          </select>
          <button className="couple-management__button">
            Aufgabe hinzufügen
          </button>
        </div>

        <ul className="couple-management__checklist-items">
          <li className="couple-management__checklist-item">
            <div className="couple-management__checklist-item-header">
              <div className="couple-management__checklist-item-checkbox">
                <input type="checkbox" id="task1" checked />
                <label htmlFor="task1">Location buchen</label>
              </div>
              <div className="couple-management__checklist-item-meta">
                <span className="couple-management__priority couple-management__priority--high">
                  Hoch
                </span>
                <span>Fällig: 15.12.2024</span>
              </div>
            </div>
            <div className="couple-management__checklist-item-details">
              <div className="couple-management__checklist-item-assigned">
                Zugewiesen an: Braut
              </div>
              <div>Vertrag mit Schloss Elmau unterschreiben und anzahlen</div>
            </div>
          </li>

          <li className="couple-management__checklist-item">
            <div className="couple-management__checklist-item-header">
              <div className="couple-management__checklist-item-checkbox">
                <input type="checkbox" id="task2" />
                <label htmlFor="task2">Fotografen buchen</label>
              </div>
              <div className="couple-management__checklist-item-meta">
                <span className="couple-management__priority couple-management__priority--medium">
                  Mittel
                </span>
                <span>Fällig: 01.02.2025</span>
              </div>
            </div>
            <div className="couple-management__checklist-item-details">
              <div className="couple-management__checklist-item-assigned">
                Zugewiesen an: Bräutigam
              </div>
              <div>
                Angebote von drei verschiedenen Fotografen einholen und
                vergleichen
              </div>
            </div>
          </li>

          <li className="couple-management__checklist-item">
            <div className="couple-management__checklist-item-header">
              <div className="couple-management__checklist-item-checkbox">
                <input type="checkbox" id="task3" />
                <label htmlFor="task3">Einladungen versenden</label>
              </div>
              <div className="couple-management__checklist-item-meta">
                <span className="couple-management__priority couple-management__priority--low">
                  Niedrig
                </span>
                <span>Fällig: 15.03.2025</span>
              </div>
            </div>
            <div className="couple-management__checklist-item-details">
              <div className="couple-management__checklist-item-assigned">
                Zugewiesen an: Beide
              </div>
              <div>
                Einladungen gestalten, drucken und an alle Gäste versenden
              </div>
            </div>
          </li>
        </ul>
      </div>
    );
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "details":
        return renderDetailsTab();
      case "website":
        return renderWebsiteTab();
      case "music":
        return renderMusicTab();
      case "table-planner":
        return renderTablePlannerTab();
      case "checklist":
        return renderChecklistTab();
      default:
        return renderDetailsTab();
    }
  };

  return (
    <div className="couple-management">
      <div className="couple-management__header">
        <h2>Hochzeitsplanung: {formData.weddingName}</h2>
        <div className="couple-management__stats">
          <div className="couple-management__stat">
            <span className="couple-management__stat-label">Hochzeitsdatum</span>
            <span className="couple-management__stat-value">
              {new Date(formData.weddingDate).toLocaleDateString("de-DE")}
            </span>
          </div>
          <div className="couple-management__stat">
            <span className="couple-management__stat-label">Tage verbleibend</span>
            <span className="couple-management__stat-value">
              {Math.ceil(
                (new Date(formData.weddingDate).getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
              )}
            </span>
          </div>
          <div className="couple-management__stat">
            <span className="couple-management__stat-label">Ort</span>
            <span className="couple-management__stat-value">
              {formData.location}
            </span>
          </div>
        </div>
      </div>

      <div className="couple-management__tabs">
        <button
          className={`couple-management__tab ${
            activeTab === "details" ? "couple-management__tab--active" : ""
          }`}
          onClick={() => handleTabChange("details")}
        >
          Details
        </button>
        <button
          className={`couple-management__tab ${
            activeTab === "website" ? "couple-management__tab--active" : ""
          }`}
          onClick={() => handleTabChange("website")}
        >
          Website
        </button>
        <button
          className={`couple-management__tab ${
            activeTab === "music" ? "couple-management__tab--active" : ""
          }`}
          onClick={() => handleTabChange("music")}
        >
          Musikabstimmung
        </button>
        <button
          className={`couple-management__tab ${
            activeTab === "table-planner" ? "couple-management__tab--active" : ""
          }`}
          onClick={() => handleTabChange("table-planner")}
        >
          Tischplaner
        </button>
        <button
          className={`couple-management__tab ${
            activeTab === "checklist" ? "couple-management__tab--active" : ""
          }`}
          onClick={() => handleTabChange("checklist")}
        >
          Checkliste
        </button>
      </div>

      <div className="couple-management__content">{renderActiveTab()}</div>

      <style jsx>{`
        .couple-management {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .couple-management__header {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .couple-management__header h2 {
          margin: 0;
        }
        
        .couple-management__stats {
          display: flex;
          gap: 2rem;
          background-color: #f8f9fa;
          padding: 1rem;
          border-radius: 8px;
        }
        
        .couple-management__stat {
          display: flex;
          flex-direction: column;
        }
        
        .couple-management__stat-label {
          font-size: 0.9rem;
          color: #6c757d;
        }
        
        .couple-management__stat-value {
          font-size: 1.25rem;
          font-weight: 600;
        }
        
        .couple-management__tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid #ddd;
        }
        
        .couple-management__tab {
          padding: 1rem 1.5rem;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .couple-management__tab:hover {
          color: #ffbd00;
        }
        
        .couple-management__tab--active {
          border-bottom: 2px solid #ffbd00;
          color: #ffbd00;
        }
        
        .couple-management__content {
          min-height: 400px;
        }
        
        .couple-management__actions {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 2rem;
        }
        
        .couple-management__details-actions {
          display: flex;
          gap: 1rem;
        }
        
        .couple-management__button {
          padding: 0.75rem 1.5rem;
          background-color: #ffbd00;
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .couple-management__button:hover {
          background-color: #e6a800;
        }
        
        .couple-management__button--secondary {
          background-color: #f8f9fa;
          color: #6c757d;
        }
        
        .couple-management__button--secondary:hover {
          background-color: #e2e6ea;
        }
        
        .couple-management__details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .couple-management__detail-group {
          margin-bottom: 1.5rem;
        }
        
        .couple-management__detail-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .couple-management__detail-group input[type="text"],
        .couple-management__detail-group input[type="date"] {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: inherit;
          font-size: inherit;
        }
        
        .couple-management__colors {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        
        .couple-management__color-picker {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        
        .couple-management__color-picker span {
          font-size: 0.9rem;
        }
        
        .couple-management__color-sample {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px solid #ddd;
        }
        
        .couple-management__features {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .couple-management__features label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: normal;
        }
        
        .couple-management__website-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .couple-management__checklist-filters {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }
        
        .couple-management__filter-select {
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: inherit;
          font-size: inherit;
        }
        
        .couple-management__checklist-items {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .couple-management__checklist-item {
          background-color: white;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .couple-management__checklist-item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        
        .couple-management__checklist-item-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
          font-size: 0.9rem;
        }
        
        .couple-management__checklist-item-checkbox {
          display: flex;
          gap: 0.5rem;
          font-weight: 500;
        }
        
        .couple-management__checklist-item-checkbox input[type="checkbox"] {
          margin-top: 0.25rem;
        }
        
        .couple-management__priority {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }
        
        .couple-management__priority--high {
          background-color: #f8d7da;
          color: #842029;
        }
        
        .couple-management__priority--medium {
          background-color: #fff3cd;
          color: #664d03;
        }
        
        .couple-management__priority--low {
          background-color: #d1e7dd;
          color: #0f5132;
        }
        
        .couple-management__checklist-item-details {
          padding-left: 1.5rem;
          margin-top: 0.5rem;
          font-size: 0.9rem;
          color: #666;
        }
        
        .couple-management__checklist-item-assigned {
          margin-bottom: 0.25rem;
        }
        
        .couple-management__website-preview {
          margin-bottom: 2rem;
        }
        
        .couple-management__website-frame {
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
          height: 400px;
        }
        
        .couple-management__website-placeholder {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: #f8f9fa;
        }
        
        .couple-management__music-sections {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .couple-management__music-section {
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .couple-management__music-section h3 {
          margin-top: 0;
          margin-bottom: 1.5rem;
        }
        
        .couple-management__music-link {
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .couple-management__music-link h3 {
          margin-top: 0;
          margin-bottom: 1rem;
        }
        
        .couple-management__copy-link {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .couple-management__copy-link input {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: inherit;
          font-size: inherit;
        }
        
        .couple-management__table-planner {
          margin-bottom: 2rem;
        }
        
        .couple-management__placeholder {
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 3rem;
          text-align: center;
        }
        
        .couple-management__placeholder p {
          margin-bottom: 1.5rem;
          color: #666;
        }
        
        @media (max-width: 768px) {
          .couple-management {
            padding: 1rem;
          }
          
          .couple-management__header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          .couple-management__tabs {
            flex-wrap: nowrap;
            overflow-x: auto;
          }
          
          .couple-management__tab {
            padding: 0.75rem 1rem;
            font-size: 0.9rem;
          }
          
          .couple-management__stats {
            flex-direction: column;
            gap: 1rem;
          }
          
          .couple-management__actions {
            flex-direction: column;
          }
          
          .couple-management__actions button {
            width: 100%;
          }
          
          .couple-management__details-grid {
            grid-template-columns: 1fr;
          }
          
          .couple-management__colors {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .couple-management__form-actions,
          .couple-management__website-actions,
          .couple-management__details-actions {
            flex-direction: column;
          }
          
          .couple-management__form-actions button,
          .couple-management__website-actions button,
          .couple-management__details-actions button {
            width: 100%;
          }
          
          .couple-management__music-sections {
            grid-template-columns: 1fr;
          }
          
          .couple-management__copy-link {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};
export default CoupleManagement;
