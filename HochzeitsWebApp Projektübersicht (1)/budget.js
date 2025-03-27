import { supabase } from './supabase-client.js';
import { ErrorHandler } from './error-handler.js';

class BudgetPlanner {
  constructor() {
    this.categories = [];
    this.totalBudget = 0;
    this.initBudgetUI();
    this.loadCategories();
  }

  async loadCategories() {
    const { data, error } = await supabase
      .from('budget_categories')
      .select('*');

    if (error) {
      ErrorHandler.handleDBError(error);
      return;
    }

    this.categories = data;
    this.calculateTotal();
    this.renderCategories();
  }

  calculateTotal() {
    this.totalBudget = this.categories.reduce(
      (sum, cat) => sum + (cat.amount || 0), 0
    );
  }

  renderCategories() {
    const list = document.getElementById('categoryList');
    list.innerHTML = this.categories.map(cat => `
      <li class="category-item">
        <span>${cat.name}</span>
        <span>${cat.amount}€</span>
      </li>
    `).join('');

    document.getElementById('totalAmount').textContent = this.totalBudget;
  }

  async addCategory() {
    const nameInput = document.getElementById('categoryName');
    const amountInput = document.getElementById('categoryAmount');

    if (!nameInput.value || !amountInput.value) {
      ErrorHandler.showError(nameInput, 'Bitte alle Felder ausfüllen');
      return;
    }

    const newCategory = {
      name: nameInput.value,
      amount: parseFloat(amountInput.value),
      wedding_id: 'WEDDING_ID' // Für Manus: Dynamisch setzen
    };

    const { error } = await supabase
      .from('budget_categories')
      .insert([newCategory]);

    if (error) {
      ErrorHandler.handleDBError(error);
    } else {
      this.loadCategories();
      nameInput.value = '';
      amountInput.value = '';
    }
  }
}