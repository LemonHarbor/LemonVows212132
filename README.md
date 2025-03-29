# LemonVows - Hochzeitsplanungs-App

Eine vollständig funktionsfähige Web-App für Hochzeitsplanung mit mehrsprachiger Unterstützung, interaktiven Features und No-Code-Anpassbarkeit.

## Überblick

LemonVows ist eine umfassende Hochzeitsplanungs-Plattform, die es Brautpaaren ermöglicht, ihre Hochzeit interaktiv zu planen und zu verwalten. Die App bietet mehrsprachige Unterstützung, ein interaktives Musikabstimmungssystem, ein spezielles Trauzeugen-Portal und vieles mehr.

## Hauptfunktionen

- **Mehrsprachige Unterstützung**: Deutsch, Englisch, Französisch und Spanisch für internationale Hochzeiten
- **Interaktiver Tischplaner**: Drag & Drop-Funktionalität für die Sitzplatzplanung
- **Gästemanagement**: RSVP-System, Diätanforderungen und Kontaktverwaltung
- **Musikabstimmung**: Gäste können per Up- und Downvote über die Playlist abstimmen
- **Trauzeugen-Portal**: Spezieller Bereich für die Planung mit Trauzeugen
- **Budget-Planer**: Verwaltung und Verfolgung aller Hochzeitsausgaben
- **Checklisten**: Anpassbare To-Do-Listen für die Hochzeitsplanung
- **No-Code Admin-Dashboard**: Einfache Verwaltung ohne Programmierkenntnisse
- **Developer-Modus**: Erweiterte Funktionen für technisch versierte Nutzer
- **Mobile-First Design**: Optimiert für alle Geräte mit Dark Mode

## Technologie-Stack

- **Frontend**: React mit TypeScript und Vite
- **Backend**: Supabase für Datenbank und Authentifizierung
- **Styling**: CSS-in-JS mit responsivem Design
- **Mehrsprachigkeit**: i18n-Implementierung mit Sprachumschalter
- **Deployment**: Netlify für kontinuierliche Bereitstellung

## Projektstruktur

```
LemonVows/
├── implementation/
│   ├── admin-dashboard/       # Admin-Dashboard für No-Code-Verwaltung
│   ├── core-features/         # Kernfunktionen der App
│   │   ├── budget-planner/    # Budget-Planungs-Komponenten
│   │   ├── checklists/        # Checklisten-Funktionalität
│   │   ├── guest-management/  # Gästeverwaltung und RSVP
│   │   └── table-planner/     # Tischplaner-Komponenten
│   ├── couple-management/     # Brautpaar-Verwaltungssystem
│   ├── demo-area/             # Demo-Bereich für die Landingpage
│   │   ├── landing-page/      # Landingpage-Komponenten
│   │   └── table-planner-demo/# Interaktive Demo des Tischplaners
│   ├── i18n/                  # Mehrsprachigkeits-Implementierung
│   ├── responsive/            # Responsive Design-Utilities
│   ├── styles/                # Globale Styles und Themes
│   └── theme/                 # Theme-Provider und Dark Mode
├── marketing/                 # Marketing-Strategie und Monetarisierungsplan
├── research/                  # Wettbewerbsanalyse und Marktforschung
└── todo/                      # Projektfortschritt und To-Do-Liste
```

## Installation und Entwicklung

1. Repository klonen:
```bash
git clone https://github.com/LemonHarbor/LemonVows.git
cd LemonVows
```

2. Abhängigkeiten installieren:
```bash
npm install
```

3. Entwicklungsserver starten:
```bash
npm run dev
```

4. Build erstellen:
```bash
npm run build
```

## Monetarisierungsmodell

LemonVows verwendet ein Freemium-Modell mit verschiedenen Abonnement-Stufen:

- **Lemon Basic** (Kostenlos): Grundlegende Funktionen für kleine Hochzeiten
- **Lemon Plus** (9,99€/Monat): Erweiterte Funktionen und zweisprachige Unterstützung
- **Lemon Gold** (19,99€/Monat): Vollständige Funktionalität mit viersprachiger Unterstützung
- **Lemon Pro** (49,99€/Monat): Business-Tier für Hochzeitsplaner mit White-Label-Option

Zusätzliche Einnahmequellen umfassen In-App-Käufe, Affiliate-Marketing und gesponserte Inhalte.

## Marketingstrategie

Die Marketingstrategie konzentriert sich auf:

1. **Digitale Werbekampagnen**: Google Ads, Social Media Ads und Retargeting
2. **Partnerschaften**: Mit Hochzeitslocations und -dienstleistern
3. **Content-Marketing**: SEO-optimierte Artikel zu internationalen Hochzeiten
4. **Social Media**: Instagram, Pinterest, TikTok und Facebook-Gruppen
5. **E-Mail-Marketing**: Automatisierte Sequenzen basierend auf dem Hochzeitsdatum

## Beitragen

Wir freuen uns über Beiträge zur Verbesserung von LemonVows! Bitte erstellen Sie einen Pull Request oder eröffnen Sie ein Issue für Vorschläge und Fehlermeldungen.

## Lizenz

Dieses Projekt ist urheberrechtlich geschützt und darf nur mit ausdrücklicher Genehmigung verwendet werden.

## Kontakt

Bei Fragen oder Anregungen kontaktieren Sie uns bitte unter info@lemonvows.com.
