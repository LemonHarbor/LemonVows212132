# Deployment-Anleitung für LemonVows

Diese Anleitung beschreibt, wie die LemonVows Hochzeitsplanungs-WebApp auf einem Produktionsserver bereitgestellt wird.

## Voraussetzungen

- Ein Supabase-Konto und -Projekt
- Ein Stripe-Konto mit konfigurierten Produkten und Preisen
- Ein GitHub-Konto
- Ein Vercel-Konto (für das Hosting)

## Schritt 1: Umgebungsvariablen einrichten

Stelle sicher, dass die folgenden Umgebungsvariablen in deiner Produktionsumgebung konfiguriert sind:

```
NEXT_PUBLIC_SUPABASE_URL=deine-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=dein-supabase-anon-key
STRIPE_SECRET_KEY=dein-stripe-secret-key
STRIPE_WEBHOOK_SECRET=dein-stripe-webhook-secret
```

## Schritt 2: Deployment auf Vercel

1. Verbinde dein GitHub-Repository mit Vercel
2. Konfiguriere die Umgebungsvariablen in den Projekteinstellungen
3. Wähle den `main`-Branch für das Deployment aus
4. Klicke auf "Deploy"

## Schritt 3: Domain-Konfiguration

1. Füge die Domain `lemonvows.lemonharbor.com` in den Vercel-Projekteinstellungen hinzu
2. Konfiguriere die DNS-Einstellungen deines Domainanbieters entsprechend den Anweisungen von Vercel
3. Warte auf die DNS-Propagation und überprüfe die Verbindung

## Schritt 4: Stripe-Webhook einrichten

1. Erstelle einen Webhook in deinem Stripe-Dashboard
2. Setze die Webhook-URL auf `https://lemonvows.lemonharbor.com/api/webhooks/stripe`
3. Wähle die Ereignisse `checkout.session.completed`, `customer.subscription.updated` und `customer.subscription.deleted` aus
4. Kopiere das Webhook-Secret und aktualisiere die Umgebungsvariable `STRIPE_WEBHOOK_SECRET`

## Schritt 5: Supabase-Konfiguration überprüfen

1. Stelle sicher, dass alle Tabellen gemäß dem Schema in `src/db/schema.sql` erstellt wurden
2. Überprüfe die Authentifizierungseinstellungen
3. Konfiguriere die Speicherregeln für Dateien und Bilder

## Schritt 6: Erste Benutzer und Testdaten

1. Erstelle einen Admin-Benutzer über die Supabase-Authentifizierung
2. Füge den Benutzer zur `admins`-Tabelle hinzu
3. Erstelle Testdaten für Demonstrationszwecke (optional)

## Schritt 7: Überwachung und Wartung

1. Richte Vercel-Analytics ein, um die Leistung der Anwendung zu überwachen
2. Konfiguriere Benachrichtigungen für Fehler und Ausfälle
3. Plane regelmäßige Backups der Supabase-Datenbank

## Fehlerbehebung

### Problem: Webhook-Fehler
- Überprüfe das Webhook-Secret
- Stelle sicher, dass die Webhook-URL korrekt ist
- Überprüfe die Firewall-Einstellungen

### Problem: Authentifizierungsfehler
- Überprüfe die Supabase-Anon-Keys
- Stelle sicher, dass die Authentifizierungseinstellungen korrekt sind
- Überprüfe die Berechtigungen in der Datenbank

### Problem: Zahlungsfehler
- Überprüfe die Stripe-API-Keys
- Stelle sicher, dass die Produkte und Preise korrekt konfiguriert sind
- Überprüfe die Webhook-Ereignisse

## Kontakt

Bei Problemen oder Fragen wende dich an [info@lemonharbor.com](mailto:info@lemonharbor.com).
