export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      product_images: {
        Row: {
          alt_en: string | null;
          alt_kn: string | null;
          created_at: string;
          id: number;
          image_url: string;
          is_primary: boolean;
          product_id: number;
          sort_order: number;
          storage_path: string;
        };
        Insert: {
          alt_en?: string | null;
          alt_kn?: string | null;
          created_at?: string;
          id?: never;
          image_url: string;
          is_primary?: boolean;
          product_id: number;
          sort_order?: number;
          storage_path: string;
        };
        Update: {
          alt_en?: string | null;
          alt_kn?: string | null;
          created_at?: string;
          id?: never;
          image_url?: string;
          is_primary?: boolean;
          product_id?: number;
          sort_order?: number;
          storage_path?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          brand: string | null;
          category: string;
          created_at: string;
          description_en: string | null;
          description_kn: string | null;
          id: number;
          image_url: string | null;
          is_active: boolean;
          is_featured: boolean;
          name_en: string;
          name_kn: string | null;
          price: number | null;
          slug: string;
          sort_order: number;
          updated_at: string;
          wheel_size: string | null;
        };
        Insert: {
          brand?: string | null;
          category: string;
          created_at?: string;
          description_en?: string | null;
          description_kn?: string | null;
          id?: never;
          image_url?: string | null;
          is_active?: boolean;
          is_featured?: boolean;
          name_en: string;
          name_kn?: string | null;
          price?: number | null;
          slug: string;
          sort_order?: number;
          updated_at?: string;
          wheel_size?: string | null;
        };
        Update: {
          brand?: string | null;
          category?: string;
          created_at?: string;
          description_en?: string | null;
          description_kn?: string | null;
          id?: never;
          image_url?: string | null;
          is_active?: boolean;
          is_featured?: boolean;
          name_en?: string;
          name_kn?: string | null;
          price?: number | null;
          slug?: string;
          sort_order?: number;
          updated_at?: string;
          wheel_size?: string | null;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
