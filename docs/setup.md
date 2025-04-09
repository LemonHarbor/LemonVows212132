# Setup-Anleitung für LemonVows

Diese Anleitung führt Sie durch die Einrichtung der LemonVows Hochzeitsplanungs-App auf Ihrem lokalen System.

## Voraussetzungen

Bevor Sie beginnen, stellen Sie sicher, dass folgende Software auf Ihrem System installiert ist:

- **Node.js** (Version 18 oder höher)
- **npm** (Version 8 oder höher)
- **Git** (für die Versionskontrolle)

## Schritt 1: Repository klonen

1. Öffnen Sie ein Terminal oder eine Kommandozeile
2. Navigieren Sie zu dem Verzeichnis, in dem Sie das Projekt speichern möchten
3. Führen Sie den folgenden Befehl aus:

```bash
git clone https://github.com/LemonHarbor/LemonVows.git
cd LemonVows
```

## Schritt 2: Abhängigkeiten installieren

Installieren Sie alle erforderlichen Abhängigkeiten mit npm:

```bash
npm install
```

Dieser Vorgang kann einige Minuten dauern, da alle benötigten Pakete heruntergeladen und installiert werden.

## Schritt 3: Supabase-Projekt erstellen

Die App verwendet Supabase als Backend-Dienst. Folgen Sie diesen Schritten, um ein Supabase-Projekt einzurichten:

1. Erstellen Sie ein kostenloses Konto auf [Supabase](https://supabase.com), falls Sie noch keines haben
2. Erstellen Sie ein neues Projekt:
   - Geben Sie einen Projektnamen ein (z.B. "LemonVows")
   - Setzen Sie ein sicheres Datenbankpasswort
   - Wählen Sie eine Region in Ihrer Nähe
   - Klicken Sie auf "Create new project"
3. Warten Sie, bis das Projekt erstellt wurde (dies kann einige Minuten dauern)
4. Sobald das Projekt erstellt ist, gehen Sie zu "Settings" > "API" in der Seitenleiste
5. Kopieren Sie die "Project URL" und den "anon public" API-Schlüssel - Sie werden diese später benötigen

## Schritt 4: Datenbank-Schema einrichten

1. Gehen Sie in Ihrem Supabase-Projekt zum Abschnitt "SQL Editor"
2. Klicken Sie auf "New query"
3. Kopieren Sie das SQL-Schema aus der Datei `supabase-schema.sql` im Projektverzeichnis in den Editor
4. Klicken Sie auf "Run" oder drücken Sie Strg+Enter, um das Schema zu erstellen

## Schritt 5: Supabase Storage einrichten

1. Gehen Sie zum Abschnitt "Storage" in Ihrem Supabase-Dashboard
2. Klicken Sie auf "Create new bucket"
3. Nennen Sie den Bucket "photos" und klicken Sie auf "Create bucket"
4. Wählen Sie den erstellten Bucket aus und gehen Sie zu "Policies"
5. Erstellen Sie folgende Richtlinien:
   - Eine Richtlinie, die es authentifizierten Benutzern erlaubt, Dateien hochzuladen
   - Eine Richtlinie, die es jedem erlaubt, Dateien anzusehen

## Schritt 6: Authentifizierung konfigurieren

1. Gehen Sie zum Abschnitt "Authentication" in Ihrem Supabase-Dashboard
2. Unter "Settings" > "URL Configuration":
   - Setzen Sie die Site-URL auf `http://localhost:3000`
   - Fügen Sie als Redirect-URL `http://localhost:3000/auth/callback` hinzu
   - Speichern Sie die Änderungen

## Schritt 7: Umgebungsvariablen konfigurieren

1. Erstellen Sie im Stammverzeichnis des Projekts eine Datei namens `.env.local`
2. Fügen Sie folgende Zeilen hinzu und ersetzen Sie die Platzhalter mit Ihren Supabase-Daten:

```
NEXT_PUBLIC_SUPABASE_URL=https://ihre-supabase-projekt-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ihr-supabase-anon-key
```

## Schritt 8: Entwicklungsserver starten

Starten Sie den Entwicklungsserver mit folgendem Befehl:

```bash
npm run dev
```

Die Anwendung sollte nun unter [http://localhost:3000](http://localhost:3000) verfügbar sein.

## Schritt 9: Erstellen Sie ein Benutzerkonto

1. Öffnen Sie die Anwendung in Ihrem Browser
2. Klicken Sie auf "Neues Konto erstellen"
3. Geben Sie Ihre E-Mail-Adresse und ein Passwort ein
4. Klicken Sie auf "Registrieren"
5. Überprüfen Sie Ihren E-Mail-Posteingang für den Bestätigungslink (in der Entwicklungsumgebung können Sie diesen Schritt überspringen, indem Sie direkt zu Supabase gehen und den Benutzer manuell bestätigen)

## Schritt 10: Anwendung erkunden

Nach der Anmeldung können Sie die verschiedenen Features der Anwendung erkunden:

1. **Gästemanagement**: Verwalten Sie Ihre Gästeliste und RSVP-Status
2. **Event-Planung**: Erstellen und verwalten Sie Hochzeitsereignisse
3. **Foto-Sharing**: Laden Sie Fotos hoch und organisieren Sie Ihre Galerie
4. **Dienstleister**: Verwalten Sie Ihre Hochzeitsdienstleister
5. **Budget**: Verfolgen Sie Ihre Hochzeitsausgaben
6. **Einladungen**: Erstellen Sie digitale Einladungen
7. **Registry**: Verwalten Sie Links zu Ihren Geschenk-Registries

## Fehlerbehebung

### Problem: Verbindung zu Supabase kann nicht hergestellt werden

- Überprüfen Sie, ob die Umgebungsvariablen in `.env.local` korrekt sind
- Stellen Sie sicher, dass Ihr Supabase-Projekt aktiv ist
- Überprüfen Sie Ihre Internetverbindung

### Problem: Authentifizierung funktioniert nicht

- Stellen Sie sicher, dass die Site-URL und Redirect-URLs in den Supabase-Einstellungen korrekt sind
- Überprüfen Sie, ob die E-Mail-Bestätigung erfolgreich war
- Löschen Sie Cookies und lokalen Speicher im Browser und versuchen Sie es erneut

### Problem: Fehler beim Starten des Entwicklungsservers

- Stellen Sie sicher, dass alle Abhängigkeiten korrekt installiert sind (`npm install`)
- Überprüfen Sie, ob Node.js und npm auf dem neuesten Stand sind
- Löschen Sie den `.next`-Ordner und starten Sie den Server neu

## Nächste Schritte

Nachdem Sie die Anwendung lokal eingerichtet haben, können Sie:

- Die Anwendung anpassen und erweitern
- Die Anwendung für die Produktion bauen (`npm run build`)
- Die Anwendung auf einem Hosting-Dienst wie Vercel oder Netlify deployen

Weitere Informationen finden Sie in der Deployment-Dokumentation.
