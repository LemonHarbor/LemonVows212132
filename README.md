# README.md - LemonVows Hochzeitsplanungs-App

## Übersicht

LemonVows ist eine umfassende Hochzeitsplanungs-Web-Anwendung, die Paaren hilft, ihre Hochzeit zu organisieren und zu planen. Die Anwendung bietet verschiedene Features zur Verwaltung von Gästen, Events, Fotos, Dienstleistern, Budget, digitalen Einladungen und Registry-Links.

## Technologie-Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL-Datenbank, Authentifizierung, Storage)
- **Hosting**: Vercel (empfohlen), Netlify oder andere Hosting-Optionen

## Features

### 1. Gästemanagement (Priorität 1)
- Hinzufügen, Bearbeiten und Löschen von Gästen
- RSVP-Status-Tracking (Zugesagt, Abgesagt, Ausstehend)
- Verwaltung von Diät-Informationen
- Suchfunktion und Filterung nach RSVP-Status
- Statistik-Übersicht

### 2. Event-Scheduling (Priorität 2)
- Veranstaltungen hinzufügen, bearbeiten und löschen
- Datums- und Zeitauswahl mit Validierung
- Gruppierung von Veranstaltungen nach Datum
- Suchfunktion für Veranstaltungen
- Detaillierte Anzeige mit Ort und Beschreibung

### 3. Foto-Sharing (Priorität 3)
- Supabase Storage für Bilderspeicherung
- Foto-Upload mit Vorschau und Fortschrittsanzeige
- Galerie-Ansicht mit Modal-Vergrößerung
- Löschen von Fotos

### 4. Dienstleister-Koordination
- Dienstleister hinzufügen, bearbeiten und löschen
- Kategorisierung (Catering, Fotografie, Musik, etc.)
- Kontaktinformationen und Preisangaben
- Filterung nach Kategorien und Suchfunktion

### 5. Budget-Tracking
- Budget-Posten hinzufügen, bearbeiten und löschen
- Kategorisierung von Ausgaben
- Tracking von geschätzten und tatsächlichen Kosten
- Bezahlstatus-Verwaltung
- Umfassende Budget-Übersicht mit Statistiken

### 6. Digitale Einladungen
- Erstellung von Einladungen mit verschiedenen Design-Themen
- Markdown-Unterstützung für Formatierung
- Veröffentlichung/Entwurfsmodus
- Benutzerdefinierte URLs
- Öffentliche Ansicht für Gäste

### 7. Registry-Linking
- Hinzufügen, Bearbeiten und Löschen von Registry-Links
- Anzeige von Logos und Beschreibungen
- Direkte Links zu externen Wunschlisten
- Suchfunktion für Registry-Links

## Dokumentation

Ausführliche Dokumentation finden Sie in den folgenden Dateien:

- [Setup-Anleitung](docs/setup.md) - Anleitung zur Einrichtung der Anwendung
- [Deployment-Dokumentation](docs/deployment.md) - Anleitung zum Deployment der Anwendung
- [Git-Push-Anleitung](docs/git-push.md) - Anleitung zur Verwendung von Git mit diesem Projekt

## Erste Schritte

1. Klonen Sie das Repository
2. Installieren Sie die Abhängigkeiten mit `npm install`
3. Richten Sie ein Supabase-Projekt ein (siehe Setup-Anleitung)
4. Konfigurieren Sie die Umgebungsvariablen in `.env.local`
5. Starten Sie den Entwicklungsserver mit `npm run dev`
6. Öffnen Sie [http://localhost:3000](http://localhost:3000) in Ihrem Browser

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.

## Kontakt

Bei Fragen oder Problemen erstellen Sie bitte ein Issue im GitHub-Repository oder kontaktieren Sie uns direkt.
