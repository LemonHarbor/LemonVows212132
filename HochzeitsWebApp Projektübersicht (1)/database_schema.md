# LemonVows Datenbankschema

## Übersicht
Dieses Dokument beschreibt das Datenbankschema für die LemonVows Hochzeitsplanungs-Plattform, implementiert mit Supabase.

## Tabellen

### users
- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `password_hash`: String
- `first_name`: String
- `last_name`: String
- `created_at`: Timestamp
- `updated_at`: Timestamp
- `role`: Enum ('admin', 'couple', 'witness', 'guest')
- `language`: Enum ('de', 'en', 'fr', 'es')
- `subscription_tier`: Enum ('free', 'basic', 'premium')
- `subscription_expiry`: Timestamp

### weddings
- `id`: UUID (Primary Key)
- `couple_id`: UUID (Foreign Key -> users.id)
- `wedding_date`: Date
- `wedding_time`: Time
- `location_name`: String
- `location_address`: String
- `location_coordinates`: Point (Latitude, Longitude)
- `created_at`: Timestamp
- `updated_at`: Timestamp
- `theme`: Enum ('boho', 'elegant', 'vintage', 'classic', 'modern')
- `max_guests`: Integer
- `budget_total`: Decimal
- `currency`: String

### guests
- `id`: UUID (Primary Key)
- `wedding_id`: UUID (Foreign Key -> weddings.id)
- `user_id`: UUID (Foreign Key -> users.id, Nullable)
- `first_name`: String
- `last_name`: String
- `email`: String
- `phone`: String
- `rsvp_status`: Enum ('pending', 'confirmed', 'declined')
- `rsvp_date`: Timestamp
- `plus_one`: Boolean
- `plus_one_name`: String
- `accommodation_needed`: Boolean
- `group`: String
- `table_id`: UUID (Foreign Key -> tables.id, Nullable)
- `seat_number`: Integer
- `dietary_restrictions`: String[]
- `notes`: Text

### tables
- `id`: UUID (Primary Key)
- `wedding_id`: UUID (Foreign Key -> weddings.id)
- `name`: String
- `shape`: Enum ('round', 'rectangular', 'square', 'oval', 'custom')
- `capacity`: Integer
- `position_x`: Float
- `position_y`: Float
- `rotation`: Float
- `width`: Float
- `height`: Float
- `custom_shape_data`: JSON (für benutzerdefinierte Tischformen)

### budget_items
- `id`: UUID (Primary Key)
- `wedding_id`: UUID (Foreign Key -> weddings.id)
- `category`: String
- `description`: String
- `estimated_cost`: Decimal
- `actual_cost`: Decimal
- `paid`: Boolean
- `payment_date`: Date
- `vendor_id`: UUID (Foreign Key -> vendors.id, Nullable)
- `notes`: Text

### vendors
- `id`: UUID (Primary Key)
- `wedding_id`: UUID (Foreign Key -> weddings.id)
- `name`: String
- `category`: String
- `contact_person`: String
- `email`: String
- `phone`: String
- `website`: String
- `address`: String
- `notes`: Text
- `status`: Enum ('potential', 'contacted', 'booked', 'confirmed', 'paid')

### timeline_events
- `id`: UUID (Primary Key)
- `wedding_id`: UUID (Foreign Key -> weddings.id)
- `title`: String
- `description`: Text
- `start_time`: Timestamp
- `end_time`: Timestamp
- `location`: String
- `responsible_person`: String
- `status`: Enum ('planned', 'in_progress', 'completed')
- `notes`: Text

### moodboard_items
- `id`: UUID (Primary Key)
- `wedding_id`: UUID (Foreign Key -> weddings.id)
- `title`: String
- `image_url`: String
- `source_url`: String
- `category`: String
- `color_palette`: String[]
- `notes`: Text

### music_requests
- `id`: UUID (Primary Key)
- `wedding_id`: UUID (Foreign Key -> weddings.id)
- `guest_id`: UUID (Foreign Key -> guests.id, Nullable)
- `song_title`: String
- `artist`: String
- `spotify_uri`: String
- `votes`: Integer
- `notes`: Text

### photos
- `id`: UUID (Primary Key)
- `wedding_id`: UUID (Foreign Key -> weddings.id)
- `uploader_id`: UUID (Foreign Key -> users.id)
- `file_url`: String
- `thumbnail_url`: String
- `title`: String
- `description`: Text
- `upload_date`: Timestamp
- `tags`: String[]
- `privacy_level`: Enum ('private', 'couple_only', 'witnesses', 'all_guests', 'public')
- `auto_delete_date`: Timestamp

### gifts
- `id`: UUID (Primary Key)
- `wedding_id`: UUID (Foreign Key -> weddings.id)
- `name`: String
- `description`: Text
- `price`: Decimal
- `image_url`: String
- `link`: String
- `status`: Enum ('available', 'reserved', 'purchased')
- `reserved_by`: UUID (Foreign Key -> guests.id, Nullable)

### witness_tasks
- `id`: UUID (Primary Key)
- `wedding_id`: UUID (Foreign Key -> weddings.id)
- `witness_id`: UUID (Foreign Key -> users.id)
- `title`: String
- `description`: Text
- `due_date`: Date
- `status`: Enum ('pending', 'in_progress', 'completed')
- `shared_costs`: Boolean
- `cost_amount`: Decimal
- `notes`: Text

### shared_expenses
- `id`: UUID (Primary Key)
- `wedding_id`: UUID (Foreign Key -> weddings.id)
- `title`: String
- `description`: Text
- `total_amount`: Decimal
- `date`: Date
- `paid_by`: UUID (Foreign Key -> users.id)
- `status`: Enum ('pending', 'settled')

### expense_shares
- `id`: UUID (Primary Key)
- `expense_id`: UUID (Foreign Key -> shared_expenses.id)
- `user_id`: UUID (Foreign Key -> users.id)
- `amount`: Decimal
- `status`: Enum ('pending', 'paid')
- `payment_date`: Date

### notifications
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key -> users.id)
- `wedding_id`: UUID (Foreign Key -> weddings.id)
- `title`: String
- `message`: Text
- `type`: Enum ('reminder', 'update', 'alert')
- `created_at`: Timestamp
- `read`: Boolean
- `read_at`: Timestamp
- `link`: String

## Beziehungen

1. Ein Benutzer (users) kann mehrere Hochzeiten (weddings) haben (als Paar, Trauzeuge oder Gast)
2. Eine Hochzeit (weddings) hat viele Gäste (guests)
3. Eine Hochzeit (weddings) hat viele Tische (tables)
4. Ein Gast (guests) kann einem Tisch (tables) zugeordnet sein
5. Eine Hochzeit (weddings) hat viele Budgetposten (budget_items)
6. Eine Hochzeit (weddings) hat viele Lieferanten (vendors)
7. Ein Budgetposten (budget_items) kann einem Lieferanten (vendors) zugeordnet sein
8. Eine Hochzeit (weddings) hat viele Zeitplanereignisse (timeline_events)
9. Eine Hochzeit (weddings) hat viele Moodboard-Elemente (moodboard_items)
10. Eine Hochzeit (weddings) hat viele Musikwünsche (music_requests)
11. Ein Gast (guests) kann Musikwünsche (music_requests) einreichen
12. Eine Hochzeit (weddings) hat viele Fotos (photos)
13. Ein Benutzer (users) kann Fotos (photos) hochladen
14. Eine Hochzeit (weddings) hat viele Geschenke (gifts)
15. Ein Gast (guests) kann Geschenke (gifts) reservieren
16. Eine Hochzeit (weddings) hat viele Trauzeugenaufgaben (witness_tasks)
17. Ein Benutzer (users) kann Trauzeugenaufgaben (witness_tasks) haben
18. Eine Hochzeit (weddings) hat viele geteilte Ausgaben (shared_expenses)
19. Ein Benutzer (users) kann geteilte Ausgaben (shared_expenses) bezahlen
20. Eine geteilte Ausgabe (shared_expenses) hat viele Ausgabenanteile (expense_shares)
21. Ein Benutzer (users) kann viele Ausgabenanteile (expense_shares) haben
22. Ein Benutzer (users) hat viele Benachrichtigungen (notifications)
23. Eine Hochzeit (weddings) kann viele Benachrichtigungen (notifications) generieren

## Indizes

- `users`: email
- `guests`: wedding_id, email, rsvp_status
- `tables`: wedding_id
- `budget_items`: wedding_id, category
- `vendors`: wedding_id, category
- `timeline_events`: wedding_id, start_time
- `music_requests`: wedding_id, votes
- `photos`: wedding_id, upload_date, privacy_level
- `notifications`: user_id, read

## Sicherheitsregeln

- Brautpaar (couple): Vollzugriff auf alle Daten ihrer Hochzeit
- Trauzeugen (witness): Lesezugriff auf die meisten Daten, Schreibzugriff auf bestimmte Bereiche (Trauzeugenaufgaben, geteilte Ausgaben)
- Gäste (guest): Eingeschränkter Zugriff (RSVP, Musikwünsche, Fotos hochladen)
- Anonyme Benutzer: Kein Zugriff
