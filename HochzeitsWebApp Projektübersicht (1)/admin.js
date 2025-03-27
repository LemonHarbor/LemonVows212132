class AdminDashboard {
  constructor() {
    this.initUI();
    this.loadWeddingData();
  }

  initUI() {
    const adminHTML = `
      <div class="admin-container">
        <h2>Admin Dashboard</h2>
        <div class="admin-tabs">
          <button class="tab-button active" data-tab="overview">Übersicht</button>
          <button class="tab-button" data-tab="guests">Gäste</button>
          <button class="tab-button" data-tab="settings">Einstellungen</button>
        </div>
        
        <div id="adminContent" class="admin-content">
          <!-- Inhalte werden dynamisch geladen -->
        </div>
      </div>
    `;
    document.getElementById('manus-custom-area').insertAdjacentHTML('beforeend', adminHTML);
    this.setupTabNavigation();
  }

  setupTabNavigation() {
    document.querySelectorAll('.tab-button').forEach(button => {
      button.addEventListener('click', () => {
        const tabName = button.dataset.tab;
        this.loadTabContent(tabName);
        document.querySelectorAll('.tab-button').forEach(btn => 
          btn.classList.remove('active'));
        button.classList.add('active');
      });
    });
  }

  async loadWeddingData() {
    /* Für Manus:
    1. Hochzeitsdaten von Supabase laden
    2. Statistiken berechnen
    */
    this.loadTabContent('overview');
  }

  loadTabContent(tabName) {
    const contentDiv = document.getElementById('adminContent');
    
    switch(tabName) {
      case 'overview':
        contentDiv.innerHTML = `
          <div class="stats-container">
            <div class="stat-card">
              <h3>Gäste</h3>
              <p>25 / 100</p>
            </div>
            <div class="stat-card">
              <h3>Budget</h3>
              <p>5.000€ / 15.000€</p>
            </div>
            <!-- Für Manus: Weitere Statistiken -->
          </div>
        `;
        break;
        
      case 'guests':
        contentDiv.innerHTML = `<p>Gästeliste wird geladen...</p>`;
        break;
        
      case 'settings':
        contentDiv.innerHTML = `<p>Einstellungen werden geladen...</p>`;
        break;
    }
  }
}