import { AppLayout } from '@/components/layout/AppLayout';
import { DivisionCard } from '@/components/dashboard/DivisionCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { DeadlineCalendar } from '@/components/dashboard/DeadlineCalendar';
import { useAuth } from '@/hooks/useAuth';
import { Building2, Calculator, Factory, Users } from 'lucide-react';

export default function Dashboard() {
  const { profile, isAdmin } = useAuth();

  return (
    <AppLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
            Selamat Datang, {profile?.name || 'User'}!
          </h1>
          <p className="mt-1 text-muted-foreground">
            {isAdmin 
              ? 'Kelola dan pantau semua laporan divisi dari dashboard ini.'
              : 'Pilih divisi untuk mulai mengisi laporan Anda.'}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main content - Division Cards */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="mb-4 text-lg font-semibold text-foreground">Pilih Divisi</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <DivisionCard
                  title="General Affairs (GA)"
                  description="Laporan limbah, energi, dan pengelolaan air"
                  icon={<Building2 className="h-6 w-6" />}
                  href="/reports/ga"
                  variant="ga"
                />
                <DivisionCard
                  title="Accounting (ACC)"
                  description="Laporan inventaris dan aset perusahaan"
                  icon={<Calculator className="h-6 w-6" />}
                  href="/reports/acc"
                  variant="acc"
                />
                <DivisionCard
                  title="Production Control (PCC)"
                  description="Laporan mesin dan kapasitas produksi"
                  icon={<Factory className="h-6 w-6" />}
                  href="/reports/pcc"
                  variant="pcc"
                />
                <DivisionCard
                  title="Human Resources (HRD)"
                  description="Laporan upah, SDM, dan pendidikan"
                  icon={<Users className="h-6 w-6" />}
                  href="/reports/hrd"
                  variant="hrd"
                />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-xl border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                {isAdmin ? 'Aktivitas Terbaru' : 'Riwayat Pengisian'}
              </h2>
              <RecentActivity />
            </div>
          </div>

          {/* Sidebar - Calendar */}
          <div className="space-y-6">
            <div className="rounded-xl border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Kalender Deadline</h2>
              <DeadlineCalendar />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
