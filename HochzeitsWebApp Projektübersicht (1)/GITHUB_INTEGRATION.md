# GitHub Integration für LemonVows

Diese Anleitung beschreibt, wie Sie das LemonVows-Projekt in GitHub integrieren und direkt von Vercel deployen können.

## Voraussetzungen

- GitHub-Konto
- Git auf Ihrem lokalen Computer installiert
- Vercel-Konto

## Schritt 1: GitHub-Repository erstellen

1. Melden Sie sich bei [GitHub](https://github.com) an
2. Klicken Sie auf "New" oder "+" und dann "New repository"
3. Geben Sie einen Namen für Ihr Repository ein (z.B. "lemonvows")
4. Wählen Sie "Private" aus, wenn Sie das Repository privat halten möchten
5. Klicken Sie auf "Create repository"

## Schritt 2: Git lokal einrichten

1. Öffnen Sie ein Terminal auf Ihrem Computer
2. Navigieren Sie zum LemonVows-Projektverzeichnis:
   ```bash
   cd /pfad/zu/lemonvows
   ```
3. Initialisieren Sie ein Git-Repository:
   ```bash
   git init
   ```

## Schritt 3: .gitignore-Datei erstellen

Erstellen Sie eine .gitignore-Datei, um sensible Daten und unnötige Dateien auszuschließen:

```
# Abhängigkeiten
node_modules/
.pnp
.pnp.js

# Umgebungsvariablen
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env.production

# Build-Dateien
dist/
build/
out/
.next/

# Cache
.cache/
.nuxt/
.vuepress/dist

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Betriebssystem-Dateien
.DS_Store
Thumbs.db

# Editor-Verzeichnisse und -Dateien
.idea/
.vscode/
*.swp
*.swo
```

## Schritt 4: Dateien zum Repository hinzufügen

```bash
git add .
git commit -m "Initiales Commit für LemonVows Hochzeitsplanungs-App"
```

## Schritt 5: Mit GitHub verbinden und pushen

```bash
git remote add origin https://github.com/ihr-username/lemonvows.git
git branch -M main
git push -u origin main
```

## Schritt 6: In Vercel importieren

1. Melden Sie sich bei [Vercel](https://vercel.com) an
2. Klicken Sie auf "Add New..." und dann "Project"
3. Wählen Sie "Import Git Repository" und verbinden Sie Ihr GitHub-Konto
4. Wählen Sie das lemonvows-Repository aus
5. Konfigurieren Sie die Projekteinstellungen:
   - Framework Preset: Vue.js
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Fügen Sie die Umgebungsvariablen hinzu:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_STRIPE_PUBLIC_KEY` (falls zutreffend)
7. Klicken Sie auf "Deploy"

## Schritt 7: Domain konfigurieren

1. Nach dem Deployment gehen Sie zu "Settings" > "Domains"
2. Fügen Sie Ihre Domain hinzu
3. Folgen Sie den Anweisungen zur DNS-Konfiguration

## Schritt 8: Automatische Deployments

Vercel richtet automatisch Deployments für jeden Push in Ihren main-Branch ein. Sie können auch Preview-Deployments für Pull Requests aktivieren:

1. Gehen Sie zu "Settings" > "Git"
2. Konfigurieren Sie die Deployment-Einstellungen nach Ihren Wünschen

## Schritt 9: Zusammenarbeit einrichten

1. Fügen Sie Teammitglieder zu Ihrem GitHub-Repository hinzu
2. Konfigurieren Sie Branch-Schutzregeln für den main-Branch
3. Richten Sie einen Pull-Request-Workflow ein

## Schritt 10: Kontinuierliche Integration

1. Richten Sie GitHub Actions für Tests ein
2. Konfigurieren Sie Vercel für Preview-Deployments
3. Implementieren Sie automatisierte Tests vor dem Deployment

## Fehlerbehebung

### Häufige Probleme

1. **Push wird abgelehnt**
   - Stellen Sie sicher, dass Sie Schreibrechte für das Repository haben
   - Versuchen Sie, zuerst zu pullen: `git pull origin main --rebase`

2. **Vercel-Deployment schlägt fehl**
   - Überprüfen Sie die Build-Logs in Vercel
   - Stellen Sie sicher, dass alle Abhängigkeiten korrekt installiert sind

3. **Umgebungsvariablen fehlen**
   - Überprüfen Sie, ob alle erforderlichen Umgebungsvariablen in Vercel konfiguriert sind

Bei weiteren Problemen wenden Sie sich bitte an den GitHub- oder Vercel-Support.
