# Node.js PATH Problem Lösung

## 1. Node.js Installationspfad finden
1. Öffnen Sie den Datei-Explorer
2. Navigieren Sie zu: `C:\Program Files\`
3. Suchen Sie den Ordner `nodejs`
4. Notieren Sie den vollständigen Pfad (z.B. `C:\Program Files\nodejs\`)

## 2. Systemumgebungsvariablen bearbeiten
1. Windows-Taste + S drücken
2. "Umgebungsvariablen" eingeben
3. "Umgebungsvariablen bearbeiten" auswählen

## 3. PATH-Variable anpassen
1. Unter "Systemvariablen" nach "Path" suchen
2. Auf "Bearbeiten..." klicken
3. "Neu" auswählen
4. Den Node.js-Pfad eintragen (z.B. `C:\Program Files\nodejs\`)
5. Alle Dialoge mit OK bestätigen

## 4. Überprüfung
1. Ein **neues** Terminal öffnen
2. Folgende Befehle ausführen:
```powershell
where node
node -v
npm -v
```

## Alternative Lösung
Falls Probleme bestehen:
1. Node.js deinstallieren
2. Neuinstallieren mit **Custom Installation**
3. Explizit **"Add to PATH"** auswählen
4. **"Automatically install necessary tools"** aktivieren

## Screenshot-Hilfe
![PATH-Einstellung](https://i.imgur.com/J6xw5Nl.png)