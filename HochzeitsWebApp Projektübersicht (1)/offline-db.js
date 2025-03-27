// IndexedDB-Wrapper für Offline-Datenspeicherung
// lemonvows/frontend/services/offline-db.js

class OfflineDB {
  constructor() {
    this.dbName = 'LemonVowsOfflineDB';
    this.dbVersion = 1;
    this.db = null;
    this.initPromise = this.init();
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = event => {
        console.error('Fehler beim Öffnen der IndexedDB:', event.target.error);
        reject(event.target.error);
      };
      
      request.onsuccess = event => {
        this.db = event.target.result;
        console.log('IndexedDB erfolgreich geöffnet');
        resolve();
      };
      
      request.onupgradeneeded = event => {
        const db = event.target.result;
        
        // Speicher für Offline-Daten erstellen
        if (!db.objectStoreNames.contains('pendingGuests')) {
          db.createObjectStore('pendingGuests', { keyPath: 'id', autoIncrement: true });
        }
        
        if (!db.objectStoreNames.contains('pendingExpenses')) {
          db.createObjectStore('pendingExpenses', { keyPath: 'id', autoIncrement: true });
        }
        
        if (!db.objectStoreNames.contains('pendingTableChanges')) {
          db.createObjectStore('pendingTableChanges', { keyPath: 'id', autoIncrement: true });
        }
        
        // Speicher für gecachte Daten
        if (!db.objectStoreNames.contains('guests')) {
          db.createObjectStore('guests', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('tables')) {
          db.createObjectStore('tables', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('expenses')) {
          db.createObjectStore('expenses', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('timeline')) {
          db.createObjectStore('timeline', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  }

  async ready() {
    return this.initPromise;
  }

  async add(storeName, data) {
    await this.ready();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);
      
      request.onsuccess = event => {
        resolve(event.target.result);
      };
      
      request.onerror = event => {
        console.error(`Fehler beim Hinzufügen von Daten zu ${storeName}:`, event.target.error);
        reject(event.target.error);
      };
    });
  }

  async put(storeName, data) {
    await this.ready();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
      
      request.onsuccess = event => {
        resolve(event.target.result);
      };
      
      request.onerror = event => {
        console.error(`Fehler beim Aktualisieren von Daten in ${storeName}:`, event.target.error);
        reject(event.target.error);
      };
    });
  }

  async get(storeName, key) {
    await this.ready();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
      
      request.onsuccess = event => {
        resolve(event.target.result);
      };
      
      request.onerror = event => {
        console.error(`Fehler beim Abrufen von Daten aus ${storeName}:`, event.target.error);
        reject(event.target.error);
      };
    });
  }

  async getAll(storeName) {
    await this.ready();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = event => {
        resolve(event.target.result);
      };
      
      request.onerror = event => {
        console.error(`Fehler beim Abrufen aller Daten aus ${storeName}:`, event.target.error);
        reject(event.target.error);
      };
    });
  }

  async delete(storeName, key) {
    await this.ready();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);
      
      request.onsuccess = event => {
        resolve();
      };
      
      request.onerror = event => {
        console.error(`Fehler beim Löschen von Daten aus ${storeName}:`, event.target.error);
        reject(event.target.error);
      };
    });
  }

  async clear(storeName) {
    await this.ready();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      
      request.onsuccess = event => {
        resolve();
      };
      
      request.onerror = event => {
        console.error(`Fehler beim Leeren von ${storeName}:`, event.target.error);
        reject(event.target.error);
      };
    });
  }

  // Spezifische Methoden für die LemonVows-App
  
  async saveGuestOffline(guest) {
    await this.add('pendingGuests', {
      ...guest,
      timestamp: Date.now(),
      action: 'add'
    });
    
    // Registrieren der Synchronisierung, wenn online
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-guestlist');
    }
  }
  
  async updateGuestOffline(guest) {
    await this.add('pendingGuests', {
      ...guest,
      timestamp: Date.now(),
      action: 'update'
    });
    
    // Registrieren der Synchronisierung, wenn online
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-guestlist');
    }
  }
  
  async deleteGuestOffline(guestId) {
    await this.add('pendingGuests', {
      id: guestId,
      timestamp: Date.now(),
      action: 'delete'
    });
    
    // Registrieren der Synchronisierung, wenn online
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-guestlist');
    }
  }
  
  async saveExpenseOffline(expense) {
    await this.add('pendingExpenses', {
      ...expense,
      timestamp: Date.now(),
      action: 'add'
    });
    
    // Registrieren der Synchronisierung, wenn online
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-budget');
    }
  }
  
  async updateTablePlanOffline(changes) {
    await this.add('pendingTableChanges', {
      changes,
      timestamp: Date.now()
    });
    
    // Registrieren der Synchronisierung, wenn online
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-tableplan');
    }
  }
  
  // Cache-Methoden für Offline-Zugriff
  
  async cacheGuests(guests) {
    const transaction = this.db.transaction('guests', 'readwrite');
    const store = transaction.objectStore('guests');
    
    // Bestehende Daten löschen
    await this.clear('guests');
    
    // Neue Daten hinzufügen
    for (const guest of guests) {
      store.add(guest);
    }
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve();
      };
      
      transaction.onerror = event => {
        console.error('Fehler beim Cachen der Gästeliste:', event.target.error);
        reject(event.target.error);
      };
    });
  }
  
  async cacheTables(tables) {
    const transaction = this.db.transaction('tables', 'readwrite');
    const store = transaction.objectStore('tables');
    
    // Bestehende Daten löschen
    await this.clear('tables');
    
    // Neue Daten hinzufügen
    for (const table of tables) {
      store.add(table);
    }
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve();
      };
      
      transaction.onerror = event => {
        console.error('Fehler beim Cachen der Tische:', event.target.error);
        reject(event.target.error);
      };
    });
  }
  
  async cacheExpenses(expenses) {
    const transaction = this.db.transaction('expenses', 'readwrite');
    const store = transaction.objectStore('expenses');
    
    // Bestehende Daten löschen
    await this.clear('expenses');
    
    // Neue Daten hinzufügen
    for (const expense of expenses) {
      store.add(expense);
    }
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve();
      };
      
      transaction.onerror = event => {
        console.error('Fehler beim Cachen der Ausgaben:', event.target.error);
        reject(event.target.error);
      };
    });
  }
}

// Singleton-Instanz exportieren
export const offlineDB = new OfflineDB();
export default offlineDB;
