# LemonVows Technische Dokumentation

Diese technische Dokumentation beschreibt die Architektur, Komponenten und Implementierungsdetails der LemonVows Hochzeitsplanungs-Webapp.

## Architektur

LemonVows verwendet eine moderne Client-Server-Architektur:

- **Frontend**: WeWeb (No-Code-Plattform) mit Vue.js-Komponenten
- **Backend**: Supabase (Backend-as-a-Service) mit PostgreSQL-Datenbank
- **Authentifizierung**: Supabase Auth
- **Datenspeicherung**: Supabase Storage
- **Zahlungsabwicklung**: Stripe/LemonSqueezy-Integration

### Architekturdiagramm

```
+------------------+     +------------------+     +------------------+
|                  |     |                  |     |                  |
|  WeWeb Frontend  |<--->|  API Service    |<--->|  Supabase        |
|  (Vue.js)        |     |  (JavaScript)   |     |  (PostgreSQL)    |
|                  |     |                  |     |                  |
+------------------+     +------------------+     +------------------+
                                                         ^
                                                         |
                                                         v
                                               +------------------+
                                               |                  |
                                               |  Supabase Auth   |
                                               |  & Storage       |
                                               |                  |
                                               +------------------+
                                                         ^
                                                         |
                                                         v
                                               +------------------+
                                               |                  |
                                               |  Stripe/         |
                                               |  LemonSqueezy    |
                                               |                  |
                                               +------------------+
```

## Datenmodell

Das Datenmodell besteht aus den folgenden Hauptentitäten:

- **Users**: Benutzerkonten und -profile
- **Weddings**: Hochzeitsinformationen und -einstellungen
- **Guests**: Gästedaten und RSVP-Status
- **Tables**: Tischinformationen für die Sitzordnung
- **Seatings**: Zuordnung von Gästen zu Tischen
- **Budget Categories**: Budgetkategorien
- **Budget Items**: Einzelne Budgetposten
- **Timeline Phases**: Phasen der Hochzeitsplanung
- **Timeline Events**: Ereignisse und Aufgaben im Zeitplan
- **Witness Tasks**: Aufgaben für Trauzeugen
- **Shared Expenses**: Geteilte Ausgaben
- **Moodboard Categories**: Kategorien für Moodboard-Bilder
- **Moodboard Images**: Bilder und Inspirationen

Das vollständige Datenbankschema ist in der Datei `backend/supabase-schema.sql` definiert.

## Frontend-Komponenten

### Hauptkomponenten

- **Dashboard.vue**: Übersichtsseite mit Widgets und Statistiken
- **TablePlanner.vue**: Interaktiver Tischplaner mit Drag & Drop
- **GuestManagement.vue**: Gästeverwaltung und RSVP-System
- **BudgetPlanner.vue**: Budgetverwaltung mit Diagrammen
- **Timeline.vue**: Zeitplaner mit automatischer Generierung
- **Moodboard.vue**: Bildsammlung mit Kategorien und Farbanalyse
- **WitnessArea.vue**: Bereich für Trauzeugen mit Aufgaben und geteilten Ausgaben

### Gemeinsame Komponenten

- **LanguageSwitcher.vue**: Sprachumschalter für mehrsprachige Unterstützung
- **ThemeSwitcher.vue**: Stilumschalter für verschiedene Hochzeitsstile
- **Notification.vue**: Benachrichtigungskomponente
- **Modal.vue**: Wiederverwendbare Modal-Komponente
- **Chart.vue**: Diagrammkomponente für Budgetvisualisierung

### Dienste

- **api-service.js**: Verbindung zum Supabase-Backend
- **auth-service.js**: Authentifizierungsfunktionen
- **storage-service.js**: Dateispeicherungsfunktionen
- **i18n-service.js**: Internationalisierungsfunktionen

## Backend-Komponenten

### Supabase-Konfiguration

- **Authentifizierung**: E-Mail/Passwort-Authentifizierung
- **Datenbank**: PostgreSQL-Datenbank mit Tabellen und Beziehungen
- **Speicher**: Buckets für Bild-Uploads
- **Funktionen**: Serverlose Funktionen für komplexe Operationen

### API-Endpunkte

- **/auth**: Authentifizierungsendpunkte (Registrierung, Login, Logout)
- **/weddings**: Verwaltung von Hochzeiten
- **/guests**: Gästeverwaltung und RSVP
- **/tables**: Tischverwaltung
- **/seatings**: Sitzplatzzuweisung
- **/budget**: Budgetverwaltung
- **/timeline**: Zeitplanverwaltung
- **/witness**: Trauzeugen-Funktionen
- **/moodboard**: Moodboard-Funktionen

### Sicherheit

- **Row Level Security (RLS)**: Datenzugriffskontrolle auf Zeilenebene
- **Authentifizierung**: JWT-basierte Authentifizierung
- **Autorisierung**: Rollenbasierte Zugriffskontrolle
- **DSGVO-Konformität**: Datenschutzfunktionen und EU-Hosting

## Mehrsprachige Unterstützung

Die Anwendung unterstützt die folgenden Sprachen:

- Deutsch (Standardsprache)
- Englisch
- Französisch
- Spanisch

Die Übersetzungen sind in der Datei `frontend/locales/translations.json` definiert und werden über die Vue I18n-Bibliothek verwaltet.

## Zahlungsabwicklung

Die Zahlungsabwicklung erfolgt über Stripe oder LemonSqueezy mit den folgenden Abonnement-Stufen:

- **Free**: Bis zu 20 Gäste, grundlegende Funktionen
- **Basic**: Bis zu 75 Gäste, erweiterte Funktionen (89€)
- **Premium**: Unbegrenzte Gäste, alle Funktionen (129€)

## Offline-Funktionalität

Die Offline-Funktionalität wird durch folgende Technologien ermöglicht:

- **Service Worker**: Für Caching und Offline-Zugriff
- **IndexedDB**: Für lokale Datenspeicherung
- **Synchronisierung**: Automatische Synchronisierung bei Wiederherstellung der Verbindung

## Leistungsoptimierung

- **Lazy Loading**: Komponenten werden bei Bedarf geladen
- **Code Splitting**: Aufteilung des Codes in kleinere Chunks
- **Caching**: Caching von Daten und Assets
- **Bildoptimierung**: Automatische Bildoptimierung für schnellere Ladezeiten

## Testen

Die Anwendung wird mit den folgenden Testtypen getestet:

- **Komponententests**: Tests für einzelne Komponenten
- **Integrationstests**: Tests für das Zusammenspiel von Komponenten
- **End-to-End-Tests**: Tests für vollständige Benutzerworkflows

Die Testdateien befinden sich im Verzeichnis `frontend/tests`.

## Bekannte Einschränkungen

- Die Offline-Funktionalität ist nur in der Premium-Version verfügbar
- Die Pinterest-Integration erfordert eine manuelle Autorisierung
- Die Wettervorhersage ist auf 10 Tage vor dem Hochzeitsdatum begrenzt

## Zukünftige Erweiterungen

- Mobile App für iOS und Android
- KI-basierte Empfehlungen für Hochzeitsplanung
- Erweitertes Lieferantenmanagement
- Integrierte Videokonferenzen für virtuelle Planungstreffen
- Erweiterte Analysen und Berichte

## Ressourcen

- [WeWeb-Dokumentation](https://docs.weweb.io/)
- [Supabase-Dokumentation](https://supabase.io/docs)
- [Vue.js-Dokumentation](https://vuejs.org/guide/introduction.html)
- [Stripe-Dokumentation](https://stripe.com/docs)
- [LemonSqueezy-Dokumentation](https://docs.lemonsqueezy.com/)
