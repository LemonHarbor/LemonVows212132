<template>
  <div class="dashboard">
    <div class="dashboard__header">
      <h1>{{ $t('dashboard.welcome', { names: coupleNames }) }}</h1>
      <p>{{ $t('dashboard.weddingDate', { date: formatWeddingDate(weddingDate) }) }}</p>
      
      <div class="dashboard__language-selector">
        <button 
          v-for="lang in availableLanguages" 
          :key="lang.code" 
          class="language-button" 
          :class="{ active: currentLanguage === lang.code }"
          @click="changeLanguage(lang.code)"
        >
          {{ lang.name }}
        </button>
      </div>
    </div>
    
    <div class="dashboard__content">
      <div class="dashboard__main">
        <div class="dashboard__countdown-card">
          <div class="countdown">
            <h2>{{ $t('dashboard.countdown') }}</h2>
            <div class="countdown__timer">
              <div class="countdown__item">
                <div class="countdown__value">{{ countdown.days }}</div>
                <div class="countdown__label">{{ $t('dashboard.days') }}</div>
              </div>
              <div class="countdown__item">
                <div class="countdown__value">{{ countdown.hours }}</div>
                <div class="countdown__label">{{ $t('dashboard.hours') }}</div>
              </div>
              <div class="countdown__item">
                <div class="countdown__value">{{ countdown.minutes }}</div>
                <div class="countdown__label">{{ $t('dashboard.minutes') }}</div>
              </div>
              <div class="countdown__item">
                <div class="countdown__value">{{ countdown.seconds }}</div>
                <div class="countdown__label">{{ $t('dashboard.seconds') }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="dashboard__stats-row">
          <div class="dashboard__stat-card">
            <div class="stat-card">
              <div class="stat-card__icon">
                <i class="icon icon-users"></i>
              </div>
              <div class="stat-card__content">
                <div class="stat-card__value">{{ guestStats.total }}</div>
                <div class="stat-card__label">{{ $t('dashboard.totalGuests') }}</div>
              </div>
              <div class="stat-card__footer">
                <div class="stat-card__detail">
                  <span class="confirmed">{{ guestStats.confirmed }}</span> {{ $t('dashboard.confirmed') }}
                </div>
                <div class="stat-card__detail">
                  <span class="pending">{{ guestStats.pending }}</span> {{ $t('dashboard.pending') }}
                </div>
              </div>
            </div>
          </div>
          
          <div class="dashboard__stat-card">
            <div class="stat-card">
              <div class="stat-card__icon">
                <i class="icon icon-dollar-sign"></i>
              </div>
              <div class="stat-card__content">
                <div class="stat-card__value">{{ formatCurrency(budgetStats.spent) }}</div>
                <div class="stat-card__label">{{ $t('dashboard.budgetSpent') }}</div>
              </div>
              <div class="stat-card__footer">
                <div class="stat-card__detail">
                  {{ $t('dashboard.from') }} <span class="total">{{ formatCurrency(budgetStats.total) }}</span>
                </div>
                <div class="stat-card__detail">
                  <span :class="budgetStats.remaining > 0 ? 'remaining' : 'over-budget'">
                    {{ formatCurrency(budgetStats.remaining) }}
                  </span> {{ $t('dashboard.remaining') }}
                </div>
              </div>
            </div>
          </div>
          
          <div class="dashboard__stat-card">
            <div class="stat-card">
              <div class="stat-card__icon">
                <i class="icon icon-check-square"></i>
              </div>
              <div class="stat-card__content">
                <div class="stat-card__value">{{ taskStats.completed }}</div>
                <div class="stat-card__label">{{ $t('dashboard.completedTasks') }}</div>
              </div>
              <div class="stat-card__footer">
                <div class="stat-card__detail">
                  {{ $t('dashboard.outOf') }} <span class="total">{{ taskStats.total }}</span> {{ $t('dashboard.tasks') }}
                </div>
                <div class="stat-card__detail">
                  <span class="pending">{{ taskStats.upcoming }}</span> {{ $t('dashboard.upcoming') }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="dashboard__widgets-row">
          <div class="dashboard__widget dashboard__widget--double">
            <div class="widget">
              <div class="widget__header">
                <h3>{{ $t('dashboard.upcomingTasks') }}</h3>
                <button class="btn-link" @click="navigateTo('/zeitplan')">
                  {{ $t('dashboard.viewAll') }}
                </button>
              </div>
              <div class="widget__content">
                <div class="task-list">
                  <div v-for="task in upcomingTasks" :key="task.id" class="task-item">
                    <div class="task-item__checkbox">
                      <input type="checkbox" :checked="task.completed" @change="toggleTask(task.id)" />
                    </div>
                    <div class="task-item__content">
                      <div class="task-item__title">{{ task.title }}</div>
                      <div class="task-item__due-date">{{ formatDate(task.dueDate) }}</div>
                    </div>
                    <div class="task-item__priority" :class="`priority-${task.priority}`">
                      {{ getPriorityLabel(task.priority) }}
                    </div>
                  </div>
                  <div v-if="upcomingTasks.length === 0" class="empty-state">
                    {{ $t('dashboard.noUpcomingTasks') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="dashboard__widget">
            <div class="widget">
              <div class="widget__header">
                <h3>{{ $t('dashboard.weather') }}</h3>
              </div>
              <div class="widget__content">
                <div class="weather-widget">
                  <div v-if="weather.loading" class="weather-widget__loading">
                    {{ $t('dashboard.loadingWeather') }}
                  </div>
                  <div v-else-if="weather.error" class="weather-widget__error">
                    {{ $t('dashboard.weatherError') }}
                  </div>
                  <div v-else class="weather-widget__content">
                    <div class="weather-widget__location">{{ weather.location }}</div>
                    <div class="weather-widget__date">{{ formatDate(weddingDate) }}</div>
                    <div class="weather-widget__forecast">
                      <div class="weather-widget__icon">
                        <img :src="getWeatherIcon(weather.condition)" :alt="weather.condition" />
                      </div>
                      <div class="weather-widget__temp">{{ weather.temperature }}°C</div>
                    </div>
                    <div class="weather-widget__condition">{{ weather.condition }}</div>
                    <div class="weather-widget__details">
                      <div class="weather-widget__detail">
                        <i class="icon icon-droplet"></i> {{ weather.humidity }}%
                      </div>
                      <div class="weather-widget__detail">
                        <i class="icon icon-wind"></i> {{ weather.wind }} km/h
                      </div>
                    </div>
                    <div class="weather-widget__disclaimer">
                      {{ $t('dashboard.weatherDisclaimer') }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="dashboard__widgets-row">
          <div class="dashboard__widget">
            <div class="widget">
              <div class="widget__header">
                <h3>{{ $t('dashboard.recentRSVPs') }}</h3>
                <button class="btn-link" @click="navigateTo('/gaesteliste')">
                  {{ $t('dashboard.viewAll') }}
                </button>
              </div>
              <div class="widget__content">
                <div class="rsvp-list">
                  <div v-for="rsvp in recentRSVPs" :key="rsvp.id" class="rsvp-item">
                    <div class="rsvp-item__avatar">
                      <div class="avatar" :style="{ backgroundColor: getGroupColor(rsvp.group) }">
                        {{ getInitials(rsvp) }}
                      </div>
                    </div>
                    <div class="rsvp-item__content">
                      <div class="rsvp-item__name">{{ rsvp.firstName }} {{ rsvp.lastName }}</div>
                      <div class="rsvp-item__date">{{ formatDateTime(rsvp.rsvpDate) }}</div>
                    </div>
                    <div class="rsvp-item__status" :class="`status-${rsvp.status}`">
                      {{ getRSVPStatusLabel(rsvp.status) }}
                    </div>
                  </div>
                  <div v-if="recentRSVPs.length === 0" class="empty-state">
                    {{ $t('dashboard.noRecentRSVPs') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="dashboard__widget">
            <div class="widget">
              <div class="widget__header">
                <h3>{{ $t('dashboard.quickLinks') }}</h3>
              </div>
              <div class="widget__content">
                <div class="quick-links">
                  <button 
                    v-for="link in quickLinks" 
                    :key="link.path" 
                    class="quick-link-button"
                    @click="navigateTo(link.path)"
                  >
                    <i :class="`icon icon-${link.icon}`"></i>
                    <span>{{ link.label }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="dashboard__sidebar">
        <div class="dashboard__sidebar-widget">
          <div class="widget">
            <div class="widget__header">
              <h3>{{ $t('dashboard.weddingLocation') }}</h3>
            </div>
            <div class="widget__content">
              <div class="location-widget">
                <div class="location-widget__map">
                  <!-- This would be replaced with an actual map component -->
                  <div class="map-placeholder">
                    <i class="icon icon-map-pin"></i>
                  </div>
                </div>
                <div class="location-widget__details">
                  <div class="location-widget__name">{{ weddingLocation.name }}</div>
                  <div class="location-widget__address">{{ weddingLocation.address }}</div>
                  <button class="btn btn-small" @click="openMap">
                    {{ $t('dashboard.openInMaps') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="dashboard__sidebar-widget">
          <div class="widget">
            <div class="widget__header">
              <h3>{{ $t('dashboard.budgetOverview') }}</h3>
              <button class="btn-link" @click="navigateTo('/budget')">
                {{ $t('dashboard.viewDetails') }}
              </button>
            </div>
            <div class="widget__content">
              <div class="budget-widget">
                <div class="budget-widget__progress">
                  <div class="circular-progress">
                    <svg width="120" height="120" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="#F2F2F2"
                        stroke-width="12"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        :stroke="getBudgetStatusColor()"
                        stroke-width="12"
                        stroke-dasharray="339.292"
                        :stroke-dashoffset="getBudgetProgressOffset()"
                        transform="rotate(-90 60 60)"
                      />
                    </svg>
                    <div class="circular-progress__content">
                      <div class="circular-progress__percentage">{{ getBudgetPercentage() }}%</div>
                      <div class="circular-progress__label">{{ $t('dashboard.spent') }}</div>
                    </div>
                  </div>
                </div>
                <div class="budget-widget__details">
                  <div class="budget-widget__item">
                    <div class="budget-widget__label">{{ $t('dashboard.totalBudget') }}</div>
                    <div class="budget-widget__value">{{ formatCurrency(budgetStats.total) }}</div>
                  </div>
                  <div class="budget-widget__item">
                    <div class="budget-widget__label">{{ $t('dashboard.spent') }}</div>
                    <div class="budget-widget__value">{{ formatCurrency(budgetStats.spent) }}</div>
                  </div>
                  <div class="budget-widget__item">
                    <div class="budget-widget__label">{{ $t('dashboard.remaining') }}</div>
                    <div class="budget-widget__value" :class="budgetStats.remaining > 0 ? 'remaining' : 'over-budget'">
                      {{ formatCurrency(budgetStats.remaining) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="dashboard__sidebar-widget">
          <div class="widget">
            <div class="widget__header">
              <h3>{{ $t('dashboard.tableProgress') }}</h3>
              <button class="btn-link" @click="navigateTo('/tischplan')">
                {{ $t('dashboard.editSeating') }}
              </button>
            </div>
            <div class="widget__content">
              <div class="seating-widget">
                <div class="seating-widget__progress">
                  <div class="circular-progress">
                    <svg width="120" height="120" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="#F2F2F2"
                        stroke-width="12"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="#06D6A0"
                        stroke-width="12"
                        stroke-dasharray="339.292"
                        :stroke-dashoffset="getSeatingProgressOffset()"
                        transform="rotate(-90 60 60)"
                      />
                    </svg>
                    <div class="circular-progress__content">
                      <div class="circular-progress__percentage">{{ getSeatingPercentage() }}%</div>
                      <div class="circular-progress__label">{{ $t('dashboard.seated') }}</div>
                    </div>
                  </div>
                </div>
                <div class="seating-widget__details">
                  <div class="seating-widget__item">
                    <div class="seating-widget__label">{{ $t('dashboard.confirmedGuests') }}</div>
                    <div class="seating-widget__value">{{ seatingStats.confirmed }}</div>
                  </div>
                  <div class="seating-widget__item">
                    <div class="seating-widget__label">{{ $t('dashboard.seatedGuests') }}</div>
                    <div class="seating-widget__value">{{ seatingStats.seated }}</div>
                  </div>
                  <div class="seating-widget__item">
                    <div class="seating-widget__label">{{ $t('dashboard.unseatedGuests') }}</div>
                    <div class="seating-widget__value">{{ seatingStats.unseated }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  
  data() {
    return {
      // Wedding details
      coupleNames: 'Anna & Max',
      weddingDate: new Date('2025-06-15T16:00:00'),
      weddingLocation: {
        name: 'Schloss Schönbrunn',
        address: 'Schönbrunner Schloßstraße 47, 1130 Wien, Österreich',
        coordinates: { lat: 48.1858, lng: 16.3122 }
      },
      
      // Language settings
      currentLanguage: 'de',
      availableLanguages: [
        { code: 'de', name: 'Deutsch' },
        { code: 'en', name: 'English' },
        { code: 'fr', name: 'Français' },
        { code: 'es', name: 'Español' }
      ],
      
      // Countdown
      countdown: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      },
      countdownInterval: null,
      
      // Stats
      guestStats: {
        total: 0,
        confirmed: 0,
        pending: 0,
        declined: 0
      },
      
      budgetStats: {
        total: 0,
        spent: 0,
        remaining: 0
      },
      
      taskStats: {
        total: 0,
        completed: 0,
        upcoming: 0
      },
      
      seatingStats: {
        confirmed: 0,
        seated: 0,
        unseated: 0
      },
      
      // Weather
      weather: {
        loading: true,
        error: false,
        location: '',
        date: null,
        temperature: 0,
        condition: '',
        humidity: 0,
        wind: 0
      },
      
      // Tasks
      upcomingTasks: [],
      
      // RSVPs
      recentRSVPs: [],
      
      // Quick links
      quickLinks: [
        { label: 'Tischplan', path: '/tischplan', icon: 'table' },
        { label: 'Gästeliste', path: '/gaesteliste', icon: 'users' },
        { label: 'Budget', path: '/budget', icon: 'dollar-sign' },
        { label: 'Zeitplan', path: '/zeitplan', icon: 'calendar' },
        { label: 'Moodboard', path: '/moodboard', icon: 'image' },
        { label: 'Musikwünsche', path: '/musik', icon: 'music' }
      ]
    };
  },
  
  mounted() {
    // Start countdown
    this.updateCountdown();
    this.countdownInterval = setInterval(this.updateCountdown, 1000);
    
    // Load data
    this.loadDashboardData();
    
    // Load weather forecast
    this.loadWeatherForecast();
  },
  
  beforeDestroy() {
    // Clear countdown interval
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  },
  
  methods: {
    // Data loading methods
    async loadDashboardData() {
      try {
        // This would be replaced with actual Supabase queries
        // In a real implementation, we would fetch all this data from the backend
        
        // For demo purposes, we'll use mock data
        this.guestStats = {
          total: 120,
          confirmed: 85,
          pending: 30,
          declined: 5
        };
        
        this.budgetStats = {
          total: 15000,
          spent: 10500,
          remaining: 4500
        };
        
        this.taskStats = {
          total: 50,
          completed: 32,
          upcoming: 8
        };
        
        this.seatingStats = {
          confirmed: 85,
          seated: 65,
          unseated: 20
        };
        
        this.upcomingTasks = [
          {
            id: '1',
            title: 'Menü mit Caterer finalisieren',
            dueDate: new Date('2025-04-15'),
            completed: false,
            priority: 'high'
          },
          {
            id: '2',
            title: 'Letzte Anprobe Brautkleid',
            dueDate: new Date('2025-04-20'),
            completed: false,
            priority: 'medium'
          },
          {
            id: '3',
            title: 'Eheringe abholen',
            dueDate: new Date('2025-05-01'),
            completed: false,
            priority: 'high'
          },
          {
            id: '4',
            title: 'Sitzordnung finalisieren',
            dueDate: new Date('2025-05-15'),
            completed: false,
            priority: 'medium'
          }
        ];
        
        this.recentRSVPs = [
          {
            id: '1',
            firstName: 'Julia',
            lastName: 'Weber',
            rsvpDate: new Date('2025-03-22T14:30:00'),
            status: 'confirmed',
            group: 'Freunde'
          },
          {
            id: '2',
            firstName: 'Thomas',
            lastName: 'Müller',
            rsvpDate: new Date('2025-03-21T10:15:00'),
            status: 'confirmed',
            group: 'Familie Bräutigam'
          },
          {
            id: '3',
            firstName: 'Sarah',
            lastName: 'Schmidt',
            rsvpDate: new Date('2025-03-20T18:45:00'),
            status: 'declined',
            group: 'Kollegen'
          }
        ];
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    },
    
    async loadWeatherForecast() {
      try {
        this.weather.loading = true;
        
        // This would be replaced with an actual weather API call
        // In a real implementation, we would fetch weather data from a weather API
        
        // For demo purposes, we'll use mock data
        setTimeout(() => {
          this.weather = {
            loading: false,
            error: false,
            location: 'Wien, Österreich',
            date: this.weddingDate,
            temperature: 24,
            condition: 'Sonnig',
            humidity: 45,
            wind: 8
          };
        }, 1500);
      } catch (error) {
        console.error('Error loading weather forecast:', error);
        this.weather.loading = false;
        this.weather.error = true;
      }
    },
    
    // Countdown methods
    updateCountdown() {
      const now = new Date();
      const diff = this.weddingDate - now;
      
      if (diff <= 0) {
        // Wedding day has passed
        this.countdown = {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
        clearInterval(this.countdownInterval);
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      this.countdown = { days, hours, minutes, seconds };
    },
    
    // UI methods
    changeLanguage(langCode) {
      this.currentLanguage = langCode;
      // In a real implementation, this would change the app's language
      // this.$i18n.locale = langCode;
    },
    
    navigateTo(path) {
      // In a real implementation, this would navigate to the specified path
      // this.$router.push(path);
      console.log('Navigate to:', path);
    },
    
    openMap() {
      // In a real implementation, this would open the location in Google Maps
      const { lat, lng } = this.weddingLocation.coordinates;
      const url = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(url, '_blank');
    },
    
    toggleTask(taskId) {
      const task = this.upcomingTasks.find(t => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
        
        // In a real implementation, this would update the task in the database
        // await this.$supabase
        //   .from('timeline_events')
        //   .update({ status: task.completed ? 'completed' : 'planned' })
        //   .eq('id', taskId);
        
        // Update task stats
        if (task.completed) {
          this.taskStats.completed++;
          this.taskStats.upcoming--;
        } else {
          this.taskStats.completed--;
          this.taskStats.upcoming++;
        }
      }
    },
    
    // Formatting methods
    formatWeddingDate(date) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('de-DE', options);
    },
    
    formatDate(date) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return date.toLocaleDateString('de-DE', options);
    },
    
    formatDateTime(date) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
      return date.toLocaleDateString('de-DE', options);
    },
    
    formatCurrency(value) {
      if (value === null || value === undefined) return '-';
      
      const formatter = new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0
      });
      
      return formatter.format(value);
    },
    
    // Helper methods
    getPriorityLabel(priority) {
      switch (priority) {
        case 'high': return this.$t('dashboard.highPriority');
        case 'medium': return this.$t('dashboard.mediumPriority');
        case 'low': return this.$t('dashboard.lowPriority');
        default: return '';
      }
    },
    
    getWeatherIcon(condition) {
      // In a real implementation, this would return the appropriate weather icon
      // based on the condition
      const conditionLower = condition.toLowerCase();
      
      if (conditionLower.includes('sonnig') || conditionLower.includes('klar')) {
        return '/assets/images/weather/sunny.svg';
      } else if (conditionLower.includes('wolke') || conditionLower.includes('bewölkt')) {
        return '/assets/images/weather/cloudy.svg';
      } else if (conditionLower.includes('regen')) {
        return '/assets/images/weather/rainy.svg';
      } else if (conditionLower.includes('gewitter')) {
        return '/assets/images/weather/stormy.svg';
      } else if (conditionLower.includes('schnee')) {
        return '/assets/images/weather/snowy.svg';
      } else {
        return '/assets/images/weather/partly-cloudy.svg';
      }
    },
    
    getGroupColor(groupName) {
      // This would match the colors defined in the design system
      const groupColors = {
        'Familie Bräutigam': '#FFD166',
        'Familie Braut': '#06D6A0',
        'Freunde': '#EF476F',
        'Kollegen': '#073B4C'
      };
      
      return groupColors[groupName] || '#BDBDBD';
    },
    
    getInitials(person) {
      if (!person) return '';
      
      const firstInitial = person.firstName ? person.firstName.charAt(0) : '';
      const lastInitial = person.lastName ? person.lastName.charAt(0) : '';
      
      return `${firstInitial}${lastInitial}`;
    },
    
    getRSVPStatusLabel(status) {
      switch (status) {
        case 'confirmed': return this.$t('dashboard.confirmed');
        case 'pending': return this.$t('dashboard.pending');
        case 'declined': return this.$t('dashboard.declined');
        default: return '';
      }
    },
    
    getBudgetPercentage() {
      if (this.budgetStats.total <= 0) return 0;
      const percentage = Math.round((this.budgetStats.spent / this.budgetStats.total) * 100);
      return Math.min(percentage, 100); // Cap at 100%
    },
    
    getBudgetProgressOffset() {
      const percentage = this.getBudgetPercentage();
      const circumference = 2 * Math.PI * 54; // 2πr where r=54
      return circumference * (1 - percentage / 100);
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
    
    getSeatingPercentage() {
      if (this.seatingStats.confirmed <= 0) return 0;
      const percentage = Math.round((this.seatingStats.seated / this.seatingStats.confirmed) * 100);
      return percentage;
    },
    
    getSeatingProgressOffset() {
      const percentage = this.getSeatingPercentage();
      const circumference = 2 * Math.PI * 54; // 2πr where r=54
      return circumference * (1 - percentage / 100);
    }
  }
};
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #FFF9EB;
}

.dashboard__header {
  padding: 24px;
  background-color: #FFFFFF;
  border-bottom: 1px solid #F2F2F2;
  position: relative;
}

.dashboard__language-selector {
  position: absolute;
  top: 24px;
  right: 24px;
  display: flex;
  gap: 8px;
}

.language-button {
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #F2F2F2;
  background-color: #FFFFFF;
  cursor: pointer;
  font-size: 14px;
}

.language-button.active {
  background-color: #FFD166;
  border-color: #FFD166;
  color: #073B4C;
}

.dashboard__content {
  flex: 1;
  padding: 24px;
  display: flex;
  gap: 24px;
  overflow: auto;
}

.dashboard__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.dashboard__sidebar {
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.dashboard__countdown-card {
  background-color: #FFFFFF;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
}

.countdown {
  text-align: center;
}

.countdown h2 {
  margin-bottom: 16px;
  color: #073B4C;
}

.countdown__timer {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.countdown__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}

.countdown__value {
  font-size: 32px;
  font-weight: bold;
  color: #FFD166;
}

.countdown__label {
  font-size: 14px;
  color: #4F4F4F;
}

.dashboard__stats-row {
  display: flex;
  gap: 24px;
}

.dashboard__stat-card {
  flex: 1;
}

.stat-card {
  background-color: #FFFFFF;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.stat-card__icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background-color: #FFF9EB;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.stat-card__icon i {
  font-size: 24px;
  color: #FFD166;
}

.stat-card__content {
  margin-bottom: 16px;
}

.stat-card__value {
  font-size: 24px;
  font-weight: bold;
  color: #073B4C;
}

.stat-card__label {
  font-size: 14px;
  color: #4F4F4F;
}

.stat-card__footer {
  margin-top: auto;
  font-size: 14px;
  color: #4F4F4F;
}

.stat-card__detail {
  margin-bottom: 4px;
}

.stat-card__detail:last-child {
  margin-bottom: 0;
}

.confirmed {
  color: #06D6A0;
  font-weight: 500;
}

.pending {
  color: #FFD166;
  font-weight: 500;
}

.total {
  font-weight: 500;
}

.remaining {
  color: #06D6A0;
  font-weight: 500;
}

.over-budget {
  color: #EF476F;
  font-weight: 500;
}

.dashboard__widgets-row {
  display: flex;
  gap: 24px;
}

.dashboard__widget {
  flex: 1;
}

.dashboard__widget--double {
  flex: 2;
}

.widget {
  background-color: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.widget__header {
  padding: 16px;
  border-bottom: 1px solid #F2F2F2;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.widget__content {
  padding: 16px;
  flex: 1;
  overflow: auto;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background-color: #F9F9F9;
}

.task-item__checkbox {
  margin-right: 12px;
}

.task-item__content {
  flex: 1;
}

.task-item__title {
  font-weight: 500;
  margin-bottom: 4px;
}

.task-item__due-date {
  font-size: 12px;
  color: #4F4F4F;
}

.task-item__priority {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  text-align: center;
  min-width: 80px;
}

.priority-high {
  background-color: #EF476F;
  color: #FFFFFF;
}

.priority-medium {
  background-color: #FFD166;
  color: #073B4C;
}

.priority-low {
  background-color: #06D6A0;
  color: #FFFFFF;
}

.weather-widget {
  text-align: center;
}

.weather-widget__loading,
.weather-widget__error {
  padding: 24px;
  color: #4F4F4F;
}

.weather-widget__location {
  font-weight: 500;
  margin-bottom: 4px;
}

.weather-widget__date {
  font-size: 14px;
  color: #4F4F4F;
  margin-bottom: 16px;
}

.weather-widget__forecast {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.weather-widget__icon {
  width: 64px;
  height: 64px;
  margin-right: 16px;
}

.weather-widget__icon img {
  width: 100%;
  height: 100%;
}

.weather-widget__temp {
  font-size: 32px;
  font-weight: bold;
  color: #073B4C;
}

.weather-widget__condition {
  font-size: 16px;
  margin-bottom: 16px;
}

.weather-widget__details {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
}

.weather-widget__detail {
  display: flex;
  align-items: center;
  color: #4F4F4F;
}

.weather-widget__detail i {
  margin-right: 4px;
}

.weather-widget__disclaimer {
  font-size: 12px;
  color: #BDBDBD;
}

.rsvp-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rsvp-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background-color: #F9F9F9;
}

.rsvp-item__avatar {
  margin-right: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #FFFFFF;
}

.rsvp-item__content {
  flex: 1;
}

.rsvp-item__name {
  font-weight: 500;
  margin-bottom: 4px;
}

.rsvp-item__date {
  font-size: 12px;
  color: #4F4F4F;
}

.rsvp-item__status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  text-align: center;
  min-width: 80px;
}

.status-confirmed {
  background-color: #06D6A0;
  color: #FFFFFF;
}

.status-pending {
  background-color: #FFD166;
  color: #073B4C;
}

.status-declined {
  background-color: #EF476F;
  color: #FFFFFF;
}

.quick-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.quick-link-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border-radius: 8px;
  background-color: #F9F9F9;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.quick-link-button:hover {
  background-color: #FFF9EB;
}

.quick-link-button i {
  font-size: 24px;
  color: #FFD166;
  margin-bottom: 8px;
}

.location-widget__map {
  height: 160px;
  background-color: #F9F9F9;
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: hidden;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-placeholder i {
  font-size: 48px;
  color: #BDBDBD;
}

.location-widget__details {
  text-align: center;
}

.location-widget__name {
  font-weight: 500;
  margin-bottom: 4px;
}

.location-widget__address {
  font-size: 14px;
  color: #4F4F4F;
  margin-bottom: 16px;
}

.budget-widget__progress {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.circular-progress {
  position: relative;
  width: 120px;
  height: 120px;
}

.circular-progress__content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.circular-progress__percentage {
  font-size: 24px;
  font-weight: bold;
  color: #073B4C;
}

.circular-progress__label {
  font-size: 14px;
  color: #4F4F4F;
}

.budget-widget__details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.budget-widget__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.budget-widget__label {
  color: #4F4F4F;
}

.budget-widget__value {
  font-weight: 500;
}

.seating-widget__progress {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.seating-widget__details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.seating-widget__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.seating-widget__label {
  color: #4F4F4F;
}

.seating-widget__value {
  font-weight: 500;
}

.empty-state {
  padding: 16px;
  text-align: center;
  color: #BDBDBD;
}

.btn-link {
  background: none;
  border: none;
  color: #FFD166;
  cursor: pointer;
  font-weight: 500;
  padding: 0;
}

.btn-link:hover {
  text-decoration: underline;
}

.btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background-color: #FFD166;
  color: #073B4C;
  font-weight: 500;
  cursor: pointer;
}

.btn:hover {
  background-color: #FFBE33;
}

.btn-small {
  font-size: 14px;
  padding: 6px 12px;
}

@media (max-width: 1200px) {
  .dashboard__content {
    flex-direction: column;
  }
  
  .dashboard__sidebar {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .dashboard__sidebar-widget {
    flex: 1;
    min-width: 300px;
  }
}

@media (max-width: 992px) {
  .dashboard__stats-row {
    flex-wrap: wrap;
  }
  
  .dashboard__stat-card {
    min-width: 250px;
  }
  
  .dashboard__widgets-row {
    flex-wrap: wrap;
  }
  
  .dashboard__widget {
    min-width: 300px;
  }
  
  .dashboard__widget--double {
    min-width: 100%;
  }
}

@media (max-width: 768px) {
  .dashboard__language-selector {
    position: static;
    margin-top: 16px;
  }
  
  .countdown__timer {
    flex-wrap: wrap;
    justify-content: space-around;
  }
  
  .countdown__item {
    min-width: 70px;
  }
}
</style>
