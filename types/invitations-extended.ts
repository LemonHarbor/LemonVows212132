import { Database } from "@/types/supabase";

// Basis-Typen aus der Datenbank
export type InvitationBase = Database["public"]["Tables"]["invitations"]["Row"];
export type InvitationBaseInsert = Database["public"]["Tables"]["invitations"]["Insert"];
export type InvitationBaseUpdate = Database["public"]["Tables"]["invitations"]["Update"];

// Erweiterte Typen für die Frontend-Komponenten
export interface Invitation extends InvitationBase {
  content?: string;
  theme?: string;
  is_published?: boolean;
  custom_url?: string | null;
}

export interface InvitationInsert extends InvitationBaseInsert {
  content?: string;
  theme?: string;
  is_published?: boolean;
  custom_url?: string | null;
}

export interface InvitationUpdate extends InvitationBaseUpdate {
  content?: string;
  theme?: string;
  is_published?: boolean;
  custom_url?: string | null;
}
