#!/bin/bash

# Anleitung: 
# 1. Rechtsklick auf die Datei → Git Bash here
# 2. Ausführen mit: ./upload_to_github.sh

echo "Initialisiere Git-Repository..."
git init

echo "Füge alle Dateien hinzu..."
git add .

echo "Erstelle Initial-Commit..."
git commit -m "Initial commit with complete LemonVows project structure"

echo "Verknüpfe mit GitHub..."
git remote add origin https://github.com/LemonHarbor/LemonVows.git

echo "Upload zum Hauptbranch..."
git branch -M main
git push -u origin main

echo "Erstelle Entwicklungsbranch..."
git checkout -b dev
git push -u origin dev

echo "Fertig! Prüfen Sie: https://github.com/LemonHarbor/LemonVows"