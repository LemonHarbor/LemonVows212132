# [Bestehenden Inhalt beibehalten]

## Supabase Setup

### Tabellen importieren
1. In Supabase Dashboard: SQL Editor öffnen
2. Inhalt von `supabase-schema.sql` einfügen
3. Query ausführen
4. Row Level Security aktivieren

### Environment Variablen
1. `.env.example` zu `.env` kopieren
2. Werte mit echten Zugangsdaten ersetzen:
   - `VITE_SUPABASE_URL`: Finden Sie im Supabase Dashboard unter Project Settings
   - `VITE_SUPABASE_KEY`: Öffentlicher "anon" Key aus Supabase

### Sicherheitseinstellungen
1. Row Level Security (RLS) aktivieren:
```sql
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
-- Für alle Tabellen wiederholen
```

2. Authentifizierung einrichten:
- E-Mail/Passwort aktivieren
- Google Auth optional aktivieren

## Erste Schritte nach Setup
1. Testdaten generieren:
```javascript
// In der Konsole
TestDataGenerator.seedDatabase();
```

2. Admin-Benutzer anlegen:
```sql
INSERT INTO user_roles (user_id, role)
VALUES ('user-uuid', 'admin');