# Node.js Neuinstallation - Schritt-für-Schritt

## 1. Aktuelle Installation entfernen
1. Öffnen Sie "Systemsteuerung > Programme und Funktionen"
2. Suchen Sie nach "Node.js"
3. Klicken Sie auf "Deinstallieren"
4. Folgen Sie den Anweisungen

## 2. Installer herunterladen
1. Gehen Sie zu [nodejs.org](https://nodejs.org)
2. Klicken Sie auf **"LTS"** (Recommended)
3. Speichern Sie die .msi-Datei

## 3. Neuinstallation
1. Doppelklicken Sie auf die .msi-Datei
2. Wählen Sie **"Custom installation"**
3. Setzen Sie Häkchen bei:
   - ☑ Node.js runtime
   - ☑ npm package manager
   - ☑ Add to PATH (WICHTIG!)

4. Klicken Sie auf "Next" bis zur Installation

## 4. Verifizierung
1. Starten Sie Ihren Computer neu
2. Öffnen Sie ein **neues** Terminal
3. Führen Sie aus:
```powershell
node -v
npm -v
```
Erwartete Ausgabe:
```
v18.17.1
9.6.7
```

## Troubleshooting
- **Fehlermeldungen**: 
  - Prüfen Sie den PATH mit:
  ```powershell
  echo %PATH% | find "Node"
  ```
  - Falls nicht vorhanden, manuell hinzufügen:
    1. Systemumgebungsvariablen bearbeiten
    2. Unter "Path" hinzufügen:
    ```
    C:\Program Files\nodejs\
    ```

## Alternative Methode
Falls Probleme bestehen:
1. Windows Terminal als Administrator öffnen
2. Mit winget installieren:
```powershell
winget install OpenJS.NodeJS.LTS