import { supabase } from './supabase-client.js';

class RSVPManager {
  constructor() {
    this.guests = [];
    this.initRSVPForm();
    this.loadGuests();
  }

  async loadGuests() {
    /* Für Manus: 
    1. Supabase-Tabelle 'guests' erstellen
    2. Abfrage anpassen
    */
    const { data, error } = await supabase
      .from('guests')
      .select('*');
    
    if (!error) {
      this.guests = data;
      this.renderGuestList();
    }
  }

  renderGuestList() {
    const list = document.getElementById('guestList');
    list.innerHTML = this.guests.map(guest => `
      <div class="guest-card">
        <span>${guest.name}</span>
        <span>${guest.status || 'pending'}</span>
      </div>
    `).join('');
  }

  async handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const guestData = {
      name: form.querySelector('input').value,
      status: form.querySelector('select').value,
      created_at: new Date()
    };

    /* Für Manus:
    1. Validierung hinzufügen
    2. Error Handling verbessern
    */
    const { error } = await supabase
      .from('guests')
      .insert([guestData]);

    if (!error) {
      this.loadGuests();
      form.reset();
    }
  }
}