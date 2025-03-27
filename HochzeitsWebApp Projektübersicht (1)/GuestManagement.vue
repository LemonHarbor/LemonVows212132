<template>
  <div class="guest-management">
    <div class="guest-management__header">
      <h1>{{ $t('guestManagement.title') }}</h1>
      <p>{{ $t('guestManagement.description') }}</p>
      
      <div class="guest-management__controls">
        <button class="btn btn-primary" @click="showAddGuestModal">
          <i class="icon icon-plus"></i> {{ $t('guestManagement.addGuest') }}
        </button>
        <button class="btn btn-secondary" @click="showImportModal">
          <i class="icon icon-upload"></i> {{ $t('guestManagement.importGuests') }}
        </button>
        <button class="btn btn-secondary" @click="exportGuestList">
          <i class="icon icon-download"></i> {{ $t('guestManagement.exportGuestList') }}
        </button>
        <button class="btn btn-secondary" @click="showRSVPLinkModal">
          <i class="icon icon-link"></i> {{ $t('guestManagement.generateRSVPLinks') }}
        </button>
      </div>
    </div>
    
    <div class="guest-management__content">
      <div class="guest-management__filters">
        <div class="guest-management__search">
          <input 
            type="text" 
            v-model="search" 
            :placeholder="$t('guestManagement.searchGuests')" 
          />
        </div>
        
        <div class="guest-management__filter-group">
          <label>{{ $t('guestManagement.filterByRSVP') }}</label>
          <select v-model="rsvpFilter">
            <option value="all">{{ $t('guestManagement.all') }}</option>
            <option value="confirmed">{{ $t('guestManagement.confirmed') }}</option>
            <option value="pending">{{ $t('guestManagement.pending') }}</option>
            <option value="declined">{{ $t('guestManagement.declined') }}</option>
          </select>
        </div>
        
        <div class="guest-management__filter-group">
          <label>{{ $t('guestManagement.filterByGroup') }}</label>
          <select v-model="groupFilter">
            <option value="all">{{ $t('guestManagement.all') }}</option>
            <option v-for="group in guestGroups" :key="group.name" :value="group.name">
              {{ group.name }}
            </option>
          </select>
        </div>
        
        <div class="guest-management__filter-group">
          <label>{{ $t('guestManagement.filterByDietary') }}</label>
          <select v-model="dietaryFilter">
            <option value="all">{{ $t('guestManagement.all') }}</option>
            <option value="any">{{ $t('guestManagement.anyRestrictions') }}</option>
            <option value="none">{{ $t('guestManagement.noRestrictions') }}</option>
            <option value="vegetarian">{{ $t('guestManagement.vegetarian') }}</option>
            <option value="vegan">{{ $t('guestManagement.vegan') }}</option>
            <option value="gluten-free">{{ $t('guestManagement.glutenFree') }}</option>
            <option value="lactose-free">{{ $t('guestManagement.lactoseFree') }}</option>
          </select>
        </div>
      </div>
      
      <div class="guest-management__stats">
        <div class="guest-management__stat-item">
          <div class="guest-management__stat-value">{{ totalGuests }}</div>
          <div class="guest-management__stat-label">{{ $t('guestManagement.totalGuests') }}</div>
        </div>
        <div class="guest-management__stat-item">
          <div class="guest-management__stat-value">{{ confirmedGuests }}</div>
          <div class="guest-management__stat-label">{{ $t('guestManagement.confirmed') }}</div>
        </div>
        <div class="guest-management__stat-item">
          <div class="guest-management__stat-value">{{ pendingGuests }}</div>
          <div class="guest-management__stat-label">{{ $t('guestManagement.pending') }}</div>
        </div>
        <div class="guest-management__stat-item">
          <div class="guest-management__stat-value">{{ declinedGuests }}</div>
          <div class="guest-management__stat-label">{{ $t('guestManagement.declined') }}</div>
        </div>
      </div>
      
      <div class="guest-management__table-container">
        <table class="guest-management__table">
          <thead>
            <tr>
              <th @click="sortBy('lastName')">
                {{ $t('guestManagement.name') }}
                <i v-if="sortKey === 'lastName'" :class="sortDirection === 'asc' ? 'icon-arrow-up' : 'icon-arrow-down'"></i>
              </th>
              <th @click="sortBy('email')">
                {{ $t('guestManagement.email') }}
                <i v-if="sortKey === 'email'" :class="sortDirection === 'asc' ? 'icon-arrow-up' : 'icon-arrow-down'"></i>
              </th>
              <th @click="sortBy('group')">
                {{ $t('guestManagement.group') }}
                <i v-if="sortKey === 'group'" :class="sortDirection === 'asc' ? 'icon-arrow-up' : 'icon-arrow-down'"></i>
              </th>
              <th @click="sortBy('rsvpStatus')">
                {{ $t('guestManagement.rsvpStatus') }}
                <i v-if="sortKey === 'rsvpStatus'" :class="sortDirection === 'asc' ? 'icon-arrow-up' : 'icon-arrow-down'"></i>
              </th>
              <th>{{ $t('guestManagement.plusOne') }}</th>
              <th>{{ $t('guestManagement.dietaryRestrictions') }}</th>
              <th>{{ $t('guestManagement.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="guest in filteredAndSortedGuests" :key="guest.id" @click="selectGuest(guest.id)">
              <td>{{ guest.firstName }} {{ guest.lastName }}</td>
              <td>{{ guest.email }}</td>
              <td>
                <span class="guest-group-tag" :style="{ backgroundColor: getGroupColor(guest.group) }">
                  {{ guest.group }}
                </span>
              </td>
              <td>
                <span :class="`rsvp-status rsvp-status--${guest.rsvpStatus}`">
                  {{ $t(`guestManagement.rsvpStatuses.${guest.rsvpStatus}`) }}
                </span>
              </td>
              <td>
                <span v-if="guest.plusOne">
                  <i class="icon icon-check"></i>
                  <span v-if="guest.plusOneName">{{ guest.plusOneName }}</span>
                </span>
                <span v-else>-</span>
              </td>
              <td>
                <div v-if="guest.dietaryRestrictions && guest.dietaryRestrictions.length" class="dietary-restrictions">
                  <span v-for="(restriction, index) in guest.dietaryRestrictions" :key="index" class="dietary-tag">
                    {{ restriction }}
                  </span>
                </div>
                <span v-else>-</span>
              </td>
              <td>
                <div class="guest-actions">
                  <button class="btn-icon" @click.stop="editGuest(guest.id)">
                    <i class="icon icon-edit"></i>
                  </button>
                  <button class="btn-icon" @click.stop="showSendRSVPModal(guest.id)">
                    <i class="icon icon-mail"></i>
                  </button>
                  <button class="btn-icon" @click.stop="deleteGuest(guest.id)">
                    <i class="icon icon-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredAndSortedGuests.length === 0">
              <td colspan="7" class="empty-state">
                {{ $t('guestManagement.noGuestsFound') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Guest Details Sidebar -->
    <div class="guest-management__sidebar" v-if="selectedGuest">
      <div class="guest-management__sidebar-header">
        <h3>{{ $t('guestManagement.guestDetails') }}</h3>
        <button class="btn-icon" @click="selectedGuest = null">
          <i class="icon icon-x"></i>
        </button>
      </div>
      
      <div class="guest-management__guest-profile">
        <div class="guest-management__guest-avatar">
          <div class="avatar" :style="{ backgroundColor: getGroupColor(getSelectedGuest.group) }">
            {{ getInitials(getSelectedGuest) }}
          </div>
        </div>
        <h4>{{ getSelectedGuest.firstName }} {{ getSelectedGuest.lastName }}</h4>
        <p>{{ getSelectedGuest.email }}</p>
      </div>
      
      <div class="guest-management__guest-details">
        <div class="detail-item">
          <div class="detail-label">{{ $t('guestManagement.rsvpStatus') }}</div>
          <div class="detail-value">
            <span :class="`rsvp-status rsvp-status--${getSelectedGuest.rsvpStatus}`">
              {{ $t(`guestManagement.rsvpStatuses.${getSelectedGuest.rsvpStatus}`) }}
            </span>
          </div>
        </div>
        
        <div class="detail-item">
          <div class="detail-label">{{ $t('guestManagement.group') }}</div>
          <div class="detail-value">
            <span class="guest-group-tag" :style="{ backgroundColor: getGroupColor(getSelectedGuest.group) }">
              {{ getSelectedGuest.group }}
            </span>
          </div>
        </div>
        
        <div class="detail-item">
          <div class="detail-label">{{ $t('guestManagement.phone') }}</div>
          <div class="detail-value">{{ getSelectedGuest.phone || '-' }}</div>
        </div>
        
        <div class="detail-item">
          <div class="detail-label">{{ $t('guestManagement.plusOne') }}</div>
          <div class="detail-value">
            <span v-if="getSelectedGuest.plusOne">
              {{ $t('guestManagement.yes') }}
              <span v-if="getSelectedGuest.plusOneName">({{ getSelectedGuest.plusOneName }})</span>
            </span>
            <span v-else>{{ $t('guestManagement.no') }}</span>
          </div>
        </div>
        
        <div class="detail-item">
          <div class="detail-label">{{ $t('guestManagement.accommodationNeeded') }}</div>
          <div class="detail-value">
            {{ getSelectedGuest.accommodationNeeded ? $t('guestManagement.yes') : $t('guestManagement.no') }}
          </div>
        </div>
        
        <div class="detail-item">
          <div class="detail-label">{{ $t('guestManagement.dietaryRestrictions') }}</div>
          <div class="detail-value">
            <div v-if="getSelectedGuest.dietaryRestrictions && getSelectedGuest.dietaryRestrictions.length" class="dietary-restrictions">
              <span v-for="(restriction, index) in getSelectedGuest.dietaryRestrictions" :key="index" class="dietary-tag">
                {{ restriction }}
              </span>
            </div>
            <span v-else>{{ $t('guestManagement.none') }}</span>
          </div>
        </div>
        
        <div class="detail-item">
          <div class="detail-label">{{ $t('guestManagement.tableAssignment') }}</div>
          <div class="detail-value">
            {{ getGuestTableName(getSelectedGuest.id) || $t('guestManagement.notAssigned') }}
          </div>
        </div>
        
        <div class="detail-item" v-if="getSelectedGuest.notes">
          <div class="detail-label">{{ $t('guestManagement.notes') }}</div>
          <div class="detail-value notes">{{ getSelectedGuest.notes }}</div>
        </div>
      </div>
      
      <div class="guest-management__sidebar-actions">
        <button class="btn btn-primary" @click="editGuest(getSelectedGuest.id)">
          <i class="icon icon-edit"></i> {{ $t('guestManagement.editGuest') }}
        </button>
        <button class="btn btn-secondary" @click="showSendRSVPModal(getSelectedGuest.id)">
          <i class="icon icon-mail"></i> {{ $t('guestManagement.sendRSVP') }}
        </button>
        <button class="btn btn-danger" @click="deleteGuest(getSelectedGuest.id)">
          <i class="icon icon-trash"></i> {{ $t('guestManagement.deleteGuest') }}
        </button>
      </div>
    </div>
    
    <!-- Add/Edit Guest Modal -->
    <div class="modal" v-if="showGuestModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isEditMode ? $t('guestManagement.editGuest') : $t('guestManagement.addGuest') }}</h3>
          <button class="btn-icon" @click="closeGuestModal">
            <i class="icon icon-x"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label>{{ $t('guestManagement.firstName') }} *</label>
              <input type="text" v-model="guestForm.firstName" required />
            </div>
            <div class="form-group">
              <label>{{ $t('guestManagement.lastName') }} *</label>
              <input type="text" v-model="guestForm.lastName" required />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>{{ $t('guestManagement.email') }} *</label>
              <input type="email" v-model="guestForm.email" required />
            </div>
            <div class="form-group">
              <label>{{ $t('guestManagement.phone') }}</label>
              <input type="tel" v-model="guestForm.phone" />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>{{ $t('guestManagement.group') }} *</label>
              <select v-model="guestForm.group" required>
                <option v-for="group in guestGroups" :key="group.name" :value="group.name">
                  {{ group.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>{{ $t('guestManagement.rsvpStatus') }}</label>
              <select v-model="guestForm.rsvpStatus">
                <option value="pending">{{ $t('guestManagement.rsvpStatuses.pending') }}</option>
                <option value="confirmed">{{ $t('guestManagement.rsvpStatuses.confirmed') }}</option>
                <option value="declined">{{ $t('guestManagement.rsvpStatuses.declined') }}</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group checkbox-group">
              <label>
                <input type="checkbox" v-model="guestForm.plusOne" />
                {{ $t('guestManagement.plusOne') }}
              </label>
            </div>
            <div class="form-group" v-if="guestForm.plusOne">
              <label>{{ $t('guestManagement.plusOneName') }}</label>
              <input type="text" v-model="guestForm.plusOneName" />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group checkbox-group">
              <label>
                <input type="checkbox" v-model="guestForm.accommodationNeeded" />
                {{ $t('guestManagement.accommodationNeeded') }}
              </label>
            </div>
          </div>
          
          <div class="form-group">
            <label>{{ $t('guestManagement.dietaryRestrictions') }}</label>
            <div class="checkbox-list">
              <label v-for="restriction in dietaryRestrictionOptions" :key="restriction.value">
                <input 
                  type="checkbox" 
                  :value="restriction.value" 
                  v-model="guestForm.dietaryRestrictions" 
                />
                {{ restriction.label }}
              </label>
            </div>
          </div>
          
          <div class="form-group">
            <label>{{ $t('guestManagement.notes') }}</label>
            <textarea v-model="guestForm.notes" rows="3"></textarea>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeGuestModal">
            {{ $t('guestManagement.cancel') }}
          </button>
          <button class="btn btn-primary" @click="saveGuest" :disabled="!isGuestFormValid">
            {{ $t('guestManagement.save') }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Import Guests Modal -->
    <div class="modal" v-if="showImportGuestsModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ $t('guestManagement.importGuests') }}</h3>
          <button class="btn-icon" @click="closeImportModal">
            <i class="icon icon-x"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="import-instructions">
            <p>{{ $t('guestManagement.importInstructions') }}</p>
            <a href="#" @click.prevent="downloadImportTemplate">
              {{ $t('guestManagement.downloadTemplate') }}
            </a>
          </div>
          
          <div class="file-upload">
            <label for="csv-upload" class="file-upload-label">
              <i class="icon icon-upload"></i>
              {{ $t('guestManagement.selectCSVFile') }}
            </label>
            <input 
              type="file" 
              id="csv-upload" 
              accept=".csv" 
              @change="handleFileUpload" 
              class="file-upload-input" 
            />
          </div>
          
          <div v-if="importPreview.length > 0" class="import-preview">
            <h4>{{ $t('guestManagement.preview') }}</h4>
            <table class="preview-table">
              <thead>
                <tr>
                  <th>{{ $t('guestManagement.firstName') }}</th>
                  <th>{{ $t('guestManagement.lastName') }}</th>
                  <th>{{ $t('guestManagement.email') }}</th>
                  <th>{{ $t('guestManagement.group') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(guest, index) in importPreview.slice(0, 5)" :key="index">
                  <td>{{ guest.firstName }}</td>
                  <td>{{ guest.lastName }}</td>
                  <td>{{ guest.email }}</td>
                  <td>{{ guest.group }}</td>
                </tr>
              </tbody>
            </table>
            <p v-if="importPreview.length > 5" class="preview-more">
              {{ $t('guestManagement.andMoreGuests', { count: importPreview.length - 5 }) }}
            </p>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeImportModal">
            {{ $t('guestManagement.cancel') }}
          </button>
          <button 
            class="btn btn-primary" 
            @click="importGuests" 
            :disabled="importPreview.length === 0"
          >
            {{ $t('guestManagement.import') }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- RSVP Link Modal -->
    <div class="modal" v-if="showRSVPLinkModalFlag">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ $t('guestManagement.generateRSVPLinks') }}</h3>
          <button class="btn-icon" @click="closeRSVPLinkModal">
            <i class="icon icon-x"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="rsvp-link-options">
            <div class="form-group">
              <label>{{ $t('guestManagement.selectGuests') }}</label>
              <select v-model="rsvpLinkFilter">
                <option value="all">{{ $t('guestManagement.allGuests') }}</option>
                <option value="pending">{{ $t('guestManagement.pendingGuests') }}</option>
                <option value="group">{{ $t('guestManagement.specificGroup') }}</option>
              </select>
            </div>
            
            <div class="form-group" v-if="rsvpLinkFilter === 'group'">
              <label>{{ $t('guestManagement.selectGroup') }}</label>
              <select v-model="rsvpLinkGroup">
                <option v-for="group in guestGroups" :key="group.name" :value="group.name">
                  {{ group.name }}
                </option>
              </select>
            </div>
          </div>
          
          <div class="rsvp-links" v-if="rsvpLinks.length > 0">
            <h4>{{ $t('guestManagement.generatedLinks') }}</h4>
            <div class="rsvp-link-list">
              <div v-for="(link, index) in rsvpLinks" :key="index" class="rsvp-link-item">
                <div class="rsvp-link-guest">{{ link.guestName }}</div>
                <div class="rsvp-link-url">
                  <input type="text" :value="link.url" readonly />
                  <button class="btn-icon" @click="copyToClipboard(link.url)">
                    <i class="icon icon-copy"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeRSVPLinkModal">
            {{ $t('guestManagement.close') }}
          </button>
          <button class="btn btn-primary" @click="generateRSVPLinks">
            {{ $t('guestManagement.generate') }}
          </button>
          <button 
            class="btn btn-secondary" 
            @click="sendRSVPEmails" 
            :disabled="rsvpLinks.length === 0"
          >
            {{ $t('guestManagement.sendEmails') }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Send RSVP Modal -->
    <div class="modal" v-if="showSendRSVPModalFlag">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ $t('guestManagement.sendRSVP') }}</h3>
          <button class="btn-icon" @click="closeSendRSVPModal">
            <i class="icon icon-x"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="send-rsvp-form">
            <div class="form-group">
              <label>{{ $t('guestManagement.to') }}</label>
              <input type="text" :value="getRSVPGuestEmail()" readonly />
            </div>
            
            <div class="form-group">
              <label>{{ $t('guestManagement.subject') }}</label>
              <input type="text" v-model="rsvpEmailSubject" />
            </div>
            
            <div class="form-group">
              <label>{{ $t('guestManagement.message') }}</label>
              <textarea v-model="rsvpEmailMessage" rows="6"></textarea>
            </div>
            
            <div class="form-group">
              <div class="rsvp-link-preview">
                <div class="rsvp-link-label">{{ $t('guestManagement.rsvpLink') }}:</div>
                <div class="rsvp-link-url">{{ getRSVPLink() }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeSendRSVPModal">
            {{ $t('guestManagement.cancel') }}
          </button>
          <button class="btn btn-primary" @click="sendSingleRSVPEmail">
            {{ $t('guestManagement.send') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GuestManagement',
  
  data() {
    return {
      guests: [],
      guestGroups: [],
      selectedGuest: null,
      search: '',
      rsvpFilter: 'all',
      groupFilter: 'all',
      dietaryFilter: 'all',
      sortKey: 'lastName',
      sortDirection: 'asc',
      
      // Add/Edit Guest Modal
      showGuestModal: false,
      isEditMode: false,
      guestForm: this.getEmptyGuestForm(),
      
      // Import Guests Modal
      showImportGuestsModal: false,
      importFile: null,
      importPreview: [],
      
      // RSVP Link Modal
      showRSVPLinkModalFlag: false,
      rsvpLinkFilter: 'all',
      rsvpLinkGroup: '',
      rsvpLinks: [],
      
      // Send RSVP Modal
      showSendRSVPModalFlag: false,
      rsvpGuestId: null,
      rsvpEmailSubject: '',
      rsvpEmailMessage: '',
      
      // Dietary restriction options
      dietaryRestrictionOptions: [
        { value: 'Vegetarisch', label: this.$t('guestManagement.vegetarian') },
        { value: 'Vegan', label: this.$t('guestManagement.vegan') },
        { value: 'Glutenfrei', label: this.$t('guestManagement.glutenFree') },
        { value: 'Laktosefrei', label: this.$t('guestManagement.lactoseFree') },
        { value: 'Nussallergie', label: this.$t('guestManagement.nutAllergy') },
        { value: 'Fischfrei', label: this.$t('guestManagement.fishFree') },
        { value: 'Halal', label: this.$t('guestManagement.halal') },
        { value: 'Kosher', label: this.$t('guestManagement.kosher') }
      ]
    };
  },
  
  computed: {
    totalGuests() {
      return this.guests.length;
    },
    
    confirmedGuests() {
      return this.guests.filter(guest => guest.rsvpStatus === 'confirmed').length;
    },
    
    pendingGuests() {
      return this.guests.filter(guest => guest.rsvpStatus === 'pending').length;
    },
    
    declinedGuests() {
      return this.guests.filter(guest => guest.rsvpStatus === 'declined').length;
    },
    
    filteredAndSortedGuests() {
      let result = [...this.guests];
      
      // Apply search filter
      if (this.search) {
        const searchLower = this.search.toLowerCase();
        result = result.filter(guest => 
          guest.firstName.toLowerCase().includes(searchLower) ||
          guest.lastName.toLowerCase().includes(searchLower) ||
          guest.email.toLowerCase().includes(searchLower) ||
          (guest.phone && guest.phone.includes(searchLower)) ||
          guest.group.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply RSVP filter
      if (this.rsvpFilter !== 'all') {
        result = result.filter(guest => guest.rsvpStatus === this.rsvpFilter);
      }
      
      // Apply group filter
      if (this.groupFilter !== 'all') {
        result = result.filter(guest => guest.group === this.groupFilter);
      }
      
      // Apply dietary filter
      if (this.dietaryFilter !== 'all') {
        if (this.dietaryFilter === 'any') {
          result = result.filter(guest => 
            guest.dietaryRestrictions && guest.dietaryRestrictions.length > 0
          );
        } else if (this.dietaryFilter === 'none') {
          result = result.filter(guest => 
            !guest.dietaryRestrictions || guest.dietaryRestrictions.length === 0
          );
        } else {
          result = result.filter(guest => 
            guest.dietaryRestrictions && 
            guest.dietaryRestrictions.includes(this.dietaryFilter)
          );
        }
      }
      
      // Apply sorting
      result.sort((a, b) => {
        let valueA, valueB;
        
        if (this.sortKey === 'lastName') {
          valueA = a.lastName.toLowerCase();
          valueB = b.lastName.toLowerCase();
        } else {
          valueA = a[this.sortKey];
          valueB = b[this.sortKey];
          
          if (typeof valueA === 'string') {
            valueA = valueA.toLowerCase();
          }
          if (typeof valueB === 'string') {
            valueB = valueB.toLowerCase();
          }
        }
        
        if (valueA < valueB) {
          return this.sortDirection === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
          return this.sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });
      
      return result;
    },
    
    getSelectedGuest() {
      return this.guests.find(guest => guest.id === this.selectedGuest) || {};
    },
    
    isGuestFormValid() {
      return (
        this.guestForm.firstName.trim() !== '' &&
        this.guestForm.lastName.trim() !== '' &&
        this.guestForm.email.trim() !== '' &&
        this.guestForm.group.trim() !== ''
      );
    }
  },
  
  mounted() {
    // Load data from Supabase
    this.loadGuests();
    this.loadGuestGroups();
    
    // Set default RSVP email templates
    this.setDefaultRSVPEmailTemplates();
  },
  
  methods: {
    // Data loading methods
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
            phone: '+49 123 456789',
            rsvpStatus: 'confirmed',
            rsvpDate: '2025-02-15T14:30:00Z',
            group: 'Familie Bräutigam',
            plusOne: false,
            plusOneName: '',
            accommodationNeeded: false,
            dietaryRestrictions: ['Vegetarisch'],
            notes: 'Langjähriger Freund des Bräutigams'
          },
          {
            id: '2',
            firstName: 'Anna',
            lastName: 'Schmidt',
            email: 'anna@example.com',
            phone: '+49 987 654321',
            rsvpStatus: 'confirmed',
            rsvpDate: '2025-02-16T10:15:00Z',
            group: 'Familie Braut',
            plusOne: true,
            plusOneName: 'Thomas Schmidt',
            accommodationNeeded: true,
            dietaryRestrictions: [],
            notes: 'Schwester der Braut'
          },
          {
            id: '3',
            firstName: 'Julia',
            lastName: 'Weber',
            email: 'julia@example.com',
            phone: '+49 555 123456',
            rsvpStatus: 'confirmed',
            rsvpDate: '2025-02-14T09:45:00Z',
            group: 'Freunde',
            plusOne: false,
            plusOneName: '',
            accommodationNeeded: false,
            dietaryRestrictions: ['Laktosefrei', 'Glutenfrei'],
            notes: 'Arbeitskollegin der Braut'
          },
          {
            id: '4',
            firstName: 'Michael',
            lastName: 'Becker',
            email: 'michael@example.com',
            phone: '+49 333 789456',
            rsvpStatus: 'pending',
            rsvpDate: null,
            group: 'Kollegen',
            plusOne: false,
            plusOneName: '',
            accommodationNeeded: false,
            dietaryRestrictions: [],
            notes: ''
          },
          {
            id: '5',
            firstName: 'Sarah',
            lastName: 'Müller',
            email: 'sarah@example.com',
            phone: '+49 444 987654',
            rsvpStatus: 'declined',
            rsvpDate: '2025-02-18T16:20:00Z',
            group: 'Freunde',
            plusOne: false,
            plusOneName: '',
            accommodationNeeded: false,
            dietaryRestrictions: ['Vegan'],
            notes: 'Kann leider nicht teilnehmen wegen Auslandsaufenthalt'
          }
        ];
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
    
    // Guest management methods
    selectGuest(guestId) {
      this.selectedGuest = guestId;
    },
    
    showAddGuestModal() {
      this.isEditMode = false;
      this.guestForm = this.getEmptyGuestForm();
      this.showGuestModal = true;
    },
    
    editGuest(guestId) {
      const guest = this.guests.find(g => g.id === guestId);
      if (!guest) return;
      
      this.isEditMode = true;
      this.guestForm = { ...guest };
      this.showGuestModal = true;
    },
    
    closeGuestModal() {
      this.showGuestModal = false;
    },
    
    async saveGuest() {
      if (!this.isGuestFormValid) return;
      
      try {
        if (this.isEditMode) {
          // Update existing guest
          const index = this.guests.findIndex(g => g.id === this.guestForm.id);
          if (index !== -1) {
            this.guests.splice(index, 1, { ...this.guestForm });
          }
          
          // This would update in Supabase in a real implementation
          // await this.$supabase
          //   .from('guests')
          //   .update(this.guestForm)
          //   .eq('id', this.guestForm.id);
        } else {
          // Add new guest
          const newGuest = {
            ...this.guestForm,
            id: Date.now().toString(),
            rsvpDate: null
          };
          
          this.guests.push(newGuest);
          
          // This would insert into Supabase in a real implementation
          // const { data, error } = await this.$supabase
          //   .from('guests')
          //   .insert(newGuest);
        }
        
        this.closeGuestModal();
      } catch (error) {
        console.error('Error saving guest:', error);
      }
    },
    
    async deleteGuest(guestId) {
      if (!confirm(this.$t('guestManagement.confirmDelete'))) {
        return;
      }
      
      try {
        this.guests = this.guests.filter(guest => guest.id !== guestId);
        
        if (this.selectedGuest === guestId) {
          this.selectedGuest = null;
        }
        
        // This would delete from Supabase in a real implementation
        // await this.$supabase
        //   .from('guests')
        //   .delete()
        //   .eq('id', guestId);
      } catch (error) {
        console.error('Error deleting guest:', error);
      }
    },
    
    // Import/Export methods
    showImportModal() {
      this.importFile = null;
      this.importPreview = [];
      this.showImportGuestsModal = true;
    },
    
    closeImportModal() {
      this.showImportGuestsModal = false;
    },
    
    downloadImportTemplate() {
      const template = 'firstName,lastName,email,phone,group,plusOne,plusOneName,accommodationNeeded,dietaryRestrictions,notes\n';
      const blob = new Blob([template], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'guest_import_template.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      this.importFile = file;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target.result;
        this.parseCSV(csv);
      };
      reader.readAsText(file);
    },
    
    parseCSV(csv) {
      const lines = csv.split('\n');
      const headers = lines[0].split(',');
      
      this.importPreview = [];
      
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(',');
        const guest = {};
        
        for (let j = 0; j < headers.length; j++) {
          const header = headers[j].trim();
          const value = values[j] ? values[j].trim() : '';
          
          if (header === 'dietaryRestrictions' && value) {
            guest[header] = value.split(';');
          } else if (header === 'plusOne' || header === 'accommodationNeeded') {
            guest[header] = value.toLowerCase() === 'true';
          } else {
            guest[header] = value;
          }
        }
        
        this.importPreview.push(guest);
      }
    },
    
    async importGuests() {
      if (this.importPreview.length === 0) return;
      
      try {
        // Add imported guests to the list
        const newGuests = this.importPreview.map(guest => ({
          ...guest,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
          rsvpStatus: 'pending',
          rsvpDate: null
        }));
        
        this.guests = [...this.guests, ...newGuests];
        
        // This would insert into Supabase in a real implementation
        // await this.$supabase
        //   .from('guests')
        //   .insert(newGuests);
        
        this.closeImportModal();
        alert(this.$t('guestManagement.importSuccess', { count: newGuests.length }));
      } catch (error) {
        console.error('Error importing guests:', error);
      }
    },
    
    exportGuestList() {
      // Create CSV content
      let csv = 'firstName,lastName,email,phone,group,rsvpStatus,plusOne,plusOneName,accommodationNeeded,dietaryRestrictions,notes\n';
      
      this.guests.forEach(guest => {
        const dietaryRestrictions = guest.dietaryRestrictions ? guest.dietaryRestrictions.join(';') : '';
        
        csv += `${guest.firstName},${guest.lastName},${guest.email},${guest.phone || ''},${guest.group},${guest.rsvpStatus},${guest.plusOne},${guest.plusOneName || ''},${guest.accommodationNeeded},${dietaryRestrictions},"${guest.notes || ''}"\n`;
      });
      
      // Create download link
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'guest_list.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    
    // RSVP management methods
    showRSVPLinkModal() {
      this.rsvpLinkFilter = 'all';
      this.rsvpLinkGroup = '';
      this.rsvpLinks = [];
      this.showRSVPLinkModalFlag = true;
    },
    
    closeRSVPLinkModal() {
      this.showRSVPLinkModalFlag = false;
    },
    
    generateRSVPLinks() {
      // Filter guests based on selected options
      let filteredGuests = [...this.guests];
      
      if (this.rsvpLinkFilter === 'pending') {
        filteredGuests = filteredGuests.filter(guest => guest.rsvpStatus === 'pending');
      } else if (this.rsvpLinkFilter === 'group' && this.rsvpLinkGroup) {
        filteredGuests = filteredGuests.filter(guest => guest.group === this.rsvpLinkGroup);
      }
      
      // Generate links
      this.rsvpLinks = filteredGuests.map(guest => {
        // In a real implementation, we would generate a secure token
        const token = btoa(`${guest.id}-${Date.now()}`);
        
        return {
          guestId: guest.id,
          guestName: `${guest.firstName} ${guest.lastName}`,
          url: `${window.location.origin}/rsvp/${token}`
        };
      });
    },
    
    copyToClipboard(text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          alert(this.$t('guestManagement.copiedToClipboard'));
        })
        .catch(err => {
          console.error('Error copying to clipboard:', err);
        });
    },
    
    sendRSVPEmails() {
      // In a real implementation, this would send emails via a backend service
      alert(this.$t('guestManagement.emailsSent', { count: this.rsvpLinks.length }));
    },
    
    showSendRSVPModal(guestId) {
      const guest = this.guests.find(g => g.id === guestId);
      if (!guest) return;
      
      this.rsvpGuestId = guestId;
      this.setDefaultRSVPEmailTemplates();
      this.showSendRSVPModalFlag = true;
    },
    
    closeSendRSVPModal() {
      this.showSendRSVPModalFlag = false;
    },
    
    getRSVPGuestEmail() {
      const guest = this.guests.find(g => g.id === this.rsvpGuestId);
      return guest ? guest.email : '';
    },
    
    getRSVPLink() {
      if (!this.rsvpGuestId) return '';
      
      // In a real implementation, we would generate a secure token
      const token = btoa(`${this.rsvpGuestId}-${Date.now()}`);
      return `${window.location.origin}/rsvp/${token}`;
    },
    
    setDefaultRSVPEmailTemplates() {
      this.rsvpEmailSubject = this.$t('guestManagement.defaultRSVPSubject');
      this.rsvpEmailMessage = this.$t('guestManagement.defaultRSVPMessage');
    },
    
    sendSingleRSVPEmail() {
      // In a real implementation, this would send an email via a backend service
      alert(this.$t('guestManagement.emailSent'));
      this.closeSendRSVPModal();
    },
    
    // Utility methods
    getEmptyGuestForm() {
      return {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        rsvpStatus: 'pending',
        group: this.guestGroups.length > 0 ? this.guestGroups[0].name : '',
        plusOne: false,
        plusOneName: '',
        accommodationNeeded: false,
        dietaryRestrictions: [],
        notes: ''
      };
    },
    
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = key;
        this.sortDirection = 'asc';
      }
    },
    
    getGroupColor(groupName) {
      const group = this.guestGroups.find(g => g.name === groupName);
      return group ? group.color : '#BDBDBD';
    },
    
    getGuestTableName(guestId) {
      // This would be implemented when integrated with the table planner
      return '';
    },
    
    getInitials(guest) {
      if (!guest) return '';
      
      const firstInitial = guest.firstName ? guest.firstName.charAt(0) : '';
      const lastInitial = guest.lastName ? guest.lastName.charAt(0) : '';
      
      return `${firstInitial}${lastInitial}`;
    }
  }
};
</script>

<style scoped>
.guest-management {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #FFF9EB;
  position: relative;
}

.guest-management__header {
  padding: 24px;
  background-color: #FFFFFF;
  border-bottom: 1px solid #F2F2F2;
}

.guest-management__controls {
  display: flex;
  gap: 16px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.guest-management__content {
  flex: 1;
  padding: 24px;
  overflow: auto;
}

.guest-management__filters {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.guest-management__search {
  flex: 1;
  min-width: 200px;
}

.guest-management__search input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #BDBDBD;
  border-radius: 8px;
}

.guest-management__filter-group {
  min-width: 150px;
}

.guest-management__filter-group label {
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
  color: #4F4F4F;
}

.guest-management__filter-group select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #BDBDBD;
  border-radius: 8px;
}

.guest-management__stats {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.guest-management__stat-item {
  background-color: #FFFFFF;
  border-radius: 8px;
  padding: 16px;
  min-width: 120px;
  flex: 1;
  text-align: center;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
}

.guest-management__stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #073B4C;
  margin-bottom: 4px;
}

.guest-management__stat-label {
  font-size: 14px;
  color: #4F4F4F;
}

.guest-management__table-container {
  background-color: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.guest-management__table {
  width: 100%;
  border-collapse: collapse;
}

.guest-management__table th {
  background-color: #F2F2F2;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #4F4F4F;
  cursor: pointer;
}

.guest-management__table th:hover {
  background-color: #E0E0E0;
}

.guest-management__table td {
  padding: 12px 16px;
  border-bottom: 1px solid #F2F2F2;
}

.guest-management__table tbody tr {
  cursor: pointer;
}

.guest-management__table tbody tr:hover {
  background-color: #FFF9EB;
}

.guest-group-tag {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #FFFFFF;
}

.rsvp-status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.rsvp-status--confirmed {
  background-color: #06D6A0;
  color: #FFFFFF;
}

.rsvp-status--pending {
  background-color: #FFD166;
  color: #073B4C;
}

.rsvp-status--declined {
  background-color: #EF476F;
  color: #FFFFFF;
}

.dietary-restrictions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.dietary-tag {
  background-color: #F2F2F2;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.guest-actions {
  display: flex;
  gap: 8px;
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

.empty-state {
  text-align: center;
  padding: 32px;
  color: #BDBDBD;
}

.guest-management__sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 320px;
  height: 100%;
  background-color: #FFFFFF;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.guest-management__sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #F2F2F2;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.guest-management__guest-profile {
  padding: 24px 16px;
  text-align: center;
  border-bottom: 1px solid #F2F2F2;
}

.guest-management__guest-avatar {
  margin: 0 auto 16px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  color: #FFFFFF;
  margin: 0 auto;
}

.guest-management__guest-details {
  padding: 16px;
  flex: 1;
}

.detail-item {
  margin-bottom: 16px;
}

.detail-label {
  font-size: 12px;
  color: #4F4F4F;
  margin-bottom: 4px;
}

.detail-value {
  font-size: 16px;
}

.detail-value.notes {
  white-space: pre-line;
  font-size: 14px;
}

.guest-management__sidebar-actions {
  padding: 16px;
  border-top: 1px solid #F2F2F2;
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  min-width: 0;
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
  flex-wrap: wrap;
  gap: 8px;
}

.checkbox-list label {
  display: flex;
  align-items: center;
  margin-right: 16px;
  cursor: pointer;
}

.checkbox-list input[type="checkbox"] {
  width: auto;
  margin-right: 4px;
}

.import-instructions {
  margin-bottom: 24px;
}

.file-upload {
  margin-bottom: 24px;
}

.file-upload-label {
  display: inline-block;
  padding: 12px 24px;
  background-color: #F2F2F2;
  border-radius: 8px;
  cursor: pointer;
}

.file-upload-input {
  display: none;
}

.import-preview {
  margin-top: 24px;
}

.preview-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
}

.preview-table th {
  background-color: #F2F2F2;
  padding: 8px;
  text-align: left;
}

.preview-table td {
  padding: 8px;
  border-bottom: 1px solid #F2F2F2;
}

.preview-more {
  margin-top: 8px;
  font-style: italic;
  color: #4F4F4F;
}

.rsvp-link-options {
  margin-bottom: 24px;
}

.rsvp-links {
  margin-top: 24px;
}

.rsvp-link-list {
  margin-top: 8px;
}

.rsvp-link-item {
  margin-bottom: 16px;
}

.rsvp-link-guest {
  font-weight: 500;
  margin-bottom: 4px;
}

.rsvp-link-url {
  display: flex;
  gap: 8px;
}

.rsvp-link-url input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #BDBDBD;
  border-radius: 4px;
  font-size: 12px;
}

.send-rsvp-form {
  margin-bottom: 16px;
}

.rsvp-link-preview {
  background-color: #F2F2F2;
  padding: 12px;
  border-radius: 8px;
  margin-top: 16px;
}

.rsvp-link-label {
  font-weight: 500;
  margin-bottom: 4px;
}

.rsvp-link-url {
  word-break: break-all;
  font-size: 14px;
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

.btn-danger {
  background-color: #EF476F;
  color: #FFFFFF;
}

.btn-danger:hover {
  background-color: #D63D65;
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
  
  .guest-management__sidebar {
    width: 100%;
  }
  
  .guest-management__filters {
    flex-direction: column;
    gap: 8px;
  }
  
  .guest-management__table th:nth-child(3),
  .guest-management__table td:nth-child(3),
  .guest-management__table th:nth-child(5),
  .guest-management__table td:nth-child(5) {
    display: none;
  }
}
</style>
