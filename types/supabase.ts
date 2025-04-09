export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      guests: {
        Row: {
          id: string
          user_id: string
          first_name: string
          last_name: string
          email: string | null
          phone: string | null
          rsvp_status: string
          dietary_restrictions: string | null
          plus_one: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          first_name: string
          last_name: string
          email?: string | null
          phone?: string | null
          rsvp_status?: string
          dietary_restrictions?: string | null
          plus_one?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          first_name?: string
          last_name?: string
          email?: string | null
          phone?: string | null
          rsvp_status?: string
          dietary_restrictions?: string | null
          plus_one?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          start_time: string
          end_time: string
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          start_time: string
          end_time: string
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string
          location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vendors: {
        Row: {
          id: string
          user_id: string
          name: string
          category: string
          contact_name: string | null
          phone: string | null
          email: string | null
          website: string | null
          price: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          category: string
          contact_name?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          price?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          category?: string
          contact_name?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          price?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      budget_items: {
        Row: {
          id: string
          user_id: string
          category: string
          item_name: string
          estimated_cost: number
          actual_cost: number | null
          paid: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category: string
          item_name: string
          estimated_cost: number
          actual_cost?: number | null
          paid?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category?: string
          item_name?: string
          estimated_cost?: number
          actual_cost?: number | null
          paid?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invitations: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          created_at?: string
          updated_at?: string
        }
      }
      photos: {
        Row: {
          id: string
          user_id: string
          storage_path: string
          title: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          storage_path: string
          title?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          storage_path?: string
          title?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      registry_links: {
        Row: {
          id: string
          user_id: string
          title: string
          url: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          url: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          url?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
