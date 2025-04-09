import { Database } from "@/types/supabase";

export type Registry = Database["public"]["Tables"]["registry_links"]["Row"];
export type RegistryInsert = Database["public"]["Tables"]["registry_links"]["Insert"];
export type RegistryUpdate = Database["public"]["Tables"]["registry_links"]["Update"];
