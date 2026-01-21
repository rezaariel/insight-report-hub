import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

const MONTHS = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DES'
];

interface FormField {
  name: string;
  label: string;
  type: 'number' | 'text';
  placeholder?: string;
}

interface DivisionConfig {
  title: string;
  description: string;
  sections: {
    title: string;
    fields: FormField[];
  }[];
}

const divisionConfigs: Record<string, DivisionConfig> = {
  ga: {
    title: 'General Affairs (GA)',
    description: 'Laporan limbah, energi, dan pengelolaan air',
    sections: [
      {
        title: 'Limbah Cair',
        fields: [
          { name: 'limbah_cair_inlet', label: 'Inlet (m³)', type: 'number' },
          { name: 'limbah_cair_outlet', label: 'Outlet (m³)', type: 'number' },
          { name: 'cod_inlet', label: 'COD Inlet (mg/L)', type: 'number' },
          { name: 'cod_outlet', label: 'COD Outlet (mg/L)', type: 'number' },
        ],
      },
      {
        title: 'Limbah B3',
        fields: [
          { name: 'b3_majun_ton', label: 'Majun (Ton)', type: 'number' },
          { name: 'b3_air_ton', label: 'Air Limbah B3 (Ton)', type: 'number' },
        ],
      },
      {
        title: 'Limbah Padat',
        fields: [
          { name: 'padat_logam_ton', label: 'Logam (Ton)', type: 'number' },
          { name: 'padat_domestik_ton', label: 'Domestik (Ton)', type: 'number' },
        ],
      },
      {
        title: 'Energi & Air',
        fields: [
          { name: 'listrik_pln_kwh', label: 'Listrik PLN (kWh)', type: 'number' },
          { name: 'listrik_non_pln_kwh', label: 'Listrik Non-PLN (kWh)', type: 'number' },
          { name: 'air_pdam_m3', label: 'Air PDAM (m³)', type: 'number' },
          { name: 'biaya_air_rp', label: 'Biaya Air (Rp)', type: 'number' },
        ],
      },
    ],
  },
  acc: {
    title: 'Accounting (ACC)',
    description: 'Laporan inventaris dan aset perusahaan',
    sections: [
      {
        title: 'Persediaan Bahan Baku',
        fields: [
          { name: 'bahan_baku_awal', label: 'Nilai Awal (Rp)', type: 'number' },
          { name: 'bahan_baku_akhir', label: 'Nilai Akhir (Rp)', type: 'number' },
        ],
      },
      {
        title: 'Persediaan Barang Jadi',
        fields: [
          { name: 'barang_jadi_awal', label: 'Nilai Awal (Rp)', type: 'number' },
          { name: 'barang_jadi_akhir', label: 'Nilai Akhir (Rp)', type: 'number' },
        ],
      },
      {
        title: 'Investasi Aset Tetap',
        fields: [
          { name: 'inv_tanah', label: 'Tanah (Rp)', type: 'number' },
          { name: 'inv_bangunan', label: 'Bangunan (Rp)', type: 'number' },
          { name: 'inv_mesin', label: 'Mesin (Rp)', type: 'number' },
        ],
      },
      {
        title: 'Modal Asing',
        fields: [
          { name: 'pct_asing', label: 'Persentase Modal Asing (%)', type: 'number' },
          { name: 'negara_asal_asing', label: 'Negara Asal', type: 'text' },
          { name: 'status_produksi', label: 'Status Produksi', type: 'text', placeholder: 'Ya / Tidak' },
        ],
      },
    ],
  },
  pcc: {
    title: 'Production Control (PCC)',
    description: 'Laporan mesin dan kapasitas produksi',
    sections: [
      {
        title: 'Data Mesin',
        fields: [
          { name: 'nama_mesin', label: 'Nama Mesin', type: 'text' },
          { name: 'merk_tipe', label: 'Merk/Tipe', type: 'text' },
          { name: 'tahun_buat', label: 'Tahun Pembuatan', type: 'number' },
        ],
      },
      {
        title: 'Data Produk',
        fields: [
          { name: 'nama_produk', label: 'Nama Produk', type: 'text' },
          { name: 'kbli_kode', label: 'Kode KBLI', type: 'text' },
          { name: 'hs_kode', label: 'Kode HS', type: 'text' },
        ],
      },
      {
        title: 'Kapasitas Produksi',
        fields: [
          { name: 'kapasitas_terpasang_thn', label: 'Kapasitas Terpasang/Tahun', type: 'number' },
          { name: 'produksi_riil_thn', label: 'Produksi Riil/Tahun', type: 'number' },
        ],
      },
    ],
  },
  hrd: {
    title: 'Human Resources (HRD)',
    description: 'Laporan upah, SDM, dan pendidikan',
    sections: [
      {
        title: 'Upah & Biaya',
        fields: [
          { name: 'upah_produksi', label: 'Upah Produksi (Rp)', type: 'number' },
          { name: 'upah_lainnya', label: 'Upah Lainnya (Rp)', type: 'number' },
          { name: 'sewa_tanah', label: 'Sewa Tanah (Rp)', type: 'number' },
          { name: 'sewa_gedung', label: 'Sewa Gedung (Rp)', type: 'number' },
          { name: 'biaya_logistik', label: 'Biaya Logistik (Rp)', type: 'number' },
          { name: 'biaya_rnd', label: 'Biaya R&D (Rp)', type: 'number' },
        ],
      },
      {
        title: 'Tenaga Kerja Pria',
        fields: [
          { name: 'tk_pria_tetap', label: 'Tetap (orang)', type: 'number' },
          { name: 'tk_pria_tidak_tetap', label: 'Tidak Tetap (orang)', type: 'number' },
        ],
      },
      {
        title: 'Tenaga Kerja Wanita',
        fields: [
          { name: 'tk_wanita_tetap', label: 'Tetap (orang)', type: 'number' },
          { name: 'tk_wanita_tidak_tetap', label: 'Tidak Tetap (orang)', type: 'number' },
        ],
      },
      {
        title: 'Tingkat Pendidikan',
        fields: [
          { name: 'edu_sd', label: 'SD (orang)', type: 'number' },
          { name: 'edu_smp', label: 'SMP (orang)', type: 'number' },
          { name: 'edu_sma', label: 'SMA (orang)', type: 'number' },
          { name: 'edu_d3', label: 'D3 (orang)', type: 'number' },
          { name: 'edu_s1', label: 'S1 (orang)', type: 'number' },
        ],
      },
    ],
  },
};

const tableNames: Record<string, 'reports_ga' | 'reports_acc' | 'reports_pcc' | 'reports_hrd'> = {
  ga: 'reports_ga',
  acc: 'reports_acc',
  pcc: 'reports_pcc',
  hrd: 'reports_hrd',
};

export default function ReportForm() {
  const { division } = useParams<{ division: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Record<string, string | number>>({});
  const [periode, setPeriode] = useState('');
  const [existingId, setExistingId] = useState<string | null>(null);

  const config = division ? divisionConfigs[division] : null;
  const tableName = division ? tableNames[division] : null;

  // Generate periode options
  const generatePeriodeOptions = () => {
    const options: string[] = [];
    const currentYear = new Date().getFullYear();
    const years = [currentYear - 1, currentYear, currentYear + 1];
    
    for (const year of years) {
      for (let i = 0; i < 12; i += 3) {
        const startMonth = MONTHS[i];
        const endMonth = MONTHS[Math.min(i + 2, 11)];
        const shortYear = year.toString().slice(-2);
        options.push(`${startMonth} ${shortYear}-${endMonth} ${shortYear}`);
      }
    }
    return options;
  };

  // Load existing data when periode changes
  useEffect(() => {
    if (user && periode && tableName) {
      loadExistingData();
    }
  }, [user, periode, tableName]);

  const loadExistingData = async () => {
    if (!user || !periode || !tableName) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('user_id', user.id)
      .eq('periode', periode)
      .maybeSingle();

    if (data && !error) {
      setExistingId(data.id);
      const newFormData: Record<string, string | number> = {};
      Object.keys(data).forEach((key) => {
        if (key !== 'id' && key !== 'user_id' && key !== 'periode' && key !== 'created_at' && key !== 'updated_at') {
          newFormData[key] = data[key] ?? '';
        }
      });
      setFormData(newFormData);
    } else {
      setExistingId(null);
      setFormData({});
    }
    setLoading(false);
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !tableName || !periode) {
      toast({
        title: 'Error',
        description: 'Silakan pilih periode terlebih dahulu',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    // Prepare data with proper types
    const submitData: Record<string, unknown> = {
      user_id: user.id,
      periode,
    };

    config?.sections.forEach((section) => {
      section.fields.forEach((field) => {
        const value = formData[field.name];
        if (field.type === 'number') {
          submitData[field.name] = value ? parseFloat(value.toString()) : 0;
        } else {
          submitData[field.name] = value || '';
        }
      });
    });

    try {
      if (existingId) {
        // Update existing
        const { error } = await supabase
          .from(tableName)
          .update(submitData as never)
          .eq('id', existingId);

        if (error) throw error;

        toast({
          title: 'Berhasil!',
          description: 'Laporan berhasil diperbarui',
        });
      } else {
        // Insert new
        const { error } = await supabase
          .from(tableName)
          .insert(submitData as never);

        if (error) throw error;

        toast({
          title: 'Berhasil!',
          description: 'Laporan berhasil disimpan',
        });
      }

      navigate('/');
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast({
        title: 'Error',
        description: err.message || 'Gagal menyimpan laporan',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (!config || !division) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Divisi tidak ditemukan</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <h1 className="text-2xl font-bold text-foreground">{config.title}</h1>
          <p className="mt-1 text-muted-foreground">{config.description}</p>
        </div>

        {/* Periode Selection */}
        <div className="mb-6 max-w-xs">
          <Label htmlFor="periode">Periode Laporan</Label>
          <Select value={periode} onValueChange={setPeriode}>
            <SelectTrigger id="periode" className="mt-1.5">
              <SelectValue placeholder="Pilih periode..." />
            </SelectTrigger>
            <SelectContent>
              {generatePeriodeOptions().map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {existingId && (
            <p className="mt-2 text-sm text-accent">
              ✓ Data untuk periode ini sudah ada. Anda bisa mengubahnya.
            </p>
          )}
        </div>

        {/* Form */}
        {periode && (
          <form onSubmit={handleSubmit}>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                {config.sections.map((section, sectionIndex) => (
                  <div
                    key={sectionIndex}
                    className="form-section animate-fade-in"
                    style={{ animationDelay: `${sectionIndex * 100}ms` }}
                  >
                    <h3 className="mb-4 text-lg font-semibold text-foreground">
                      {section.title}
                    </h3>
                    <div className="grid gap-4">
                      {section.fields.map((field) => (
                        <div key={field.name}>
                          <Label htmlFor={field.name}>{field.label}</Label>
                          <Input
                            id={field.name}
                            type={field.type}
                            value={formData[field.name] ?? ''}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            placeholder={field.placeholder || `Masukkan ${field.label.toLowerCase()}`}
                            className="mt-1.5"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Submit Button */}
            {!loading && (
              <div className="mt-8 flex justify-end">
                <Button type="submit" disabled={saving} size="lg">
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  {existingId ? 'Perbarui Laporan' : 'Simpan Laporan'}
                </Button>
              </div>
            )}
          </form>
        )}
      </div>
    </AppLayout>
  );
}
