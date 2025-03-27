<template>
  <div class="budget-planner">
    <div class="budget-planner__header">
      <h1>{{ $t('budgetPlanner.title') }}</h1>
      <p>{{ $t('budgetPlanner.description') }}</p>
      
      <div class="budget-planner__controls">
        <button class="btn btn-primary" @click="showAddItemModal">
          <i class="icon icon-plus"></i> {{ $t('budgetPlanner.addItem') }}
        </button>
        <button class="btn btn-secondary" @click="exportBudget">
          <i class="icon icon-download"></i> {{ $t('budgetPlanner.export') }}
        </button>
      </div>
    </div>
    
    <div class="budget-planner__content">
      <div class="budget-planner__overview">
        <div class="budget-planner__total-card">
          <div class="budget-planner__total-header">
            <h3>{{ $t('budgetPlanner.totalBudget') }}</h3>
            <button class="btn-icon" @click="showEditBudgetModal">
              <i class="icon icon-edit"></i>
            </button>
          </div>
          <div class="budget-planner__total-amount">{{ formatCurrency(totalBudget) }}</div>
          <div class="budget-planner__progress-container">
            <div class="budget-planner__progress-bar">
              <div 
                class="budget-planner__progress-fill" 
                :style="{ width: `${getBudgetPercentage()}%`, backgroundColor: getBudgetStatusColor() }"
              ></div>
            </div>
            <div class="budget-planner__progress-labels">
              <div class="budget-planner__progress-spent">
                {{ $t('budgetPlanner.spent') }}: {{ formatCurrency(totalSpent) }}
              </div>
              <div class="budget-planner__progress-remaining">
                {{ $t('budgetPlanner.remaining') }}: {{ formatCurrency(totalRemaining) }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="budget-planner__charts">
          <div class="budget-planner__chart-card">
            <h3>{{ $t('budgetPlanner.spendingByCategory') }}</h3>
            <div class="budget-planner__chart-container">
              <canvas ref="categoryChart"></canvas>
            </div>
          </div>
          
          <div class="budget-planner__chart-card">
            <h3>{{ $t('budgetPlanner.plannedVsActual') }}</h3>
            <div class="budget-planner__chart-container">
              <canvas ref="comparisonChart"></canvas>
            </div>
          </div>
        </div>
      </div>
      
      <div class="budget-planner__categories">
        <div class="budget-planner__filters">
          <div class="budget-planner__search">
            <input 
              type="text" 
              v-model="search" 
              :placeholder="$t('budgetPlanner.searchItems')" 
            />
          </div>
          
          <div class="budget-planner__filter-group">
            <label>{{ $t('budgetPlanner.filterByCategory') }}</label>
            <select v-model="categoryFilter">
              <option value="all">{{ $t('budgetPlanner.allCategories') }}</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <div class="budget-planner__filter-group">
            <label>{{ $t('budgetPlanner.filterByStatus') }}</label>
            <select v-model="statusFilter">
              <option value="all">{{ $t('budgetPlanner.allStatuses') }}</option>
              <option value="paid">{{ $t('budgetPlanner.paid') }}</option>
              <option value="unpaid">{{ $t('budgetPlanner.unpaid') }}</option>
            </select>
          </div>
        </div>
        
        <div v-for="category in filteredCategories" :key="category" class="budget-planner__category">
          <div class="budget-planner__category-header" @click="toggleCategory(category)">
            <div class="budget-planner__category-name">
              <i :class="expandedCategories.includes(category) ? 'icon-chevron-down' : 'icon-chevron-right'"></i>
              {{ category }}
            </div>
            <div class="budget-planner__category-summary">
              <div class="budget-planner__category-amount">
                {{ formatCurrency(getCategoryTotal(category, 'actual')) }} / {{ formatCurrency(getCategoryTotal(category, 'estimated')) }}
              </div>
              <div 
                class="budget-planner__category-status"
                :class="{ 'over-budget': isCategoryOverBudget(category) }"
              >
                {{ isCategoryOverBudget(category) ? $t('budgetPlanner.overBudget') : $t('budgetPlanner.withinBudget') }}
              </div>
            </div>
          </div>
          
          <div v-if="expandedCategories.includes(category)" class="budget-planner__category-items">
            <table class="budget-planner__items-table">
              <thead>
                <tr>
                  <th>{{ $t('budgetPlanner.description') }}</th>
                  <th>{{ $t('budgetPlanner.estimatedCost') }}</th>
                  <th>{{ $t('budgetPlanner.actualCost') }}</th>
                  <th>{{ $t('budgetPlanner.vendor') }}</th>
                  <th>{{ $t('budgetPlanner.status') }}</th>
                  <th>{{ $t('budgetPlanner.actions') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in getFilteredItemsByCategory(category)" :key="item.id">
                  <td>{{ item.description }}</td>
                  <td>{{ formatCurrency(item.estimated_cost) }}</td>
                  <td>{{ formatCurrency(item.actual_cost) }}</td>
                  <td>{{ item.vendor || '-' }}</td>
                  <td>
                    <span :class="`status-badge ${item.paid ? 'status-paid' : 'status-unpaid'}`">
                      {{ item.paid ? $t('budgetPlanner.paid') : $t('budgetPlanner.unpaid') }}
                    </span>
                  </td>
                  <td>
                    <div class="budget-planner__item-actions">
                      <button class="btn-icon" @click="editItem(item.id)">
                        <i class="icon icon-edit"></i>
                      </button>
                      <button class="btn-icon" @click="deleteItem(item.id)">
                        <i class="icon icon-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="getFilteredItemsByCategory(category).length === 0">
                  <td colspan="6" class="empty-state">
                    {{ $t('budgetPlanner.noItemsFound') }}
                  </td>
                </tr>
              </tbody>
            </table>
            
            <button class="btn btn-secondary btn-small" @click="showAddItemModal(category)">
              <i class="icon icon-plus"></i> {{ $t('budgetPlanner.addItemToCategory', { category }) }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Budget Item Modal -->
    <div class="modal" v-if="showItemModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isEditMode ? $t('budgetPlanner.editItem') : $t('budgetPlanner.addItem') }}</h3>
          <button class="btn-icon" @click="closeItemModal">
            <i class="icon icon-x"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>{{ $t('budgetPlanner.category') }} *</label>
            <select v-model="itemForm.category" required>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
              <option value="new">{{ $t('budgetPlanner.newCategory') }}</option>
            </select>
          </div>
          
          <div class="form-group" v-if="itemForm.category === 'new'">
            <label>{{ $t('budgetPlanner.newCategoryName') }} *</label>
            <input type="text" v-model="newCategory" required />
          </div>
          
          <div class="form-group">
            <label>{{ $t('budgetPlanner.description') }} *</label>
            <input type="text" v-model="itemForm.description" required />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>{{ $t('budgetPlanner.estimatedCost') }} *</label>
              <div class="input-with-currency">
                <span class="currency-symbol">{{ currencySymbol }}</span>
                <input type="number" v-model="itemForm.estimated_cost" min="0" step="0.01" required />
              </div>
            </div>
            
            <div class="form-group">
              <label>{{ $t('budgetPlanner.actualCost') }}</label>
              <div class="input-with-currency">
                <span class="currency-symbol">{{ currencySymbol }}</span>
                <input type="number" v-model="itemForm.actual_cost" min="0" step="0.01" />
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label>{{ $t('budgetPlanner.vendor') }}</label>
            <input type="text" v-model="itemForm.vendor" />
          </div>
          
          <div class="form-group checkbox-group">
            <label>
              <input type="checkbox" v-model="itemForm.paid" />
              {{ $t('budgetPlanner.markAsPaid') }}
            </label>
          </div>
          
          <div class="form-group" v-if="itemForm.paid">
            <label>{{ $t('budgetPlanner.paymentDate') }}</label>
            <input type="date" v-model="itemForm.payment_date" />
          </div>
          
          <div class="form-group">
            <label>{{ $t('budgetPlanner.notes') }}</label>
            <textarea v-model="itemForm.notes" rows="3"></textarea>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeItemModal">
            {{ $t('budgetPlanner.cancel') }}
          </button>
          <button class="btn btn-primary" @click="saveItem" :disabled="!isItemFormValid">
            {{ $t('budgetPlanner.save') }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Edit Total Budget Modal -->
    <div class="modal" v-if="showBudgetModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ $t('budgetPlanner.editTotalBudget') }}</h3>
          <button class="btn-icon" @click="closeBudgetModal">
            <i class="icon icon-x"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>{{ $t('budgetPlanner.totalBudget') }} *</label>
            <div class="input-with-currency">
              <span class="currency-symbol">{{ currencySymbol }}</span>
              <input type="number" v-model="budgetForm.total" min="0" step="0.01" required />
            </div>
          </div>
          
          <div class="form-group">
            <label>{{ $t('budgetPlanner.currency') }}</label>
            <select v-model="budgetForm.currency">
              <option value="EUR">€ (Euro)</option>
              <option value="USD">$ (US Dollar)</option>
              <option value="GBP">£ (British Pound)</option>
              <option value="CHF">CHF (Swiss Franc)</option>
            </select>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeBudgetModal">
            {{ $t('budgetPlanner.cancel') }}
          </button>
          <button class="btn btn-primary" @click="saveTotalBudget" :disabled="!budgetForm.total">
            {{ $t('budgetPlanner.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BudgetPlanner',
  
  data() {
    return {
      // Budget data
      totalBudget: 15000,
      currency: 'EUR',
      budgetItems: [],
      
      // UI state
      expandedCategories: [],
      search: '',
      categoryFilter: 'all',
      statusFilter: 'all',
      
      // Add/Edit Item Modal
      showItemModal: false,
      isEditMode: false,
      itemForm: this.getEmptyItemForm(),
      newCategory: '',
      
      // Edit Budget Modal
      showBudgetModal: false,
      budgetForm: {
        total: 0,
        currency: 'EUR'
      },
      
      // Chart instances
      categoryChart: null,
      comparisonChart: null
    };
  },
  
  computed: {
    categories() {
      const categories = [...new Set(this.budgetItems.map(item => item.category))];
      return categories.sort();
    },
    
    filteredCategories() {
      if (this.categoryFilter !== 'all') {
        return [this.categoryFilter];
      }
      
      const filteredItems = this.getFilteredItems();
      const categories = [...new Set(filteredItems.map(item => item.category))];
      return categories.sort();
    },
    
    totalSpent() {
      return this.budgetItems.reduce((sum, item) => sum + (item.actual_cost || 0), 0);
    },
    
    totalRemaining() {
      return this.totalBudget - this.totalSpent;
    },
    
    currencySymbol() {
      switch (this.currency) {
        case 'EUR': return '€';
        case 'USD': return '$';
        case 'GBP': return '£';
        case 'CHF': return 'CHF';
        default: return '€';
      }
    },
    
    isItemFormValid() {
      const category = this.itemForm.category === 'new' ? this.newCategory.trim() : this.itemForm.category;
      return (
        category !== '' &&
        this.itemForm.description.trim() !== '' &&
        this.itemForm.estimated_cost > 0
      );
    }
  },
  
  mounted() {
    // Load data from Supabase
    this.loadBudgetData();
    
    // Initialize charts after DOM is updated
    this.$nextTick(() => {
      this.initCharts();
    });
  },
  
  methods: {
    // Data loading methods
    async loadBudgetData() {
      try {
        // This would be replaced with actual Supabase query
        // const { data: budgetData, error: budgetError } = await this.$supabase
        //   .from('weddings')
        //   .select('budget_total, currency')
        //   .eq('id', this.weddingId)
        //   .single();
        
        // if (budgetData) {
        //   this.totalBudget = budgetData.budget_total;
        //   this.currency = budgetData.currency;
        // }
        
        // const { data: items, error: itemsError } = await this.$supabase
        //   .from('budget_items')
        //   .select('*')
        //   .eq('wedding_id', this.weddingId);
        
        // if (items) {
        //   this.budgetItems = items;
        // }
        
        // For demo purposes, we'll use mock data
        this.totalBudget = 15000;
        this.currency = 'EUR';
        
        this.budgetItems = [
          {
            id: '1',
            category: 'Location',
            description: 'Hochzeitslocation inkl. Catering',
            estimated_cost: 6000,
            actual_cost: 6500,
            vendor: 'Schloss Schönbrunn',
            paid: true,
            payment_date: '2025-01-15',
            notes: 'Anzahlung von 2000€ bereits geleistet'
          },
          {
            id: '2',
            category: 'Location',
            description: 'Dekoration',
            estimated_cost: 800,
            actual_cost: 750,
            vendor: 'Blumen Meyer',
            paid: true,
            payment_date: '2025-02-20',
            notes: ''
          },
          {
            id: '3',
            category: 'Kleidung',
            description: 'Brautkleid',
            estimated_cost: 2000,
            actual_cost: 2200,
            vendor: 'Brautmoden Müller',
            paid: true,
            payment_date: '2024-12-10',
            notes: 'Inkl. Änderungen'
          },
          {
            id: '4',
            category: 'Kleidung',
            description: 'Anzug Bräutigam',
            estimated_cost: 800,
            actual_cost: 850,
            vendor: 'Herrenausstatter Schmidt',
            paid: true,
            payment_date: '2025-01-05',
            notes: ''
          },
          {
            id: '5',
            category: 'Musik',
            description: 'DJ',
            estimated_cost: 1200,
            actual_cost: 1200,
            vendor: 'DJ Soundmaster',
            paid: false,
            payment_date: null,
            notes: 'Anzahlung von 300€ geleistet'
          },
          {
            id: '6',
            category: 'Fotografie',
            description: 'Fotograf',
            estimated_cost: 1800,
            actual_cost: 1800,
            vendor: 'Lichtblick Fotografie',
            paid: false,
            payment_date: null,
            notes: 'Anzahlung von 500€ geleistet'
          },
          {
            id: '7',
            category: 'Ringe',
            description: 'Eheringe',
            estimated_cost: 1000,
            actual_cost: 1100,
            vendor: 'Juwelier Gold',
            paid: true,
            payment_date: '2025-02-01',
            notes: 'Inkl. Gravur'
          },
          {
            id: '8',
            category: 'Papeterie',
            description: 'Einladungen',
            estimated_cost: 400,
            actual_cost: 380,
            vendor: 'Druckerei Weber',
            paid: true,
            payment_date: '2024-11-15',
            notes: ''
          },
          {
            id: '9',
            category: 'Transport',
            description: 'Hochzeitsauto',
            estimated_cost: 500,
            actual_cost: null,
            vendor: 'Oldtimer-Vermietung',
            paid: false,
            payment_date: null,
            notes: ''
          }
        ];
        
        // Expand all categories by default
        this.expandedCategories = [...this.categories];
        
      } catch (error) {
        console.error('Error loading budget data:', error);
      }
    },
    
    // Chart methods
    initCharts() {
      this.initCategoryChart();
      this.initComparisonChart();
    },
    
    initCategoryChart() {
      const ctx = this.$refs.categoryChart.getContext('2d');
      
      // Prepare data for category chart
      const categoryData = this.prepareCategoryChartData();
      
      this.categoryChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: categoryData.labels,
          datasets: [{
            data: categoryData.data,
            backgroundColor: [
              '#FFD166', // Yellow
              '#EF476F', // Pink
              '#06D6A0', // Green
              '#118AB2', // Blue
              '#073B4C', // Dark Blue
              '#F78C6B', // Orange
              '#B5D99C', // Light Green
              '#9B5DE5', // Purple
              '#F15BB5', // Magenta
              '#00BBF9'  // Light Blue
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                boxWidth: 15,
                padding: 15
              }
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const percentage = ((value / this.totalSpent) * 100).toFixed(1);
                  return `${label}: ${this.formatCurrency(value)} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    },
    
    initComparisonChart() {
      const ctx = this.$refs.comparisonChart.getContext('2d');
      
      // Prepare data for comparison chart
      const comparisonData = this.prepareComparisonChartData();
      
      this.comparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: comparisonData.labels,
          datasets: [
            {
              label: this.$t('budgetPlanner.estimated'),
              data: comparisonData.estimated,
              backgroundColor: '#FFD166',
              borderColor: '#FFD166',
              borderWidth: 1
            },
            {
              label: this.$t('budgetPlanner.actual'),
              data: comparisonData.actual,
              backgroundColor: '#EF476F',
              borderColor: '#EF476F',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => this.formatCurrency(value, false)
              }
            }
          },
          plugins: {
            legend: {
              position: 'top'
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.dataset.label || '';
                  const value = context.raw || 0;
                  return `${label}: ${this.formatCurrency(value)}`;
                }
              }
            }
          }
        }
      });
    },
    
    prepareCategoryChartData() {
      const categoryTotals = {};
      
      // Calculate total actual cost for each category
      this.budgetItems.forEach(item => {
        const actualCost = item.actual_cost || 0;
        if (actualCost > 0) {
          if (!categoryTotals[item.category]) {
            categoryTotals[item.category] = 0;
          }
          categoryTotals[item.category] += actualCost;
        }
      });
      
      // Sort categories by total cost (descending)
      const sortedCategories = Object.keys(categoryTotals).sort((a, b) => 
        categoryTotals[b] - categoryTotals[a]
      );
      
      return {
        labels: sortedCategories,
        data: sortedCategories.map(category => categoryTotals[category])
      };
    },
    
    prepareComparisonChartData() {
      const categories = this.categories;
      const estimated = [];
      const actual = [];
      
      // Calculate total estimated and actual costs for each category
      categories.forEach(category => {
        const categoryItems = this.budgetItems.filter(item => item.category === category);
        
        const estimatedTotal = categoryItems.reduce((sum, item) => sum + item.estimated_cost, 0);
        const actualTotal = categoryItems.reduce((sum, item) => sum + (item.actual_cost || 0), 0);
        
        estimated.push(estimatedTotal);
        actual.push(actualTotal);
      });
      
      return {
        labels: categories,
        estimated,
        actual
      };
    },
    
    updateCharts() {
      if (this.categoryChart) {
        const categoryData = this.prepareCategoryChartData();
        this.categoryChart.data.labels = categoryData.labels;
        this.categoryChart.data.datasets[0].data = categoryData.data;
        this.categoryChart.update();
      }
      
      if (this.comparisonChart) {
        const comparisonData = this.prepareComparisonChartData();
        this.comparisonChart.data.labels = comparisonData.labels;
        this.comparisonChart.data.datasets[0].data = comparisonData.estimated;
        this.comparisonChart.data.datasets[1].data = comparisonData.actual;
        this.comparisonChart.update();
      }
    },
    
    // Budget item methods
    getFilteredItems() {
      let result = [...this.budgetItems];
      
      // Apply search filter
      if (this.search) {
        const searchLower = this.search.toLowerCase();
        result = result.filter(item => 
          item.description.toLowerCase().includes(searchLower) ||
          item.category.toLowerCase().includes(searchLower) ||
          (item.vendor && item.vendor.toLowerCase().includes(searchLower)) ||
          (item.notes && item.notes.toLowerCase().includes(searchLower))
        );
      }
      
      // Apply category filter
      if (this.categoryFilter !== 'all') {
        result = result.filter(item => item.category === this.categoryFilter);
      }
      
      // Apply status filter
      if (this.statusFilter !== 'all') {
        result = result.filter(item => 
          (this.statusFilter === 'paid' && item.paid) || 
          (this.statusFilter === 'unpaid' && !item.paid)
        );
      }
      
      return result;
    },
    
    getFilteredItemsByCategory(category) {
      return this.getFilteredItems().filter(item => item.category === category);
    },
    
    getCategoryTotal(category, type) {
      const categoryItems = this.budgetItems.filter(item => item.category === category);
      
      if (type === 'estimated') {
        return categoryItems.reduce((sum, item) => sum + item.estimated_cost, 0);
      } else {
        return categoryItems.reduce((sum, item) => sum + (item.actual_cost || 0), 0);
      }
    },
    
    isCategoryOverBudget(category) {
      const estimatedTotal = this.getCategoryTotal(category, 'estimated');
      const actualTotal = this.getCategoryTotal(category, 'actual');
      
      return actualTotal > estimatedTotal;
    },
    
    getBudgetPercentage() {
      if (this.totalBudget <= 0) return 0;
      const percentage = (this.totalSpent / this.totalBudget) * 100;
      return Math.min(percentage, 100); // Cap at 100%
    },
    
    getBudgetStatusColor() {
      const percentage = this.getBudgetPercentage();
      
      if (percentage >= 100) {
        return '#EF476F'; // Red for over budget
      } else if (percentage >= 90) {
        return '#FFD166'; // Yellow for approaching budget
      } else {
        return '#06D6A0'; // Green for within budget
      }
    },
    
    toggleCategory(category) {
      const index = this.expandedCategories.indexOf(category);
      if (index === -1) {
        this.expandedCategories.push(category);
      } else {
        this.expandedCategories.splice(index, 1);
      }
    },
    
    // Modal methods
    showAddItemModal(category = '') {
      this.isEditMode = false;
      this.itemForm = this.getEmptyItemForm();
      
      if (category) {
        this.itemForm.category = category;
      }
      
      this.showItemModal = true;
    },
    
    editItem(itemId) {
      const item = this.budgetItems.find(item => item.id === itemId);
      if (!item) return;
      
      this.isEditMode = true;
      this.itemForm = { ...item };
      this.showItemModal = true;
    },
    
    closeItemModal() {
      this.showItemModal = false;
      this.newCategory = '';
    },
    
    async saveItem() {
      if (!this.isItemFormValid) return;
      
      try {
        // Handle new category
        if (this.itemForm.category === 'new' && this.newCategory.trim()) {
          this.itemForm.category = this.newCategory.trim();
        }
        
        if (this.isEditMode) {
          // Update existing item
          const index = this.budgetItems.findIndex(item => item.id === this.itemForm.id);
          if (index !== -1) {
            this.budgetItems.splice(index, 1, { ...this.itemForm });
          }
          
          // This would update in Supabase in a real implementation
          // await this.$supabase
          //   .from('budget_items')
          //   .update(this.itemForm)
          //   .eq('id', this.itemForm.id);
        } else {
          // Add new item
          const newItem = {
            ...this.itemForm,
            id: Date.now().toString()
          };
          
          this.budgetItems.push(newItem);
          
          // This would insert into Supabase in a real implementation
          // const { data, error } = await this.$supabase
          //   .from('budget_items')
          //   .insert(newItem);
        }
        
        this.closeItemModal();
        this.updateCharts();
      } catch (error) {
        console.error('Error saving budget item:', error);
      }
    },
    
    async deleteItem(itemId) {
      if (!confirm(this.$t('budgetPlanner.confirmDelete'))) {
        return;
      }
      
      try {
        this.budgetItems = this.budgetItems.filter(item => item.id !== itemId);
        
        // This would delete from Supabase in a real implementation
        // await this.$supabase
        //   .from('budget_items')
        //   .delete()
        //   .eq('id', itemId);
        
        this.updateCharts();
      } catch (error) {
        console.error('Error deleting budget item:', error);
      }
    },
    
    showEditBudgetModal() {
      this.budgetForm = {
        total: this.totalBudget,
        currency: this.currency
      };
      this.showBudgetModal = true;
    },
    
    closeBudgetModal() {
      this.showBudgetModal = false;
    },
    
    async saveTotalBudget() {
      if (!this.budgetForm.total) return;
      
      try {
        this.totalBudget = parseFloat(this.budgetForm.total);
        this.currency = this.budgetForm.currency;
        
        // This would update in Supabase in a real implementation
        // await this.$supabase
        //   .from('weddings')
        //   .update({
        //     budget_total: this.totalBudget,
        //     currency: this.currency
        //   })
        //   .eq('id', this.weddingId);
        
        this.closeBudgetModal();
        this.updateCharts();
      } catch (error) {
        console.error('Error saving total budget:', error);
      }
    },
    
    // Export methods
    exportBudget() {
      // Create CSV content
      let csv = 'Category,Description,Estimated Cost,Actual Cost,Vendor,Status,Payment Date,Notes\n';
      
      this.budgetItems.forEach(item => {
        csv += `"${item.category}","${item.description}",${item.estimated_cost},${item.actual_cost || ''},`;
        csv += `"${item.vendor || ''}",${item.paid ? 'Paid' : 'Unpaid'},"${item.payment_date || ''}","${item.notes || ''}"\n`;
      });
      
      // Add summary row
      csv += `\n"TOTAL",,${this.budgetItems.reduce((sum, item) => sum + item.estimated_cost, 0)},`;
      csv += `${this.budgetItems.reduce((sum, item) => sum + (item.actual_cost || 0), 0)},,,,\n`;
      
      // Create download link
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'budget_plan.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    
    // Utility methods
    getEmptyItemForm() {
      return {
        category: this.categories.length > 0 ? this.categories[0] : '',
        description: '',
        estimated_cost: 0,
        actual_cost: null,
        vendor: '',
        paid: false,
        payment_date: null,
        notes: ''
      };
    },
    
    formatCurrency(value, includeSymbol = true) {
      if (value === null || value === undefined) return '-';
      
      const formatter = new Intl.NumberFormat('de-DE', {
        style: includeSymbol ? 'currency' : 'decimal',
        currency: this.currency,
        minimumFractionDigits: 2
      });
      
      return formatter.format(value);
    }
  }
};
</script>

<style scoped>
.budget-planner {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #FFF9EB;
}

.budget-planner__header {
  padding: 24px;
  background-color: #FFFFFF;
  border-bottom: 1px solid #F2F2F2;
}

.budget-planner__controls {
  display: flex;
  gap: 16px;
  margin-top: 16px;
}

.budget-planner__content {
  flex: 1;
  padding: 24px;
  overflow: auto;
}

.budget-planner__overview {
  margin-bottom: 32px;
}

.budget-planner__total-card {
  background-color: #FFFFFF;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
}

.budget-planner__total-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.budget-planner__total-amount {
  font-size: 32px;
  font-weight: bold;
  color: #073B4C;
  margin-bottom: 16px;
}

.budget-planner__progress-container {
  margin-top: 8px;
}

.budget-planner__progress-bar {
  height: 16px;
  background-color: #F2F2F2;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 8px;
}

.budget-planner__progress-fill {
  height: 100%;
  border-radius: 8px;
  transition: width 0.3s ease;
}

.budget-planner__progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #4F4F4F;
}

.budget-planner__charts {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.budget-planner__chart-card {
  flex: 1;
  background-color: #FFFFFF;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
}

.budget-planner__chart-card h3 {
  margin-bottom: 16px;
}

.budget-planner__chart-container {
  height: 300px;
  position: relative;
}

.budget-planner__categories {
  background-color: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.budget-planner__filters {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid #F2F2F2;
  background-color: #F9F9F9;
}

.budget-planner__search {
  flex: 1;
}

.budget-planner__search input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #BDBDBD;
  border-radius: 8px;
}

.budget-planner__filter-group {
  min-width: 150px;
}

.budget-planner__filter-group label {
  display: block;
  margin-bottom: 4px;
  font-size: 12px;
  color: #4F4F4F;
}

.budget-planner__filter-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #BDBDBD;
  border-radius: 8px;
}

.budget-planner__category {
  border-bottom: 1px solid #F2F2F2;
}

.budget-planner__category:last-child {
  border-bottom: none;
}

.budget-planner__category-header {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  cursor: pointer;
  background-color: #FFFFFF;
  transition: background-color 0.2s ease;
}

.budget-planner__category-header:hover {
  background-color: #F9F9F9;
}

.budget-planner__category-name {
  font-weight: 600;
  display: flex;
  align-items: center;
}

.budget-planner__category-name i {
  margin-right: 8px;
}

.budget-planner__category-summary {
  display: flex;
  align-items: center;
  gap: 16px;
}

.budget-planner__category-amount {
  font-weight: 500;
}

.budget-planner__category-status {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #06D6A0;
  color: #FFFFFF;
}

.budget-planner__category-status.over-budget {
  background-color: #EF476F;
}

.budget-planner__category-items {
  padding: 0 16px 16px;
  background-color: #F9F9F9;
}

.budget-planner__items-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
}

.budget-planner__items-table th {
  padding: 12px 8px;
  text-align: left;
  font-weight: 600;
  color: #4F4F4F;
  border-bottom: 1px solid #BDBDBD;
}

.budget-planner__items-table td {
  padding: 12px 8px;
  border-bottom: 1px solid #F2F2F2;
}

.budget-planner__items-table tr:last-child td {
  border-bottom: none;
}

.budget-planner__item-actions {
  display: flex;
  gap: 8px;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-paid {
  background-color: #06D6A0;
  color: #FFFFFF;
}

.status-unpaid {
  background-color: #FFD166;
  color: #073B4C;
}

.empty-state {
  text-align: center;
  padding: 16px;
  color: #BDBDBD;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.modal-content {
  background-color: #FFFFFF;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 16px;
  border-bottom: 1px solid #F2F2F2;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 16px;
  flex: 1;
  overflow-y: auto;
}

.modal-footer {
  padding: 16px;
  border-top: 1px solid #F2F2F2;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  flex: 1;
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
  color: #4F4F4F;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #BDBDBD;
  border-radius: 8px;
  font-family: inherit;
  font-size: inherit;
}

.input-with-currency {
  position: relative;
}

.currency-symbol {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #4F4F4F;
}

.input-with-currency input {
  padding-left: 28px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
  margin-right: 8px;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn i {
  margin-right: 8px;
}

.btn-primary {
  background-color: #FFD166;
  color: #073B4C;
}

.btn-primary:hover {
  background-color: #FFBE33;
}

.btn-secondary {
  background-color: transparent;
  border: 2px solid #FFD166;
  color: #FFD166;
}

.btn-secondary:hover {
  background-color: #FFF9EB;
}

.btn-small {
  padding: 8px 16px;
  font-size: 14px;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover {
  background-color: #F2F2F2;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 992px) {
  .budget-planner__charts {
    flex-direction: column;
  }
  
  .budget-planner__chart-container {
    height: 250px;
  }
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 8px;
  }
  
  .budget-planner__filters {
    flex-direction: column;
    gap: 8px;
  }
  
  .budget-planner__category-summary {
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
  }
  
  .budget-planner__items-table th:nth-child(3),
  .budget-planner__items-table td:nth-child(3),
  .budget-planner__items-table th:nth-child(4),
  .budget-planner__items-table td:nth-child(4) {
    display: none;
  }
}
</style>
