import React from 'react';
import { useTranslation } from 'next-i18next';
import { Button } from '@/components/ui/Button';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
  createdAt: string;
  lastLogin?: string;
  status: 'active' | 'inactive';
  weddingId?: string;
}

interface Wedding {
  id: string;
  name: string;
  date: string;
  userId: string;
  plan: 'free' | 'basic' | 'premium';
  status: 'active' | 'archived';
  guestCount: number;
  createdAt: string;
  lastActive?: string;
}

interface Payment {
  id: string;
  userId: string;
  weddingId: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  method: 'credit_card' | 'paypal' | 'bank_transfer';
  date: string;
  plan: 'basic' | 'premium';
  duration: 'monthly' | 'yearly' | 'one_time';
}

interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalWeddings: number;
  activeWeddings: number;
  totalRevenue: number;
  monthlyRevenue: number;
  conversionRate: number;
  averageGuestCount: number;
}

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation('common');
  const [activeSection, setActiveSection] = React.useState<'dashboard' | 'users' | 'weddings' | 'payments' | 'settings'>('dashboard');
  const [users, setUsers] = React.useState<User[]>([]);
  const [weddings, setWeddings] = React.useState<Wedding[]>([]);
  const [payments, setPayments] = React.useState<Payment[]>([]);
  const [stats, setStats] = React.useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    totalWeddings: 0,
    activeWeddings: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    conversionRate: 0,
    averageGuestCount: 0
  });
  const [selectedUser, setSelectedUser] = React.useState<string | null>(null);
  const [selectedWedding, setSelectedWedding] = React.useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = React.useState<string | null>(null);
  const [userSearch, setUserSearch] = React.useState('');
  const [weddingSearch, setWeddingSearch] = React.useState('');
  const [paymentSearch, setPaymentSearch] = React.useState('');
  const [userFilter, setUserFilter] = React.useState<'all' | 'active' | 'inactive'>('all');
  const [weddingFilter, setWeddingFilter] = React.useState<'all' | 'active' | 'archived'>('all');
  const [paymentFilter, setPaymentFilter] = React.useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [showAddUserModal, setShowAddUserModal] = React.useState(false);
  const [showAddWeddingModal, setShowAddWeddingModal] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [editingWedding, setEditingWedding] = React.useState<Wedding | null>(null);
  const [timeRange, setTimeRange] = React.useState<'7days' | '30days' | '90days' | '1year'>('30days');

  // Initialisiere Beispieldaten
  React.useEffect(() => {
    // Beispielbenutzer
    const sampleUsers: User[] = [
      {
        id: 'user-1',
        email: 'admin@lemonvows.com',
        name: 'Admin User',
        role: 'admin',
        createdAt: '2025-01-01T00:00:00Z',
        lastLogin: '2025-03-27T10:30:00Z',
        status: 'active'
      },
      {
        id: 'user-2',
        email: 'customer1@example.com',
        name: 'Max Mustermann',
        role: 'customer',
        createdAt: '2025-02-15T00:00:00Z',
        lastLogin: '2025-03-25T14:20:00Z',
        status: 'active',
        weddingId: 'wedding-1'
      },
      {
        id: 'user-3',
        email: 'customer2@example.com',
        name: 'Anna Schmidt',
        role: 'customer',
        createdAt: '2025-02-20T00:00:00Z',
        lastLogin: '2025-03-26T09:15:00Z',
        status: 'active',
        weddingId: 'wedding-2'
      },
      {
        id: 'user-4',
        email: 'customer3@example.com',
        name: 'Thomas Weber',
        role: 'customer',
        createdAt: '2025-03-05T00:00:00Z',
        status: 'inactive'
      }
    ];
    
    // Beispielhochzeiten
    const sampleWeddings: Wedding[] = [
      {
        id: 'wedding-1',
        name: 'Hochzeit Max & Lisa',
        date: '2025-09-15',
        userId: 'user-2',
        plan: 'premium',
        status: 'active',
        guestCount: 120,
        createdAt: '2025-02-15T00:00:00Z',
        lastActive: '2025-03-25T14:20:00Z'
      },
      {
        id: 'wedding-2',
        name: 'Hochzeit Anna & Michael',
        date: '2025-07-22',
        userId: 'user-3',
        plan: 'basic',
        status: 'active',
        guestCount: 75,
        createdAt: '2025-02-20T00:00:00Z',
        lastActive: '2025-03-26T09:15:00Z'
      }
    ];
    
    // Beispielzahlungen
    const samplePayments: Payment[] = [
      {
        id: 'payment-1',
        userId: 'user-2',
        weddingId: 'wedding-1',
        amount: 99.99,
        currency: 'EUR',
        status: 'completed',
        method: 'credit_card',
        date: '2025-02-15T00:00:00Z',
        plan: 'premium',
        duration: 'one_time'
      },
      {
        id: 'payment-2',
        userId: 'user-3',
        weddingId: 'wedding-2',
        amount: 49.99,
        currency: 'EUR',
        status: 'completed',
        method: 'paypal',
        date: '2025-02-20T00:00:00Z',
        plan: 'basic',
        duration: 'one_time'
      }
    ];
    
    // Beispielstatistiken
    const sampleStats: Stats = {
      totalUsers: sampleUsers.length,
      activeUsers: sampleUsers.filter(user => user.status === 'active').length,
      totalWeddings: sampleWeddings.length,
      activeWeddings: sampleWeddings.filter(wedding => wedding.status === 'active').length,
      totalRevenue: samplePayments.reduce((sum, payment) => sum + payment.amount, 0),
      monthlyRevenue: samplePayments.reduce((sum, payment) => sum + payment.amount, 0),
      conversionRate: 75, // 75% der Benutzer haben ein Paket gekauft
      averageGuestCount: sampleWeddings.reduce((sum, wedding) => sum + wedding.guestCount, 0) / sampleWeddings.length
    };
    
    setUsers(sampleUsers);
    setWeddings(sampleWeddings);
    setPayments(samplePayments);
    setStats(sampleStats);
  }, []);

  // Gefilterte und durchsuchte Benutzer
  const filteredUsers = React.useMemo(() => {
    let filtered = [...users];
    
    // Nach Status filtern
    if (userFilter !== 'all') {
      filtered = filtered.filter(user => user.status === userFilter);
    }
    
    // Nach Suchbegriff filtern
    if (userSearch) {
      const search = userSearch.toLowerCase();
      filtered = filtered.filter(
        user => 
          user.name.toLowerCase().includes(search) || 
          user.email.toLowerCase().includes(search)
      );
    }
    
    return filtered;
  }, [users, userFilter, userSearch]);

  // Gefilterte und durchsuchte Hochzeiten
  const filteredWeddings = React.useMemo(() => {
    let filtered = [...weddings];
    
    // Nach Status filtern
    if (weddingFilter !== 'all') {
      filtered = filtered.filter(wedding => wedding.status === weddingFilter);
    }
    
    // Nach Suchbegriff filtern
    if (weddingSearch) {
      const search = weddingSearch.toLowerCase();
      filtered = filtered.filter(
        wedding => 
          wedding.name.toLowerCase().includes(search) || 
          wedding.date.includes(search) ||
          users.find(user => user.id === wedding.userId)?.name.toLowerCase().includes(search)
      );
    }
    
    return filtered;
  }, [weddings, weddingFilter, weddingSearch, users]);

  // Gefilterte und durchsuchte Zahlungen
  const filteredPayments = React.useMemo(() => {
    let filtered = [...payments];
    
    // Nach Status filtern
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === paymentFilter);
    }
    
    // Nach Suchbegriff filtern
    if (paymentSearch) {
      const search = paymentSearch.toLowerCase();
      filtered = filtered.filter(
        payment => 
          payment.id.toLowerCase().includes(search) || 
          users.find(user => user.id === payment.userId)?.name.toLowerCase().includes(search) ||
          payment.date.includes(search)
      );
    }
    
    return filtered;
  }, [payments, paymentFilter, paymentSearch, users]);

  // Ausgewählter Benutzer
  const getSelectedUser = React.useMemo(() => {
    if (!selectedUser) return null;
    return users.find(user => user.id === selectedUser) || null;
  }, [users, selectedUser]);

  // Ausgewählte Hochzeit
  const getSelectedWedding = React.useMemo(() => {
    if (!selectedWedding) return null;
    return weddings.find(wedding => wedding.id === selectedWedding) || null;
  }, [weddings, selectedWedding]);

  // Ausgewählte Zahlung
  const getSelectedPayment = React.useMemo(() => {
    if (!selectedPayment) return null;
    return payments.find(payment => payment.id === selectedPayment) || null;
  }, [payments, selectedPayment]);

  // Benutzer hinzufügen/bearbeiten
  const handleAddEditUser = (user: User) => {
    if (editingUser) {
      // Benutzer aktualisieren
      setUsers(users.map(u => u.id === user.id ? user : u));
    } else {
      // Neuen Benutzer hinzufügen
      setUsers([...users, { ...user, id: `user-${Date.now()}`, createdAt: new Date().toISOString() }]);
    }
    setShowAddUserModal(false);
    setEditingUser(null);
  };

  // Hochzeit hinzufügen/bearbeiten
  const handleAddEditWedding = (wedding: Wedding) => {
    if (editingWedding) {
      // Hochzeit aktualisieren
      setWeddings(weddings.map(w => w.id === wedding.id ? wedding : w));
    } else {
      // Neue Hochzeit hinzufügen
      setWeddings([...weddings, { ...wedding, id: `wedding-${Date.now()}`, createdAt: new Date().toISOString() }]);
    }
    setShowAddWeddingModal(false);
    setEditingWedding(null);
  };

  // Benutzer löschen
  const handleDeleteUser = (userId: string) => {
    if (window.confirm(t('admin.confirmDeleteUser'))) {
      setUsers(users.filter(user => user.id !== userId));
      if (selectedUser === userId) {
        setSelectedUser(null);
      }
    }
  };

  // Hochzeit löschen
  const handleDeleteWedding = (weddingId: string) => {
    if (window.confirm(t('admin.confirmDeleteWedding'))) {
      setWeddings(weddings.filter(wedding => wedding.id !== weddingId));
      if (selectedWedding === weddingId) {
        setSelectedWedding(null);
      }
    }
  };

  // Benutzer bearbeiten
  const handleEditUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setEditingUser(user);
      setShowAddUserModal(true);
    }
  };

  // Hochzeit bearbeiten
  const handleEditWedding = (weddingId: string) => {
    const wedding = weddings.find(w => w.id === weddingId);
    if (wedding) {
      setEditingWedding(wedding);
      setShowAddWeddingModal(true);
    }
  };

  // Benutzer auswählen
  const handleSelectUser = (userId: string) => {
    setSelectedUser(userId);
    setActiveSection('users');
  };

  // Hochzeit auswählen
  const handleSelectWedding = (weddingId: string) => {
    setSelectedWedding(weddingId);
    setActiveSection('weddings');
  };

  // Zahlung auswählen
  const handleSelectPayment = (paymentId: string) => {
    setSelectedPayment(paymentId);
    setActiveSection('payments');
  };

  // Formatiere Währung
  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency
    }).format(amount);
  };

  // Formatiere Datum
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  // Formatiere Datum mit Uhrzeit
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('de-DE');
  };

  // Benutzer-Status ändern
  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } 
        : user
    ));
  };

  // Hochzeits-Status ändern
  const toggleWeddingStatus = (weddingId: string) => {
    setWeddings(weddings.map(wedding => 
      wedding.id === weddingId 
        ? { ...wedding, status: wedding.status === 'active' ? 'archived' : 'active' } 
        : wedding
    ));
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__sidebar">
        <div className="admin-dashboard__logo">
          <h2>LemonVows</h2>
          <p>Admin</p>
        </div>
        
        <nav className="admin-dashboard__nav">
          <button 
            className={`admin-dashboard__nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveSection('dashboard')}
          >
            <span className="admin-dashboard__nav-icon">📊</span>
            <span className="admin-dashboard__nav-text">{t('admin.sections.dashboard')}</span>
          </button>
          
          <button 
            className={`admin-dashboard__nav-item ${activeSection === 'users' ? 'active' : ''}`}
            onClick={() => setActiveSection('users')}
          >
            <span className="admin-dashboard__nav-icon">👥</span>
            <span className="admin-dashboard__nav-text">{t('admin.sections.users')}</span>
          </button>
          
          <button 
            className={`admin-dashboard__nav-item ${activeSection === 'weddings' ? 'active' : ''}`}
            onClick={() => setActiveSection('weddings')}
          >
            <span className="admin-dashboard__nav-icon">💍</span>
            <span className="admin-dashboard__nav-text">{t('admin.sections.weddings')}</span>
          </button>
          
          <button 
            className={`admin-dashboard__nav-item ${activeSection === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveSection('payments')}
          >
            <span className="admin-dashboard__nav-icon">💰</span>
            <span className="admin-dashboard__nav-text">{t('admin.sections.payments')}</span>
          </button>
          
          <button 
            className={`admin-dashboard__nav-item ${activeSection === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveSection('settings')}
          >
            <span className="admin-dashboard__nav-icon">⚙️</span>
            <span className="admin-dashboard__nav-text">{t('admin.sections.settings')}</span>
          </button>
        </nav>
        
        <div className="admin-dashboard__user-info">
          <div className="admin-dashboard__user-avatar">A</div>
          <div className="admin-dashboard__user-details">
            <div className="admin-dashboard__user-name">Admin</div>
            <div className="admin-dashboard__user-role">Administrator</div>
          </div>
          <button className="admin-dashboard__logout">
            <span role="img" aria-label="Logout">🚪</span>
          </button>
        </div>
      </div>
      
      <div className="admin-dashboard__content">
        <header className="admin-dashboard__header">
          <h1>
            {activeSection === 'dashboard' && t('admin.dashboardTitle')}
            {activeSection === 'users' && t('admin.usersTitle')}
            {activeSection === 'weddings' && t('admin.weddingsTitle')}
            {activeSection === 'payments' && t('admin.paymentsTitle')}
            {activeSection === 'settings' && t('admin.settingsTitle')}
          </h1>
          
          <div className="admin-dashboard__actions">
            {activeSection === 'users' && (
              <Button onClick={() => {
                setEditingUser(null);
                setShowAddUserModal(true);
              }}>
                {t('admin.addUser')}
              </Button>
            )}
            
            {activeSection === 'weddings' && (
              <Button onClick={() => {
                setEditingWedding(null);
                setShowAddWeddingModal(true);
              }}>
                {t('admin.addWedding')}
              </Button>
            )}
          </div>
        </header>
        
        <main className="admin-dashboard__main">
          {/* Dashboard Section */}
          {activeSection === 'dashboard' && (
            <div className="admin-dashboard__dashboard">
              <div className="admin-dashboard__time-range">
                <button 
                  className={`time-range-btn ${timeRange === '7days' ? 'active' : ''}`}
                  onClick={() => setTimeRange('7days')}
                >
                  {t('admin.last7Days')}
                </button>
                <button 
                  className={`time-range-btn ${timeRange === '30days' ? 'active' : ''}`}
                  onClick={() => setTimeRange('30days')}
                >
                  {t('admin.last30Days')}
                </button>
                <button 
                  className={`time-range-btn ${timeRange === '90days' ? 'active' : ''}`}
                  onClick={() => setTimeRange('90days')}
                >
                  {t('admin.last90Days')}
                </button>
                <button 
                  className={`time-range-btn ${timeRange === '1year' ? 'active' : ''}`}
                  onClick={() => setTimeRange('1year')}
                >
                  {t('admin.lastYear')}
                </button>
              </div>
              
              <div className="admin-dashboard__stats-grid">
                <div className="admin-dashboard__stat-card">
                  <div className="admin-dashboard__stat-icon">👥</div>
                  <div className="admin-dashboard__stat-content">
                    <div className="admin-dashboard__stat-value">{stats.totalUsers}</div>
                    <div className="admin-dashboard__stat-label">{t('admin.totalUsers')}</div>
                  </div>
                  <div className="admin-dashboard__stat-trend positive">+{stats.totalUsers - 1}</div>
                </div>
                
                <div className="admin-dashboard__stat-card">
                  <div className="admin-dashboard__stat-icon">💍</div>
                  <div className="admin-dashboard__stat-content">
                    <div className="admin-dashboard__stat-value">{stats.totalWeddings}</div>
                    <div className="admin-dashboard__stat-label">{t('admin.totalWeddings')}</div>
                  </div>
                  <div className="admin-dashboard__stat-trend positive">+{stats.totalWeddings}</div>
                </div>
                
                <div className="admin-dashboard__stat-card">
                  <div className="admin-dashboard__stat-icon">💰</div>
                  <div className="admin-dashboard__stat-content">
                    <div className="admin-dashboard__stat-value">{formatCurrency(stats.totalRevenue)}</div>
                    <div className="admin-dashboard__stat-label">{t('admin.totalRevenue')}</div>
                  </div>
                  <div className="admin-dashboard__stat-trend positive">+{formatCurrency(stats.totalRevenue)}</div>
                </div>
                
                <div className="admin-dashboard__stat-card">
                  <div className="admin-dashboard__stat-icon">📈</div>
                  <div className="admin-dashboard__stat-content">
                    <div className="admin-dashboard__stat-value">{stats.conversionRate}%</div>
                    <div className="admin-dashboard__stat-label">{t('admin.conversionRate')}</div>
                  </div>
                  <div className="admin-dashboard__stat-trend positive">+5%</div>
                </div>
              </div>
              
              <div className="admin-dashboard__charts">
                <div className="admin-dashboard__chart-card">
                  <h3>{t('admin.revenueOverTime')}</h3>
                  <div className="admin-dashboard__chart-placeholder">
                    <div className="admin-dashboard__chart-bars">
                      <div className="admin-dashboard__chart-bar" style={{ height: '60%' }}></div>
                      <div className="admin-dashboard__chart-bar" style={{ height: '40%' }}></div>
                      <div className="admin-dashboard__chart-bar" style={{ height: '80%' }}></div>
                      <div className="admin-dashboard__chart-bar" style={{ height: '70%' }}></div>
                      <div className="admin-dashboard__chart-bar" style={{ height: '90%' }}></div>
                      <div className="admin-dashboard__chart-bar" style={{ height: '50%' }}></div>
                      <div className="admin-dashboard__chart-bar" style={{ height: '75%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="admin-dashboard__chart-card">
                  <h3>{t('admin.userGrowth')}</h3>
                  <div className="admin-dashboard__chart-placeholder">
                    <div className="admin-dashboard__chart-line">
                      <svg viewBox="0 0 100 50" preserveAspectRatio="none">
                        <path d="M0,50 L10,45 L20,40 L30,35 L40,30 L50,20 L60,15 L70,10 L80,5 L90,2 L100,0" stroke="#00A699" strokeWidth="2" fill="none" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="admin-dashboard__recent-activity">
                <h3>{t('admin.recentActivity')}</h3>
                
                <div className="admin-dashboard__activity-list">
                  <div className="admin-dashboard__activity-item">
                    <div className="admin-dashboard__activity-icon">👤</div>
                    <div className="admin-dashboard__activity-content">
                      <div className="admin-dashboard__activity-text">
                        {t('admin.newUserRegistered', { name: 'Thomas Weber' })}
                      </div>
                      <div className="admin-dashboard__activity-time">2 {t('admin.hoursAgo')}</div>
                    </div>
                  </div>
                  
                  <div className="admin-dashboard__activity-item">
                    <div className="admin-dashboard__activity-icon">💰</div>
                    <div className="admin-dashboard__activity-content">
                      <div className="admin-dashboard__activity-text">
                        {t('admin.newPaymentReceived', { name: 'Anna Schmidt', amount: formatCurrency(49.99) })}
                      </div>
                      <div className="admin-dashboard__activity-time">1 {t('admin.dayAgo')}</div>
                    </div>
                  </div>
                  
                  <div className="admin-dashboard__activity-item">
                    <div className="admin-dashboard__activity-icon">💍</div>
                    <div className="admin-dashboard__activity-content">
                      <div className="admin-dashboard__activity-text">
                        {t('admin.newWeddingCreated', { name: 'Max Mustermann' })}
                      </div>
                      <div className="admin-dashboard__activity-time">2 {t('admin.daysAgo')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Users Section */}
          {activeSection === 'users' && (
            <div className="admin-dashboard__users">
              <div className="admin-dashboard__filters">
                <div className="admin-dashboard__search">
                  <input 
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder={t('admin.searchUsers')}
                    className="input"
                  />
                </div>
                
                <div className="admin-dashboard__filter-group">
                  <select 
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value as 'all' | 'active' | 'inactive')}
                    className="select"
                  >
                    <option value="all">{t('admin.allUsers')}</option>
                    <option value="active">{t('admin.activeUsers')}</option>
                    <option value="inactive">{t('admin.inactiveUsers')}</option>
                  </select>
                </div>
              </div>
              
              <div className="admin-dashboard__table-container">
                <table className="admin-dashboard__table">
                  <thead>
                    <tr>
                      <th>{t('admin.name')}</th>
                      <th>{t('admin.email')}</th>
                      <th>{t('admin.role')}</th>
                      <th>{t('admin.status')}</th>
                      <th>{t('admin.createdAt')}</th>
                      <th>{t('admin.lastLogin')}</th>
                      <th>{t('admin.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr 
                        key={user.id}
                        className={selectedUser === user.id ? 'selected' : ''}
                        onClick={() => handleSelectUser(user.id)}
                      >
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge ${user.role === 'admin' ? 'admin' : 'customer'}`}>
                            {user.role === 'admin' ? t('admin.adminRole') : t('admin.customerRole')}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${user.status === 'active' ? 'active' : 'inactive'}`}>
                            {user.status === 'active' ? t('admin.active') : t('admin.inactive')}
                          </span>
                        </td>
                        <td>{formatDate(user.createdAt)}</td>
                        <td>{user.lastLogin ? formatDateTime(user.lastLogin) : '-'}</td>
                        <td>
                          <div className="admin-dashboard__actions-cell">
                            <button 
                              className="btn-icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditUser(user.id);
                              }}
                            >
                              <span role="img" aria-label="Edit">✏️</span>
                            </button>
                            
                            <button 
                              className="btn-icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleUserStatus(user.id);
                              }}
                            >
                              {user.status === 'active' 
                                ? <span role="img" aria-label="Deactivate">🔴</span>
                                : <span role="img" aria-label="Activate">🟢</span>
                              }
                            </button>
                            
                            <button 
                              className="btn-icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteUser(user.id);
                              }}
                            >
                              <span role="img" aria-label="Delete">🗑️</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {selectedUser && getSelectedUser && (
                <div className="admin-dashboard__detail-panel">
                  <div className="admin-dashboard__detail-header">
                    <h3>{t('admin.userDetails')}</h3>
                    <button 
                      className="btn-icon"
                      onClick={() => setSelectedUser(null)}
                    >
                      <span role="img" aria-label="Close">✖️</span>
                    </button>
                  </div>
                  
                  <div className="admin-dashboard__user-profile">
                    <div className="admin-dashboard__user-avatar large">
                      {getSelectedUser.name.charAt(0)}
                    </div>
                    
                    <div className="admin-dashboard__user-info-large">
                      <h4>{getSelectedUser.name}</h4>
                      <p>{getSelectedUser.email}</p>
                      
                      <div className="admin-dashboard__user-meta">
                        <div className="admin-dashboard__meta-item">
                          <span className="label">{t('admin.role')}:</span>
                          <span className={`badge ${getSelectedUser.role === 'admin' ? 'admin' : 'customer'}`}>
                            {getSelectedUser.role === 'admin' ? t('admin.adminRole') : t('admin.customerRole')}
                          </span>
                        </div>
                        
                        <div className="admin-dashboard__meta-item">
                          <span className="label">{t('admin.status')}:</span>
                          <span className={`badge ${getSelectedUser.status === 'active' ? 'active' : 'inactive'}`}>
                            {getSelectedUser.status === 'active' ? t('admin.active') : t('admin.inactive')}
                          </span>
                        </div>
                        
                        <div className="admin-dashboard__meta-item">
                          <span className="label">{t('admin.createdAt')}:</span>
                          <span>{formatDate(getSelectedUser.createdAt)}</span>
                        </div>
                        
                        <div className="admin-dashboard__meta-item">
                          <span className="label">{t('admin.lastLogin')}:</span>
                          <span>{getSelectedUser.lastLogin ? formatDateTime(getSelectedUser.lastLogin) : '-'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {getSelectedUser.weddingId && (
                    <div className="admin-dashboard__user-wedding">
                      <h4>{t('admin.associatedWedding')}</h4>
                      
                      {weddings
                        .filter(wedding => wedding.userId === getSelectedUser.id)
                        .map(wedding => (
                          <div 
                            key={wedding.id}
                            className="admin-dashboard__wedding-card"
                            onClick={() => handleSelectWedding(wedding.id)}
                          >
                            <div className="admin-dashboard__wedding-name">{wedding.name}</div>
                            <div className="admin-dashboard__wedding-date">{wedding.date}</div>
                            <div className="admin-dashboard__wedding-plan">
                              <span className={`badge plan-${wedding.plan}`}>
                                {wedding.plan === 'free' ? t('admin.freePlan') : 
                                 wedding.plan === 'basic' ? t('admin.basicPlan') : 
                                 t('admin.premiumPlan')}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                  
                  <div className="admin-dashboard__detail-actions">
                    <Button 
                      onClick={() => handleEditUser(getSelectedUser.id)}
                    >
                      {t('admin.editUser')}
                    </Button>
                    
                    <Button 
                      variant="secondary"
                      onClick={() => toggleUserStatus(getSelectedUser.id)}
                    >
                      {getSelectedUser.status === 'active' 
                        ? t('admin.deactivateUser')
                        : t('admin.activateUser')
                      }
                    </Button>
                    
                    <Button 
                      variant="secondary"
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => handleDeleteUser(getSelectedUser.id)}
                    >
                      {t('admin.deleteUser')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Weddings Section */}
          {activeSection === 'weddings' && (
            <div className="admin-dashboard__weddings">
              <div className="admin-dashboard__filters">
                <div className="admin-dashboard__search">
                  <input 
                    type="text"
                    value={weddingSearch}
                    onChange={(e) => setWeddingSearch(e.target.value)}
                    placeholder={t('admin.searchWeddings')}
                    className="input"
                  />
                </div>
                
                <div className="admin-dashboard__filter-group">
                  <select 
                    value={weddingFilter}
                    onChange={(e) => setWeddingFilter(e.target.value as 'all' | 'active' | 'archived')}
                    className="select"
                  >
                    <option value="all">{t('admin.allWeddings')}</option>
                    <option value="active">{t('admin.activeWeddings')}</option>
                    <option value="archived">{t('admin.archivedWeddings')}</option>
                  </select>
                </div>
              </div>
              
              <div className="admin-dashboard__table-container">
                <table className="admin-dashboard__table">
                  <thead>
                    <tr>
                      <th>{t('admin.weddingName')}</th>
                      <th>{t('admin.date')}</th>
                      <th>{t('admin.couple')}</th>
                      <th>{t('admin.plan')}</th>
                      <th>{t('admin.guestCount')}</th>
                      <th>{t('admin.status')}</th>
                      <th>{t('admin.createdAt')}</th>
                      <th>{t('admin.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWeddings.map(wedding => {
                      const user = users.find(u => u.id === wedding.userId);
                      
                      return (
                        <tr 
                          key={wedding.id}
                          className={selectedWedding === wedding.id ? 'selected' : ''}
                          onClick={() => handleSelectWedding(wedding.id)}
                        >
                          <td>{wedding.name}</td>
                          <td>{wedding.date}</td>
                          <td>{user?.name || '-'}</td>
                          <td>
                            <span className={`badge plan-${wedding.plan}`}>
                              {wedding.plan === 'free' ? t('admin.freePlan') : 
                               wedding.plan === 'basic' ? t('admin.basicPlan') : 
                               t('admin.premiumPlan')}
                            </span>
                          </td>
                          <td>{wedding.guestCount}</td>
                          <td>
                            <span className={`badge ${wedding.status === 'active' ? 'active' : 'archived'}`}>
                              {wedding.status === 'active' ? t('admin.active') : t('admin.archived')}
                            </span>
                          </td>
                          <td>{formatDate(wedding.createdAt)}</td>
                          <td>
                            <div className="admin-dashboard__actions-cell">
                              <button 
                                className="btn-icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditWedding(wedding.id);
                                }}
                              >
                                <span role="img" aria-label="Edit">✏️</span>
                              </button>
                              
                              <button 
                                className="btn-icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleWeddingStatus(wedding.id);
                                }}
                              >
                                {wedding.status === 'active' 
                                  ? <span role="img" aria-label="Archive">📦</span>
                                  : <span role="img" aria-label="Activate">🔄</span>
                                }
                              </button>
                              
                              <button 
                                className="btn-icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteWedding(wedding.id);
                                }}
                              >
                                <span role="img" aria-label="Delete">🗑️</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {selectedWedding && getSelectedWedding && (
                <div className="admin-dashboard__detail-panel">
                  <div className="admin-dashboard__detail-header">
                    <h3>{t('admin.weddingDetails')}</h3>
                    <button 
                      className="btn-icon"
                      onClick={() => setSelectedWedding(null)}
                    >
                      <span role="img" aria-label="Close">✖️</span>
                    </button>
                  </div>
                  
                  <div className="admin-dashboard__wedding-details">
                    <div className="admin-dashboard__wedding-header">
                      <div className="admin-dashboard__wedding-icon">💍</div>
                      <div className="admin-dashboard__wedding-info">
                        <h4>{getSelectedWedding.name}</h4>
                        <p>{getSelectedWedding.date}</p>
                      </div>
                    </div>
                    
                    <div className="admin-dashboard__wedding-meta">
                      <div className="admin-dashboard__meta-item">
                        <span className="label">{t('admin.couple')}:</span>
                        <span>
                          {users.find(u => u.id === getSelectedWedding.userId)?.name || '-'}
                        </span>
                      </div>
                      
                      <div className="admin-dashboard__meta-item">
                        <span className="label">{t('admin.plan')}:</span>
                        <span className={`badge plan-${getSelectedWedding.plan}`}>
                          {getSelectedWedding.plan === 'free' ? t('admin.freePlan') : 
                           getSelectedWedding.plan === 'basic' ? t('admin.basicPlan') : 
                           t('admin.premiumPlan')}
                        </span>
                      </div>
                      
                      <div className="admin-dashboard__meta-item">
                        <span className="label">{t('admin.guestCount')}:</span>
                        <span>{getSelectedWedding.guestCount}</span>
                      </div>
                      
                      <div className="admin-dashboard__meta-item">
                        <span className="label">{t('admin.status')}:</span>
                        <span className={`badge ${getSelectedWedding.status === 'active' ? 'active' : 'archived'}`}>
                          {getSelectedWedding.status === 'active' ? t('admin.active') : t('admin.archived')}
                        </span>
                      </div>
                      
                      <div className="admin-dashboard__meta-item">
                        <span className="label">{t('admin.createdAt')}:</span>
                        <span>{formatDate(getSelectedWedding.createdAt)}</span>
                      </div>
                      
                      <div className="admin-dashboard__meta-item">
                        <span className="label">{t('admin.lastActive')}:</span>
                        <span>{getSelectedWedding.lastActive ? formatDateTime(getSelectedWedding.lastActive) : '-'}</span>
                      </div>
                    </div>
                    
                    <div className="admin-dashboard__wedding-stats">
                      <div className="admin-dashboard__stat-item">
                        <div className="admin-dashboard__stat-value">{getSelectedWedding.guestCount}</div>
                        <div className="admin-dashboard__stat-label">{t('admin.guests')}</div>
                      </div>
                      
                      <div className="admin-dashboard__stat-item">
                        <div className="admin-dashboard__stat-value">
                          {payments
                            .filter(payment => payment.weddingId === getSelectedWedding.id)
                            .reduce((sum, payment) => sum + payment.amount, 0)
                            .toFixed(2)}€
                        </div>
                        <div className="admin-dashboard__stat-label">{t('admin.revenue')}</div>
                      </div>
                      
                      <div className="admin-dashboard__stat-item">
                        <div className="admin-dashboard__stat-value">
                          {Math.floor((new Date(getSelectedWedding.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                        </div>
                        <div className="admin-dashboard__stat-label">{t('admin.daysUntilWedding')}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="admin-dashboard__detail-actions">
                    <Button 
                      onClick={() => handleEditWedding(getSelectedWedding.id)}
                    >
                      {t('admin.editWedding')}
                    </Button>
                    
                    <Button 
                      variant="secondary"
                      onClick={() => toggleWeddingStatus(getSelectedWedding.id)}
                    >
                      {getSelectedWedding.status === 'active' 
                        ? t('admin.archiveWedding')
                        : t('admin.activateWedding')
                      }
                    </Button>
                    
                    <Button 
                      variant="destructive"
                      onClick={() => handleDeleteWedding(getSelectedWedding.id)}
                    >
                      {t('admin.deleteWedding')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Payments Section */}
          {activeSection === 'payments' && (
            <div className="admin-dashboard__payments">
              <div className="admin-dashboard__filters">
                <div className="admin-dashboard__search">
                  <input 
                    type="text"
                    value={paymentSearch}
                    onChange={(e) => setPaymentSearch(e.target.value)}
                    placeholder={t('admin.searchPayments')}
                    className="input"
                  />
                </div>
                
                <div className="admin-dashboard__filter-group">
                  <select 
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value as 'all' | 'completed' | 'pending' | 'failed')}
                    className="select"
                  >
                    <option value="all">{t('admin.allPayments')}</option>
                    <option value="completed">{t('admin.completedPayments')}</option>
                    <option value="pending">{t('admin.pendingPayments')}</option>
                    <option value="failed">{t('admin.failedPayments')}</option>
                  </select>
                </div>
              </div>
              
              <div className="admin-dashboard__table-container">
                <table className="admin-dashboard__table">
                  <thead>
                    <tr>
                      <th>{t('admin.id')}</th>
                      <th>{t('admin.customer')}</th>
                      <th>{t('admin.wedding')}</th>
                      <th>{t('admin.amount')}</th>
                      <th>{t('admin.plan')}</th>
                      <th>{t('admin.method')}</th>
                      <th>{t('admin.status')}</th>
                      <th>{t('admin.date')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map(payment => {
                      const user = users.find(u => u.id === payment.userId);
                      const wedding = weddings.find(w => w.id === payment.weddingId);
                      
                      return (
                        <tr 
                          key={payment.id}
                          className={selectedPayment === payment.id ? 'selected' : ''}
                          onClick={() => handleSelectPayment(payment.id)}
                        >
                          <td>{payment.id}</td>
                          <td>{user?.name || '-'}</td>
                          <td>{wedding?.name || '-'}</td>
                          <td>{formatCurrency(payment.amount, payment.currency)}</td>
                          <td>
                            <span className={`badge plan-${payment.plan}`}>
                              {payment.plan === 'basic' ? t('admin.basicPlan') : t('admin.premiumPlan')}
                            </span>
                          </td>
                          <td>
                            {payment.method === 'credit_card' ? t('admin.creditCard') :
                             payment.method === 'paypal' ? 'PayPal' :
                             t('admin.bankTransfer')}
                          </td>
                          <td>
                            <span className={`badge payment-${payment.status}`}>
                              {payment.status === 'completed' ? t('admin.completed') :
                               payment.status === 'pending' ? t('admin.pending') :
                               t('admin.failed')}
                            </span>
                          </td>
                          <td>{formatDateTime(payment.date)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {selectedPayment && getSelectedPayment && (
                <div className="admin-dashboard__detail-panel">
                  <div className="admin-dashboard__detail-header">
                    <h3>{t('admin.paymentDetails')}</h3>
                    <button 
                      className="btn-icon"
                      onClick={() => setSelectedPayment(null)}
                    >
                      <span role="img" aria-label="Close">✖️</span>
                    </button>
                  </div>
                  
                  <div className="admin-dashboard__payment-details">
                    <div className="admin-dashboard__payment-header">
                      <div className="admin-dashboard__payment-icon">💰</div>
                      <div className="admin-dashboard__payment-info">
                        <h4>{t('admin.paymentId')}: {getSelectedPayment.id}</h4>
                        <p>
                          <span className={`badge payment-${getSelectedPayment.status}`}>
                            {getSelectedPayment.status === 'completed' ? t('admin.completed') :
                             getSelectedPayment.status === 'pending' ? t('admin.pending') :
                             t('admin.failed')}
                          </span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="admin-dashboard__payment-amount">
                      <div className="admin-dashboard__amount-value">
                        {formatCurrency(getSelectedPayment.amount, getSelectedPayment.currency)}
                      </div>
                      <div className="admin-dashboard__amount-plan">
                        <span className={`badge plan-${getSelectedPayment.plan}`}>
                          {getSelectedPayment.plan === 'basic' ? t('admin.basicPlan') : t('admin.premiumPlan')}
                        </span>
                        <span className="duration">
                          {getSelectedPayment.duration === 'monthly' ? t('admin.monthly') :
                           getSelectedPayment.duration === 'yearly' ? t('admin.yearly') :
                           t('admin.oneTime')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="admin-dashboard__payment-meta">
                      <div className="admin-dashboard__meta-item">
                        <span className="label">{t('admin.customer')}:</span>
                        <span>
                          {users.find(u => u.id === getSelectedPayment.userId)?.name || '-'}
                        </span>
                      </div>
                      
                      <div className="admin-dashboard__meta-item">
                        <span className="label">{t('admin.wedding')}:</span>
                        <span>
                          {weddings.find(w => w.id === getSelectedPayment.weddingId)?.name || '-'}
                        </span>
                      </div>
                      
                      <div className="admin-dashboard__meta-item">
                        <span className="label">{t('admin.method')}:</span>
                        <span>
                          {getSelectedPayment.method === 'credit_card' ? t('admin.creditCard') :
                           getSelectedPayment.method === 'paypal' ? 'PayPal' :
                           t('admin.bankTransfer')}
                        </span>
                      </div>
                      
                      <div className="admin-dashboard__meta-item">
                        <span className="label">{t('admin.date')}:</span>
                        <span>{formatDateTime(getSelectedPayment.date)}</span>
                      </div>
                    </div>
                    
                    <div className="admin-dashboard__payment-actions">
                      <Button>
                        {t('admin.viewInvoice')}
                      </Button>
                      
                      <Button variant="secondary">
                        {t('admin.sendReceipt')}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Settings Section */}
          {activeSection === 'settings' && (
            <div className="admin-dashboard__settings">
              <div className="admin-dashboard__settings-section">
                <h3>{t('admin.generalSettings')}</h3>
                
                <div className="admin-dashboard__settings-form">
                  <div className="admin-dashboard__form-group">
                    <label>{t('admin.siteName')}</label>
                    <input 
                      type="text"
                      value="LemonVows"
                      className="input"
                    />
                  </div>
                  
                  <div className="admin-dashboard__form-group">
                    <label>{t('admin.siteUrl')}</label>
                    <input 
                      type="text"
                      value="https://lemonvows.lemonharbor.com"
                      className="input"
                    />
                  </div>
                  
                  <div className="admin-dashboard__form-group">
                    <label>{t('admin.adminEmail')}</label>
                    <input 
                      type="email"
                      value="admin@lemonvows.com"
                      className="input"
                    />
                  </div>
                  
                  <div className="admin-dashboard__form-group">
                    <label>{t('admin.defaultLanguage')}</label>
                    <select className="select">
                      <option value="de">Deutsch</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
                
                <Button>
                  {t('admin.saveSettings')}
                </Button>
              </div>
              
              <div className="admin-dashboard__settings-section">
                <h3>{t('admin.pricingSettings')}</h3>
                
                <div className="admin-dashboard__settings-form">
                  <div className="admin-dashboard__form-group">
                    <label>{t('admin.basicPlanPrice')}</label>
                    <div className="input-group">
                      <input 
                        type="number"
                        value="49.99"
                        className="input"
                      />
                      <span className="input-addon">EUR</span>
                    </div>
                  </div>
                  
                  <div className="admin-dashboard__form-group">
                    <label>{t('admin.premiumPlanPrice')}</label>
                    <div className="input-group">
                      <input 
                        type="number"
                        value="99.99"
                        className="input"
                      />
                      <span className="input-addon">EUR</span>
                    </div>
                  </div>
                  
                  <div className="admin-dashboard__form-group">
                    <label>{t('admin.freeTrialDays')}</label>
                    <input 
                      type="number"
                      value="14"
                      className="input"
                    />
                  </div>
                </div>
                
                <Button>
                  {t('admin.saveSettings')}
                </Button>
              </div>
              
              <div className="admin-dashboard__settings-section">
                <h3>{t('admin.integrationSettings')}</h3>
                
                <div className="admin-dashboard__settings-form">
                  <div className="admin-dashboard__form-group">
                    <label>{t('admin.stripeApiKey')}</label>
                    <input 
                      type="password"
                      value="sk_test_••••••••••••••••••••••••"
                      className="input"
                    />
                  </div>
                  
                  <div className="admin-dashboard__form-group">
                    <label>{t('admin.mailchimpApiKey')}</label>
                    <input 
                      type="password"
                      value="••••••••••••••••••••••••"
                      className="input"
                    />
                  </div>
                  
                  <div className="admin-dashboard__form-group">
                    <label>{t('admin.googleAnalyticsId')}</label>
                    <input 
                      type="text"
                      value="UA-XXXXXXXXX-X"
                      className="input"
                    />
                  </div>
                </div>
                
                <Button>
                  {t('admin.saveSettings')}
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
      
      {/* Modals */}
      {showAddUserModal && (
        <div className="admin-dashboard__modal">
          <div className="admin-dashboard__modal-content">
            <h3>{editingUser ? t('admin.editUser') : t('admin.addUser')}</h3>
            
            <div className="admin-dashboard__modal-form">
              <div className="admin-dashboard__form-group">
                <label>{t('admin.name')}</label>
                <input 
                  type="text"
                  value={editingUser?.name || ''}
                  onChange={(e) => setEditingUser(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="input"
                />
              </div>
              
              <div className="admin-dashboard__form-group">
                <label>{t('admin.email')}</label>
                <input 
                  type="email"
                  value={editingUser?.email || ''}
                  onChange={(e) => setEditingUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                  className="input"
                />
              </div>
              
              <div className="admin-dashboard__form-group">
                <label>{t('admin.role')}</label>
                <select 
                  value={editingUser?.role || 'customer'}
                  onChange={(e) => setEditingUser(prev => prev ? { ...prev, role: e.target.value as 'admin' | 'customer' } : null)}
                  className="select"
                >
                  <option value="admin">{t('admin.adminRole')}</option>
                  <option value="customer">{t('admin.customerRole')}</option>
                </select>
              </div>
              
              <div className="admin-dashboard__form-group">
                <label>{t('admin.status')}</label>
                <select 
                  value={editingUser?.status || 'active'}
                  onChange={(e) => setEditingUser(prev => prev ? { ...prev, status: e.target.value as 'active' | 'inactive' } : null)}
                  className="select"
                >
                  <option value="active">{t('admin.active')}</option>
                  <option value="inactive">{t('admin.inactive')}</option>
                </select>
              </div>
            </div>
            
            <div className="admin-dashboard__modal-actions">
              <Button 
                onClick={() => {
                  if (editingUser) {
                    handleAddEditUser(editingUser);
                  } else {
                    handleAddEditUser({
                      id: '',
                      name: 'New User',
                      email: 'user@example.com',
                      role: 'customer',
                      status: 'active',
                      createdAt: new Date().toISOString()
                    });
                  }
                }}
              >
                {editingUser ? t('admin.saveChanges') : t('admin.addUser')}
              </Button>
              
              <Button 
                variant="secondary"
                onClick={() => {
                  setShowAddUserModal(false);
                  setEditingUser(null);
                }}
              >
                {t('admin.cancel')}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {showAddWeddingModal && (
        <div className="admin-dashboard__modal">
          <div className="admin-dashboard__modal-content">
            <h3>{editingWedding ? t('admin.editWedding') : t('admin.addWedding')}</h3>
            
            <div className="admin-dashboard__modal-form">
              <div className="admin-dashboard__form-group">
                <label>{t('admin.weddingName')}</label>
                <input 
                  type="text"
                  value={editingWedding?.name || ''}
                  onChange={(e) => setEditingWedding(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="input"
                />
              </div>
              
              <div className="admin-dashboard__form-group">
                <label>{t('admin.weddingDate')}</label>
                <input 
                  type="date"
                  value={editingWedding?.date || ''}
                  onChange={(e) => setEditingWedding(prev => prev ? { ...prev, date: e.target.value } : null)}
                  className="input"
                />
              </div>
              
              <div className="admin-dashboard__form-group">
                <label>{t('admin.user')}</label>
                <select 
                  value={editingWedding?.userId || ''}
                  onChange={(e) => setEditingWedding(prev => prev ? { ...prev, userId: e.target.value } : null)}
                  className="select"
                >
                  <option value="">{t('admin.selectUser')}</option>
                  {users
                    .filter(user => user.role === 'customer')
                    .map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                </select>
              </div>
              
              <div className="admin-dashboard__form-group">
                <label>{t('admin.plan')}</label>
                <select 
                  value={editingWedding?.plan || 'free'}
                  onChange={(e) => setEditingWedding(prev => prev ? { ...prev, plan: e.target.value as 'free' | 'basic' | 'premium' } : null)}
                  className="select"
                >
                  <option value="free">{t('admin.freePlan')}</option>
                  <option value="basic">{t('admin.basicPlan')}</option>
                  <option value="premium">{t('admin.premiumPlan')}</option>
                </select>
              </div>
              
              <div className="admin-dashboard__form-group">
                <label>{t('admin.guestCount')}</label>
                <input 
                  type="number"
                  value={editingWedding?.guestCount || 0}
                  onChange={(e) => setEditingWedding(prev => prev ? { ...prev, guestCount: parseInt(e.target.value) } : null)}
                  min="0"
                  className="input"
                />
              </div>
              
              <div className="admin-dashboard__form-group">
                <label>{t('admin.status')}</label>
                <select 
                  value={editingWedding?.status || 'active'}
                  onChange={(e) => setEditingWedding(prev => prev ? { ...prev, status: e.target.value as 'active' | 'archived' } : null)}
                  className="select"
                >
                  <option value="active">{t('admin.active')}</option>
                  <option value="archived">{t('admin.archived')}</option>
                </select>
              </div>
            </div>
            
            <div className="admin-dashboard__modal-actions">
              <Button 
                onClick={() => {
                  if (editingWedding) {
                    handleAddEditWedding(editingWedding);
                  } else {
                    handleAddEditWedding({
                      id: '',
                      name: 'New Wedding',
                      date: new Date().toISOString().split('T')[0],
                      userId: users.find(user => user.role === 'customer')?.id || '',
                      plan: 'free',
                      status: 'active',
                      guestCount: 0,
                      createdAt: new Date().toISOString()
                    });
                  }
                }}
              >
                {editingWedding ? t('admin.saveChanges') : t('admin.addWedding')}
              </Button>
              
              <Button 
                variant="secondary"
                onClick={() => {
                  setShowAddWeddingModal(false);
                  setEditingWedding(null);
                }}
              >
                {t('admin.cancel')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
