# LemonVows - Hochzeitsplanungs-Plattform Anforderungen

## Übersicht
LemonVows ist eine browserbasierte App für Hochzeitsplanung mit modernem, romantischem Design und umfangreichen Funktionen zur Unterstützung von Brautpaaren bei der Organisation ihrer Hochzeit.

## Branding und Design
- **Hauptsprache**: Deutsch
- **Zusätzliche Sprachen**: Englisch, Französisch, Spanisch
- **Design**: Modern, romantisch, responsiv
- **Hochzeitsstile**: Boho, Elegant, Vintage, Classic, Modern
- **Tonalität**: Emotional und freundlich
- **Inspiration**: Design angelehnt an LemonHarbor.com, strukturell inspiriert von 'Meine Hochzeit Online'

## Technische Anforderungen
- **Frontend**: WeWeb als No-Code-Plattform
- **Backend**: Supabase für Datenbank und Authentifizierung
- **Hosting**: Serverless-Architektur
- **Datenschutz**: DSGVO-konform mit EU-Datenhosting
- **Offline-Funktionalität**: Grundlegende Funktionen auch offline verfügbar
- **Admin-Dashboard**: Visuelle Anpassungen ohne Programmierung
- **Zahlungsabwicklung**: Stripe oder LemonSqueezy für automatisierten Verkauf

## Kernfunktionen für MVP

### Brautpaar-Dashboard
- Multi-Language-Toggle (DE/EN/FR/ES)
- Übersicht aller Planungsbereiche
- Countdown zur Hochzeit
- Wetter-Widget

### Tischplan-Editor
- Drag & Drop Sitzplatzzuweisung
- Anpassbare Tischgrößen und -formen
- KI-Konfliktwarnung
- Farbliche Markierung nach Gruppen
- Anzeige von Allergenen und Menüpräferenzen
- Export als PDF/PNG/CSV

### Gästeverwaltung & RSVP
- Online-Zusagen/Absagen
- QR-Code Einladungen
- Erfassung von Übernachtungsbedarf & Allergien
- Begleitpersonenmanagement
- Datenexport

### Budgetplaner
- Individuelle Kategorien
- Echtzeit-Übersicht
- Warnungen bei Überschreitung
- Grafische Darstellung (Auto-Diagramme)
- Soll-Ist-Vergleich

### Trauzeugen-Bereich
- Kostenaufteilung (Splitwise-Logik)
- Geheimer JGA-Ideenpool
- Push-Benachrichtigungen

### Zusätzliche Funktionen
- Automatischer Hochzeits-Zeitplaner
- Moodboard mit Pinterest-Integration
- Musikwünsche mit Spotify-Integration
- Foto-Galerie mit GDPR-Auto-Delete
- Interaktive Karte
- Lieferantenverwaltung
- Geschenkeliste

## Monetarisierungsmodell
- **Freebie**: RSVP bis 20 Gäste (kostenlos)
- **Basic**: Einfache Funktionen, bis 75 Gäste (89€)
- **Premium**: Alle Features, unbegrenzte Gäste (129€)

## Benutzerrollen
- Brautpaar (Admin)
- Trauzeugen (eingeschränkte Admin-Rechte)
- Gäste (nur Zugriff auf bestimmte Funktionen)

## Anforderungen an die Implementierung
- Einfache Verwaltung ohne technisches Vorwissen
- Geringer Wartungsaufwand
- Kostenloser oder günstiger Start ohne Eigenkapital
- Automatisierter Bestellprozess
