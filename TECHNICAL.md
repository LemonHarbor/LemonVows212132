# LemonVows - Entwicklungsdokumentation

Diese Dokumentation beschreibt die technischen Details der Implementierung der LemonVows Hochzeitsplanungs-App.

## Technische Implementierung

### Supabase-Integration

Die Anwendung verwendet Supabase als Backend-Lösung mit folgenden Komponenten:

```typescript
// src/services/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jodqliylhmwgpurfzxm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZHFsaXlsaG13Z3B1cmZ6eG0iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcxNjk4MzI1NixZXhwIjoyMDMyNTU5MjU2fQ.7STGhtd2wdXJmemtIwY4cCI6MjA0OH0.7vcXDTN4jsIpnpe-06qyuU3K-pQvwtYpLueUuzDzDk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Datenbankschema

Die Datenbank enthält folgende Tabellen:

1. **users** - Benutzerinformationen
   - id (UUID, PK)
   - email (String)
   - created_at (Timestamp)
   - role (String: 'admin', 'couple', 'guest')

2. **weddings** - Hochzeitsinformationen
   - id (UUID, PK)
   - couple_id (UUID, FK zu users)
   - title (String)
   - date (Date)
   - location (String)
   - created_at (Timestamp)
   - settings (JSON)

3. **guests** - Gästeinformationen
   - id (UUID, PK)
   - wedding_id (UUID, FK zu weddings)
   - name (String)
   - email (String)
   - rsvp_status (String: 'pending', 'confirmed', 'declined')
   - dietary_requirements (String)
   - accommodation_needed (Boolean)
   - plus_one (Boolean)
   - table_id (UUID, FK zu tables)

4. **tables** - Tischinformationen
   - id (UUID, PK)
   - wedding_id (UUID, FK zu weddings)
   - name (String)
   - shape (String: 'round', 'rectangular', 'oval')
   - capacity (Integer)
   - position_x (Float)
   - position_y (Float)

5. **budget_items** - Budgetposten
   - id (UUID, PK)
   - wedding_id (UUID, FK zu weddings)
   - category (String)
   - description (String)
   - amount (Float)
   - paid (Boolean)
   - date (Date)

6. **music_requests** - Musikwünsche
   - id (UUID, PK)
   - wedding_id (UUID, FK zu weddings)
   - title (String)
   - artist (String)
   - added_by (String)
   - upvotes (Integer)
   - downvotes (Integer)

7. **gallery_images** - Galeriebilder
   - id (UUID, PK)
   - wedding_id (UUID, FK zu weddings)
   - url (String)
   - thumbnail (String)
   - title (String)
   - uploaded_by (String)
   - is_private (Boolean)
   - upload_date (Timestamp)

### Authentifizierung

Die Authentifizierung wird über den `AuthContext` verwaltet:

```typescript
// src/context/AuthContext.tsx (Auszug)
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Weitere Authentifizierungsfunktionen...
};
```

### Mehrsprachigkeit

Die Mehrsprachigkeitsunterstützung verwendet i18next:

```typescript
// src/utils/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import deTranslation from '../locales/de/translation.json';
import enTranslation from '../locales/en/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      de: {
        translation: deTranslation
      },
      en: {
        translation: enTranslation
      }
    },
    lng: 'de',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
```

### Responsive Design

Das responsive Design basiert auf Styled Components mit Media Queries:

```typescript
// src/styles/ResponsiveComponents.tsx (Auszug)
const breakpoints = {
  xs: '576px',
  sm: '768px',
  md: '992px',
  lg: '1200px'
};

export const media = {
  xs: `@media (max-width: ${breakpoints.xs})`,
  sm: `@media (max-width: ${breakpoints.sm})`,
  md: `@media (max-width: ${breakpoints.md})`,
  lg: `@media (max-width: ${breakpoints.lg})`,
  xsUp: `@media (min-width: ${breakpoints.xs})`,
  smUp: `@media (min-width: ${breakpoints.sm})`,
  mdUp: `@media (min-width: ${breakpoints.md})`,
  lgUp: `@media (min-width: ${breakpoints.lg})`
};
```

## Komponenten-Dokumentation

### Tischplan-Komponente

Der interaktive Tischplan verwendet React DnD für Drag-and-Drop-Funktionalität:

```typescript
// Pseudocode für die Tischplan-Implementierung
const TablePlan = () => {
  const { tables, guests, moveGuest } = useContext(TablePlanContext);
  
  const handleDrop = (guestId, tableId) => {
    moveGuest(guestId, tableId);
  };
  
  return (
    <DndProvider backend={HTML5Backend}>
      <TablePlanContainer>
        {tables.map(table => (
          <Table 
            key={table.id} 
            table={table} 
            guests={guests.filter(g => g.tableId === table.id)}
            onDrop={handleDrop}
          />
        ))}
        <UnassignedGuests 
          guests={guests.filter(g => !g.tableId)} 
        />
      </TablePlanContainer>
    </DndProvider>
  );
};
```

### Admin-Dashboard

Das No-Code Admin-Dashboard ermöglicht visuelle Anpassungen:

```typescript
// src/components/AdminDashboard.tsx (Auszug)
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('appearance');
  const [primaryColor, setPrimaryColor] = useState('#f9ca24');
  
  const handleColorChange = (color) => {
    setPrimaryColor(color);
    // Aktualisiere CSS-Variablen in Echtzeit
    document.documentElement.style.setProperty('--primary-color', color);
  };
  
  return (
    <DashboardContainer>
      <Tabs 
        activeTab={activeTab} 
        onChange={setActiveTab} 
        tabs={['appearance', 'content', 'features']} 
      />
      
      {activeTab === 'appearance' && (
        <AppearanceSettings 
          primaryColor={primaryColor}
          onColorChange={handleColorChange}
          // Weitere Einstellungen...
        />
      )}
      
      {/* Weitere Tabs... */}
    </DashboardContainer>
  );
};
```

## Performance-Optimierungen

Die Anwendung implementiert verschiedene Performance-Optimierungen:

1. **Code-Splitting**: Verwendung von React.lazy und Suspense für bedarfsgesteuertes Laden von Komponenten
2. **Memoization**: Verwendung von useMemo und useCallback für rechenintensive Operationen
3. **Virtualisierung**: Für lange Listen (z.B. Gästeliste) wird Virtualisierung verwendet
4. **Bildoptimierung**: Automatische Erstellung von Thumbnails für die Galerie
5. **Caching**: Lokales Caching von Daten zur Reduzierung von API-Aufrufen

## Sicherheitsmaßnahmen

Die Anwendung implementiert folgende Sicherheitsmaßnahmen:

1. **Rollenbasierte Zugriffssteuerung**: Verschiedene Benutzerrollen mit unterschiedlichen Berechtigungen
2. **Datenvalidierung**: Serverseitige und clientseitige Validierung aller Eingaben
3. **HTTPS**: Sichere Kommunikation über HTTPS
4. **CORS**: Konfiguration von Cross-Origin Resource Sharing
5. **GDPR-Konformität**: Datenschutzfunktionen wie automatisches Löschen von Daten

## Bekannte Einschränkungen

1. Die Drag-and-Drop-Funktionalität des Tischplans ist auf Mobilgeräten eingeschränkt
2. Die Foto-Galerie hat eine Größenbeschränkung von 10MB pro Bild
3. Die Offline-Funktionalität ist begrenzt und erfordert regelmäßige Synchronisierung

## Zukünftige Erweiterungen

1. **Integration mit Kalendern**: Google Calendar, Apple Calendar
2. **Lieferantenverzeichnis**: Verwaltung von Hochzeitsdienstleistern
3. **Geschenkeliste**: Wunschliste und Geschenkverwaltung
4. **Erweiterte Analytik**: Detaillierte Statistiken für Administratoren
5. **Mobile App**: Native Mobile-Apps für iOS und Android
