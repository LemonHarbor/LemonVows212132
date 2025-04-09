import { Database } from "@/types/supabase";

export type Invitation = Database["public"]["Tables"]["invitations"]["Row"];
export type InvitationInsert = Database["public"]["Tables"]["invitations"]["Insert"];
export type InvitationUpdate = Database["public"]["Tables"]["invitations"]["Update"];
