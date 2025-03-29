# LemonVows Dokumentation und Bereitstellungsanleitung

## Übersicht

LemonVows ist eine umfassende Hochzeitsplanungs-App, die Brautpaaren hilft, ihre Gästeliste zu verwalten, RSVPs zu verfolgen, Tischpläne zu erstellen, Menüoptionen zu verwalten und Statistiken zu analysieren. Die App unterstützt mehrere Sprachen (Deutsch, Englisch, Französisch und Spanisch) und bietet verschiedene Benutzerrollen für Administratoren, Brautpaare und Gäste.

Diese Dokumentation enthält Informationen zur Architektur, Installation, Konfiguration und Verwendung der LemonVows-App.

## Inhaltsverzeichnis

1. [Architektur](#architektur)
2. [Technologie-Stack](#technologie-stack)
3. [Funktionen](#funktionen)
4. [Installation](#installation)
5. [Konfiguration](#konfiguration)
6. [Bereitstellung](#bereitstellung)
7. [Benutzerrollen und Testkonten](#benutzerrollen-und-testkonten)
8. [Mehrsprachigkeit](#mehrsprachigkeit)
9. [Datenbankschema](#datenbankschema)
10. [API-Dokumentation](#api-dokumentation)
11. [Fehlerbehebung](#fehlerbehebung)
12. [Wartung und Updates](#wartung-und-updates)

## Architektur

LemonVows folgt einer modernen Client-Server-Architektur:

- **Frontend**: Eine React-Single-Page-Application (SPA) mit TypeScript
- **Backend**: Supabase für Authentifizierung, Datenbank und Speicher
- **Datenbank**: PostgreSQL (über Supabase)

Die Anwendung ist in mehrere Komponenten unterteilt:

- **Authentifizierung**: Verwaltet Benutzeranmeldung und -registrierung
- **Gästeverwaltung**: Verwaltet Gästeinformationen und RSVP-Status
- **Tischplanung**: Ermöglicht die Erstellung und Verwaltung von Tischplänen
- **Menüverwaltung**: Verwaltet Menüoptionen und Allergien
- **Statistik-Dashboard**: Zeigt RSVP-Statistiken und andere Analysen an
- **Admin-Bereich**: Ermöglicht die Verwaltung von Benutzern und Hochzeiten
- **Mehrsprachigkeitsmodul**: Unterstützt mehrere Sprachen in der Benutzeroberfläche

## Technologie-Stack

### Frontend
- React 18.x
- TypeScript 4.x
- React Router 6.x
- Styled Components 5.x
- Chart.js für Datenvisualisierung
- Supabase JavaScript Client

### Backend
- Supabase (PostgreSQL, Auth, Storage)
- Node.js für lokale Entwicklung

### Entwicklungswerkzeuge
- Vite für schnelles Bundling
- ESLint für Code-Qualität
- Prettier für Code-Formatierung
- Jest für Tests

## Funktionen

### Gästeverwaltung & RSVP
- Hinzufügen, Bearbeiten und Löschen von Gästen
- Generierung eindeutiger RSVP-Codes
- RSVP-Formular für Gäste
- Verfolgung von Zusagen, Absagen und ausstehenden Antworten
- Gruppierung von Gästen (Familie, Freunde, Kollegen)
- Massenimport von Gästen
- Versenden von Einladungen und Erinnerungen

### Menüverwaltung & Allergien
- Erstellung von Menüoptionen für verschiedene Gänge
- Kennzeichnung von Diätpräferenzen (vegetarisch, vegan, glutenfrei, laktosefrei)
- Erfassung von Allergien und besonderen Anforderungen
- Auswahl von Menüoptionen durch Gäste im RSVP-Prozess

### Tischplanung
- Erstellung von Tischen mit verschiedenen Formen und Kapazitäten
- Drag-and-Drop-Zuweisung von Gästen zu Tischen
- Optimierung der Sitzordnung basierend auf Beziehungen und Präferenzen
- Visualisierung der Tischbelegung

### Statistik-Dashboard
- Zusammenfassung der RSVP-Antworten
- Zeitlicher Verlauf der Antworten
- Analyse nach Gästegruppen
- Tischstatistiken
- Diätanforderungen und Allergien
- Export von Statistiken in verschiedenen Formaten

### Admin-Funktionen
- Benutzerverwaltung
- Hochzeitsverwaltung
- Systemstatistiken
- Übersetzungsverwaltung

### Mehrsprachigkeit
- Unterstützung für Deutsch, Englisch, Französisch und Spanisch
- Sprachauswahl für Benutzer
- Übersetzungsverwaltung für Administratoren

## Installation

### Voraussetzungen
- Node.js 16.x oder höher
- npm 7.x oder höher
- Git

### Lokale Entwicklungsumgebung einrichten

1. Repository klonen:
   ```bash
   git clone https://github.com/LemonHarbor/LemonVows.git
   cd LemonVows
   ```

2. Abhängigkeiten installieren:
   ```bash
   npm install
   ```

3. Umgebungsvariablen konfigurieren:
   Erstellen Sie eine `.env`-Datei im Stammverzeichnis des Projekts mit den folgenden Variablen:
   ```
   REACT_APP_SUPABASE_URL=https://your-supabase-project.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Entwicklungsserver starten:
   ```bash
   npm start
   ```

5. Die Anwendung ist nun unter `http://localhost:3000` verfügbar.

### Testumgebung einrichten

Für eine schnelle Testumgebung können Sie das bereitgestellte Deployment-Skript verwenden:

1. Führen Sie das Deployment-Skript aus:
   ```bash
   chmod +x deploy_lemonvows_test.sh
   ./deploy_lemonvows_test.sh
   ```

2. Starten Sie den Testserver:
   ```bash
   cd lemonvows-test
   node server.js
   ```

3. Die Testumgebung ist nun unter `http://localhost:3000` verfügbar.

## Konfiguration

### Supabase-Konfiguration

1. Erstellen Sie ein neues Projekt auf [Supabase](https://supabase.com).

2. Führen Sie das SQL-Skript `lemonvows_test_data.sql` in der SQL-Konsole von Supabase aus, um die Datenbankstruktur und Testdaten zu erstellen.

3. Konfigurieren Sie die Authentifizierung in Supabase:
   - Aktivieren Sie E-Mail/Passwort-Authentifizierung
   - Konfigurieren Sie E-Mail-Vorlagen für Einladungen und Passwort-Zurücksetzung

4. Aktualisieren Sie die Umgebungsvariablen in Ihrer `.env`-Datei mit den Supabase-Projektdaten.

### Anpassung der Anwendung

Die Anwendung kann über verschiedene Konfigurationsdateien angepasst werden:

- `src/styles/theme.js`: Farbschema, Typografie und andere Designelemente
- `src/i18n/translations.js`: Übersetzungen für verschiedene Sprachen
- `src/config.js`: Allgemeine Konfigurationsoptionen

## Bereitstellung

### Produktionsbereitstellung

1. Erstellen Sie einen Produktions-Build:
   ```bash
   npm run build
   ```

2. Der Build wird im Verzeichnis `build` erstellt und kann auf jedem statischen Webserver bereitgestellt werden.

### Bereitstellung mit Netlify

1. Erstellen Sie eine `netlify.toml`-Datei im Stammverzeichnis des Projekts:
   ```toml
   [build]
     publish = "build"
     command = "npm run build"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. Stellen Sie das Projekt auf Netlify bereit:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

### Bereitstellung mit Vercel

1. Installieren Sie die Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Stellen Sie das Projekt auf Vercel bereit:
   ```bash
   vercel --prod
   ```

## Benutzerrollen und Testkonten

Die Anwendung unterstützt drei Benutzerrollen:

### Admin
- Vollständiger Systemzugriff
- Benutzerverwaltung
- Erstellung von Hochzeitsinstanzen
- Systemkonfiguration
- Systemweite Statistiken

**Testkonto:**
- E-Mail: `admin@lemonvows.com`
- Passwort: `TestAdmin2025!`

### Brautpaar (Couple)
- Verwaltung ihrer Hochzeitsdetails
- Gästelisten-Management
- Tischplanung
- Menüverwaltung
- Anzeige von RSVP-Statistiken
- Versenden von Einladungen

**Testkonten:**
- E-Mail: `couple1@lemonvows.com` / Passwort: `TestCouple2025!`
- E-Mail: `couple2@lemonvows.com` / Passwort: `TestCouple2025!`

### Gast
- Anzeige von Hochzeitsdetails
- Einreichen von RSVP-Antworten
- Auswahl von Menüoptionen
- Angabe von Diätbeschränkungen
- Anfrage von Unterkunft

**Test-RSVP-Codes:**
- `jodo-abc-123` (John Smith - Sarahs Hochzeit)
- `jasn-def-456` (Jane Smith - Sarahs Hochzeit)
- `rojo-ghi-789` (Robert Johnson - Sarahs Hochzeit)
- `wijo-klm-789` (William Johnson - Emmas Hochzeit)

## Mehrsprachigkeit

Die Anwendung unterstützt mehrere Sprachen durch ein zentrales Übersetzungssystem:

### Unterstützte Sprachen
- Deutsch (de) - Standardsprache
- Englisch (en)
- Französisch (fr)
- Spanisch (es)

### Sprachauswahl
- Benutzer können ihre bevorzugte Sprache über die Sprachauswahl-Komponente ändern
- Die Spracheinstellung wird im Browser-Speicher und im Benutzerprofil gespeichert
- Die Anwendung lädt automatisch die entsprechenden Übersetzungen

### Übersetzungsverwaltung
- Administratoren können Übersetzungen über den Übersetzungsmanager verwalten
- Übersetzungen können importiert und exportiert werden
- Fehlende Übersetzungen werden automatisch durch die deutsche Version ersetzt

## Datenbankschema

Das Datenbankschema umfasst die folgenden Haupttabellen:

### users
- `id`: UUID (Primärschlüssel)
- `email`: TEXT (eindeutig)
- `password_hash`: TEXT
- `first_name`: TEXT
- `last_name`: TEXT
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP
- `role`: TEXT ('couple', 'admin', 'guest')
- `preferred_language`: TEXT

### weddings
- `id`: UUID (Primärschlüssel)
- `couple_id`: UUID (Fremdschlüssel zu users)
- `wedding_name`: TEXT
- `wedding_date`: DATE
- `location`: TEXT
- `description`: TEXT
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP
- `style`: TEXT
- `rsvp_deadline`: DATE
- `max_guests`: INTEGER
- `subscription_tier`: TEXT

### guests
- `id`: UUID (Primärschlüssel)
- `wedding_id`: UUID (Fremdschlüssel zu weddings)
- `first_name`: TEXT
- `last_name`: TEXT
- `email`: TEXT
- `phone`: TEXT
- `address`: TEXT
- `invitation_sent`: BOOLEAN
- `invitation_sent_date`: TIMESTAMP
- `rsvp_code`: TEXT (eindeutig)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP
- `notes`: TEXT
- `group_name`: TEXT

### rsvp_responses
- `id`: UUID (Primärschlüssel)
- `guest_id`: UUID (Fremdschlüssel zu guests)
- `response_status`: TEXT ('accepted', 'declined', 'pending')
- `response_date`: TIMESTAMP
- `number_of_accompanying_persons`: INTEGER
- `needs_accommodation`: BOOLEAN
- `special_requests`: TEXT
- `updated_at`: TIMESTAMP

### menu_options
- `id`: UUID (Primärschlüssel)
- `wedding_id`: UUID (Fremdschlüssel zu weddings)
- `name`: TEXT
- `description`: TEXT
- `is_vegetarian`: BOOLEAN
- `is_vegan`: BOOLEAN
- `is_gluten_free`: BOOLEAN
- `is_dairy_free`: BOOLEAN
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP
- `course`: TEXT ('starter', 'main', 'dessert')

### allergies
- `id`: UUID (Primärschlüssel)
- `name`: TEXT
- `description`: TEXT
- `created_at`: TIMESTAMP

### guest_allergies
- `guest_id`: UUID (Fremdschlüssel zu guests)
- `allergy_id`: UUID (Fremdschlüssel zu allergies)
- `created_at`: TIMESTAMP
- Primärschlüssel: (guest_id, allergy_id)

### guest_menu_selections
- `id`: UUID (Primärschlüssel)
- `guest_id`: UUID (Fremdschlüssel zu guests)
- `menu_option_id`: UUID (Fremdschlüssel zu menu_options)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP
- Eindeutige Einschränkung: (guest_id, menu_option_id)

### tables
- `id`: UUID (Primärschlüssel)
- `wedding_id`: UUID (Fremdschlüssel zu weddings)
- `table_name`: TEXT
- `capacity`: INTEGER
- `shape`: TEXT ('round', 'rectangular', 'square')
- `position_x`: FLOAT
- `position_y`: FLOAT
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### table_assignments
- `id`: UUID (Primärschlüssel)
- `table_id`: UUID (Fremdschlüssel zu tables)
- `guest_id`: UUID (Fremdschlüssel zu guests)
- `seat_number`: INTEGER
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP
- Eindeutige Einschränkungen: (table_id, guest_id), (table_id, seat_number)

### statistics
- `id`: UUID (Primärschlüssel)
- `wedding_id`: UUID (Fremdschlüssel zu weddings)
- `total_guests`: INTEGER
- `accepted_count`: INTEGER
- `declined_count`: INTEGER
- `pending_count`: INTEGER
- `vegetarian_count`: INTEGER
- `vegan_count`: INTEGER
- `gluten_free_count`: INTEGER
- `dairy_free_count`: INTEGER
- `with_allergies_count`: INTEGER
- `needs_accommodation_count`: INTEGER
- `last_updated`: TIMESTAMP

### translations
- `id`: UUID (Primärschlüssel)
- `key`: TEXT (eindeutig)
- `de`: TEXT (Deutsch)
- `en`: TEXT (Englisch)
- `fr`: TEXT (Französisch)
- `es`: TEXT (Spanisch)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

## API-Dokumentation

Die Anwendung verwendet Supabase für Backend-Dienste. Hier sind die wichtigsten API-Endpunkte:

### Authentifizierung

```javascript
// Anmeldung
const { user, error } = await supabase.auth.signIn({ email, password });

// Abmeldung
const { error } = await supabase.auth.signOut();

// Aktuelle Sitzung abrufen
const session = supabase.auth.session();

// Aktuellen Benutzer abrufen
const user = supabase.auth.user();
```

### Benutzer

```javascript
// Benutzerdetails abrufen
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single();

// Benutzerdetails aktualisieren
const { data, error } = await supabase
  .from('users')
  .update(updates)
  .eq('id', userId);
```

### Hochzeiten

```javascript
// Hochzeit nach ID abrufen
const { data, error } = await supabase
  .from('weddings')
  .select('*')
  .eq('id', weddingId)
  .single();

// Hochzeit nach Brautpaar-ID abrufen
const { data, error } = await supabase
  .from('weddings')
  .select('*')
  .eq('couple_id', coupleId)
  .single();

// Neue Hochzeit erstellen
const { data, error } = await supabase
  .from('weddings')
  .insert([weddingData]);
```

### Gäste

```javascript
// Alle Gäste für eine Hochzeit abrufen
const { data, error } = await supabase
  .from('guests')
  .select(`
    *,
    rsvp_responses (*)
  `)
  .eq('wedding_id', weddingId)
  .order('last_name', { ascending: true });

// Gast nach RSVP-Code abrufen
const { data, error } = await supabase
  .from('guests')
  .select(`
    *,
    weddings (*),
    rsvp_responses (*),
    guest_allergies (
      allergies (*)
    ),
    guest_menu_selections (
      menu_options (*)
    )
  `)
  .eq('rsvp_code', rsvpCode)
  .single();
```

### RSVP

```javascript
// RSVP-Antwort einreichen
const { data, error } = await supabase
  .from('rsvp_responses')
  .update({
    response_status: 'accepted',
    number_of_accompanying_persons: 1,
    needs_accommodation: true,
    special_requests: 'Allergic to nuts',
    response_date: new Date().toISOString(),
    updated_at: new Date().toISOString()
  })
  .eq('guest_id', guestId);
```

### Statistiken

```javascript
// Statistiken für eine Hochzeit abrufen
const { data, error } = await supabase
  .from('statistics')
  .select('*')
  .eq('wedding_id', weddingId)
  .single();
```

## Fehlerbehebung

### Häufige Probleme und Lösungen

#### Anmeldungsprobleme
- **Problem**: Benutzer kann sich nicht anmelden
- **Lösung**: Überprüfen Sie die E-Mail-Adresse und das Passwort. Stellen Sie sicher, dass der Benutzer in der Datenbank existiert und das Passwort korrekt ist.

#### RSVP-Probleme
- **Problem**: Gast kann RSVP-Code nicht verwenden
- **Lösung**: Überprüfen Sie, ob der RSVP-Code korrekt eingegeben wurde und in der Datenbank existiert.

#### Datenbankprobleme
- **Problem**: Fehler bei Datenbankoperationen
- **Lösung**: Überprüfen Sie die Supabase-Konfiguration und stellen Sie sicher, dass die Datenbankstruktur korrekt ist.

#### Bereitstellungsprobleme
- **Problem**: Anwendung kann nicht bereitgestellt werden
- **Lösung**: Überprüfen Sie die Umgebungsvariablen und stellen Sie sicher, dass alle erforderlichen Abhängigkeiten installiert sind.

### Logging

Die Anwendung verwendet die Browser-Konsole für Logging. Bei Problemen überprüfen Sie die Konsole auf Fehlermeldungen.

## Wartung und Updates

### Regelmäßige Wartungsaufgaben

1. **Datenbank-Backup**: Führen Sie regelmäßige Backups der Supabase-Datenbank durch.
2. **Abhängigkeiten aktualisieren**: Aktualisieren Sie regelmäßig die npm-Abhängigkeiten, um Sicherheitslücken zu vermeiden.
3. **Übersetzungen aktualisieren**: Halten Sie die Übersetzungen für alle unterstützten Sprachen aktuell.

### Updates durchführen

1. Ziehen Sie die neuesten Änderungen aus dem Repository:
   ```bash
   git pull origin main
   ```

2. Installieren Sie aktualisierte Abhängigkeiten:
   ```bash
   npm install
   ```

3. Führen Sie Datenbankmigrationen durch (falls erforderlich):
   Führen Sie die bereitgestellten SQL-Skripte in der Supabase-Konsole aus.

4. Erstellen Sie einen neuen Produktions-Build:
   ```bash
   npm run build
   ```

5. Stellen Sie den aktualisierten Build bereit.

---

Diese Dokumentation bietet einen umfassenden Überblick über die LemonVows-Hochzeitsplanungs-App. Für weitere Informationen oder Unterstützung wenden Sie sich bitte an das LemonVows-Team.

© 2025 LemonVows. Alle Rechte vorbehalten.
