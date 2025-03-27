// Admin-Dashboard für No-Code-Verwaltung
// lemonvows/frontend/components/AdminDashboard.vue

<template>
  <div class="admin-dashboard">
    <header class="admin-header">
      <h1>LemonVows Admin-Dashboard</h1>
      <div class="admin-controls">
        <select v-model="currentLanguage" @change="changeLanguage">
          <option value="de">Deutsch</option>
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="es">Español</option>
        </select>
        <button @click="logout" class="logout-button">{{ $t('admin.logout') }}</button>
      </div>
    </header>

    <div class="admin-sidebar">
      <nav>
        <ul>
          <li v-for="(section, index) in adminSections" :key="index" 
              :class="{ active: currentSection === section.id }"
              @click="currentSection = section.id">
            <i :class="section.icon"></i>
            <span>{{ $t(`admin.sections.${section.id}`) }}</span>
          </li>
        </ul>
      </nav>
    </div>

    <main class="admin-content">
      <!-- Dashboard Übersicht -->
      <section v-if="currentSection === 'dashboard'" class="admin-section">
        <h2>{{ $t('admin.dashboard.title') }}</h2>
        
        <div class="dashboard-stats">
          <div class="stat-card">
            <h3>{{ $t('admin.dashboard.totalUsers') }}</h3>
            <div class="stat-value">{{ stats.totalUsers }}</div>
            <div class="stat-change" :class="stats.userChange >= 0 ? 'positive' : 'negative'">
              {{ stats.userChange >= 0 ? '+' : '' }}{{ stats.userChange }}%
            </div>
          </div>
          
          <div class="stat-card">
            <h3>{{ $t('admin.dashboard.activeWeddings') }}</h3>
            <div class="stat-value">{{ stats.activeWeddings }}</div>
          </div>
          
          <div class="stat-card">
            <h3>{{ $t('admin.dashboard.monthlyRevenue') }}</h3>
            <div class="stat-value">{{ formatCurrency(stats.monthlyRevenue) }}</div>
            <div class="stat-change" :class="stats.revenueChange >= 0 ? 'positive' : 'negative'">
              {{ stats.revenueChange >= 0 ? '+' : '' }}{{ stats.revenueChange }}%
            </div>
          </div>
          
          <div class="stat-card">
            <h3>{{ $t('admin.dashboard.conversionRate') }}</h3>
            <div class="stat-value">{{ stats.conversionRate }}%</div>
          </div>
        </div>
        
        <div class="dashboard-charts">
          <div class="chart-container">
            <h3>{{ $t('admin.dashboard.userGrowth') }}</h3>
            <canvas ref="userGrowthChart"></canvas>
          </div>
          
          <div class="chart-container">
            <h3>{{ $t('admin.dashboard.revenueChart') }}</h3>
            <canvas ref="revenueChart"></canvas>
          </div>
        </div>
        
        <div class="recent-activity">
          <h3>{{ $t('admin.dashboard.recentActivity') }}</h3>
          <ul>
            <li v-for="(activity, index) in recentActivities" :key="index" class="activity-item">
              <div class="activity-icon" :class="activity.type"></div>
              <div class="activity-details">
                <div class="activity-message">{{ activity.message }}</div>
                <div class="activity-time">{{ formatTime(activity.timestamp) }}</div>
              </div>
            </li>
          </ul>
        </div>
      </section>
      
      <!-- Benutzer-Verwaltung -->
      <section v-if="currentSection === 'users'" class="admin-section">
        <h2>{{ $t('admin.users.title') }}</h2>
        
        <div class="section-controls">
          <div class="search-box">
            <input type="text" v-model="userSearch" :placeholder="$t('admin.users.searchPlaceholder')">
            <button @click="searchUsers"><i class="fas fa-search"></i></button>
          </div>
          
          <div class="filter-controls">
            <select v-model="userFilter">
              <option value="all">{{ $t('admin.users.filterAll') }}</option>
              <option value="active">{{ $t('admin.users.filterActive') }}</option>
              <option value="inactive">{{ $t('admin.users.filterInactive') }}</option>
              <option value="premium">{{ $t('admin.users.filterPremium') }}</option>
              <option value="basic">{{ $t('admin.users.filterBasic') }}</option>
              <option value="free">{{ $t('admin.users.filterFree') }}</option>
            </select>
          </div>
        </div>
        
        <div class="data-table">
          <table>
            <thead>
              <tr>
                <th>{{ $t('admin.users.id') }}</th>
                <th>{{ $t('admin.users.name') }}</th>
                <th>{{ $t('admin.users.email') }}</th>
                <th>{{ $t('admin.users.plan') }}</th>
                <th>{{ $t('admin.users.status') }}</th>
                <th>{{ $t('admin.users.registeredDate') }}</th>
                <th>{{ $t('admin.users.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <span class="plan-badge" :class="user.plan">
                    {{ $t(`admin.plans.${user.plan}`) }}
                  </span>
                </td>
                <td>
                  <span class="status-badge" :class="user.status">
                    {{ $t(`admin.users.status${user.status}`) }}
                  </span>
                </td>
                <td>{{ formatDate(user.registeredDate) }}</td>
                <td class="actions">
                  <button @click="editUser(user)" class="action-button edit">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="viewUserDetails(user)" class="action-button view">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button @click="deleteUser(user)" class="action-button delete">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1">
            <i class="fas fa-chevron-left"></i>
          </button>
          <span>{{ currentPage }} / {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
        
        <!-- Benutzer-Bearbeitungs-Modal -->
        <div v-if="showUserModal" class="modal">
          <div class="modal-content">
            <div class="modal-header">
              <h3>{{ editingUser.id ? $t('admin.users.editUser') : $t('admin.users.addUser') }}</h3>
              <button @click="closeUserModal" class="close-button">&times;</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label for="userName">{{ $t('admin.users.name') }}</label>
                <input type="text" id="userName" v-model="editingUser.name">
              </div>
              <div class="form-group">
                <label for="userEmail">{{ $t('admin.users.email') }}</label>
                <input type="email" id="userEmail" v-model="editingUser.email">
              </div>
              <div class="form-group">
                <label for="userPlan">{{ $t('admin.users.plan') }}</label>
                <select id="userPlan" v-model="editingUser.plan">
                  <option value="free">{{ $t('admin.plans.free') }}</option>
                  <option value="basic">{{ $t('admin.plans.basic') }}</option>
                  <option value="premium">{{ $t('admin.plans.premium') }}</option>
                </select>
              </div>
              <div class="form-group">
                <label for="userStatus">{{ $t('admin.users.status') }}</label>
                <select id="userStatus" v-model="editingUser.status">
                  <option value="active">{{ $t('admin.users.statusactive') }}</option>
                  <option value="inactive">{{ $t('admin.users.statusinactive') }}</option>
                  <option value="suspended">{{ $t('admin.users.statussuspended') }}</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button @click="closeUserModal" class="button secondary">{{ $t('admin.cancel') }}</button>
              <button @click="saveUser" class="button primary">{{ $t('admin.save') }}</button>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Abonnement-Verwaltung -->
      <section v-if="currentSection === 'subscriptions'" class="admin-section">
        <h2>{{ $t('admin.subscriptions.title') }}</h2>
        
        <div class="section-controls">
          <div class="search-box">
            <input type="text" v-model="subscriptionSearch" :placeholder="$t('admin.subscriptions.searchPlaceholder')">
            <button @click="searchSubscriptions"><i class="fas fa-search"></i></button>
          </div>
          
          <div class="filter-controls">
            <select v-model="subscriptionFilter">
              <option value="all">{{ $t('admin.subscriptions.filterAll') }}</option>
              <option value="active">{{ $t('admin.subscriptions.filterActive') }}</option>
              <option value="canceled">{{ $t('admin.subscriptions.filterCanceled') }}</option>
              <option value="premium">{{ $t('admin.subscriptions.filterPremium') }}</option>
              <option value="basic">{{ $t('admin.subscriptions.filterBasic') }}</option>
            </select>
          </div>
        </div>
        
        <div class="data-table">
          <table>
            <thead>
              <tr>
                <th>{{ $t('admin.subscriptions.id') }}</th>
                <th>{{ $t('admin.subscriptions.user') }}</th>
                <th>{{ $t('admin.subscriptions.plan') }}</th>
                <th>{{ $t('admin.subscriptions.status') }}</th>
                <th>{{ $t('admin.subscriptions.startDate') }}</th>
                <th>{{ $t('admin.subscriptions.endDate') }}</th>
                <th>{{ $t('admin.subscriptions.amount') }}</th>
                <th>{{ $t('admin.subscriptions.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="subscription in filteredSubscriptions" :key="subscription.id">
                <td>{{ subscription.id }}</td>
                <td>{{ subscription.userName }}</td>
                <td>
                  <span class="plan-badge" :class="subscription.plan">
                    {{ $t(`admin.plans.${subscription.plan}`) }}
                  </span>
                </td>
                <td>
                  <span class="status-badge" :class="subscription.status">
                    {{ $t(`admin.subscriptions.status${subscription.status}`) }}
                  </span>
                </td>
                <td>{{ formatDate(subscription.startDate) }}</td>
                <td>{{ subscription.endDate ? formatDate(subscription.endDate) : '-' }}</td>
                <td>{{ formatCurrency(subscription.amount) }}</td>
                <td class="actions">
                  <button @click="editSubscription(subscription)" class="action-button edit">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="viewSubscriptionDetails(subscription)" class="action-button view">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button @click="cancelSubscription(subscription)" 
                          class="action-button cancel"
                          :disabled="subscription.status !== 'active'">
                    <i class="fas fa-ban"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="pagination">
          <button @click="prevSubscriptionPage" :disabled="currentSubscriptionPage === 1">
            <i class="fas fa-chevron-left"></i>
          </button>
          <span>{{ currentSubscriptionPage }} / {{ totalSubscriptionPages }}</span>
          <button @click="nextSubscriptionPage" :disabled="currentSubscriptionPage === totalSubscriptionPages">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </section>
      
      <!-- Design-Anpassungen -->
      <section v-if="currentSection === 'design'" class="admin-section">
        <h2>{{ $t('admin.design.title') }}</h2>
        
        <div class="design-editor">
          <div class="design-sidebar">
            <h3>{{ $t('admin.design.themes') }}</h3>
            <ul class="theme-list">
              <li v-for="(theme, index) in themes" :key="index" 
                  :class="{ active: currentTheme === theme.id }"
                  @click="previewTheme(theme.id)">
                <div class="theme-preview" :style="{ backgroundColor: theme.primaryColor }">
                  <div class="theme-color" :style="{ backgroundColor: theme.secondaryColor }"></div>
                  <div class="theme-color" :style="{ backgroundColor: theme.accentColor }"></div>
                </div>
                <span>{{ theme.name }}</span>
              </li>
            </ul>
            
            <h3>{{ $t('admin.design.customColors') }}</h3>
            <div class="color-picker">
              <div class="color-field">
                <label>{{ $t('admin.design.primaryColor') }}</label>
                <input type="color" v-model="customTheme.primaryColor" @change="updateCustomTheme">
              </div>
              <div class="color-field">
                <label>{{ $t('admin.design.secondaryColor') }}</label>
                <input type="color" v-model="customTheme.secondaryColor" @change="updateCustomTheme">
              </div>
              <div class="color-field">
                <label>{{ $t('admin.design.accentColor') }}</label>
                <input type="color" v-model="customTheme.accentColor" @change="updateCustomTheme">
              </div>
              <div class="color-field">
                <label>{{ $t('admin.design.textColor') }}</label>
                <input type="color" v-model="customTheme.textColor" @change="updateCustomTheme">
              </div>
              <div class="color-field">
                <label>{{ $t('admin.design.backgroundColor') }}</label>
                <input type="color" v-model="customTheme.backgroundColor" @change="updateCustomTheme">
              </div>
            </div>
            
            <h3>{{ $t('admin.design.typography') }}</h3>
            <div class="typography-settings">
              <div class="form-group">
                <label>{{ $t('admin.design.headingFont') }}</label>
                <select v-model="customTheme.headingFont" @change="updateCustomTheme">
                  <option v-for="font in fonts" :key="font" :value="font">{{ font }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>{{ $t('admin.design.bodyFont') }}</label>
                <select v-model="customTheme.bodyFont" @change="updateCustomTheme">
                  <option v-for="font in fonts" :key="font" :value="font">{{ font }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>{{ $t('admin.design.fontSize') }}</label>
                <input type="range" min="12" max="20" v-model.number="customTheme.fontSize" @change="updateCustomTheme">
                <span>{{ customTheme.fontSize }}px</span>
              </div>
            </div>
          </div>
          
          <div class="design-preview">
            <h3>{{ $t('admin.design.preview') }}</h3>
            <div class="preview-container" :style="previewStyles">
              <div class="preview-header">
                <div class="preview-logo">LemonVows</div>
                <div class="preview-nav">
                  <div class="preview-nav-item">Dashboard</div>
                  <div class="preview-nav-item">Gäste</div>
                  <div class="preview-nav-item">Tischplan</div>
                  <div class="preview-nav-item">Budget</div>
                </div>
              </div>
              
              <div class="preview-content">
                <h1 class="preview-heading">Willkommen bei LemonVows</h1>
                <p class="preview-text">Ihre Hochzeitsplanung leicht gemacht. Mit unseren Tools können Sie Ihre Traumhochzeit planen und organisieren.</p>
                
                <div class="preview-card">
                  <h2 class="preview-subheading">Hochzeits-Countdown</h2>
                  <div class="preview-countdown">125 Tage</div>
                </div>
                
                <div class="preview-button-group">
                  <button class="preview-button primary">Gäste hinzufügen</button>
                  <button class="preview-button secondary">Tischplan bearbeiten</button>
                </div>
              </div>
            </div>
            
            <div class="preview-actions">
              <button @click="resetTheme" class="button secondary">{{ $t('admin.design.reset') }}</button>
              <button @click="saveTheme" class="button primary">{{ $t('admin.design.saveTheme') }}</button>
              <button @click="applyTheme" class="button primary">{{ $t('admin.design.applyTheme') }}</button>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Einstellungen -->
      <section v-if="currentSection === 'settings'" class="admin-section">
        <h2>{{ $t('admin.settings.title') }}</h2>
        
        <div class="settings-container">
          <div class="settings-group">
            <h3>{{ $t('admin.settings.general') }}</h3>
            
            <div class="form-group">
              <label for="siteName">{{ $t('admin.settings.siteName') }}</label>
              <input type="text" id="siteName" v-model="settings.siteName">
            </div>
            
            <div class="form-group">
              <label for="siteDescription">{{ $t('admin.settings.siteDescription') }}</label>
              <textarea id="siteDescription" v-model="settings.siteDescription"></textarea>
            </div>
            
            <div class="form-group">
              <label for="contactEmail">{{ $t('admin.settings.contactEmail') }}</label>
              <input type="email" id="contactEmail" v-model="settings.contactEmail">
            </div>
            
            <div class="form-group">
              <label for="defaultLanguage">{{ $t('admin.settings.defaultLanguage') }}</label>
              <select id="defaultLanguage" v-model="settings.defaultLanguage">
                <option value="de">Deutsch</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>
          
          <div class="settings-group">
            <h3>{{ $t('admin.settings.payment') }}</h3>
            
            <div class="form-group">
              <label for="currency">{{ $t('admin.settings.currency') }}</label>
              <select id="currency" v-model="settings.currency">
                <option value="EUR">Euro (€)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="GBP">British Pound (£)</option>
                <option value="CHF">Swiss Franc (CHF)</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="stripeKey">{{ $t('admin.settings.stripeKey') }}</label>
              <input type="text" id="stripeKey" v-model="settings.stripeKey">
            </div>
            
            <div class="form-group">
              <label for="vatRate">{{ $t('admin.settings.vatRate') }}</label>
              <input type="number" id="vatRate" v-model.number="settings.vatRate" min="0" max="100">
            </div>
          </div>
          
          <div class="settings-group">
            <h3>{{ $t('admin.settings.email') }}</h3>
            
            <div class="form-group">
              <label for="smtpHost">{{ $t('admin.settings.smtpHost') }}</label>
              <input type="text" id="smtpHost" v-model="settings.smtpHost">
            </div>
            
            <div class="form-group">
              <label for="smtpPort">{{ $t('admin.settings.smtpPort') }}</label>
              <input type="number" id="smtpPort" v-model.number="settings.smtpPort">
            </div>
            
            <div class="form-group">
              <label for="smtpUser">{{ $t('admin.settings.smtpUser') }}</label>
              <input type="text" id="smtpUser" v-model="settings.smtpUser">
            </div>
            
            <div class="form-group">
              <label for="smtpPassword">{{ $t('admin.settings.smtpPassword') }}</label>
              <input type="password" id="smtpPassword" v-model="settings.smtpPassword">
            </div>
            
            <div class="form-group">
              <label for="emailSender">{{ $t('admin.settings.emailSender') }}</label>
              <input type="text" id="emailSender" v-model="settings.emailSender">
            </div>
          </div>
          
          <div class="settings-group">
            <h3>{{ $t('admin.settings.legal') }}</h3>
            
            <div class="form-group">
              <label for="privacyPolicy">{{ $t('admin.settings.privacyPolicy') }}</label>
              <textarea id="privacyPolicy" v-model="settings.privacyPolicy" rows="10"></textarea>
            </div>
            
            <div class="form-group">
              <label for="termsOfService">{{ $t('admin.settings.termsOfService') }}</label>
              <textarea id="termsOfService" v-model="settings.termsOfService" rows="10"></textarea>
            </div>
            
            <div class="form-group">
              <label for="imprint">{{ $t('admin.settings.imprint') }}</label>
              <textarea id="imprint" v-model="settings.imprint" rows="10"></textarea>
            </div>
          </div>
        </div>
        
        <div class="settings-actions">
          <button @click="resetSettings" class="button secondary">{{ $t('admin.settings.reset') }}</button>
          <button @click="saveSettings" class="button primary">{{ $t('admin.settings.save') }}</button>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: 'AdminDashboard',
  data() {
    return {
      currentLanguage: 'de',
      currentSection: 'dashboard',
      adminSections: [
        { id: 'dashboard', icon: 'fas fa-tachometer-alt' },
        { id: 'users', icon: 'fas fa-users' },
        { id: 'subscriptions', icon: 'fas fa-credit-card' },
        { id: 'design', icon: 'fas fa-palette' },
        { id: 'settings', icon: 'fas fa-cog' }
      ],
      
      // Dashboard Daten
      stats: {
        totalUsers: 0,
        userChange: 0,
        activeWeddings: 0,
        monthlyRevenue: 0,
        revenueChange: 0,
        conversionRate: 0
      },
      recentActivities: [],
      
      // Benutzer-Verwaltung
      users: [],
      userSearch: '',
      userFilter: 'all',
      currentPage: 1,
      itemsPerPage: 10,
      showUserModal: false,
      editingUser: {
        id: null,
        name: '',
        email: '',
        plan: 'free',
        status: 'active'
      },
      
      // Abonnement-Verwaltung
      subscriptions: [],
      subscriptionSearch: '',
      subscriptionFilter: 'all',
      currentSubscriptionPage: 1,
      
      // Design-Anpassungen
      themes: [
        {
          id: 'default',
          name: 'Standard',
          primaryColor: '#4CAF50',
          secondaryColor: '#2196F3',
          accentColor: '#FF9800',
          textColor: '#333333',
          backgroundColor: '#FFFFFF',
          headingFont: 'Roboto',
          bodyFont: 'Open Sans',
          fontSize: 16
        },
        {
          id: 'elegant',
          name: 'Elegant',
          primaryColor: '#9C27B0',
          secondaryColor: '#673AB7',
          accentColor: '#E91E63',
          textColor: '#212121',
          backgroundColor: '#F5F5F5',
          headingFont: 'Playfair Display',
          bodyFont: 'Lato',
          fontSize: 16
        },
        {
          id: 'modern',
          name: 'Modern',
          primaryColor: '#00BCD4',
          secondaryColor: '#009688',
          accentColor: '#FFC107',
          textColor: '#424242',
          backgroundColor: '#FAFAFA',
          headingFont: 'Montserrat',
          bodyFont: 'Roboto',
          fontSize: 16
        },
        {
          id: 'vintage',
          name: 'Vintage',
          primaryColor: '#795548',
          secondaryColor: '#607D8B',
          accentColor: '#FF5722',
          textColor: '#3E2723',
          backgroundColor: '#EFEBE9',
          headingFont: 'Libre Baskerville',
          bodyFont: 'Merriweather',
          fontSize: 16
        },
        {
          id: 'boho',
          name: 'Boho',
          primaryColor: '#8D6E63',
          secondaryColor: '#A1887F',
          accentColor: '#FFB74D',
          textColor: '#4E342E',
          backgroundColor: '#FFF8E1',
          headingFont: 'Amatic SC',
          bodyFont: 'Josefin Sans',
          fontSize: 16
        }
      ],
      currentTheme: 'default',
      customTheme: {
        primaryColor: '#4CAF50',
        secondaryColor: '#2196F3',
        accentColor: '#FF9800',
        textColor: '#333333',
        backgroundColor: '#FFFFFF',
        headingFont: 'Roboto',
        bodyFont: 'Open Sans',
        fontSize: 16
      },
      fonts: [
        'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Playfair Display', 
        'Merriweather', 'Libre Baskerville', 'Amatic SC', 'Josefin Sans',
        'Raleway', 'Nunito', 'Poppins', 'Source Sans Pro', 'Ubuntu'
      ],
      
      // Einstellungen
      settings: {
        siteName: 'LemonVows',
        siteDescription: 'Hochzeitsplanung leicht gemacht',
        contactEmail: 'kontakt@lemonvows.de',
        defaultLanguage: 'de',
        currency: 'EUR',
        stripeKey: '',
        vatRate: 19,
        smtpHost: '',
        smtpPort: 587,
        smtpUser: '',
        smtpPassword: '',
        emailSender: 'noreply@lemonvows.de',
        privacyPolicy: '',
        termsOfService: '',
        imprint: ''
      },
      
      // Charts
      userGrowthChart: null,
      revenueChart: null
    };
  },
  computed: {
    filteredUsers() {
      let result = this.users;
      
      // Suche
      if (this.userSearch) {
        const search = this.userSearch.toLowerCase();
        result = result.filter(user => 
          user.name.toLowerCase().includes(search) || 
          user.email.toLowerCase().includes(search)
        );
      }
      
      // Filter
      if (this.userFilter !== 'all') {
        result = result.filter(user => {
          if (this.userFilter === 'active' || this.userFilter === 'inactive') {
            return user.status === this.userFilter;
          } else {
            return user.plan === this.userFilter;
          }
        });
      }
      
      // Paginierung
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return result.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.users.length / this.itemsPerPage);
    },
    filteredSubscriptions() {
      let result = this.subscriptions;
      
      // Suche
      if (this.subscriptionSearch) {
        const search = this.subscriptionSearch.toLowerCase();
        result = result.filter(subscription => 
          subscription.id.toLowerCase().includes(search) || 
          subscription.userName.toLowerCase().includes(search)
        );
      }
      
      // Filter
      if (this.subscriptionFilter !== 'all') {
        result = result.filter(subscription => {
          if (this.subscriptionFilter === 'active' || this.subscriptionFilter === 'canceled') {
            return subscription.status === this.subscriptionFilter;
          } else {
            return subscription.plan === this.subscriptionFilter;
          }
        });
      }
      
      // Paginierung
      const start = (this.currentSubscriptionPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return result.slice(start, end);
    },
    totalSubscriptionPages() {
      return Math.ceil(this.subscriptions.length / this.itemsPerPage);
    },
    previewStyles() {
      const theme = this.currentTheme === 'custom' ? this.customTheme : this.themes.find(t => t.id === this.currentTheme);
      
      return {
        '--primary-color': theme.primaryColor,
        '--secondary-color': theme.secondaryColor,
        '--accent-color': theme.accentColor,
        '--text-color': theme.textColor,
        '--background-color': theme.backgroundColor,
        '--heading-font': `'${theme.headingFont}', sans-serif`,
        '--body-font': `'${theme.bodyFont}', sans-serif`,
        '--font-size': `${theme.fontSize}px`,
      };
    }
  },
  mounted() {
    this.loadData();
    this.initCharts();
  },
  methods: {
    async loadData() {
      try {
        // Dashboard-Daten laden
        const statsResponse = await fetch('/api/admin/stats');
        this.stats = await statsResponse.json();
        
        const activitiesResponse = await fetch('/api/admin/recent-activities');
        this.recentActivities = await activitiesResponse.json();
        
        // Benutzer laden
        const usersResponse = await fetch('/api/admin/users');
        this.users = await usersResponse.json();
        
        // Abonnements laden
        const subscriptionsResponse = await fetch('/api/admin/subscriptions');
        this.subscriptions = await subscriptionsResponse.json();
        
        // Einstellungen laden
        const settingsResponse = await fetch('/api/admin/settings');
        this.settings = await settingsResponse.json();
        
        // Charts aktualisieren
        this.updateCharts();
      } catch (error) {
        console.error('Fehler beim Laden der Admin-Daten:', error);
        // Fehlermeldung anzeigen
      }
    },
    
    initCharts() {
      // Benutzer-Wachstum Chart
      const userCtx = this.$refs.userGrowthChart.getContext('2d');
      this.userGrowthChart = new Chart(userCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun'],
          datasets: [{
            label: 'Neue Benutzer',
            data: [12, 19, 25, 31, 42, 50],
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
      
      // Umsatz Chart
      const revenueCtx = this.$refs.revenueChart.getContext('2d');
      this.revenueChart = new Chart(revenueCtx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun'],
          datasets: [{
            label: 'Umsatz (€)',
            data: [1200, 1900, 2500, 3100, 4200, 5000],
            backgroundColor: '#2196F3'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    },
    
    updateCharts() {
      // Charts mit aktuellen Daten aktualisieren
      if (this.userGrowthChart && this.revenueChart) {
        // Hier würden die Daten aus der API verwendet werden
        this.userGrowthChart.update();
        this.revenueChart.update();
      }
    },
    
    // Benutzer-Verwaltung
    searchUsers() {
      this.currentPage = 1;
    },
    
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    
    editUser(user) {
      this.editingUser = { ...user };
      this.showUserModal = true;
    },
    
    viewUserDetails(user) {
      // Benutzerdetails anzeigen
      console.log('Benutzerdetails anzeigen:', user);
    },
    
    async deleteUser(user) {
      if (confirm(this.$t('admin.users.confirmDelete'))) {
        try {
          const response = await fetch(`/api/admin/users/${user.id}`, {
            method: 'DELETE'
          });
          
          if (response.ok) {
            // Benutzer aus der Liste entfernen
            this.users = this.users.filter(u => u.id !== user.id);
            // Erfolgsmeldung anzeigen
          } else {
            // Fehlermeldung anzeigen
          }
        } catch (error) {
          console.error('Fehler beim Löschen des Benutzers:', error);
          // Fehlermeldung anzeigen
        }
      }
    },
    
    closeUserModal() {
      this.showUserModal = false;
      this.editingUser = {
        id: null,
        name: '',
        email: '',
        plan: 'free',
        status: 'active'
      };
    },
    
    async saveUser() {
      try {
        const method = this.editingUser.id ? 'PUT' : 'POST';
        const url = this.editingUser.id ? `/api/admin/users/${this.editingUser.id}` : '/api/admin/users';
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.editingUser)
        });
        
        if (response.ok) {
          const savedUser = await response.json();
          
          if (this.editingUser.id) {
            // Benutzer aktualisieren
            const index = this.users.findIndex(u => u.id === savedUser.id);
            if (index !== -1) {
              this.users.splice(index, 1, savedUser);
            }
          } else {
            // Neuen Benutzer hinzufügen
            this.users.push(savedUser);
          }
          
          this.closeUserModal();
          // Erfolgsmeldung anzeigen
        } else {
          // Fehlermeldung anzeigen
        }
      } catch (error) {
        console.error('Fehler beim Speichern des Benutzers:', error);
        // Fehlermeldung anzeigen
      }
    },
    
    // Abonnement-Verwaltung
    searchSubscriptions() {
      this.currentSubscriptionPage = 1;
    },
    
    prevSubscriptionPage() {
      if (this.currentSubscriptionPage > 1) {
        this.currentSubscriptionPage--;
      }
    },
    
    nextSubscriptionPage() {
      if (this.currentSubscriptionPage < this.totalSubscriptionPages) {
        this.currentSubscriptionPage++;
      }
    },
    
    editSubscription(subscription) {
      // Abonnement bearbeiten
      console.log('Abonnement bearbeiten:', subscription);
    },
    
    viewSubscriptionDetails(subscription) {
      // Abonnementdetails anzeigen
      console.log('Abonnementdetails anzeigen:', subscription);
    },
    
    async cancelSubscription(subscription) {
      if (confirm(this.$t('admin.subscriptions.confirmCancel'))) {
        try {
          const response = await fetch(`/api/admin/subscriptions/${subscription.id}/cancel`, {
            method: 'POST'
          });
          
          if (response.ok) {
            // Abonnement in der Liste aktualisieren
            const index = this.subscriptions.findIndex(s => s.id === subscription.id);
            if (index !== -1) {
              this.subscriptions[index].status = 'canceled';
              this.subscriptions[index].endDate = new Date().toISOString();
            }
            // Erfolgsmeldung anzeigen
          } else {
            // Fehlermeldung anzeigen
          }
        } catch (error) {
          console.error('Fehler beim Kündigen des Abonnements:', error);
          // Fehlermeldung anzeigen
        }
      }
    },
    
    // Design-Anpassungen
    previewTheme(themeId) {
      this.currentTheme = themeId;
      
      if (themeId !== 'custom') {
        const theme = this.themes.find(t => t.id === themeId);
        this.customTheme = { ...theme };
      }
    },
    
    updateCustomTheme() {
      this.currentTheme = 'custom';
    },
    
    resetTheme() {
      const defaultTheme = this.themes.find(t => t.id === 'default');
      this.customTheme = { ...defaultTheme };
      this.currentTheme = 'default';
    },
    
    async saveTheme() {
      try {
        const response = await fetch('/api/admin/themes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: 'custom',
            ...this.customTheme
          })
        });
        
        if (response.ok) {
          // Erfolgsmeldung anzeigen
        } else {
          // Fehlermeldung anzeigen
        }
      } catch (error) {
        console.error('Fehler beim Speichern des Themes:', error);
        // Fehlermeldung anzeigen
      }
    },
    
    async applyTheme() {
      try {
        const theme = this.currentTheme === 'custom' ? this.customTheme : this.themes.find(t => t.id === this.currentTheme);
        
        const response = await fetch('/api/admin/apply-theme', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            themeId: this.currentTheme,
            theme
          })
        });
        
        if (response.ok) {
          // Erfolgsmeldung anzeigen
        } else {
          // Fehlermeldung anzeigen
        }
      } catch (error) {
        console.error('Fehler beim Anwenden des Themes:', error);
        // Fehlermeldung anzeigen
      }
    },
    
    // Einstellungen
    resetSettings() {
      // Einstellungen auf Standardwerte zurücksetzen
      this.loadData();
    },
    
    async saveSettings() {
      try {
        const response = await fetch('/api/admin/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.settings)
        });
        
        if (response.ok) {
          // Erfolgsmeldung anzeigen
        } else {
          // Fehlermeldung anzeigen
        }
      } catch (error) {
        console.error('Fehler beim Speichern der Einstellungen:', error);
        // Fehlermeldung anzeigen
      }
    },
    
    // Allgemeine Funktionen
    changeLanguage() {
      this.$i18n.locale = this.currentLanguage;
    },
    
    logout() {
      // Benutzer ausloggen
      this.$router.push('/login');
    },
    
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    
    formatTime(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    },
    
    formatCurrency(amount) {
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
      }).format(amount);
    }
  }
};
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: var(--body-font, 'Roboto', sans-serif);
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--primary-color, #4CAF50);
  color: white;
}

.admin-controls {
  display: flex;
  gap: 1rem;
}

.admin-controls select {
  padding: 0.5rem;
  border-radius: 4px;
  border: none;
}

.logout-button {
  padding: 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

.logout-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.admin-sidebar {
  width: 250px;
  background-color: #f5f5f5;
  padding: 1rem 0;
  position: fixed;
  top: 64px;
  bottom: 0;
  left: 0;
}

.admin-sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.admin-sidebar li {
  padding: 1rem 2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.admin-sidebar li:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.admin-sidebar li.active {
  background-color: var(--primary-color, #4CAF50);
  color: white;
}

.admin-content {
  margin-left: 250px;
  padding: 2rem;
  flex: 1;
  overflow-y: auto;
}

.admin-section {
  margin-bottom: 2rem;
}

.admin-section h2 {
  margin-bottom: 1.5rem;
  color: var(--primary-color, #4CAF50);
  font-family: var(--heading-font, 'Roboto', sans-serif);
}

/* Dashboard Styles */
.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.stat-card h3 {
  margin-top: 0;
  color: #666;
  font-size: 1rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  margin: 0.5rem 0;
}

.stat-change {
  font-size: 0.9rem;
}

.stat-change.positive {
  color: var(--primary-color, #4CAF50);
}

.stat-change.negative {
  color: #F44336;
}

.dashboard-charts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-container {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  height: 300px;
}

.chart-container h3 {
  margin-top: 0;
  color: #666;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.recent-activity {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.recent-activity h3 {
  margin-top: 0;
  color: #666;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.activity-icon.user {
  background-color: var(--primary-color, #4CAF50);
  color: white;
}

.activity-icon.payment {
  background-color: var(--secondary-color, #2196F3);
  color: white;
}

.activity-icon.system {
  background-color: var(--accent-color, #FF9800);
  color: white;
}

.activity-details {
  flex: 1;
}

.activity-message {
  margin-bottom: 0.25rem;
}

.activity-time {
  font-size: 0.8rem;
  color: #999;
}

/* Data Table Styles */
.section-controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.search-box {
  display: flex;
  align-items: center;
}

.search-box input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  width: 300px;
}

.search-box button {
  padding: 0.5rem 1rem;
  background-color: var(--primary-color, #4CAF50);
  border: none;
  border-radius: 0 4px 4px 0;
  color: white;
  cursor: pointer;
}

.filter-controls select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.data-table {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.data-table table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  text-align: left;
  padding: 1rem;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.data-table td {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.plan-badge, .status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.plan-badge.free {
  background-color: #E0E0E0;
  color: #616161;
}

.plan-badge.basic {
  background-color: #BBDEFB;
  color: #1976D2;
}

.plan-badge.premium {
  background-color: #FFD54F;
  color: #F57F17;
}

.status-badge.active {
  background-color: #C8E6C9;
  color: #388E3C;
}

.status-badge.inactive, .status-badge.canceled {
  background-color: #FFCDD2;
  color: #D32F2F;
}

.status-badge.suspended {
  background-color: #FFE0B2;
  color: #E65100;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-button.edit {
  background-color: var(--primary-color, #4CAF50);
  color: white;
}

.action-button.view {
  background-color: var(--secondary-color, #2196F3);
  color: white;
}

.action-button.delete, .action-button.cancel {
  background-color: #F44336;
  color: white;
}

.action-button:disabled {
  background-color: #E0E0E0;
  color: #9E9E9E;
  cursor: not-allowed;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.pagination button {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination button:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

/* Modal Styles */
.modal {
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

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-body {
  padding: 1rem;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

/* Form Styles */
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input, .form-group select, .form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.button.primary {
  background-color: var(--primary-color, #4CAF50);
  color: white;
}

.button.secondary {
  background-color: #E0E0E0;
  color: #616161;
}

/* Design Editor Styles */
.design-editor {
  display: flex;
  gap: 2rem;
}

.design-sidebar {
  width: 300px;
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.design-sidebar h3 {
  margin-top: 0;
  color: #666;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.theme-list {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
}

.theme-list li {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.theme-list li:hover {
  background-color: #f5f5f5;
}

.theme-list li.active {
  background-color: var(--primary-color, #4CAF50);
  color: white;
}

.theme-preview {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin-right: 1rem;
  display: flex;
  flex-direction: column;
}

.theme-color {
  flex: 1;
  border-radius: 2px;
  margin: 2px;
}

.color-picker {
  margin-bottom: 2rem;
}

.color-field {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.color-field label {
  flex: 1;
}

.color-field input {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.typography-settings {
  margin-bottom: 2rem;
}

.design-preview {
  flex: 1;
}

.preview-container {
  background-color: var(--background-color, white);
  color: var(--text-color, #333);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.preview-logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color, #4CAF50);
  font-family: var(--heading-font, 'Roboto', sans-serif);
}

.preview-nav {
  display: flex;
  gap: 1.5rem;
}

.preview-nav-item {
  cursor: pointer;
}

.preview-nav-item:hover {
  color: var(--primary-color, #4CAF50);
}

.preview-heading {
  font-family: var(--heading-font, 'Roboto', sans-serif);
  color: var(--primary-color, #4CAF50);
  margin-bottom: 1rem;
}

.preview-text {
  font-family: var(--body-font, 'Open Sans', sans-serif);
  margin-bottom: 2rem;
}

.preview-card {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.preview-subheading {
  font-family: var(--heading-font, 'Roboto', sans-serif);
  color: var(--secondary-color, #2196F3);
  margin-top: 0;
  margin-bottom: 1rem;
}

.preview-countdown {
  font-size: 2rem;
  font-weight: bold;
  color: var(--accent-color, #FF9800);
}

.preview-button-group {
  display: flex;
  gap: 1rem;
}

.preview-button {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-family: var(--body-font, 'Open Sans', sans-serif);
}

.preview-button.primary {
  background-color: var(--primary-color, #4CAF50);
  color: white;
}

.preview-button.secondary {
  background-color: var(--secondary-color, #2196F3);
  color: white;
}

.preview-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

/* Settings Styles */
.settings-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.settings-group {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.settings-group h3 {
  margin-top: 0;
  color: #666;
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.settings-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
</style>
