import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Couple, Wedding, Guest, Table, BudgetCategory, ChecklistCategory } from '../models/CoupleTypes';
import { 
  coupleService, 
  weddingService, 
  guestService, 
  tablePlannerService, 
  budgetService, 
  checklistService, 
  authService 
} from '../services/SupabaseService';

interface CoupleManagementProps {
  userId?: string;
  isAdmin?: boolean;
}

const CoupleManagement: React.FC<CoupleManagementProps> = ({ userId, isAdmin = false }) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [couple, setCouple] = useState<Couple | null>(null);
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [checklistCategories, setChecklistCategories] = useState<ChecklistCategory[]>([]);
  const [activeTab, setActiveTab] = useState<'details' | 'guests' | 'tables' | 'budget' | 'checklists' | 'website' | 'music'>('details');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const loadCoupleData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user if userId not provided
        let currentUserId = userId;
        if (!currentUserId) {
          const currentUser = await authService.getCurrentUser();
          if (!currentUser) {
            throw new Error('User not authenticated');
          }
          currentUserId = currentUser.id;
        }

        // Get couple data
        let coupleData;
        if (isAdmin && userId) {
          coupleData = await coupleService.getCoupleById(userId);
        } else {
          coupleData = await coupleService.getCoupleByUserId(currentUserId);
        }

        if (!coupleData) {
          throw new Error('Couple not found');
        }

        setCouple(coupleData);

        // Get wedding data
        const weddingData = await weddingService.getWeddingByCoupleId(coupleData.id);
        if (weddingData) {
          setWedding(weddingData);

          // Load additional data
          const [guestsData, tablesData, budgetData, checklistData] = await Promise.all([
            guestService.getGuestsByWeddingId(weddingData.id),
            tablePlannerService.getTablesByWeddingId(weddingData.id),
            budgetService.getBudgetCategoriesByWeddingId(weddingData.id),
            checklistService.getChecklistCategoriesByWeddingId(weddingData.id)
          ]);

          setGuests(guestsData || []);
          setTables(tablesData || []);
          setBudgetCategories(budgetData || []);
          setChecklistCategories(checklistData || []);
        }

        setFormData({
          ...coupleData,
          ...(weddingData || {})
        });
      } catch (err: any) {
        console.error('Error loading couple data:', err);
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadCoupleData();
  }, [userId, isAdmin]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSaveDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Update couple data
      if (couple) {
        const coupleData = {
          partner1FirstName: formData.partner1FirstName,
          partner1LastName: formData.partner1LastName,
          partner2FirstName: formData.partner2FirstName,
          partner2LastName: formData.partner2LastName,
          email: formData.email,
          phone: formData.phone
        };

        await coupleService.updateCouple(couple.id, coupleData);
      }

      // Update or create wedding data
      const weddingData = {
        coupleId: couple?.id,
        date: formData.date,
        location: formData.location,
        venue: formData.venue,
        theme: formData.theme,
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
        accentColor: formData.accentColor,
        guestCount: formData.guestCount,
        websiteEnabled: formData.websiteEnabled || false,
        websiteTheme: formData.websiteTheme,
        musicVotingEnabled: formData.musicVotingEnabled || false
      };

      if (wedding) {
        await weddingService.updateWedding(wedding.id, weddingData);
      } else if (couple) {
        await weddingService.createWedding(weddingData);
        // Reload the page to get the new wedding data
        window.location.reload();
      }

      // Refresh data
      if (couple) {
        const updatedCouple = await coupleService.getCoupleById(couple.id);
        setCouple(updatedCouple);
      }

      if (wedding) {
        const updatedWedding = await weddingService.getWeddingById(wedding.id);
        setWedding(updatedWedding);
      }

      setIsEditing(false);
    } catch (err: any) {
      console.error('Error saving details:', err);
      setError(err.message || 'Failed to save data');
    } finally {
      setLoading(false);
    }
  };

  const renderDetailsTab = () => {
    return (
      <div className="couple-management__details">
        <h2>{t('couple.weddingDetails')}</h2>
        
        {isEditing ? (
          <form className="couple-management__form">
            <div className="couple-management__form-section">
              <h3>{t('couple.title')}</h3>
              
              <div className="couple-management__form-group">
                <label htmlFor="partner1FirstName">{t('auth.firstName')} (Partner 1)</label>
                <input
                  type="text"
                  id="partner1FirstName"
                  name="partner1FirstName"
                  value={formData.partner1FirstName || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="couple-management__form-group">
                <label htmlFor="partner1LastName">{t('auth.lastName')} (Partner 1)</label>
                <input
                  type="text"
                  id="partner1LastName"
                  name="partner1LastName"
                  value={formData.partner1LastName || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="couple-management__form-group">
                <label htmlFor="partner2FirstName">{t('auth.firstName')} (Partner 2)</label>
                <input
                  type="text"
                  id="partner2FirstName"
                  name="partner2FirstName"
                  value={formData.partner2FirstName || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="couple-management__form-group">
                <label htmlFor="partner2LastName">{t('auth.lastName')} (Partner 2)</label>
                <input
                  type="text"
                  id="partner2LastName"
                  name="partner2LastName"
                  value={formData.partner2LastName || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="couple-management__form-group">
                <label htmlFor="email">{t('auth.email')}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="couple-management__form-group">
                <label htmlFor="phone">{t('guestManagement.phone')}</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="couple-management__form-section">
              <h3>{t('couple.weddingDetails')}</h3>
              
              <div className="couple-management__form-group">
                <label htmlFor="date">{t('couple.weddingDate')}</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="couple-management__form-group">
                <label htmlFor="location">{t('couple.location')}</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="couple-management__form-group">
                <label htmlFor="venue">{t('couple.venue')}</label>
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  value={formData.venue || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="couple-management__form-group">
                <label htmlFor="theme">{t('couple.theme')}</label>
                <input
                  type="text"
                  id="theme"
                  name="theme"
                  value={formData.theme || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="couple-management__form-group">
                <label htmlFor="guestCount">{t('guestManagement.totalGuests')}</label>
                <input
                  type="number"
                  id="guestCount"
                  name="guestCount"
                  value={formData.guestCount || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="couple-management__form-section">
              <h3>{t('couple.colors')}</h3>
              
              <div className="couple-management__form-group">
                <label htmlFor="primaryColor">{t('couple.primaryColor')}</label>
                <input
                  type="color"
                  id="primaryColor"
                  name="primaryColor"
                  value={formData.primaryColor || '#ffffff'}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="couple-management__form-group">
                <label htmlFor="secondaryColor">{t('couple.secondaryColor')}</label>
                <input
                  type="color"
                  id="secondaryColor"
                  name="secondaryColor"
                  value={formData.secondaryColor || '#ffffff'}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="couple-management__form-group">
                <label htmlFor="accentColor">{t('couple.accentColor')}</label>
                <input
                  type="color"
                  id="accentColor"
                  name="accentColor"
                  value={formData.accentColor || '#ffffff'}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="couple-management__form-section">
              <h3>{t('couple.weddingWebsite')}</h3>
              
              <div className="couple-management__form-group">
                <label htmlFor="websiteEnabled">
                  <input
                    type="checkbox"
                    id="websiteEnabled"
                    name="websiteEnabled"
                    checked={formData.websiteEnabled || false}
                    onChange={handleInputChange}
                  />
                  {t('couple.enableWebsite')}
                </label>
              </div>
              
              {formData.websiteEnabled && (
                <div className="couple-management__form-group">
                  <label htmlFor="websiteTheme">{t('couple.websiteTheme')}</label>
                  <select
                    id="websiteTheme"
                    name="websiteTheme"
                    value={formData.websiteTheme || 'classic'}
                    onChange={handleInputChange}
                  >
                    <option value="classic">{t('couple.classic')}</option>
                    <option value="modern">{t('couple.modern')}</option>
                    <option value="rustic">{t('couple.rustic')}</option>
                    <option value="romantic">{t('couple.romantic')}</option>
                    <option value="minimal">{t('couple.minimal')}</option>
                  </select>
                </div>
              )}
            </div>
            
            <div className="couple-management__form-section">
              <h3>{t('couple.musicVoting')}</h3>
              
              <div className="couple-management__form-group">
                <label htmlFor="musicVotingEnabled">
                  <input
                    type="checkbox"
                    id="musicVotingEnabled"
                    name="musicVotingEnabled"
                    checked={formData.musicVotingEnabled || false}
                    onChange={handleInputChange}
                  />
                  {t('couple.enableMusicVoting')}
                </label>
              </div>
            </div>
            
            <div className="couple-management__form-actions">
              <button
                type="button"
                className="couple-management__button couple-management__button--secondary"
                onClick={() => setIsEditing(false)}
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                className="couple-management__button"
                onClick={handleSaveDetails}
                disabled={loading}
              >
                {loading ? t('common.loading') : t('common.save')}
              </button>
            </div>
          </form>
        ) : (
          <div className="couple-management__details-view">
            <div className="couple-management__details-section">
              <h3>{t('couple.title')}</h3>
              <div className="couple-management__details-grid">
                <div>
                  <strong>{t('auth.firstName')} (Partner 1):</strong>
                  <p>{couple?.partner1FirstName || '-'}</p>
                </div>
                <div>
                  <strong>{t('auth.lastName')} (Partner 1):</strong>
                  <p>{couple?.partner1LastName || '-'}</p>
                </div>
                <div>
                  <strong>{t('auth.firstName')} (Partner 2):</strong>
                  <p>{couple?.partner2FirstName || '-'}</p>
                </div>
                <div>
                  <strong>{t('auth.lastName')} (Partner 2):</strong>
                  <p>{couple?.partner2LastName || '-'}</p>
                </div>
                <div>
                  <strong>{t('auth.email')}:</strong>
                  <p>{couple?.email || '-'}</p>
                </div>
                <div>
                  <strong>{t('guestManagement.phone')}:</strong>
                  <p>{couple?.phone || '-'}</p>
                </div>
              </div>
            </div>
            
            <div className="couple-management__details-section">
              <h3>{t('couple.weddingDetails')}</h3>
              {wedding ? (
                <div className="couple-management__details-grid">
                  <div>
                    <strong>{t('couple.weddingDate')}:</strong>
                    <p>{wedding.date ? new Date(wedding.date).toLocaleDateString() : '-'}</p>
                  </div>
                  <div>
                    <strong>{t('couple.location')}:</strong>
                    <p>{wedding.location || '-'}</p>
                  </div>
                  <div>
                    <strong>{t('couple.venue')}:</strong>
                    <p>{wedding.venue || '-'}</p>
                  </div>
                  <div>
                    <strong>{t('couple.theme')}:</strong>
                    <p>{wedding.theme || '-'}</p>
                  </div>
                  <div>
                    <strong>{t('guestManagement.totalGuests')}:</strong>
                    <p>{wedding.guestCount || '-'}</p>
                  </div>
                </div>
              ) : (
                <p>{t('couple.noWeddingDetails')}</p>
              )}
            </div>
            
            {wedding && (
              <>
                <div className="couple-management__details-section">
                  <h3>{t('couple.colors')}</h3>
                  <div className="couple-management__colors">
                    <div className="couple-management__color">
                      <div 
                        className="couple-management__color-swatch"
                        style={{ backgroundColor: wedding.primaryColor || '#ffffff' }}
                      ></div>
                      <span>{t('couple.primaryColor')}</span>
                    </div>
                    <div className="couple-management__color">
                      <div 
                        className="couple-management__color-swatch"
                        style={{ backgroundColor: wedding.secondaryColor || '#ffffff' }}
                      ></div>
                      <span>{t('couple.secondaryColor')}</span>
                    </div>
                    <div className="couple-management__color">
                      <div 
                        className="couple-management__color-swatch"
                        style={{ backgroundColor: wedding.accentColor || '#ffffff' }}
                      ></div>
                      <span>{t('couple.accentColor')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="couple-management__details-section">
                  <h3>{t('couple.weddingWebsite')}</h3>
                  {wedding.websiteEnabled ? (
                    <div>
                      <p>
                        <strong>{t('couple.websiteTheme')}:</strong> {t(`couple.${wedding.websiteTheme || 'classic'}`)}
                      </p>
                      {wedding.websiteUrl && (
                        <p>
                          <strong>{t('couple.websiteUrl')}:</strong> 
                          <a href={wedding.websiteUrl} target="_blank" rel="noopener noreferrer">
                            {wedding.websiteUrl}
                          </a>
                        </p>
                      )}
                      <div className="couple-management__website-actions">
                        <button className="couple-management__button couple-management__button--small">
                          {t('couple.editWebsite')}
                        </button>
                        <button className="couple-management__button couple-management__button--small couple-management__button--secondary">
                          {t('couple.previewWebsite')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p>{t('couple.websiteNotEnabled')}</p>
                  )}
                </div>
                
                <div className="couple-management__details-section">
                  <h3>{t('couple.musicVoting')}</h3>
                  {wedding.musicVotingEnabled ? (
                    <p>{t('couple.musicVotingEnabled')}</p>
                  ) : (
                    <p>{t('couple.musicVotingNotEnabled')}</p>
                  )}
                </div>
              </>
            )}
            
            <div className="couple-management__details-actions">
              <button
                className="couple-management__button"
                onClick={() => setIsEditing(true)}
              >
                {t('couple.editWedding')}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderGuestsTab = () => {
    return (
      <div className="couple-management__guests">
        <h2>{t('guestManagement.title')}</h2>
        
        <div className="couple-management__stats">
          <div className="couple-management__stat">
            <span className="couple-management__stat-value">{guests.length}</span>
            <span className="couple-management__stat-label">{t('guestManagement.totalGuests')}</span>
          </div>
          <div className="couple-management__stat">
            <span className="couple-management__stat-value">
              {guests.filter(guest => guest.rsvpStatus === 'confirmed').length}
            </span>
            <span className="couple-management__stat-label">{t('guestManagement.confirmedGuests')}</span>
          </div>
          <div className="couple-management__stat">
            <span className="couple-management__stat-value">
              {guests.filter(guest => guest.rsvpStatus === 'pending').length}
            </span>
            <span className="couple-management__stat-label">{t('guestManagement.pendingGuests')}</span>
          </div>
          <div className="couple-management__stat">
            <span className="couple-management__stat-value">
              {guests.filter(guest => guest.rsvpStatus === 'declined').length}
            </span>
            <span className="couple-management__stat-label">{t('guestManagement.declinedGuests')}</span>
          </div>
        </div>
        
        <div className="couple-management__actions">
          <button className="couple-management__button">
            {t('guestManagement.addGuest')}
          </button>
          <button className="couple-management__button couple-management__button--secondary">
            {t('common.import')}
          </button>
        </div>
        
        <div className="couple-management__table-container">
          <table className="couple-management__table">
            <thead>
              <tr>
                <th>{t('guestManagement.firstName')}</th>
                <th>{t('guestManagement.lastName')}</th>
                <th>{t('guestManagement.email')}</th>
                <th>{t('guestManagement.rsvpStatus')}</th>
                <th>{t('guestManagement.table')}</th>
                <th>{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {guests.length > 0 ? (
                guests.map(guest => (
                  <tr key={guest.id}>
                    <td>{guest.firstName}</td>
                    <td>{guest.lastName}</td>
                    <td>{guest.email || '-'}</td>
                    <td>
                      <span className={`couple-management__status couple-management__status--${guest.rsvpStatus}`}>
                        {t(`guestManagement.${guest.rsvpStatus}`)}
                      </span>
                    </td>
                    <td>
                      {guest.tableId ? (
                        `${tables.find(table => table.id === guest.tableId)?.name || '-'}, ${t('guestManagement.seat')} ${(guest.seatIndex || 0) + 1}`
                      ) : (
                        t('guestManagement.notAssigned')
                      )}
                    </td>
                    <td>
                      <div className="couple-management__table-actions">
                        <button className="couple-management__icon-button">
                          ✏️
                        </button>
                        <button className="couple-management__icon-button">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="couple-management__empty">
                    {t('guestManagement.noGuests')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderTablesTab = () => {
    return (
      <div className="couple-management__tables">
        <h2>{t('tablePlanner.title')}</h2>
        
        <div className="couple-management__actions">
          <button className="couple-management__button">
            {t('tablePlanner.addTable')}
          </button>
        </div>
        
        <div className="couple-management__table-planner">
          {/* This would be replaced with the actual TablePlanner component */}
          <div className="couple-management__placeholder">
            <p>{t('tablePlanner.plannerDescription')}</p>
            <button className="couple-management__button">
              {t('common.openPlanner')}
            </button>
          </div>
        </div>
        
        <div className="couple-management__table-container">
          <table className="couple-management__table">
            <thead>
              <tr>
                <th>{t('tablePlanner.tableName')}</th>
                <th>{t('tablePlanner.tableType')}</th>
                <th>{t('tablePlanner.seats')}</th>
                <th>{t('tablePlanner.assignedGuests')}</th>
                <th>{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {tables.length > 0 ? (
                tables.map(table => (
                  <tr key={table.id}>
                    <td>{table.name}</td>
                    <td>{t(`tablePlanner.${table.type}`)}</td>
                    <td>{table.seats}</td>
                    <td>
                      {guests.filter(guest => guest.tableId === table.id).length} / {table.seats}
                    </td>
                    <td>
                      <div className="couple-management__table-actions">
                        <button className="couple-management__icon-button">
                          ✏️
                        </button>
                        <button className="couple-management__icon-button">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="couple-management__empty">
                    {t('tablePlanner.noTables')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderBudgetTab = () => {
    // Calculate budget statistics
    const totalPlanned = budgetCategories.reduce((sum, category) => sum + (category.plannedAmount || 0), 0);
    const totalActual = budgetCategories.reduce((sum, category) => sum + (category.actualAmount || 0), 0);
    const remaining = totalPlanned - totalActual;
    
    return (
      <div className="couple-management__budget">
        <h2>{t('budgetPlanner.title')}</h2>
        
        <div className="couple-management__stats">
          <div className="couple-management__stat">
            <span className="couple-management__stat-value">
              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(totalPlanned)}
            </span>
            <span className="couple-management__stat-label">{t('budgetPlanner.totalPlanned')}</span>
          </div>
          <div className="couple-management__stat">
            <span className="couple-management__stat-value">
              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(totalActual)}
            </span>
            <span className="couple-management__stat-label">{t('budgetPlanner.totalActual')}</span>
          </div>
          <div className="couple-management__stat">
            <span className={`couple-management__stat-value ${remaining < 0 ? 'couple-management__stat-value--negative' : ''}`}>
              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(remaining)}
            </span>
            <span className="couple-management__stat-label">{t('budgetPlanner.remaining')}</span>
          </div>
        </div>
        
        <div className="couple-management__actions">
          <button className="couple-management__button">
            {t('budgetPlanner.addCategory')}
          </button>
        </div>
        
        <div className="couple-management__budget-categories">
          {budgetCategories.length > 0 ? (
            budgetCategories.map(category => (
              <div key={category.id} className="couple-management__budget-category">
                <div className="couple-management__budget-category-header">
                  <h3>{category.name}</h3>
                  <div className="couple-management__budget-category-actions">
                    <button className="couple-management__icon-button">
                      ✏️
                    </button>
                    <button className="couple-management__icon-button">
                      🗑️
                    </button>
                  </div>
                </div>
                
                <div className="couple-management__budget-category-stats">
                  <div>
                    <strong>{t('budgetPlanner.plannedAmount')}:</strong>
                    <span>
                      {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(category.plannedAmount || 0)}
                    </span>
                  </div>
                  <div>
                    <strong>{t('budgetPlanner.actualAmount')}:</strong>
                    <span>
                      {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(category.actualAmount || 0)}
                    </span>
                  </div>
                  <div>
                    <strong>{t('budgetPlanner.remaining')}:</strong>
                    <span className={category.plannedAmount - category.actualAmount < 0 ? 'couple-management__negative' : ''}>
                      {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format((category.plannedAmount || 0) - (category.actualAmount || 0))}
                    </span>
                  </div>
                </div>
                
                <div className="couple-management__budget-items">
                  <table className="couple-management__table">
                    <thead>
                      <tr>
                        <th>{t('budgetPlanner.itemName')}</th>
                        <th>{t('budgetPlanner.plannedAmount')}</th>
                        <th>{t('budgetPlanner.actualAmount')}</th>
                        <th>{t('budgetPlanner.paid')}</th>
                        <th>{t('common.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.items && category.items.length > 0 ? (
                        category.items.map(item => (
                          <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>
                              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(item.plannedAmount || 0)}
                            </td>
                            <td>
                              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(item.actualAmount || 0)}
                            </td>
                            <td>
                              <input type="checkbox" checked={item.paid} readOnly />
                            </td>
                            <td>
                              <div className="couple-management__table-actions">
                                <button className="couple-management__icon-button">
                                  ✏️
                                </button>
                                <button className="couple-management__icon-button">
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="couple-management__empty">
                            {t('budgetPlanner.noItems')}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  
                  <div className="couple-management__budget-item-actions">
                    <button className="couple-management__button couple-management__button--small">
                      {t('budgetPlanner.addItem')}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="couple-management__empty-state">
              <p>{t('budgetPlanner.noCategories')}</p>
              <button className="couple-management__button">
                {t('budgetPlanner.addCategory')}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderChecklistsTab = () => {
    return (
      <div className="couple-management__checklists">
        <h2>{t('checklists.title')}</h2>
        
        <div className="couple-management__actions">
          <button className="couple-management__button">
            {t('checklists.addCategory')}
          </button>
        </div>
        
        <div className="couple-management__checklist-categories">
          {checklistCategories.length > 0 ? (
            checklistCategories.map(category => (
              <div key={category.id} className="couple-management__checklist-category">
                <div className="couple-management__checklist-category-header">
                  <h3>{category.name}</h3>
                  <div className="couple-management__checklist-category-actions">
                    <button className="couple-management__icon-button">
                      ✏️
                    </button>
                    <button className="couple-management__icon-button">
                      🗑️
                    </button>
                  </div>
                </div>
                
                {category.description && (
                  <p className="couple-management__checklist-category-description">
                    {category.description}
                  </p>
                )}
                
                <div className="couple-management__checklists-list">
                  {category.checklists && category.checklists.length > 0 ? (
                    category.checklists.map(checklist => {
                      const totalItems = checklist.items ? checklist.items.length : 0;
                      const completedItems = checklist.items ? checklist.items.filter(item => item.completed).length : 0;
                      const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
                      
                      return (
                        <div key={checklist.id} className="couple-management__checklist">
                          <div className="couple-management__checklist-header">
                            <h4>{checklist.name}</h4>
                            <div className="couple-management__checklist-actions">
                              <button className="couple-management__icon-button">
                                ✏️
                              </button>
                              <button className="couple-management__icon-button">
                                🗑️
                              </button>
                            </div>
                          </div>
                          
                          {checklist.description && (
                            <p className="couple-management__checklist-description">
                              {checklist.description}
                            </p>
                          )}
                          
                          {checklist.dueDate && (
                            <div className="couple-management__checklist-due-date">
                              {t('checklists.dueDate')}: {new Date(checklist.dueDate).toLocaleDateString()}
                            </div>
                          )}
                          
                          <div className="couple-management__checklist-progress">
                            <div className="couple-management__progress-bar">
                              <div 
                                className="couple-management__progress-fill"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <span className="couple-management__progress-text">
                              {completedItems} / {totalItems} ({progress}%)
                            </span>
                          </div>
                          
                          <div className="couple-management__checklist-items">
                            {checklist.items && checklist.items.length > 0 ? (
                              checklist.items.map(item => (
                                <div key={item.id} className={`couple-management__checklist-item ${item.completed ? 'couple-management__checklist-item--completed' : ''}`}>
                                  <div className="couple-management__checklist-item-header">
                                    <div className="couple-management__checklist-item-checkbox">
                                      <input type="checkbox" checked={item.completed} readOnly />
                                      <span className="couple-management__checklist-item-text">
                                        {item.text}
                                      </span>
                                    </div>
                                    <div className="couple-management__checklist-item-priority">
                                      <span className={`couple-management__priority couple-management__priority--${item.priority}`}>
                                        {t(`checklists.${item.priority}`)}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {(item.assignedTo || item.notes) && (
                                    <div className="couple-management__checklist-item-details">
                                      {item.assignedTo && (
                                        <div className="couple-management__checklist-item-assigned">
                                          {t('checklists.assignedTo')}: {item.assignedTo}
                                        </div>
                                      )}
                                      {item.notes && (
                                        <div className="couple-management__checklist-item-notes">
                                          {item.notes}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="couple-management__empty">
                                {t('checklists.noItems')}
                              </div>
                            )}
                          </div>
                          
                          <div className="couple-management__checklist-actions">
                            <button className="couple-management__button couple-management__button--small">
                              {t('checklists.addItem')}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="couple-management__empty">
                      {t('checklists.noChecklists')}
                    </div>
                  )}
                  
                  <div className="couple-management__checklist-category-actions">
                    <button className="couple-management__button couple-management__button--small">
                      {t('checklists.addChecklist')}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="couple-management__empty-state">
              <p>{t('checklists.noCategories')}</p>
              <button className="couple-management__button">
                {t('checklists.addCategory')}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderWebsiteTab = () => {
    return (
      <div className="couple-management__website">
        <h2>{t('couple.weddingWebsite')}</h2>
        
        {wedding && wedding.websiteEnabled ? (
          <>
            <div className="couple-management__website-preview">
              <div className="couple-management__website-frame">
                <div className="couple-management__website-placeholder">
                  <h3>{t(`couple.${wedding.websiteTheme || 'classic'}`)}</h3>
                  <p>{t('couple.websitePreview')}</p>
                </div>
              </div>
            </div>
            
            <div className="couple-management__website-actions">
              <button className="couple-management__button">
                {t('couple.customizeWebsite')}
              </button>
              <button className="couple-management__button couple-management__button--secondary">
                {t('couple.previewWebsite')}
              </button>
              <button className="couple-management__button couple-management__button--secondary">
                {t('couple.publishWebsite')}
              </button>
            </div>
          </>
        ) : (
          <div className="couple-management__empty-state">
            <p>{t('couple.websiteNotEnabled')}</p>
            <button 
              className="couple-management__button"
              onClick={() => {
                setIsEditing(true);
                setFormData(prev => ({
                  ...prev,
                  websiteEnabled: true
                }));
                setActiveTab('details');
              }}
            >
              {t('couple.enableWebsite')}
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderMusicTab = () => {
    return (
      <div className="couple-management__music">
        <h2>{t('couple.musicVoting')}</h2>
        
        {wedding && wedding.musicVotingEnabled ? (
          <>
            <div className="couple-management__actions">
              <button className="couple-management__button">
                {t('couple.addSong')}
              </button>
            </div>
            
            <div className="couple-management__music-sections">
              <div className="couple-management__music-section">
                <h3>{t('couple.playlist')}</h3>
                <div className="couple-management__table-container">
                  <table className="couple-management__table">
                    <thead>
                      <tr>
                        <th>{t('couple.songTitle')}</th>
                        <th>{t('couple.artist')}</th>
                        <th>{t('couple.votes')}</th>
                        <th>{t('common.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={4} className="couple-management__empty">
                          {t('couple.noSongsInPlaylist')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="couple-management__music-section">
                <h3>{t('couple.suggestedSongs')}</h3>
                <div className="couple-management__table-container">
                  <table className="couple-management__table">
                    <thead>
                      <tr>
                        <th>{t('couple.songTitle')}</th>
                        <th>{t('couple.artist')}</th>
                        <th>{t('couple.votes')}</th>
                        <th>{t('common.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={4} className="couple-management__empty">
                          {t('couple.noSuggestions')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="couple-management__music-link">
              <h3>{t('couple.votingLink')}</h3>
              <div className="couple-management__copy-link">
                <input 
                  type="text" 
                  readOnly 
                  value={`https://lemonvows.com/music/${wedding.id}`} 
                />
                <button className="couple-management__button couple-management__button--small">
                  {t('common.copy')}
                </button>
              </div>
              <p>{t('couple.shareLinkDescription')}</p>
            </div>
          </>
        ) : (
          <div className="couple-management__empty-state">
            <p>{t('couple.musicVotingNotEnabled')}</p>
            <button 
              className="couple-management__button"
              onClick={() => {
                setIsEditing(true);
                setFormData(prev => ({
                  ...prev,
                  musicVotingEnabled: true
                }));
                setActiveTab('details');
              }}
            >
              {t('couple.enableMusicVoting')}
            </button>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="couple-management__loading">
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="couple-management__error">
        <p>{error}</p>
        <button 
          className="couple-management__button"
          onClick={() => window.location.reload()}
        >
          {t('common.retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="couple-management">
      <div className="couple-management__header">
        <h1>
          {couple ? `${couple.partner1FirstName} & ${couple.partner2FirstName}` : t('couple.title')}
        </h1>
        
        {wedding && (
          <div className="couple-management__wedding-date">
            {wedding.date ? new Date(wedding.date).toLocaleDateString() : t('couple.noDateSet')}
          </div>
        )}
      </div>
      
      <div className="couple-management__tabs">
        <button 
          className={`couple-management__tab ${activeTab === 'details' ? 'couple-management__tab--active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          {t('couple.weddingDetails')}
        </button>
        <button 
          className={`couple-management__tab ${activeTab === 'guests' ? 'couple-management__tab--active' : ''}`}
          onClick={() => setActiveTab('guests')}
        >
          {t('guestManagement.title')}
        </button>
        <button 
          className={`couple-management__tab ${activeTab === 'tables' ? 'couple-management__tab--active' : ''}`}
          onClick={() => setActiveTab('tables')}
        >
          {t('tablePlanner.title')}
        </button>
        <button 
          className={`couple-management__tab ${activeTab === 'budget' ? 'couple-management__tab--active' : ''}`}
          onClick={() => setActiveTab('budget')}
        >
          {t('budgetPlanner.title')}
        </button>
        <button 
          className={`couple-management__tab ${activeTab === 'checklists' ? 'couple-management__tab--active' : ''}`}
          onClick={() => setActiveTab('checklists')}
        >
          {t('checklists.title')}
        </button>
        <button 
          className={`couple-management__tab ${activeTab === 'website' ? 'couple-management__tab--active' : ''}`}
          onClick={() => setActiveTab('website')}
        >
          {t('couple.weddingWebsite')}
        </button>
        <button 
          className={`couple-management__tab ${activeTab === 'music' ? 'couple-management__tab--active' : ''}`}
          onClick={() => setActiveTab('music')}
        >
          {t('couple.musicVoting')}
        </button>
      </div>
      
      <div className="couple-management__content">
        {activeTab === 'details' && renderDetailsTab()}
        {activeTab === 'guests' && renderGuestsTab()}
        {activeTab === 'tables' && renderTablesTab()}
        {activeTab === 'budget' && renderBudgetTab()}
        {activeTab === 'checklists' && renderChecklistsTab()}
        {activeTab === 'website' && renderWebsiteTab()}
        {activeTab === 'music' && renderMusicTab()}
      </div>
      
      <style jsx>{`
        .couple-management {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          color: #333;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
        
        .couple-management__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        
        .couple-management__header h1 {
          margin: 0;
          font-size: 2rem;
          color: #ffbd00;
        }
        
        .couple-management__wedding-date {
          font-size: 1.2rem;
          font-weight: 500;
          color: #666;
        }
        
        .couple-management__tabs {
          display: flex;
          border-bottom: 1px solid #ddd;
          margin-bottom: 2rem;
          overflow-x: auto;
          white-space: nowrap;
        }
        
        .couple-management__tab {
          padding: 1rem 1.5rem;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .couple-management__tab:hover {
          color: #ffbd00;
        }
        
        .couple-management__tab--active {
          border-bottom-color: #ffbd00;
          color: #ffbd00;
        }
        
        .couple-management__content {
          min-height: 400px;
        }
        
        .couple-management__loading,
        .couple-management__error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }
        
        .couple-management__error {
          color: #dc3545;
        }
        
        .couple-management__button {
          padding: 0.5rem 1rem;
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
          color: #333;
        }
        
        .couple-management__button--secondary:hover {
          background-color: #e9ecef;
        }
        
        .couple-management__button--small {
          padding: 0.25rem 0.5rem;
          font-size: 0.9rem;
        }
        
        .couple-management__icon-button {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
          padding: 0.25rem;
          transition: transform 0.2s ease;
        }
        
        .couple-management__icon-button:hover {
          transform: scale(1.2);
        }
        
        .couple-management__actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .couple-management__stats {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .couple-management__stat {
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          flex: 1;
          min-width: 150px;
          text-align: center;
        }
        
        .couple-management__stat-value {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #ffbd00;
        }
        
        .couple-management__stat-value--negative {
          color: #dc3545;
        }
        
        .couple-management__stat-label {
          font-size: 0.9rem;
          color: #666;
        }
        
        .couple-management__table-container {
          overflow-x: auto;
        }
        
        .couple-management__table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .couple-management__table th,
        .couple-management__table td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        
        .couple-management__table th {
          font-weight: 500;
          color: #666;
        }
        
        .couple-management__table-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .couple-management__empty {
          text-align: center;
          padding: 2rem;
          color: #666;
        }
        
        .couple-management__empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          text-align: center;
        }
        
        .couple-management__empty-state p {
          margin-bottom: 1.5rem;
          color: #666;
        }
        
        .couple-management__status {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.9rem;
        }
        
        .couple-management__status--confirmed {
          background-color: #d1e7dd;
          color: #0f5132;
        }
        
        .couple-management__status--pending {
          background-color: #fff3cd;
          color: #664d03;
        }
        
        .couple-management__status--declined {
          background-color: #f8d7da;
          color: #842029;
        }
        
        .couple-management__form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .couple-management__form-section {
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .couple-management__form-section h3 {
          margin-top: 0;
          margin-bottom: 1.5rem;
          font-size: 1.2rem;
        }
        
        .couple-management__form-group {
          margin-bottom: 1rem;
        }
        
        .couple-management__form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .couple-management__form-group input[type="text"],
        .couple-management__form-group input[type="email"],
        .couple-management__form-group input[type="tel"],
        .couple-management__form-group input[type="date"],
        .couple-management__form-group input[type="number"],
        .couple-management__form-group select,
        .couple-management__form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: inherit;
          font-size: inherit;
        }
        
        .couple-management__form-group input[type="checkbox"] {
          margin-right: 0.5rem;
        }
        
        .couple-management__form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .couple-management__details-view {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .couple-management__details-section {
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .couple-management__details-section h3 {
          margin-top: 0;
          margin-bottom: 1.5rem;
          font-size: 1.2rem;
        }
        
        .couple-management__details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        
        .couple-management__details-grid strong {
          display: block;
          margin-bottom: 0.5rem;
          color: #666;
        }
        
        .couple-management__details-grid p {
          margin: 0;
          font-size: 1.1rem;
        }
        
        .couple-management__colors {
          display: flex;
          gap: 1.5rem;
        }
        
        .couple-management__color {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        
        .couple-management__color-swatch {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 1px solid #ddd;
        }
        
        .couple-management__website-actions,
        .couple-management__details-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .couple-management__budget-category,
        .couple-management__checklist-category {
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          margin-bottom: 1.5rem;
        }
        
        .couple-management__budget-category-header,
        .couple-management__checklist-category-header,
        .couple-management__checklist-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .couple-management__budget-category-header h3,
        .couple-management__checklist-category-header h3,
        .couple-management__checklist-header h4 {
          margin: 0;
        }
        
        .couple-management__budget-category-stats {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #eee;
        }
        
        .couple-management__budget-category-stats strong {
          display: block;
          margin-bottom: 0.25rem;
          color: #666;
          font-size: 0.9rem;
        }
        
        .couple-management__negative {
          color: #dc3545;
        }
        
        .couple-management__budget-items,
        .couple-management__checklist-items {
          margin-bottom: 1rem;
        }
        
        .couple-management__budget-item-actions,
        .couple-management__checklist-actions,
        .couple-management__checklist-category-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 1rem;
        }
        
        .couple-management__checklist-category-description,
        .couple-management__checklist-description {
          margin-top: 0;
          margin-bottom: 1rem;
          color: #666;
        }
        
        .couple-management__checklist {
          background-color: #f8f9fa;
          border-radius: 4px;
          padding: 1rem;
          margin-bottom: 1rem;
        }
        
        .couple-management__checklist-due-date {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.5rem;
        }
        
        .couple-management__checklist-progress {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .couple-management__progress-bar {
          flex: 1;
          height: 8px;
          background-color: #e9ecef;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .couple-management__progress-fill {
          height: 100%;
          background-color: #28a745;
        }
        
        .couple-management__progress-text {
          font-size: 0.9rem;
          color: #666;
          white-space: nowrap;
        }
        
        .couple-management__checklist-item {
          padding: 0.75rem;
          border-bottom: 1px solid #eee;
        }
        
        .couple-management__checklist-item:last-child {
          border-bottom: none;
        }
        
        .couple-management__checklist-item--completed .couple-management__checklist-item-text {
          text-decoration: line-through;
          color: #6c757d;
        }
        
        .couple-management__checklist-item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        
        .couple-management__checklist-item-checkbox {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
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
