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
      device_categories: {
        Row: {
          id: string
          slug: string
          name_ru: string
          name_en: string
          name_cz: string
          icon: string | null
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name_ru: string
          name_en: string
          name_cz: string
          icon?: string | null
          order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name_ru?: string
          name_en?: string
          name_cz?: string
          icon?: string | null
          order?: number
          created_at?: string
          updated_at?: string
        }
      }
      device_models: {
        Row: {
          id: string
          category_id: string
          slug: string
          name: string
          series: string | null
          image_url: string | null
          release_year: number | null
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          slug: string
          name: string
          series?: string | null
          image_url?: string | null
          release_year?: number | null
          order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          slug?: string
          name?: string
          series?: string | null
          image_url?: string | null
          release_year?: number | null
          order?: number
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          slug: string
          name_ru: string
          name_en: string
          name_cz: string
          description_ru: string | null
          description_en: string | null
          description_cz: string | null
          service_type: 'main' | 'extra'
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name_ru: string
          name_en: string
          name_cz: string
          description_ru?: string | null
          description_en?: string | null
          description_cz?: string | null
          service_type?: 'main' | 'extra'
          order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name_ru?: string
          name_en?: string
          name_cz?: string
          description_ru?: string | null
          description_en?: string | null
          description_cz?: string | null
          service_type?: 'main' | 'extra'
          order?: number
          created_at?: string
          updated_at?: string
        }
      }
      prices: {
        Row: {
          id: string
          model_id: string
          service_id: string
          price: number | null
          price_type: 'fixed' | 'from' | 'free' | 'on_request'
          duration_minutes: number | null
          warranty_months: number | null
          note_ru: string | null
          note_en: string | null
          note_cz: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          model_id: string
          service_id: string
          price?: number | null
          price_type?: 'fixed' | 'from' | 'free' | 'on_request'
          duration_minutes?: number | null
          warranty_months?: number | null
          note_ru?: string | null
          note_en?: string | null
          note_cz?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          model_id?: string
          service_id?: string
          price?: number | null
          price_type?: 'fixed' | 'from' | 'free' | 'on_request'
          duration_minutes?: number | null
          warranty_months?: number | null
          note_ru?: string | null
          note_en?: string | null
          note_cz?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      category_services: {
        Row: {
          id: string
          category_id: string
          service_id: string
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          category_id: string
          service_id: string
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          service_id?: string
          is_primary?: boolean
          created_at?: string
        }
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
  }
}

// Вспомогательные типы для удобного использования
export type Category = Database['public']['Tables']['device_categories']['Row']
export type DeviceModel = Database['public']['Tables']['device_models']['Row']
export type Service = Database['public']['Tables']['services']['Row']
export type Price = Database['public']['Tables']['prices']['Row']
export type CategoryService = Database['public']['Tables']['category_services']['Row']

// Расширенные типы с relations
export type DeviceModelWithCategory = DeviceModel & {
  category: Category
}

export type PriceWithRelations = Price & {
  service: Service
  model: DeviceModel
}
