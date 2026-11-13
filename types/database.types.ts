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
      photos: {
        Row: {
          id: string
          title: string | null
          alt_text: string
          category: 'people' | 'places' | 'everyday_moments' | 'travel'
          image_url: string
          storage_path: string
          width: number | null
          height: number | null
          blur_data_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title?: string | null
          alt_text: string
          category: 'people' | 'places' | 'everyday_moments' | 'travel'
          image_url: string
          storage_path: string
          width?: number | null
          height?: number | null
          blur_data_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string | null
          alt_text?: string
          category?: 'people' | 'places' | 'everyday_moments' | 'travel'
          image_url?: string
          storage_path?: string
          width?: number | null
          height?: number | null
          blur_data_url?: string | null
          created_at?: string
          updated_at?: string
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
      photo_category: 'people' | 'places' | 'everyday_moments' | 'travel'
    }
  }
}
