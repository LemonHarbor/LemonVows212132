export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'admin' | 'customer';
          created_at: string;
          last_login: string | null;
          status: 'active' | 'inactive';
          avatar_url: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role: 'admin' | 'customer';
          created_at?: string;
          last_login?: string | null;
          status: 'active' | 'inactive';
          avatar_url?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'admin' | 'customer';
          created_at?: string;
          last_login?: string | null;
          status?: 'active' | 'inactive';
          avatar_url?: string | null;
        };
      };
      weddings: {
        Row: {
          id: string;
          name: string;
          date: string;
          user_id: string;
          plan: 'free' | 'basic' | 'premium';
          status: 'active' | 'archived';
          guest_count: number;
          created_at: string;
          last_active: string | null;
          custom_domain: string | null;
          custom_colors: any | null;
        };
        Insert: {
          id?: string;
          name: string;
          date: string;
          user_id: string;
          plan: 'free' | 'basic' | 'premium';
          status: 'active' | 'archived';
          guest_count?: number;
          created_at?: string;
          last_active?: string | null;
          custom_domain?: string | null;
          custom_colors?: any | null;
        };
        Update: {
          id?: string;
          name?: string;
          date?: string;
          user_id?: string;
          plan?: 'free' | 'basic' | 'premium';
          status?: 'active' | 'archived';
          guest_count?: number;
          created_at?: string;
          last_active?: string | null;
          custom_domain?: string | null;
          custom_colors?: any | null;
        };
      };
      guests: {
        Row: {
          id: string;
          wedding_id: string;
          first_name: string;
          last_name: string;
          email: string | null;
          phone: string | null;
          group_name: string | null;
          rsvp_status: 'confirmed' | 'pending' | 'declined' | null;
          dietary_restrictions: string[] | null;
          plus_one: boolean;
          plus_one_name: string | null;
          accommodation_needed: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          first_name: string;
          last_name: string;
          email?: string | null;
          phone?: string | null;
          group_name?: string | null;
          rsvp_status?: 'confirmed' | 'pending' | 'declined' | null;
          dietary_restrictions?: string[] | null;
          plus_one?: boolean;
          plus_one_name?: string | null;
          accommodation_needed?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wedding_id?: string;
          first_name?: string;
          last_name?: string;
          email?: string | null;
          phone?: string | null;
          group_name?: string | null;
          rsvp_status?: 'confirmed' | 'pending' | 'declined' | null;
          dietary_restrictions?: string[] | null;
          plus_one?: boolean;
          plus_one_name?: string | null;
          accommodation_needed?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tables: {
        Row: {
          id: string;
          wedding_id: string;
          name: string;
          shape: 'round' | 'rectangular' | 'square' | 'oval' | 'custom';
          capacity: number;
          rotation: number;
          position_x: number;
          position_y: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          name: string;
          shape: 'round' | 'rectangular' | 'square' | 'oval' | 'custom';
          capacity: number;
          rotation?: number;
          position_x: number;
          position_y: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wedding_id?: string;
          name?: string;
          shape?: 'round' | 'rectangular' | 'square' | 'oval' | 'custom';
          capacity?: number;
          rotation?: number;
          position_x?: number;
          position_y?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      seats: {
        Row: {
          id: string;
          table_id: string;
          guest_id: string | null;
          position: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          table_id: string;
          guest_id?: string | null;
          position: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          table_id?: string;
          guest_id?: string | null;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      budget_categories: {
        Row: {
          id: string;
          wedding_id: string;
          name: string;
          planned_amount: number;
          color: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          name: string;
          planned_amount: number;
          color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wedding_id?: string;
          name?: string;
          planned_amount?: number;
          color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      budget_expenses: {
        Row: {
          id: string;
          category_id: string;
          description: string;
          amount: number;
          date: string;
          paid: boolean;
          receipt_url: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          description: string;
          amount: number;
          date: string;
          paid?: boolean;
          receipt_url?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          description?: string;
          amount?: number;
          date?: string;
          paid?: boolean;
          receipt_url?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          wedding_id: string;
          amount: number;
          currency: string;
          status: 'completed' | 'pending' | 'failed';
          method: 'credit_card' | 'paypal' | 'bank_transfer';
          date: string;
          plan: 'basic' | 'premium';
          duration: 'monthly' | 'yearly' | 'one_time';
          invoice_url: string | null;
          receipt_url: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          wedding_id: string;
          amount: number;
          currency?: string;
          status: 'completed' | 'pending' | 'failed';
          method: 'credit_card' | 'paypal' | 'bank_transfer';
          date?: string;
          plan: 'basic' | 'premium';
          duration: 'monthly' | 'yearly' | 'one_time';
          invoice_url?: string | null;
          receipt_url?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          wedding_id?: string;
          amount?: number;
          currency?: string;
          status?: 'completed' | 'pending' | 'failed';
          method?: 'credit_card' | 'paypal' | 'bank_transfer';
          date?: string;
          plan?: 'basic' | 'premium';
          duration?: 'monthly' | 'yearly' | 'one_time';
          invoice_url?: string | null;
          receipt_url?: string | null;
        };
      };
    };
  };
};
