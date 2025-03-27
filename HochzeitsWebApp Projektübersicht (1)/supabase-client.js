// Supabase Client Setup
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_KEY'
export const supabase = createClient(supabaseUrl, supabaseKey)

/* Für Manus:
1. Projekt in Supabase erstellen
2. URL und Key ersetzen
3. Tabellenstruktur anpassen (siehe database_schema.md)
*/