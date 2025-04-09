// Statistics Dashboard Implementation
// For LemonVows Wedding Planning App

// This file contains the implementation of the statistics dashboard functionality
// using Supabase as the backend and WeWeb for the frontend integration.

// ----- BACKEND IMPLEMENTATION (SUPABASE) -----

/**
 * Supabase API Client Configuration
 * This would be integrated with WeWeb through their Supabase connector
 */
const supabaseConfig = {
  supabaseUrl: 'https://your-supabase-project.supabase.co',
  supabaseKey: 'your-supabase-anon-key',
};

/**
 * Statistics Functions
 * These functions handle the retrieval and calculation of statistics
 */

// Function to get RSVP statistics for a wedding
async function getWeddingRsvpStatistics(weddingId) {
  // Get the statistics record for the wedding
  const { data: statistics, error: statisticsError } = await supabase
    .from('statistics')
    .select('*')
    .eq('wedding_id', weddingId)
    .single();
  
  if (statisticsError) {
    // If no statistics record exists, create one
    if (statisticsError.code === 'PGRST116') {
      return await createInitialStatistics(weddingId);
    }
    throw statisticsError;
  }
  
  return statistics;
}

// Function to create initial statistics record for a wedding
async function createInitialStatistics(weddingId) {
  // Count guests
  const { data: guestCount, error: guestCountError } = await supabase
    .from('guests')
    .select('id', { count: 'exact' })
    .eq('wedding_id', weddingId);
  
  if (guestCountError) throw guestCountError;
  
  // Count RSVP responses by status
  const { data: acceptedCount, error: acceptedCountError } = await supabase
    .from('rsvp_responses')
    .select('id', { count: 'exact' })
    .eq('guests.wedding_id', weddingId)
    .eq('response_status', 'accepted');
  
  if (acceptedCountError) throw acceptedCountError;
  
  const { data: declinedCount, error: declinedCountError } = await supabase
    .from('rsvp_responses')
    .select('id', { count: 'exact' })
    .eq('guests.wedding_id', weddingId)
    .eq('response_status', 'declined');
  
  if (declinedCountError) throw declinedCountError;
  
  // Calculate pending count
  const pendingCount = guestCount.count - acceptedCount.count - declinedCount.count;
  
  // Create statistics record
  const { data, error } = await supabase
    .from('statistics')
    .insert([
      {
        wedding_id: weddingId,
        total_guests: guestCount.count,
        accepted_count: acceptedCount.count,
        declined_count: declinedCount.count,
        pending_count: pendingCount,
        last_updated: new Date()
      }
    ]);
  
  if (error) throw error;
  return data[0];
}

// Function to update statistics manually (in case triggers fail)
async function updateWeddingStatistics(weddingId) {
  // Count guests
  const { data: guestCount, error: guestCountError } = await supabase
    .from('guests')
    .select('id', { count: 'exact' })
    .eq('wedding_id', weddingId);
  
  if (guestCountError) throw guestCountError;
  
  // Count RSVP responses by status
  const { data: acceptedCount, error: acceptedCountError } = await supabase
    .from('rsvp_responses')
    .select('id', { count: 'exact' })
    .eq('guests.wedding_id', weddingId)
    .eq('response_status', 'accepted');
  
  if (acceptedCountError) throw acceptedCountError;
  
  const { data: declinedCount, error: declinedCountError } = await supabase
    .from('rsvp_responses')
    .select('id', { count: 'exact' })
    .eq('guests.wedding_id', weddingId)
    .eq('response_status', 'declined');
  
  if (declinedCountError) throw declinedCountError;
  
  // Calculate pending count
  const pendingCount = guestCount.count - acceptedCount.count - declinedCount.count;
  
  // Count dietary restrictions
  const { data: dietaryStats, error: dietaryStatsError } = await supabase
    .from('guest_menu_selections')
    .select(`
      menu_options(is_vegetarian, is_vegan, is_gluten_free, is_dairy_free),
      count
    `)
    .eq('guests.wedding_id', weddingId)
    .group('menu_options.is_vegetarian, menu_options.is_vegan, menu_options.is_gluten_free, menu_options.is_dairy_free');
  
  if (dietaryStatsError) throw dietaryStatsError;
  
  // Calculate dietary counts
  let vegetarianCount = 0;
  let veganCount = 0;
  let glutenFreeCount = 0;
  let dairyFreeCount = 0;
  
  dietaryStats.forEach(stat => {
    if (stat.menu_options.is_vegetarian) vegetarianCount += stat.count;
    if (stat.menu_options.is_vegan) veganCount += stat.count;
    if (stat.menu_options.is_gluten_free) glutenFreeCount += stat.count;
    if (stat.menu_options.is_dairy_free) dairyFreeCount += stat.count;
  });
  
  // Count guests with allergies
  const { data: allergyCount, error: allergyCountError } = await supabase
    .from('guest_allergies')
    .select('guest_id', { count: 'exact', distinct: true })
    .eq('guests.wedding_id', weddingId);
  
  if (allergyCountError) throw allergyCountError;
  
  // Count guests needing accommodation
  const { data: accommodationCount, error: accommodationCountError } = await supabase
    .from('rsvp_responses')
    .select('id', { count: 'exact' })
    .eq('guests.wedding_id', weddingId)
    .eq('needs_accommodation', true);
  
  if (accommodationCountError) throw accommodationCountError;
  
  // Update statistics record
  const { data, error } = await supabase
    .from('statistics')
    .update({
      total_guests: guestCount.count,
      accepted_count: acceptedCount.count,
      declined_count: declinedCount.count,
      pending_count: pendingCount,
      vegetarian_count: vegetarianCount,
      vegan_count: veganCount,
      gluten_free_count: glutenFreeCount,
      dairy_free_count: dairyFreeCount,
      with_allergies_count: allergyCount.count,
      needs_accommodation_count: accommodationCount.count,
      last_updated: new Date()
    })
    .eq('wedding_id', weddingId);
  
  if (error) throw error;
  return data[0];
}

// Function to get RSVP response timeline
async function getRsvpResponseTimeline(weddingId) {
  // Get all RSVP responses with their response dates
  const { data: responses, error: responsesError } = await supabase
    .from('rsvp_responses')
    .select(`
      response_status,
      response_date,
      guests!inner(wedding_id)
    `)
    .eq('guests.wedding_id', weddingId)
    .order('response_date');
  
  if (responsesError) throw responsesError;
  
  // Group responses by date
  const responsesByDate = {};
  
  responses.forEach(response => {
    if (!response.response_date) return;
    
    const date = new Date(response.response_date).toISOString().split('T')[0];
    
    if (!responsesByDate[date]) {
      responsesByDate[date] = {
        date,
        accepted: 0,
        declined: 0,
        total: 0,
        cumulative_accepted: 0,
        cumulative_declined: 0,
        cumulative_total: 0
      };
    }
    
    if (response.response_status === 'accepted') {
      responsesByDate[date].accepted += 1;
    } else if (response.response_status === 'declined') {
      responsesByDate[date].declined += 1;
    }
    
    responsesByDate[date].total += 1;
  });
  
  // Convert to array and sort by date
  const timelineData = Object.values(responsesByDate).sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
  
  // Calculate cumulative totals
  let cumulativeAccepted = 0;
  let cumulativeDeclined = 0;
  let cumulativeTotal = 0;
  
  timelineData.forEach(day => {
    cumulativeAccepted += day.accepted;
    cumulativeDeclined += day.declined;
    cumulativeTotal += day.total;
    
    day.cumulative_accepted = cumulativeAccepted;
    day.cumulative_declined = cumulativeDeclined;
    day.cumulative_total = cumulativeTotal;
  });
  
  return timelineData;
}

// Function to get guest group statistics
async function getGuestGroupStatistics(weddingId) {
  // Get all guests with their group names and RSVP status
  const { data: guests, error: guestsError } = await supabase
    .from('guests')
    .select(`
      group_name,
      rsvp_responses(response_status)
    `)
    .eq('wedding_id', weddingId)
    .not('group_name', 'is', null);
  
  if (guestsError) throw guestsError;
  
  // Group guests by group name
  const groupStats = {};
  
  guests.forEach(guest => {
    const groupName = guest.group_name || 'Ungrouped';
    const rsvpStatus = guest.rsvp_responses.length > 0 
      ? guest.rsvp_responses[0].response_status 
      : 'pending';
    
    if (!groupStats[groupName]) {
      groupStats[groupName] = {
        group_name: groupName,
        total: 0,
        accepted: 0,
        declined: 0,
        pending: 0
      };
    }
    
    groupStats[groupName].total += 1;
    
    if (rsvpStatus === 'accepted') {
      groupStats[groupName].accepted += 1;
    } else if (rsvpStatus === 'declined') {
      groupStats[groupName].declined += 1;
    } else {
      groupStats[groupName].pending += 1;
    }
  });
  
  // Convert to array and sort by total guests
  return Object.values(groupStats).sort((a, b) => b.total - a.total);
}

// Function to get table statistics
async function getTableStatistics(weddingId) {
  // Get all tables with their assignments and guest RSVP status
  const { data: tables, error: tablesError } = await supabase
    .from('tables')
    .select(`
      id,
      table_name,
      capacity,
      table_assignments(
        guests(
          id,
          first_name,
          last_name,
          rsvp_responses(response_status)
        )
      )
    `)
    .eq('wedding_id', weddingId);
  
  if (tablesError) throw tablesError;
  
  // Calculate statistics for each table
  const tableStats = tables.map(table => {
    const assignments = table.table_assignments || [];
    const totalAssigned = assignments.length;
    
    let acceptedCount = 0;
    let declinedCount = 0;
    let pendingCount = 0;
    
    assignments.forEach(assignment => {
      const guest = assignment.guests;
      const rsvpStatus = guest.rsvp_responses.length > 0 
        ? guest.rsvp_responses[0].response_status 
        : 'pending';
      
      if (rsvpStatus === 'accepted') {
        acceptedCount += 1;
      } else if (rsvpStatus === 'declined') {
        declinedCount += 1;
      } else {
        pendingCount += 1;
      }
    });
    
    return {
      id: table.id,
      table_name: table.table_name,
      capacity: table.capacity,
      total_assigned: totalAssigned,
      available_seats: table.capacity - totalAssigned,
      accepted_count: acceptedCount,
      declined_count: declinedCount,
      pending_count: pendingCount,
      utilization_percentage: totalAssigned > 0 
        ? Math.round((acceptedCount / totalAssigned) * 100) 
        : 0
    };
  });
  
  return tableStats;
}

// Function to get comprehensive wedding statistics
async function getComprehensiveWeddingStatistics(weddingId) {
  // Get basic RSVP statistics
  const basicStats = await getWeddingRsvpStatistics(weddingId);
  
  // Get timeline data
  const timelineData = await getRsvpResponseTimeline(weddingId);
  
  // Get group statistics
  const groupStats = await getGuestGroupStatistics(weddingId);
  
  // Get table statistics
  const tableStats = await getTableStatistics(weddingId);
  
  // Get dietary statistics
  const { data: dietaryStats, error: dietaryStatsError } = await supabase
    .from('statistics')
    .select(`
      vegetarian_count,
      vegan_count,
      gluten_free_count,
      dairy_free_count,
      with_allergies_count
    `)
    .eq('wedding_id', weddingId)
    .single();
  
  if (dietaryStatsError) throw dietaryStatsError;
  
  // Return combined statistics
  return {
    basic: basicStats,
    timeline: timelineData,
    groups: groupStats,
    tables: tableStats,
    dietary: dietaryStats
  };
}

// ----- FRONTEND IMPLEMENTATION (WEWEB) -----

/**
 * The following sections outline the frontend components and logic
 * that would be implemented in WeWeb for the statistics dashboard functionality.
 * 
 * Since WeWeb is a no-code platform, this is a conceptual representation
 * of the components and their interactions rather than actual code.
 */

// Statistics Dashboard Page Components:
// 1. RSVP Summary Cards
// 2. RSVP Timeline Chart
// 3. Guest Groups Chart
// 4. Table Statistics Table
// 5. Dietary Requirements Chart
// 6. Export Statistics Button

/**
 * RSVP Summary Cards Component
 * 
 * This component displays summary cards with key RSVP statistics.
 */
const RsvpSummaryCards = {
  // Data binding to Supabase
  dataSource: 'getWeddingRsvpStatistics(weddingId)',
  
  // Template
  template: `
    <div class="rsvp-summary-cards">
      <div class="summary-card total">
        <div class="card-icon">
          <i class="icon-users"></i>
        </div>
        <div class="card-content">
          <h3>{{ translate('stats.total_guests') }}</h3>
          <div class="card-value">{{ data.total_guests }}</div>
        </div>
      </div>
      
      <div class="summary-card accepted">
        <div class="card-icon">
          <i class="icon-check"></i>
        </div>
        <div class="card-content">
          <h3>{{ translate('stats.accepted') }}</h3>
          <div class="card-value">{{ data.accepted_count }}</div>
          <div class="card-percentage">
            {{ calculatePercentage(data.accepted_count, data.total_guests) }}%
          </div>
        </div>
      </div>
      
      <div class="summary-card declined">
        <div class="card-icon">
          <i class="icon-times"></i>
        </div>
        <div class="card-content">
          <h3>{{ translate('stats.declined') }}</h3>
          <div class="card-value">{{ data.declined_count }}</div>
          <div class="card-percentage">
            {{ calculatePercentage(data.declined_count, data.total_guests) }}%
          </div>
        </div>
      </div>
      
      <div class="summary-card pending">
        <div class="card-icon">
          <i class="icon-clock"></i>
        </div>
        <div class="card-content">
          <h3>{{ translate('stats.pending') }}</h3>
          <div class="card-value">{{ data.pending_count }}</div>
          <div class="card-percentage">
            {{ calculatePercentage(data.pending_count, data.total_guests) }}%
          </div>
        </div>
      </div>
      
      <div class="summary-card accommodation">
        <div class="card-icon">
          <i class="icon-hotel"></i>
        </div>
        <div class="card-content">
          <h3>{{ translate('stats.needs_accommodation') }}</h3>
          <div class="card-value">{{ data.needs_accommodation_count }}</div>
          <div class="card-percentage">
            {{ calculatePercentage(data.needs_accommodation_count, data.accepted_count) }}%
            <span class="percentage-label">{{ translate('stats.of_accepted') }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  
  // Methods
  methods: {
    calculatePercentage(value, total) {
      if (total === 0) return 0;
      return Math.round((value / total) * 100);
    }
  }
};

/**
 * RSVP Timeline Chart Component
 * 
 * This component displays a chart showing RSVP responses over time.
 */
const RsvpTimelineChart = {
  // Data binding to Supabase
  dataSource: 'getRsvpResponseTimeline(weddingId)',
  
  // Chart configuration
  chartConfig: {
    type: 'line',
    data: {
      labels: [], // Will be populated with dates
      datasets: [
        {
          label: 'Cumulative Accepted',
          data: [], // Will be populated with cumulative_accepted values
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          fill: true
        },
        {
          label: 'Cumulative Declined',
          data: [], // Will be populated with cumulative_declined values
          borderColor: '#F44336',
          backgroundColor: 'rgba(244, 67, 54, 0.1)',
          fill: true
        },
        {
          label: 'Daily Accepted',
          data: [], // Will be populated with accepted values
          borderColor: '#8BC34A',
          backgroundColor: 'rgba(139, 195, 74, 0.5)',
          type: 'bar'
        },
        {
          label: 'Daily Declined',
          data: [], // Will be populated with declined values
          borderColor: '#FF9800',
          backgroundColor: 'rgba(255, 152, 0, 0.5)',
          type: 'bar'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Number of Responses'
          },
          beginAtZero: true
        }
      }
    }
  },
  
  // Methods
  methods: {
    prepareChartData(timelineData) {
      // Extract dates for labels
      const labels = timelineData.map(day => day.date);
      
      // Extract data for datasets
      const cumulativeAccepted = timelineData.map(day => day.cumulative_accepted);
      const cumulativeDeclined = timelineData.map(day => day.cumulative_declined);
      const dailyAccepted = timelineData.map(day => day.accepted);
      const dailyDeclined = timelineData.map(day => day.declined);
      
      // Update chart data
      this.chartConfig.data.labels = labels;
      this.chartConfig.data.datasets[0].data = cumulativeAccepted;
      this.chartConfig.data.datasets[1].data = cumulativeDeclined;
      this.chartConfig.data.datasets[2].data = dailyAccepted;
      this.chartConfig.data.datasets[3].data = dailyDeclined;
      
      // Translate labels
      this.chartConfig.data.datasets[0].label = this.translate('stats.cumulative_accepted');
      this.chartConfig.data.datasets[1].label = this.translate('stats.cumulative_declined');
      this.chartConfig.data.datasets[2].label = this.translate('stats.daily_accepted');
      this.chartConfig.data.datasets[3].label = this.translate('stats.daily_declined');
      this.chartConfig.options.scales.x.title.text = this.translate('stats.date');
      this.chartConfig.options.scales.y.title.text = this.translate('stats.responses');
      
      // Render chart
      this.renderChart();
    },
    
    renderChart() {
      // This would use a chart library like Chart.js
      // In WeWeb, this would typically be implemented using a plugin
      const ctx = document.getElementById('rsvp-timeline-chart').getContext('2d');
      new Chart(ctx, this.chartConfig);
    }
  },
  
  // Lifecycle hooks
  watch: {
    data(newData) {
      this.prepareChartData(newData);
    }
  },
  
  mounted() {
    if (this.data) {
      this.prepareChartData(this.data);
    }
  }
};

/**
 * Guest Groups Chart Component
 * 
 * This component displays a chart showing RSVP status by guest group.
 */
const GuestGroupsChart = {
  // Data binding to Supabase
  dataSource: 'getGuestGroupStatistics(weddingId)',
  
  // Chart configuration
  chartConfig: {
    type: 'bar',
    data: {
      labels: [], // Will be populated with group names
      datasets: [
        {
          label: 'Accepted',
          data: [], // Will be populated with accepted counts
          backgroundColor: 'rgba(76, 175, 80, 0.7)'
        },
        {
          label: 'Declined',
          data: [], // Will be populated with declined counts
          backgroundColor: 'rgba(244, 67, 54, 0.7)'
        },
        {
          label: 'Pending',
          data: [], // Will be populated with pending counts
          backgroundColor: 'rgba(255, 152, 0, 0.7)'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: 'Guest Group'
          }
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: 'Number of Guests'
          },
          beginAtZero: true
        }
      }
    }
  },
  
  // Methods
  methods: {
    prepareChartData(groupsData) {
      // Sort groups by total guests
      const sortedGroups = [...groupsData].sort((a, b) => b.total - a.total);
      
      // Limit to top 10 groups for readability
      const topGroups = sortedGroups.slice(0, 10);
      
      // Extract group names for labels
      const labels = topGroups.map(group => group.group_name);
      
      // Extract data for datasets
      const acceptedCounts = topGroups.map(group => group.accepted);
      const declinedCounts = topGroups.map(group => group.declined);
      const pendingCounts = topGroups.map(group => group.pending);
      
      // Update chart data
      this.chartConfig.data.labels = labels;
      this.chartConfig.data.datasets[0].data = acceptedCounts;
      this.chartConfig.data.datasets[1].data = declinedCounts;
      this.chartConfig.data.datasets[2].data = pendingCounts;
      
      // Translate labels
      this.chartConfig.data.datasets[0].label = this.translate('stats.accepted');
      this.chartConfig.data.datasets[1].label = this.translate('stats.declined');
      this.chartConfig.data.datasets[2].label = this.translate('stats.pending');
      this.chartConfig.options.scales.x.title.text = this.translate('stats.guest_group');
      this.chartConfig.options.scales.y.title.text = this.translate('stats.guests');
      
      // Render chart
      this.renderChart();
    },
    
    renderChart() {
      // This would use a chart library like Chart.js
      // In WeWeb, this would typically be implemented using a plugin
      const ctx = document.getElementById('guest-groups-chart').getContext('2d');
      new Chart(ctx, this.chartConfig);
    }
  },
  
  // Lifecycle hooks
  watch: {
    data(newData) {
      this.prepareChartData(newData);
    }
  },
  
  mounted() {
    if (this.data) {
      this.prepareChartData(this.data);
    }
  }
};

/**
 * Table Statistics Component
 * 
 * This component displays a table with statistics for each table at the wedding.
 */
const TableStatisticsComponent = {
  // Data binding to Supabase
  dataSource: 'getTableStatistics(weddingId)',
  
  // Columns
  columns: [
    { field: 'table_name', header: 'Table', sortable: true },
    { field: 'capacity', header: 'Capacity', sortable: true },
    { field: 'total_assigned', header: 'Assigned', sortable: true },
    { field: 'available_seats', header: 'Available', sortable: true },
    { 
      field: 'accepted_count', 
      header: 'Accepted', 
      sortable: true,
      template: `
        <span>{{ item.accepted_count }}</span>
      `
    },
    { 
      field: 'declined_count', 
      header: 'Declined', 
      sortable: true,
      template: `
        <span>{{ item.declined_count }}</span>
      `
    },
    { 
      field: 'pending_count', 
      header: 'Pending', 
      sortable: true,
      template: `
        <span>{{ item.pending_count }}</span>
      `
    },
    { 
      field: 'utilization_percentage', 
      header: 'Utilization', 
      sortable: true,
      template: `
        <div class="utilization-bar">
          <div 
            class="utilization-fill" 
            :style="{ width: item.utilization_percentage + '%' }"
            :class="{
              'high': item.utilization_percentage >= 80,
              'medium': item.utilization_percentage >= 50 && item.utilization_percentage < 80,
              'low': item.utilization_percentage < 50
            }"
          ></div>
          <span class="utilization-text">{{ item.utilization_percentage }}%</span>
        </div>
      `
    }
  ],
  
  // Methods
  methods: {
    refreshData() {
      // Refresh the data from Supabase
      this.fetchData();
    }
  }
};

/**
 * Dietary Requirements Chart Component
 * 
 * This component displays a chart showing dietary requirements statistics.
 */
const DietaryRequirementsChart = {
  // Data binding to Supabase
  dataSource: 'getWeddingRsvpStatistics(weddingId)',
  
  // Chart configuration
  chartConfig: {
    type: 'pie',
    data: {
      labels: [
        'Vegetarian',
        'Vegan',
        'Gluten-Free',
        'Dairy-Free',
        'With Allergies'
      ],
      datasets: [{
        data: [], // Will be populated with dietary counts
        backgroundColor: [
          'rgba(76, 175, 80, 0.7)',
          'rgba(139, 195, 74, 0.7)',
          'rgba(255, 235, 59, 0.7)',
          'rgba(255, 152, 0, 0.7)',
          'rgba(244, 67, 54, 0.7)'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    }
  },
  
  // Methods
  methods: {
    prepareChartData(statistics) {
      // Extract dietary counts
      const dietaryCounts = [
        statistics.vegetarian_count || 0,
        statistics.vegan_count || 0,
        statistics.gluten_free_count || 0,
        statistics.dairy_free_count || 0,
        statistics.with_allergies_count || 0
      ];
      
      // Update chart data
      this.chartConfig.data.datasets[0].data = dietaryCounts;
      
      // Translate labels
      this.chartConfig.data.labels = [
        this.translate('food.vegetarian'),
        this.translate('food.vegan'),
        this.translate('food.gluten_free'),
        this.translate('food.dairy_free'),
        this.translate('stats.with_allergies')
      ];
      
      // Render chart
      this.renderChart();
    },
    
    renderChart() {
      // This would use a chart library like Chart.js
      // In WeWeb, this would typically be implemented using a plugin
      const ctx = document.getElementById('dietary-requirements-chart').getContext('2d');
      new Chart(ctx, this.chartConfig);
    }
  },
  
  // Lifecycle hooks
  watch: {
    data(newData) {
      this.prepareChartData(newData);
    }
  },
  
  mounted() {
    if (this.data) {
      this.prepareChartData(this.data);
    }
  }
};

/**
 * Export Statistics Component
 * 
 * This component provides functionality to export statistics in various formats.
 */
const ExportStatisticsComponent = {
  // Methods
  methods: {
    async exportStatistics(format) {
      try {
        // Get comprehensive statistics
        const statistics = await getComprehensiveWeddingStatistics(this.weddingId);
        
        // Format data for export
        const exportData = this.formatStatisticsForExport(statistics);
        
        switch (format) {
          case 'csv':
            this.exportToCsv(exportData, 'wedding_statistics.csv');
            break;
          case 'excel':
            this.exportToExcel(exportData, 'wedding_statistics.xlsx');
            break;
          case 'pdf':
            this.exportToPdf(statistics, 'wedding_statistics.pdf');
            break;
          default:
            throw new Error('Unsupported export format');
        }
        
        this.showSuccess(`Statistics exported as ${format.toUpperCase()}`);
      } catch (error) {
        this.showError(error.message);
      }
    },
    
    formatStatisticsForExport(statistics) {
      // Format basic statistics
      const basicStats = {
        'Total Guests': statistics.basic.total_guests,
        'Accepted': statistics.basic.accepted_count,
        'Declined': statistics.basic.declined_count,
        'Pending': statistics.basic.pending_count,
        'Acceptance Rate': `${Math.round((statistics.basic.accepted_count / statistics.basic.total_guests) * 100)}%`,
        'Decline Rate': `${Math.round((statistics.basic.declined_count / statistics.basic.total_guests) * 100)}%`,
        'Response Rate': `${Math.round(((statistics.basic.accepted_count + statistics.basic.declined_count) / statistics.basic.total_guests) * 100)}%`,
        'Needs Accommodation': statistics.basic.needs_accommodation_count,
        'Vegetarian': statistics.dietary.vegetarian_count,
        'Vegan': statistics.dietary.vegan_count,
        'Gluten-Free': statistics.dietary.gluten_free_count,
        'Dairy-Free': statistics.dietary.dairy_free_count,
        'With Allergies': statistics.dietary.with_allergies_count,
        'Last Updated': new Date(statistics.basic.last_updated).toLocaleString()
      };
      
      return basicStats;
    },
    
    exportToCsv(data, filename) {
      // Convert data to CSV format
      const headers = Object.keys(data);
      const values = Object.values(data);
      
      const csvRows = [
        headers.join(','),
        values.join(',')
      ];
      
      const csvContent = csvRows.join('\n');
      
      // Create a download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    
    exportToExcel(data, filename) {
      // This would require a library like SheetJS/xlsx
      // For WeWeb, this would typically be implemented using a plugin
      // or by sending the data to a server-side function
      
      // Conceptual implementation:
      const workbook = XLSX.utils.book_new();
      
      // Add basic statistics sheet
      const basicStatsSheet = XLSX.utils.json_to_sheet([data]);
      XLSX.utils.book_append_sheet(workbook, basicStatsSheet, 'Summary');
      
      // Write file
      XLSX.writeFile(workbook, filename);
    },
    
    exportToPdf(statistics, filename) {
      // This would require a library like jsPDF and Chart.js
      // For WeWeb, this would typically be implemented using a plugin
      // or by sending the data to a server-side function
      
      // Conceptual implementation:
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text('Wedding Statistics Report', 14, 22);
      
      // Add date
      doc.setFontSize(11);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);
      
      // Add basic statistics
      doc.setFontSize(14);
      doc.text('RSVP Summary', 14, 40);
      
      doc.setFontSize(11);
      doc.text(`Total Guests: ${statistics.basic.total_guests}`, 14, 50);
      doc.text(`Accepted: ${statistics.basic.accepted_count} (${Math.round((statistics.basic.accepted_count / statistics.basic.total_guests) * 100)}%)`, 14, 55);
      doc.text(`Declined: ${statistics.basic.declined_count} (${Math.round((statistics.basic.declined_count / statistics.basic.total_guests) * 100)}%)`, 14, 60);
      doc.text(`Pending: ${statistics.basic.pending_count} (${Math.round((statistics.basic.pending_count / statistics.basic.total_guests) * 100)}%)`, 14, 65);
      
      // Add charts (would require additional libraries)
      // ...
      
      // Save the PDF
      doc.save(filename);
    },
    
    showSuccess(message) {
      // Display success message
      this.successMessage = message;
    },
    
    showError(message) {
      // Display error message
      this.errorMessage = message;
    }
  }
};

/**
 * Statistics Dashboard Component
 * 
 * This component combines all the statistics components into a comprehensive dashboard.
 */
const StatisticsDashboardComponent = {
  // Template
  template: `
    <div class="statistics-dashboard">
      <div class="dashboard-header">
        <h1>{{ translate('stats.dashboard_title') }}</h1>
        <div class="dashboard-actions">
          <button @click="refreshStatistics" class="refresh-button">
            <i class="icon-refresh"></i>
            {{ translate('stats.refresh') }}
          </button>
          <div class="export-dropdown">
            <button class="export-button">
              <i class="icon-download"></i>
              {{ translate('stats.export') }}
            </button>
            <div class="export-options">
              <button @click="exportStatistics('csv')">CSV</button>
              <button @click="exportStatistics('excel')">Excel</button>
              <button @click="exportStatistics('pdf')">PDF</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="dashboard-content">
        <div class="dashboard-section">
          <h2>{{ translate('stats.rsvp_summary') }}</h2>
          <RsvpSummaryCards :wedding-id="weddingId" />
        </div>
        
        <div class="dashboard-section">
          <h2>{{ translate('stats.rsvp_timeline') }}</h2>
          <div class="chart-container">
            <canvas id="rsvp-timeline-chart"></canvas>
          </div>
          <RsvpTimelineChart :wedding-id="weddingId" />
        </div>
        
        <div class="dashboard-row">
          <div class="dashboard-section half">
            <h2>{{ translate('stats.guest_groups') }}</h2>
            <div class="chart-container">
              <canvas id="guest-groups-chart"></canvas>
            </div>
            <GuestGroupsChart :wedding-id="weddingId" />
          </div>
          
          <div class="dashboard-section half">
            <h2>{{ translate('stats.dietary_requirements') }}</h2>
            <div class="chart-container">
              <canvas id="dietary-requirements-chart"></canvas>
            </div>
            <DietaryRequirementsChart :wedding-id="weddingId" />
          </div>
        </div>
        
        <div class="dashboard-section">
          <h2>{{ translate('stats.table_statistics') }}</h2>
          <TableStatisticsComponent :wedding-id="weddingId" />
        </div>
      </div>
    </div>
  `,
  
  // Components
  components: {
    RsvpSummaryCards,
    RsvpTimelineChart,
    GuestGroupsChart,
    TableStatisticsComponent,
    DietaryRequirementsChart
  },
  
  // Methods
  methods: {
    async refreshStatistics() {
      try {
        // Update statistics manually
        await updateWeddingStatistics(this.weddingId);
        
        // Refresh all components
        this.$refs.rsvpSummaryCards.refreshData();
        this.$refs.rsvpTimelineChart.refreshData();
        this.$refs.guestGroupsChart.refreshData();
        this.$refs.tableStatisticsComponent.refreshData();
        this.$refs.dietaryRequirementsChart.refreshData();
        
        this.showSuccess(this.translate('stats.refresh_success'));
      } catch (error) {
        this.showError(error.message);
      }
    },
    
    exportStatistics(format) {
      this.$refs.exportStatisticsComponent.exportStatistics(format);
    },
    
    showSuccess(message) {
      // Display success message
      this.successMessage = message;
    },
    
    showError(message) {
      // Display error message
      this.errorMessage = message;
    }
  }
};

// ----- MULTILINGUAL SUPPORT -----

/**
 * Translation keys for statistics dashboard
 * These would be added to the translations table
 */
const statisticsTranslations = [
  // Dashboard
  { key: 'stats.dashboard_title', de: 'Statistik-Dashboard', en: 'Statistics Dashboard', fr: 'Tableau de Bord des Statistiques', es: 'Panel de Estadísticas' },
  { key: 'stats.refresh', de: 'Aktualisieren', en: 'Refresh', fr: 'Actualiser', es: 'Actualizar' },
  { key: 'stats.export', de: 'Exportieren', en: 'Export', fr: 'Exporter', es: 'Exportar' },
  { key: 'stats.refresh_success', de: 'Statistiken erfolgreich aktualisiert', en: 'Statistics refreshed successfully', fr: 'Statistiques actualisées avec succès', es: 'Estadísticas actualizadas con éxito' },
  
  // RSVP Summary
  { key: 'stats.rsvp_summary', de: 'RSVP-Zusammenfassung', en: 'RSVP Summary', fr: 'Résumé des RSVP', es: 'Resumen de RSVP' },
  { key: 'stats.total_guests', de: 'Gesamtzahl der Gäste', en: 'Total Guests', fr: 'Nombre Total d\'Invités', es: 'Total de Invitados' },
  { key: 'stats.accepted', de: 'Zusagen', en: 'Accepted', fr: 'Acceptés', es: 'Aceptados' },
  { key: 'stats.declined', de: 'Absagen', en: 'Declined', fr: 'Déclinés', es: 'Rechazados' },
  { key: 'stats.pending', de: 'Ausstehend', en: 'Pending', fr: 'En Attente', es: 'Pendientes' },
  { key: 'stats.needs_accommodation', de: 'Benötigt Unterkunft', en: 'Needs Accommodation', fr: 'Besoin d\'Hébergement', es: 'Necesita Alojamiento' },
  { key: 'stats.of_accepted', de: 'der Zusagen', en: 'of accepted', fr: 'des acceptés', es: 'de aceptados' },
  
  // RSVP Timeline
  { key: 'stats.rsvp_timeline', de: 'RSVP-Zeitverlauf', en: 'RSVP Timeline', fr: 'Chronologie des RSVP', es: 'Cronología de RSVP' },
  { key: 'stats.cumulative_accepted', de: 'Kumulative Zusagen', en: 'Cumulative Accepted', fr: 'Acceptés Cumulés', es: 'Aceptados Acumulados' },
  { key: 'stats.cumulative_declined', de: 'Kumulative Absagen', en: 'Cumulative Declined', fr: 'Déclinés Cumulés', es: 'Rechazados Acumulados' },
  { key: 'stats.daily_accepted', de: 'Tägliche Zusagen', en: 'Daily Accepted', fr: 'Acceptés Quotidiens', es: 'Aceptados Diarios' },
  { key: 'stats.daily_declined', de: 'Tägliche Absagen', en: 'Daily Declined', fr: 'Déclinés Quotidiens', es: 'Rechazados Diarios' },
  { key: 'stats.date', de: 'Datum', en: 'Date', fr: 'Date', es: 'Fecha' },
  { key: 'stats.responses', de: 'Antworten', en: 'Responses', fr: 'Réponses', es: 'Respuestas' },
  
  // Guest Groups
  { key: 'stats.guest_groups', de: 'Gästegruppen', en: 'Guest Groups', fr: 'Groupes d\'Invités', es: 'Grupos de Invitados' },
  { key: 'stats.guest_group', de: 'Gästegruppe', en: 'Guest Group', fr: 'Groupe d\'Invités', es: 'Grupo de Invitados' },
  { key: 'stats.guests', de: 'Gäste', en: 'Guests', fr: 'Invités', es: 'Invitados' },
  
  // Table Statistics
  { key: 'stats.table_statistics', de: 'Tischstatistiken', en: 'Table Statistics', fr: 'Statistiques des Tables', es: 'Estadísticas de Mesas' },
  { key: 'stats.table', de: 'Tisch', en: 'Table', fr: 'Table', es: 'Mesa' },
  { key: 'stats.capacity', de: 'Kapazität', en: 'Capacity', fr: 'Capacité', es: 'Capacidad' },
  { key: 'stats.assigned', de: 'Zugewiesen', en: 'Assigned', fr: 'Assignés', es: 'Asignados' },
  { key: 'stats.available', de: 'Verfügbar', en: 'Available', fr: 'Disponibles', es: 'Disponibles' },
  { key: 'stats.utilization', de: 'Auslastung', en: 'Utilization', fr: 'Utilisation', es: 'Utilización' },
  
  // Dietary Requirements
  { key: 'stats.dietary_requirements', de: 'Ernährungsanforderungen', en: 'Dietary Requirements', fr: 'Exigences Alimentaires', es: 'Requisitos Dietéticos' },
  { key: 'stats.with_allergies', de: 'Mit Allergien', en: 'With Allergies', fr: 'Avec Allergies', es: 'Con Alergias' }
];

// ----- CSS STYLES -----

/**
 * CSS Styles for the Statistics Dashboard
 * These styles would be implemented in WeWeb's style editor
 */
const statisticsDashboardStyles = `
  .statistics-dashboard {
    font-family: 'Roboto', sans-serif;
    color: #333;
    padding: 20px;
  }
  
  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .dashboard-header h1 {
    font-size: 24px;
    font-weight: 500;
    margin: 0;
  }
  
  .dashboard-actions {
    display: flex;
    gap: 10px;
  }
  
  .refresh-button, .export-button {
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .refresh-button:hover, .export-button:hover {
    background-color: #e0e0e0;
  }
  
  .export-dropdown {
    position: relative;
  }
  
  .export-options {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    display: none;
    z-index: 10;
  }
  
  .export-dropdown:hover .export-options {
    display: block;
  }
  
  .export-options button {
    display: block;
    width: 100%;
    text-align: left;
    padding: 8px 12px;
    border: none;
    background: none;
    cursor: pointer;
  }
  
  .export-options button:hover {
    background-color: #f5f5f5;
  }
  
  .dashboard-section {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-bottom: 20px;
  }
  
  .dashboard-section h2 {
    font-size: 18px;
    font-weight: 500;
    margin-top: 0;
    margin-bottom: 15px;
    color: #555;
  }
  
  .dashboard-row {
    display: flex;
    gap: 20px;
  }
  
  .dashboard-section.half {
    flex: 1;
  }
  
  .rsvp-summary-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
  }
  
  .summary-card {
    flex: 1;
    min-width: 200px;
    background-color: #f9f9f9;
    border-radius: 6px;
    padding: 15px;
    display: flex;
    align-items: center;
  }
  
  .summary-card.total {
    background-color: #e3f2fd;
  }
  
  .summary-card.accepted {
    background-color: #e8f5e9;
  }
  
  .summary-card.declined {
    background-color: #ffebee;
  }
  
  .summary-card.pending {
    background-color: #fff8e1;
  }
  
  .summary-card.accommodation {
    background-color: #e0f7fa;
  }
  
  .card-icon {
    font-size: 24px;
    margin-right: 15px;
    color: #555;
  }
  
  .summary-card.total .card-icon {
    color: #1976d2;
  }
  
  .summary-card.accepted .card-icon {
    color: #4caf50;
  }
  
  .summary-card.declined .card-icon {
    color: #f44336;
  }
  
  .summary-card.pending .card-icon {
    color: #ff9800;
  }
  
  .summary-card.accommodation .card-icon {
    color: #00acc1;
  }
  
  .card-content {
    flex: 1;
  }
  
  .card-content h3 {
    font-size: 14px;
    font-weight: 400;
    margin: 0 0 5px 0;
    color: #777;
  }
  
  .card-value {
    font-size: 24px;
    font-weight: 500;
  }
  
  .card-percentage {
    font-size: 14px;
    color: #777;
  }
  
  .percentage-label {
    font-size: 12px;
  }
  
  .chart-container {
    height: 300px;
    position: relative;
  }
  
  .utilization-bar {
    width: 100%;
    height: 20px;
    background-color: #f5f5f5;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
  }
  
  .utilization-fill {
    height: 100%;
    border-radius: 10px;
  }
  
  .utilization-fill.high {
    background-color: #4caf50;
  }
  
  .utilization-fill.medium {
    background-color: #ff9800;
  }
  
  .utilization-fill.low {
    background-color: #f44336;
  }
  
  .utilization-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #333;
    font-size: 12px;
    font-weight: 500;
  }
`;

// ----- INTEGRATION WITH WEWEB -----

/**
 * The following section outlines how the above functionality would be
 * integrated with WeWeb's no-code platform.
 * 
 * In WeWeb, the implementation would involve:
 * 1. Setting up Supabase as a data source
 * 2. Creating pages and components using the WeWeb editor
 * 3. Binding data and actions to the components
 * 4. Setting up workflows for form submissions and data operations
 */

// WeWeb Page Structure:
// 1. Admin Dashboard
//    - Statistics Dashboard Tab
// 
// 2. Statistics Dashboard Page
//    - RSVP Summary Cards
//    - RSVP Timeline Chart
//    - Guest Groups Chart
//    - Table Statistics Table
//    - Dietary Requirements Chart
//    - Export Statistics Button

// WeWeb Data Bindings:
// 1. Supabase Tables:
//    - statistics
//    - rsvp_responses
//    - guests
//    - tables
//    - table_assignments
// 
// 2. Supabase Queries:
//    - getWeddingRsvpStatistics
//    - getRsvpResponseTimeline
//    - getGuestGroupStatistics
//    - getTableStatistics
//    - getComprehensiveWeddingStatistics
// 
// 3. Supabase Mutations:
//    - updateWeddingStatistics

// WeWeb Workflows:
// 1. Refresh Statistics Workflow:
//    - Trigger: Button click
//    - Actions: Call updateWeddingStatistics, Refresh all components
// 
// 2. Export Statistics Workflow:
//    - Trigger: Button click
//    - Actions: Call getComprehensiveWeddingStatistics, Format data, Call export function based on format selection
