// Service Worker für Offline-Funktionalität
// lemonvows/frontend/service-worker.js

const CACHE_NAME = 'lemonvows-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/main.css',
  '/js/main.js',
  '/js/api-service.js',
  '/locales/translations.json',
  '/images/logo.png',
  '/images/icons/favicon.ico',
  '/images/wedding-themes/boho.jpg',
  '/images/wedding-themes/elegant.jpg',
  '/images/wedding-themes/vintage.jpg',
  '/images/wedding-themes/classic.jpg',
  '/images/wedding-themes/modern.jpg'
];

// Installation des Service Workers
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache geöffnet');
        return cache.addAll(urlsToCache);
      })
  );
});

// Aktivierung des Service Workers
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Abfangen von Fetch-Requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Klonen des Requests, da er nur einmal verwendet werden kann
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Prüfen, ob wir eine gültige Antwort erhalten haben
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Klonen der Antwort, da sie nur einmal verwendet werden kann
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // Nur GET-Requests cachen
                if (event.request.method === 'GET') {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          }
        ).catch(() => {
          // Wenn keine Internetverbindung besteht, versuchen wir, eine Offline-Seite zu liefern
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
        });
      })
  );
});

// Synchronisierung im Hintergrund
self.addEventListener('sync', event => {
  if (event.tag === 'sync-guestlist') {
    event.waitUntil(syncGuestList());
  } else if (event.tag === 'sync-budget') {
    event.waitUntil(syncBudget());
  } else if (event.tag === 'sync-tableplan') {
    event.waitUntil(syncTablePlan());
  }
});

// Funktionen für die Hintergrundsynchronisierung
async function syncGuestList() {
  const db = await openIndexedDB();
  const pendingGuests = await db.getAll('pendingGuests');
  
  if (pendingGuests.length > 0) {
    try {
      const response = await fetch('/api/guests/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ guests: pendingGuests })
      });
      
      if (response.ok) {
        const db = await openIndexedDB();
        await db.clear('pendingGuests');
      }
    } catch (error) {
      console.error('Fehler bei der Synchronisierung der Gästeliste:', error);
    }
  }
}

async function syncBudget() {
  const db = await openIndexedDB();
  const pendingExpenses = await db.getAll('pendingExpenses');
  
  if (pendingExpenses.length > 0) {
    try {
      const response = await fetch('/api/budget/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ expenses: pendingExpenses })
      });
      
      if (response.ok) {
        const db = await openIndexedDB();
        await db.clear('pendingExpenses');
      }
    } catch (error) {
      console.error('Fehler bei der Synchronisierung des Budgets:', error);
    }
  }
}

async function syncTablePlan() {
  const db = await openIndexedDB();
  const pendingTableChanges = await db.getAll('pendingTableChanges');
  
  if (pendingTableChanges.length > 0) {
    try {
      const response = await fetch('/api/tables/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ changes: pendingTableChanges })
      });
      
      if (response.ok) {
        const db = await openIndexedDB();
        await db.clear('pendingTableChanges');
      }
    } catch (error) {
      console.error('Fehler bei der Synchronisierung des Tischplans:', error);
    }
  }
}

// Hilfsfunktion zum Öffnen der IndexedDB
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('LemonVowsOfflineDB', 1);
    
    request.onerror = event => {
      reject('Fehler beim Öffnen der IndexedDB');
    };
    
    request.onsuccess = event => {
      resolve(event.target.result);
    };
    
    request.onupgradeneeded = event => {
      const db = event.target.result;
      
      // Speicher für Offline-Daten erstellen
      db.createObjectStore('pendingGuests', { keyPath: 'id', autoIncrement: true });
      db.createObjectStore('pendingExpenses', { keyPath: 'id', autoIncrement: true });
      db.createObjectStore('pendingTableChanges', { keyPath: 'id', autoIncrement: true });
      
      // Speicher für gecachte Daten
      db.createObjectStore('guests', { keyPath: 'id' });
      db.createObjectStore('tables', { keyPath: 'id' });
      db.createObjectStore('expenses', { keyPath: 'id' });
      db.createObjectStore('timeline', { keyPath: 'id' });
    };
  });
}
