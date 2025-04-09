import { Database } from "@/types/supabase";

export type Registry = Database["public"]["Tables"]["registries"]["Row"];
export type RegistryInsert = Database["public"]["Tables"]["registries"]["Insert"];
export type RegistryUpdate = Database["public"]["Tables"]["registries"]["Update"];
