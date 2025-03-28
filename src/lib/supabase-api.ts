import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Erstelle einen Typ für die Supabase-Datenbank
// Diese Typen werden normalerweise mit dem Supabase CLI generiert
// Für die Demo verwenden wir eine vereinfachte Version

// Supabase-Client erstellen
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo-lemonvows.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Demo-Daten für die Entwicklung
export const demoData = {
  // Benutzer
  currentUser: {
    id: 'demo-user-id',
    email: 'demo@example.com',
    name: 'Demo User',
    role: 'customer',
    createdAt: '2025-01-01T00:00:00Z',
    lastLogin: '2025-03-28T00:00:00Z',
    status: 'active',
    avatarUrl: null
  },
  
  // Hochzeit
  wedding: {
    id: 'demo-wedding-id',
    name: 'Julia & Thomas Hochzeit',
    date: '2025-08-15',
    userId: 'demo-user-id',
    plan: 'premium',
    status: 'active',
    guestCount: 120,
    createdAt: '2025-01-15T00:00:00Z',
    lastActive: '2025-03-28T00:00:00Z',
    customDomain: null,
    customColors: null
  },
  
  // Gäste
  guests: [
    {
      id: 'guest-1',
      weddingId: 'demo-wedding-id',
      firstName: 'Julia',
      lastName: 'Schmidt',
      email: 'julia@example.com',
      phone: '+49123456789',
      groupName: 'Familie Braut',
      rsvpStatus: 'confirmed',
      dietaryRestrictions: ['Nüsse'],
      plusOne: false,
      plusOneName: null,
      accommodationNeeded: true,
      notes: '',
      createdAt: '2025-01-20T00:00:00Z',
      updatedAt: '2025-01-20T00:00:00Z'
    },
    {
      id: 'guest-2',
      weddingId: 'demo-wedding-id',
      firstName: 'Thomas',
      lastName: 'Müller',
      email: 'thomas@example.com',
      phone: '+49123456780',
      groupName: 'Freunde',
      rsvpStatus: 'confirmed',
      dietaryRestrictions: [],
      plusOne: false,
      plusOneName: null,
      accommodationNeeded: true,
      notes: '',
      createdAt: '2025-01-20T00:00:00Z',
      updatedAt: '2025-01-20T00:00:00Z'
    },
    {
      id: 'guest-3',
      weddingId: 'demo-wedding-id',
      firstName: 'Sarah',
      lastName: 'Weber',
      email: 'sarah@example.com',
      phone: '+49123456781',
      groupName: 'Kollegen',
      rsvpStatus: 'pending',
      dietaryRestrictions: [],
      plusOne: false,
      plusOneName: null,
      accommodationNeeded: false,
      notes: '',
      createdAt: '2025-01-20T00:00:00Z',
      updatedAt: '2025-01-20T00:00:00Z'
    },
    {
      id: 'guest-4',
      weddingId: 'demo-wedding-id',
      firstName: 'Michael',
      lastName: 'König',
      email: 'michael@example.com',
      phone: '+49123456782',
      groupName: 'Familie Bräutigam',
      rsvpStatus: 'declined',
      dietaryRestrictions: [],
      plusOne: false,
      plusOneName: null,
      accommodationNeeded: false,
      notes: 'Ist im Urlaub',
      createdAt: '2025-01-20T00:00:00Z',
      updatedAt: '2025-01-20T00:00:00Z'
    },
    {
      id: 'guest-5',
      weddingId: 'demo-wedding-id',
      firstName: 'Anna',
      lastName: 'Schneider',
      email: 'anna@example.com',
      phone: '+49123456783',
      groupName: 'Freunde',
      rsvpStatus: 'confirmed',
      dietaryRestrictions: ['Laktose'],
      plusOne: false,
      plusOneName: null,
      accommodationNeeded: true,
      notes: '',
      createdAt: '2025-01-20T00:00:00Z',
      updatedAt: '2025-01-20T00:00:00Z'
    }
  ],
  
  // Tische
  tables: [
    {
      id: 'table-1',
      weddingId: 'demo-wedding-id',
      name: 'Tisch 1',
      shape: 'round',
      capacity: 8,
      rotation: 0,
      positionX: 100,
      positionY: 100,
      createdAt: '2025-01-25T00:00:00Z',
      updatedAt: '2025-01-25T00:00:00Z'
    },
    {
      id: 'table-2',
      weddingId: 'demo-wedding-id',
      name: 'Tisch 2',
      shape: 'rectangular',
      capacity: 6,
      rotation: 0,
      positionX: 300,
      positionY: 100,
      createdAt: '2025-01-25T00:00:00Z',
      updatedAt: '2025-01-25T00:00:00Z'
    }
  ],
  
  // Sitzplätze
  seats: [
    // Tisch 1
    { id: 'seat-1-1', tableId: 'table-1', guestId: 'guest-1', position: 1 },
    { id: 'seat-1-2', tableId: 'table-1', guestId: 'guest-2', position: 2 },
    { id: 'seat-1-3', tableId: 'table-1', guestId: 'guest-3', position: 3 },
    { id: 'seat-1-4', tableId: 'table-1', guestId: null, position: 4 },
    { id: 'seat-1-5', tableId: 'table-1', guestId: 'guest-4', position: 5 },
    { id: 'seat-1-6', tableId: 'table-1', guestId: 'guest-5', position: 6 },
    { id: 'seat-1-7', tableId: 'table-1', guestId: null, position: 7 },
    { id: 'seat-1-8', tableId: 'table-1', guestId: 'guest-6', position: 8 },
    
    // Tisch 2
    { id: 'seat-2-1', tableId: 'table-2', guestId: 'guest-7', position: 1 },
    { id: 'seat-2-2', tableId: 'table-2', guestId: 'guest-8', position: 2 },
    { id: 'seat-2-3', tableId: 'table-2', guestId: null, position: 3 },
    { id: 'seat-2-4', tableId: 'table-2', guestId: 'guest-9', position: 4 },
    { id: 'seat-2-5', tableId: 'table-2', guestId: 'guest-10', position: 5 },
    { id: 'seat-2-6', tableId: 'table-2', guestId: 'guest-11', position: 6 }
  ],
  
  // Budget-Kategorien
  budgetCategories: [
    {
      id: 'category-1',
      weddingId: 'demo-wedding-id',
      name: 'Location',
      plannedAmount: 4500,
      color: '#FF5733',
      createdAt: '2025-01-30T00:00:00Z',
      updatedAt: '2025-01-30T00:00:00Z'
    },
    {
      id: 'category-2',
      weddingId: 'demo-wedding-id',
      name: 'Catering',
      plannedAmount: 3750,
      color: '#33FF57',
      createdAt: '2025-01-30T00:00:00Z',
      updatedAt: '2025-01-30T00:00:00Z'
    },
    {
      id: 'category-3',
      weddingId: 'demo-wedding-id',
      name: 'Dekoration',
      plannedAmount: 2250,
      color: '#3357FF',
      createdAt: '2025-01-30T00:00:00Z',
      updatedAt: '2025-01-30T00:00:00Z'
    },
    {
      id: 'category-4',
      weddingId: 'demo-wedding-id',
      name: 'Kleidung',
      plannedAmount: 3000,
      color: '#F033FF',
      createdAt: '2025-01-30T00:00:00Z',
      updatedAt: '2025-01-30T00:00:00Z'
    },
    {
      id: 'category-5',
      weddingId: 'demo-wedding-id',
      name: 'Sonstiges',
      plannedAmount: 1500,
      color: '#FF33A8',
      createdAt: '2025-01-30T00:00:00Z',
      updatedAt: '2025-01-30T00:00:00Z'
    }
  ],
  
  // Budget-Ausgaben
  budgetExpenses: [
    {
      id: 'expense-1',
      categoryId: 'category-1',
      description: 'Anzahlung Location',
      amount: 2000,
      date: '2025-02-01',
      paid: true,
      receiptUrl: null,
      notes: '',
      createdAt: '2025-02-01T00:00:00Z',
      updatedAt: '2025-02-01T00:00:00Z'
    },
    {
      id: 'expense-2',
      categoryId: 'category-1',
      description: 'Restzahlung Location',
      amount: 2500,
      date: '2025-07-15',
      paid: true,
      receiptUrl: null,
      notes: '',
      createdAt: '2025-02-01T00:00:00Z',
      updatedAt: '2025-02-01T00:00:00Z'
    },
    {
      id: 'expense-3',
      categoryId: 'category-2',
      description: 'Anzahlung Catering',
      amount: 1500,
      date: '2025-02-15',
      paid: true,
      receiptUrl: null,
      notes: '',
      createdAt: '2025-02-15T00:00:00Z',
      updatedAt: '2025-02-15T00:00:00Z'
    },
    {
      id: 'expense-4',
      categoryId: 'category-2',
      description: 'Weinlieferung',
      amount: 1500,
      date: '2025-03-01',
      paid: true,
      receiptUrl: null,
      notes: '',
      createdAt: '2025-03-01T00:00:00Z',
      updatedAt: '2025-03-01T00:00:00Z'
    },
    {
      id: 'expense-5',
      categoryId: 'category-3',
      description: 'Blumendekoration',
      amount: 1500,
      date: '2025-03-15',
      paid: true,
      receiptUrl: null,
      notes: '',
      createdAt: '2025-03-15T00:00:00Z',
      updatedAt: '2025-03-15T00:00:00Z'
    },
    {
      id: 'expense-6',
      categoryId: 'category-4',
      description: 'Brautkleid',
      amount: 2000,
      date: '2025-02-20',
      paid: true,
      receiptUrl: null,
      notes: '',
      createdAt: '2025-02-20T00:00:00Z',
      updatedAt: '2025-02-20T00:00:00Z'
    },
    {
      id: 'expense-7',
      categoryId: 'category-4',
      description: 'Anzug Bräutigam',
      amount: 500,
      date: '2025-02-25',
      paid: true,
      receiptUrl: null,
      notes: '',
      createdAt: '2025-02-25T00:00:00Z',
      updatedAt: '2025-02-25T00:00:00Z'
    },
    {
      id: 'expense-8',
      categoryId: 'category-5',
      description: 'Einladungskarten',
      amount: 350,
      date: '2025-01-10',
      paid: true,
      receiptUrl: null,
      notes: '',
      createdAt: '2025-01-10T00:00:00Z',
      updatedAt: '2025-01-10T00:00:00Z'
    },
    {
      id: 'expense-9',
      categoryId: 'category-5',
      description: 'DJ',
      amount: 400,
      date: '2025-03-10',
      paid: true,
      receiptUrl: null,
      notes: '',
      createdAt: '2025-03-10T00:00:00Z',
      updatedAt: '2025-03-10T00:00:00Z'
    }
  ],
  
  // Zahlungen
  payments: [
    {
      id: 'payment-1',
      userId: 'demo-user-id',
      weddingId: 'demo-wedding-id',
      amount: 29.99,
      currency: 'EUR',
      status: 'completed',
      method: 'credit_card',
      date: '2025-01-01T00:00:00Z',
      plan: 'premium',
      duration: 'monthly',
      invoiceUrl: null,
      receiptUrl: null
    }
  ]
};

// Hilfsfunktionen für die Demo-Daten
export const demoApi = {
  // Gäste-Funktionen
  guests: {
    getAll: async () => {
      return { data: demoData.guests, error: null };
    },
    getById: async (id: string) => {
      const guest = demoData.guests.find(g => g.id === id);
      return { data: guest || null, error: guest ? null : new Error('Guest not found') };
    },
    create: async (guest: any) => {
      const newGuest = {
        ...guest,
        id: `guest-${demoData.guests.length + 1}`,
        weddingId: 'demo-wedding-id',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      demoData.guests.push(newGuest);
      return { data: newGuest, error: null };
    },
    update: async (id: string, updates: any) => {
      const index = demoData.guests.findIndex(g => g.id === id);
      if (index === -1) return { data: null, error: new Error('Guest not found') };
      
      const updatedGuest = {
        ...demoData.guests[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      demoData.guests[index] = updatedGuest;
      return { data: updatedGuest, error: null };
    },
    delete: async (id: string) => {
      const index = demoData.guests.findIndex(g => g.id === id);
      if (index === -1) return { data: null, error: new Error('Guest not found') };
      
      const deletedGuest = demoData.guests[index];
      demoData.guests.splice(index, 1);
      return { data: deletedGuest, error: null };
    }
  },
  
  // Tisch-Funktionen
  tables: {
    getAll: async () => {
      return { data: demoData.tables, error: null };
    },
    getById: async (id: string) => {
      const table = demoData.tables.find(t => t.id === id);
      return { data: table || null, error: table ? null : new Error('Table not found') };
    },
    create: async (table: any) => {
      const newTable = {
        ...table,
        id: `table-${demoData.tables.length + 1}`,
        weddingId: 'demo-wedding-id',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      demoData.tables.push(newTable);
      return { data: newTable, error: null };
    },
    update: async (id: string, updates: any) => {
      const index = demoData.tables.findIndex(t => t.id === id);
      if (index === -1) return { data: null, error: new Error('Table not found') };
      
      const updatedTable = {
        ...demoData.tables[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      demoData.tables[index] = updatedTable;
      return { data: updatedTable, error: null };
    },
    delete: async (id: string) => {
      const index = demoData.tables.findIndex(t => t.id === id);
      if (index === -1) return { data: null, error: new Error('Table not found') };
      
      const deletedTable = demoData.tables[index];
      demoData.tables.splice(index, 1);
      return { data: deletedTable, error: null };
    }
  },
  
  // Budget-Funktionen
  budget: {
    getCategories: async () => {
      return { data: demoData.budgetCategories, error: null };
    },
    getExpenses: async () => {
      return { data: demoData.budgetExpenses, error: null };
    },
    createCategory: async (category: any) => {
      const newCategory = {
        ...category,
        id: `category-${demoData.budgetCategories.length + 1}`,
        weddingId: 'demo-wedding-id',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      demoData.budgetCategories.push(newCategory);
      return { data: newCategory, error: null };
    },
    createExpense: async (expense: any) => {
      const newExpense = {
        ...expense,
        id: `expense-${demoData.budgetExpenses.length + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      demoData.budgetExpenses.push(newExpense);
      return { data: newExpense, error: null };
    },
    updateCategory: async (id: string, updates: any) => {
      const index = demoData.budgetCategories.findIndex(c => c.id === id);
      if (index === -1) return { data: null, error: new Error('Category not found') };
      
      const updatedCategory = {
        ...demoData.budgetCategories[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      demoData.budgetCategories[index] = updatedCategory;
      return { data: updatedCategory, error: null };
    },
    updateExpense: async (id: string, updates: any) => {
      const index = demoData.budgetExpenses.findIndex(e => e.id === id);
      if (index === -1) return { data: null, error: new Error('Expense not found') };
      
      const updatedExpense = {
        ...demoData.budgetExpenses[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      demoData.budgetExpenses[index] = updatedExpense;
      return { data: updatedExpense, error: null };
    }
  },
  
  // Benutzer-Funktionen
  auth: {
    signIn: async (email: string, password: string) => {
      if (email === 'demo@example.com' && password === 'password') {
        return { data: { user: demoData.currentUser, session: { access_token: 'demo-token' } }, error: null };
      }
      return { data: null, error: new Error('Invalid credentials') };
    },
    signUp: async (email: string, password: string, metadata: any) => {
      return { data: { user: { ...demoData.currentUser, email, ...metadata }, session: { access_token: 'demo-token' } }, error: null };
    },
    signOut: async () => {
      return { error: null };
    },
    getUser: async () => {
      return { data: { user: demoData.currentUser }, error: null };
    }
  },
  
  // Zahlungs-Funktionen
  payments: {
    createCheckoutSession: async (priceId: string) => {
      return { data: { sessionId: 'demo-session-id', url: 'https://example.com/checkout' }, error: null };
    },
    getSubscription: async () => {
      return { data: { status: 'active', plan: 'premium', current_period_end: '2025-04-01T00:00:00Z' }, error: null };
    }
  }
};
