# LemonVows Database Schema Design

## Overview
This document outlines the database schema design for the LemonVows wedding planning application, focusing on the core features: guest management with RSVP functionality, food selection and allergy tracking, and statistics dashboard.

## Database Tables

### 1. Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  role TEXT NOT NULL DEFAULT 'couple', -- 'couple', 'admin', 'guest'
  preferred_language TEXT DEFAULT 'de' -- 'de', 'en', 'fr', 'es'
);
```

### 2. Weddings
```sql
CREATE TABLE weddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  couple_id UUID REFERENCES users(id) NOT NULL,
  wedding_name TEXT NOT NULL,
  wedding_date DATE NOT NULL,
  location TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  style TEXT DEFAULT 'classic', -- 'boho', 'elegant', 'vintage', 'classic', 'modern'
  rsvp_deadline DATE,
  max_guests INTEGER DEFAULT 100,
  subscription_tier TEXT DEFAULT 'free' -- 'free', 'basic', 'premium'
);
```

### 3. Guests
```sql
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID REFERENCES weddings(id) NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  invitation_sent BOOLEAN DEFAULT FALSE,
  invitation_sent_date TIMESTAMP WITH TIME ZONE,
  rsvp_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  group_name TEXT -- For grouping guests (e.g., 'Family', 'Friends', 'Colleagues')
);
```

### 4. RSVP Responses
```sql
CREATE TABLE rsvp_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID REFERENCES guests(id) NOT NULL,
  response_status TEXT NOT NULL, -- 'accepted', 'declined', 'pending'
  response_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  number_of_accompanying_persons INTEGER DEFAULT 0,
  needs_accommodation BOOLEAN DEFAULT FALSE,
  special_requests TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Menu Options
```sql
CREATE TABLE menu_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID REFERENCES weddings(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_vegetarian BOOLEAN DEFAULT FALSE,
  is_vegan BOOLEAN DEFAULT FALSE,
  is_gluten_free BOOLEAN DEFAULT FALSE,
  is_dairy_free BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  course TEXT NOT NULL -- 'starter', 'main', 'dessert'
);
```

### 6. Allergies
```sql
CREATE TABLE allergies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 7. Guest Allergies (Junction Table)
```sql
CREATE TABLE guest_allergies (
  guest_id UUID REFERENCES guests(id) NOT NULL,
  allergy_id UUID REFERENCES allergies(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (guest_id, allergy_id)
);
```

### 8. Guest Menu Selections
```sql
CREATE TABLE guest_menu_selections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID REFERENCES guests(id) NOT NULL,
  menu_option_id UUID REFERENCES menu_options(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (guest_id, menu_option_id)
);
```

### 9. Tables
```sql
CREATE TABLE tables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID REFERENCES weddings(id) NOT NULL,
  table_name TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 8,
  shape TEXT DEFAULT 'round', -- 'round', 'rectangular', 'square'
  position_x FLOAT,
  position_y FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 10. Table Assignments
```sql
CREATE TABLE table_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_id UUID REFERENCES tables(id) NOT NULL,
  guest_id UUID REFERENCES guests(id) NOT NULL,
  seat_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (table_id, guest_id),
  UNIQUE (table_id, seat_number)
);
```

### 11. Statistics
```sql
CREATE TABLE statistics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID REFERENCES weddings(id) NOT NULL,
  total_guests INTEGER DEFAULT 0,
  accepted_count INTEGER DEFAULT 0,
  declined_count INTEGER DEFAULT 0,
  pending_count INTEGER DEFAULT 0,
  vegetarian_count INTEGER DEFAULT 0,
  vegan_count INTEGER DEFAULT 0,
  gluten_free_count INTEGER DEFAULT 0,
  dairy_free_count INTEGER DEFAULT 0,
  with_allergies_count INTEGER DEFAULT 0,
  needs_accommodation_count INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 12. Translations
```sql
CREATE TABLE translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL,
  de TEXT NOT NULL, -- German
  en TEXT, -- English
  fr TEXT, -- French
  es TEXT, -- Spanish
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (key)
);
```

## Database Relationships

1. **One-to-Many Relationships**:
   - User to Weddings (one couple can have multiple weddings)
   - Wedding to Guests (one wedding has many guests)
   - Wedding to Menu Options (one wedding has many menu options)
   - Wedding to Tables (one wedding has many tables)
   - Wedding to Statistics (one wedding has one statistics record)

2. **Many-to-Many Relationships**:
   - Guests to Allergies (through guest_allergies junction table)
   - Guests to Menu Options (through guest_menu_selections)
   - Guests to Tables (through table_assignments)

## Indexes for Performance

```sql
-- Indexes for faster lookups
CREATE INDEX idx_guests_wedding_id ON guests(wedding_id);
CREATE INDEX idx_rsvp_responses_guest_id ON rsvp_responses(guest_id);
CREATE INDEX idx_menu_options_wedding_id ON menu_options(wedding_id);
CREATE INDEX idx_guest_menu_selections_guest_id ON guest_menu_selections(guest_id);
CREATE INDEX idx_tables_wedding_id ON tables(wedding_id);
CREATE INDEX idx_table_assignments_table_id ON table_assignments(table_id);
CREATE INDEX idx_table_assignments_guest_id ON table_assignments(guest_id);
CREATE INDEX idx_statistics_wedding_id ON statistics(wedding_id);
```

## Database Triggers

### RSVP Statistics Update Trigger
```sql
CREATE OR REPLACE FUNCTION update_statistics_on_rsvp() RETURNS TRIGGER AS $$
DECLARE
  wedding_id UUID;
BEGIN
  SELECT wedding_id INTO wedding_id FROM guests WHERE id = NEW.guest_id;
  
  -- Update statistics table
  UPDATE statistics
  SET 
    accepted_count = (SELECT COUNT(*) FROM rsvp_responses r JOIN guests g ON r.guest_id = g.id WHERE g.wedding_id = wedding_id AND r.response_status = 'accepted'),
    declined_count = (SELECT COUNT(*) FROM rsvp_responses r JOIN guests g ON r.guest_id = g.id WHERE g.wedding_id = wedding_id AND r.response_status = 'declined'),
    pending_count = (SELECT COUNT(*) FROM rsvp_responses r JOIN guests g ON r.guest_id = g.id WHERE g.wedding_id = wedding_id AND r.response_status = 'pending'),
    needs_accommodation_count = (SELECT COUNT(*) FROM rsvp_responses r JOIN guests g ON r.guest_id = g.id WHERE g.wedding_id = wedding_id AND r.needs_accommodation = TRUE),
    last_updated = NOW()
  WHERE wedding_id = wedding_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_statistics_after_rsvp
AFTER INSERT OR UPDATE ON rsvp_responses
FOR EACH ROW
EXECUTE FUNCTION update_statistics_on_rsvp();
```

### Menu Selection Statistics Update Trigger
```sql
CREATE OR REPLACE FUNCTION update_statistics_on_menu_selection() RETURNS TRIGGER AS $$
DECLARE
  wedding_id UUID;
  menu_option RECORD;
BEGIN
  SELECT g.wedding_id INTO wedding_id FROM guests g WHERE g.id = NEW.guest_id;
  SELECT * INTO menu_option FROM menu_options WHERE id = NEW.menu_option_id;
  
  -- Update statistics table
  UPDATE statistics
  SET 
    vegetarian_count = (
      SELECT COUNT(DISTINCT gms.guest_id) 
      FROM guest_menu_selections gms 
      JOIN menu_options mo ON gms.menu_option_id = mo.id 
      JOIN guests g ON gms.guest_id = g.id 
      WHERE g.wedding_id = wedding_id AND mo.is_vegetarian = TRUE
    ),
    vegan_count = (
      SELECT COUNT(DISTINCT gms.guest_id) 
      FROM guest_menu_selections gms 
      JOIN menu_options mo ON gms.menu_option_id = mo.id 
      JOIN guests g ON gms.guest_id = g.id 
      WHERE g.wedding_id = wedding_id AND mo.is_vegan = TRUE
    ),
    gluten_free_count = (
      SELECT COUNT(DISTINCT gms.guest_id) 
      FROM guest_menu_selections gms 
      JOIN menu_options mo ON gms.menu_option_id = mo.id 
      JOIN guests g ON gms.guest_id = g.id 
      WHERE g.wedding_id = wedding_id AND mo.is_gluten_free = TRUE
    ),
    dairy_free_count = (
      SELECT COUNT(DISTINCT gms.guest_id) 
      FROM guest_menu_selections gms 
      JOIN menu_options mo ON gms.menu_option_id = mo.id 
      JOIN guests g ON gms.guest_id = g.id 
      WHERE g.wedding_id = wedding_id AND mo.is_dairy_free = TRUE
    ),
    last_updated = NOW()
  WHERE wedding_id = wedding_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_statistics_after_menu_selection
AFTER INSERT OR UPDATE ON guest_menu_selections
FOR EACH ROW
EXECUTE FUNCTION update_statistics_on_menu_selection();
```

### Allergy Statistics Update Trigger
```sql
CREATE OR REPLACE FUNCTION update_statistics_on_allergy() RETURNS TRIGGER AS $$
DECLARE
  wedding_id UUID;
BEGIN
  SELECT g.wedding_id INTO wedding_id FROM guests g WHERE g.id = NEW.guest_id;
  
  -- Update statistics table
  UPDATE statistics
  SET 
    with_allergies_count = (
      SELECT COUNT(DISTINCT ga.guest_id) 
      FROM guest_allergies ga 
      JOIN guests g ON ga.guest_id = g.id 
      WHERE g.wedding_id = wedding_id
    ),
    last_updated = NOW()
  WHERE wedding_id = wedding_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_statistics_after_allergy
AFTER INSERT OR UPDATE ON guest_allergies
FOR EACH ROW
EXECUTE FUNCTION update_statistics_on_allergy();
```

## Initial Data

### Common Allergies
```sql
INSERT INTO allergies (name, description) VALUES
('Peanuts', 'Allergy to peanuts and peanut-derived products'),
('Tree Nuts', 'Allergy to nuts like almonds, walnuts, etc.'),
('Milk', 'Lactose intolerance or milk protein allergy'),
('Eggs', 'Allergy to eggs and egg-derived products'),
('Wheat', 'Wheat allergy or celiac disease'),
('Soy', 'Allergy to soybeans and soy-derived products'),
('Fish', 'Allergy to fish and fish-derived products'),
('Shellfish', 'Allergy to shellfish like shrimp, crab, etc.'),
('Sesame', 'Allergy to sesame seeds and sesame-derived products'),
('Sulfites', 'Sensitivity to sulfites used as preservatives');
```

### Translation Keys
```sql
INSERT INTO translations (key, de, en, fr, es) VALUES
('rsvp.accept', 'Zusagen', 'Accept', 'Accepter', 'Aceptar'),
('rsvp.decline', 'Absagen', 'Decline', 'Décliner', 'Rechazar'),
('rsvp.pending', 'Ausstehend', 'Pending', 'En attente', 'Pendiente'),
('food.vegetarian', 'Vegetarisch', 'Vegetarian', 'Végétarien', 'Vegetariano'),
('food.vegan', 'Vegan', 'Vegan', 'Végétalien', 'Vegano'),
('food.gluten_free', 'Glutenfrei', 'Gluten-free', 'Sans gluten', 'Sin gluten'),
('food.dairy_free', 'Laktosefrei', 'Dairy-free', 'Sans lactose', 'Sin lácteos'),
('stats.accepted', 'Zusagen', 'Accepted', 'Accepté', 'Aceptado'),
('stats.declined', 'Absagen', 'Declined', 'Décliné', 'Rechazado'),
('stats.pending', 'Ausstehend', 'Pending', 'En attente', 'Pendiente');
```

## Notes on Implementation

1. **Supabase Integration**:
   - This schema is designed to work with Supabase, which is built on PostgreSQL
   - Row-level security (RLS) policies should be implemented to ensure data privacy
   - Supabase's real-time functionality can be used for live updates to the statistics dashboard

2. **WeWeb Frontend Considerations**:
   - Database views can be created to simplify data access from WeWeb
   - Consider using Supabase functions for complex operations

3. **GDPR Compliance**:
   - Personal data is stored only as needed for the application functionality
   - Data export and deletion functionality should be implemented
   - All data is stored in EU-based hosting

4. **Scalability**:
   - Indexes are created for frequently queried fields
   - The schema supports the tiered pricing model with the subscription_tier field
   - Statistics are pre-calculated and stored for efficient dashboard rendering

5. **Multilingual Support**:
   - The translations table provides a centralized place for all UI text
   - User language preference is stored in the users table
