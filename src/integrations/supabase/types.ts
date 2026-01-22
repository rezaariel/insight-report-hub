export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reports_acc: {
        Row: {
          bahan_baku_akhir: number | null
          bahan_baku_awal: number | null
          barang_jadi_akhir: number | null
          barang_jadi_awal: number | null
          created_at: string
          id: string
          inv_bangunan: number | null
          inv_mesin: number | null
          inv_tanah: number | null
          negara_asal_asing: string | null
          pct_asing: number | null
          periode: string
          status_produksi: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bahan_baku_akhir?: number | null
          bahan_baku_awal?: number | null
          barang_jadi_akhir?: number | null
          barang_jadi_awal?: number | null
          created_at?: string
          id?: string
          inv_bangunan?: number | null
          inv_mesin?: number | null
          inv_tanah?: number | null
          negara_asal_asing?: string | null
          pct_asing?: number | null
          periode: string
          status_produksi?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bahan_baku_akhir?: number | null
          bahan_baku_awal?: number | null
          barang_jadi_akhir?: number | null
          barang_jadi_awal?: number | null
          created_at?: string
          id?: string
          inv_bangunan?: number | null
          inv_mesin?: number | null
          inv_tanah?: number | null
          negara_asal_asing?: string | null
          pct_asing?: number | null
          periode?: string
          status_produksi?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reports_ga: {
        Row: {
          air_pdam_m3: number | null
          b3_air_ton: number | null
          b3_majun_ton: number | null
          biaya_air_rp: number | null
          cod_inlet: number | null
          cod_outlet: number | null
          created_at: string
          id: string
          limbah_cair_inlet: number | null
          limbah_cair_outlet: number | null
          listrik_non_pln_kwh: number | null
          listrik_pln_kwh: number | null
          padat_domestik_ton: number | null
          padat_logam_ton: number | null
          periode: string
          updated_at: string
          user_id: string
        }
        Insert: {
          air_pdam_m3?: number | null
          b3_air_ton?: number | null
          b3_majun_ton?: number | null
          biaya_air_rp?: number | null
          cod_inlet?: number | null
          cod_outlet?: number | null
          created_at?: string
          id?: string
          limbah_cair_inlet?: number | null
          limbah_cair_outlet?: number | null
          listrik_non_pln_kwh?: number | null
          listrik_pln_kwh?: number | null
          padat_domestik_ton?: number | null
          padat_logam_ton?: number | null
          periode: string
          updated_at?: string
          user_id: string
        }
        Update: {
          air_pdam_m3?: number | null
          b3_air_ton?: number | null
          b3_majun_ton?: number | null
          biaya_air_rp?: number | null
          cod_inlet?: number | null
          cod_outlet?: number | null
          created_at?: string
          id?: string
          limbah_cair_inlet?: number | null
          limbah_cair_outlet?: number | null
          listrik_non_pln_kwh?: number | null
          listrik_pln_kwh?: number | null
          padat_domestik_ton?: number | null
          padat_logam_ton?: number | null
          periode?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reports_hrd: {
        Row: {
          biaya_logistik: number | null
          biaya_rnd: number | null
          created_at: string
          edu_d3: number | null
          edu_s1: number | null
          edu_sd: number | null
          edu_sma: number | null
          edu_smp: number | null
          id: string
          periode: string
          sewa_gedung: number | null
          sewa_tanah: number | null
          tk_pria_tetap: number | null
          tk_pria_tidak_tetap: number | null
          tk_wanita_tetap: number | null
          tk_wanita_tidak_tetap: number | null
          upah_lainnya: number | null
          upah_produksi: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          biaya_logistik?: number | null
          biaya_rnd?: number | null
          created_at?: string
          edu_d3?: number | null
          edu_s1?: number | null
          edu_sd?: number | null
          edu_sma?: number | null
          edu_smp?: number | null
          id?: string
          periode: string
          sewa_gedung?: number | null
          sewa_tanah?: number | null
          tk_pria_tetap?: number | null
          tk_pria_tidak_tetap?: number | null
          tk_wanita_tetap?: number | null
          tk_wanita_tidak_tetap?: number | null
          upah_lainnya?: number | null
          upah_produksi?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          biaya_logistik?: number | null
          biaya_rnd?: number | null
          created_at?: string
          edu_d3?: number | null
          edu_s1?: number | null
          edu_sd?: number | null
          edu_sma?: number | null
          edu_smp?: number | null
          id?: string
          periode?: string
          sewa_gedung?: number | null
          sewa_tanah?: number | null
          tk_pria_tetap?: number | null
          tk_pria_tidak_tetap?: number | null
          tk_wanita_tetap?: number | null
          tk_wanita_tidak_tetap?: number | null
          upah_lainnya?: number | null
          upah_produksi?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reports_pcc: {
        Row: {
          created_at: string
          hs_kode: string | null
          id: string
          kapasitas_terpasang_thn: number | null
          kbli_kode: string | null
          merk_tipe: string | null
          nama_mesin: string | null
          nama_produk: string | null
          periode: string
          produksi_riil_thn: number | null
          tahun_buat: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          hs_kode?: string | null
          id?: string
          kapasitas_terpasang_thn?: number | null
          kbli_kode?: string | null
          merk_tipe?: string | null
          nama_mesin?: string | null
          nama_produk?: string | null
          periode: string
          produksi_riil_thn?: number | null
          tahun_buat?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          hs_kode?: string | null
          id?: string
          kapasitas_terpasang_thn?: number | null
          kbli_kode?: string | null
          merk_tipe?: string | null
          nama_mesin?: string | null
          nama_produk?: string | null
          periode?: string
          produksi_riil_thn?: number | null
          tahun_buat?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      setup_initial_admin: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
