import { Database } from "@/types/supabase";

export type Vendor = Database["public"]["Tables"]["vendors"]["Row"];
export type VendorInsert = Database["public"]["Tables"]["vendors"]["Insert"];
export type VendorUpdate = Database["public"]["Tables"]["vendors"]["Update"];

export const vendorCategories = [
  "Catering",
  "Fotografie",
  "Videografie",
  "Musik/DJ",
  "Blumen/Dekoration",
  "Location",
  "Hochzeitsplaner",
  "Kleidung/Accessoires",
  "Transport",
  "Torte/Desserts",
  "Sonstiges"
];
