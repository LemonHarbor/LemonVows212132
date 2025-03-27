# Vercel Deployment-Anleitung für LemonVows

Diese Anleitung führt dich durch den Prozess, deine LemonVows Hochzeitsplanungs-Webapp auf Vercel zu deployen.

## Voraussetzungen
- Ein GitHub-Konto mit Zugriff auf das LemonVows-Repository
- Ein Vercel-Konto (kostenlos erhältlich unter [vercel.com](https://vercel.com))
- Ein eingerichtetes Supabase-Projekt (siehe Supabase-Einrichtungsanleitung)

## Schritt 1: Vercel-Konto einrichten
1. Gehe zu [vercel.com](https://vercel.com) und erstelle ein Konto oder melde dich an
2. Verbinde dein GitHub-Konto mit Vercel:
   - Klicke auf dein Profilbild > Settings > Git
   - Wähle "Connect with GitHub" und folge den Anweisungen

## Schritt 2: Projekt importieren
1. Klicke im Vercel-Dashboard auf "Add New..." > "Project"
2. Wähle unter "Import Git Repository" dein LemonVows-Repository aus
3. Wenn das Repository nicht angezeigt wird, klicke auf "Import Third-Party Git Repository" und gib die URL ein

## Schritt 3: Projekt konfigurieren
1. Wähle als Framework-Preset "Vue.js" aus
2. Konfiguriere die Build-Einstellungen:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Füge die folgenden Umgebungsvariablen hinzu:
   - `VITE_SUPABASE_URL`: Deine Supabase-Projekt-URL
   - `VITE_SUPABASE_ANON_KEY`: Dein Supabase anon key
   - `VITE_STRIPE_PUBLIC_KEY`: Dein Stripe Public Key (falls vorhanden)
   - `STRIPE_SECRET_KEY`: Dein Stripe Secret Key (falls vorhanden)
4. Wähle unter "Environment" die Option "Production"

## Schritt 4: Deployment starten
1. Klicke auf "Deploy"
2. Vercel wird nun dein Projekt bauen und deployen
3. Nach erfolgreichem Deployment erhältst du eine URL (z.B. lemonvows.vercel.app)

## Schritt 5: Domain konfigurieren (optional)
1. Gehe zu deinem Projekt-Dashboard
2. Klicke auf "Settings" > "Domains"
3. Gib deine benutzerdefinierte Domain ein (z.B. lemonvows.com)
4. Folge den Anweisungen zur DNS-Konfiguration

## Schritt 6: Automatische Deployments
Vercel richtet automatisch Deployments für jeden Push in deinen main-Branch ein. Wenn du Änderungen an deinem Code vornimmst und sie nach GitHub pushst, wird Vercel automatisch ein neues Deployment erstellen.

## Schritt 7: Umgebungsvariablen überprüfen
1. Gehe zu "Settings" > "Environment Variables"
2. Stelle sicher, dass alle benötigten Umgebungsvariablen korrekt eingerichtet sind
3. Füge bei Bedarf weitere Umgebungsvariablen hinzu

## Schritt 8: Deployment testen
1. Besuche die bereitgestellte URL
2. Teste alle Funktionen der Anwendung
3. Überprüfe die Responsivität auf verschiedenen Geräten

## Fehlerbehebung
- **Build-Fehler**: Überprüfe die Build-Logs unter "Deployments"
- **API-Fehler**: Stelle sicher, dass die Supabase-Umgebungsvariablen korrekt sind
- **CORS-Fehler**: Füge deine Vercel-Domain zu den erlaubten Ursprüngen in Supabase hinzu

## Nächste Schritte
- Richte Analytics ein, um die Nutzung deiner Anwendung zu verfolgen
- Konfiguriere Benachrichtigungen für Fehler und Ausfälle
- Plane regelmäßige Updates und Wartungsfenster

Bei Fragen oder Problemen konsultiere die [Vercel-Dokumentation](https://vercel.com/docs) oder kontaktiere den Support.
