class TestDataGenerator {
  static generateGuests(count = 20) {
    const firstNames = ['Anna', 'Max', 'Sophie', 'Paul', 'Lena'];
    const lastNames = ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber'];
    const statuses = ['confirmed', 'declined', 'pending'];

    return Array.from({ length: count }, (_, i) => ({
      id: `guest-${i}`,
      name: `${this.randomItem(firstNames)} ${this.randomItem(lastNames)}`,
      email: `guest${i}@example.com`,
      status: this.randomItem(statuses),
      table: i < 10 ? '1' : i < 15 ? '2' : null
    }));
  }

  static generateBudgetCategories() {
    return [
      { name: 'Location', amount: 5000 },
      { name: 'Catering', amount: 3000 },
      { name: 'Fotograf', amount: 1500 },
      { name: 'Blumen', amount: 800 }
    ];
  }

  static randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  static async seedDatabase() {
    /* Für Manus:
    1. Mit Supabase verbinden
    2. Tabellen leeren
    3. Testdaten einfügen
    */
    console.log('Testdaten generiert:', {
      guests: this.generateGuests(),
      budget: this.generateBudgetCategories()
    });
  }
}

// Verwendung:
// TestDataGenerator.seedDatabase();