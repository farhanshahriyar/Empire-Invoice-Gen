export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string
          preferred_payment_method: string | null
          shipping_city: string | null
          shipping_state: string | null
          shipping_street: string | null
          shipping_zip: string | null
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          phone: string
          preferred_payment_method?: string | null
          shipping_city?: string | null
          shipping_state?: string | null
          shipping_street?: string | null
          shipping_zip?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          preferred_payment_method?: string | null
          shipping_city?: string | null
          shipping_state?: string | null
          shipping_street?: string | null
          shipping_zip?: string | null
          status?: string
        }
        Relationships: []
      }
      // invoices: {
      //   Row: {
      //     amount: number
      //     created_at: string
      //     customer: string
      //     date: string
      //     email: string | null
      //     id: string
      //     invoice_number: string
      //     phone: string | null
      //     status: string
      //   }
      //   Insert: {
      //     amount?: number
      //     created_at?: string
      //     customer: string
      //     date: string
      //     email?: string | null
      //     id?: string
      //     invoice_number: string
      //     phone?: string | null
      //     status?: string
      //   }
      //   Update: {
      //     amount?: number
      //     created_at?: string
      //     customer?: string
      //     date?: string
      //     email?: string | null
      //     id?: string
      //     invoice_number?: string
      //     phone?: string | null
      //     status?: string
      //   }
      //   Relationships: []
      // }

      invoices: {
        Row: {
          amount: number; // Existing
          created_at: string; // Existing
          customer: string; // Existing
          date: string; // Existing
          email: string | null; // Corrected to match 'customer_email'
          id: string; // Existing
          invoice_number: string; // Existing
          phone: string | null; // Existing
          status: string; // Existing
        };
        Insert: {
          amount?: number; // Existing
          created_at?: string; // Existing
          customer: string; // Existing
          date: string; // Existing
          email?: string | null; // Corrected to match 'customer_email'
          id?: string; // Existing
          invoice_number: string; // Existing
          phone?: string | null; // Existing
          status?: string; // Existing
        };
        Update: {
          amount?: number; // Existing
          created_at?: string; // Existing
          customer?: string; // Existing
          date?: string; // Existing
          email?: string | null; // Corrected to match 'customer_email'
          id?: string; // Existing
          invoice_number?: string; // Existing
          phone?: string | null; // Existing
          status?: string; // Existing
        };
      };
      

      // --------------------------//
      // with invoice functionality //
      // --------------------------//

      // orders: {
      //   Row: {
      //     billing_city: string | null
      //     billing_state: string | null
      //     billing_street: string | null
      //     billing_zip: string | null
      //     created_at: string
      //     id: string
      //     invoice_id: string
      //     payment_method: string
      //     product_id: string | null
      //     product_name: string | null
      //     product_price: number | null
      //     shipping_city: string
      //     shipping_state: string
      //     shipping_street: string
      //     shipping_zip: string
      //     status: string
      //     transaction_id: string | null
      //   }
      //   Insert: {
      //     billing_city?: string | null
      //     billing_state?: string | null
      //     billing_street?: string | null
      //     billing_zip?: string | null
      //     created_at?: string
      //     id?: string
      //     invoice_id: string
      //     payment_method: string
      //     product_id?: string | null
      //     product_name?: string | null
      //     product_price?: number | null
      //     shipping_city: string
      //     shipping_state: string
      //     shipping_street: string
      //     shipping_zip: string
      //     status?: string
      //     transaction_id?: string | null
      //   }
      //   Update: {
      //     billing_city?: string | null
      //     billing_state?: string | null
      //     billing_street?: string | null
      //     billing_zip?: string | null
      //     created_at?: string
      //     id?: string
      //     invoice_id?: string
      //     payment_method?: string
      //     product_id?: string | null
      //     product_name?: string | null
      //     product_price?: number | null
      //     shipping_city?: string
      //     shipping_state?: string
      //     shipping_street?: string
      //     shipping_zip?: string
      //     status?: string
      //     transaction_id?: string | null
      //   }
      //   Relationships: [
      //     {
      //       foreignKeyName: "orders_invoice_id_fkey"
      //       columns: ["invoice_id"]
      //       isOneToOne: false
      //       referencedRelation: "invoices"
      //       referencedColumns: ["id"]
      //     },
      //   ]
      // }

      // without invoice functionality 16/1/2025
      orders: {
        Row: {
          billing_city: string | null;
          billing_state: string | null;
          billing_street: string | null;
          billing_zip: string | null;
          created_at: string;
          id: string;
          payment_method: string;
          product_id: string | null;
          product_name: string | null;
          product_price: number | null;
          shipping_city: string;
          shipping_state: string;
          shipping_street: string;
          shipping_zip: string;
          status: string;
          transaction_id: string | null;
          customer_name: string | null; // NEW FIELD
          customer_email: string | null; // NEW FIELD
          customer_phone: string | null; // NEW FIELD
          order_date: string | null; // NEW FIELD
          quantity: number; // NEW FIELD
        };
        Insert: {
          billing_city?: string | null;
          billing_state?: string | null;
          billing_street?: string | null;
          billing_zip?: string | null;
          created_at?: string;
          id?: string;
          payment_method: string;
          product_id?: string | null;
          product_name?: string | null;
          product_price?: number | null;
          shipping_city: string;
          shipping_state: string;
          shipping_street: string;
          shipping_zip: string;
          status?: string;
          transaction_id?: string | null;
          customer_name?: string | null; // NEW FIELD
          customer_email?: string | null; // NEW FIELD
          customer_phone?: string | null; // NEW FIELD
          order_date?: string; // NEW FIELD
          quantity: number; // NEW FIELD
        };
        Update: {
          billing_city?: string | null;
          billing_state?: string | null;
          billing_street?: string | null;
          billing_zip?: string | null;
          created_at?: string;
          id?: string;
          payment_method?: string;
          product_id?: string | null;
          product_name?: string | null;
          product_price?: number | null;
          shipping_city?: string;
          shipping_state?: string;
          shipping_street?: string;
          shipping_zip?: string;
          status?: string;
          transaction_id?: string | null;
          customer_name?: string | null; // NEW FIELD
          customer_email?: string | null; // NEW FIELD
          customer_phone?: string | null; // NEW FIELD
          order_date?: string; // NEW FIELD
          quantity?: number; // NEW FIELD
        };
        Relationships: [];
      };
      
      // --------------------------//
      products: {
        Row: {
          created_at: string
          id: string
          min_stock: number
          name: string
          price: number
          sku: string
          stock: number
        }
        Insert: {
          created_at?: string
          id?: string
          min_stock?: number
          name: string
          price?: number
          sku: string
          stock?: number
        }
        Update: {
          created_at?: string
          id?: string
          min_stock?: number
          name?: string
          price?: number
          sku?: string
          stock?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
    PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
    PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof PublicSchema["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof PublicSchema["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof PublicSchema["Enums"]
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof PublicSchema["CompositeTypes"]
  | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never
