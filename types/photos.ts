import { Database } from "@/types/supabase";

export type Photo = Database["public"]["Tables"]["photos"]["Row"];
export type PhotoInsert = Database["public"]["Tables"]["photos"]["Insert"];
export type PhotoUpdate = Database["public"]["Tables"]["photos"]["Update"];
