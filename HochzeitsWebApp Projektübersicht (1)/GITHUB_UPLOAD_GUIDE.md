# Anleitung zum Hochladen auf GitHub

## Voraussetzungen
1. Git installiert: [git-scm.com/downloads](https://git-scm.com/downloads)
2. GitHub Account: [github.com/signup](https://github.com/signup)

## Ausführung des Skripts

### Methode 1: Git Bash (empfohlen)
1. Rechtsklick im Projektordner → "Git Bash here"
2. Ausführungsrecht geben:
```bash
chmod +x upload_to_github.sh
```
3. Skript starten:
```bash
./upload_to_github.sh
```

### Methode 2: Windows CMD
1. Terminal öffnen (Strg+ö in VSCode)
2. Befehle manuell eingeben:
```cmd
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/LemonHarbor/LemonVows.git
git branch -M main
git push -u origin main
git checkout -b dev
git push -u origin dev
```

## Troubleshooting
- **Authentifizierungsfehler**:
  ```bash
  git config --global credential.helper store
  ```
  Dann Skript erneut ausführen

- **Bereits existierendes Repository**:
  ```bash
  git remote remove origin
  ```
  Dann Skript erneut ausführen