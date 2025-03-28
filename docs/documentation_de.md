# LemonVows Dokumentation

## Inhaltsverzeichnis

1. [Einführung](#einführung)
2. [Installation](#installation)
3. [Administratorhandbuch](#administratorhandbuch)
4. [Benutzerhandbuch für Brautpaare](#benutzerhandbuch-für-brautpaare)
5. [API-Dokumentation](#api-dokumentation)
6. [No-Code-Anpassungsleitfaden](#no-code-anpassungsleitfaden)
7. [Fehlerbehebung](#fehlerbehebung)

## Einführung

LemonVows ist eine umfassende Hochzeitsplanungs-WebApp, die Brautpaaren eine stressfreie Planung ihrer Hochzeit ermöglicht. Die Anwendung bietet verschiedene Funktionen wie einen interaktiven Tischplan, Gästeverwaltung mit RSVP-System, Budgetplaner, Checklisten und vieles mehr.

Diese Dokumentation richtet sich an Administratoren, die die Plattform verwalten, und an Brautpaare, die die Anwendung für ihre Hochzeitsplanung nutzen.

## Installation

### Voraussetzungen

- Node.js (Version 20.18.0 oder höher)
- npm (Version 10.2.0 oder höher)
- Git
- Supabase-Konto und -Projekt

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
   - Erstellen Sie eine `.env.local`-Datei im Stammverzeichnis des Projekts
   - Fügen Sie folgende Variablen hinzu:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://jodqlliylhmwgpurfzxm.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZHFsbGl5bGhtd2dwdXJmenhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5ODI4ODgsImV4cCI6MjA1ODU1ODg4OH0.7vcXDTNdjsIpnpe-06qSyuu3K-pQVwtYpLueUuzDzDk
     STRIPE_SECRET_KEY=your-stripe-secret-key
     STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
     ```

4. Entwicklungsserver starten:
   ```bash
   npm run dev
   ```

5. Öffnen Sie http://localhost:3000 in Ihrem Browser

### Deployment auf Netlify

1. Erstellen Sie ein Netlify-Konto unter https://netlify.com (falls noch nicht vorhanden)
2. Klicken Sie auf "New site from Git"
3. Wählen Sie GitHub als Repository-Quelle
4. Wählen Sie das LemonVows-Repository aus
5. Die Build-Einstellungen werden automatisch aus der `netlify.toml`-Datei übernommen
6. Klicken Sie auf "Deploy site"

## Administratorhandbuch

### Admin-Dashboard

Das Admin-Dashboard ist der zentrale Ort für die Verwaltung der LemonVows-Plattform. Hier können Sie Benutzer verwalten, Instanzen erstellen und überwachen, Inhalte anpassen und Systemeinstellungen konfigurieren.

#### Zugriff auf das Admin-Dashboard

1. Melden Sie sich mit Ihren Administrator-Anmeldedaten an
2. Navigieren Sie zu `/admin` in der URL
3. Sie werden zum Admin-Dashboard weitergeleitet

#### Benutzer verwalten

Im Bereich "Benutzer" des Admin-Dashboards können Sie:

1. Neue Benutzer hinzufügen:
   - Klicken Sie auf "Benutzer hinzufügen"
   - Geben Sie die erforderlichen Informationen ein (Name, E-Mail, Rolle)
   - Klicken Sie auf "Speichern"

2. Bestehende Benutzer bearbeiten:
   - Klicken Sie auf das Bearbeiten-Symbol neben dem Benutzer
   - Aktualisieren Sie die Informationen
   - Klicken Sie auf "Speichern"

3. Benutzer löschen:
   - Klicken Sie auf das Löschen-Symbol neben dem Benutzer
   - Bestätigen Sie die Löschung

4. Benutzer filtern:
   - Verwenden Sie die Suchleiste, um nach Benutzern zu suchen
   - Filtern Sie nach Rolle oder Status

#### Instanzen verwalten

Im Bereich "Instanzen" des Admin-Dashboards können Sie:

1. Neue Instanzen erstellen:
   - Klicken Sie auf "Instanz erstellen"
   - Geben Sie die erforderlichen Informationen ein (Name, Besitzer, Plan)
   - Klicken Sie auf "Erstellen"

2. Bestehende Instanzen bearbeiten:
   - Klicken Sie auf das Bearbeiten-Symbol neben der Instanz
   - Aktualisieren Sie die Informationen
   - Klicken Sie auf "Speichern"

3. Instanzen löschen:
   - Klicken Sie auf das Löschen-Symbol neben der Instanz
   - Bestätigen Sie die Löschung

4. Instanzen filtern:
   - Verwenden Sie die Suchleiste, um nach Instanzen zu suchen
   - Filtern Sie nach Plan oder Status

#### Inhalte anpassen

Im Bereich "Content-Editor" des Admin-Dashboards können Sie:

1. Allgemeine Inhalte bearbeiten:
   - Titel und Untertitel der Plattform
   - Allgemeine Beschreibungen

2. Feature-Beschreibungen bearbeiten:
   - Titel und Beschreibungen der Hauptfunktionen
   - Highlights für jede Funktion

3. Preispläne anpassen:
   - Titel, Preise und Beschreibungen der Pläne
   - Features für jeden Plan

4. Testimonials verwalten:
   - Hinzufügen, Bearbeiten und Löschen von Kundenstimmen

5. FAQ-Bereich anpassen:
   - Hinzufügen, Bearbeiten und Löschen von häufig gestellten Fragen

6. Call-to-Action-Bereich anpassen:
   - Titel, Untertitel und Button-Texte

7. Footer-Bereich anpassen:
   - Links und Texte im Footer-Bereich

### Systemeinstellungen

Im Bereich "Einstellungen" des Admin-Dashboards können Sie:

1. E-Mail-Einstellungen konfigurieren:
   - SMTP-Server-Einstellungen
   - E-Mail-Vorlagen anpassen

2. Zahlungseinstellungen konfigurieren:
   - Stripe-API-Schlüssel
   - Währung und Steuereinstellungen

3. Spracheinstellungen anpassen:
   - Verfügbare Sprachen aktivieren/deaktivieren
   - Standardsprache festlegen

4. Sicherheitseinstellungen konfigurieren:
   - Passwortrichtlinien
   - Zwei-Faktor-Authentifizierung

## Benutzerhandbuch für Brautpaare

### Erste Schritte

#### Registrierung und Anmeldung

1. Besuchen Sie die LemonVows-Website
2. Klicken Sie auf "Registrieren"
3. Geben Sie Ihre E-Mail-Adresse und ein Passwort ein
4. Bestätigen Sie Ihre E-Mail-Adresse über den Link in der Bestätigungs-E-Mail
5. Melden Sie sich mit Ihren Anmeldedaten an

#### Dashboard-Übersicht

Nach der Anmeldung gelangen Sie zum Dashboard, das einen Überblick über Ihre Hochzeitsplanung bietet:

- Countdown bis zum Hochzeitstag
- Fortschrittsanzeige für Ihre Checklisten
- Neueste RSVP-Antworten
- Budgetübersicht
- Schnellzugriff auf die wichtigsten Funktionen

### Interaktiver Tischplan

#### Tischplan erstellen

1. Navigieren Sie zum Bereich "Tischplan"
2. Klicken Sie auf "Neuen Tischplan erstellen"
3. Wählen Sie den Veranstaltungsort aus oder erstellen Sie einen neuen
4. Fügen Sie Tische hinzu:
   - Klicken Sie auf "Tisch hinzufügen"
   - Wählen Sie die Tischform (rund, rechteckig, quadratisch, oval)
   - Legen Sie die Kapazität fest
   - Positionieren Sie den Tisch per Drag & Drop

#### Gäste zuweisen

1. Ziehen Sie Gäste aus der Gästeliste auf die Tische
2. Um Gäste umzusetzen, ziehen Sie sie einfach an einen anderen Platz
3. Um Gäste zu entfernen, ziehen Sie sie zurück in die Gästeliste

#### Tischplan anpassen

1. Tische bearbeiten:
   - Klicken Sie auf einen Tisch, um ihn auszuwählen
   - Ändern Sie Form, Größe oder Kapazität
   - Drehen Sie den Tisch mit dem Rotationswerkzeug

2. Tische löschen:
   - Wählen Sie einen Tisch aus
   - Klicken Sie auf "Tisch löschen"

3. Tischplan-Layout speichern:
   - Klicken Sie auf "Speichern"
   - Geben Sie einen Namen für das Layout ein

#### Tischplan exportieren

1. Klicken Sie auf "Exportieren"
2. Wählen Sie das gewünschte Format:
   - PDF: Vollständiger Tischplan mit Gästeliste
   - PNG: Visuelle Darstellung des Tischplans
   - CSV: Tabellarische Darstellung für Excel oder andere Programme

### Gästeverwaltung

#### Gäste hinzufügen

1. Navigieren Sie zum Bereich "Gäste"
2. Klicken Sie auf "Gast hinzufügen"
3. Geben Sie die Gästeinformationen ein:
   - Name und Kontaktdaten
   - Beziehung (Braut/Bräutigam)
   - Gruppe (Familie, Freunde, Kollegen)
4. Klicken Sie auf "Speichern"

#### Gäste importieren

1. Klicken Sie auf "Gäste importieren"
2. Laden Sie eine CSV-Datei hoch oder kopieren Sie Daten aus einer Tabelle
3. Ordnen Sie die Spalten den entsprechenden Feldern zu
4. Klicken Sie auf "Importieren"

#### RSVP-Einstellungen

1. Klicken Sie auf "RSVP-Einstellungen"
2. Passen Sie das RSVP-Formular an:
   - Aktivieren/deaktivieren Sie Felder (Menüpräferenzen, Allergien, Übernachtungsbedarf)
   - Fügen Sie benutzerdefinierte Fragen hinzu
3. Legen Sie die RSVP-Deadline fest
4. Speichern Sie die Einstellungen

#### Gäste verwalten

1. Filtern Sie Gäste nach verschiedenen Kriterien:
   - RSVP-Status (Zugesagt, Abgesagt, Ausstehend)
   - Gruppe (Familie, Freunde, Kollegen)
   - Menüpräferenzen oder Allergien
   - Übernachtungsbedarf

2. Bearbeiten Sie Gästeinformationen:
   - Klicken Sie auf das Bearbeiten-Symbol neben dem Gast
   - Aktualisieren Sie die Informationen
   - Klicken Sie auf "Speichern"

3. Senden Sie E-Mails an Gäste:
   - Wählen Sie einzelne Gäste oder Gruppen aus
   - Klicken Sie auf "E-Mail senden"
   - Wählen Sie eine Vorlage oder erstellen Sie eine neue Nachricht
   - Klicken Sie auf "Senden"

### Budgetplaner

#### Budget einrichten

1. Navigieren Sie zum Bereich "Budget"
2. Legen Sie Ihr Gesamtbudget fest
3. Erstellen Sie Budgetkategorien:
   - Klicken Sie auf "Kategorie hinzufügen"
   - Geben Sie den Namen und das geplante Budget ein
   - Klicken Sie auf "Speichern"

#### Ausgaben erfassen

1. Wählen Sie eine Kategorie aus
2. Klicken Sie auf "Ausgabe hinzufügen"
3. Geben Sie die Details ein:
   - Beschreibung
   - Betrag
   - Datum
   - Bezahlstatus
4. Fügen Sie optional einen Beleg hinzu (Foto oder PDF)
5. Klicken Sie auf "Speichern"

#### Budget analysieren

1. Sehen Sie sich die Gesamtübersicht an:
   - Gesamtbudget vs. tatsächliche Ausgaben
   - Verbleibender Betrag
   - Fortschrittsbalken für jede Kategorie

2. Analysieren Sie die Ausgabenverteilung:
   - Kreisdiagramm für die prozentuale Verteilung
   - Balkendiagramm für den Vergleich zwischen geplanten und tatsächlichen Ausgaben

3. Filtern Sie Ausgaben:
   - Nach Kategorie
   - Nach Bezahlstatus
   - Nach Datum

### Checklisten

#### Checklisten verwenden

1. Navigieren Sie zum Bereich "Checklisten"
2. Wählen Sie eine Phase aus:
   - Planung (12+ Monate vor der Hochzeit)
   - Vorbereitung (6-12 Monate vor der Hochzeit)
   - Letzte Woche (1 Woche vor der Hochzeit)
   - Hochzeitstag

3. Verwalten Sie Aufgaben:
   - Markieren Sie erledigte Aufgaben als abgeschlossen
   - Fügen Sie neue Aufgaben hinzu
   - Weisen Sie Aufgaben Verantwortlichen zu
   - Setzen Sie Prioritäten und Fälligkeitsdaten

#### Eigene Checklisten erstellen

1. Klicken Sie auf "Neue Checkliste"
2. Geben Sie einen Namen und eine Beschreibung ein
3. Fügen Sie Aufgaben hinzu:
   - Klicken Sie auf "Aufgabe hinzufügen"
   - Geben Sie Titel, Beschreibung und Fälligkeitsdatum ein
   - Legen Sie die Priorität fest
4. Klicken Sie auf "Speichern"

#### Fortschritt verfolgen

1. Sehen Sie sich den Gesamtfortschritt an:
   - Fortschrittsbalken für alle Checklisten
   - Prozentsatz der erledigten Aufgaben

2. Filtern Sie nach Status:
   - Alle Aufgaben
   - Offene Aufgaben
   - Erledigte Aufgaben
   - Überfällige Aufgaben

### Moodboards

#### Moodboard erstellen

1. Navigieren Sie zum Bereich "Moodboards"
2. Klicken Sie auf "Neues Moodboard"
3. Geben Sie einen Namen und eine Beschreibung ein
4. Klicken Sie auf "Erstellen"

#### Bilder hinzufügen

1. Laden Sie eigene Bilder hoch:
   - Klicken Sie auf "Bilder hochladen"
   - Wählen Sie Bilder von Ihrem Gerät aus
   - Klicken Sie auf "Hochladen"

2. Pinterest-Pins integrieren:
   - Klicken Sie auf "Pinterest-Pin hinzufügen"
   - Fügen Sie die URL des Pins ein
   - Klicken Sie auf "Hinzufügen"

#### Farben extrahieren

1. Wählen Sie ein Bild aus
2. Klicken Sie auf "Farben extrahieren"
3. Die dominanten Farben werden automatisch extrahiert
4. Speichern Sie die Farbpalette für Ihre Hochzeit

### Gästeportal

#### Gästeportal einrichten

1. Navigieren Sie zu "Einstellungen" > "Gästeportal"
2. Passen Sie das Design an:
   - Wählen Sie ein Farbschema
   - Laden Sie ein Titelbild hoch
   - Fügen Sie eine persönliche Nachricht hinzu
3. Konfigurieren Sie die Funktionen:
   - RSVP-Formular
   - Tagesablauf
   - Musikwünsche
   - Fotogalerie
4. Klicken Sie auf "Speichern"

#### Gästeportal teilen

1. Klicken Sie auf "Gästeportal teilen"
2. Kopieren Sie den Link oder QR-Code
3. Teilen Sie den Link über:
   - E-Mail-Einladungen
   - Hochzeitswebsite
   - Soziale Medien

## API-Dokumentation

### Authentifizierung

LemonVows verwendet Supabase für die Authentifizierung. Alle API-Anfragen müssen einen gültigen JWT-Token im Authorization-Header enthalten.

#### Anmeldung

```
POST /api/auth/login
```

Request-Body:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "Max Mustermann"
  }
}
```

### Gäste-API

#### Alle Gäste abrufen

```
GET /api/guests
```

Response:
```json
{
  "guests": [
    {
      "id": "1",
      "name": "Anna Schmidt",
      "email": "anna@example.com",
      "rsvpStatus": "confirmed",
      "menuPreference": "vegetarian",
      "accommodationNeeded": true
    },
    {
      "id": "2",
      "name": "Thomas Müller",
      "email": "thomas@example.com",
      "rsvpStatus": "pending",
      "menuPreference": null,
      "accommodationNeeded": false
    }
  ]
}
```

#### Gast hinzufügen

```
POST /api/guests
```

Request-Body:
```json
{
  "name": "Julia Weber",
  "email": "julia@example.com",
  "phone": "+49123456789",
  "group": "friends",
  "side": "bride"
}
```

Response:
```json
{
  "id": "3",
  "name": "Julia Weber",
  "email": "julia@example.com",
  "phone": "+49123456789",
  "group": "friends",
  "side": "bride",
  "rsvpStatus": "pending",
  "menuPreference": null,
  "accommodationNeeded": false
}
```

### Tischplan-API

#### Tischplan abrufen

```
GET /api/table-plan
```

Response:
```json
{
  "tables": [
    {
      "id": "1",
      "name": "Tisch 1",
      "shape": "round",
      "capacity": 8,
      "position": { "x": 100, "y": 150 },
      "rotation": 0,
      "guests": [
        {
          "id": "1",
          "name": "Anna Schmidt",
          "seatNumber": 1
        },
        {
          "id": "2",
          "name": "Thomas Müller",
          "seatNumber": 2
        }
      ]
    }
  ]
}
```

#### Tisch hinzufügen

```
POST /api/table-plan/tables
```

Request-Body:
```json
{
  "name": "Tisch 2",
  "shape": "rectangular",
  "capacity": 6,
  "position": { "x": 300, "y": 150 },
  "rotation": 0
}
```

Response:
```json
{
  "id": "2",
  "name": "Tisch 2",
  "shape": "rectangular",
  "capacity": 6,
  "position": { "x": 300, "y": 150 },
  "rotation": 0,
  "guests": []
}
```

### Budget-API

#### Budget abrufen

```
GET /api/budget
```

Response:
```json
{
  "totalBudget": 15000,
  "totalSpent": 8500,
  "remaining": 6500,
  "categories": [
    {
      "id": "1",
      "name": "Location",
      "planned": 5000,
      "spent": 4800,
      "expenses": [
        {
          "id": "1",
          "description": "Anzahlung Hochzeitslocation",
          "amount": 2000,
          "date": "2025-01-15",
          "paid": true
        },
        {
          "id": "2",
          "description": "Restzahlung Hochzeitslocation",
          "amount": 2800,
          "date": "2025-02-28",
          "paid": true
        }
      ]
    }
  ]
}
```

#### Ausgabe hinzufügen

```
POST /api/budget/expenses
```

Request-Body:
```json
{
  "categoryId": "1",
  "description": "Dekoration für Location",
  "amount": 350,
  "date": "2025-03-10",
  "paid": true
}
```

Response:
```json
{
  "id": "3",
  "categoryId": "1",
  "description": "Dekoration für Location",
  "amount": 350,
  "date": "2025-03-10",
  "paid": true
}
```

### Checklisten-API

#### Checklisten abrufen

```
GET /api/checklists
```

Response:
```json
{
  "checklists": [
    {
      "id": "1",
      "name": "Planung",
      "phase": "planning",
      "progress": 75,
      "tasks": [
        {
          "id": "1",
          "title": "Location buchen",
          "description": "Hochzeitslocation für das Datum reservieren",
          "dueDate": "2024-12-31",
          "priority": "high",
          "completed": true
        },
        {
          "id": "2",
          "title": "Fotografen buchen",
          "description": "Fotografen für die Hochzeit engagieren",
          "dueDate": "2025-01-15",
          "priority": "medium",
          "completed": false
        }
      ]
    }
  ]
}
```

#### Aufgabe hinzufügen

```
POST /api/checklists/tasks
```

Request-Body:
```json
{
  "checklistId": "1",
  "title": "DJ buchen",
  "description": "DJ für die Hochzeitsfeier engagieren",
  "dueDate": "2025-01-31",
  "priority": "medium"
}
```

Response:
```json
{
  "id": "3",
  "checklistId": "1",
  "title": "DJ buchen",
  "description": "DJ für die Hochzeitsfeier engagieren",
  "dueDate": "2025-01-31",
  "priority": "medium",
  "completed": false
}
```

## No-Code-Anpassungsleitfaden

LemonVows bietet umfangreiche Möglichkeiten zur Anpassung ohne Programmierkenntnisse. Dieser Leitfaden erklärt, wie Sie verschiedene Aspekte der Anwendung anpassen können.

### Content-Editor verwenden

Der Content-Editor ist das Hauptwerkzeug für No-Code-Anpassungen. So verwenden Sie ihn:

1. Melden Sie sich als Administrator an
2. Navigieren Sie zu `/admin`
3. Klicken Sie auf "Content-Editor" in der Seitenleiste

#### Allgemeine Inhalte anpassen

Im Tab "Allgemein" können Sie:

1. Den Haupttitel der Plattform ändern
2. Den Untertitel anpassen
3. Allgemeine Beschreibungen bearbeiten

#### Feature-Beschreibungen anpassen

Im Tab "Features" können Sie für jede Hauptfunktion:

1. Den Titel ändern
2. Die Beschreibung anpassen
3. Highlights hinzufügen, bearbeiten oder löschen

#### Preispläne anpassen

Im Tab "Preise" können Sie:

1. Die Überschriften für den Preisbereich ändern
2. Für jeden Preisplan:
   - Titel ändern
   - Preis und Zeitraum anpassen
   - Call-to-Action-Text bearbeiten
   - Features hinzufügen, bearbeiten oder löschen

#### Testimonials verwalten

Im Tab "Testimonials" können Sie:

1. Die Überschrift für den Testimonial-Bereich ändern
2. Testimonials hinzufügen:
   - Klicken Sie auf "Testimonial hinzufügen"
   - Geben Sie Inhalt, Name und Ort ein
   - Klicken Sie auf "Speichern"
3. Bestehende Testimonials bearbeiten oder löschen

#### FAQ-Bereich anpassen

Im Tab "FAQ" können Sie:

1. Die Überschrift für den FAQ-Bereich ändern
2. Fragen und Antworten hinzufügen:
   - Klicken Sie auf "Frage hinzufügen"
   - Geben Sie Frage und Antwort ein
   - Klicken Sie auf "Speichern"
3. Bestehende Fragen und Antworten bearbeiten oder löschen

#### Call-to-Action-Bereich anpassen

Im Tab "CTA" können Sie:

1. Titel und Untertitel des Call-to-Action-Bereichs ändern
2. Die Texte für die Buttons anpassen

#### Footer-Bereich anpassen

Im Tab "Footer" können Sie:

1. Die Überschriften der Footer-Abschnitte ändern
2. Die Texte für die verschiedenen Links anpassen
3. Den Copyright-Text bearbeiten

### Design anpassen

#### Farbschema ändern

1. Navigieren Sie zu "Einstellungen" > "Design"
2. Wählen Sie ein vordefiniertes Farbschema oder erstellen Sie ein eigenes:
   - Primärfarbe
   - Sekundärfarbe
   - Akzentfarbe
   - Hintergrundfarbe
   - Textfarbe
3. Klicken Sie auf "Vorschau", um die Änderungen zu sehen
4. Klicken Sie auf "Speichern", um die Änderungen zu übernehmen

#### Schriftarten ändern

1. Navigieren Sie zu "Einstellungen" > "Design" > "Typografie"
2. Wählen Sie Schriftarten für:
   - Überschriften
   - Fließtext
   - Buttons
3. Passen Sie die Schriftgrößen an
4. Klicken Sie auf "Speichern"

#### Logo und Favicon ändern

1. Navigieren Sie zu "Einstellungen" > "Design" > "Branding"
2. Laden Sie ein neues Logo hoch:
   - Klicken Sie auf "Logo hochladen"
   - Wählen Sie eine Datei aus
   - Passen Sie die Größe an
3. Laden Sie ein neues Favicon hoch:
   - Klicken Sie auf "Favicon hochladen"
   - Wählen Sie eine Datei aus
4. Klicken Sie auf "Speichern"

### E-Mail-Vorlagen anpassen

1. Navigieren Sie zu "Einstellungen" > "E-Mails"
2. Wählen Sie eine Vorlage aus:
   - Einladung
   - RSVP-Bestätigung
   - Erinnerung
   - Dankeschön
3. Bearbeiten Sie den Betreff und den Inhalt
4. Verwenden Sie Platzhalter für dynamische Inhalte:
   - {{name}} für den Namen des Empfängers
   - {{date}} für das Hochzeitsdatum
   - {{location}} für den Hochzeitsort
5. Klicken Sie auf "Vorschau", um die E-Mail zu testen
6. Klicken Sie auf "Speichern"

## Fehlerbehebung

### Allgemeine Probleme

#### Die Anwendung lädt nicht

1. Überprüfen Sie Ihre Internetverbindung
2. Löschen Sie den Browser-Cache und die Cookies
3. Versuchen Sie, die Seite in einem anderen Browser zu öffnen
4. Wenn das Problem weiterhin besteht, kontaktieren Sie den Support

#### Anmeldeprobleme

1. Stellen Sie sicher, dass Sie die richtige E-Mail-Adresse und das richtige Passwort verwenden
2. Klicken Sie auf "Passwort vergessen", um Ihr Passwort zurückzusetzen
3. Überprüfen Sie Ihren Spam-Ordner nach E-Mails zur Passwortwiederherstellung
4. Wenn Sie sich nicht anmelden können, kontaktieren Sie den Administrator

### Entwicklungsprobleme

#### Die lokale Entwicklungsumgebung startet nicht

1. Stellen Sie sicher, dass Node.js und npm korrekt installiert sind
2. Überprüfen Sie, ob alle Abhängigkeiten installiert sind:
   ```bash
   npm install
   ```
3. Überprüfen Sie die `.env.local`-Datei auf korrekte Umgebungsvariablen
4. Prüfen Sie die Konsolenausgabe auf Fehlermeldungen

#### Build-Fehler

1. Überprüfen Sie die ESLint-Warnungen und -Fehler
2. Beheben Sie TypeScript-Typfehler
3. Stellen Sie sicher, dass alle Abhängigkeiten kompatibel sind
4. Wenn der Build weiterhin fehlschlägt, überprüfen Sie die Next.js-Dokumentation für bekannte Probleme

### Deployment-Probleme

#### Netlify-Deployment schlägt fehl

1. Überprüfen Sie die Build-Logs in der Netlify-Benutzeroberfläche
2. Stellen Sie sicher, dass die `netlify.toml`-Datei korrekt konfiguriert ist
3. Überprüfen Sie, ob die Umgebungsvariablen in den Netlify-Einstellungen konfiguriert sind
4. Wenn das Problem weiterhin besteht, konsultieren Sie die Netlify-Dokumentation oder den Support

#### API-Verbindungsprobleme

1. Überprüfen Sie, ob die Supabase-URL und der Anon-Key korrekt sind
2. Stellen Sie sicher, dass die Supabase-Datenbank online ist
3. Überprüfen Sie die CORS-Einstellungen in Supabase
4. Testen Sie die API-Endpunkte mit einem Tool wie Postman

### Support kontaktieren

Wenn Sie Hilfe benötigen oder auf Probleme stoßen, die Sie nicht selbst lösen können:

1. Senden Sie eine E-Mail an support@lemonvows.com
2. Beschreiben Sie das Problem detailliert
3. Fügen Sie Screenshots oder Fehlermeldungen bei
4. Geben Sie Informationen zu Ihrem Browser und Betriebssystem an

Das Support-Team wird sich so schnell wie möglich bei Ihnen melden.
