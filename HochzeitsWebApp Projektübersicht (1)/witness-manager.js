class WitnessManager {
  constructor(role) {
    this.role = role; // 'bestman' oder 'bestwoman'
    this.tasks = [];
    this.expenses = [];
    this.initUI();
  }

  initUI() {
    const witnessHTML = `
      <div class="witness-container" data-role="${this.role}">
        <h2>${this.role === 'bestman' ? 'Trauzeuge' : 'Trauzeugin'} Bereich</h2>
        
        <section class="tasks-section">
          <h3>Aufgaben</h3>
          <ul id="witnessTasks"></ul>
          <form id="addTaskForm">
            <input type="text" placeholder="Neue Aufgabe" required>
            <button type="submit">Hinzufügen</button>
          </form>
        </section>

        <section class="expenses-section">
          <h3>Kostenaufteilung</h3>
          <div id="expensesList"></div>
          <form id="addExpenseForm">
            <input type="text" placeholder="Beschreibung" required>
            <input type="number" placeholder="Betrag" step="0.01" required>
            <button type="submit">Hinzufügen</button>
          </form>
        </section>
      </div>
    `;

    document.getElementById('manus-custom-area').insertAdjacentHTML('beforeend', witnessHTML);
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.getElementById('addTaskForm').addEventListener('submit', this.addTask.bind(this));
    document.getElementById('addExpenseForm').addEventListener('submit', this.addExpense.bind(this));
  }

  addTask(e) {
    e.preventDefault();
    /* Für Manus: Aufgabe hinzufügen */
  }

  addExpense(e) {
    e.preventDefault();
    /* Für Manus: Ausgabe hinzufügen */
  }
}