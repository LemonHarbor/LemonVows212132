# LemonVows Netlify Deployment Guide

Diese Anleitung führt Sie durch den Prozess der Bereitstellung der LemonVows Hochzeitsplanungs-App auf Netlify. Netlify ist eine moderne Hosting-Plattform, die sich perfekt für React-Anwendungen wie LemonVows eignet und automatische Deployments direkt aus dem GitHub-Repository ermöglicht.

## Voraussetzungen

Bevor Sie beginnen, stellen Sie sicher, dass Sie Folgendes haben:

1. Ein [GitHub-Konto](https://github.com/) mit Zugriff auf das LemonVows-Repository
2. Ein [Netlify-Konto](https://www.netlify.com/) (kostenlos erhältlich)
3. Die Supabase-Umgebungsvariablen:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Schritt 1: Netlify-Konto einrichten

1. Besuchen Sie [netlify.com](https://www.netlify.com/) und melden Sie sich an oder erstellen Sie ein neues Konto
2. Nach der Anmeldung gelangen Sie zum Netlify-Dashboard

## Schritt 2: Neues Projekt erstellen

1. Klicken Sie im Netlify-Dashboard auf die Schaltfläche "Add new site" oder "New site from Git"
2. Wählen Sie "GitHub" als Git-Provider aus
3. Autorisieren Sie Netlify, auf Ihre GitHub-Repositories zuzugreifen
4. Suchen und wählen Sie das "LemonHarbor/LemonVows"-Repository aus

## Schritt 3: Deployment-Einstellungen konfigurieren

Konfigurieren Sie die folgenden Einstellungen für Ihr Deployment:

1. **Branch to deploy**: `master` (oder `main`, je nach Ihrer Repository-Konfiguration)
2. **Build command**: `npm run build`
3. **Publish directory**: `.next`
4. **Advanced build settings**: Klicken Sie auf "Show advanced" und fügen Sie die folgenden Umgebungsvariablen hinzu:
   - `NEXT_PUBLIC_SUPABASE_URL`: Ihre Supabase-URL (z.B. `https://jodqliylhmwgpurfzxm.supabase.co`)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Ihr Supabase Anonymous Key

## Schritt 4: Deployment starten

1. Klicken Sie auf die Schaltfläche "Deploy site"
2. Netlify beginnt nun mit dem Build- und Deployment-Prozess
3. Sie können den Fortschritt in der Deployment-Übersicht verfolgen

## Schritt 5: Domain-Einstellungen anpassen

Nach erfolgreichem Deployment können Sie die Domain-Einstellungen anpassen:

1. Netlify weist automatisch eine zufällige Subdomain zu (z.B. `random-name-123456.netlify.app`)
2. Um die Domain anzupassen:
   - Gehen Sie zu "Site settings" > "Domain management"
   - Klicken Sie auf "Custom domains" > "Add custom domain"
   - Geben Sie Ihre gewünschte Domain ein (z.B. `lemonvows.com`)
   - Folgen Sie den Anweisungen zur DNS-Konfiguration

## Schritt 6: Kontinuierliche Bereitstellung einrichten

Netlify richtet automatisch eine kontinuierliche Bereitstellung ein:

1. Jedes Mal, wenn Sie Änderungen in den `master`-Branch pushen, wird ein neues Deployment ausgelöst
2. Sie können die Deployment-Einstellungen unter "Site settings" > "Build & deploy" anpassen
3. Hier können Sie auch Webhook-Trigger, Build-Hooks und andere erweiterte Funktionen konfigurieren

## Schritt 7: Umgebungsvariablen verwalten

Für verschiedene Umgebungen (Entwicklung, Staging, Produktion) können Sie unterschiedliche Umgebungsvariablen konfigurieren:

1. Gehen Sie zu "Site settings" > "Build & deploy" > "Environment"
2. Hier können Sie Umgebungsvariablen hinzufügen, bearbeiten oder löschen
3. Für die Produktion sollten Sie sicherstellen, dass die korrekten Supabase-Produktionsschlüssel verwendet werden

## Schritt 8: Deployment-Benachrichtigungen einrichten

Um über den Status Ihrer Deployments informiert zu werden:

1. Gehen Sie zu "Site settings" > "Build & deploy" > "Deploy notifications"
2. Klicken Sie auf "Add notification"
3. Wählen Sie den Benachrichtigungstyp (E-Mail, Slack, etc.) und konfigurieren Sie die Details

## Schritt 9: Deployment testen

Nach dem Deployment sollten Sie die Website gründlich testen:

1. Überprüfen Sie, ob alle Seiten korrekt geladen werden
2. Testen Sie die Kernfunktionen (Tischplaner, Gästeverwaltung, etc.)
3. Überprüfen Sie die Responsive-Darstellung auf verschiedenen Geräten
4. Testen Sie die Mehrsprachigkeitsfunktion

## Schritt 10: Fehlersuche bei Deployment-Problemen

Wenn Probleme beim Deployment auftreten:

1. Überprüfen Sie die Build-Logs unter "Deploys" > [Deployment-ID] > "Deploy log"
2. Häufige Probleme:
   - Fehlende Umgebungsvariablen
   - Build-Fehler aufgrund von TypeScript-Problemen
   - Fehler bei der Supabase-Verbindung

## Schritt 11: Optimierung für Suchmaschinen

Nach dem Deployment sollten Sie die folgenden SEO-Optimierungen vornehmen:

1. Überprüfen Sie die Meta-Tags auf allen Seiten
2. Stellen Sie sicher, dass die `robots.txt`-Datei korrekt konfiguriert ist
3. Erstellen Sie eine Sitemap und reichen Sie diese bei Google Search Console ein
4. Konfigurieren Sie die Social-Media-Meta-Tags für bessere Teilbarkeit

## Schritt 12: Leistungsüberwachung

Netlify bietet integrierte Leistungsüberwachung:

1. Gehen Sie zu "Analytics" in Ihrem Netlify-Dashboard
2. Hier können Sie Seitenaufrufe, Bandbreitennutzung und andere Metriken überwachen
3. Für erweiterte Analysen können Sie Google Analytics oder andere Tracking-Tools integrieren

## Fazit

Ihre LemonVows-Anwendung ist nun erfolgreich auf Netlify bereitgestellt und für Benutzer zugänglich. Die kontinuierliche Bereitstellung sorgt dafür, dass alle zukünftigen Änderungen automatisch bereitgestellt werden, sobald sie in den Master-Branch gepusht werden.

Bei Fragen oder Problemen können Sie die [Netlify-Dokumentation](https://docs.netlify.com/) konsultieren oder das Netlify-Support-Team kontaktieren.

---

## Anhang: Nützliche Netlify-Funktionen

### A. Split Testing

Netlify ermöglicht A/B-Tests für verschiedene Versionen Ihrer Website:

1. Gehen Sie zu "Site settings" > "Split testing"
2. Erstellen Sie einen neuen Split-Test zwischen verschiedenen Branches
3. Definieren Sie die Verkehrsverteilung zwischen den Varianten

### B. Formulare

Netlify Forms ermöglicht die einfache Verarbeitung von Formularübermittlungen:

1. Fügen Sie das `netlify`-Attribut zu Ihrem HTML-Formular hinzu
2. Netlify erkennt und verarbeitet Formularübermittlungen automatisch
3. Sie können Benachrichtigungen für neue Übermittlungen einrichten

### C. Funktionen

Mit Netlify Functions können Sie serverlose Funktionen erstellen:

1. Erstellen Sie einen `functions`-Ordner in Ihrem Repository
2. Implementieren Sie JavaScript- oder TypeScript-Funktionen
3. Diese werden automatisch als API-Endpunkte bereitgestellt

### D. Große Medienoptimierung

Für die Optimierung von Bildern und anderen Medien:

1. Aktivieren Sie "Large Media" in den Netlify-Einstellungen
2. Verwenden Sie Git LFS für große Dateien
3. Netlify optimiert Bilder automatisch für verschiedene Geräte und Bildschirmgrößen
