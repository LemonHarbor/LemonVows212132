# Git-Push-Anleitung für LemonVows

Diese Anleitung erklärt, wie Sie Änderungen am LemonVows-Projekt mit Git verwalten und in ein Remote-Repository pushen können.

## Voraussetzungen

- Git ist auf Ihrem System installiert
- Sie haben Zugriff auf das GitHub-Repository
- Sie haben das Repository bereits geklont (siehe Setup-Anleitung)

## Grundlegende Git-Befehle

### Status Ihrer Änderungen überprüfen

Um zu sehen, welche Dateien Sie geändert haben:

```bash
git status
```

### Änderungen anzeigen

Um die genauen Änderungen in den Dateien zu sehen:

```bash
git diff
```

### Änderungen für einen Commit vorbereiten

Um alle geänderten Dateien für einen Commit vorzubereiten:

```bash
git add .
```

Oder um bestimmte Dateien hinzuzufügen:

```bash
git add pfad/zur/datei.js
```

### Änderungen committen

Um Ihre Änderungen mit einer Nachricht zu committen:

```bash
git commit -m "Beschreibung Ihrer Änderungen"
```

### Änderungen zum Remote-Repository pushen

Um Ihre Commits zum Remote-Repository zu pushen:

```bash
git push origin main
```

## Workflow für Beiträge zum Projekt

### 1. Repository aktualisieren

Bevor Sie mit der Arbeit beginnen, stellen Sie sicher, dass Ihr lokales Repository auf dem neuesten Stand ist:

```bash
git pull origin main
```

### 2. Einen neuen Branch erstellen

Erstellen Sie für jedes neue Feature oder jede Bugfix einen separaten Branch:

```bash
git checkout -b feature/name-des-features
```

oder

```bash
git checkout -b bugfix/name-des-bugfixes
```

### 3. Änderungen vornehmen

Nehmen Sie Ihre Änderungen am Code vor. Versuchen Sie, zusammenhängende Änderungen in separaten Commits zu gruppieren.

### 4. Regelmäßig committen

Committen Sie Ihre Änderungen regelmäßig mit aussagekräftigen Commit-Nachrichten:

```bash
git add .
git commit -m "Feature: Füge Sortierung zur Gästeliste hinzu"
```

### 5. Änderungen pushen

Pushen Sie Ihren Branch zum Remote-Repository:

```bash
git push origin feature/name-des-features
```

### 6. Pull Request erstellen

Gehen Sie zur GitHub-Repository-Seite und erstellen Sie einen Pull Request:

1. Klicken Sie auf "Pull Requests" > "New Pull Request"
2. Wählen Sie Ihren Branch aus
3. Füllen Sie die Beschreibung aus und erklären Sie Ihre Änderungen
4. Klicken Sie auf "Create Pull Request"

### 7. Code-Review und Merge

Nach dem Code-Review und eventuellen Anpassungen kann Ihr Pull Request in den Hauptbranch gemergt werden.

## Umgang mit Merge-Konflikten

Wenn Git meldet, dass es Konflikte gibt, müssen Sie diese manuell lösen:

1. Öffnen Sie die Dateien mit Konflikten (sie werden von Git markiert)
2. Suchen Sie nach den Konfliktmarkierungen (`<<<<<<<`, `=======`, `>>>>>>>`)
3. Bearbeiten Sie die Dateien, um die Konflikte zu lösen
4. Fügen Sie die gelösten Dateien hinzu:
   ```bash
   git add pfad/zur/gelösten/datei.js
   ```
5. Schließen Sie den Merge ab:
   ```bash
   git commit -m "Löse Merge-Konflikte"
   ```

## Verwendung des GitHub Personal Access Tokens

Wenn Sie zur Authentifizierung einen Personal Access Token verwenden müssen:

1. Speichern Sie Ihren Token sicher (nicht im Code oder in öffentlichen Repositories)
2. Verwenden Sie den Token bei der Authentifizierung:

```bash
git remote set-url origin https://USERNAME:TOKEN@github.com/LemonHarbor/LemonVows.git
```

Oder geben Sie den Token ein, wenn Sie nach Ihrem Passwort gefragt werden.

## Best Practices für Git

### Commit-Nachrichten

Schreiben Sie klare, aussagekräftige Commit-Nachrichten:

- Verwenden Sie den Imperativ ("Füge Feature hinzu" statt "Feature hinzugefügt")
- Beginnen Sie mit einem Präfix, das den Typ der Änderung angibt (Feature, Fix, Docs, etc.)
- Halten Sie die erste Zeile unter 50 Zeichen
- Fügen Sie bei Bedarf eine detailliertere Beschreibung nach einer Leerzeile hinzu

Beispiel:
```
Feature: Füge Filteroptionen zur Gästeliste hinzu

- Implementiere Filterung nach RSVP-Status
- Füge Suchfunktion für Namen hinzu
- Verbessere die Benutzeroberfläche mit farblichen Hervorhebungen
```

### Branching-Strategie

- `main`: Stabiler Produktionscode
- `develop`: Integrationsbranche für Features
- `feature/*`: Neue Features
- `bugfix/*`: Fehlerbehebungen
- `hotfix/*`: Dringende Fixes für die Produktion

### Regelmäßige Commits

Committen Sie regelmäßig, um:
- Ihre Arbeit zu sichern
- Die Nachvollziehbarkeit zu verbessern
- Merge-Konflikte zu reduzieren

### Ignorieren von Dateien

Stellen Sie sicher, dass sensible oder unnötige Dateien in `.gitignore` aufgeführt sind:

```
# Abhängigkeiten
/node_modules

# Build-Ausgaben
/.next
/out

# Umgebungsvariablen
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Debug-Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Betriebssystem-Dateien
.DS_Store
Thumbs.db
```

## Häufige Git-Befehle

### Branch-Verwaltung

```bash
# Alle Branches anzeigen
git branch

# Zu einem existierenden Branch wechseln
git checkout branch-name

# Branch löschen
git branch -d branch-name
```

### Änderungen verwalten

```bash
# Änderungen temporär speichern
git stash

# Gespeicherte Änderungen wiederherstellen
git stash pop

# Commit rückgängig machen (behält Änderungen)
git reset HEAD~1

# Letzten Commit ändern
git commit --amend
```

### Remote-Repository

```bash
# Remote-Repositories anzeigen
git remote -v

# Remote-Repository hinzufügen
git remote add origin https://github.com/LemonHarbor/LemonVows.git

# Änderungen von einem Remote-Branch holen ohne zu mergen
git fetch origin

# Änderungen holen und mergen
git pull origin main
```

## Hilfe bekommen

```bash
# Allgemeine Hilfe
git --help

# Hilfe zu einem bestimmten Befehl
git commit --help
```

## Weitere Ressourcen

- [Git-Dokumentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Pro Git Buch (kostenlos)](https://git-scm.com/book/en/v2)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
