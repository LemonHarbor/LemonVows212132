import { Database } from "@/types/supabase";

export type BudgetItem = Database["public"]["Tables"]["budget_items"]["Row"];
export type BudgetItemInsert = Database["public"]["Tables"]["budget_items"]["Insert"];
export type BudgetItemUpdate = Database["public"]["Tables"]["budget_items"]["Update"];

export const budgetCategories = [
  "Veranstaltungsort",
  "Catering",
  "Fotografie",
  "Videografie",
  "Musik/Unterhaltung",
  "Blumen/Dekoration",
  "Kleidung/Accessoires",
  "Ringe",
  "Transport",
  "Einladungen/Papeterie",
  "Hochzeitstorte/Desserts",
  "Geschenke",
  "Unterkunft",
  "Sonstiges"
];
