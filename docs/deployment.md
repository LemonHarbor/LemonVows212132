# Deployment-Dokumentation für LemonVows

Diese Dokumentation beschreibt die Schritte zum Deployment der LemonVows Hochzeitsplanungs-App.

## Voraussetzungen

- Node.js (Version 18 oder höher)
- npm (Version 8 oder höher)
- Ein Supabase-Konto (kostenlos verfügbar unter [supabase.com](https://supabase.com))
- Git (für die Versionskontrolle)

## Lokale Entwicklungsumgebung

### 1. Repository klonen

```bash
git clone https://github.com/IhrUsername/LemonVows.git
cd LemonVows
```

### 2. Abhängigkeiten installieren

```bash
npm install
```

### 3. Umgebungsvariablen konfigurieren

Erstellen Sie eine Datei `.env.local` im Stammverzeichnis des Projekts mit folgenden Variablen:

```
NEXT_PUBLIC_SUPABASE_URL=https://ihre-supabase-projekt-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ihr-supabase-anon-key
```

Diese Werte erhalten Sie aus Ihrem Supabase-Projekt-Dashboard.

### 4. Entwicklungsserver starten

```bash
npm run dev
```

Die Anwendung ist dann unter [http://localhost:3000](http://localhost:3000) verfügbar.

## Supabase-Einrichtung

### 1. Supabase-Projekt erstellen

1. Melden Sie sich bei [Supabase](https://supabase.com) an
2. Erstellen Sie ein neues Projekt
3. Notieren Sie sich die Projekt-URL und den anonymen Schlüssel für die `.env.local`-Datei

### 2. Datenbank-Schema einrichten

Führen Sie das folgende SQL-Skript in der SQL-Editor-Sektion Ihres Supabase-Projekts aus:

```sql
-- Benutzer-Profil-Tabelle
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  display_name TEXT,
  wedding_date DATE
);

-- Gäste-Tabelle
CREATE TABLE guests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  rsvp_status TEXT DEFAULT 'pending' CHECK (rsvp_status IN ('confirmed', 'declined', 'pending')),
  dietary_restrictions TEXT,
  plus_one BOOLEAN DEFAULT FALSE,
  notes TEXT
);

-- Events-Tabelle
CREATE TABLE events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Fotos-Tabelle
CREATE TABLE photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  storage_path TEXT NOT NULL,
  title TEXT,
  description TEXT,
  is_featured BOOLEAN DEFAULT FALSE
);

-- Dienstleister-Tabelle
CREATE TABLE vendors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  price DECIMAL(10, 2),
  is_booked BOOLEAN DEFAULT FALSE,
  notes TEXT
);

-- Budget-Tabelle
CREATE TABLE budget_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,
  estimated_cost DECIMAL(10, 2) NOT NULL,
  actual_cost DECIMAL(10, 2),
  paid BOOLEAN DEFAULT FALSE,
  notes TEXT
);

-- Einladungen-Tabelle
CREATE TABLE invitations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  theme TEXT DEFAULT 'classic' NOT NULL,
  is_published BOOLEAN DEFAULT FALSE,
  custom_url TEXT UNIQUE
);

-- Registry-Tabelle
CREATE TABLE registries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  logo_url TEXT
);

-- RLS-Richtlinien (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE registries ENABLE ROW LEVEL SECURITY;

-- Richtlinien für Benutzer, um nur ihre eigenen Daten zu sehen/bearbeiten
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own guests" ON guests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own guests" ON guests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own guests" ON guests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own guests" ON guests FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own events" ON events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own events" ON events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own events" ON events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own events" ON events FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own photos" ON photos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own photos" ON photos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own photos" ON photos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own photos" ON photos FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own vendors" ON vendors FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own vendors" ON vendors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own vendors" ON vendors FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own vendors" ON vendors FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own budget items" ON budget_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own budget items" ON budget_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own budget items" ON budget_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own budget items" ON budget_items FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own invitations" ON invitations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own invitations" ON invitations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own invitations" ON invitations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own invitations" ON invitations FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Public can view published invitations" ON invitations FOR SELECT USING (is_published = true);

CREATE POLICY "Users can view own registries" ON registries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own registries" ON registries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own registries" ON registries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own registries" ON registries FOR DELETE USING (auth.uid() = user_id);

-- Trigger für updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_modtime
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_guests_modtime
BEFORE UPDATE ON guests
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_events_modtime
BEFORE UPDATE ON events
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_photos_modtime
BEFORE UPDATE ON photos
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_vendors_modtime
BEFORE UPDATE ON vendors
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_budget_items_modtime
BEFORE UPDATE ON budget_items
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_invitations_modtime
BEFORE UPDATE ON invitations
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_registries_modtime
BEFORE UPDATE ON registries
FOR EACH ROW EXECUTE FUNCTION update_modified_column();
```

### 3. Supabase Storage einrichten

1. Gehen Sie zum Abschnitt "Storage" in Ihrem Supabase-Dashboard
2. Erstellen Sie einen neuen Bucket namens "photos"
3. Konfigurieren Sie die Bucket-Berechtigungen:
   - RLS aktivieren
   - Erstellen Sie eine Richtlinie, die es authentifizierten Benutzern erlaubt, Dateien hochzuladen
   - Erstellen Sie eine Richtlinie, die es jedem erlaubt, Dateien anzusehen

### 4. Authentifizierung konfigurieren

1. Gehen Sie zum Abschnitt "Authentication" in Ihrem Supabase-Dashboard
2. Unter "Settings" > "URL Configuration":
   - Setzen Sie die Site-URL auf Ihre Produktions-URL (oder http://localhost:3000 für die Entwicklung)
   - Fügen Sie Redirect-URLs hinzu: `https://ihre-domain.com/auth/callback` und `http://localhost:3000/auth/callback`

## Produktions-Deployment

### 1. Anwendung für die Produktion bauen

```bash
npm run build
```

### 2. Deployment auf Vercel

Die einfachste Methode zum Deployment ist Vercel:

1. Erstellen Sie ein Konto auf [Vercel](https://vercel.com)
2. Installieren Sie die Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. Führen Sie im Projektverzeichnis aus:
   ```bash
   vercel
   ```
4. Folgen Sie den Anweisungen und setzen Sie die Umgebungsvariablen:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Andere Hosting-Optionen

#### Netlify

1. Erstellen Sie ein Konto auf [Netlify](https://netlify.com)
2. Erstellen Sie eine `netlify.toml` Datei im Stammverzeichnis:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"
   ```
3. Deployen Sie mit der Netlify CLI oder verbinden Sie Ihr GitHub-Repository

#### Traditioneller Hosting-Provider

1. Bauen Sie die Anwendung:
   ```bash
   npm run build
   ```
2. Starten Sie den Produktionsserver:
   ```bash
   npm start
   ```
3. Verwenden Sie einen Prozessmanager wie PM2:
   ```bash
   npm install -g pm2
   pm2 start npm --name "lemonvows" -- start
   ```

## Umgebungsvariablen für die Produktion

Stellen Sie sicher, dass folgende Umgebungsvariablen in Ihrer Produktionsumgebung gesetzt sind:

```
NEXT_PUBLIC_SUPABASE_URL=https://ihre-supabase-projekt-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ihr-supabase-anon-key
```

## Wartung und Updates

### Datenbank-Backups

Supabase bietet automatische Backups an. Sie können auch manuelle Backups über das Dashboard erstellen.

### Anwendungs-Updates

1. Ziehen Sie die neuesten Änderungen:
   ```bash
   git pull origin main
   ```
2. Installieren Sie neue Abhängigkeiten:
   ```bash
   npm install
   ```
3. Bauen Sie die Anwendung neu:
   ```bash
   npm run build
   ```
4. Starten Sie den Server neu:
   ```bash
   npm start
   ```

## Fehlerbehebung

### Häufige Probleme

1. **Verbindungsprobleme mit Supabase**:
   - Überprüfen Sie die Umgebungsvariablen
   - Stellen Sie sicher, dass Ihre IP-Adresse nicht von Supabase blockiert wird

2. **Authentifizierungsprobleme**:
   - Überprüfen Sie die Redirect-URLs in den Supabase-Einstellungen
   - Löschen Sie Cookies und lokalen Speicher im Browser

3. **Deployment-Fehler**:
   - Überprüfen Sie die Build-Logs
   - Stellen Sie sicher, dass alle Abhängigkeiten korrekt installiert sind

## Support und Ressourcen

- [Next.js Dokumentation](https://nextjs.org/docs)
- [Supabase Dokumentation](https://supabase.com/docs)
- [Vercel Dokumentation](https://vercel.com/docs)
- [Tailwind CSS Dokumentation](https://tailwindcss.com/docs)
