import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  AdminUser,
  CoupleOverview,
  WeddingOverview,
  Package,
  Transaction,
  SystemSettings,
  DashboardStats,
  NoCodePage,
  NoCodeTemplate,
  NoCodeComponent,
  Notification,
  SupportTicket,
  ActivityLog
} from '../models/AdminTypes';
import {
  adminAuthService,
  adminCoupleService,
  adminWeddingService,
  packageService,
  transactionService,
  systemSettingsService,
  dashboardStatsService,
  noCodeService,
  notificationService,
  supportTicketService,
  activityLogService
} from '../services/AdminService';

const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'couples' | 'weddings' | 'packages' | 'transactions' | 'pages' | 'settings' | 'support'>('dashboard');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [couples, setCouples] = useState<CoupleOverview[]>([]);
  const [weddings, setWeddings] = useState<WeddingOverview[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pages, setPages] = useState<NoCodePage[]>([]);
  const [templates, setTemplates] = useState<NoCodeTemplate[]>([]);
  const [components, setComponents] = useState<NoCodeComponent[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
  const [modalTitle, setModalTitle] = useState<string>('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentAdmin = await adminAuthService.getCurrentAdmin();
        if (!currentAdmin) {
          // Redirect to login page
          window.location.href = '/admin/login';
          return;
        }
        setAdmin(currentAdmin);
      } catch (err) {
        console.error('Error checking auth:', err);
        // Redirect to login page
        window.location.href = '/admin/login';
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!admin) return;

    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load notifications
        const notificationsData = await notificationService.getAdminNotifications();
        setNotifications(notificationsData);

        // Load data based on active tab
        await loadTabData(activeTab);
      } catch (err: any) {
        console.error('Error loading initial data:', err);
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [admin]);

  const loadTabData = async (tab: string) => {
    try {
      setLoading(true);
      setError(null);

      switch (tab) {
        case 'dashboard':
          const stats = await dashboardStatsService.getDashboardStats();
          setDashboardStats(stats);
          const logs = await activityLogService.getActivityLogs(10);
          setActivityLogs(logs);
          break;
        case 'couples':
          const couplesData = await adminCoupleService.getAllCouples();
          setCouples(couplesData);
          break;
        case 'weddings':
          const weddingsData = await adminWeddingService.getAllWeddings();
          setWeddings(weddingsData);
          break;
        case 'packages':
          const packagesData = await packageService.getAllPackages();
          setPackages(packagesData);
          break;
        case 'transactions':
          const transactionsData = await transactionService.getAllTransactions();
          setTransactions(transactionsData);
          break;
        case 'pages':
          const pagesData = await noCodeService.getAllPages();
          setPages(pagesData);
          const templatesData = await noCodeService.getAllTemplates();
          setTemplates(templatesData);
          const componentsData = await noCodeService.getAllComponents();
          setComponents(componentsData);
          break;
        case 'settings':
          const settingsData = await systemSettingsService.getSystemSettings();
          setSystemSettings(settingsData);
          break;
        case 'support':
          const ticketsData = await supportTicketService.getAllSupportTickets();
          setSupportTickets(ticketsData);
          break;
      }
    } catch (err: any) {
      console.error(`Error loading ${tab} data:`, err);
      setError(err.message || `Failed to load ${tab} data`);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: 'dashboard' | 'couples' | 'weddings' | 'packages' | 'transactions' | 'pages' | 'settings' | 'support') => {
    setActiveTab(tab);
    loadTabData(tab);
  };

  const handleLogout = async () => {
    try {
      await adminAuthService.logout();
      window.location.href = '/admin/login';
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  const openModal = (title: string, content: React.ReactNode) => {
    setModalTitle(title);
    setModalContent(content);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent(null);
  };

  const renderDashboardTab = () => {
    if (!dashboardStats) {
      return (
        <div className="admin-dashboard__loading">
          <p>{t('admin.loadingStats')}</p>
        </div>
      );
    }

    return (
      <div className="admin-dashboard__dashboard">
        <h2>{t('admin.dashboardTitle')}</h2>
        
        <div className="admin-dashboard__stats">
          <div className="admin-dashboard__stat-card">
            <div className="admin-dashboard__stat-value">{dashboardStats.totalCouples}</div>
            <div className="admin-dashboard__stat-label">{t('admin.totalCouples')}</div>
          </div>
          <div className="admin-dashboard__stat-card">
            <div className="admin-dashboard__stat-value">{dashboardStats.activeCouples}</div>
            <div className="admin-dashboard__stat-label">{t('admin.activeCouples')}</div>
          </div>
          <div className="admin-dashboard__stat-card">
            <div className="admin-dashboard__stat-value">
              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(dashboardStats.totalRevenue)}
            </div>
            <div className="admin-dashboard__stat-label">{t('admin.totalRevenue')}</div>
          </div>
          <div className="admin-dashboard__stat-card">
            <div className="admin-dashboard__stat-value">
              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(dashboardStats.revenueThisMonth)}
            </div>
            <div className="admin-dashboard__stat-label">{t('admin.revenueThisMonth')}</div>
          </div>
          <div className="admin-dashboard__stat-card">
            <div className="admin-dashboard__stat-value">{Math.round(dashboardStats.averageWeddingSize)}</div>
            <div className="admin-dashboard__stat-label">{t('admin.averageWeddingSize')}</div>
          </div>
          <div className="admin-dashboard__stat-card">
            <div className="admin-dashboard__stat-value">{dashboardStats.upcomingWeddings}</div>
            <div className="admin-dashboard__stat-label">{t('admin.upcomingWeddings')}</div>
          </div>
        </div>
        
        <div className="admin-dashboard__charts">
          <div className="admin-dashboard__chart-card">
            <h3>{t('admin.popularFeatures')}</h3>
            <div className="admin-dashboard__feature-chart">
              {dashboardStats.popularFeatures.map((feature, index) => (
                <div key={index} className="admin-dashboard__feature-bar">
                  <div className="admin-dashboard__feature-name">{feature.feature}</div>
                  <div className="admin-dashboard__feature-bar-container">
                    <div 
                      className="admin-dashboard__feature-bar-fill"
                      style={{ width: `${(feature.usageCount / 100) * 100}%` }}
                    ></div>
                    <span className="admin-dashboard__feature-count">{feature.usageCount}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="admin-dashboard__chart-card">
            <h3>{t('admin.recentActivity')}</h3>
            <div className="admin-dashboard__activity-list">
              {activityLogs.length > 0 ? (
                activityLogs.map((log, index) => (
                  <div key={index} className="admin-dashboard__activity-item">
                    <div className="admin-dashboard__activity-icon">
                      {log.action.includes('create') ? '➕' : 
                       log.action.includes('update') ? '✏️' : 
                       log.action.includes('delete') ? '🗑️' : '👁️'}
                    </div>
                    <div className="admin-dashboard__activity-details">
                      <div className="admin-dashboard__activity-action">{log.action}</div>
                      <div className="admin-dashboard__activity-time">
                        {new Date(log.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="admin-dashboard__empty">{t('admin.noActivityLogs')}</div>
              )}
            </div>
          </div>
        </div>
        
        <div className="admin-dashboard__quick-actions">
          <h3>{t('admin.quickActions')}</h3>
          <div className="admin-dashboard__action-buttons">
            <button 
              className="admin-dashboard__button"
              onClick={() => handleTabChange('couples')}
            >
              {t('admin.manageCouples')}
            </button>
            <button 
              className="admin-dashboard__button"
              onClick={() => handleTabChange('packages')}
            >
              {t('admin.managePackages')}
            </button>
            <button 
              className="admin-dashboard__button"
              onClick={() => handleTabChange('pages')}
            >
              {t('admin.editWebsite')}
            </button>
            <button 
              className="admin-dashboard__button"
              onClick={() => handleTabChange('support')}
            >
              {t('admin.viewSupportTickets')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCouplesTab = () => {
    const handleCreateCouple = () => {
      // Open modal with couple creation form
      openModal(t('admin.createCouple'), (
        <div className="admin-dashboard__form">
          <div className="admin-dashboard__form-group">
            <label htmlFor="partner1FirstName">{t('admin.partner1FirstName')}</label>
            <input type="text" id="partner1FirstName" />
          </div>
          <div className="admin-dashboard__form-group">
            <label htmlFor="partner1LastName">{t('admin.partner1LastName')}</label>
            <input type="text" id="partner1LastName" />
          </div>
          <div className="admin-dashboard__form-group">
            <label htmlFor="partner2FirstName">{t('admin.partner2FirstName')}</label>
            <input type="text" id="partner2FirstName" />
          </div>
          <div className="admin-dashboard__form-group">
            <label htmlFor="partner2LastName">{t('admin.partner2LastName')}</label>
            <input type="text" id="partner2LastName" />
          </div>
          <div className="admin-dashboard__form-group">
            <label htmlFor="email">{t('admin.email')}</label>
            <input type="email" id="email" />
          </div>
          <div className="admin-dashboard__form-group">
            <label htmlFor="password">{t('admin.password')}</label>
            <input type="password" id="password" />
          </div>
          <div className="admin-dashboard__form-group">
            <label htmlFor="packageType">{t('admin.packageType')}</label>
            <select id="packageType">
              <option value="basic">{t('admin.basic')}</option>
              <option value="premium">{t('admin.premium')}</option>
              <option value="deluxe">{t('admin.deluxe')}</option>
            </select>
          </div>
          <div className="admin-dashboard__form-group">
            <label htmlFor="createWedding">
              <input type="checkbox" id="createWedding" />
              {t('admin.createWeddingInstance')}
            </label>
          </div>
          <div className="admin-dashboard__form-actions">
            <button 
              className="admin-dashboard__button admin-dashboard__button--secondary"
              onClick={closeModal}
            >
              {t('admin.cancel')}
            </button>
            <button 
              className="admin-dashboard__button"
              onClick={() => {
                // Handle form submission
                closeModal();
              }}
            >
              {t('admin.create')}
            </button>
          </div>
        </div>
      ));
    };

    return (
      <div className="admin-dashboard__couples">
        <div className="admin-dashboard__header">
          <h2>{t('admin.couplesTitle')}</h2>
          <button 
            className="admin-dashboard__button"
            onClick={handleCreateCouple}
          >
            {t('admin.createCouple')}
          </button>
        </div>
        
        <div className="admin-dashboard__filters">
          <div className="admin-dashboard__search">
            <input 
              type="text" 
              placeholder={t('admin.searchCouples')} 
              className="admin-dashboard__search-input"
            />
          </div>
          <div className="admin-dashboard__filter">
            <select className="admin-dashboard__filter-select">
              <option value="all">{t('admin.allStatus')}</option>
              <option value="active">{t('admin.activeStatus')}</option>
              <option value="inactive">{t('admin.inactiveStatus')}</option>
              <option value="suspended">{t('admin.suspendedStatus')}</option>
            </select>
          </div>
        </div>
        
        <div className="admin-dashboard__table-container">
          <table className="admin-dashboard__table">
            <thead>
              <tr>
                <th>{t('admin.couple')}</th>
                <th>{t('admin.email')}</th>
                <th>{t('admin.packageType')}</th>
                <th>{t('admin.weddingDate')}</th>
                <th>{t('admin.status')}</th>
                <th>{t('admin.createdAt')}</th>
                <th>{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {couples.length > 0 ? (
                couples.map((couple, index) => (
                  <tr key={index}>
                    <td>{couple.partner1Name} & {couple.partner2Name}</td>
                    <td>{couple.email}</td>
                    <td>
                      <span className={`admin-dashboard__package admin-dashboard__package--${couple.packageType}`}>
                        {t(`admin.${couple.packageType}`)}
                      </span>
                    </td>
                    <td>{couple.weddingDate ? new Date(couple.weddingDate).toLocaleDateString() : '-'}</td>
                    <td>
                      <span className={`admin-dashboard__status admin-dashboard__status--${couple.status}`}>
                        {t(`admin.${couple.status}Status`)}
                      </span>
                    </td>
                    <td>{new Date(couple.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="admin-dashboard__actions">
                        <button className="admin-dashboard__icon-button" title={t('admin.view')}>
                          👁️
                        </button>
                        <button className="admin-dashboard__icon-button" title={t('admin.edit')}>
                          ✏️
                        </button>
                        <button className="admin-dashboard__icon-button" title={t('admin.delete')}>
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="admin-dashboard__empty">
                    {t('admin.noCouples')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderWeddingsTab = () => {
    return (
      <div className="admin-dashboard__weddings">
        <div className="admin-dashboard__header">
          <h2>{t('admin.weddingsTitle')}</h2>
        </div>
        
        <div className="admin-dashboard__filters">
          <div className="admin-dashboard__search">
            <input 
              type="text" 
              placeholder={t('admin.searchWeddings')} 
              className="admin-dashboard__search-input"
            />
          </div>
          <div className="admin-dashboard__filter">
            <select className="admin-dashboard__filter-select">
              <option value="all">{t('admin.allDates')}</option>
              <option value="upcoming">{t('admin.upcomingWeddings')}</option>
              <option value="past">{t('admin.pastWeddings')}</option>
              <option value="noDate">{t('admin.noDateSet')}</option>
            </select>
          </div>
        </div>
        
        <div className="admin-dashboard__table-container">
          <table className="admin-dashboard__table">
            <thead>
              <tr>
                <th>{t('admin.couple')}</th>
                <th>{t('admin.weddingDate')}</th>
                <th>{t('admin.location')}</th>
                <th>{t('admin.guestCount')}</th>
                <th>{t('admin.website')}</th>
                <th>{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {weddings.length > 0 ? (
                weddings.map((wedding, index) => (
                  <tr key={index}>
                    <td>Couple Name</td>
                    <td>{wedding.date ? new Date(wedding.date).toLocaleDateString() : '-'}</td>
                    <td>{wedding.location || '-'}</td>
                    <td>{wedding.guestCount || '-'}</td>
                    <td>
                      {wedding.websiteEnabled ? (
                        <a 
                          href={wedding.websiteUrl || '#'} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="admin-dashboard__link"
                        >
                          {t('admin.viewWebsite')}
                        </a>
                      ) : (
                        <span className="admin-dashboard__disabled">{t('admin.disabled')}</span>
                      )}
                    </td>
                    <td>
                      <div className="admin-dashboard__actions">
                        <button className="admin-dashboard__icon-button" title={t('admin.view')}>
                          👁️
                        </button>
                        <button className="admin-dashboard__icon-button" title={t('admin.edit')}>
                          ✏️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="admin-dashboard__empty">
                    {t('admin.noWeddings')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderPackagesTab = () => {
    const handleCreatePackage = () => {
      // Open modal with package creation form
      openModal(t('admin.createPackage'), (
        <div className="admin-dashboard__form">
          <div className="admin-dashboard__form-group">
            <label htmlFor="name">{t('admin.packageName')}</label>
            <input type="text" id="name" />
          </div>
          <div className="admin-dashboard__form-group">
            <label htmlFor="description">{t('admin.packageDescription')}</label>
            <textarea id="description" rows={4}></textarea>
          </div>
          <div className="admin-dashboard__form-group">
            <label htmlFor="price">{t('admin.price')}</label>
            <input type="number" id="price" min="0" step="0.01" />
          </div>
          <div className="admin-dashboard__form-group">
            <label htmlFor="currency">{t('admin.currency')}</label>
            <select id="currency">
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          <div className="admin-dashboard__form-group">
            <label htmlFor="billingCycle">{t('admin.billingCycle')}</label>
            <select id="billingCycle">
              <option value="one-time">{t('admin.oneTime')}</option>
              <option value="monthly">{t('admin.monthly')}</option>
              <option value="yearly">{t('admin.yearly')}</option>
            </select>
          </div>
          <div className="admin-dashboard__form-group">
            <label>{t('admin.features')}</label>
            <div className="admin-dashboard__features-list">
              <div className="admin-dashboard__feature-item">
                <input type="checkbox" id="feature1" />
                <label htmlFor="feature1">{t('admin.featureTablePlanner')}</label>
              </div>
              <div className="admin-dashboard__feature-item">
                <input type="checkbox" id="feature2" />
                <label htmlFor="feature2">{t('admin.featureGuestManagement')}</label>
              </div>
              <div className="admin-dashboard__feature-item">
                <input type="checkbox" id="feature3" />
                <label htmlFor="feature3">{t('admin.featureBudgetPlanner')}</label>
              </div>
              <div className="admin-dashboard__feature-item">
                <input type="checkbox" id="feature4" />
                <label htmlFor="feature4">{t('admin.featureChecklists')}</label>
              </div>
              <div className="admin-dashboard__feature-item">
                <input type="checkbox" id="feature5" />
                <label htmlFor="feature5">{t('admin.featureWebsite')}</label>
              </div>
              <div className="admin-dashboard__feature-item">
                <input type="checkbox" id="feature6" />
                <label htmlFor="feature6">{t('admin.featureMusicVoting')}</label>
              </div>
            </div>
          </div>
          <div className="admin-dashboard__form-group">
            <label htmlFor="isActive">
              <input type="checkbox" id="isActive" defaultChecked />
              {t('admin.isActive')}
            </label>
          </div>
          <div className="admin-dashboard__form-actions">
            <button 
              className="admin-dashboard__button admin-dashboard__button--secondary"
              onClick={closeModal}
            >
              {t('admin.cancel')}
            </button>
            <button 
              className="admin-dashboard__button"
              onClick={() => {
                // Handle form submission
                closeModal();
              }}
            >
              {t('admin.create')}
            </button>
          </div>
        </div>
      ));
    };

    return (
      <div className="admin-dashboard__packages">
        <div className="admin-dashboard__header">
          <h2>{t('admin.packagesTitle')}</h2>
          <button 
            className="admin-dashboard__button"
            onClick={handleCreatePackage}
          >
            {t('admin.createPackage')}
          </button>
        </div>
        
        <div className="admin-dashboard__packages-grid">
          {packages.length > 0 ? (
            packages.map((pkg, index) => (
              <div key={index} className={`admin-dashboard__package-card ${!pkg.isActive ? 'admin-dashboard__package-card--inactive' : ''}`}>
                <div className="admin-dashboard__package-header">
                  <h3>{pkg.name}</h3>
                  <div className="admin-dashboard__package-price">
                    {new Intl.NumberFormat('de-DE', { style: 'currency', currency: pkg.currency }).format(pkg.price)}
                    {pkg.billingCycle !== 'one-time' && (
                      <span className="admin-dashboard__package-billing">
                        /{t(`admin.${pkg.billingCycle}`)}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="admin-dashboard__package-description">
                  {pkg.description}
                </div>
                
                <div className="admin-dashboard__package-features">
                  <h4>{t('admin.features')}</h4>
                  <ul>
                    {pkg.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="admin-dashboard__package-status">
                  <span className={`admin-dashboard__status ${pkg.isActive ? 'admin-dashboard__status--active' : 'admin-dashboard__status--inactive'}`}>
                    {pkg.isActive ? t('admin.activeStatus') : t('admin.inactiveStatus')}
                  </span>
                </div>
                
                <div className="admin-dashboard__package-actions">
                  <button className="admin-dashboard__button admin-dashboard__button--small">
                    {t('admin.edit')}
                  </button>
                  <button className="admin-dashboard__button admin-dashboard__button--small admin-dashboard__button--secondary">
                    {pkg.isActive ? t('admin.deactivate') : t('admin.activate')}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="admin-dashboard__empty-state">
              <p>{t('admin.noPackages')}</p>
              <button 
                className="admin-dashboard__button"
                onClick={handleCreatePackage}
              >
                {t('admin.createPackage')}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTransactionsTab = () => {
    return (
      <div className="admin-dashboard__transactions">
        <div className="admin-dashboard__header">
          <h2>{t('admin.transactionsTitle')}</h2>
        </div>
        
        <div className="admin-dashboard__filters">
          <div className="admin-dashboard__search">
            <input 
              type="text" 
              placeholder={t('admin.searchTransactions')} 
              className="admin-dashboard__search-input"
            />
          </div>
          <div className="admin-dashboard__filter">
            <select className="admin-dashboard__filter-select">
              <option value="all">{t('admin.allStatus')}</option>
              <option value="completed">{t('admin.completedStatus')}</option>
              <option value="pending">{t('admin.pendingStatus')}</option>
              <option value="failed">{t('admin.failedStatus')}</option>
              <option value="refunded">{t('admin.refundedStatus')}</option>
            </select>
          </div>
        </div>
        
        <div className="admin-dashboard__table-container">
          <table className="admin-dashboard__table">
            <thead>
              <tr>
                <th>{t('admin.transactionId')}</th>
                <th>{t('admin.couple')}</th>
                <th>{t('admin.package')}</th>
                <th>{t('admin.amount')}</th>
                <th>{t('admin.paymentMethod')}</th>
                <th>{t('admin.status')}</th>
                <th>{t('admin.date')}</th>
                <th>{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <tr key={index}>
                    <td>{transaction.id.substring(0, 8)}...</td>
                    <td>Couple Name</td>
                    <td>Package Name</td>
                    <td>
                      {new Intl.NumberFormat('de-DE', { style: 'currency', currency: transaction.currency }).format(transaction.amount)}
                    </td>
                    <td>{transaction.paymentMethod}</td>
                    <td>
                      <span className={`admin-dashboard__status admin-dashboard__status--${transaction.status}`}>
                        {t(`admin.${transaction.status}Status`)}
                      </span>
                    </td>
                    <td>{new Date(transaction.transactionDate).toLocaleDateString()}</td>
                    <td>
                      <div className="admin-dashboard__actions">
                        <button className="admin-dashboard__icon-button" title={t('admin.view')}>
                          👁️
                        </button>
                        {transaction.status === 'pending' && (
                          <>
                            <button className="admin-dashboard__icon-button" title={t('admin.approve')}>
                              ✅
                            </button>
                            <button className="admin-dashboard__icon-button" title={t('admin.reject')}>
                              ❌
                            </button>
                          </>
                        )}
                        {transaction.status === 'completed' && (
                          <button className="admin-dashboard__icon-button" title={t('admin.refund')}>
                            💰
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="admin-dashboard__empty">
                    {t('admin.noTransactions')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderPagesTab = () => {
    const handleCreatePage = () => {
      // Open modal with page creation form
      openModal(t('admin.createPage'), (
        <div className="admin-dashboard__form">
          <div className="admin-dashboard__form-group">
            <label htmlFor="title">{t('admin.pageTitle')}</label>
            <input type="text" id="title" />
          </div>
          <div className="admin-dashboard__form-group">
            <label htmlFor="slug">{t('admin.pageSlug')}</label>
            <input type="text" id="slug" />
          </div>
          <div className="admin-dashboard__form-group">
            <label htmlFor="description">{t('admin.pageDescription')}</label>
            <textarea id="description" rows={3}></textarea>
          </div>
          <div className="admin-dashboard__form-group">
            <label htmlFor="template">{t('admin.template')}</label>
            <select id="template">
              <option value="">{t('admin.selectTemplate')}</option>
              {templates.map((template, index) => (
                <option key={index} value={template.id}>{template.name}</option>
              ))}
            </select>
          </div>
          <div className="admin-dashboard__form-actions">
            <button 
              className="admin-dashboard__button admin-dashboard__button--secondary"
              onClick={closeModal}
            >
              {t('admin.cancel')}
            </button>
            <button 
              className="admin-dashboard__button"
              onClick={() => {
                // Handle form submission
                closeModal();
              }}
            >
              {t('admin.create')}
            </button>
          </div>
        </div>
      ));
    };

    return (
      <div className="admin-dashboard__pages">
        <div className="admin-dashboard__header">
          <h2>{t('admin.pagesTitle')}</h2>
          <div className="admin-dashboard__header-actions">
            <button 
              className="admin-dashboard__button"
              onClick={handleCreatePage}
            >
              {t('admin.createPage')}
            </button>
          </div>
        </div>
        
        <div className="admin-dashboard__tabs">
          <button className="admin-dashboard__tab admin-dashboard__tab--active">
            {t('admin.pages')}
          </button>
          <button className="admin-dashboard__tab">
            {t('admin.templates')}
          </button>
          <button className="admin-dashboard__tab">
            {t('admin.components')}
          </button>
        </div>
        
        <div className="admin-dashboard__filters">
          <div className="admin-dashboard__search">
            <input 
              type="text" 
              placeholder={t('admin.searchPages')} 
              className="admin-dashboard__search-input"
            />
          </div>
          <div className="admin-dashboard__filter">
            <select className="admin-dashboard__filter-select">
              <option value="all">{t('admin.allStatus')}</option>
              <option value="published">{t('admin.publishedStatus')}</option>
              <option value="draft">{t('admin.draftStatus')}</option>
            </select>
          </div>
        </div>
        
        <div className="admin-dashboard__pages-grid">
          {pages.length > 0 ? (
            pages.map((page, index) => (
              <div key={index} className="admin-dashboard__page-card">
                <div className="admin-dashboard__page-header">
                  <h3>{page.title}</h3>
                  <span className={`admin-dashboard__status ${page.isPublished ? 'admin-dashboard__status--active' : 'admin-dashboard__status--inactive'}`}>
                    {page.isPublished ? t('admin.publishedStatus') : t('admin.draftStatus')}
                  </span>
                </div>
                
                <div className="admin-dashboard__page-url">
                  /{page.slug}
                </div>
                
                <div className="admin-dashboard__page-description">
                  {page.description}
                </div>
                
                <div className="admin-dashboard__page-meta">
                  <div className="admin-dashboard__page-date">
                    {t('admin.updated')}: {new Date(page.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="admin-dashboard__page-elements">
                    {page.elements.length} {t('admin.elements')}
                  </div>
                </div>
                
                <div className="admin-dashboard__page-actions">
                  <button className="admin-dashboard__button admin-dashboard__button--small">
                    {t('admin.edit')}
                  </button>
                  <button className="admin-dashboard__button admin-dashboard__button--small admin-dashboard__button--secondary">
                    {page.isPublished ? t('admin.unpublish') : t('admin.publish')}
                  </button>
                  <button className="admin-dashboard__button admin-dashboard__button--small admin-dashboard__button--secondary">
                    {t('admin.preview')}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="admin-dashboard__empty-state">
              <p>{t('admin.noPages')}</p>
              <button 
                className="admin-dashboard__button"
                onClick={handleCreatePage}
              >
                {t('admin.createPage')}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSettingsTab = () => {
    if (!systemSettings) {
      return (
        <div className="admin-dashboard__loading">
          <p>{t('admin.loadingSettings')}</p>
        </div>
      );
    }

    return (
      <div className="admin-dashboard__settings">
        <div className="admin-dashboard__header">
          <h2>{t('admin.settingsTitle')}</h2>
        </div>
        
        <div className="admin-dashboard__settings-form">
          <div className="admin-dashboard__settings-section">
            <h3>{t('admin.generalSettings')}</h3>
            
            <div className="admin-dashboard__form-group">
              <label htmlFor="siteName">{t('admin.siteName')}</label>
              <input 
                type="text" 
                id="siteName" 
                defaultValue={systemSettings.siteName} 
              />
            </div>
            
            <div className="admin-dashboard__form-group">
              <label htmlFor="siteDescription">{t('admin.siteDescription')}</label>
              <textarea 
                id="siteDescription" 
                rows={3} 
                defaultValue={systemSettings.siteDescription}
              ></textarea>
            </div>
            
            <div className="admin-dashboard__form-group">
              <label htmlFor="contactEmail">{t('admin.contactEmail')}</label>
              <input 
                type="email" 
                id="contactEmail" 
                defaultValue={systemSettings.contactEmail} 
              />
            </div>
            
            <div className="admin-dashboard__form-group">
              <label htmlFor="supportEmail">{t('admin.supportEmail')}</label>
              <input 
                type="email" 
                id="supportEmail" 
                defaultValue={systemSettings.supportEmail} 
              />
            </div>
          </div>
          
          <div className="admin-dashboard__settings-section">
            <h3>{t('admin.languageSettings')}</h3>
            
            <div className="admin-dashboard__form-group">
              <label htmlFor="defaultLanguage">{t('admin.defaultLanguage')}</label>
              <select 
                id="defaultLanguage" 
                defaultValue={systemSettings.defaultLanguage}
              >
                <option value="de">{t('settings.german')}</option>
                <option value="en">{t('settings.english')}</option>
              </select>
            </div>
            
            <div className="admin-dashboard__form-group">
              <label>{t('admin.availableLanguages')}</label>
              <div className="admin-dashboard__checkbox-group">
                <div className="admin-dashboard__checkbox-item">
                  <input 
                    type="checkbox" 
                    id="lang-de" 
                    defaultChecked={systemSettings.availableLanguages.includes('de')} 
                  />
                  <label htmlFor="lang-de">{t('settings.german')}</label>
                </div>
                <div className="admin-dashboard__checkbox-item">
                  <input 
                    type="checkbox" 
                    id="lang-en" 
                    defaultChecked={systemSettings.availableLanguages.includes('en')} 
                  />
                  <label htmlFor="lang-en">{t('settings.english')}</label>
                </div>
                <div className="admin-dashboard__checkbox-item">
                  <input 
                    type="checkbox" 
                    id="lang-fr" 
                    defaultChecked={systemSettings.availableLanguages.includes('fr')} 
                  />
                  <label htmlFor="lang-fr">{t('settings.french')}</label>
                </div>
                <div className="admin-dashboard__checkbox-item">
                  <input 
                    type="checkbox" 
                    id="lang-es" 
                    defaultChecked={systemSettings.availableLanguages.includes('es')} 
                  />
                  <label htmlFor="lang-es">{t('settings.spanish')}</label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="admin-dashboard__settings-section">
            <h3>{t('admin.appearanceSettings')}</h3>
            
            <div className="admin-dashboard__form-group">
              <label htmlFor="logo">{t('admin.logo')}</label>
              <div className="admin-dashboard__file-upload">
                <input type="file" id="logo" />
                {systemSettings.logoUrl && (
                  <div className="admin-dashboard__current-file">
                    {t('admin.currentLogo')}: {systemSettings.logoUrl.split('/').pop()}
                  </div>
                )}
              </div>
            </div>
            
            <div className="admin-dashboard__form-group">
              <label htmlFor="favicon">{t('admin.favicon')}</label>
              <div className="admin-dashboard__file-upload">
                <input type="file" id="favicon" />
                {systemSettings.faviconUrl && (
                  <div className="admin-dashboard__current-file">
                    {t('admin.currentFavicon')}: {systemSettings.faviconUrl.split('/').pop()}
                  </div>
                )}
              </div>
            </div>
            
            <div className="admin-dashboard__form-group">
              <label htmlFor="primaryColor">{t('admin.primaryColor')}</label>
              <div className="admin-dashboard__color-picker">
                <input 
                  type="color" 
                  id="primaryColor" 
                  defaultValue={systemSettings.primaryColor} 
                />
                <input 
                  type="text" 
                  defaultValue={systemSettings.primaryColor} 
                  className="admin-dashboard__color-value"
                />
              </div>
            </div>
            
            <div className="admin-dashboard__form-group">
              <label htmlFor="secondaryColor">{t('admin.secondaryColor')}</label>
              <div className="admin-dashboard__color-picker">
                <input 
                  type="color" 
                  id="secondaryColor" 
                  defaultValue={systemSettings.secondaryColor} 
                />
                <input 
                  type="text" 
                  defaultValue={systemSettings.secondaryColor} 
                  className="admin-dashboard__color-value"
                />
              </div>
            </div>
            
            <div className="admin-dashboard__form-group">
              <label htmlFor="accentColor">{t('admin.accentColor')}</label>
              <div className="admin-dashboard__color-picker">
                <input 
                  type="color" 
                  id="accentColor" 
                  defaultValue={systemSettings.accentColor} 
                />
                <input 
                  type="text" 
                  defaultValue={systemSettings.accentColor} 
                  className="admin-dashboard__color-value"
                />
              </div>
            </div>
          </div>
          
          <div className="admin-dashboard__form-actions">
            <button className="admin-dashboard__button">
              {t('admin.saveSettings')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderSupportTab = () => {
    return (
      <div className="admin-dashboard__support">
        <div className="admin-dashboard__header">
          <h2>{t('admin.supportTitle')}</h2>
        </div>
        
        <div className="admin-dashboard__filters">
          <div className="admin-dashboard__search">
            <input 
              type="text" 
              placeholder={t('admin.searchTickets')} 
              className="admin-dashboard__search-input"
            />
          </div>
          <div className="admin-dashboard__filter">
            <select className="admin-dashboard__filter-select">
              <option value="all">{t('admin.allStatus')}</option>
              <option value="open">{t('admin.openStatus')}</option>
              <option value="in-progress">{t('admin.inProgressStatus')}</option>
              <option value="resolved">{t('admin.resolvedStatus')}</option>
              <option value="closed">{t('admin.closedStatus')}</option>
            </select>
          </div>
          <div className="admin-dashboard__filter">
            <select className="admin-dashboard__filter-select">
              <option value="all">{t('admin.allPriorities')}</option>
              <option value="low">{t('admin.lowPriority')}</option>
              <option value="medium">{t('admin.mediumPriority')}</option>
              <option value="high">{t('admin.highPriority')}</option>
              <option value="urgent">{t('admin.urgentPriority')}</option>
            </select>
          </div>
        </div>
        
        <div className="admin-dashboard__table-container">
          <table className="admin-dashboard__table">
            <thead>
              <tr>
                <th>{t('admin.ticketId')}</th>
                <th>{t('admin.subject')}</th>
                <th>{t('admin.submittedBy')}</th>
                <th>{t('admin.status')}</th>
                <th>{t('admin.priority')}</th>
                <th>{t('admin.lastUpdated')}</th>
                <th>{t('admin.assignedTo')}</th>
                <th>{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {supportTickets.length > 0 ? (
                supportTickets.map((ticket, index) => (
                  <tr key={index}>
                    <td>{ticket.id.substring(0, 8)}...</td>
                    <td>{ticket.subject}</td>
                    <td>User Name</td>
                    <td>
                      <span className={`admin-dashboard__status admin-dashboard__status--${ticket.status}`}>
                        {t(`admin.${ticket.status}Status`)}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-dashboard__priority admin-dashboard__priority--${ticket.priority}`}>
                        {t(`admin.${ticket.priority}Priority`)}
                      </span>
                    </td>
                    <td>{new Date(ticket.updatedAt).toLocaleDateString()}</td>
                    <td>{ticket.assignedTo ? 'Admin Name' : '-'}</td>
                    <td>
                      <div className="admin-dashboard__actions">
                        <button className="admin-dashboard__icon-button" title={t('admin.view')}>
                          👁️
                        </button>
                        <button className="admin-dashboard__icon-button" title={t('admin.assign')}>
                          👤
                        </button>
                        <button className="admin-dashboard__icon-button" title={t('admin.updateStatus')}>
                          📝
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="admin-dashboard__empty">
                    {t('admin.noTickets')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (loading && !admin) {
    return (
      <div className="admin-dashboard__loading">
        <p>{t('admin.loading')}</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__sidebar">
        <div className="admin-dashboard__logo">
          <h1>LemonVows</h1>
        </div>
        
        <nav className="admin-dashboard__nav">
          <button 
            className={`admin-dashboard__nav-item ${activeTab === 'dashboard' ? 'admin-dashboard__nav-item--active' : ''}`}
            onClick={() => handleTabChange('dashboard')}
          >
            <span className="admin-dashboard__nav-icon">📊</span>
            <span className="admin-dashboard__nav-text">{t('admin.dashboard')}</span>
          </button>
          <button 
            className={`admin-dashboard__nav-item ${activeTab === 'couples' ? 'admin-dashboard__nav-item--active' : ''}`}
            onClick={() => handleTabChange('couples')}
          >
            <span className="admin-dashboard__nav-icon">👩‍❤️‍👨</span>
            <span className="admin-dashboard__nav-text">{t('admin.couples')}</span>
          </button>
          <button 
            className={`admin-dashboard__nav-item ${activeTab === 'weddings' ? 'admin-dashboard__nav-item--active' : ''}`}
            onClick={() => handleTabChange('weddings')}
          >
            <span className="admin-dashboard__nav-icon">💍</span>
            <span className="admin-dashboard__nav-text">{t('admin.weddings')}</span>
          </button>
          <button 
            className={`admin-dashboard__nav-item ${activeTab === 'packages' ? 'admin-dashboard__nav-item--active' : ''}`}
            onClick={() => handleTabChange('packages')}
          >
            <span className="admin-dashboard__nav-icon">📦</span>
            <span className="admin-dashboard__nav-text">{t('admin.packages')}</span>
          </button>
          <button 
            className={`admin-dashboard__nav-item ${activeTab === 'transactions' ? 'admin-dashboard__nav-item--active' : ''}`}
            onClick={() => handleTabChange('transactions')}
          >
            <span className="admin-dashboard__nav-icon">💰</span>
            <span className="admin-dashboard__nav-text">{t('admin.transactions')}</span>
          </button>
          <button 
            className={`admin-dashboard__nav-item ${activeTab === 'pages' ? 'admin-dashboard__nav-item--active' : ''}`}
            onClick={() => handleTabChange('pages')}
          >
            <span className="admin-dashboard__nav-icon">🖥️</span>
            <span className="admin-dashboard__nav-text">{t('admin.pages')}</span>
          </button>
          <button 
            className={`admin-dashboard__nav-item ${activeTab === 'settings' ? 'admin-dashboard__nav-item--active' : ''}`}
            onClick={() => handleTabChange('settings')}
          >
            <span className="admin-dashboard__nav-icon">⚙️</span>
            <span className="admin-dashboard__nav-text">{t('admin.settings')}</span>
          </button>
          <button 
            className={`admin-dashboard__nav-item ${activeTab === 'support' ? 'admin-dashboard__nav-item--active' : ''}`}
            onClick={() => handleTabChange('support')}
          >
            <span className="admin-dashboard__nav-icon">🎫</span>
            <span className="admin-dashboard__nav-text">{t('admin.support')}</span>
          </button>
        </nav>
        
        <div className="admin-dashboard__sidebar-footer">
          <button 
            className="admin-dashboard__logout"
            onClick={handleLogout}
          >
            <span className="admin-dashboard__nav-icon">🚪</span>
            <span className="admin-dashboard__nav-text">{t('admin.logout')}</span>
          </button>
        </div>
      </div>
      
      <div className="admin-dashboard__main">
        <header className="admin-dashboard__topbar">
          <div className="admin-dashboard__search-bar">
            <input 
              type="text" 
              placeholder={t('admin.search')} 
              className="admin-dashboard__search-input"
            />
          </div>
          
          <div className="admin-dashboard__topbar-actions">
            <div className="admin-dashboard__notifications">
              <button className="admin-dashboard__notification-button">
                🔔
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <span className="admin-dashboard__notification-badge">
                    {notifications.filter(n => !n.isRead).length}
                  </span>
                )}
              </button>
            </div>
            
            <div className="admin-dashboard__user">
              <span className="admin-dashboard__user-name">
                {admin?.firstName} {admin?.lastName}
              </span>
              <span className="admin-dashboard__user-role">
                {t(`admin.${admin?.role}Role`)}
              </span>
            </div>
          </div>
        </header>
        
        <main className="admin-dashboard__content">
          {error && (
            <div className="admin-dashboard__error">
              <p>{error}</p>
              <button 
                className="admin-dashboard__button"
                onClick={() => loadTabData(activeTab)}
              >
                {t('admin.retry')}
              </button>
            </div>
          )}
          
          {!error && (
            <>
              {activeTab === 'dashboard' && renderDashboardTab()}
              {activeTab === 'couples' && renderCouplesTab()}
              {activeTab === 'weddings' && renderWeddingsTab()}
              {activeTab === 'packages' && renderPackagesTab()}
              {activeTab === 'transactions' && renderTransactionsTab()}
              {activeTab === 'pages' && renderPagesTab()}
              {activeTab === 'settings' && renderSettingsTab()}
              {activeTab === 'support' && renderSupportTab()}
            </>
          )}
        </main>
      </div>
      
      {showModal && (
        <div className="admin-dashboard__modal-overlay">
          <div className="admin-dashboard__modal">
            <div className="admin-dashboard__modal-header">
              <h3>{modalTitle}</h3>
              <button 
                className="admin-dashboard__modal-close"
                onClick={closeModal}
              >
                ×
              </button>
            </div>
            <div className="admin-dashboard__modal-content">
              {modalContent}
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .admin-dashboard {
          display: flex;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          color: #333;
        }
        
        .admin-dashboard__sidebar {
          width: 250px;
          background-color: #1e293b;
          color: white;
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
        }
        
        .admin-dashboard__logo {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .admin-dashboard__logo h1 {
          margin: 0;
          font-size: 1.5rem;
          color: #ffbd00;
        }
        
        .admin-dashboard__nav {
          flex: 1;
          padding: 1rem 0;
          overflow-y: auto;
        }
        
        .admin-dashboard__nav-item {
          display: flex;
          align-items: center;
          padding: 0.75rem 1.5rem;
          width: 100%;
          border: none;
          background: none;
          color: rgba(255, 255, 255, 0.7);
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .admin-dashboard__nav-item:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: white;
        }
        
        .admin-dashboard__nav-item--active {
          background-color: rgba(255, 189, 0, 0.2);
          color: #ffbd00;
          border-left: 3px solid #ffbd00;
        }
        
        .admin-dashboard__nav-icon {
          margin-right: 0.75rem;
          font-size: 1.25rem;
        }
        
        .admin-dashboard__sidebar-footer {
          padding: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .admin-dashboard__logout {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 0.75rem;
          border: none;
          border-radius: 4px;
          background-color: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .admin-dashboard__logout:hover {
          background-color: rgba(255, 255, 255, 0.2);
          color: white;
        }
        
        .admin-dashboard__main {
          flex: 1;
          margin-left: 250px;
          min-width: 0;
        }
        
        .admin-dashboard__topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background-color: white;
          border-bottom: 1px solid #eee;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        
        .admin-dashboard__search-bar {
          flex: 1;
          max-width: 400px;
        }
        
        .admin-dashboard__search-input {
          width: 100%;
          padding: 0.5rem 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
        }
        
        .admin-dashboard__topbar-actions {
          display: flex;
          align-items: center;
        }
        
        .admin-dashboard__notifications {
          margin-right: 1.5rem;
          position: relative;
        }
        
        .admin-dashboard__notification-button {
          background: none;
          border: none;
          font-size: 1.25rem;
          cursor: pointer;
          position: relative;
        }
        
        .admin-dashboard__notification-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background-color: #dc3545;
          color: white;
          font-size: 0.7rem;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .admin-dashboard__user {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        
        .admin-dashboard__user-name {
          font-weight: 500;
        }
        
        .admin-dashboard__user-role {
          font-size: 0.8rem;
          color: #666;
        }
        
        .admin-dashboard__content {
          padding: 2rem;
          background-color: #f8f9fa;
          min-height: calc(100vh - 70px);
        }
        
        .admin-dashboard__loading,
        .admin-dashboard__error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }
        
        .admin-dashboard__error {
          color: #dc3545;
        }
        
        .admin-dashboard__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        
        .admin-dashboard__header h2 {
          margin: 0;
          font-size: 1.75rem;
        }
        
        .admin-dashboard__button {
          padding: 0.5rem 1rem;
          background-color: #ffbd00;
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .admin-dashboard__button:hover {
          background-color: #e6a800;
        }
        
        .admin-dashboard__button--secondary {
          background-color: #f8f9fa;
          color: #333;
          border: 1px solid #ddd;
        }
        
        .admin-dashboard__button--secondary:hover {
          background-color: #e9ecef;
        }
        
        .admin-dashboard__button--small {
          padding: 0.25rem 0.5rem;
          font-size: 0.9rem;
        }
        
        .admin-dashboard__stats {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .admin-dashboard__stat-card {
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          text-align: center;
        }
        
        .admin-dashboard__stat-value {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #ffbd00;
        }
        
        .admin-dashboard__stat-label {
          font-size: 0.9rem;
          color: #666;
        }
        
        .admin-dashboard__charts {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .admin-dashboard__chart-card {
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .admin-dashboard__chart-card h3 {
          margin-top: 0;
          margin-bottom: 1.5rem;
          font-size: 1.2rem;
        }
        
        .admin-dashboard__feature-chart {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .admin-dashboard__feature-bar {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .admin-dashboard__feature-name {
          font-size: 0.9rem;
          color: #666;
        }
        
        .admin-dashboard__feature-bar-container {
          height: 8px;
          background-color: #e9ecef;
          border-radius: 4px;
          overflow: hidden;
          position: relative;
        }
        
        .admin-dashboard__feature-bar-fill {
          height: 100%;
          background-color: #ffbd00;
          border-radius: 4px;
        }
        
        .admin-dashboard__feature-count {
          position: absolute;
          right: 0;
          top: -18px;
          font-size: 0.8rem;
          color: #666;
        }
        
        .admin-dashboard__activity-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .admin-dashboard__activity-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #eee;
        }
        
        .admin-dashboard__activity-icon {
          font-size: 1.25rem;
        }
        
        .admin-dashboard__activity-details {
          flex: 1;
        }
        
        .admin-dashboard__activity-action {
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }
        
        .admin-dashboard__activity-time {
          font-size: 0.8rem;
          color: #666;
        }
        
        .admin-dashboard__quick-actions {
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .admin-dashboard__quick-actions h3 {
          margin-top: 0;
          margin-bottom: 1.5rem;
          font-size: 1.2rem;
        }
        
        .admin-dashboard__action-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .admin-dashboard__filters {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .admin-dashboard__search {
          flex: 1;
          max-width: 400px;
        }
        
        .admin-dashboard__filter-select {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
        }
        
        .admin-dashboard__table-container {
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          margin-bottom: 2rem;
        }
        
        .admin-dashboard__table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .admin-dashboard__table th,
        .admin-dashboard__table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        
        .admin-dashboard__table th {
          background-color: #f8f9fa;
          font-weight: 500;
          color: #666;
        }
        
        .admin-dashboard__status {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }
        
        .admin-dashboard__status--active,
        .admin-dashboard__status--completed {
          background-color: #d1e7dd;
          color: #0f5132;
        }
        
        .admin-dashboard__status--inactive {
          background-color: #e9ecef;
          color: #6c757d;
        }
        
        .admin-dashboard__status--suspended,
        .admin-dashboard__status--failed {
          background-color: #f8d7da;
          color: #842029;
        }
        
        .admin-dashboard__status--pending,
        .admin-dashboard__status--in-progress {
          background-color: #fff3cd;
          color: #664d03;
        }
        
        .admin-dashboard__priority {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }
        
        .admin-dashboard__priority--low {
          background-color: #d1e7dd;
          color: #0f5132;
        }
        
        .admin-dashboard__priority--medium {
          background-color: #fff3cd;
          color: #664d03;
        }
        
        .admin-dashboard__priority--high {
          background-color: #f8d7da;
          color: #842029;
        }
        
        .admin-dashboard__priority--urgent {
          background-color: #dc3545;
          color: white;
        }
        
        .admin-dashboard__package {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }
        
        .admin-dashboard__package--basic {
          background-color: #e9ecef;
          color: #6c757d;
        }
        
        .admin-dashboard__package--premium {
          background-color: #cfe2ff;
          color: #084298;
        }
        
        .admin-dashboard__package--deluxe {
          background-color: #ffc107;
          color: #664d03;
        }
        
        .admin-dashboard__actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .admin-dashboard__icon-button {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        
        .admin-dashboard__icon-button:hover {
          transform: scale(1.2);
        }
        
        .admin-dashboard__empty {
          text-align: center;
          padding: 2rem;
          color: #666;
        }
        
        .admin-dashboard__empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
        }
        
        .admin-dashboard__empty-state p {
          margin-bottom: 1.5rem;
          color: #666;
        }
        
        .admin-dashboard__packages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .admin-dashboard__package-card {
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
        }
        
        .admin-dashboard__package-card--inactive {
          opacity: 0.7;
        }
        
        .admin-dashboard__package-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        
        .admin-dashboard__package-header h3 {
          margin: 0;
          font-size: 1.2rem;
        }
        
        .admin-dashboard__package-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffbd00;
        }
        
        .admin-dashboard__package-billing {
          font-size: 0.9rem;
          font-weight: normal;
          color: #666;
        }
        
        .admin-dashboard__package-description {
          margin-bottom: 1.5rem;
          color: #666;
        }
        
        .admin-dashboard__package-features {
          margin-bottom: 1.5rem;
        }
        
        .admin-dashboard__package-features h4 {
          margin-top: 0;
          margin-bottom: 0.75rem;
          font-size: 1rem;
        }
        
        .admin-dashboard__package-features ul {
          margin: 0;
          padding-left: 1.5rem;
        }
        
        .admin-dashboard__package-features li {
          margin-bottom: 0.5rem;
        }
        
        .admin-dashboard__package-status {
          margin-bottom: 1rem;
        }
        
        .admin-dashboard__package-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: auto;
        }
        
        .admin-dashboard__pages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .admin-dashboard__page-card {
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
        }
        
        .admin-dashboard__page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }
        
        .admin-dashboard__page-header h3 {
          margin: 0;
          font-size: 1.2rem;
        }
        
        .admin-dashboard__page-url {
          color: #6c757d;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }
        
        .admin-dashboard__page-description {
          margin-bottom: 1.5rem;
          color: #666;
        }
        
        .admin-dashboard__page-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: #6c757d;
          margin-bottom: 1rem;
        }
        
        .admin-dashboard__page-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: auto;
        }
        
        .admin-dashboard__tabs {
          display: flex;
          border-bottom: 1px solid #ddd;
          margin-bottom: 1.5rem;
        }
        
        .admin-dashboard__tab {
          padding: 0.75rem 1.5rem;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          font-weight: 500;
          cursor: pointer;
        }
        
        .admin-dashboard__tab--active {
          border-bottom-color: #ffbd00;
          color: #ffbd00;
        }
        
        .admin-dashboard__settings-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .admin-dashboard__settings-section {
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .admin-dashboard__settings-section h3 {
          margin-top: 0;
          margin-bottom: 1.5rem;
          font-size: 1.2rem;
        }
        
        .admin-dashboard__form-group {
          margin-bottom: 1.5rem;
        }
        
        .admin-dashboard__form-group:last-child {
          margin-bottom: 0;
        }
        
        .admin-dashboard__form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .admin-dashboard__form-group input[type="text"],
        .admin-dashboard__form-group input[type="email"],
        .admin-dashboard__form-group input[type="password"],
        .admin-dashboard__form-group input[type="number"],
        .admin-dashboard__form-group select,
        .admin-dashboard__form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: inherit;
          font-size: inherit;
        }
        
        .admin-dashboard__form-group textarea {
          resize: vertical;
          min-height: 100px;
        }
        
        .admin-dashboard__checkbox-group {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .admin-dashboard__checkbox-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .admin-dashboard__color-picker {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .admin-dashboard__color-picker input[type="color"] {
          width: 50px;
          height: 50px;
          padding: 0;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .admin-dashboard__color-value {
          width: 100px;
        }
        
        .admin-dashboard__file-upload {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .admin-dashboard__current-file {
          font-size: 0.9rem;
          color: #666;
        }
        
        .admin-dashboard__form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        
        .admin-dashboard__modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .admin-dashboard__modal {
          background-color: white;
          border-radius: 8px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .admin-dashboard__modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #eee;
        }
        
        .admin-dashboard__modal-header h3 {
          margin: 0;
          font-size: 1.25rem;
        }
        
        .admin-dashboard__modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
        }
        
        .admin-dashboard__modal-content {
          padding: 1.5rem;
        }
        
        .admin-dashboard__form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .admin-dashboard__features-list {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }
        
        .admin-dashboard__feature-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .admin-dashboard__link {
          color: #0d6efd;
          text-decoration: none;
        }
        
        .admin-dashboard__link:hover {
          text-decoration: underline;
        }
        
        .admin-dashboard__disabled {
          color: #6c757d;
        }
        
        @media (max-width: 1024px) {
          .admin-dashboard__sidebar {
            width: 80px;
          }
          
          .admin-dashboard__logo {
            padding: 1rem;
            text-align: center;
          }
          
          .admin-dashboard__logo h1 {
            font-size: 1rem;
          }
          
          .admin-dashboard__nav-text,
          .admin-dashboard__user-role {
            display: none;
          }
          
          .admin-dashboard__nav-item {
            padding: 0.75rem;
            justify-content: center;
          }
          
          .admin-dashboard__nav-icon {
            margin-right: 0;
          }
          
          .admin-dashboard__logout {
            justify-content: center;
            padding: 0.75rem;
          }
          
          .admin-dashboard__main {
            margin-left: 80px;
          }
          
          .admin-dashboard__charts {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 768px) {
          .admin-dashboard__topbar {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }
          
          .admin-dashboard__search-bar {
            width: 100%;
            max-width: none;
          }
          
          .admin-dashboard__content {
            padding: 1rem;
          }
          
          .admin-dashboard__stats {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }
          
          .admin-dashboard__filters {
            flex-direction: column;
          }
          
          .admin-dashboard__search {
            max-width: none;
          }
          
          .admin-dashboard__packages-grid,
          .admin-dashboard__pages-grid {
            grid-template-columns: 1fr;
          }
          
          .admin-dashboard__features-list {
            grid-template-columns: 1fr;
          }
          
          .admin-dashboard__form-actions {
            flex-direction: column;
          }
          
          .admin-dashboard__form-actions button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
