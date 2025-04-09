import { Database } from "@/types/supabase";

export type Guest = Database["public"]["Tables"]["guests"]["Row"];
export type GuestInsert = Database["public"]["Tables"]["guests"]["Insert"];
export type GuestUpdate = Database["public"]["Tables"]["guests"]["Update"];

export type RsvpStatus = "pending" | "confirmed" | "declined";

export const rsvpStatusOptions = [
  { value: "pending", label: "Ausstehend" },
  { value: "confirmed", label: "Zugesagt" },
  { value: "declined", label: "Abgesagt" }
];
