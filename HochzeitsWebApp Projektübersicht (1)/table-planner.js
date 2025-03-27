class TablePlanner {
  constructor() {
    this.tables = [];
    this.guests = [];
    this.initTablePlanner();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const guestList = document.getElementById('availableGuests');
    const tablesArea = document.querySelector('.tables-area');

    // Drag Funktionalität für Gäste
    guestList.addEventListener('dragstart', (e) => {
      if (e.target.classList.contains('guest-item')) {
        e.dataTransfer.setData('text/plain', e.target.dataset.guestId);
      }
    });

    // Drop Funktionalität für Tische
    tablesArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (e.target.classList.contains('table')) {
        e.target.style.backgroundColor = '#FFF0B3';
      }
    });

    tablesArea.addEventListener('drop', (e) => {
      e.preventDefault();
      const table = e.target.closest('.table');
      if (table) {
        const guestId = e.dataTransfer.getData('text/plain');
        this.assignGuestToTable(guestId, table.dataset.table);
        table.style.backgroundColor = '';
      }
    });
  }

  assignGuestToTable(guestId, tableId) {
    /* Für Manus:
    1. Datenbank-Update implementieren
    2. Visuelle Zuordnung verbessern
    */
    console.log(`Gast ${guestId} zu Tisch ${tableId} zugewiesen`);
  }

  // [Bestehende Methoden beibehalten]
}