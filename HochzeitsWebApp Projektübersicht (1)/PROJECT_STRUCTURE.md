# LemonVows Projektstruktur Dokumentation

## Überblick
Diese Dokumentation beschreibt die empfohlene Projektstruktur für die LemonVows Hochzeitsplanungs-Webapp.

## Hauptverzeichnisse

### `.github/`
- Enthält GitHub Actions Workflows für CI/CD
- **Beispiel Workflows**:
  - `ci.yml`: Führt Tests bei jedem Push aus
  - `cd.yml`: Automatisches Deployment auf Vercel

### `public/`
- Statische Dateien die direkt serviert werden
- **Unterordner**:
  - `images/`: Optimierte Web-Bilder
  - `fonts/`: Webfonts im WOFF2-Format
  - `locales/`: Übersetzungsdateien (i18n)

### `src/`
Hauptentwicklungsverzeichnis mit folgender Struktur:

#### `app/` (Next.js App Router)
```
app/
├── (main)/          # Authentifizierter Bereich
│   ├── dashboard/   # Hauptdashboard
│   ├── planning/    # Planungstools
│   └── settings/    # Benutzereinstellungen
│
├── (marketing)/     # Öffentliche Seiten
│   ├── features/    # Feature-Präsentation
│   └── pricing/     # Preispläne
│
└── api/             # API-Endpunkte
    ├── auth/        # Authentifizierung
    └── webhooks/    # Externe Integrationen
```

#### `components/`
- **UI-Komponenten**:
  - `ui/`: Grundlegende Bausteine (Buttons, Inputs)
  - `sections/`: Komplexere Kompositionen
  - `shared/`: App-übergreifende Komponenten

#### `config/`
- `theme.ts`: Design Tokens (Farben, Abstände)
- `supabase.ts`: Supabase Client Konfiguration
- `routes.ts`: Zentrale Routendefinition

## Wichtige Dateien

| Datei | Zweck |
|-------|-------|
| `next.config.js` | Next.js Erweiterungen |
| `tailwind.config.js` | Tailwind CSS Anpassungen |
| `tsconfig.json` | TypeScript Einstellungen |
| `.env.template` | Umgebungsvariablen Vorlage |

## Entwicklungs-Workflow

1. **Feature Entwicklung**:
   ```bash
   git checkout -b feature/feature-name
   ```
2. **Komponenten erstellen**:
   - Neue Komponenten unter `src/components/feature-name/`
   - Storybook Stories für Dokumentation

3. **Testing**:
   ```bash
   npm run test # Unit Tests
   npm run e2e  # End-to-End Tests
   ```

## Best Practices

- **Komponenten**: Atomic Design Prinzipien
- **Styling**: Tailwind mit CSS Variablen
- **State Management**: Zustand nach oben halten
- **Datenabfragen**: Server Components bevorzugen

## Skalierungsplan

```mermaid
flowchart LR
    A[Monolith] --> B[Microfrontends]
    B --> C[Services]
    C --> D[Serverless]