# LemonVows Setup Skript - Best Practices

## Systemvoraussetzungen
- Node.js v18+
- npm v9+
- Git installiert

## 1. Projektinitialisierung

```bash
# Next.js App erstellen (TypeScript + ESLint)
npx create-next-app@latest lemonvows --typescript --eslint

# In Projektverzeichnis wechseln
cd lemonvows

# Git Repository initialisieren
git init
```

## 2. Abhängigkeiten installieren

```bash
# Hauptabhängigkeiten
npm install @supabase/supabase-js @radix-ui/react-dropdown-menu

# Dev-Dependencies
npm install -D tailwindcss postcss autoprefixer prettier

# Tailwind initialisieren
npx tailwindcss init -p
```

## 3. Konfigurationsdateien

### `next.config.js` anpassen:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['lh3.googleusercontent.com'], // Für Auth Provider
  },
}

module.exports = nextConfig
```

### `tailwind.config.js` anpassen:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFD700', // Gold als Basis
        secondary: '#FF69B4', // Pink
      },
    },
  },
  plugins: [],
}
```

## 4. Ordnerstruktur erstellen

```bash
# Grundstruktur
mkdir -p src/{app,components,config,lib,styles,types}
mkdir public/{images,fonts,locales}

# Beispielkomponenten
touch src/components/{ui/Button.tsx,sections/Hero.tsx}
```

## 5. Erste Commit

```bash
git add .
git commit -m "Initial project setup with Next.js + Tailwind + Supabase"
```

## 6. Supabase Einrichtung

1. Projekt in [Supabase Dashboard](https://app.supabase.com) erstellen
2. `.env.local` erstellen mit:
```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_KEY
```

## Automatisierung

### `package.json` Skripte:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "format": "prettier --write ."
}
```

## Verifizierung

```bash
npm run dev
```
Öffnen Sie http://localhost:3000 um die erfolgreiche Installation zu prüfen.