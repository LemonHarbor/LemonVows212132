-- LemonVows Test Environment Setup Script
-- This script creates a test database with sample data for the LemonVows wedding planning app

-- Create tables
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

CREATE TABLE allergies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE guest_allergies (
  guest_id UUID REFERENCES guests(id) NOT NULL,
  allergy_id UUID REFERENCES allergies(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (guest_id, allergy_id)
);

CREATE TABLE guest_menu_selections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID REFERENCES guests(id) NOT NULL,
  menu_option_id UUID REFERENCES menu_options(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (guest_id, menu_option_id)
);

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

-- Create indexes for performance
CREATE INDEX idx_guests_wedding_id ON guests(wedding_id);
CREATE INDEX idx_rsvp_responses_guest_id ON rsvp_responses(guest_id);
CREATE INDEX idx_menu_options_wedding_id ON menu_options(wedding_id);
CREATE INDEX idx_guest_menu_selections_guest_id ON guest_menu_selections(guest_id);
CREATE INDEX idx_tables_wedding_id ON tables(wedding_id);
CREATE INDEX idx_table_assignments_table_id ON table_assignments(table_id);
CREATE INDEX idx_table_assignments_guest_id ON table_assignments(guest_id);
CREATE INDEX idx_statistics_wedding_id ON statistics(wedding_id);

-- Create triggers for statistics updates
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

-- Insert test data

-- 1. Insert test users
INSERT INTO users (id, email, password_hash, first_name, last_name, role, preferred_language)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin@lemonvows.com', '$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aULe9l1ZgYi', 'Admin', 'User', 'admin', 'de'),
  ('22222222-2222-2222-2222-222222222222', 'couple1@lemonvows.com', '$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aULe9l1ZgYi', 'Sarah', 'Smith', 'couple', 'de'),
  ('33333333-3333-3333-3333-333333333333', 'couple2@lemonvows.com', '$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aULe9l1ZgYi', 'Emma', 'Johnson', 'couple', 'en');

-- 2. Insert test weddings
INSERT INTO weddings (id, couple_id, wedding_name, wedding_date, location, description, style, rsvp_deadline, subscription_tier)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Sarah & Michael', '2025-06-15', 'Grand Hotel, Berlin', 'We are excited to celebrate our special day with you!', 'elegant', '2025-05-01', 'premium'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'Emma & James', '2025-07-22', 'Seaside Resort, Hamburg', 'Join us for our beach wedding celebration!', 'boho', '2025-06-15', 'basic');

-- 3. Insert common allergies
INSERT INTO allergies (id, name, description)
VALUES
  ('allergy-01', 'Peanuts', 'Allergy to peanuts and peanut-derived products'),
  ('allergy-02', 'Tree Nuts', 'Allergy to nuts like almonds, walnuts, etc.'),
  ('allergy-03', 'Milk', 'Lactose intolerance or milk protein allergy'),
  ('allergy-04', 'Eggs', 'Allergy to eggs and egg-derived products'),
  ('allergy-05', 'Wheat', 'Wheat allergy or celiac disease'),
  ('allergy-06', 'Soy', 'Allergy to soybeans and soy-derived products'),
  ('allergy-07', 'Fish', 'Allergy to fish and fish-derived products'),
  ('allergy-08', 'Shellfish', 'Allergy to shellfish like shrimp, crab, etc.'),
  ('allergy-09', 'Sesame', 'Allergy to sesame seeds and sesame-derived products'),
  ('allergy-10', 'Sulfites', 'Sensitivity to sulfites used as preservatives');

-- 4. Insert menu options for Sarah & Michael's wedding
INSERT INTO menu_options (id, wedding_id, name, description, is_vegetarian, is_vegan, is_gluten_free, is_dairy_free, course)
VALUES
  -- Starters
  ('menu-s-01', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Tomato Soup', 'Creamy tomato soup with basil', TRUE, FALSE, TRUE, FALSE, 'starter'),
  ('menu-s-02', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Prawn Cocktail', 'Classic prawn cocktail with Marie Rose sauce', FALSE, FALSE, TRUE, TRUE, 'starter'),
  ('menu-s-03', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Caesar Salad', 'Traditional Caesar salad with croutons', FALSE, FALSE, FALSE, FALSE, 'starter'),
  
  -- Main Courses
  ('menu-s-04', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Beef Wellington', 'Tender fillet of beef wrapped in pastry', FALSE, FALSE, FALSE, FALSE, 'main'),
  ('menu-s-05', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Salmon Fillet', 'Grilled salmon with lemon butter sauce', FALSE, FALSE, TRUE, FALSE, 'main'),
  ('menu-s-06', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Mushroom Risotto', 'Creamy risotto with wild mushrooms', TRUE, FALSE, TRUE, FALSE, 'main'),
  
  -- Desserts
  ('menu-s-07', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Chocolate Cake', 'Rich chocolate cake with vanilla ice cream', TRUE, FALSE, FALSE, FALSE, 'dessert'),
  ('menu-s-08', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Fruit Salad', 'Fresh seasonal fruit salad', TRUE, TRUE, TRUE, TRUE, 'dessert'),
  ('menu-s-09', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Cheesecake', 'New York style cheesecake with berry compote', TRUE, FALSE, FALSE, FALSE, 'dessert');

-- 5. Insert menu options for Emma & James's wedding
INSERT INTO menu_options (id, wedding_id, name, description, is_vegetarian, is_vegan, is_gluten_free, is_dairy_free, course)
VALUES
  -- Starters
  ('menu-e-01', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Gazpacho', 'Chilled tomato soup with cucumber', TRUE, TRUE, TRUE, TRUE, 'starter'),
  ('menu-e-02', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Seafood Platter', 'Selection of fresh seafood', FALSE, FALSE, TRUE, TRUE, 'starter'),
  ('menu-e-03', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Greek Salad', 'Traditional Greek salad with feta cheese', TRUE, FALSE, TRUE, FALSE, 'starter'),
  
  -- Main Courses
  ('menu-e-04', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Grilled Steak', 'Prime beef steak with herb butter', FALSE, FALSE, TRUE, FALSE, 'main'),
  ('menu-e-05', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Grilled Sea Bass', 'Whole sea bass with Mediterranean herbs', FALSE, FALSE, TRUE, TRUE, 'main'),
  ('menu-e-06', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Vegetable Paella', 'Spanish rice dish with seasonal vegetables', TRUE, TRUE, TRUE, TRUE, 'main'),
  
  -- Desserts
  ('menu-e-07', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Tiramisu', 'Classic Italian coffee dessert', TRUE, FALSE, FALSE, FALSE, 'dessert'),
  ('menu-e-08', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Sorbet Selection', 'Trio of fruit sorbets', TRUE, TRUE, TRUE, TRUE, 'dessert'),
  ('menu-e-09', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Crème Brûlée', 'Classic French vanilla custard with caramelized top', TRUE, FALSE, TRUE, FALSE, 'dessert');

-- 6. Insert tables for Sarah & Michael's wedding
INSERT INTO tables (id, wedding_id, table_name, capacity, shape, position_x, position_y)
VALUES
  ('table-s-01', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Table 1', 8, 'round', 100, 100),
  ('table-s-02', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Table 2', 8, 'round', 250, 100),
  ('table-s-03', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Table 3', 8, 'round', 400, 100),
  ('table-s-04', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Table 4', 8, 'round', 100, 250),
  ('table-s-05', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Table 5', 8, 'round', 250, 250),
  ('table-s-06', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Head Table', 6, 'rectangular', 250, 50);

-- 7. Insert tables for Emma & James's wedding
INSERT INTO tables (id, wedding_id, table_name, capacity, shape, position_x, position_y)
VALUES
  ('table-e-01', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Beach 1', 6, 'round', 100, 100),
  ('table-e-02', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Beach 2', 6, 'round', 250, 100),
  ('table-e-03', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Beach 3', 6, 'round', 400, 100),
  ('table-e-04', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Sunset', 10, 'rectangular', 250, 250);

-- 8. Insert guests for Sarah & Michael's wedding
INSERT INTO guests (id, wedding_id, first_name, last_name, email, phone, rsvp_code, group_name, invitation_sent, invitation_sent_date)
VALUES
  -- Family group
  ('guest-s-01', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'John', 'Smith', 'john.smith@example.com', '+49123456789', 'jodo-abc-123', 'Family', TRUE, NOW() - INTERVAL '10 days'),
  ('guest-s-02', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Jane', 'Smith', 'jane.smith@example.com', '+49123456790', 'jasn-def-456', 'Family', TRUE, NOW() - INTERVAL '10 days'),
  ('guest-s-03', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Robert', 'Johnson', 'robert.johnson@example.com', '+49123456791', 'rojo-ghi-789', 'Family', TRUE, NOW() - INTERVAL '10 days'),
  ('guest-s-04', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Emily', 'Johnson', 'emily.johnson@example.com', '+49123456792', 'emjo-jkl-012', 'Family', TRUE, NOW() - INTERVAL '10 days'),
  
  -- Friends group
  ('guest-s-05', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'David', 'Williams', 'david.williams@example.com', '+49123456793', 'dawi-mno-345', 'Friends', TRUE, NOW() - INTERVAL '10 days'),
  ('guest-s-06', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Sophie', 'Williams', 'sophie.williams@example.com', '+49123456794', 'sowi-pqr-678', 'Friends', TRUE, NOW() - INTERVAL '10 days'),
  ('guest-s-07', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Michael', 'Brown', 'michael.brown@example.com', '+49123456795', 'mibr-stu-901', 'Friends', TRUE, NOW() - INTERVAL '10 days'),
  ('guest-s-08', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Jessica', 'Brown', 'jessica.brown@example.com', '+49123456796', 'jebr-vwx-234', 'Friends', TRUE, NOW() - INTERVAL '10 days'),
  
  -- Colleagues group
  ('guest-s-09', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Thomas', 'Miller', 'thomas.miller@example.com', '+49123456797', 'thmi-yza-567', 'Colleagues', TRUE, NOW() - INTERVAL '10 days'),
  ('guest-s-10', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Laura', 'Miller', 'laura.miller@example.com', '+49123456798', 'lami-bcd-890', 'Colleagues', TRUE, NOW() - INTERVAL '10 days'),
  ('guest-s-11', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Daniel', 'Taylor', 'daniel.taylor@example.com', '+49123456799', 'data-efg-123', 'Colleagues', TRUE, NOW() - INTERVAL '10 days'),
  ('guest-s-12', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Olivia', 'Taylor', 'olivia.taylor@example.com', '+49123456800', 'olta-hij-456', 'Colleagues', TRUE, NOW() - INTERVAL '10 days');

-- 9. Insert guests for Emma & James's wedding
INSERT INTO guests (id, wedding_id, first_name, last_name, email, phone, rsvp_code, group_name, invitation_sent, invitation_sent_date)
VALUES
  -- Family group
  ('guest-e-01', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'William', 'Johnson', 'william.johnson@example.com', '+49123456801', 'wijo-klm-789', 'Family', TRUE, NOW() - INTERVAL '15 days'),
  ('guest-e-02', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Elizabeth', 'Johnson', 'elizabeth.johnson@example.com', '+49123456802', 'eljo-nop-012', 'Family', TRUE, NOW() - INTERVAL '15 days'),
  ('guest-e-03', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'James', 'Wilson', 'james.wilson@example.com', '+49123456803', 'jawi-qrs-345', 'Family', TRUE, NOW() - INTERVAL '15 days'),
  ('guest-e-04', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Sophia', 'Wilson', 'sophia.wilson@example.com', '+49123456804', 'sowi-tuv-678', 'Family', TRUE, NOW() - INTERVAL '15 days'),
  
  -- Friends group
  ('guest-e-05', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Alexander', 'Davis', 'alexander.davis@example.com', '+49123456805', 'alda-wxy-901', 'Friends', TRUE, NOW() - INTERVAL '15 days'),
  ('guest-e-06', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Charlotte', 'Davis', 'charlotte.davis@example.com', '+49123456806', 'chda-zab-234', 'Friends', TRUE, NOW() - INTERVAL '15 days'),
  ('guest-e-07', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Benjamin', 'Martin', 'benjamin.martin@example.com', '+49123456807', 'bema-cde-567', 'Friends', TRUE, NOW() - INTERVAL '15 days'),
  ('guest-e-08', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Amelia', 'Martin', 'amelia.martin@example.com', '+49123456808', 'amma-fgh-890', 'Friends', TRUE, NOW() - INTERVAL '15 days');

-- 10. Insert RSVP responses for Sarah & Michael's wedding
INSERT INTO rsvp_responses (guest_id, response_status, response_date, number_of_accompanying_persons, needs_accommodation, special_requests)
VALUES
  -- Accepted responses
  ('guest-s-01', 'accepted', NOW() - INTERVAL '8 days', 1, TRUE, 'Would prefer a room with a view if possible.'),
  ('guest-s-02', 'accepted', NOW() - INTERVAL '8 days', 0, TRUE, NULL),
  ('guest-s-05', 'accepted', NOW() - INTERVAL '7 days', 1, FALSE, NULL),
  ('guest-s-06', 'accepted', NOW() - INTERVAL '7 days', 0, FALSE, NULL),
  ('guest-s-09', 'accepted', NOW() - INTERVAL '5 days', 0, TRUE, 'Arriving late on Friday evening.'),
  ('guest-s-10', 'accepted', NOW() - INTERVAL '5 days', 0, TRUE, NULL),
  
  -- Declined responses
  ('guest-s-03', 'declined', NOW() - INTERVAL '6 days', 0, FALSE, 'Sorry, we will be on vacation during this time.'),
  ('guest-s-04', 'declined', NOW() - INTERVAL '6 days', 0, FALSE, NULL),
  
  -- Pending responses (no explicit insert needed as they will be created by triggers)
  -- guest-s-07, guest-s-08, guest-s-11, guest-s-12
  ('guest-s-07', 'pending', NULL, 0, FALSE, NULL),
  ('guest-s-08', 'pending', NULL, 0, FALSE, NULL),
  ('guest-s-11', 'pending', NULL, 0, FALSE, NULL),
  ('guest-s-12', 'pending', NULL, 0, FALSE, NULL);

-- 11. Insert RSVP responses for Emma & James's wedding
INSERT INTO rsvp_responses (guest_id, response_status, response_date, number_of_accompanying_persons, needs_accommodation, special_requests)
VALUES
  -- Accepted responses
  ('guest-e-01', 'accepted', NOW() - INTERVAL '12 days', 0, TRUE, NULL),
  ('guest-e-02', 'accepted', NOW() - INTERVAL '12 days', 0, TRUE, NULL),
  ('guest-e-05', 'accepted', NOW() - INTERVAL '10 days', 1, TRUE, 'We would like a room close to the beach.'),
  ('guest-e-06', 'accepted', NOW() - INTERVAL '10 days', 0, TRUE, NULL),
  
  -- Declined responses
  ('guest-e-07', 'declined', NOW() - INTERVAL '11 days', 0, FALSE, 'Unfortunately, we have a prior commitment.'),
  ('guest-e-08', 'declined', NOW() - INTERVAL '11 days', 0, FALSE, NULL),
  
  -- Pending responses
  ('guest-e-03', 'pending', NULL, 0, FALSE, NULL),
  ('guest-e-04', 'pending', NULL, 0, FALSE, NULL);

-- 12. Insert guest allergies
INSERT INTO guest_allergies (guest_id, allergy_id)
VALUES
  ('guest-s-01', 'allergy-01'), -- John Smith is allergic to peanuts
  ('guest-s-06', 'allergy-03'), -- Sophie Williams is allergic to milk
  ('guest-s-06', 'allergy-04'), -- Sophie Williams is allergic to eggs
  ('guest-s-09', 'allergy-08'), -- Thomas Miller is allergic to shellfish
  ('guest-e-02', 'allergy-05'), -- Elizabeth Johnson is allergic to wheat
  ('guest-e-05', 'allergy-02'); -- Alexander Davis is allergic to tree nuts

-- 13. Insert guest menu selections
INSERT INTO guest_menu_selections (guest_id, menu_option_id)
VALUES
  -- John Smith's selections
  ('guest-s-01', 'menu-s-01'), -- Tomato Soup
  ('guest-s-01', 'menu-s-05'), -- Salmon Fillet
  ('guest-s-01', 'menu-s-07'), -- Chocolate Cake
  
  -- Jane Smith's selections
  ('guest-s-02', 'menu-s-02'), -- Prawn Cocktail
  ('guest-s-02', 'menu-s-04'), -- Beef Wellington
  ('guest-s-02', 'menu-s-09'), -- Cheesecake
  
  -- David Williams's selections
  ('guest-s-05', 'menu-s-03'), -- Caesar Salad
  ('guest-s-05', 'menu-s-04'), -- Beef Wellington
  ('guest-s-05', 'menu-s-07'), -- Chocolate Cake
  
  -- Sophie Williams's selections
  ('guest-s-06', 'menu-s-01'), -- Tomato Soup
  ('guest-s-06', 'menu-s-06'), -- Mushroom Risotto
  ('guest-s-06', 'menu-s-08'), -- Fruit Salad
  
  -- Thomas Miller's selections
  ('guest-s-09', 'menu-s-01'), -- Tomato Soup
  ('guest-s-09', 'menu-s-05'), -- Salmon Fillet
  ('guest-s-09', 'menu-s-07'), -- Chocolate Cake
  
  -- Laura Miller's selections
  ('guest-s-10', 'menu-s-03'), -- Caesar Salad
  ('guest-s-10', 'menu-s-04'), -- Beef Wellington
  ('guest-s-10', 'menu-s-09'), -- Cheesecake
  
  -- William Johnson's selections
  ('guest-e-01', 'menu-e-02'), -- Seafood Platter
  ('guest-e-01', 'menu-e-04'), -- Grilled Steak
  ('guest-e-01', 'menu-e-07'), -- Tiramisu
  
  -- Elizabeth Johnson's selections
  ('guest-e-02', 'menu-e-03'), -- Greek Salad
  ('guest-e-02', 'menu-e-06'), -- Vegetable Paella
  ('guest-e-02', 'menu-e-08'), -- Sorbet Selection
  
  -- Alexander Davis's selections
  ('guest-e-05', 'menu-e-01'), -- Gazpacho
  ('guest-e-05', 'menu-e-05'), -- Grilled Sea Bass
  ('guest-e-05', 'menu-e-09'), -- Crème Brûlée
  
  -- Charlotte Davis's selections
  ('guest-e-06', 'menu-e-03'), -- Greek Salad
  ('guest-e-06', 'menu-e-06'), -- Vegetable Paella
  ('guest-e-06', 'menu-e-08'); -- Sorbet Selection

-- 14. Insert table assignments
INSERT INTO table_assignments (table_id, guest_id, seat_number)
VALUES
  -- Table 1 assignments
  ('table-s-01', 'guest-s-01', 1),
  ('table-s-01', 'guest-s-02', 2),
  ('table-s-01', 'guest-s-05', 3),
  ('table-s-01', 'guest-s-06', 4),
  
  -- Table 2 assignments
  ('table-s-02', 'guest-s-09', 1),
  ('table-s-02', 'guest-s-10', 2),
  
  -- Beach 1 assignments
  ('table-e-01', 'guest-e-01', 1),
  ('table-e-01', 'guest-e-02', 2),
  
  -- Beach 2 assignments
  ('table-e-02', 'guest-e-05', 1),
  ('table-e-02', 'guest-e-06', 2);

-- 15. Insert statistics records
INSERT INTO statistics (wedding_id, total_guests, accepted_count, declined_count, pending_count, vegetarian_count, vegan_count, gluten_free_count, dairy_free_count, with_allergies_count, needs_accommodation_count)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 12, 6, 2, 4, 2, 0, 3, 1, 3, 4),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 8, 4, 2, 2, 2, 2, 4, 2, 2, 4);

-- 16. Insert translations
INSERT INTO translations (key, de, en, fr, es)
VALUES
  -- Common translations
  ('common.save', 'Speichern', 'Save', 'Enregistrer', 'Guardar'),
  ('common.cancel', 'Abbrechen', 'Cancel', 'Annuler', 'Cancelar'),
  ('common.delete', 'Löschen', 'Delete', 'Supprimer', 'Eliminar'),
  ('common.edit', 'Bearbeiten', 'Edit', 'Modifier', 'Editar'),
  ('common.yes', 'Ja', 'Yes', 'Oui', 'Sí'),
  ('common.no', 'Nein', 'No', 'Non', 'No'),
  
  -- RSVP translations
  ('rsvp.accept', 'Zusagen', 'Accept', 'Accepter', 'Aceptar'),
  ('rsvp.decline', 'Absagen', 'Decline', 'Décliner', 'Rechazar'),
  ('rsvp.pending', 'Ausstehend', 'Pending', 'En attente', 'Pendiente'),
  ('rsvp.enter_code', 'RSVP-Code eingeben', 'Enter RSVP Code', 'Entrez le code RSVP', 'Ingrese el código RSVP'),
  ('rsvp.enter_code_description', 'Bitte geben Sie Ihren RSVP-Code ein, um auf die Einladung zu antworten.', 'Please enter your RSVP code to respond to the invitation.', 'Veuillez entrer votre code RSVP pour répondre à l\'invitation.', 'Por favor, ingrese su código RSVP para responder a la invitación.'),
  ('rsvp.code_placeholder', 'RSVP-Code', 'RSVP Code', 'Code RSVP', 'Código RSVP'),
  ('rsvp.submit', 'Absenden', 'Submit', 'Soumettre', 'Enviar'),
  ('rsvp.hello', 'Hallo', 'Hello', 'Bonjour', 'Hola'),
  ('rsvp.invitation_to', 'Sie sind eingeladen zu', 'You are invited to', 'Vous êtes invité à', 'Está invitado a'),
  ('rsvp.your_response', 'Ihre Antwort', 'Your Response', 'Votre Réponse', 'Su Respuesta'),
  ('rsvp.accompanying_persons', 'Begleitpersonen', 'Accompanying Persons', 'Personnes Accompagnantes', 'Personas Acompañantes'),
  ('rsvp.need_accommodation', 'Benötigen Sie Unterkunft?', 'Do you need accommodation?', 'Avez-vous besoin d\'hébergement?', '¿Necesita alojamiento?'),
  ('rsvp.accommodation_description', 'Bitte ankreuzen, wenn Sie Unterkunft benötigen', 'Please check if you need accommodation', 'Veuillez cocher si vous avez besoin d\'hébergement', 'Marque si necesita alojamiento'),
  ('rsvp.menu_selection', 'Menüauswahl', 'Menu Selection', 'Sélection de Menu', 'Selección de Menú'),
  ('rsvp.allergies', 'Allergien', 'Allergies', 'Allergies', 'Alergias'),
  ('rsvp.allergies_description', 'Bitte wählen Sie alle zutreffenden Allergien aus', 'Please select all applicable allergies', 'Veuillez sélectionner toutes les allergies applicables', 'Por favor seleccione todas las alergias aplicables'),
  ('rsvp.special_requests', 'Besondere Wünsche', 'Special Requests', 'Demandes Spéciales', 'Solicitudes Especiales'),
  ('rsvp.special_requests_placeholder', 'Geben Sie hier besondere Wünsche oder Anmerkungen ein', 'Enter any special requests or notes here', 'Entrez ici toutes demandes spéciales ou remarques', 'Ingrese cualquier solicitud especial o notas aquí'),
  ('rsvp.submit_response', 'Antwort absenden', 'Submit Response', 'Soumettre la Réponse', 'Enviar Respuesta'),
  ('rsvp.thank_you', 'Vielen Dank!', 'Thank You!', 'Merci!', '¡Gracias!'),
  ('rsvp.response_received', 'Ihre Antwort wurde erfolgreich übermittelt.', 'Your response has been successfully submitted.', 'Votre réponse a été soumise avec succès.', 'Su respuesta ha sido enviada con éxito.'),
  ('rsvp.your_response_summary', 'Zusammenfassung Ihrer Antwort', 'Your Response Summary', 'Résumé de Votre Réponse', 'Resumen de Su Respuesta'),
  ('rsvp.status', 'Status', 'Status', 'Statut', 'Estado'),
  ('rsvp.accommodation', 'Unterkunft', 'Accommodation', 'Hébergement', 'Alojamiento'),
  ('rsvp.menu_selections', 'Menüauswahl', 'Menu Selections', 'Sélections de Menu', 'Selecciones de Menú'),
  ('rsvp.contact_couple', 'Bei Fragen kontaktieren Sie bitte das Brautpaar.', 'Please contact the couple if you have any questions.', 'Veuillez contacter le couple si vous avez des questions.', 'Por favor contacte a la pareja si tiene alguna pregunta.'),
  
  -- Food translations
  ('food.vegetarian', 'Vegetarisch', 'Vegetarian', 'Végétarien', 'Vegetariano'),
  ('food.vegan', 'Vegan', 'Vegan', 'Végétalien', 'Vegano'),
  ('food.gluten_free', 'Glutenfrei', 'Gluten-free', 'Sans gluten', 'Sin gluten'),
  ('food.dairy_free', 'Laktosefrei', 'Dairy-free', 'Sans lactose', 'Sin lácteos'),
  ('food.starter', 'Vorspeise', 'Starter', 'Entrée', 'Entrante'),
  ('food.main_course', 'Hauptgang', 'Main Course', 'Plat Principal', 'Plato Principal'),
  ('food.dessert', 'Nachspeise', 'Dessert', 'Dessert', 'Postre'),
  
  -- Statistics translations
  ('stats.dashboard_title', 'Statistik-Dashboard', 'Statistics Dashboard', 'Tableau de Bord des Statistiques', 'Panel de Estadísticas'),
  ('stats.refresh', 'Aktualisieren', 'Refresh', 'Actualiser', 'Actualizar'),
  ('stats.export', 'Exportieren', 'Export', 'Exporter', 'Exportar'),
  ('stats.rsvp_summary', 'RSVP-Zusammenfassung', 'RSVP Summary', 'Résumé des RSVP', 'Resumen de RSVP'),
  ('stats.total_guests', 'Gesamtzahl der Gäste', 'Total Guests', 'Nombre Total d\'Invités', 'Total de Invitados'),
  ('stats.accepted', 'Zusagen', 'Accepted', 'Acceptés', 'Aceptados'),
  ('stats.declined', 'Absagen', 'Declined', 'Déclinés', 'Rechazados'),
  ('stats.pending', 'Ausstehend', 'Pending', 'En Attente', 'Pendientes'),
  ('stats.needs_accommodation', 'Benötigt Unterkunft', 'Needs Accommodation', 'Besoin d\'Hébergement', 'Necesita Alojamiento'),
  ('stats.of_accepted', 'der Zusagen', 'of accepted', 'des acceptés', 'de aceptados'),
  ('stats.rsvp_timeline', 'RSVP-Zeitverlauf', 'RSVP Timeline', 'Chronologie des RSVP', 'Cronología de RSVP'),
  ('stats.cumulative_accepted', 'Kumulative Zusagen', 'Cumulative Accepted', 'Acceptés Cumulés', 'Aceptados Acumulados'),
  ('stats.cumulative_declined', 'Kumulative Absagen', 'Cumulative Declined', 'Déclinés Cumulés', 'Rechazados Acumulados'),
  ('stats.daily_accepted', 'Tägliche Zusagen', 'Daily Accepted', 'Acceptés Quotidiens', 'Aceptados Diarios'),
  ('stats.daily_declined', 'Tägliche Absagen', 'Daily Declined', 'Déclinés Quotidiens', 'Rechazados Diarios'),
  ('stats.date', 'Datum', 'Date', 'Date', 'Fecha'),
  ('stats.responses', 'Antworten', 'Responses', 'Réponses', 'Respuestas'),
  ('stats.guest_groups', 'Gästegruppen', 'Guest Groups', 'Groupes d\'Invités', 'Grupos de Invitados'),
  ('stats.guest_group', 'Gästegruppe', 'Guest Group', 'Groupe d\'Invités', 'Grupo de Invitados'),
  ('stats.guests', 'Gäste', 'Guests', 'Invités', 'Invitados'),
  ('stats.table_statistics', 'Tischstatistiken', 'Table Statistics', 'Statistiques des Tables', 'Estadísticas de Mesas'),
  ('stats.table', 'Tisch', 'Table', 'Table', 'Mesa'),
  ('stats.capacity', 'Kapazität', 'Capacity', 'Capacité', 'Capacidad'),
  ('stats.assigned', 'Zugewiesen', 'Assigned', 'Assignés', 'Asignados'),
  ('stats.available', 'Verfügbar', 'Available', 'Disponibles', 'Disponibles'),
  ('stats.utilization', 'Auslastung', 'Utilization', 'Utilisation', 'Utilización'),
  ('stats.dietary_requirements', 'Ernährungsanforderungen', 'Dietary Requirements', 'Exigences Alimentaires', 'Requisitos Dietéticos'),
  ('stats.with_allergies', 'Mit Allergien', 'With Allergies', 'Avec Allergies', 'Con Alergias');
