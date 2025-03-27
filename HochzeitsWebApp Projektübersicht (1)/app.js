import { AuthManager } from './auth.js';
import { RSVPManager } from './rsvp.js';
import { BudgetPlanner } from './budget.js';
import { TablePlanner } from './table-planner.js';
import { AdminDashboard } from './admin.js';

class LemonVowsApp {
  constructor(config = {}) {
    this.config = {
      auth: true,
      rsvp: true,
      budget: true,
      tables: true,
      admin: false,
      ...config
    };

    this.initApp();
  }

  initApp() {
    if (this.config.auth) this.auth = new AuthManager();
    
    // Nach erfolgreicher Authentifizierung
    document.addEventListener('auth:success', () => {
      if (this.config.rsvp) this.rsvp = new RSVPManager();
      if (this.config.budget) this.budget = new BudgetPlanner();
      if (this.config.tables) this.tables = new TablePlanner();
      if (this.config.admin) this.admin = new AdminDashboard();
    });
  }
}

// Beispielkonfiguration für Manus:
/*
const app = new LemonVowsApp({
  auth: true,
  rsvp: true,
  budget: true,
  tables: true,
  admin: true
});
*/