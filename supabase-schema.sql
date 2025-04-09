-- Supabase SQL Schema für LemonVows Hochzeitsplanungs-App

-- Gäste-Tabelle
CREATE TABLE IF NOT EXISTS guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  rsvp_status TEXT DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'confirmed', 'declined')),
  dietary_restrictions TEXT,
  plus_one BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ereignisse-Tabelle
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dienstleister-Tabelle
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  price DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budget-Posten-Tabelle
CREATE TABLE IF NOT EXISTS budget_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  item_name TEXT NOT NULL,
  estimated_cost DECIMAL(10, 2) NOT NULL,
  actual_cost DECIMAL(10, 2),
  paid BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Einladungen-Tabelle
CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fotos-Tabelle
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  title TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Registry-Links-Tabelle
CREATE TABLE IF NOT EXISTS registry_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Erstellen von Policies für Row-Level Security

-- Gäste-Policies
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Benutzer können nur ihre eigenen Gäste sehen"
  ON guests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Benutzer können nur ihre eigenen Gäste erstellen"
  ON guests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Benutzer können nur ihre eigenen Gäste aktualisieren"
  ON guests FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Benutzer können nur ihre eigenen Gäste löschen"
  ON guests FOR DELETE
  USING (auth.uid() = user_id);

-- Ereignisse-Policies
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Benutzer können nur ihre eigenen Ereignisse sehen"
  ON events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Benutzer können nur ihre eigenen Ereignisse erstellen"
  ON events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Benutzer können nur ihre eigenen Ereignisse aktualisieren"
  ON events FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Benutzer können nur ihre eigenen Ereignisse löschen"
  ON events FOR DELETE
  USING (auth.uid() = user_id);

-- Dienstleister-Policies
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Benutzer können nur ihre eigenen Dienstleister sehen"
  ON vendors FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Benutzer können nur ihre eigenen Dienstleister erstellen"
  ON vendors FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Benutzer können nur ihre eigenen Dienstleister aktualisieren"
  ON vendors FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Benutzer können nur ihre eigenen Dienstleister löschen"
  ON vendors FOR DELETE
  USING (auth.uid() = user_id);

-- Budget-Posten-Policies
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Benutzer können nur ihre eigenen Budget-Posten sehen"
  ON budget_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Benutzer können nur ihre eigenen Budget-Posten erstellen"
  ON budget_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Benutzer können nur ihre eigenen Budget-Posten aktualisieren"
  ON budget_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Benutzer können nur ihre eigenen Budget-Posten löschen"
  ON budget_items FOR DELETE
  USING (auth.uid() = user_id);

-- Einladungen-Policies
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Benutzer können nur ihre eigenen Einladungen sehen"
  ON invitations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Benutzer können nur ihre eigenen Einladungen erstellen"
  ON invitations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Benutzer können nur ihre eigenen Einladungen aktualisieren"
  ON invitations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Benutzer können nur ihre eigenen Einladungen löschen"
  ON invitations FOR DELETE
  USING (auth.uid() = user_id);

-- Fotos-Policies
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Benutzer können nur ihre eigenen Fotos sehen"
  ON photos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Benutzer können nur ihre eigenen Fotos erstellen"
  ON photos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Benutzer können nur ihre eigenen Fotos aktualisieren"
  ON photos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Benutzer können nur ihre eigenen Fotos löschen"
  ON photos FOR DELETE
  USING (auth.uid() = user_id);

-- Registry-Links-Policies
ALTER TABLE registry_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Benutzer können nur ihre eigenen Registry-Links sehen"
  ON registry_links FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Benutzer können nur ihre eigenen Registry-Links erstellen"
  ON registry_links FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Benutzer können nur ihre eigenen Registry-Links aktualisieren"
  ON registry_links FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Benutzer können nur ihre eigenen Registry-Links löschen"
  ON registry_links FOR DELETE
  USING (auth.uid() = user_id);

-- Erstellen von Indizes für bessere Abfrageleistung
CREATE INDEX IF NOT EXISTS guests_user_id_idx ON guests (user_id);
CREATE INDEX IF NOT EXISTS events_user_id_idx ON events (user_id);
CREATE INDEX IF NOT EXISTS vendors_user_id_idx ON vendors (user_id);
CREATE INDEX IF NOT EXISTS budget_items_user_id_idx ON budget_items (user_id);
CREATE INDEX IF NOT EXISTS invitations_user_id_idx ON invitations (user_id);
CREATE INDEX IF NOT EXISTS photos_user_id_idx ON photos (user_id);
CREATE INDEX IF NOT EXISTS registry_links_user_id_idx ON registry_links (user_id);

-- Erstellen von Storage Buckets für Fotos
-- Hinweis: Dies muss in der Supabase-Konsole manuell durchgeführt werden
-- oder über die Supabase-API, da SQL dies nicht direkt unterstützt.
