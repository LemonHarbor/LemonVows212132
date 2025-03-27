<template>
  <div class="witness-area">
    <div class="witness-area__header">
      <h1>{{ $t('witnessArea.title') }}</h1>
      <p>{{ $t('witnessArea.description') }}</p>
    </div>
    
    <div class="witness-area__content">
      <div class="witness-area__tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id" 
          class="witness-area__tab" 
          :class="{ 'active': activeTab === tab.id }"
          @click="setActiveTab(tab.id)"
        >
          <i :class="`icon icon-${tab.icon}`"></i>
          {{ tab.label }}
        </button>
      </div>
      
      <!-- Tasks Tab -->
      <div v-if="activeTab === 'tasks'" class="witness-area__tab-content">
        <div class="witness-area__section-header">
          <h2>{{ $t('witnessArea.tasks') }}</h2>
          <button class="btn btn-primary" @click="showAddTaskModal">
            <i class="icon icon-plus"></i> {{ $t('witnessArea.addTask') }}
          </button>
        </div>
        
        <div class="task-list">
          <div v-for="task in tasks" :key="task.id" class="task-item">
            <div class="task-item__checkbox">
              <input type="checkbox" :checked="task.completed" @change="toggleTask(task.id)" />
            </div>
            <div class="task-item__content">
              <div class="task-item__title">{{ task.title }}</div>
              <div class="task-item__details">
                <div class="task-item__assignee">
                  <i class="icon icon-user"></i> {{ task.assignee }}
                </div>
                <div class="task-item__due-date">
                  <i class="icon icon-calendar"></i> {{ formatDate(task.dueDate) }}
                </div>
              </div>
              <div class="task-item__description">{{ task.description }}</div>
            </div>
            <div class="task-item__actions">
              <button class="btn-icon" @click="editTask(task.id)">
                <i class="icon icon-edit"></i>
              </button>
              <button class="btn-icon" @click="deleteTask(task.id)">
                <i class="icon icon-trash"></i>
              </button>
            </div>
          </div>
          <div v-if="tasks.length === 0" class="empty-state">
            {{ $t('witnessArea.noTasks') }}
          </div>
        </div>
      </div>
      
      <!-- Bachelor/Bachelorette Party Tab -->
      <div v-if="activeTab === 'party'" class="witness-area__tab-content">
        <div class="witness-area__section-header">
          <h2>{{ $t('witnessArea.partyPlanning') }}</h2>
        </div>
        
        <div class="party-planning">
          <div class="party-planning__options">
            <div class="party-planning__option-card">
              <div class="party-planning__option-header">
                <h3>{{ $t('witnessArea.partyType') }}</h3>
              </div>
              <div class="party-planning__option-content">
                <div class="radio-group">
                  <label class="radio-option">
                    <input type="radio" v-model="partyType" value="bachelor" />
                    {{ $t('witnessArea.bachelorParty') }}
                  </label>
                  <label class="radio-option">
                    <input type="radio" v-model="partyType" value="bachelorette" />
                    {{ $t('witnessArea.bacheloretteParty') }}
                  </label>
                  <label class="radio-option">
                    <input type="radio" v-model="partyType" value="combined" />
                    {{ $t('witnessArea.combinedParty') }}
                  </label>
                </div>
              </div>
            </div>
            
            <div class="party-planning__option-card">
              <div class="party-planning__option-header">
                <h3>{{ $t('witnessArea.partyDate') }}</h3>
              </div>
              <div class="party-planning__option-content">
                <div class="form-group">
                  <input type="date" v-model="partyDate" />
                </div>
              </div>
            </div>
            
            <div class="party-planning__option-card">
              <div class="party-planning__option-header">
                <h3>{{ $t('witnessArea.partyLocation') }}</h3>
              </div>
              <div class="party-planning__option-content">
                <div class="form-group">
                  <input type="text" v-model="partyLocation" :placeholder="$t('witnessArea.enterLocation')" />
                </div>
              </div>
            </div>
          </div>
          
          <div class="party-planning__ideas">
            <div class="party-planning__ideas-header">
              <h3>{{ $t('witnessArea.partyIdeas') }}</h3>
              <button class="btn btn-secondary" @click="showAddIdeaModal">
                <i class="icon icon-plus"></i> {{ $t('witnessArea.addIdea') }}
              </button>
            </div>
            
            <div class="idea-list">
              <div v-for="idea in partyIdeas" :key="idea.id" class="idea-item">
                <div class="idea-item__content">
                  <div class="idea-item__title">{{ idea.title }}</div>
                  <div class="idea-item__description">{{ idea.description }}</div>
                  <div class="idea-item__meta">
                    <div class="idea-item__author">
                      <i class="icon icon-user"></i> {{ idea.author }}
                    </div>
                    <div class="idea-item__votes">
                      <i class="icon icon-thumbs-up"></i> {{ idea.votes }}
                    </div>
                  </div>
                </div>
                <div class="idea-item__actions">
                  <button class="btn-icon" @click="voteForIdea(idea.id)">
                    <i class="icon icon-thumbs-up"></i>
                  </button>
                  <button class="btn-icon" @click="editIdea(idea.id)">
                    <i class="icon icon-edit"></i>
                  </button>
                  <button class="btn-icon" @click="deleteIdea(idea.id)">
                    <i class="icon icon-trash"></i>
                  </button>
                </div>
              </div>
              <div v-if="partyIdeas.length === 0" class="empty-state">
                {{ $t('witnessArea.noIdeas') }}
              </div>
            </div>
          </div>
          
          <div class="party-planning__actions">
            <button class="btn btn-primary" @click="savePartyPlan">
              {{ $t('witnessArea.savePartyPlan') }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Shared Expenses Tab -->
      <div v-if="activeTab === 'expenses'" class="witness-area__tab-content">
        <div class="witness-area__section-header">
          <h2>{{ $t('witnessArea.sharedExpenses') }}</h2>
          <button class="btn btn-primary" @click="showAddExpenseModal">
            <i class="icon icon-plus"></i> {{ $t('witnessArea.addExpense') }}
          </button>
        </div>
        
        <div class="expense-summary">
          <div class="expense-summary__card">
            <div class="expense-summary__title">{{ $t('witnessArea.totalExpenses') }}</div>
            <div class="expense-summary__amount">{{ formatCurrency(totalExpenses) }}</div>
          </div>
          
          <div class="expense-summary__card">
            <div class="expense-summary__title">{{ $t('witnessArea.yourShare') }}</div>
            <div class="expense-summary__amount">{{ formatCurrency(yourShare) }}</div>
          </div>
          
          <div class="expense-summary__card">
            <div class="expense-summary__title">{{ $t('witnessArea.youOwe') }}</div>
            <div class="expense-summary__amount" :class="{ 'negative': youOwe > 0 }">
              {{ formatCurrency(youOwe) }}
            </div>
          </div>
          
          <div class="expense-summary__card">
            <div class="expense-summary__title">{{ $t('witnessArea.youAreOwed') }}</div>
            <div class="expense-summary__amount" :class="{ 'positive': youAreOwed > 0 }">
              {{ formatCurrency(youAreOwed) }}
            </div>
          </div>
        </div>
        
        <div class="expense-list">
          <div v-for="expense in expenses" :key="expense.id" class="expense-item">
            <div class="expense-item__content">
              <div class="expense-item__title">{{ expense.title }}</div>
              <div class="expense-item__details">
                <div class="expense-item__amount">{{ formatCurrency(expense.amount) }}</div>
                <div class="expense-item__date">{{ formatDate(expense.date) }}</div>
              </div>
              <div class="expense-item__payer">
                {{ $t('witnessArea.paidBy') }}: {{ expense.paidBy }}
              </div>
              <div class="expense-item__shares">
                <div v-for="(share, index) in expense.shares" :key="index" class="expense-item__share">
                  <span class="expense-item__share-name">{{ share.name }}</span>:
                  <span class="expense-item__share-amount">{{ formatCurrency(share.amount) }}</span>
                  <span v-if="share.paid" class="expense-item__share-status paid">
                    {{ $t('witnessArea.paid') }}
                  </span>
                  <span v-else class="expense-item__share-status unpaid">
                    {{ $t('witnessArea.unpaid') }}
                  </span>
                </div>
              </div>
            </div>
            <div class="expense-item__actions">
              <button class="btn-icon" @click="editExpense(expense.id)">
                <i class="icon icon-edit"></i>
              </button>
              <button class="btn-icon" @click="deleteExpense(expense.id)">
                <i class="icon icon-trash"></i>
              </button>
              <button class="btn-icon" @click="settleExpense(expense.id)">
                <i class="icon icon-check"></i>
              </button>
            </div>
          </div>
          <div v-if="expenses.length === 0" class="empty-state">
            {{ $t('witnessArea.noExpenses') }}
          </div>
        </div>
      </div>
      
      <!-- Speech Tab -->
      <div v-if="activeTab === 'speech'" class="witness-area__tab-content">
        <div class="witness-area__section-header">
          <h2>{{ $t('witnessArea.speechPreparation') }}</h2>
        </div>
        
        <div class="speech-preparation">
          <div class="speech-preparation__tips">
            <h3>{{ $t('witnessArea.speechTips') }}</h3>
            <ul class="speech-tips-list">
              <li v-for="(tip, index) in speechTips" :key="index" class="speech-tip">
                <div class="speech-tip__number">{{ index + 1 }}</div>
                <div class="speech-tip__content">{{ tip }}</div>
              </li>
            </ul>
          </div>
          
          <div class="speech-preparation__editor">
            <h3>{{ $t('witnessArea.yourSpeech') }}</h3>
            <div class="form-group">
              <textarea 
                v-model="speechContent" 
                rows="10" 
                :placeholder="$t('witnessArea.speechPlaceholder')"
              ></textarea>
            </div>
            <div class="speech-preparation__actions">
              <button class="btn btn-secondary" @click="saveSpeechDraft">
                <i class="icon icon-save"></i> {{ $t('witnessArea.saveDraft') }}
              </button>
              <button class="btn btn-primary" @click="previewSpeech">
                <i class="icon icon-eye"></i> {{ $t('witnessArea.previewSpeech') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Task Modal -->
    <div class="modal" v-if="showTaskModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isEditMode ? $t('witnessArea.editTask') : $t('witnessArea.addTask') }}</h3>
          <button class="btn-icon" @click="closeTaskModal">
            <i class="icon icon-x"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>{{ $t('witnessArea.taskTitle') }} *</label>
            <input type="text" v-model="taskForm.title" required />
          </div>
          
          <div class="form-group">
            <label>{{ $t('witnessArea.taskDescription') }}</label>
            <textarea v-model="taskForm.description" rows="3"></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>{{ $t('witnessArea.assignee') }} *</label>
              <select v-model="taskForm.assignee" required>
                <option v-for="witness in witnesses" :key="witness.id" :value="witness.name">
                  {{ witness.name }}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label>{{ $t('witnessArea.dueDate') }} *</label>
              <input type="date" v-model="taskForm.dueDate" required />
            </div>
          </div>
          
          <div class="form-group checkbox-group">
            <label>
              <input type="checkbox" v-model="taskForm.completed" />
              {{ $t('witnessArea.markAsCompleted') }}
            </label>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeTaskModal">
            {{ $t('common.cancel') }}
          </button>
          <button class="btn btn-primary" @click="saveTask" :disabled="!isTaskFormValid">
            {{ $t('common.save') }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Idea Modal -->
    <div class="modal" v-if="showIdeaModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isEditMode ? $t('witnessArea.editIdea') : $t('witnessArea.addIdea') }}</h3>
          <button class="btn-icon" @click="closeIdeaModal">
            <i class="icon icon-x"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>{{ $t('witnessArea.ideaTitle') }} *</label>
            <input type="text" v-model="ideaForm.title" required />
          </div>
          
          <div class="form-group">
            <label>{{ $t('witnessArea.ideaDescription') }} *</label>
            <textarea v-model="ideaForm.description" rows="3" required></textarea>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeIdeaModal">
            {{ $t('common.cancel') }}
          </button>
          <button class="btn btn-primary" @click="saveIdea" :disabled="!isIdeaFormValid">
            {{ $t('common.save') }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Expense Modal -->
    <div class="modal" v-if="showExpenseModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isEditMode ? $t('witnessArea.editExpense') : $t('witnessArea.addExpense') }}</h3>
          <button class="btn-icon" @click="closeExpenseModal">
            <i class="icon icon-x"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>{{ $t('witnessArea.expenseTitle') }} *</label>
            <input type="text" v-model="expenseForm.title" required />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>{{ $t('witnessArea.amount') }} *</label>
              <div class="input-with-currency">
                <span class="currency-symbol">€</span>
                <input type="number" v-model="expenseForm.amount" min="0" step="0.01" required />
              </div>
            </div>
            
            <div class="form-group">
              <label>{{ $t('witnessArea.date') }} *</label>
              <input type="date" v-model="expenseForm.date" required />
            </div>
          </div>
          
          <div class="form-group">
            <label>{{ $t('witnessArea.paidBy') }} *</label>
            <select v-model="expenseForm.paidBy" required>
              <option v-for="witness in witnesses" :key="witness.id" :value="witness.name">
                {{ witness.name }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label>{{ $t('witnessArea.splitMethod') }}</label>
            <select v-model="expenseForm.splitMethod">
              <option value="equal">{{ $t('witnessArea.equalSplit') }}</option>
              <option value="custom">{{ $t('witnessArea.customSplit') }}</option>
            </select>
          </div>
          
          <div v-if="expenseForm.splitMethod === 'custom'" class="form-group">
            <label>{{ $t('witnessArea.customShares') }}</label>
            <div v-for="(witness, index) in witnesses" :key="witness.id" class="custom-share">
              <div class="custom-share__name">{{ witness.name }}</div>
              <div class="custom-share__input">
                <div class="input-with-currency">
                  <span class="currency-symbol">€</span>
                  <input 
                    type="number" 
                    v-model="expenseForm.customShares[index]" 
                    min="0" 
                    step="0.01" 
                  />
                </div>
              </div>
            </div>
            <div class="custom-share-total">
              <div class="custom-share-total__label">{{ $t('witnessArea.total') }}:</div>
              <div class="custom-share-total__amount" :class="{ 'error': !isCustomShareValid }">
                {{ formatCurrency(getCustomShareTotal()) }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeExpenseModal">
            {{ $t('common.cancel') }}
          </button>
          <button 
            class="btn btn-primary" 
            @click="saveExpense" 
            :disabled="!isExpenseFormValid || (expenseForm.splitMethod === 'custom' && !isCustomShareValid)"
          >
            {{ $t('common.save') }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Speech Preview Modal -->
    <div class="modal" v-if="showSpeechPreviewModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ $t('witnessArea.speechPreview') }}</h3>
          <button class="btn-icon" @click="closeSpeechPreviewModal">
            <i class="icon icon-x"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="speech-preview">
            <div class="speech-preview__content">
              {{ speechContent }}
            </div>
            <div class="speech-preview__stats">
              <div class="speech-preview__stat">
                <div class="speech-preview__stat-label">{{ $t('witnessArea.wordCount') }}</div>
                <div class="speech-preview__stat-value">{{ getWordCount() }}</div>
              </div>
              <div class="speech-preview__stat">
                <div class="speech-preview__stat-label">{{ $t('witnessArea.estimatedDuration') }}</div>
                <div class="speech-preview__stat-value">{{ getEstimatedDuration() }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeSpeechPreviewModal">
            {{ $t('common.close') }}
          </button>
          <button class="btn btn-primary" @click="printSpeech">
            <i class="icon icon-printer"></i> {{ $t('witnessArea.printSpeech') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WitnessArea',
  
  data() {
    return {
      // UI state
      activeTab: 'tasks',
      isEditMode: false,
      
      // Tabs
      tabs: [
        { id: 'tasks', label: this.$t('witnessArea.tasks'), icon: 'check-square' },
        { id: 'party', label: this.$t('witnessArea.partyPlanning'), icon: 'music' },
        { id: 'expenses', label: this.$t('witnessArea.sharedExpenses'), icon: 'dollar-sign' },
        { id: 'speech', label: this.$t('witnessArea.speechPreparation'), icon: 'mic' }
      ],
      
      // Witnesses
      witnesses: [
        { id: '1', name: 'Julia Weber', role: 'maid_of_honor' },
        { id: '2', name: 'Thomas Müller', role: 'best_man' },
        { id: '3', name: 'Sarah Schmidt', role: 'bridesmaid' },
        { id: '4', name: 'Michael Becker', role: 'groomsman' }
      ],
      
      // Tasks
      tasks: [],
      showTaskModal: false,
      taskForm: this.getEmptyTaskForm(),
      
      // Party Planning
      partyType: 'bachelor',
      partyDate: '',
      partyLocation: '',
      partyIdeas: [],
      showIdeaModal: false,
      ideaForm: this.getEmptyIdeaForm(),
      
      // Shared Expenses
      expenses: [],
      showExpenseModal: false,
      expenseForm: this.getEmptyExpenseForm(),
      
      // Speech Preparation
      speechContent: '',
      speechTips: [
        this.$t('witnessArea.speechTip1'),
        this.$t('witnessArea.speechTip2'),
        this.$t('witnessArea.speechTip3'),
        this.$t('witnessArea.speechTip4'),
        this.$t('witnessArea.speechTip5')
      ],
      showSpeechPreviewModal: false
    };
  },
  
  computed: {
    // Task form validation
    isTaskFormValid() {
      return (
        this.taskForm.title.trim() !== '' &&
        this.taskForm.assignee !== '' &&
        this.taskForm.dueDate !== ''
      );
    },
    
    // Idea form validation
    isIdeaFormValid() {
      return (
        this.ideaForm.title.trim() !== '' &&
        this.ideaForm.description.trim() !== ''
      );
    },
    
    // Expense form validation
    isExpenseFormValid() {
      return (
        this.expenseForm.title.trim() !== '' &&
        this.expenseForm.amount > 0 &&
        this.expenseForm.date !== '' &&
        this.expenseForm.paidBy !== ''
      );
    },
    
    // Custom share validation
    isCustomShareValid() {
      if (this.expenseForm.splitMethod !== 'custom') return true;
      
      const total = this.getCustomShareTotal();
      return Math.abs(total - this.expenseForm.amount) < 0.01;
    },
    
    // Expense summary calculations
    totalExpenses() {
      return this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    },
    
    yourShare() {
      // Assuming current user is the first witness
      const currentUser = this.witnesses[0].name;
      
      return this.expenses.reduce((sum, expense) => {
        const userShare = expense.shares.find(share => share.name === currentUser);
        return sum + (userShare ? userShare.amount : 0);
      }, 0);
    },
    
    youOwe() {
      // Assuming current user is the first witness
      const currentUser = this.witnesses[0].name;
      
      return this.expenses.reduce((sum, expense) => {
        if (expense.paidBy !== currentUser) {
          const userShare = expense.shares.find(share => share.name === currentUser);
          if (userShare && !userShare.paid) {
            return sum + userShare.amount;
          }
        }
        return sum;
      }, 0);
    },
    
    youAreOwed() {
      // Assuming current user is the first witness
      const currentUser = this.witnesses[0].name;
      
      return this.expenses.reduce((sum, expense) => {
        if (expense.paidBy === currentUser) {
          const unpaidShares = expense.shares.filter(share => 
            share.name !== currentUser && !share.paid
          );
          return sum + unpaidShares.reduce((shareSum, share) => shareSum + share.amount, 0);
        }
        return sum;
      }, 0);
    }
  },
  
  mounted() {
    // Load data
    this.loadTasks();
    this.loadPartyIdeas();
    this.loadExpenses();
    this.loadSpeechDraft();
  },
  
  methods: {
    // Tab navigation
    setActiveTab(tabId) {
      this.activeTab = tabId;
    },
    
    // Data loading methods
    loadTasks() {
      // This would be replaced with actual Supabase query
      // In a real implementation, we would fetch data from the backend
      
      // For demo purposes, we'll use mock data
      this.tasks = [
        {
          id: '1',
          title: 'Hochzeitsgeschenk organisieren',
          description: 'Ein gemeinsames Geschenk von allen Trauzeugen und Brautjungfern organisieren.',
          assignee: 'Julia Weber',
          dueDate: '2025-05-01',
          completed: false
        },
        {
          id: '2',
          title: 'Junggesellenabschied planen',
          description: 'Location buchen und Aktivitäten organisieren.',
          assignee: 'Thomas Müller',
          dueDate: '2025-04-15',
          completed: true
        },
        {
          id: '3',
          title: 'Rede vorbereiten',
          description: 'Eine persönliche und emotionale Rede für die Hochzeit vorbereiten.',
          assignee: 'Julia Weber',
          dueDate: '2025-05-20',
          completed: false
        }
      ];
    },
    
    loadPartyIdeas() {
      // For demo purposes, we'll use mock data
      this.partyIdeas = [
        {
          id: '1',
          title: 'Weinprobe',
          description: 'Eine Weinprobe in einem lokalen Weingut mit anschließendem Dinner.',
          author: 'Sarah Schmidt',
          votes: 3
        },
        {
          id: '2',
          title: 'Wochenendtrip nach Berlin',
          description: 'Ein Wochenende in Berlin mit Club-Besuch und Sightseeing.',
          author: 'Thomas Müller',
          votes: 2
        },
        {
          id: '3',
          title: 'Escape Room',
          description: 'Ein Escape Room Abenteuer gefolgt von einem netten Abendessen.',
          author: 'Michael Becker',
          votes: 1
        }
      ];
    },
    
    loadExpenses() {
      // For demo purposes, we'll use mock data
      this.expenses = [
        {
          id: '1',
          title: 'Anzahlung Location für JGA',
          amount: 300,
          date: '2025-03-15',
          paidBy: 'Thomas Müller',
          shares: [
            { name: 'Julia Weber', amount: 75, paid: true },
            { name: 'Thomas Müller', amount: 75, paid: true },
            { name: 'Sarah Schmidt', amount: 75, paid: false },
            { name: 'Michael Becker', amount: 75, paid: false }
          ]
        },
        {
          id: '2',
          title: 'Hochzeitsgeschenk',
          amount: 400,
          date: '2025-04-10',
          paidBy: 'Julia Weber',
          shares: [
            { name: 'Julia Weber', amount: 100, paid: true },
            { name: 'Thomas Müller', amount: 100, paid: true },
            { name: 'Sarah Schmidt', amount: 100, paid: true },
            { name: 'Michael Becker', amount: 100, paid: false }
          ]
        }
      ];
    },
    
    loadSpeechDraft() {
      // This would load a saved speech draft from local storage or backend
      this.speechContent = localStorage.getItem('speechDraft') || '';
    },
    
    // Task methods
    showAddTaskModal() {
      this.isEditMode = false;
      this.taskForm = this.getEmptyTaskForm();
      this.showTaskModal = true;
    },
    
    editTask(taskId) {
      const task = this.tasks.find(t => t.id === taskId);
      if (!task) return;
      
      this.isEditMode = true;
      this.taskForm = { ...task };
      this.showTaskModal = true;
    },
    
    closeTaskModal() {
      this.showTaskModal = false;
    },
    
    saveTask() {
      if (!this.isTaskFormValid) return;
      
      if (this.isEditMode) {
        // Update existing task
        const index = this.tasks.findIndex(t => t.id === this.taskForm.id);
        if (index !== -1) {
          this.tasks.splice(index, 1, { ...this.taskForm });
        }
      } else {
        // Add new task
        const newTask = {
          ...this.taskForm,
          id: Date.now().toString()
        };
        
        this.tasks.push(newTask);
      }
      
      this.closeTaskModal();
    },
    
    deleteTask(taskId) {
      if (!confirm(this.$t('witnessArea.confirmDeleteTask'))) {
        return;
      }
      
      this.tasks = this.tasks.filter(task => task.id !== taskId);
    },
    
    toggleTask(taskId) {
      const task = this.tasks.find(t => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
      }
    },
    
    // Party planning methods
    showAddIdeaModal() {
      this.isEditMode = false;
      this.ideaForm = this.getEmptyIdeaForm();
      this.showIdeaModal = true;
    },
    
    editIdea(ideaId) {
      const idea = this.partyIdeas.find(i => i.id === ideaId);
      if (!idea) return;
      
      this.isEditMode = true;
      this.ideaForm = { ...idea };
      this.showIdeaModal = true;
    },
    
    closeIdeaModal() {
      this.showIdeaModal = false;
    },
    
    saveIdea() {
      if (!this.isIdeaFormValid) return;
      
      if (this.isEditMode) {
        // Update existing idea
        const index = this.partyIdeas.findIndex(i => i.id === this.ideaForm.id);
        if (index !== -1) {
          this.partyIdeas.splice(index, 1, { ...this.ideaForm });
        }
      } else {
        // Add new idea
        const newIdea = {
          ...this.ideaForm,
          id: Date.now().toString(),
          author: this.witnesses[0].name, // Assuming current user is the first witness
          votes: 0
        };
        
        this.partyIdeas.push(newIdea);
      }
      
      this.closeIdeaModal();
    },
    
    deleteIdea(ideaId) {
      if (!confirm(this.$t('witnessArea.confirmDeleteIdea'))) {
        return;
      }
      
      this.partyIdeas = this.partyIdeas.filter(idea => idea.id !== ideaId);
    },
    
    voteForIdea(ideaId) {
      const idea = this.partyIdeas.find(i => i.id === ideaId);
      if (idea) {
        idea.votes++;
      }
    },
    
    savePartyPlan() {
      // This would save the party plan to the backend
      alert(this.$t('witnessArea.partyPlanSaved'));
    },
    
    // Expense methods
    showAddExpenseModal() {
      this.isEditMode = false;
      this.expenseForm = this.getEmptyExpenseForm();
      this.showExpenseModal = true;
    },
    
    editExpense(expenseId) {
      const expense = this.expenses.find(e => e.id === expenseId);
      if (!expense) return;
      
      this.isEditMode = true;
      this.expenseForm = {
        id: expense.id,
        title: expense.title,
        amount: expense.amount,
        date: expense.date,
        paidBy: expense.paidBy,
        splitMethod: 'custom',
        customShares: expense.shares.map(share => share.amount)
      };
      this.showExpenseModal = true;
    },
    
    closeExpenseModal() {
      this.showExpenseModal = false;
    },
    
    saveExpense() {
      if (!this.isExpenseFormValid) return;
      
      // Calculate shares
      let shares = [];
      if (this.expenseForm.splitMethod === 'equal') {
        const shareAmount = this.expenseForm.amount / this.witnesses.length;
        shares = this.witnesses.map(witness => ({
          name: witness.name,
          amount: shareAmount,
          paid: witness.name === this.expenseForm.paidBy
        }));
      } else {
        shares = this.witnesses.map((witness, index) => ({
          name: witness.name,
          amount: parseFloat(this.expenseForm.customShares[index] || 0),
          paid: witness.name === this.expenseForm.paidBy
        }));
      }
      
      if (this.isEditMode) {
        // Update existing expense
        const index = this.expenses.findIndex(e => e.id === this.expenseForm.id);
        if (index !== -1) {
          this.expenses.splice(index, 1, {
            id: this.expenseForm.id,
            title: this.expenseForm.title,
            amount: parseFloat(this.expenseForm.amount),
            date: this.expenseForm.date,
            paidBy: this.expenseForm.paidBy,
            shares
          });
        }
      } else {
        // Add new expense
        const newExpense = {
          id: Date.now().toString(),
          title: this.expenseForm.title,
          amount: parseFloat(this.expenseForm.amount),
          date: this.expenseForm.date,
          paidBy: this.expenseForm.paidBy,
          shares
        };
        
        this.expenses.push(newExpense);
      }
      
      this.closeExpenseModal();
    },
    
    deleteExpense(expenseId) {
      if (!confirm(this.$t('witnessArea.confirmDeleteExpense'))) {
        return;
      }
      
      this.expenses = this.expenses.filter(expense => expense.id !== expenseId);
    },
    
    settleExpense(expenseId) {
      const expense = this.expenses.find(e => e.id === expenseId);
      if (!expense) return;
      
      // Mark all shares as paid
      expense.shares.forEach(share => {
        share.paid = true;
      });
    },
    
    getCustomShareTotal() {
      return this.expenseForm.customShares.reduce((sum, share) => sum + parseFloat(share || 0), 0);
    },
    
    // Speech methods
    saveSpeechDraft() {
      // Save to local storage
      localStorage.setItem('speechDraft', this.speechContent);
      alert(this.$t('witnessArea.speechDraftSaved'));
    },
    
    previewSpeech() {
      this.showSpeechPreviewModal = true;
    },
    
    closeSpeechPreviewModal() {
      this.showSpeechPreviewModal = false;
    },
    
    printSpeech() {
      // This would open a print dialog
      window.print();
    },
    
    getWordCount() {
      return this.speechContent.trim().split(/\s+/).length;
    },
    
    getEstimatedDuration() {
      // Average speaking rate is about 150 words per minute
      const wordCount = this.getWordCount();
      const minutes = Math.floor(wordCount / 150);
      const seconds = Math.floor((wordCount % 150) / 2.5);
      
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    },
    
    // Utility methods
    getEmptyTaskForm() {
      return {
        title: '',
        description: '',
        assignee: this.witnesses.length > 0 ? this.witnesses[0].name : '',
        dueDate: '',
        completed: false
      };
    },
    
    getEmptyIdeaForm() {
      return {
        title: '',
        description: ''
      };
    },
    
    getEmptyExpenseForm() {
      return {
        title: '',
        amount: 0,
        date: '',
        paidBy: this.witnesses.length > 0 ? this.witnesses[0].name : '',
        splitMethod: 'equal',
        customShares: Array(this.witnesses.length).fill(0)
      };
    },
    
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('de-DE');
    },
    
    formatCurrency(value) {
      if (value === null || value === undefined) return '-';
      
      const formatter = new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2
      });
      
      return formatter.format(value);
    }
  }
};
</script>

<style scoped>
.witness-area {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #FFF9EB;
}

.witness-area__header {
  padding: 24px;
  background-color: #FFFFFF;
  border-bottom: 1px solid #F2F2F2;
}

.witness-area__content {
  flex: 1;
  padding: 24px;
  overflow: auto;
}

.witness-area__tabs {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  border-bottom: 1px solid #F2F2F2;
  padding-bottom: 16px;
}

.witness-area__tab {
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  background-color: #F2F2F2;
  color: #4F4F4F;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.witness-area__tab.active {
  background-color: #FFD166;
  color: #073B4C;
}

.witness-area__tab i {
  font-size: 18px;
}

.witness-area__tab-content {
  background-color: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
  padding: 24px;
}

.witness-area__section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

/* Task styles */
.task-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.task-item {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  border-radius: 8px;
  background-color: #F9F9F9;
  border-left: 4px solid #FFD166;
}

.task-item__checkbox {
  margin-right: 16px;
  margin-top: 4px;
}

.task-item__content {
  flex: 1;
}

.task-item__title {
  font-weight: 500;
  margin-bottom: 8px;
}

.task-item__details {
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #4F4F4F;
}

.task-item__assignee,
.task-item__due-date {
  display: flex;
  align-items: center;
  gap: 4px;
}

.task-item__description {
  font-size: 14px;
  color: #4F4F4F;
}

.task-item__actions {
  display: flex;
  gap: 8px;
}

/* Party planning styles */
.party-planning {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.party-planning__options {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.party-planning__option-card {
  flex: 1;
  min-width: 250px;
  background-color: #F9F9F9;
  border-radius: 8px;
  overflow: hidden;
}

.party-planning__option-header {
  padding: 16px;
  background-color: #FFD166;
  color: #073B4C;
}

.party-planning__option-content {
  padding: 16px;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.party-planning__ideas {
  background-color: #F9F9F9;
  border-radius: 8px;
  padding: 16px;
}

.party-planning__ideas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.idea-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.idea-item {
  display: flex;
  background-color: #FFFFFF;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
}

.idea-item__content {
  flex: 1;
}

.idea-item__title {
  font-weight: 500;
  margin-bottom: 8px;
}

.idea-item__description {
  font-size: 14px;
  color: #4F4F4F;
  margin-bottom: 8px;
}

.idea-item__meta {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #4F4F4F;
}

.idea-item__author,
.idea-item__votes {
  display: flex;
  align-items: center;
  gap: 4px;
}

.idea-item__actions {
  display: flex;
  gap: 8px;
}

.party-planning__actions {
  display: flex;
  justify-content: flex-end;
}

/* Expense styles */
.expense-summary {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.expense-summary__card {
  flex: 1;
  min-width: 200px;
  background-color: #F9F9F9;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.expense-summary__title {
  font-size: 14px;
  color: #4F4F4F;
  margin-bottom: 8px;
}

.expense-summary__amount {
  font-size: 24px;
  font-weight: bold;
  color: #073B4C;
}

.expense-summary__amount.positive {
  color: #06D6A0;
}

.expense-summary__amount.negative {
  color: #EF476F;
}

.expense-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.expense-item {
  display: flex;
  background-color: #F9F9F9;
  border-radius: 8px;
  padding: 16px;
}

.expense-item__content {
  flex: 1;
}

.expense-item__title {
  font-weight: 500;
  margin-bottom: 8px;
}

.expense-item__details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.expense-item__amount {
  font-weight: 500;
}

.expense-item__date {
  font-size: 14px;
  color: #4F4F4F;
}

.expense-item__payer {
  font-size: 14px;
  color: #4F4F4F;
  margin-bottom: 8px;
}

.expense-item__shares {
  font-size: 14px;
  color: #4F4F4F;
}

.expense-item__share {
  margin-bottom: 4px;
}

.expense-item__share-status {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  margin-left: 4px;
}

.expense-item__share-status.paid {
  background-color: #06D6A0;
  color: #FFFFFF;
}

.expense-item__share-status.unpaid {
  background-color: #FFD166;
  color: #073B4C;
}

.expense-item__actions {
  display: flex;
  gap: 8px;
}

.custom-share {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.custom-share__name {
  flex: 1;
}

.custom-share__input {
  width: 120px;
}

.custom-share-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 8px;
  border-top: 1px solid #F2F2F2;
  font-weight: 500;
}

.custom-share-total__amount.error {
  color: #EF476F;
}

/* Speech styles */
.speech-preparation {
  display: flex;
  gap: 24px;
}

.speech-preparation__tips {
  flex: 1;
  background-color: #F9F9F9;
  border-radius: 8px;
  padding: 16px;
}

.speech-tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.speech-tip {
  display: flex;
  margin-bottom: 16px;
}

.speech-tip__number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #FFD166;
  color: #073B4C;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 12px;
  flex-shrink: 0;
}

.speech-tip__content {
  flex: 1;
}

.speech-preparation__editor {
  flex: 2;
}

.speech-preparation__editor textarea {
  width: 100%;
  resize: vertical;
}

.speech-preparation__actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 16px;
}

.speech-preview {
  background-color: #F9F9F9;
  border-radius: 8px;
  padding: 16px;
}

.speech-preview__content {
  white-space: pre-wrap;
  margin-bottom: 16px;
  min-height: 200px;
}

.speech-preview__stats {
  display: flex;
  gap: 16px;
  border-top: 1px solid #F2F2F2;
  padding-top: 16px;
}

.speech-preview__stat {
  flex: 1;
  text-align: center;
}

.speech-preview__stat-label {
  font-size: 14px;
  color: #4F4F4F;
  margin-bottom: 4px;
}

.speech-preview__stat-value {
  font-weight: 500;
}

/* Common styles */
.empty-state {
  padding: 24px;
  text-align: center;
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
  .witness-area__tabs {
    flex-wrap: wrap;
  }
  
  .speech-preparation {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 8px;
  }
  
  .expense-summary {
    flex-direction: column;
  }
}
</style>
