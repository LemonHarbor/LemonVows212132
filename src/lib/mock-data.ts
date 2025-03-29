// Mock data for static deployment
// This file provides static data that can be used when the app is deployed as a static site

export interface Guest {
  id: string;
  name: string;
  email: string;
  rsvp: 'yes' | 'no' | 'pending';
  mealPreference?: string;
  plusOne: boolean;
  notes?: string;
}

export interface Table {
  id: string;
  name: string;
  shape: 'round' | 'rectangular' | 'oval';
  capacity: number;
  positionX: number;
  positionY: number;
  rotation: number;
  guests?: string[]; // IDs of guests assigned to this table
}

export interface BudgetItem {
  id: string;
  category: string;
  description: string;
  estimatedCost: number;
  actualCost?: number;
  paid: boolean;
  dueDate?: string;
  notes?: string;
}

// Mock guests data
export const mockGuests: Guest[] = [
  {
    id: '1',
    name: 'Anna Schmidt',
    email: 'anna.schmidt@example.com',
    rsvp: 'yes',
    mealPreference: 'Vegetarisch',
    plusOne: false,
    notes: 'Allergisch gegen Nüsse'
  },
  {
    id: '2',
    name: 'Thomas Müller',
    email: 'thomas.mueller@example.com',
    rsvp: 'yes',
    mealPreference: 'Standard',
    plusOne: true,
    notes: 'Bringt Partnerin mit'
  },
  {
    id: '3',
    name: 'Julia Weber',
    email: 'julia.weber@example.com',
    rsvp: 'no',
    plusOne: false,
    notes: 'Ist im Urlaub'
  },
  {
    id: '4',
    name: 'Michael Becker',
    email: 'michael.becker@example.com',
    rsvp: 'pending',
    plusOne: false
  },
  {
    id: '5',
    name: 'Laura Fischer',
    email: 'laura.fischer@example.com',
    rsvp: 'yes',
    mealPreference: 'Vegan',
    plusOne: false
  }
];

// Mock tables data
export const mockTables: Table[] = [
  {
    id: '1',
    name: 'Tisch 1',
    shape: 'round',
    capacity: 8,
    positionX: 100,
    positionY: 100,
    rotation: 0,
    guests: ['1', '5']
  },
  {
    id: '2',
    name: 'Tisch 2',
    shape: 'rectangular',
    capacity: 6,
    positionX: 300,
    positionY: 100,
    rotation: 0,
    guests: ['2']
  },
  {
    id: '3',
    name: 'Tisch 3',
    shape: 'oval',
    capacity: 10,
    positionX: 200,
    positionY: 300,
    rotation: 0
  }
];

// Mock budget data
export const mockBudgetItems: BudgetItem[] = [
  {
    id: '1',
    category: 'Location',
    description: 'Hochzeitslocation',
    estimatedCost: 5000,
    actualCost: 5200,
    paid: true,
    dueDate: '2024-03-15',
    notes: 'Anzahlung bereits geleistet'
  },
  {
    id: '2',
    category: 'Catering',
    description: 'Essen und Getränke',
    estimatedCost: 3500,
    actualCost: 3200,
    paid: true,
    dueDate: '2024-05-01'
  },
  {
    id: '3',
    category: 'Dekoration',
    description: 'Blumen und Tischdeko',
    estimatedCost: 1200,
    paid: false,
    dueDate: '2024-05-15'
  },
  {
    id: '4',
    category: 'Musik',
    description: 'DJ',
    estimatedCost: 800,
    actualCost: 800,
    paid: true,
    dueDate: '2024-05-20'
  },
  {
    id: '5',
    category: 'Fotograf',
    description: 'Hochzeitsfotograf',
    estimatedCost: 1500,
    paid: false,
    dueDate: '2024-05-25'
  }
];

// Helper functions to simulate API calls

// Guest management
export const getGuests = (): Promise<Guest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockGuests);
    }, 300); // Simulate network delay
  });
};

export const addGuest = (guest: Omit<Guest, "id">): Promise<Guest> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newGuest = {
        ...guest,
        id: (mockGuests.length + 1).toString()
      };
      mockGuests.push(newGuest);
      resolve(newGuest);
    }, 300);
  });
};

export const updateGuest = (id: string, updates: Partial<Guest>): Promise<Guest> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockGuests.findIndex(g => g.id === id);
      if (index === -1) {
        reject(new Error('Guest not found'));
        return;
      }
      
      mockGuests[index] = { ...mockGuests[index], ...updates };
      resolve(mockGuests[index]);
    }, 300);
  });
};

export const deleteGuest = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockGuests.findIndex(g => g.id === id);
      if (index === -1) {
        reject(new Error('Guest not found'));
        return;
      }
      
      mockGuests.splice(index, 1);
      resolve();
    }, 300);
  });
};

// Table management
export const getTables = (): Promise<Table[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTables);
    }, 300);
  });
};

export const addTable = (table: Omit<Table, "id">): Promise<Table> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newTable = {
        ...table,
        id: (mockTables.length + 1).toString()
      };
      mockTables.push(newTable);
      resolve(newTable);
    }, 300);
  });
};

export const updateTable = (id: string, updates: Partial<Table>): Promise<Table> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockTables.findIndex(t => t.id === id);
      if (index === -1) {
        reject(new Error('Table not found'));
        return;
      }
      
      mockTables[index] = { ...mockTables[index], ...updates };
      resolve(mockTables[index]);
    }, 300);
  });
};

export const deleteTable = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockTables.findIndex(t => t.id === id);
      if (index === -1) {
        reject(new Error('Table not found'));
        return;
      }
      
      mockTables.splice(index, 1);
      resolve();
    }, 300);
  });
};

// Budget management
export const getBudgetItems = (): Promise<BudgetItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockBudgetItems);
    }, 300);
  });
};

export const addBudgetItem = (item: Omit<BudgetItem, "id">): Promise<BudgetItem> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newItem = {
        ...item,
        id: (mockBudgetItems.length + 1).toString()
      };
      mockBudgetItems.push(newItem);
      resolve(newItem);
    }, 300);
  });
};

export const updateBudgetItem = (id: string, updates: Partial<BudgetItem>): Promise<BudgetItem> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockBudgetItems.findIndex(i => i.id === id);
      if (index === -1) {
        reject(new Error('Budget item not found'));
        return;
      }
      
      mockBudgetItems[index] = { ...mockBudgetItems[index], ...updates };
      resolve(mockBudgetItems[index]);
    }, 300);
  });
};

export const deleteBudgetItem = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockBudgetItems.findIndex(i => i.id === id);
      if (index === -1) {
        reject(new Error('Budget item not found'));
        return;
      }
      
      mockBudgetItems.splice(index, 1);
      resolve();
    }, 300);
  });
};

// Budget summary
export const getBudgetSummary = (): Promise<{total: number, spent: number, remaining: number}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const total = mockBudgetItems.reduce((sum, item) => sum + item.estimatedCost, 0);
      const spent = mockBudgetItems.reduce((sum, item) => sum + (item.actualCost || 0), 0);
      resolve({
        total,
        spent,
        remaining: total - spent
      });
    }, 300);
  });
};
