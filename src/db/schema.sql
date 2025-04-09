-- Benutzer-Tabelle
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'customer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
  avatar_url TEXT
);

-- Hochzeits-Tabelle
CREATE TABLE weddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  date DATE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'basic', 'premium')),
  status TEXT NOT NULL CHECK (status IN ('active', 'archived')),
  guest_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE,
  custom_domain TEXT,
  custom_colors JSONB
);

-- Gäste-Tabelle
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  group_name TEXT,
  rsvp_status TEXT CHECK (rsvp_status IN ('confirmed', 'pending', 'declined')),
  dietary_restrictions TEXT[],
  plus_one BOOLEAN DEFAULT FALSE,
  plus_one_name TEXT,
  accommodation_needed BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tisch-Tabelle
CREATE TABLE tables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  shape TEXT NOT NULL CHECK (shape IN ('round', 'rectangular', 'square', 'oval', 'custom')),
  capacity INTEGER NOT NULL,
  rotation INTEGER DEFAULT 0,
  position_x FLOAT NOT NULL,
  position_y FLOAT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sitzplatz-Tabelle
CREATE TABLE seats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_id UUID NOT NULL REFERENCES tables(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budget-Kategorie-Tabelle
CREATE TABLE budget_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  planned_amount DECIMAL(10, 2) NOT NULL,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budget-Ausgaben-Tabelle
CREATE TABLE budget_expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES budget_categories(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  paid BOOLEAN DEFAULT FALSE,
  receipt_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Moodboard-Sammlung-Tabelle
CREATE TABLE moodboard_collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Moodboard-Element-Tabelle
CREATE TABLE moodboard_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID NOT NULL REFERENCES moodboard_collections(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image', 'color', 'text')),
  content TEXT NOT NULL,
  position_x FLOAT NOT NULL,
  position_y FLOAT NOT NULL,
  width FLOAT NOT NULL,
  height FLOAT NOT NULL,
  rotation INTEGER DEFAULT 0,
  z_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Foto-Album-Tabelle
CREATE TABLE photo_albums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  cover_photo_url TEXT,
  is_private BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Foto-Tabelle
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  album_id UUID NOT NULL REFERENCES photo_albums(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tags TEXT[],
  likes INTEGER DEFAULT 0,
  is_private BOOLEAN DEFAULT FALSE
);

-- Zahlungs-Tabelle
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  status TEXT NOT NULL CHECK (status IN ('completed', 'pending', 'failed')),
  method TEXT NOT NULL CHECK (method IN ('credit_card', 'paypal', 'bank_transfer')),
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  plan TEXT NOT NULL CHECK (plan IN ('basic', 'premium')),
  duration TEXT NOT NULL CHECK (duration IN ('monthly', 'yearly', 'one_time')),
  invoice_url TEXT,
  receipt_url TEXT
);

-- RSVP-Token-Tabelle
CREATE TABLE rsvp_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Einstellungs-Tabelle
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS-Richtlinien (Row Level Security)

-- Benutzer können nur ihre eigenen Daten sehen
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_self_access ON users
  USING (id = auth.uid() OR role = 'admin');

-- Hochzeiten können nur vom Besitzer oder Admins gesehen werden
ALTER TABLE weddings ENABLE ROW LEVEL SECURITY;
CREATE POLICY wedding_owner_access ON weddings
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Gäste können nur vom Hochzeitsbesitzer oder Admins gesehen werden
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
CREATE POLICY guest_wedding_access ON guests
  USING (EXISTS (
    SELECT 1 FROM weddings 
    WHERE weddings.id = wedding_id 
    AND (weddings.user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    ))
  ));

-- Ähnliche RLS-Richtlinien für alle anderen Tabellen...

-- Indizes für bessere Performance
CREATE INDEX idx_weddings_user_id ON weddings(user_id);
CREATE INDEX idx_guests_wedding_id ON guests(wedding_id);
CREATE INDEX idx_tables_wedding_id ON tables(wedding_id);
CREATE INDEX idx_seats_table_id ON seats(table_id);
CREATE INDEX idx_seats_guest_id ON seats(guest_id);
CREATE INDEX idx_budget_categories_wedding_id ON budget_categories(wedding_id);
CREATE INDEX idx_budget_expenses_category_id ON budget_expenses(category_id);
CREATE INDEX idx_moodboard_collections_wedding_id ON moodboard_collections(wedding_id);
CREATE INDEX idx_moodboard_items_collection_id ON moodboard_items(collection_id);
CREATE INDEX idx_photo_albums_wedding_id ON photo_albums(wedding_id);
CREATE INDEX idx_photos_album_id ON photos(album_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_wedding_id ON payments(wedding_id);
CREATE INDEX idx_rsvp_tokens_guest_id ON rsvp_tokens(guest_id);
