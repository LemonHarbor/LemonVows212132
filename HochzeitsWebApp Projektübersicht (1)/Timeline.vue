<template>
  <div class="timeline">
    <div class="timeline__header">
      <h1>{{ $t('timeline.title') }}</h1>
      <p>{{ $t('timeline.description') }}</p>
    </div>
    
    <div class="timeline__content">
      <div class="timeline__actions">
        <button class="btn btn-primary" @click="showAddEventModal">
          <i class="icon icon-plus"></i> {{ $t('timeline.addEvent') }}
        </button>
        <button class="btn btn-secondary" @click="generateTimeline">
          <i class="icon icon-magic-wand"></i> {{ $t('timeline.generateTimeline') }}
        </button>
      </div>
      
      <div class="timeline__filters">
        <div class="filter-group">
          <label>{{ $t('timeline.filterByPhase') }}</label>
          <select v-model="phaseFilter">
            <option value="all">{{ $t('common.all') }}</option>
            <option v-for="phase in phases" :key="phase.id" :value="phase.id">
              {{ phase.name }}
            </option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>{{ $t('timeline.filterByStatus') }}</label>
          <select v-model="statusFilter">
            <option value="all">{{ $t('common.all') }}</option>
            <option value="completed">{{ $t('timeline.completed') }}</option>
            <option value="in_progress">{{ $t('timeline.inProgress') }}</option>
            <option value="upcoming">{{ $t('timeline.upcoming') }}</option>
            <option value="overdue">{{ $t('timeline.overdue') }}</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>{{ $t('timeline.search') }}</label>
          <div class="search-input">
            <i class="icon icon-search"></i>
            <input 
              type="text" 
              v-model="searchQuery" 
              :placeholder="$t('timeline.searchEvents')" 
            />
          </div>
        </div>
      </div>
      
      <div class="timeline__progress">
        <div class="progress-bar">
          <div class="progress-bar__label">{{ $t('timeline.overallProgress') }}</div>
          <div class="progress-bar__container">
            <div 
              class="progress-bar__fill" 
              :style="{ width: `${overallProgress}%` }"
            ></div>
          </div>
          <div class="progress-bar__percentage">{{ overallProgress }}%</div>
        </div>
      </div>
      
      <div class="timeline__phases">
        <div 
          v-for="phase in filteredPhases" 
          :key="phase.id" 
          class="timeline-phase"
        >
          <div class="timeline-phase__header" @click="togglePhase(phase.id)">
            <div class="timeline-phase__title">
              <i 
                :class="[
                  'icon', 
                  expandedPhases.includes(phase.id) ? 'icon-chevron-down' : 'icon-chevron-right'
                ]"
              ></i>
              <h2>{{ phase.name }}</h2>
            </div>
            <div class="timeline-phase__progress">
              <div class="progress-bar__container">
                <div 
                  class="progress-bar__fill" 
                  :style="{ width: `${getPhaseProgress(phase)}%` }"
                ></div>
              </div>
              <div class="progress-bar__percentage">{{ getPhaseProgress(phase) }}%</div>
            </div>
          </div>
          
          <div 
            v-if="expandedPhases.includes(phase.id)" 
            class="timeline-phase__events"
          >
            <div 
              v-for="event in filteredEvents(phase)" 
              :key="event.id" 
              class="timeline-event"
              :class="[
                `status-${event.status}`,
                { 'milestone': event.isMilestone }
              ]"
            >
              <div class="timeline-event__checkbox">
                <input 
                  type="checkbox" 
                  :checked="event.status === 'completed'" 
                  @change="toggleEventStatus(event)"
                />
              </div>
              
              <div class="timeline-event__content">
                <div class="timeline-event__title">
                  {{ event.title }}
                  <span v-if="event.isMilestone" class="milestone-badge">
                    {{ $t('timeline.milestone') }}
                  </span>
                </div>
                
                <div class="timeline-event__details">
                  <div class="timeline-event__date">
                    <i class="icon icon-calendar"></i>
                    {{ formatDate(event.date) }}
                  </div>
                  
                  <div v-if="event.assignee" class="timeline-event__assignee">
                    <i class="icon icon-user"></i>
                    {{ event.assignee }}
                  </div>
                </div>
                
                <div v-if="event.description" class="timeline-event__description">
                  {{ event.description }}
                </div>
                
                <div v-if="event.status === 'overdue'" class="timeline-event__warning">
                  <i class="icon icon-alert-triangle"></i>
                  {{ $t('timeline.overdueWarning') }}
                </div>
              </div>
              
              <div class="timeline-event__actions">
                <button class="btn-icon" @click="editEvent(event)">
                  <i class="icon icon-edit"></i>
                </button>
                <button class="btn-icon" @click="deleteEvent(event)">
                  <i class="icon icon-trash"></i>
                </button>
                <button class="btn-icon" @click="toggleEventDetails(event)">
                  <i 
                    :class="[
                      'icon', 
                      expandedEvents.includes(event.id) ? 'icon-chevron-up' : 'icon-chevron-down'
                    ]"
                  ></i>
                </button>
              </div>
            </div>
            
            <div 
              v-if="filteredEvents(phase).length === 0" 
              class="empty-state"
            >
              {{ $t('timeline.noEventsInPhase') }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Event Modal -->
    <div class="modal" v-if="showEventModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isEditMode ? $t('timeline.editEvent') : $t('timeline.addEvent') }}</h3>
          <button class="btn-icon" @click="closeEventModal">
            <i class="icon icon-x"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>{{ $t('timeline.eventTitle') }} *</label>
            <input type="text" v-model="eventForm.title" required />
          </div>
          
          <div class="form-group">
            <label>{{ $t('timeline.eventDescription') }}</label>
            <textarea v-model="eventForm.description" rows="3"></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>{{ $t('timeline.phase') }} *</label>
              <select v-model="eventForm.phaseId" required>
                <option v-for="phase in phases" :key="phase.id" :value="phase.id">
                  {{ phase.name }}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label>{{ $t('timeline.date') }} *</label>
              <input type="date" v-model="eventForm.date" required />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>{{ $t('timeline.assignee') }}</label>
              <select v-model="eventForm.assignee">
                <option value="">{{ $t('common.none') }}</option>
                <option value="Braut">{{ $t('timeline.bride') }}</option>
                <option value="Bräutigam">{{ $t('timeline.groom') }}</option>
                <option value="Trauzeugin">{{ $t('timeline.maidOfHonor') }}</option>
                <option value="Trauzeuge">{{ $t('timeline.bestMan') }}</option>
                <option value="Beide">{{ $t('timeline.both') }}</option>
                <option value="Familie">{{ $t('timeline.family') }}</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>{{ $t('timeline.status') }} *</label>
              <select v-model="eventForm.status" required>
                <option value="upcoming">{{ $t('timeline.upcoming') }}</option>
                <option value="in_progress">{{ $t('timeline.inProgress') }}</option>
                <option value="completed">{{ $t('timeline.completed') }}</option>
              </select>
            </div>
          </div>
          
          <div class="form-group checkbox-group">
            <label>
              <input type="checkbox" v-model="eventForm.isMilestone" />
              {{ $t('timeline.markAsMilestone') }}
            </label>
          </div>
          
          <div class="form-group">
            <label>{{ $t('timeline.notes') }}</label>
            <textarea v-model="eventForm.notes" rows="2"></textarea>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeEventModal">
            {{ $t('common.cancel') }}
          </button>
          <button 
            class="btn btn-primary" 
            @click="saveEvent" 
            :disabled="!isEventFormValid"
          >
            {{ $t('common.save') }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Generate Timeline Modal -->
    <div class="modal" v-if="showGenerateModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ $t('timeline.generateTimeline') }}</h3>
          <button class="btn-icon" @click="closeGenerateModal">
            <i class="icon icon-x"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>{{ $t('timeline.weddingDate') }} *</label>
            <input type="date" v-model="generateForm.weddingDate" required />
          </div>
          
          <div class="form-group">
            <label>{{ $t('timeline.planningStartDate') }} *</label>
            <input type="date" v-model="generateForm.startDate" required />
          </div>
          
          <div class="form-group">
            <label>{{ $t('timeline.templateType') }}</label>
            <select v-model="generateForm.templateType">
              <option value="standard">{{ $t('timeline.standardWedding') }}</option>
              <option value="destination">{{ $t('timeline.destinationWedding') }}</option>
              <option value="intimate">{{ $t('timeline.intimateWedding') }}</option>
              <option value="elaborate">{{ $t('timeline.elaborateWedding') }}</option>
            </select>
          </div>
          
          <div class="form-group checkbox-group">
            <label>{{ $t('timeline.includePhases') }}</label>
            <div class="checkbox-list">
              <label>
                <input 
                  type="checkbox" 
                  v-model="generateForm.includePhases.planning" 
                />
                {{ $t('timeline.planningPhase') }}
              </label>
              <label>
                <input 
                  type="checkbox" 
                  v-model="generateForm.includePhases.vendors" 
                />
                {{ $t('timeline.vendorsPhase') }}
              </label>
              <label>
                <input 
                  type="checkbox" 
                  v-model="generateForm.includePhases.attire" 
                />
                {{ $t('timeline.attirePhase') }}
              </label>
              <label>
                <input 
                  type="checkbox" 
                  v-model="generateForm.includePhases.guests" 
                />
                {{ $t('timeline.guestsPhase') }}
              </label>
              <label>
                <input 
                  type="checkbox" 
                  v-model="generateForm.includePhases.ceremony" 
                />
                {{ $t('timeline.ceremonyPhase') }}
              </label>
              <label>
                <input 
                  type="checkbox" 
                  v-model="generateForm.includePhases.reception" 
                />
                {{ $t('timeline.receptionPhase') }}
              </label>
              <label>
                <input 
                  type="checkbox" 
                  v-model="generateForm.includePhases.honeymoon" 
                />
                {{ $t('timeline.honeymoonPhase') }}
              </label>
              <label>
                <input 
                  type="checkbox" 
                  v-model="generateForm.includePhases.postWedding" 
                />
                {{ $t('timeline.postWeddingPhase') }}
              </label>
            </div>
          </div>
          
          <div class="warning-message" v-if="showGenerateWarning">
            <i class="icon icon-alert-triangle"></i>
            {{ $t('timeline.generateWarning') }}
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeGenerateModal">
            {{ $t('common.cancel') }}
          </button>
          <button 
            class="btn btn-primary" 
            @click="confirmGenerateTimeline" 
            :disabled="!isGenerateFormValid"
          >
            {{ $t('timeline.generate') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Timeline',
  
  data() {
    return {
      // UI state
      expandedPhases: [],
      expandedEvents: [],
      showEventModal: false,
      showGenerateModal: false,
      isEditMode: false,
      showGenerateWarning: false,
      
      // Filters
      phaseFilter: 'all',
      statusFilter: 'all',
      searchQuery: '',
      
      // Phases
      phases: [
        { 
          id: 'planning', 
          name: this.$t('timeline.planningPhase'),
          order: 1
        },
        { 
          id: 'vendors', 
          name: this.$t('timeline.vendorsPhase'),
          order: 2
        },
        { 
          id: 'attire', 
          name: this.$t('timeline.attirePhase'),
          order: 3
        },
        { 
          id: 'guests', 
          name: this.$t('timeline.guestsPhase'),
          order: 4
        },
        { 
          id: 'ceremony', 
          name: this.$t('timeline.ceremonyPhase'),
          order: 5
        },
        { 
          id: 'reception', 
          name: this.$t('timeline.receptionPhase'),
          order: 6
        },
        { 
          id: 'honeymoon', 
          name: this.$t('timeline.honeymoonPhase'),
          order: 7
        },
        { 
          id: 'post_wedding', 
          name: this.$t('timeline.postWeddingPhase'),
          order: 8
        }
      ],
      
      // Events
      events: [],
      
      // Forms
      eventForm: this.getEmptyEventForm(),
      generateForm: this.getEmptyGenerateForm()
    };
  },
  
  computed: {
    // Filter phases based on the phase filter
    filteredPhases() {
      if (this.phaseFilter === 'all') {
        return this.phases.sort((a, b) => a.order - b.order);
      }
      
      return this.phases
        .filter(phase => phase.id === this.phaseFilter)
        .sort((a, b) => a.order - b.order);
    },
    
    // Calculate overall progress
    overallProgress() {
      if (this.events.length === 0) return 0;
      
      const completedEvents = this.events.filter(event => event.status === 'completed').length;
      return Math.round((completedEvents / this.events.length) * 100);
    },
    
    // Event form validation
    isEventFormValid() {
      return (
        this.eventForm.title.trim() !== '' &&
        this.eventForm.phaseId !== '' &&
        this.eventForm.date !== '' &&
        this.eventForm.status !== ''
      );
    },
    
    // Generate form validation
    isGenerateFormValid() {
      return (
        this.generateForm.weddingDate !== '' &&
        this.generateForm.startDate !== '' &&
        Object.values(this.generateForm.includePhases).some(value => value)
      );
    }
  },
  
  mounted() {
    // Load data
    this.loadEvents();
    
    // Expand all phases by default
    this.expandedPhases = this.phases.map(phase => phase.id);
  },
  
  methods: {
    // Data loading methods
    loadEvents() {
      // This would be replaced with actual Supabase query
      // In a real implementation, we would fetch data from the backend
      
      // For demo purposes, we'll use mock data
      this.events = [
        {
          id: '1',
          title: 'Hochzeitsdatum festlegen',
          description: 'Das Datum für die Hochzeit auswählen und reservieren.',
          phaseId: 'planning',
          date: '2024-09-15',
          assignee: 'Beide',
          status: 'completed',
          isMilestone: true,
          notes: ''
        },
        {
          id: '2',
          title: 'Budget festlegen',
          description: 'Gesamtbudget für die Hochzeit festlegen und auf Kategorien aufteilen.',
          phaseId: 'planning',
          date: '2024-09-20',
          assignee: 'Beide',
          status: 'completed',
          isMilestone: false,
          notes: ''
        },
        {
          id: '3',
          title: 'Location besichtigen',
          description: 'Potenzielle Locations für die Hochzeitsfeier besichtigen.',
          phaseId: 'planning',
          date: '2024-10-05',
          assignee: 'Beide',
          status: 'completed',
          isMilestone: false,
          notes: 'Drei Locations besichtigt: Schloss Schönbrunn, Palais Coburg, Hofburg'
        },
        {
          id: '4',
          title: 'Location buchen',
          description: 'Endgültige Location auswählen und verbindlich buchen.',
          phaseId: 'planning',
          date: '2024-10-15',
          assignee: 'Braut',
          status: 'completed',
          isMilestone: true,
          notes: 'Schloss Schönbrunn gebucht'
        },
        {
          id: '5',
          title: 'Fotografen buchen',
          description: 'Fotografen für die Hochzeit auswählen und buchen.',
          phaseId: 'vendors',
          date: '2024-11-10',
          assignee: 'Bräutigam',
          status: 'completed',
          isMilestone: false,
          notes: ''
        },
        {
          id: '6',
          title: 'Catering auswählen',
          description: 'Catering-Service für die Hochzeit auswählen und Menü besprechen.',
          phaseId: 'vendors',
          date: '2024-11-20',
          assignee: 'Beide',
          status: 'completed',
          isMilestone: false,
          notes: ''
        },
        {
          id: '7',
          title: 'DJ/Band buchen',
          description: 'Musikalische Unterhaltung für die Hochzeit organisieren.',
          phaseId: 'vendors',
          date: '2024-12-05',
          assignee: 'Bräutigam',
          status: 'completed',
          isMilestone: false,
          notes: ''
        },
        {
          id: '8',
          title: 'Brautkleid Shopping',
          description: 'Termine in Brautmodengeschäften vereinbaren und Brautkleid auswählen.',
          phaseId: 'attire',
          date: '2025-01-15',
          assignee: 'Braut',
          status: 'completed',
          isMilestone: false,
          notes: ''
        },
        {
          id: '9',
          title: 'Anzug auswählen',
          description: 'Anzug für den Bräutigam auswählen und anpassen lassen.',
          phaseId: 'attire',
          date: '2025-02-10',
          assignee: 'Bräutigam',
          status: 'completed',
          isMilestone: false,
          notes: ''
        },
        {
          id: '10',
          title: 'Gästeliste erstellen',
          description: 'Vollständige Gästeliste mit Kontaktdaten erstellen.',
          phaseId: 'guests',
          date: '2024-12-15',
          assignee: 'Beide',
          status: 'completed',
          isMilestone: false,
          notes: ''
        },
        {
          id: '11',
          title: 'Save-the-Date versenden',
          description: 'Save-the-Date Karten an alle Gäste versenden.',
          phaseId: 'guests',
          date: '2025-01-05',
          assignee: 'Braut',
          status: 'completed',
          isMilestone: true,
          notes: ''
        },
        {
          id: '12',
          title: 'Einladungen versenden',
          description: 'Offizielle Einladungen an alle Gäste versenden.',
          phaseId: 'guests',
          date: '2025-03-15',
          assignee: 'Braut',
          status: 'in_progress',
          isMilestone: true,
          notes: ''
        },
        {
          id: '13',
          title: 'Standesamt Termin vereinbaren',
          description: 'Termin beim Standesamt für die standesamtliche Trauung vereinbaren.',
          phaseId: 'ceremony',
          date: '2025-01-20',
          assignee: 'Beide',
          status: 'completed',
          isMilestone: false,
          notes: ''
        },
        {
          id: '14',
          title: 'Kirche buchen',
          description: 'Kirche für die kirchliche Trauung buchen und Details besprechen.',
          phaseId: 'ceremony',
          date: '2025-02-05',
          assignee: 'Beide',
          status: 'completed',
          isMilestone: false,
          notes: ''
        },
        {
          id: '15',
          title: 'Trauringe auswählen',
          description: 'Trauringe auswählen und bestellen.',
          phaseId: 'ceremony',
          date: '2025-03-10',
          assignee: 'Beide',
          status: 'in_progress',
          isMilestone: false,
          notes: ''
        },
        {
          id: '16',
          title: 'Menü finalisieren',
          description: 'Endgültiges Menü mit dem Caterer besprechen und festlegen.',
          phaseId: 'reception',
          date: '2025-04-15',
          assignee: 'Beide',
          status: 'upcoming',
          isMilestone: false,
          notes: ''
        },
        {
          id: '17',
          title: 'Sitzordnung planen',
          description: 'Sitzordnung für die Hochzeitsfeier planen.',
          phaseId: 'reception',
          date: '2025-05-15',
          assignee: 'Beide',
          status: 'upcoming',
          isMilestone: false,
          notes: ''
        },
        {
          id: '18',
          title: 'Hochzeitstorte bestellen',
          description: 'Hochzeitstorte auswählen und bestellen.',
          phaseId: 'reception',
          date: '2025-04-20',
          assignee: 'Braut',
          status: 'upcoming',
          isMilestone: false,
          notes: ''
        },
        {
          id: '19',
          title: 'Flitterwochen planen',
          description: 'Reiseziel für die Flitterwochen auswählen und buchen.',
          phaseId: 'honeymoon',
          date: '2025-02-15',
          assignee: 'Bräutigam',
          status: 'completed',
          isMilestone: false,
          notes: 'Malediven gebucht'
        },
        {
          id: '20',
          title: 'Danksagungen vorbereiten',
          description: 'Danksagungskarten vorbereiten, die nach der Hochzeit verschickt werden.',
          phaseId: 'post_wedding',
          date: '2025-05-20',
          assignee: 'Braut',
          status: 'upcoming',
          isMilestone: false,
          notes: ''
        }
      ];
      
      // Update event status based on date
      const today = new Date();
      this.events.forEach(event => {
        const eventDate = new Date(event.date);
        
        if (event.status !== 'completed' && eventDate < today) {
          event.status = 'overdue';
        }
      });
    },
    
    // UI interaction methods
    togglePhase(phaseId) {
      if (this.expandedPhases.includes(phaseId)) {
        this.expandedPhases = this.expandedPhases.filter(id => id !== phaseId);
      } else {
        this.expandedPhases.push(phaseId);
      }
    },
    
    toggleEventDetails(event) {
      if (this.expandedEvents.includes(event.id)) {
        this.expandedEvents = this.expandedEvents.filter(id => id !== event.id);
      } else {
        this.expandedEvents.push(event.id);
      }
    },
    
    // Event methods
    filteredEvents(phase) {
      return this.events
        .filter(event => event.phaseId === phase.id)
        .filter(event => {
          // Apply status filter
          if (this.statusFilter !== 'all' && event.status !== this.statusFilter) {
            return false;
          }
          
          // Apply search filter
          if (this.searchQuery.trim() !== '') {
            const query = this.searchQuery.toLowerCase();
            return (
              event.title.toLowerCase().includes(query) ||
              (event.description && event.description.toLowerCase().includes(query)) ||
              (event.notes && event.notes.toLowerCase().includes(query))
            );
          }
          
          return true;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    },
    
    getPhaseProgress(phase) {
      const phaseEvents = this.events.filter(event => event.phaseId === phase.id);
      
      if (phaseEvents.length === 0) return 0;
      
      const completedEvents = phaseEvents.filter(event => event.status === 'completed').length;
      return Math.round((completedEvents / phaseEvents.length) * 100);
    },
    
    toggleEventStatus(event) {
      event.status = event.status === 'completed' ? 'in_progress' : 'completed';
    },
    
    showAddEventModal() {
      this.isEditMode = false;
      this.eventForm = this.getEmptyEventForm();
      this.showEventModal = true;
    },
    
    editEvent(event) {
      this.isEditMode = true;
      this.eventForm = { ...event };
      this.showEventModal = true;
    },
    
    closeEventModal() {
      this.showEventModal = false;
    },
    
    saveEvent() {
      if (!this.isEventFormValid) return;
      
      if (this.isEditMode) {
        // Update existing event
        const index = this.events.findIndex(e => e.id === this.eventForm.id);
        if (index !== -1) {
          this.events.splice(index, 1, { ...this.eventForm });
        }
      } else {
        // Add new event
        const newEvent = {
          ...this.eventForm,
          id: Date.now().toString()
        };
        
        this.events.push(newEvent);
      }
      
      this.closeEventModal();
    },
    
    deleteEvent(event) {
      if (!confirm(this.$t('timeline.confirmDeleteEvent'))) {
        return;
      }
      
      this.events = this.events.filter(e => e.id !== event.id);
    },
    
    // Generate timeline methods
    generateTimeline() {
      this.generateForm = this.getEmptyGenerateForm();
      this.showGenerateWarning = this.events.length > 0;
      this.showGenerateModal = true;
    },
    
    closeGenerateModal() {
      this.showGenerateModal = false;
    },
    
    confirmGenerateTimeline() {
      if (!this.isGenerateFormValid) return;
      
      if (this.events.length > 0) {
        if (!confirm(this.$t('timeline.confirmReplaceTimeline'))) {
          return;
        }
      }
      
      // Generate timeline based on form data
      this.events = this.generateTimelineEvents();
      this.closeGenerateModal();
    },
    
    generateTimelineEvents() {
      const weddingDate = new Date(this.generateForm.weddingDate);
      const startDate = new Date(this.generateForm.startDate);
      const templateType = this.generateForm.templateType;
      const includePhases = this.generateForm.includePhases;
      
      // Calculate total planning period in days
      const totalDays = Math.floor((weddingDate - startDate) / (1000 * 60 * 60 * 24));
      
      // Generate events based on template and phases
      const generatedEvents = [];
      let eventId = 1;
      
      // Planning phase
      if (includePhases.planning) {
        generatedEvents.push({
          id: (eventId++).toString(),
          title: 'Hochzeitsdatum festlegen',
          description: 'Das Datum für die Hochzeit auswählen und reservieren.',
          phaseId: 'planning',
          date: this.formatDateForInput(startDate),
          assignee: 'Beide',
          status: 'completed',
          isMilestone: true,
          notes: ''
        });
        
        generatedEvents.push({
          id: (eventId++).toString(),
          title: 'Budget festlegen',
          description: 'Gesamtbudget für die Hochzeit festlegen und auf Kategorien aufteilen.',
          phaseId: 'planning',
          date: this.formatDateForInput(this.addDays(startDate, 5)),
          assignee: 'Beide',
          status: 'upcoming',
          isMilestone: false,
          notes: ''
        });
        
        generatedEvents.push({
          id: (eventId++).toString(),
          title: 'Location besichtigen',
          description: 'Potenzielle Locations für die Hochzeitsfeier besichtigen.',
          phaseId: 'planning',
          date: this.formatDateForInput(this.addDays(startDate, 20)),
          assignee: 'Beide',
          status: 'upcoming',
          isMilestone: false,
          notes: ''
        });
        
        generatedEvents.push({
          id: (eventId++).toString(),
          title: 'Location buchen',
          description: 'Endgültige Location auswählen und verbindlich buchen.',
          phaseId: 'planning',
          date: this.formatDateForInput(this.addDays(startDate, 30)),
          assignee: 'Beide',
          status: 'upcoming',
          isMilestone: true,
          notes: ''
        });
      }
      
      // Vendors phase
      if (includePhases.vendors) {
        generatedEvents.push({
          id: (eventId++).toString(),
          title: 'Fotografen buchen',
          description: 'Fotografen für die Hochzeit auswählen und buchen.',
          phaseId: 'vendors',
          date: this.formatDateForInput(this.addDays(startDate, 45)),
          assignee: 'Beide',
          status: 'upcoming',
          isMilestone: false,
          notes: ''
        });
        
        generatedEvents.push({
          id: (eventId++).toString(),
          title: 'Catering auswählen',
          description: 'Catering-Service für die Hochzeit auswählen und Menü besprechen.',
          phaseId: 'vendors',
          date: this.formatDateForInput(this.addDays(startDate, 60)),
          assignee: 'Beide',
          status: 'upcoming',
          isMilestone: false,
          notes: ''
        });
        
        generatedEvents.push({
          id: (eventId++).toString(),
          title: 'DJ/Band buchen',
          description: 'Musikalische Unterhaltung für die Hochzeit organisieren.',
          phaseId: 'vendors',
          date: this.formatDateForInput(this.addDays(startDate, 75)),
          assignee: 'Bräutigam',
          status: 'upcoming',
          isMilestone: false,
          notes: ''
        });
        
        if (templateType === 'elaborate') {
          generatedEvents.push({
            id: (eventId++).toString(),
            title: 'Floristen buchen',
            description: 'Floristen für die Hochzeitsdekoration auswählen und buchen.',
            phaseId: 'vendors',
            date: this.formatDateForInput(this.addDays(startDate, 90)),
            assignee: 'Braut',
            status: 'upcoming',
            isMilestone: false,
            notes: ''
          });
          
          generatedEvents.push({
            id: (eventId++).toString(),
            title: 'Videografen buchen',
            description: 'Videografen für die Hochzeit auswählen und buchen.',
            phaseId: 'vendors',
            date: this.formatDateForInput(this.addDays(startDate, 100)),
            assignee: 'Bräutigam',
            status: 'upcoming',
            isMilestone: false,
            notes: ''
          });
        }
      }
      
      // Attire phase
      if (includePhases.attire) {
        generatedEvents.push({
          id: (eventId++).toString(),
          title: 'Brautkleid Shopping',
          description: 'Termine in Brautmodengeschäften vereinbaren und Brautkleid auswählen.',
          phaseId: 'attire',
          date: this.formatDateForInput(this.addDays(startDate, 120)),
          assignee: 'Braut',
          status: 'upcoming',
          isMilestone: false,
          notes: ''
        });
        
        generatedEvents.push({
          id: (eventId++).toString(),
          title: 'Anzug auswählen',
          description: 'Anzug für den Bräutigam auswählen und anpassen lassen.',
          phaseId: 'attire',
          date: this.formatDateForInput(this.addDays(startDate, 150)),
          assignee: 'Bräutigam',
          status: 'upcoming',
          isMilestone: false,
          notes: ''
        });
        
        if (templateType === 'elaborate' || templateType === 'standard') {
          generatedEvents.push({
            id: (eventId++).toString(),
            title: 'Outfits für Trauzeugen',
            description: 'Outfits für Trauzeugen und Brautjungfern auswählen.',
            phaseId: 'attire',
            date: this.formatDateForInput(this.addDays(startDate, 180)),
            assignee: 'Beide',
            status: 'upcoming',
            isMilestone: false,
            notes: ''
          });
        }
      }
      
      // Guests phase
      if (includePhases.guests) {
        generatedEvents.push({
          id: (eventId++).toString(),
          title: 'Gästeliste erstellen',
          description: 'Vollständige Gästeliste mit Kontaktdaten erstellen.',
          phaseId: 'guests',
          date: this.formatDateForInput(this.addDays(startDate, 60)),
          assignee: 'Beide',
          status: 'upcoming',
          isMilestone: false,
          notes: ''
        });
        
        // Calculate when to send save-the-dates (typically 6-8 months before wedding)
        const saveTheDateDate = new Date(weddingDate);
        saveTheDateDate.setMonth(saveTheDateDate.getMonth() - 8);
        if (saveTheDateDate < startDate) {
          saveTheDateDate.setTime(startDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week after start
        }
        
        generatedEvents.push({
          id: (eventId++).toString(),
          title: 'Save-the-Date versenden',
          description: 'Save-the-Date Karten an alle Gäste versenden.',
          phaseId: 'guests',
          date: this.formatDateForInput(saveTheDateDate),
          assignee: 'Beide',
          status: 'upcoming',
          isMilestone: true,
          notes: ''
        });
        
        // Calculate when to send invitations (typically 2-3 months before wedding)
        const invitationDate = new Date(weddingDate);
        invitationDate.setMonth(invitationDate.getMonth() - 3);
        
        generatedEvents.push({
          id: (eventId++).toString(),
          title: 'Einladungen versenden',
          description: 'Offizielle Einladungen an alle Gäste versenden.',
          phaseId: 'guests',
          date: this.formatDateForInput(invitationDate),
          assignee: 'Beide',
          status: 'upcoming',
          isMilestone: true,
          notes: ''
        });
        
        // RSVP deadline (typically 1 month before wedding)
        const rsvpDate = new Date(weddingDate);
        rsvpDate.setMonth(rsvpDate.getMonth() - 1);
        
        generatedEvents.push({
          id: (eventId++).toString(),
          title: 'RSVP Deadline',
          description: 'Deadline für die Rückmeldung der Gäste.',
          phaseId: 'guests',
          date: this.formatDateForInput(rsvpDate),
          assignee: 'Beide',
          status: 'upcoming',
          isMilestone: true,
          notes: ''
        });
      }
      
      // Ceremony phase
      if (includePhases.ceremony) {
        // Calculate when to book the ceremony venue (typically 9-12 months before wedding)
        const ceremonyBookingDate = new Date(weddingDate);
        ceremonyBookingDate.setMonth(ceremonyBookingDate.getMonth() - 12);
        if (ceremonyBookingDate < startDate) {
          ceremonyBookingDate.setTime(startDate.getTime() + 14 * 24 * 60 * 60 * 1000); // 2 weeks after start
        }
        
        generatedEvents.push({
          id: (eventId++).toString(),
          title: 'Standesamt Termin vereinbaren',
          description: 'Termin beim Standesamt für die standesamtliche Trauung vereinbaren.',
          phaseId: 'ceremony',
          date: this.formatDateForInput(ceremonyBookingDate),
          assignee: 'Beide',
          status: 'upcoming',
          isMilestone: false,
          notes: ''
        });
        
        if (templateType !== 'intimate') {
          generatedEvents.push({
            id: (eventId++).toString(),
            title: 'Kirche buchen',
            description: 'Kirche für die kirchliche Trauung buchen und Details besprechen.',
            phaseId: 'ceremony',
            date: this.formatDateForInput(this.addDays(ceremonyBookingDate, 15)),
            assignee: 'Beide',
            status: 'upcoming',
            isMilestone: false,
            notes: ''
          });
        }
        
        // Wedding rings (typically 3-4 months before wedding)
        const ringsDate = new Date(weddingDate);
        ringsDate.setMonth(ringsDate.getMonth() - 4);
        if (ringsDate < startDate) {
          ringsDate.setTime(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 1 month after start
        }
        
        generatedEvents.push({
          id: (eventId++).toString(),
          title: 'Trauringe auswählen',
          description: 'Trauringe auswählen und bestellen.',
          phaseId: 'ceremony',
          date: this.formatDateForInput(ringsDate),
          assignee: 'Beide',
          status: 'upcoming',
          isMilestone: false,
          notes: ''
        });
      }
      
      // Reception phase
      if (includePhases.reception) {
        // Menu finalization (typically 2-3 months before wedding)
        const menuDate = new Date(weddingDate);
        menuDate.setMonth(menuDate.getMonth() - 3);
        
        generatedEvents.push({
          id: (eventId++).toString(),
          title: 'Menü finalisieren',
          description: 'Endgültiges Menü mit dem Caterer besprechen und festlegen.',
          phaseId: 'reception',
          date: this.formatDateForInput(menuDate),
          assignee: 'Beide',
          status: 'upcoming',
          isMilestone: false,
          notes: ''
        });
        
        // Wedding cake (typically 2-3 months before wedding)
        const cakeDate = new Date(weddingDate);
        cakeDate.setMonth(cakeDate.getMonth() - 2);
        cakeDate.setDate(cakeDate.getDate() - 15);
        
        generatedEvents.push({
          id: (eventId++).toString(),
          title: 'Hochzeitstorte bestellen',
          description: 'Hochzeitstorte auswählen und bestellen.',
          phaseId: 'reception',
          date: this.formatDateForInput(cakeDate),
          assignee: 'Braut',
          status: 'upcoming',
          isMilestone: false,
          notes: ''
        });
        
        // Seating plan (typically 2-4 weeks before wedding)
        const seatingDate = new Date(weddingDate);
        seatingDate.setDate(seatingDate.getDate() - 21);
        
        generatedEvents.push({
          id: (eventId++).toString(),
          title: 'Sitzordnung planen',
          description: 'Sitzordnung für die Hochzeitsfeier planen.',
          phaseId: 'reception',
          date: this.formatDateForInput(seatingDate),
          assignee: 'Beide',
          status: 'upcoming',
          isMilestone: false,
          notes: ''
        });
        
        if (templateType === 'elaborate') {
          generatedEvents.push({
            id: (eventId++).toString(),
            title: 'Dekoration finalisieren',
            description: 'Endgültige Dekoration für die Hochzeitsfeier planen und bestellen.',
            phaseId: 'reception',
            date: this.formatDateForInput(this.addDays(seatingDate, -30)),
            assignee: 'Braut',
            status: 'upcoming',
            isMilestone: false,
            notes: ''
          });
        }
      }
      
      // Honeymoon phase
      if (includePhases.honeymoon) {
        // Honeymoon planning (typically 4-6 months before wedding)
        const honeymoonPlanDate = new Date(weddingDate);
        honeymoonPlanDate.setMonth(honeymoonPlanDate.getMonth() - 6);
        if (honeymoonPlanDate < startDate) {
          honeymoonPlanDate.setTime(startDate.getTime() + 60 * 24 * 60 * 60 * 1000); // 2 months after start
        }
        
        generatedEvents.push({
          id: (eventId++).toString(),
          title: 'Flitterwochen planen',
          description: 'Reiseziel für die Flitterwochen auswählen und buchen.',
          phaseId: 'honeymoon',
          date: this.formatDateForInput(honeymoonPlanDate),
          assignee: 'Beide',
          status: 'upcoming',
          isMilestone: false,
          notes: ''
        });
        
        if (templateType === 'destination') {
          generatedEvents.push({
            id: (eventId++).toString(),
            title: 'Reisedokumente prüfen',
            description: 'Reisepässe und andere notwendige Dokumente für die Flitterwochen prüfen.',
            phaseId: 'honeymoon',
            date: this.formatDateForInput(this.addDays(honeymoonPlanDate, 30)),
            assignee: 'Bräutigam',
            status: 'upcoming',
            isMilestone: false,
            notes: ''
          });
        }
      }
      
      // Post-wedding phase
      if (includePhases.postWedding) {
        // Thank you cards (typically 2-4 weeks after wedding)
        const thankYouDate = new Date(weddingDate);
        thankYouDate.setDate(thankYouDate.getDate() + 14);
        
        generatedEvents.push({
          id: (eventId++).toString(),
          title: 'Danksagungen versenden',
          description: 'Danksagungskarten an alle Gäste versenden.',
          phaseId: 'post_wedding',
          date: this.formatDateForInput(thankYouDate),
          assignee: 'Beide',
          status: 'upcoming',
          isMilestone: false,
          notes: ''
        });
        
        // Name change (if applicable)
        const nameChangeDate = new Date(weddingDate);
        nameChangeDate.setDate(nameChangeDate.getDate() + 30);
        
        generatedEvents.push({
          id: (eventId++).toString(),
          title: 'Namensänderung beantragen',
          description: 'Namensänderung bei Behörden beantragen (falls zutreffend).',
          phaseId: 'post_wedding',
          date: this.formatDateForInput(nameChangeDate),
          assignee: 'Beide',
          status: 'upcoming',
          isMilestone: false,
          notes: ''
        });
      }
      
      // Update event status based on current date
      const today = new Date();
      generatedEvents.forEach(event => {
        const eventDate = new Date(event.date);
        
        if (eventDate < today) {
          event.status = 'completed';
        }
      });
      
      return generatedEvents;
    },
    
    // Utility methods
    getEmptyEventForm() {
      return {
        id: '',
        title: '',
        description: '',
        phaseId: this.phases.length > 0 ? this.phases[0].id : '',
        date: '',
        assignee: '',
        status: 'upcoming',
        isMilestone: false,
        notes: ''
      };
    },
    
    getEmptyGenerateForm() {
      return {
        weddingDate: '',
        startDate: '',
        templateType: 'standard',
        includePhases: {
          planning: true,
          vendors: true,
          attire: true,
          guests: true,
          ceremony: true,
          reception: true,
          honeymoon: true,
          postWedding: true
        }
      };
    },
    
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('de-DE');
    },
    
    formatDateForInput(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    
    addDays(date, days) {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    }
  }
};
</script>

<style scoped>
.timeline {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #FFF9EB;
}

.timeline__header {
  padding: 24px;
  background-color: #FFFFFF;
  border-bottom: 1px solid #F2F2F2;
}

.timeline__content {
  flex: 1;
  padding: 24px;
  overflow: auto;
}

.timeline__actions {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.timeline__filters {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #4F4F4F;
}

.filter-group select,
.filter-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #BDBDBD;
  border-radius: 8px;
  font-family: inherit;
  font-size: inherit;
}

.search-input {
  position: relative;
}

.search-input i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #4F4F4F;
}

.search-input input {
  padding-left: 36px;
}

.timeline__progress {
  margin-bottom: 24px;
}

.progress-bar {
  display: flex;
  align-items: center;
  gap: 16px;
}

.progress-bar__label {
  min-width: 150px;
  font-weight: 500;
}

.progress-bar__container {
  flex: 1;
  height: 8px;
  background-color: #F2F2F2;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;
  background-color: #06D6A0;
  border-radius: 4px;
}

.progress-bar__percentage {
  min-width: 50px;
  text-align: right;
  font-weight: 500;
}

.timeline__phases {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.timeline-phase {
  background-color: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.timeline-phase__header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background-color: #F9F9F9;
}

.timeline-phase__title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.timeline-phase__progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.timeline-phase__progress .progress-bar__container {
  width: 100px;
}

.timeline-phase__events {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.timeline-event {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  border-radius: 8px;
  background-color: #F9F9F9;
  border-left: 4px solid #BDBDBD;
}

.timeline-event.status-completed {
  border-left-color: #06D6A0;
}

.timeline-event.status-in_progress {
  border-left-color: #FFD166;
}

.timeline-event.status-upcoming {
  border-left-color: #073B4C;
}

.timeline-event.status-overdue {
  border-left-color: #EF476F;
}

.timeline-event.milestone {
  background-color: #FFF9EB;
}

.timeline-event__checkbox {
  margin-right: 16px;
  margin-top: 4px;
}

.timeline-event__content {
  flex: 1;
}

.timeline-event__title {
  font-weight: 500;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.milestone-badge {
  background-color: #FFD166;
  color: #073B4C;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: normal;
}

.timeline-event__details {
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #4F4F4F;
}

.timeline-event__date,
.timeline-event__assignee {
  display: flex;
  align-items: center;
  gap: 4px;
}

.timeline-event__description {
  font-size: 14px;
  color: #4F4F4F;
  margin-bottom: 8px;
}

.timeline-event__warning {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #EF476F;
}

.timeline-event__actions {
  display: flex;
  gap: 8px;
}

.empty-state {
  padding: 16px;
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

.checkbox-group label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
  margin-right: 8px;
}

.checkbox-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.warning-message {
  margin-top: 16px;
  padding: 12px;
  background-color: #FFF3CD;
  border-radius: 8px;
  color: #856404;
  display: flex;
  align-items: center;
  gap: 8px;
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

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 8px;
  }
  
  .timeline__filters {
    flex-direction: column;
    gap: 8px;
  }
  
  .timeline-phase__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .timeline-phase__progress {
    width: 100%;
  }
  
  .timeline-phase__progress .progress-bar__container {
    width: 100%;
  }
  
  .timeline-event__details {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
