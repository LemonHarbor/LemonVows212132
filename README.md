# LemonVows - Hochzeitsplanungs-App

## Dokumentation

Diese Dokumentation beschreibt die Entwicklung und Funktionalität der LemonVows Hochzeitsplanungs-App, einer umfassenden Webanwendung für Hochzeitspaare zur Planung ihrer Hochzeit.

## Inhaltsverzeichnis

1. [Übersicht](#übersicht)
2. [Technologie-Stack](#technologie-stack)
3. [Projektstruktur](#projektstruktur)
4. [Kernfunktionalitäten](#kernfunktionalitäten)
5. [Mehrsprachigkeit](#mehrsprachigkeit)
6. [Admin-Dashboard](#admin-dashboard)
7. [Mobile-First Design](#mobile-first-design)
8. [Demo-Bereich](#demo-bereich)
9. [Marketing und Monetarisierung](#marketing-und-monetarisierung)
10. [Installation und Einrichtung](#installation-und-einrichtung)
11. [Deployment](#deployment)
12. [Wartung und Erweiterung](#wartung-und-erweiterung)

## Übersicht

LemonVows ist eine browserbasierte Hochzeitsplanungs-App, die Brautpaaren hilft, ihre Hochzeit effizient zu planen. Die App bietet verschiedene Funktionen wie interaktiven Tischplan, Gästeverwaltung, Budgetplaner, Musikwünsche und Foto-Galerie. Die Anwendung ist mehrsprachig (Deutsch und Englisch), vollständig responsiv und bietet ein No-Code Admin-Dashboard für einfache Anpassungen ohne Programmierkenntnisse.

## Technologie-Stack

Die Anwendung wurde mit folgenden Technologien entwickelt:

- **Frontend**: React mit TypeScript
- **Build-Tool**: Vite
- **Styling**: Styled Components
- **Backend**: Supabase (Authentifizierung, Datenbank, Speicher)
- **Mehrsprachigkeit**: i18next
- **Deployment**: Netlify

## Projektstruktur

Die Anwendung folgt einer modularen Struktur:

```
LemonVows/
├── public/              # Statische Assets
├── src/
│   ├── components/      # Wiederverwendbare UI-Komponenten
│   ├── context/         # React Context Provider
│   ├── hooks/           # Custom React Hooks
│   ├── locales/         # Übersetzungsdateien
│   │   ├── de/          # Deutsche Übersetzungen
│   │   └── en/          # Englische Übersetzungen
│   ├── pages/           # Seitenkomponenten
│   ├── services/        # API-Dienste (Supabase)
│   ├── styles/          # Globale Stile und Themes
│   └── utils/           # Hilfsfunktionen
├── package.json         # Abhängigkeiten und Skripte
├── tsconfig.json        # TypeScript-Konfiguration
└── vite.config.ts       # Vite-Konfiguration
```

## Kernfunktionalitäten

### Interaktiver Tischplan

Der interaktive Tischplan ermöglicht es Brautpaaren, ihre Sitzordnung visuell zu planen:

- Drag-and-Drop-Funktionalität für Gäste
- Anpassbare Tischformen und -größen
- Automatische Konfliktwarnung
- Export als PDF/PNG/CSV

Die Implementierung nutzt den `TablePlanContext` für die Zustandsverwaltung und speichert Daten in Supabase.

### Gästeverwaltung & RSVP

Das Gästemanagement-System ermöglicht:

- Erfassung von Gästedaten
- Online-Zu- und Absagen
- Erfassung von Übernachtungsbedarf und Allergien
- Integration mit dem Tischplan

### Budgetplaner

Der Budgetplaner hilft bei der finanziellen Planung:

- Individuelle Kategorien
- Echtzeit-Übersicht über Ausgaben
- Warnungen bei Budgetüberschreitung
- Grafische Darstellung der Ausgaben

### Musikwünsche

Die Musikwunsch-Funktion ermöglicht:

- Hinzufügen von Musikwünschen
- Abstimmungssystem für Gäste
- Exportierbare Playlist
- Sortierung nach Beliebtheit

### Foto-Galerie

Die Foto-Galerie bietet:

- Upload-Funktionalität für Fotos
- Privatsphäre-Einstellungen
- Download-Möglichkeiten
- Automatische Thumbnail-Generierung

## Mehrsprachigkeit

Die Anwendung unterstützt Deutsch und Englisch mit der Möglichkeit, später Französisch und Spanisch hinzuzufügen:

- Vollständige Übersetzungen für alle UI-Elemente
- Sprachumschalter in der Navigation
- Lokalisierte Datums- und Währungsformate
- Übersetzungsdateien im JSON-Format

Die Implementierung nutzt i18next und den `useLanguage` Hook für einfachen Zugriff auf Übersetzungen.

## Admin-Dashboard

Das Admin-Dashboard ermöglicht Anpassungen ohne Programmierkenntnisse:

- Anpassung von Farben und Themes
- Bearbeitung von Inhalten
- Aktivierung/Deaktivierung von Funktionen
- Benutzerverwaltung

Das Dashboard ist vollständig No-Code und bietet eine intuitive Benutzeroberfläche.

## Mobile-First Design

Die Anwendung wurde nach dem Mobile-First-Prinzip entwickelt:

- Responsive Komponenten für alle Bildschirmgrößen
- Angepasste Layouts für Mobilgeräte, Tablets und Desktop
- Optimierte Touch-Interaktionen
- Performante Ladezeiten

Die Implementierung nutzt Media Queries und responsive Komponenten.

## Demo-Bereich

Der Demo-Bereich auf der Landingpage ermöglicht potenziellen Nutzern, die App-Funktionen zu testen:

- Interaktive Demos aller Kernfunktionen
- Tabbed Interface für einfache Navigation
- Responsive Design für alle Geräte
- Klare Call-to-Action-Buttons

## Marketing und Monetarisierung

Die Monetarisierungsstrategie umfasst:

- Drei Preisstufen: Free, Premium (89€) und Ultimate (129€)
- Einmalzahlung statt Abonnement
- Automatisierter Checkout-Prozess
- Zahlungsabwicklung über Kreditkarte und PayPal

Die Marketing-Landingpage präsentiert die Vorteile der App mit:

- Hero-Sektion mit klarem Wertversprechen
- Feature-Übersicht
- Kundenstimmen
- Call-to-Action-Elementen

## Installation und Einrichtung

### Voraussetzungen

- Node.js (v14 oder höher)
- npm oder yarn
- Supabase-Konto

### Installation

1. Repository klonen:
   ```
   git clone https://github.com/LemonHarbor/LemonVows.git
   cd LemonVows
   ```

2. Abhängigkeiten installieren:
   ```
   npm install
   ```

3. Umgebungsvariablen einrichten:
   Erstellen Sie eine `.env`-Datei mit folgenden Variablen:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://jodqliylhmwgpurfzxm.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZHFsaXlsaG13Z3B1cmZ6eG0iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcxNjk4MzI1NiwZXhwIjoyMDMyNTU5MjU2fQ.7STGhtd2wdXJmemtIwY4cCI6MjA0OH0.7vcXDTN4jsIpnpe-06qyuU3K-pQvwtYpLueUuzDzDk
   ```

4. Entwicklungsserver starten:
   ```
   npm run dev
   ```

## Deployment

Die Anwendung kann auf Netlify oder einem anderen Hosting-Dienst bereitgestellt werden:

1. Build erstellen:
   ```
   npm run build
   ```

2. Für Netlify:
   - Verbinden Sie Ihr GitHub-Repository mit Netlify
   - Konfigurieren Sie die Build-Einstellungen:
     - Build-Befehl: `npm run build`
     - Publish-Verzeichnis: `dist`
     - Umgebungsvariablen hinzufügen

3. Für andere Hosting-Dienste:
   - Laden Sie den Inhalt des `dist`-Verzeichnisses hoch

## Wartung und Erweiterung

### Neue Funktionen hinzufügen

1. Erstellen Sie neue Komponenten in `src/components/`
2. Fügen Sie neue Übersetzungen in `src/locales/` hinzu
3. Integrieren Sie die Komponenten in die entsprechenden Seiten

### Neue Sprachen hinzufügen

1. Erstellen Sie einen neuen Ordner in `src/locales/` (z.B. `fr` für Französisch)
2. Kopieren Sie die Struktur aus `en` oder `de`
3. Übersetzen Sie alle Schlüssel
4. Fügen Sie die neue Sprache zum Sprachumschalter hinzu

### Datenbank-Schema aktualisieren

1. Verwenden Sie die Supabase-Konsole, um Tabellen zu ändern
2. Aktualisieren Sie die entsprechenden TypeScript-Typen
3. Passen Sie die API-Aufrufe in den Services an
