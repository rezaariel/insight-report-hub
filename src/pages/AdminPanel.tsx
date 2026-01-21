import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Download, FileSpreadsheet, Loader2, Users } from 'lucide-react';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

type DivisionKey = 'ga' | 'acc' | 'pcc' | 'hrd';
type TableName = 'reports_ga' | 'reports_acc' | 'reports_pcc' | 'reports_hrd';

interface ReportWithProfile {
  id: string;
  periode: string;
  updated_at: string;
  user_name: string;
  user_email: string;
  [key: string]: unknown;
}

const divisionLabels: Record<DivisionKey, string> = {
  ga: 'General Affairs (GA)',
  acc: 'Accounting (ACC)',
  pcc: 'Production Control (PCC)',
  hrd: 'Human Resources (HRD)',
};

const tableNames: Record<DivisionKey, TableName> = {
  ga: 'reports_ga',
  acc: 'reports_acc',
  pcc: 'reports_pcc',
  hrd: 'reports_hrd',
};

export default function AdminPanel() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const [selectedDivision, setSelectedDivision] = useState<DivisionKey>('ga');
  const [reports, setReports] = useState<ReportWithProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [selectedDivision]);

  const fetchReports = async () => {
    setLoading(true);
    const tableName = tableNames[selectedDivision];

    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Gagal memuat data',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    // Fetch user profiles for each report
    const reportsWithProfiles: ReportWithProfile[] = [];
    
    for (const report of data || []) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, email')
        .eq('user_id', report.user_id)
        .single();

      reportsWithProfiles.push({
        ...report,
        user_name: profile?.name || 'Unknown',
        user_email: profile?.email || 'Unknown',
      });
    }

    setReports(reportsWithProfiles);
    setLoading(false);
  };

  const handleExport = async () => {
    if (reports.length === 0) {
      toast({
        title: 'Tidak ada data',
        description: 'Tidak ada data untuk diekspor',
        variant: 'destructive',
      });
      return;
    }

    setExporting(true);

    try {
      // Prepare data for export
      const exportData = reports.map((report) => {
        const { id, user_id, created_at, updated_at, ...rest } = report;
        return {
        Nama: report.user_name,
          Email: report.user_email,
          Periode: report.periode,
          'Tanggal Update': format(new Date(updated_at), 'd MMMM yyyy HH:mm'),
          ...Object.entries(rest).reduce((acc, [key, value]) => {
            if (!['user_name', 'user_email', 'periode'].includes(key)) {
              // Convert snake_case to Title Case
              const label = key
                .split('_')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
              acc[label] = value;
            }
            return acc;
          }, {} as Record<string, unknown>),
        };
      });

      // Create workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Auto-size columns
      const colWidths = Object.keys(exportData[0] || {}).map((key) => ({
        wch: Math.max(key.length, 15),
      }));
      ws['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, divisionLabels[selectedDivision]);

      // Generate filename
      const filename = `Laporan_${selectedDivision.toUpperCase()}_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`;

      // Download
      XLSX.writeFile(wb, filename);

      toast({
        title: 'Berhasil!',
        description: `File ${filename} berhasil diunduh`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal mengekspor data',
        variant: 'destructive',
      });
    } finally {
      setExporting(false);
    }
  };

  if (!isAdmin) {
    return (
      <AppLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium text-foreground">Akses Ditolak</p>
            <p className="text-muted-foreground">
              Anda tidak memiliki akses ke halaman ini
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
            Admin Panel
          </h1>
          <p className="mt-1 text-muted-foreground">
            Kelola dan ekspor laporan dari semua divisi
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="w-full sm:w-64">
            <Select
              value={selectedDivision}
              onValueChange={(value: DivisionKey) => setSelectedDivision(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(divisionLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleExport} disabled={exporting || loading}>
            {exporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export Excel
          </Button>
        </div>

        {/* Data Table */}
        <div className="rounded-xl border bg-card">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileSpreadsheet className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium text-foreground">
                Belum ada laporan
              </p>
              <p className="text-sm text-muted-foreground">
                Laporan untuk {divisionLabels[selectedDivision]} belum tersedia
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Periode</TableHead>
                    <TableHead>Terakhir Diupdate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        {report.user_name}
                      </TableCell>
                      <TableCell>{report.user_email}</TableCell>
                      <TableCell>{report.periode}</TableCell>
                      <TableCell>
                        {format(new Date(report.updated_at), 'd MMM yyyy, HH:mm', {
                          locale: id,
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
