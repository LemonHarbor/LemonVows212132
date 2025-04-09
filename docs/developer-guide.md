# LemonVows Entwicklerdokumentation

## Inhaltsverzeichnis

1. [Projektübersicht](#projektübersicht)
2. [Technologie-Stack](#technologie-stack)
3. [Projektstruktur](#projektstruktur)
4. [Einrichtung der Entwicklungsumgebung](#einrichtung-der-entwicklungsumgebung)
5. [Architektur](#architektur)
   - [Frontend](#frontend)
   - [Backend (Supabase)](#backend-supabase)
6. [Kernkomponenten](#kernkomponenten)
7. [Internationalisierung (i18n)](#internationalisierung-i18n)
8. [Theming und Dark Mode](#theming-und-dark-mode)
9. [Mobile Optimierung](#mobile-optimierung)
10. [Datenmodell](#datenmodell)
11. [API-Referenz](#api-referenz)
12. [Testing](#testing)
13. [Deployment](#deployment)
14. [Bekannte Probleme und Lösungen](#bekannte-probleme-und-lösungen)
15. [Erweiterungsmöglichkeiten](#erweiterungsmöglichkeiten)

## Projektübersicht

LemonVows ist eine umfassende Hochzeitsplanungs-Plattform, die Paaren hilft, ihre Hochzeit zu organisieren. Die Anwendung bietet sieben Kernfunktionen: Gästemanagement, Event-Scheduling, Foto-Sharing, Dienstleister-Koordination, Budget-Tracking, Digitale Einladungen und Registry-Linking.

Die Anwendung ist als moderne, responsive Web-App mit Next.js und Supabase als Backend-as-a-Service implementiert. Sie unterstützt mehrere Sprachen und bietet sowohl einen Light- als auch einen Dark Mode.

## Technologie-Stack

- **Frontend**:
  - Next.js 15.2.5 (React-Framework)
  - TypeScript für typsichere Entwicklung
  - Tailwind CSS für Styling
  - next-i18next für Internationalisierung

- **Backend**:
  - Supabase für Datenbank, Authentifizierung und Speicher
  - PostgreSQL als Datenbank-Engine
  - Row Level Security (RLS) für Datensicherheit

- **Deployment**:
  - Vercel für Frontend-Hosting
  - Supabase für Backend-Hosting

- **Tools**:
  - ESLint für Code-Qualität
  - Git für Versionskontrolle

## Projektstruktur

```
LemonVows212132/
├── app/                    # Next.js App Router Struktur
│   ├── auth/               # Authentifizierungsseiten
│   ├── dashboard/          # Dashboard und Feature-Seiten
│   │   ├── guests/         # Gästemanagement
│   │   ├── events/         # Event-Scheduling
│   │   ├── photos/         # Foto-Sharing
│   │   ├── vendors/        # Dienstleister-Koordination
│   │   ├── budget/         # Budget-Tracking
│   │   ├── invitations/    # Digitale Einladungen
│   │   └── registry/       # Registry-Linking
│   ├── globals.css         # Globale CSS-Stile
│   ├── layout.tsx          # Root-Layout
│   └── page.tsx            # Startseite
├── components/             # Wiederverwendbare Komponenten
│   ├── common/             # Allgemeine UI-Komponenten
│   ├── guests/             # Gästemanagement-Komponenten
│   ├── events/             # Event-Komponenten
│   ├── photos/             # Foto-Komponenten
│   ├── vendors/            # Dienstleister-Komponenten
│   ├── budget/             # Budget-Komponenten
│   ├── invitations/        # Einladungs-Komponenten
│   ├── registry/           # Registry-Komponenten
│   └── ui/                 # UI-Komponenten (ThemeToggle, etc.)
├── lib/                    # Hilfsfunktionen und Utilities
│   ├── supabase/           # Supabase-Client-Konfiguration
│   │   ├── client.ts       # Browser-Client
│   │   └── server.ts       # Server-Client
│   └── utils.ts            # Allgemeine Hilfsfunktionen
├── public/                 # Statische Assets
│   ├── locales/            # Übersetzungsdateien
│   │   ├── de/             # Deutsche Übersetzungen
│   │   ├── en/             # Englische Übersetzungen
│   │   ├── fr/             # Französische Übersetzungen
│   │   └── es/             # Spanische Übersetzungen
│   └── images/             # Bilder und Icons
├── src/                    # Quellcode (Legacy-Struktur)
│   ├── components/         # Legacy-Komponenten
│   ├── lib/                # Legacy-Hilfsfunktionen
│   │   └── i18n.ts         # i18n-Konfiguration
│   └── styles/             # Legacy-Stile
├── types/                  # TypeScript-Typdefinitionen
│   ├── supabase.ts         # Supabase-Datenbank-Typen
│   ├── guests.ts           # Gäste-Typen
│   ├── events.ts           # Event-Typen
│   ├── photos.ts           # Foto-Typen
│   ├── vendors.ts          # Dienstleister-Typen
│   ├── budget.ts           # Budget-Typen
│   ├── invitations.ts      # Einladungs-Typen
│   └── registry.ts         # Registry-Typen
├── middleware.ts           # Next.js Middleware (i18n, Auth)
├── next.config.js          # Next.js-Konfiguration
├── tailwind.config.js      # Tailwind-Konfiguration
├── tsconfig.json           # TypeScript-Konfiguration
└── package.json            # Projekt-Abhängigkeiten
```

## Einrichtung der Entwicklungsumgebung

### Voraussetzungen

- Node.js 18.x oder höher
- npm 9.x oder höher
- Git

### Installation

1. Repository klonen:
   ```bash
   git clone https://github.com/LemonHarbor/LemonVows212132.git
   cd LemonVows212132
   ```

2. Abhängigkeiten installieren:
   ```bash
   npm install
   ```

3. Umgebungsvariablen einrichten:
   Erstellen Sie eine `.env.local`-Datei im Stammverzeichnis mit folgenden Variablen:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://sntiugjhgqvmyfrcvkwl.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNudGl1Z2poZ3F2bXlmcmN2a3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI2OTU0NDAsImV4cCI6MjAyODI3MTQ0MH0.daXouO0fN3E7Hm6qB704A8VfUb47ZKJQFnQHKcnZwGo
   ```

4. Entwicklungsserver starten:
   ```bash
   npm run dev
   ```

5. Öffnen Sie [http://localhost:3000](http://localhost:3000) im Browser.

## Architektur

### Frontend

LemonVows verwendet die App Router-Architektur von Next.js 15, die auf React Server Components basiert. Die Anwendung folgt einem modularen Aufbau, bei dem jede Hauptfunktion in einem eigenen Verzeichnis organisiert ist.

#### Schlüsselkonzepte:

- **Server Components**: Werden auf dem Server gerendert und reduzieren die Client-seitige JavaScript-Menge.
- **Client Components**: Interaktive Komponenten, die mit dem `'use client'`-Direktiv gekennzeichnet sind.
- **Layouts**: Gemeinsame UI für mehrere Routen, definiert in `layout.tsx`-Dateien.
- **Pages**: Routenspezifische UI, definiert in `page.tsx`-Dateien.

### Backend (Supabase)

Supabase dient als Backend-as-a-Service und bietet:

- **Datenbank**: PostgreSQL-Datenbank für alle Anwendungsdaten.
- **Authentifizierung**: E-Mail/Passwort-Authentifizierung und OAuth-Provider.
- **Speicher**: Für Fotos und andere Dateien.
- **Row Level Security (RLS)**: Sicherheitsrichtlinien auf Datenbankebene.

#### Supabase-Integration:

Die Anwendung verwendet zwei Supabase-Clients:
1. **Browser-Client** (`lib/supabase/client.ts`): Für client-seitige Anfragen.
2. **Server-Client** (`lib/supabase/server.ts`): Für server-seitige Anfragen mit Cookie-basierter Authentifizierung.

## Kernkomponenten

### Authentifizierung

Die Authentifizierung wird über Supabase Auth mit Next.js Middleware implementiert:

```typescript
// middleware.ts
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession();
  return res;
}
```

### Dashboard-Layout

Das Dashboard-Layout (`app/dashboard/layout.tsx`) dient als Container für alle authentifizierten Funktionen und enthält:
- Navigation
- Benutzermenü
- Sprachauswahl
- Theme-Toggle

### Feature-Module

Jedes Feature-Modul folgt einer ähnlichen Struktur:
1. **Page Component**: Definiert in `app/dashboard/[feature]/page.tsx`
2. **List Component**: Zeigt Daten in einer Liste oder einem Raster an
3. **Form Component**: Zum Erstellen oder Bearbeiten von Einträgen
4. **Detail Component**: Zur Anzeige detaillierter Informationen

## Internationalisierung (i18n)

LemonVows verwendet `next-i18next` für die Internationalisierung:

```typescript
// src/lib/i18n.ts
export const i18nConfig = {
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en', 'fr', 'es'],
  },
  localePath: './public/locales',
};
```

### Übersetzungsdateien

Übersetzungen sind in JSON-Dateien im `public/locales/[lang]/common.json`-Format gespeichert.

### Verwendung in Komponenten

```typescript
'use client';
import { useTranslation } from '@/src/lib/i18n';

export default function MyComponent() {
  const { t } = useTranslation('common');
  return <h1>{t('welcome')}</h1>;
}
```

### Sprachumschaltung

Die Sprachumschaltung wird über Cookies und die Next.js Middleware implementiert:

```typescript
// middleware.ts
const cookieName = 'NEXT_LOCALE';
// ...
if (i18nConfig.i18n.locales.includes(locale)) {
  res.cookies.set(cookieName, locale);
}
```

## Theming und Dark Mode

LemonVows verwendet einen class-basierten Ansatz für das Theming mit Tailwind CSS:

### Konfiguration

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Farbdefinitionen für Light und Dark Mode
      }
    }
  }
}
```

### CSS-Variablen

```css
/* globals.css */
@layer base {
  :root {
    --color-primary: 14, 165, 233;
    /* weitere Variablen für Light Mode */
  }

  .dark {
    --color-primary: 56, 189, 248;
    /* weitere Variablen für Dark Mode */
  }
}
```

### ThemeProvider

Der `ThemeProvider` verwaltet den Theme-Zustand und wendet die entsprechende Klasse auf das HTML-Element an:

```typescript
// components/ui/ThemeProvider.tsx
'use client';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Theme-Logik
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

## Mobile Optimierung

LemonVows ist für mobile Geräte optimiert mit:

### Responsive Design

- Flexible Layouts mit Tailwind CSS Grid und Flexbox
- Breakpoint-spezifische Stile für verschiedene Bildschirmgrößen

### Mobile Navigation

Die `MobileNavigation`-Komponente bietet:
- Bottom Navigation Bar für schnellen Zugriff
- Slide-out-Menü für alle Funktionen
- Touch-optimierte Interaktionselemente

### Touch-Optimierungen

```css
/* globals.css */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

.smooth-scroll {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}
```

### Viewport-Konfiguration

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  // ...
};
```

## Datenmodell

Das Datenmodell in Supabase umfasst folgende Haupttabellen:

### Gäste (guests)
```typescript
interface Guest {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  rsvp_status: string;
  dietary_restrictions: string | null;
  plus_one: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
```

### Termine (events)
```typescript
interface Event {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  location: string | null;
  created_at: string;
  updated_at: string;
}
```

### Dienstleister (vendors)
```typescript
interface Vendor {
  id: string;
  user_id: string;
  name: string;
  category: string;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  price: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
```

### Budget (budget_items)
```typescript
interface BudgetItem {
  id: string;
  user_id: string;
  category: string;
  item_name: string;
  estimated_cost: number;
  actual_cost: number | null;
  paid: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
```

### Einladungen (invitations)
```typescript
interface Invitation {
  id: string;
  user_id: string;
  title: string;
  message: string;
  created_at: string;
  updated_at: string;
}
```

### Fotos (photos)
```typescript
interface Photo {
  id: string;
  user_id: string;
  storage_path: string;
  title: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}
```

### Registry-Links (registry_links)
```typescript
interface RegistryLink {
  id: string;
  user_id: string;
  title: string;
  url: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}
```

## API-Referenz

### Supabase-Client-Methoden

#### Authentifizierung

```typescript
// Anmeldung
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// Registrierung
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});

// Abmeldung
const { error } = await supabase.auth.signOut();

// Benutzer abrufen
const { data: { user } } = await supabase.auth.getUser();
```

#### Datenoperationen

```typescript
// Daten abrufen
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('user_id', user.id);

// Daten einfügen
const { data, error } = await supabase
  .from('table_name')
  .insert([{ column1: 'value1', column2: 'value2' }]);

// Daten aktualisieren
const { data, error } = await supabase
  .from('table_name')
  .update({ column1: 'new_value' })
  .eq('id', item_id);

// Daten löschen
const { error } = await supabase
  .from('table_name')
  .delete()
  .eq('id', item_id);
```

#### Speicheroperationen

```typescript
// Datei hochladen
const { data, error } = await supabase.storage
  .from('bucket_name')
  .upload('file_path', file);

// Öffentliche URL abrufen
const { data: { publicUrl } } = supabase.storage
  .from('bucket_name')
  .getPublicUrl('file_path');

// Datei löschen
const { error } = await supabase.storage
  .from('bucket_name')
  .remove(['file_path']);
```

## Testing

LemonVows verwendet ein umfassendes Testskript (`run-tests.sh`), das verschiedene Aspekte der Anwendung überprüft:

- Projektstruktur
- Abhängigkeiten
- TypeScript-Konfiguration
- Tailwind-Konfiguration
- i18n-Konfiguration
- Übersetzungsdateien
- Supabase-Konfiguration
- Mobile Optimierung
- Theme-Funktionalität
- TypeScript-Typprüfung
- Feature-Implementierungen
- Middleware

### Testausführung

```bash
chmod +x run-tests.sh
./run-tests.sh
```

Die Testergebnisse werden in `/test-results/test-log.txt` gespeichert.

## Deployment

### Vercel-Deployment

LemonVows ist für das Deployment auf Vercel konfiguriert:

1. Verknüpfen Sie das GitHub-Repository mit Vercel
2. Konfigurieren Sie die Umgebungsvariablen:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://sntiugjhgqvmyfrcvkwl.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Deployment-Einstellungen:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Supabase-Konfiguration

Für die Supabase-Konfiguration:

1. Stellen Sie sicher, dass der "photos"-Storage-Bucket existiert
2. Konfigurieren Sie RLS-Policies für alle Tabellen und den Storage-Bucket
3. Aktualisieren Sie die Site URL und Redirect URLs in den Authentifizierungseinstellungen

## Bekannte Probleme und Lösungen

### TypeScript-Fehler

Die Anwendung enthält einige TypeScript-Fehler, die nicht kritisch für das Deployment sind:

- **Problem**: Fehlende Typdefinitionen für einige Komponenten
- **Lösung**: Typdefinitionen in den entsprechenden Dateien ergänzen

### Supabase-Authentifizierung

- **Problem**: Gelegentliche Authentifizierungsfehler bei der Sitzungsaktualisierung
- **Lösung**: Implementieren Sie eine Wiederholungslogik für Authentifizierungsanfragen

### Mobile Navigation

- **Problem**: Auf einigen älteren Geräten kann die mobile Navigation verzögert reagieren
- **Lösung**: Optimieren Sie die Rendering-Performance durch Memoization und Code-Splitting

## Erweiterungsmöglichkeiten

### Kurzfristige Erweiterungen

1. **PWA-Unterstützung**: Implementieren Sie Progressive Web App-Funktionen für Offline-Zugriff
2. **Social Media Integration**: Ermöglichen Sie das Teilen von Hochzeitsdetails auf sozialen Medien
3. **Erweiterte Berechtigungen**: Fügen Sie differenzierte Benutzerrollen hinzu (Admin, Gast, Dienstleister)

### Langfristige Erweiterungen

1. **Mobile Apps**: Native Apps für iOS und Android entwickeln
2. **KI-Funktionen**: Implementieren Sie KI-basierte Empfehlungen für Dienstleister und Budget
3. **Zahlungsintegration**: Ermöglichen Sie direkte Zahlungen an Dienstleister über die Plattform
4. **Erweiterte Analytik**: Bieten Sie detaillierte Einblicke in die Hochzeitsplanung und das Budget

---

Diese Dokumentation bietet einen umfassenden Überblick über die LemonVows-Anwendung für Entwickler. Für weitere Fragen oder Unterstützung wenden Sie sich bitte an das Entwicklungsteam.
