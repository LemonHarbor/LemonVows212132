-- Benutzerrollen
CREATE TABLE user_roles (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'bestman', 'bestwoman', 'guest')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gästeliste
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'declined')),
  table_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Budgetkategorien
CREATE TABLE budget_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  wedding_id UUID NOT NULL
);

-- Musikwünsche
CREATE TABLE music_wishes (
  id SERIAL PRIMARY KEY,
  track_id TEXT NOT NULL,
  track_name TEXT NOT NULL,
  artist TEXT NOT NULL,
  upvotes INT DEFAULT 0,
  downvotes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trauzeugen-Aufgaben
CREATE TABLE witness_tasks (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  assigned_to TEXT CHECK (assigned_to IN ('bestman', 'bestwoman')),
  completed BOOLEAN DEFAULT false
);
