export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      cart_items: {
        Row: {
          cart_id: string;
          created_at: string;
          id: number;
          line_total: number;
          product_id: number;
          quantity: number;
          unit_price: number;
          updated_at: string;
        };
        Insert: {
          cart_id: string;
          created_at?: string;
          id?: never;
          line_total: number;
          product_id: number;
          quantity: number;
          unit_price: number;
          updated_at?: string;
        };
        Update: {
          cart_id?: string;
          created_at?: string;
          id?: never;
          line_total?: number;
          product_id?: number;
          quantity?: number;
          unit_price?: number;
          updated_at?: string;
        };
      };
      carts: {
        Row: {
          checkout_url: string | null;
          created_at: string;
          currency: string;
          id: string;
          status: string;
          subtotal_amount: number;
          tax_amount: number;
          total_amount: number;
          total_quantity: number;
          updated_at: string;
        };
        Insert: {
          checkout_url?: string | null;
          created_at?: string;
          currency?: string;
          id?: string;
          status?: string;
          subtotal_amount?: number;
          tax_amount?: number;
          total_amount?: number;
          total_quantity?: number;
          updated_at?: string;
        };
        Update: {
          checkout_url?: string | null;
          created_at?: string;
          currency?: string;
          id?: string;
          status?: string;
          subtotal_amount?: number;
          tax_amount?: number;
          total_amount?: number;
          total_quantity?: number;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          created_at: string;
          id: number;
          name: string;
          slug: string;
        };
      };
      menu_items: {
        Row: {
          created_at: string;
          id: number;
          menu_id: number;
          path: string;
          position: number;
          title: string;
          updated_at: string;
        };
      };
      menus: {
        Row: {
          created_at: string;
          handle: string;
          id: number;
          title: string;
          updated_at: string;
        };
      };
      order_items: {
        Row: {
          id: number;
          line_total: number;
          order_id: number;
          product_id: number;
          quantity: number;
          unit_price: number;
        };
        Insert: {
          id?: never;
          line_total: number;
          order_id: number;
          product_id: number;
          quantity: number;
          unit_price: number;
        };
      };
      orders: {
        Row: {
          cart_id: string | null;
          checkout_url: string | null;
          created_at: string;
          currency: string;
          customer_email: string | null;
          customer_name: string | null;
          external_reference: string | null;
          id: number;
          mercadopago_payment_id: string | null;
          mercadopago_preference_id: string | null;
          payment_status: string;
          raw_checkout_response: Json | null;
          status: string;
          total_amount: number;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          cart_id?: string | null;
          checkout_url?: string | null;
          created_at?: string;
          currency?: string;
          customer_email?: string | null;
          customer_name?: string | null;
          external_reference?: string | null;
          id?: never;
          mercadopago_payment_id?: string | null;
          mercadopago_preference_id?: string | null;
          payment_status?: string;
          raw_checkout_response?: Json | null;
          status?: string;
          total_amount: number;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          cart_id?: string | null;
          checkout_url?: string | null;
          created_at?: string;
          currency?: string;
          customer_email?: string | null;
          customer_name?: string | null;
          external_reference?: string | null;
          id?: never;
          mercadopago_payment_id?: string | null;
          mercadopago_preference_id?: string | null;
          payment_status?: string;
          raw_checkout_response?: Json | null;
          status?: string;
          total_amount?: number;
          updated_at?: string;
          user_id?: string | null;
        };
      };
      pages: {
        Row: {
          body: string;
          body_summary: string;
          created_at: string;
          handle: string;
          id: number;
          published: boolean;
          seo_description: string | null;
          seo_title: string | null;
          title: string;
          updated_at: string;
        };
      };
      payments: {
        Row: {
          amount: number;
          created_at: string;
          gateway: string;
          gateway_payment_id: string | null;
          id: number;
          order_id: number;
          raw_payload: Json | null;
          status: string;
          updated_at: string;
        };
      };
      product_images: {
        Row: {
          alt_text: string | null;
          bucket: string | null;
          created_at: string;
          id: number;
          image_url: string;
          position: number;
          product_id: number;
          storage_path: string | null;
        };
      };
      products: {
        Row: {
          active: boolean;
          category_id: number | null;
          created_at: string;
          description: string | null;
          id: number;
          name: string;
          price: number;
          slug: string;
          updated_at: string;
        };
      };
      profiles: {
        Row: {
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
          role: string;
          updated_at: string;
        };
      };
    };
    Views: {
      storefront_products: {
        Row: {
          active: boolean | null;
          category_id: number | null;
          category_name: string | null;
          category_slug: string | null;
          created_at: string | null;
          description: string | null;
          id: number | null;
          images: Json | null;
          name: string | null;
          price: number | null;
          slug: string | null;
          updated_at: string | null;
        };
      };
    };
    Functions: {
      process_mercado_pago_webhook: {
        Args: {
          p_amount?: number;
          p_external_reference: string;
          p_gateway_payment_id?: string;
          p_payload?: Json;
          p_status?: string;
        };
        Returns: {
          order_id: number;
          order_status: string;
          payment_status: string;
        }[];
      };
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;
type DefaultSchema = DatabaseWithoutInternals["public"];

export type Tables<
  TableName extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]),
> = (DefaultSchema["Tables"] & DefaultSchema["Views"])[TableName] extends {
  Row: infer Row;
}
  ? Row
  : never;

export type TablesInsert<TableName extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][TableName] extends {
    Insert: infer Insert;
  }
    ? Insert
    : never;

export type TablesUpdate<TableName extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][TableName] extends {
    Update: infer Update;
  }
    ? Update
    : never;
