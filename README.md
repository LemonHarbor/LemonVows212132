# LemonVows - Hochzeitsplanungs-WebApp

LemonVows ist eine umfassende Hochzeitsplanungs-WebApp, die Brautpaaren hilft, ihre Hochzeit einfach und stressfrei zu planen. Die Anwendung bietet verschiedene Funktionen wie einen interaktiven Tischplan, Gästeverwaltung, Budgetplaner, Moodboard und eine Foto-Galerie.

## Features

- **Interaktiver Tischplan** mit Drag & Drop-Funktionalität
- **Gästeverwaltung** mit RSVP-System und Allergien-Tracking
- **Budgetplaner** mit Kategorien und Echtzeit-Übersicht
- **Moodboard** für Inspirationen und Farbschemata
- **Foto-Galerie** mit Privatsphäre-Einstellungen
- **Admin-Dashboard** für die Verwaltung von Benutzern und Hochzeiten
- **Mehrsprachigkeit** (Deutsch und Englisch)
- **Responsive Design** für alle Geräte

## Technologien

- **Frontend**: Next.js mit TypeScript und Tailwind CSS
- **Backend**: Supabase (Authentifizierung, Datenbank, Speicher)
- **Zahlungsabwicklung**: Stripe
- **Deployment**: Vercel

## Preismodelle

- **Free**: Bis zu 10 Gäste, grundlegende Funktionen
- **Basic**: Bis zu 50 Gäste, erweiterte Funktionen (9,99 € / Monat)
- **Premium**: Unbegrenzte Gäste, alle Funktionen (19,99 € / Monat)
- **Ultimate**: White-Labeling und alle Funktionen (29,99 € / Monat)

## Installation und Einrichtung

### Voraussetzungen

- Node.js 18 oder höher
- npm oder yarn
- Supabase-Konto
- Stripe-Konto (für Zahlungsabwicklung)

### Lokale Entwicklung

1. Repository klonen:
   ```bash
   git clone https://github.com/LemonHarbor/LemonVows.git
   cd lemonvows
   ```

2. Abhängigkeiten installieren:
   ```bash
   npm install
   ```

3. Umgebungsvariablen einrichten:
   Erstelle eine `.env.local`-Datei im Hauptverzeichnis mit folgenden Variablen:
   ```
   NEXT_PUBLIC_SUPABASE_URL=deine-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=dein-supabase-anon-key
   STRIPE_SECRET_KEY=dein-stripe-secret-key
   STRIPE_WEBHOOK_SECRET=dein-stripe-webhook-secret
   ```

4. Entwicklungsserver starten:
   ```bash
   npm run dev
   ```

5. Öffne [http://localhost:3000](http://localhost:3000) im Browser.

### Supabase-Einrichtung

1. Erstelle ein neues Projekt in Supabase.
2. Führe die SQL-Skripte aus der Datei `src/db/schema.sql` in der Supabase SQL-Konsole aus.
3. Konfiguriere die Authentifizierung und die Speicherregeln gemäß der Dokumentation.

### Stripe-Einrichtung

1. Erstelle ein Stripe-Konto und konfiguriere die Produkte und Preise.
2. Aktualisiere die `stripe_price_id`-Werte in der Datei `src/lib/monetization.ts`.
3. Richte einen Webhook für Ereignisse wie `checkout.session.completed` ein.

## Deployment

Die Anwendung kann auf Vercel oder einem anderen Hosting-Dienst für Next.js-Anwendungen bereitgestellt werden.

1. Vercel-CLI installieren:
   ```bash
   npm install -g vercel
   ```

2. Deployment starten:
   ```bash
   vercel
   ```

3. Folge den Anweisungen zur Konfiguration des Deployments.

## Projektstruktur

```
lemonvows/
├── public/               # Statische Dateien
│   ├── images/           # Bilder
│   ├── fonts/            # Schriftarten
│   └── locales/          # Übersetzungsdateien
├── src/                  # Quellcode
│   ├── app/              # Next.js App Router
│   ├── components/       # React-Komponenten
│   │   ├── ui/           # UI-Komponenten
│   │   ├── sections/     # Sektionskomponenten
│   │   └── shared/       # Gemeinsame Komponenten
│   ├── config/           # Konfigurationsdateien
│   ├── db/               # Datenbankschema und Migrationen
│   ├── lib/              # Bibliotheken und Hilfsfunktionen
│   ├── styles/           # Globale Stile
│   └── types/            # TypeScript-Typdefinitionen
├── .env.local            # Lokale Umgebungsvariablen
├── .gitignore            # Git-Ignorierte Dateien
├── next.config.js        # Next.js-Konfiguration
├── package.json          # Projektabhängigkeiten
├── README.md             # Projektdokumentation
├── tailwind.config.js    # Tailwind CSS-Konfiguration
└── tsconfig.json         # TypeScript-Konfiguration
```

## Beitragen

Wir freuen uns über Beiträge zur Verbesserung von LemonVows! Bitte erstelle einen Pull Request oder eröffne ein Issue für Vorschläge und Fehlerbehebungen.

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe die [LICENSE](LICENSE)-Datei für Details.

## Kontakt

Bei Fragen oder Anregungen kontaktiere uns unter [info@lemonharbor.com](mailto:info@lemonharbor.com).
