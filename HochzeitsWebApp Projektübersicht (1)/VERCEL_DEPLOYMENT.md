# LemonVows Deployment to Vercel

Diese Anleitung beschreibt, wie Sie die LemonVows Hochzeitsplanungs-Webapp auf Vercel bereitstellen, um eine dauerhafte Online-Präsenz zu gewährleisten.

## Voraussetzungen

- Ein Vercel-Konto (kostenlos erhältlich unter [vercel.com](https://vercel.com))
- Ein Supabase-Konto (kostenlos erhältlich unter [supabase.com](https://supabase.com))
- Git installiert auf Ihrem Computer
- Node.js und npm installiert auf Ihrem Computer

## Schritt 1: Repository vorbereiten

1. Stellen Sie sicher, dass Ihr LemonVows-Projekt in einem Git-Repository gespeichert ist
2. Überprüfen Sie, ob alle Dateien korrekt eingecheckt sind:
   ```bash
   git status
   git add .
   git commit -m "Bereit für Deployment"
   ```

## Schritt 2: Vercel CLI installieren

1. Installieren Sie die Vercel Command Line Interface (CLI):
   ```bash
   npm install -g vercel
   ```

2. Melden Sie sich bei Vercel an:
   ```bash
   vercel login
   ```

## Schritt 3: Umgebungsvariablen konfigurieren

1. Erstellen Sie eine `.env.production`-Datei im Hauptverzeichnis mit Ihren Supabase-Anmeldedaten:
   ```
   VITE_SUPABASE_URL=https://ihre-projekt-id.supabase.co
   VITE_SUPABASE_ANON_KEY=ihr-öffentlicher-api-schlüssel
   VITE_STRIPE_PUBLIC_KEY=ihr-stripe-public-key
   ```

2. Fügen Sie diese Datei zu `.gitignore` hinzu, um sensible Daten zu schützen

## Schritt 4: Deployment-Skript ausführen

1. Machen Sie das Deployment-Skript ausführbar:
   ```bash
   chmod +x deploy.sh
   ```

2. Führen Sie das Deployment-Skript aus:
   ```bash
   ./deploy.sh
   ```

3. Folgen Sie den Anweisungen im Terminal

## Schritt 5: Benutzerdefinierte Domain konfigurieren (optional)

1. Erwerben Sie eine Domain bei einem Domain-Registrar Ihrer Wahl
2. Konfigurieren Sie die Domain in Vercel:
   ```bash
   vercel domains add ihre-domain.de
   ```
3. Folgen Sie den Anweisungen zur DNS-Konfiguration

## Schritt 6: DSGVO-Konformität sicherstellen

1. Stellen Sie sicher, dass die EU-Region in `vercel.config.js` konfiguriert ist:
   ```javascript
   regions: ['fra1']
   ```

2. Überprüfen Sie, ob alle erforderlichen Datenschutzdokumente vorhanden sind:
   - Datenschutzerklärung
   - Impressum
   - Cookie-Banner
   - Einwilligungsmanagement

## Schritt 7: Zahlungsabwicklung einrichten

1. Konfigurieren Sie Stripe oder LemonSqueezy für die Zahlungsabwicklung
2. Testen Sie den Zahlungsvorgang im Testmodus
3. Wechseln Sie zum Live-Modus, wenn alles funktioniert

## Schritt 8: Überwachung und Wartung einrichten

1. Richten Sie Sentry für die Fehlerüberwachung ein:
   ```bash
   vercel integrations add sentry
   ```

2. Konfigurieren Sie automatische Backups für Ihre Supabase-Datenbank
3. Planen Sie regelmäßige Wartungsfenster

## Schritt 9: Testen der Live-Website

1. Testen Sie alle Funktionen auf der Live-Website
2. Überprüfen Sie die Responsivität auf verschiedenen Geräten
3. Führen Sie Leistungstests durch

## Schritt 10: Launch und Promotion

1. Teilen Sie die URL mit potenziellen Kunden
2. Bewerben Sie die Plattform in relevanten Hochzeitsportalen
3. Sammeln Sie Feedback und verbessern Sie die Plattform kontinuierlich

## Fehlerbehebung

### Häufige Probleme

1. **Deployment schlägt fehl**
   - Überprüfen Sie die Logs mit `vercel logs`
   - Stellen Sie sicher, dass alle Abhängigkeiten korrekt installiert sind

2. **Supabase-Verbindungsprobleme**
   - Überprüfen Sie die Umgebungsvariablen
   - Stellen Sie sicher, dass die Supabase-Datenbank korrekt konfiguriert ist

3. **CORS-Fehler**
   - Konfigurieren Sie die CORS-Einstellungen in Supabase
   - Überprüfen Sie die API-Endpunkte

Bei weiteren Problemen wenden Sie sich bitte an den Support oder erstellen Sie ein Issue im GitHub-Repository.

---

Herzlichen Glückwunsch! Ihre LemonVows Hochzeitsplanungs-Webapp ist jetzt dauerhaft online verfügbar und bereit für Ihre Kunden.
