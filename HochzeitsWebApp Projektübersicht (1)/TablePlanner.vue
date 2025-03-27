<template>
  <div class="table-planner">
    <div class="table-planner__header">
      <h1>{{ $t('tablePlanner.title') }}</h1>
      <p>{{ $t('tablePlanner.description') }}</p>
      
      <div class="table-planner__controls">
        <button class="btn btn-primary" @click="addTable">
          <i class="icon icon-plus"></i> {{ $t('tablePlanner.addTable') }}
        </button>
        <div class="table-planner__shape-selector">
          <label>{{ $t('tablePlanner.tableShape') }}</label>
          <select v-model="selectedTableShape">
            <option value="round">{{ $t('tablePlanner.shapes.round') }}</option>
            <option value="rectangular">{{ $t('tablePlanner.shapes.rectangular') }}</option>
            <option value="square">{{ $t('tablePlanner.shapes.square') }}</option>
            <option value="oval">{{ $t('tablePlanner.shapes.oval') }}</option>
            <option value="custom">{{ $t('tablePlanner.shapes.custom') }}</option>
          </select>
        </div>
        <div class="table-planner__capacity-selector">
          <label>{{ $t('tablePlanner.capacity') }}</label>
          <input type="number" v-model="selectedTableCapacity" min="1" max="20" />
        </div>
        <button class="btn btn-secondary" @click="exportTablePlan">
          <i class="icon icon-download"></i> {{ $t('tablePlanner.export') }}
        </button>
      </div>
    </div>
    
    <div class="table-planner__content">
      <div class="table-planner__canvas" ref="canvas">
        <!-- Tables will be rendered here -->
        <div 
          v-for="table in tables" 
          :key="table.id" 
          class="table-planner__table" 
          :class="[
            `table-planner__table--${table.shape}`, 
            { 'table-planner__table--selected': selectedTable === table.id }
          ]"
          :style="getTableStyle(table)"
          @mousedown="startDrag($event, table.id)"
          @click="selectTable(table.id)"
        >
          <div class="table-planner__table-name">{{ table.name }}</div>
          <div class="table-planner__table-capacity">{{ table.capacity }}</div>
          
          <!-- Seats around the table -->
          <div 
            v-for="(seat, index) in getTableSeats(table)" 
            :key="`${table.id}-seat-${index}`"
            class="table-planner__seat"
            :class="{ 
              'table-planner__seat--occupied': seat.guestId,
              'table-planner__seat--selected': selectedSeat === `${table.id}-${index}` 
            }"
            :style="getSeatStyle(table, index, table.seats.length)"
            @click.stop="selectSeat(table.id, index)"
          >
            <div v-if="seat.guestId" class="table-planner__guest-indicator">
              <div class="table-planner__guest-avatar" :style="getGuestStyle(seat.guestId)"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="table-planner__sidebar">
        <div class="table-planner__guests">
          <h3>{{ $t('tablePlanner.guests') }}</h3>
          <div class="table-planner__search">
            <input 
              type="text" 
              v-model="guestSearch" 
              :placeholder="$t('tablePlanner.searchGuests')" 
            />
          </div>
          
          <div class="table-planner__guest-groups">
            <div v-for="group in guestGroups" :key="group.name" class="table-planner__guest-group">
              <h4>{{ group.name }}</h4>
              <div 
                v-for="guest in filteredGuests.filter(g => g.group === group.name)" 
                :key="guest.id"
                class="table-planner__guest-item"
                :class="{ 
                  'table-planner__guest-item--seated': isGuestSeated(guest.id),
                  'table-planner__guest-item--selected': selectedGuest === guest.id 
                }"
                draggable="true"
                @dragstart="startGuestDrag($event, guest.id)"
                @click="selectGuest(guest.id)"
              >
                <div class="table-planner__guest-avatar" :style="getGuestStyle(guest.id)"></div>
                <div class="table-planner__guest-info">
                  <div class="table-planner__guest-name">{{ guest.firstName }} {{ guest.lastName }}</div>
                  <div v-if="guest.dietaryRestrictions && guest.dietaryRestrictions.length" class="table-planner__guest-dietary">
                    <i class="icon icon-alert"></i>
                  </div>
                </div>
                <div v-if="isGuestSeated(guest.id)" class="table-planner__guest-table">
                  {{ getGuestTableName(guest.id) }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="selectedTable" class="table-planner__table-details">
          <h3>{{ $t('tablePlanner.tableDetails') }}</h3>
          <div class="table-planner__form-group">
            <label>{{ $t('tablePlanner.tableName') }}</label>
            <input type="text" v-model="getSelectedTable.name" />
          </div>
          <div class="table-planner__form-group">
            <label>{{ $t('tablePlanner.tableShape') }}</label>
            <select v-model="getSelectedTable.shape">
              <option value="round">{{ $t('tablePlanner.shapes.round') }}</option>
              <option value="rectangular">{{ $t('tablePlanner.shapes.rectangular') }}</option>
              <option value="square">{{ $t('tablePlanner.shapes.square') }}</option>
              <option value="oval">{{ $t('tablePlanner.shapes.oval') }}</option>
              <option value="custom">{{ $t('tablePlanner.shapes.custom') }}</option>
            </select>
          </div>
          <div class="table-planner__form-group">
            <label>{{ $t('tablePlanner.capacity') }}</label>
            <input type="number" v-model="getSelectedTable.capacity" min="1" max="20" />
          </div>
          <div class="table-planner__form-group">
            <label>{{ $t('tablePlanner.rotation') }}</label>
            <input type="range" v-model="getSelectedTable.rotation" min="0" max="359" step="1" />
            <span>{{ getSelectedTable.rotation }}°</span>
          </div>
          <button class="btn btn-danger" @click="deleteTable(selectedTable)">
            <i class="icon icon-trash"></i> {{ $t('tablePlanner.deleteTable') }}
          </button>
        </div>
        
        <div v-if="selectedGuest" class="table-planner__guest-details">
          <h3>{{ $t('tablePlanner.guestDetails') }}</h3>
          <div class="table-planner__guest-profile">
            <div class="table-planner__guest-avatar table-planner__guest-avatar--large" :style="getGuestStyle(selectedGuest)"></div>
            <div class="table-planner__guest-name">{{ getSelectedGuest.firstName }} {{ getSelectedGuest.lastName }}</div>
            <div class="table-planner__guest-email">{{ getSelectedGuest.email }}</div>
          </div>
          
          <div class="table-planner__guest-attributes">
            <div class="table-planner__guest-attribute">
              <span class="label">{{ $t('tablePlanner.rsvpStatus') }}:</span>
              <span class="value" :class="`status-${getSelectedGuest.rsvpStatus}`">
                {{ $t(`tablePlanner.rsvpStatuses.${getSelectedGuest.rsvpStatus}`) }}
              </span>
            </div>
            <div class="table-planner__guest-attribute">
              <span class="label">{{ $t('tablePlanner.group') }}:</span>
              <span class="value">{{ getSelectedGuest.group }}</span>
            </div>
            <div v-if="getSelectedGuest.plusOne" class="table-planner__guest-attribute">
              <span class="label">{{ $t('tablePlanner.plusOne') }}:</span>
              <span class="value">{{ getSelectedGuest.plusOneName || $t('tablePlanner.unnamed') }}</span>
            </div>
            <div v-if="getSelectedGuest.dietaryRestrictions && getSelectedGuest.dietaryRestrictions.length" class="table-planner__guest-attribute">
              <span class="label">{{ $t('tablePlanner.dietaryRestrictions') }}:</span>
              <span class="value">
                <span v-for="(restriction, index) in getSelectedGuest.dietaryRestrictions" :key="index" class="dietary-tag">
                  {{ restriction }}
                </span>
              </span>
            </div>
            <div v-if="getSelectedGuest.notes" class="table-planner__guest-attribute">
              <span class="label">{{ $t('tablePlanner.notes') }}:</span>
              <span class="value">{{ getSelectedGuest.notes }}</span>
            </div>
          </div>
          
          <div class="table-planner__guest-seating">
            <h4>{{ $t('tablePlanner.seating') }}</h4>
            <div v-if="isGuestSeated(selectedGuest)" class="table-planner__guest-current-seat">
              <span>{{ $t('tablePlanner.currentlySeatedAt') }} {{ getGuestTableName(selectedGuest) }}</span>
              <button class="btn btn-small btn-danger" @click="removeGuestFromSeat(selectedGuest)">
                <i class="icon icon-x"></i> {{ $t('tablePlanner.removeSeat') }}
              </button>
            </div>
            <div v-else class="table-planner__guest-no-seat">
              <span>{{ $t('tablePlanner.notSeated') }}</span>
            </div>
            
            <div v-if="selectedSeat" class="table-planner__assign-seat">
              <button class="btn btn-primary" @click="assignGuestToSeat(selectedGuest, selectedSeat)">
                {{ $t('tablePlanner.assignToSelectedSeat') }}
              </button>
            </div>
          </div>
        </div>
        
        <div v-if="conflictWarnings.length > 0" class="table-planner__conflicts">
          <h3>{{ $t('tablePlanner.conflictWarnings') }}</h3>
          <div v-for="(conflict, index) in conflictWarnings" :key="index" class="table-planner__conflict">
            <i class="icon icon-alert"></i>
            <span>{{ conflict.message }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TablePlanner',
  
  data() {
    return {
      tables: [],
      guests: [],
      guestGroups: [],
      selectedTable: null,
      selectedSeat: null,
      selectedGuest: null,
      selectedTableShape: 'round',
      selectedTableCapacity: 8,
      guestSearch: '',
      isDragging: false,
      draggedTable: null,
      dragOffset: { x: 0, y: 0 },
      conflictWarnings: []
    };
  },
  
  computed: {
    filteredGuests() {
      if (!this.guestSearch) return this.guests;
      
      const search = this.guestSearch.toLowerCase();
      return this.guests.filter(guest => 
        guest.firstName.toLowerCase().includes(search) || 
        guest.lastName.toLowerCase().includes(search) ||
        guest.email.toLowerCase().includes(search) ||
        guest.group.toLowerCase().includes(search)
      );
    },
    
    getSelectedTable() {
      return this.tables.find(table => table.id === this.selectedTable) || {};
    },
    
    getSelectedGuest() {
      return this.guests.find(guest => guest.id === this.selectedGuest) || {};
    }
  },
  
  mounted() {
    // Load data from Supabase
    this.loadTables();
    this.loadGuests();
    this.loadGuestGroups();
    
    // Set up event listeners for drag and drop
    document.addEventListener('mousemove', this.onDrag);
    document.addEventListener('mouseup', this.stopDrag);
    
    // Set up canvas for dropping guests
    const canvas = this.$refs.canvas;
    canvas.addEventListener('dragover', this.onCanvasDragOver);
    canvas.addEventListener('drop', this.onCanvasDrop);
  },
  
  beforeDestroy() {
    // Clean up event listeners
    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.stopDrag);
    
    const canvas = this.$refs.canvas;
    canvas.removeEventListener('dragover', this.onCanvasDragOver);
    canvas.removeEventListener('drop', this.onCanvasDrop);
  },
  
  methods: {
    // Data loading methods
    async loadTables() {
      try {
        // This would be replaced with actual Supabase query
        // const { data, error } = await this.$supabase
        //   .from('tables')
        //   .select('*')
        //   .eq('wedding_id', this.weddingId);
        
        // For demo purposes, we'll use mock data
        this.tables = [
          {
            id: '1',
            name: 'Tisch 1',
            shape: 'round',
            capacity: 8,
            position_x: 200,
            position_y: 200,
            rotation: 0,
            width: 150,
            height: 150,
            seats: Array(8).fill().map((_, i) => ({ index: i, guestId: null }))
          },
          {
            id: '2',
            name: 'Tisch 2',
            shape: 'rectangular',
            capacity: 6,
            position_x: 500,
            position_y: 200,
            rotation: 0,
            width: 200,
            height: 100,
            seats: Array(6).fill().map((_, i) => ({ index: i, guestId: null }))
          }
        ];
      } catch (error) {
        console.error('Error loading tables:', error);
      }
    },
    
    async loadGuests() {
      try {
        // This would be replaced with actual Supabase query
        // const { data, error } = await this.$supabase
        //   .from('guests')
        //   .select('*')
        //   .eq('wedding_id', this.weddingId);
        
        // For demo purposes, we'll use mock data
        this.guests = [
          {
            id: '1',
            firstName: 'Max',
            lastName: 'Mustermann',
            email: 'max@example.com',
            rsvpStatus: 'confirmed',
            group: 'Familie Bräutigam',
            plusOne: false,
            dietaryRestrictions: ['Vegetarisch']
          },
          {
            id: '2',
            firstName: 'Anna',
            lastName: 'Schmidt',
            email: 'anna@example.com',
            rsvpStatus: 'confirmed',
            group: 'Familie Braut',
            plusOne: true,
            plusOneName: 'Thomas Schmidt',
            dietaryRestrictions: []
          },
          {
            id: '3',
            firstName: 'Julia',
            lastName: 'Weber',
            email: 'julia@example.com',
            rsvpStatus: 'confirmed',
            group: 'Freunde',
            plusOne: false,
            dietaryRestrictions: ['Laktosefrei', 'Glutenfrei']
          },
          {
            id: '4',
            firstName: 'Michael',
            lastName: 'Becker',
            email: 'michael@example.com',
            rsvpStatus: 'pending',
            group: 'Kollegen',
            plusOne: false,
            dietaryRestrictions: []
          }
        ];
        
        // Assign some guests to seats for demo
        this.tables[0].seats[0].guestId = '1';
        this.tables[0].seats[1].guestId = '2';
      } catch (error) {
        console.error('Error loading guests:', error);
      }
    },
    
    async loadGuestGroups() {
      // This would normally come from the database
      this.guestGroups = [
        { name: 'Familie Bräutigam', color: '#FFD166' },
        { name: 'Familie Braut', color: '#06D6A0' },
        { name: 'Freunde', color: '#EF476F' },
        { name: 'Kollegen', color: '#073B4C' }
      ];
    },
    
    // Table manipulation methods
    addTable() {
      const newTableId = Date.now().toString();
      const newTable = {
        id: newTableId,
        name: `Tisch ${this.tables.length + 1}`,
        shape: this.selectedTableShape,
        capacity: this.selectedTableCapacity,
        position_x: 300,
        position_y: 300,
        rotation: 0,
        width: this.selectedTableShape === 'round' || this.selectedTableShape === 'oval' ? 150 : 200,
        height: this.selectedTableShape === 'round' || this.selectedTableShape === 'square' ? 150 : 100,
        seats: Array(parseInt(this.selectedTableCapacity)).fill().map((_, i) => ({ index: i, guestId: null }))
      };
      
      this.tables.push(newTable);
      this.selectedTable = newTableId;
      
      // This would save to Supabase in a real implementation
      // await this.$supabase.from('tables').insert(newTable);
    },
    
    deleteTable(tableId) {
      // Check if table has guests assigned
      const table = this.tables.find(t => t.id === tableId);
      const hasGuests = table.seats.some(seat => seat.guestId);
      
      if (hasGuests) {
        if (!confirm(this.$t('tablePlanner.confirmDeleteTableWithGuests'))) {
          return;
        }
      }
      
      this.tables = this.tables.filter(table => table.id !== tableId);
      if (this.selectedTable === tableId) {
        this.selectedTable = null;
      }
      
      // This would delete from Supabase in a real implementation
      // await this.$supabase.from('tables').delete().eq('id', tableId);
    },
    
    // Drag and drop methods
    startDrag(event, tableId) {
      this.isDragging = true;
      this.draggedTable = tableId;
      
      const table = this.tables.find(t => t.id === tableId);
      const rect = event.target.getBoundingClientRect();
      
      this.dragOffset = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
      
      event.preventDefault();
    },
    
    onDrag(event) {
      if (!this.isDragging || !this.draggedTable) return;
      
      const canvas = this.$refs.canvas;
      const canvasRect = canvas.getBoundingClientRect();
      
      const table = this.tables.find(t => t.id === this.draggedTable);
      if (!table) return;
      
      // Calculate new position
      const newX = event.clientX - canvasRect.left - this.dragOffset.x;
      const newY = event.clientY - canvasRect.top - this.dragOffset.y;
      
      // Update table position
      table.position_x = Math.max(0, Math.min(canvasRect.width - table.width, newX));
      table.position_y = Math.max(0, Math.min(canvasRect.height - table.height, newY));
      
      // Check for conflicts with other tables
      this.checkTableConflicts();
    },
    
    stopDrag() {
      if (this.isDragging) {
        this.isDragging = false;
        this.draggedTable = null;
        
        // This would update position in Supabase in a real implementation
        // const table = this.tables.find(t => t.id === this.draggedTable);
        // await this.$supabase.from('tables')
        //   .update({ position_x: table.position_x, position_y: table.position_y })
        //   .eq('id', table.id);
      }
    },
    
    startGuestDrag(event, guestId) {
      event.dataTransfer.setData('guestId', guestId);
    },
    
    onCanvasDragOver(event) {
      event.preventDefault();
    },
    
    onCanvasDrop(event) {
      event.preventDefault();
      
      const guestId = event.dataTransfer.getData('guestId');
      if (!guestId) return;
      
      // Find the closest seat to the drop position
      const canvas = this.$refs.canvas;
      const canvasRect = canvas.getBoundingClientRect();
      
      const dropX = event.clientX - canvasRect.left;
      const dropY = event.clientY - canvasRect.top;
      
      let closestSeat = null;
      let closestDistance = Infinity;
      let closestTableId = null;
      let closestSeatIndex = null;
      
      this.tables.forEach(table => {
        const tableElement = canvas.querySelector(`.table-planner__table[data-id="${table.id}"]`);
        if (!tableElement) return;
        
        const tableRect = tableElement.getBoundingClientRect();
        const tableX = tableRect.left - canvasRect.left + tableRect.width / 2;
        const tableY = tableRect.top - canvasRect.top + tableRect.height / 2;
        
        table.seats.forEach((seat, index) => {
          if (seat.guestId) return; // Skip occupied seats
          
          const seatPosition = this.calculateSeatPosition(table, index, table.seats.length);
          const seatX = tableX + seatPosition.x;
          const seatY = tableY + seatPosition.y;
          
          const distance = Math.sqrt(
            Math.pow(dropX - seatX, 2) + 
            Math.pow(dropY - seatY, 2)
          );
          
          if (distance < closestDistance) {
            closestDistance = distance;
            closestTableId = table.id;
            closestSeatIndex = index;
          }
        });
      });
      
      // If we found a close enough seat, assign the guest
      if (closestTableId && closestDistance < 100) {
        this.assignGuestToSeat(guestId, `${closestTableId}-${closestSeatIndex}`);
      }
    },
    
    // Guest and seat management
    selectTable(tableId) {
      this.selectedTable = tableId;
      this.selectedSeat = null;
    },
    
    selectSeat(tableId, seatIndex) {
      this.selectedSeat = `${tableId}-${seatIndex}`;
      this.selectedTable = tableId;
    },
    
    selectGuest(guestId) {
      this.selectedGuest = guestId;
    },
    
    assignGuestToSeat(guestId, seatId) {
      if (!guestId || !seatId) return;
      
      const [tableId, seatIndex] = seatId.split('-');
      const table = this.tables.find(t => t.id === tableId);
      if (!table) return;
      
      // Remove guest from any existing seat
      this.removeGuestFromSeat(guestId);
      
      // Assign to new seat
      table.seats[seatIndex].guestId = guestId;
      
      // Check for conflicts
      this.checkGuestConflicts();
      
      // This would update in Supabase in a real implementation
      // await this.$supabase.from('guests')
      //   .update({ table_id: tableId, seat_number: seatIndex })
      //   .eq('id', guestId);
    },
    
    removeGuestFromSeat(guestId) {
      this.tables.forEach(table => {
        table.seats.forEach(seat => {
          if (seat.guestId === guestId) {
            seat.guestId = null;
          }
        });
      });
      
      // This would update in Supabase in a real implementation
      // await this.$supabase.from('guests')
      //   .update({ table_id: null, seat_number: null })
      //   .eq('id', guestId);
    },
    
    isGuestSeated(guestId) {
      return this.tables.some(table => 
        table.seats.some(seat => seat.guestId === guestId)
      );
    },
    
    getGuestTableName(guestId) {
      for (const table of this.tables) {
        for (const seat of table.seats) {
          if (seat.guestId === guestId) {
            return table.name;
          }
        }
      }
      return '';
    },
    
    // Conflict detection
    checkTableConflicts() {
      // Check for tables that are too close to each other
      this.conflictWarnings = [];
      
      for (let i = 0; i < this.tables.length; i++) {
        const table1 = this.tables[i];
        
        for (let j = i + 1; j < this.tables.length; j++) {
          const table2 = this.tables[j];
          
          // Calculate centers
          const center1 = {
            x: table1.position_x + table1.width / 2,
            y: table1.position_y + table1.height / 2
          };
          
          const center2 = {
            x: table2.position_x + table2.width / 2,
            y: table2.position_y + table2.height / 2
          };
          
          // Calculate distance between centers
          const distance = Math.sqrt(
            Math.pow(center1.x - center2.x, 2) + 
            Math.pow(center1.y - center2.y, 2)
          );
          
          // Calculate minimum distance needed (sum of radii plus buffer)
          const minDistance = (table1.width + table2.width) / 2 + 20;
          
          if (distance < minDistance) {
            this.conflictWarnings.push({
              type: 'table',
              table1: table1.id,
              table2: table2.id,
              message: `${table1.name} und ${table2.name} sind zu nah beieinander.`
            });
          }
        }
      }
    },
    
    checkGuestConflicts() {
      // Check for guests with dietary conflicts or other issues
      // This would be more sophisticated in a real implementation
      
      // Example: Check if vegetarians are seated with meat-eaters
      this.tables.forEach(table => {
        const vegetarians = [];
        const nonVegetarians = [];
        
        table.seats.forEach(seat => {
          if (!seat.guestId) return;
          
          const guest = this.guests.find(g => g.id === seat.guestId);
          if (!guest) return;
          
          if (guest.dietaryRestrictions && guest.dietaryRestrictions.includes('Vegetarisch')) {
            vegetarians.push(guest);
          } else {
            nonVegetarians.push(guest);
          }
        });
        
        if (vegetarians.length > 0 && nonVegetarians.length > 0) {
          this.conflictWarnings.push({
            type: 'dietary',
            tableId: table.id,
            message: `${table.name} hat sowohl vegetarische als auch nicht-vegetarische Gäste.`
          });
        }
      });
    },
    
    // Styling methods
    getTableStyle(table) {
      return {
        left: `${table.position_x}px`,
        top: `${table.position_y}px`,
        width: `${table.width}px`,
        height: `${table.height}px`,
        transform: `rotate(${table.rotation}deg)`,
        'data-id': table.id
      };
    },
    
    getSeatStyle(table, index, totalSeats) {
      const position = this.calculateSeatPosition(table, index, totalSeats);
      
      return {
        left: `${position.x + table.width / 2}px`,
        top: `${position.y + table.height / 2}px`
      };
    },
    
    calculateSeatPosition(table, index, totalSeats) {
      let x, y;
      const radius = Math.min(table.width, table.height) / 2 + 20; // 20px outside the table
      
      if (table.shape === 'round' || table.shape === 'oval') {
        // For round tables, distribute seats in a circle
        const angle = (index / totalSeats) * 2 * Math.PI;
        x = Math.cos(angle) * radius;
        y = Math.sin(angle) * radius;
      } else if (table.shape === 'rectangular' || table.shape === 'square') {
        // For rectangular tables, distribute seats around the perimeter
        const perimeter = 2 * (table.width + table.height);
        const segmentLength = perimeter / totalSeats;
        const position = index * segmentLength;
        
        if (position < table.width) {
          // Top edge
          x = position - table.width / 2;
          y = -table.height / 2 - 20;
        } else if (position < table.width + table.height) {
          // Right edge
          x = table.width / 2 + 20;
          y = position - table.width - table.height / 2;
        } else if (position < 2 * table.width + table.height) {
          // Bottom edge
          x = table.width / 2 - (position - table.width - table.height);
          y = table.height / 2 + 20;
        } else {
          // Left edge
          x = -table.width / 2 - 20;
          y = table.height / 2 - (position - 2 * table.width - table.height);
        }
      }
      
      return { x, y };
    },
    
    getGuestStyle(guestId) {
      const guest = this.guests.find(g => g.id === guestId);
      if (!guest) return {};
      
      const group = this.guestGroups.find(g => g.name === guest.group);
      const color = group ? group.color : '#BDBDBD';
      
      return {
        backgroundColor: color
      };
    },
    
    getTableSeats(table) {
      return table.seats || [];
    },
    
    // Export functionality
    exportTablePlan() {
      // In a real implementation, this would generate a PDF or image
      alert(this.$t('tablePlanner.exportNotImplemented'));
    }
  }
};
</script>

<style scoped>
.table-planner {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #FFF9EB;
}

.table-planner__header {
  padding: 24px;
  background-color: #FFFFFF;
  border-bottom: 1px solid #F2F2F2;
}

.table-planner__controls {
  display: flex;
  gap: 16px;
  margin-top: 16px;
}

.table-planner__content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.table-planner__canvas {
  flex: 1;
  position: relative;
  background-color: #FFFFFF;
  border-right: 1px solid #F2F2F2;
  overflow: auto;
  min-height: 600px;
}

.table-planner__sidebar {
  width: 320px;
  background-color: #FFFFFF;
  overflow-y: auto;
}

.table-planner__table {
  position: absolute;
  background-color: #FFFFFF;
  border: 2px solid #FFD166;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: move;
  user-select: none;
}

.table-planner__table--round {
  border-radius: 50%;
}

.table-planner__table--oval {
  border-radius: 50%;
}

.table-planner__table--selected {
  border-color: #EF476F;
  box-shadow: 0 0 0 2px rgba(239, 71, 111, 0.3);
}

.table-planner__table-name {
  font-weight: bold;
  text-align: center;
}

.table-planner__table-capacity {
  font-size: 12px;
  color: #4F4F4F;
}

.table-planner__seat {
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #F2F2F2;
  border: 1px solid #BDBDBD;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transform: translate(-50%, -50%);
}

.table-planner__seat--occupied {
  background-color: #FFFFFF;
  border-color: #06D6A0;
}

.table-planner__seat--selected {
  border-color: #EF476F;
  box-shadow: 0 0 0 2px rgba(239, 71, 111, 0.3);
}

.table-planner__guest-indicator {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
}

.table-planner__guest-avatar {
  width: 100%;
  height: 100%;
  background-color: #BDBDBD;
}

.table-planner__guests {
  padding: 16px;
  border-bottom: 1px solid #F2F2F2;
}

.table-planner__search {
  margin-bottom: 16px;
}

.table-planner__search input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #BDBDBD;
  border-radius: 8px;
}

.table-planner__guest-group {
  margin-bottom: 16px;
}

.table-planner__guest-group h4 {
  margin-bottom: 8px;
  font-size: 14px;
  color: #4F4F4F;
}

.table-planner__guest-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 4px;
}

.table-planner__guest-item:hover {
  background-color: #F2F2F2;
}

.table-planner__guest-item--selected {
  background-color: #FFF9EB;
}

.table-planner__guest-item--seated {
  border-left: 3px solid #06D6A0;
}

.table-planner__guest-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
}

.table-planner__guest-info {
  flex: 1;
}

.table-planner__guest-name {
  font-size: 14px;
  font-weight: 500;
}

.table-planner__guest-dietary {
  font-size: 12px;
  color: #EF476F;
}

.table-planner__guest-table {
  font-size: 12px;
  color: #4F4F4F;
  background-color: #F2F2F2;
  padding: 2px 6px;
  border-radius: 4px;
}

.table-planner__table-details,
.table-planner__guest-details {
  padding: 16px;
  border-bottom: 1px solid #F2F2F2;
}

.table-planner__form-group {
  margin-bottom: 16px;
}

.table-planner__form-group label {
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
  color: #4F4F4F;
}

.table-planner__form-group input,
.table-planner__form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #BDBDBD;
  border-radius: 8px;
}

.table-planner__guest-profile {
  text-align: center;
  margin-bottom: 16px;
}

.table-planner__guest-avatar--large {
  width: 64px;
  height: 64px;
  margin: 0 auto 8px;
}

.table-planner__guest-attributes {
  margin-bottom: 16px;
}

.table-planner__guest-attribute {
  margin-bottom: 8px;
}

.table-planner__guest-attribute .label {
  font-weight: 500;
  color: #4F4F4F;
}

.dietary-tag {
  display: inline-block;
  background-color: #F2F2F2;
  padding: 2px 6px;
  border-radius: 4px;
  margin-right: 4px;
  font-size: 12px;
}

.table-planner__guest-seating {
  margin-top: 16px;
}

.table-planner__guest-current-seat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.table-planner__conflicts {
  padding: 16px;
  background-color: #FFEFEF;
}

.table-planner__conflict {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: #EF476F;
}

.table-planner__conflict i {
  margin-right: 8px;
}

.btn {
  padding: 8px 16px;
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

.btn-danger {
  background-color: #EF476F;
  color: #FFFFFF;
}

.btn-danger:hover {
  background-color: #D63D65;
}

.btn-small {
  padding: 4px 8px;
  font-size: 12px;
}

.status-confirmed {
  color: #06D6A0;
}

.status-pending {
  color: #FFD166;
}

.status-declined {
  color: #EF476F;
}
</style>
