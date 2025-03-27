# Node.js Installationsanleitung für Windows

## Schritt 1: Download
1. Öffnen Sie [nodejs.org](https://nodejs.org) im Browser
2. Klicken Sie auf die **LTS Version** (empfohlen für die meisten Nutzer)
   ![Download Button](https://nodejs.org/static/images/download-links.png)

## Schritt 2: Installation
1. Doppelklicken Sie auf die heruntergeladene `.msi` Datei
2. Folgen Sie dem Installationsassistenten:
   - Akzeptieren Sie die Lizenzvereinbarung
   - Belassen Sie das Installationsverzeichnis (Standard)
   - Wählen Sie **"Add to PATH"** aus (wichtig!)
   - Installieren Sie zusätzliche Tools (optional)

## Schritt 3: Verifizierung
1. Öffnen Sie ein **neues** Terminal (CMD oder PowerShell)
2. Führen Sie folgende Befehle aus:

```powershell
node -v
# Sollte z.B. v18.17.1 anzeigen

npm -v
# Sollte z.B. 9.6.7 anzeigen
```

## Schritt 4: Projektfortsetzung
Nach erfolgreicher Installation:
1. Zurück zum Projektverzeichnis navigieren:
```powershell
cd "c:/Users/dforster/Downloads/HochzeitsWebApp Projektübersicht (1)"
```
2. Das Setup-Skript erneut ausführen:
```powershell
npx create-next-app@latest lemonvows --typescript --eslint
```

## Troubleshooting
- **Fehlermeldungen**: Schließen Sie alle Terminals und öffnen Sie sie neu
- **PATH Probleme**: Starten Sie den PC nach der Installation neu
- **Version prüfen**: `where node` zeigt den Installationspfad

## Alternative Installationsmethoden
1. **Windows Package Manager** (falls installiert):
```powershell
winget install OpenJS.NodeJS.LTS
```
2. **Chocolatey** (für fortgeschrittene Nutzer):
```powershell
choco install nodejs-lts