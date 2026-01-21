import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { FileText, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface ActivityItem {
  id: string;
  divisi: string;
  periode: string;
  updated_at: string;
  user_name?: string;
}

type ReportTable = 'reports_hrd' | 'reports_acc' | 'reports_pcc' | 'reports_ga';

export function RecentActivity() {
  const { user, isAdmin } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchActivities();
  }, [user, isAdmin]);

  const fetchActivities = async () => {
    if (!user) return;
    
    setLoading(true);
    const allActivities: ActivityItem[] = [];

    const tables: { name: ReportTable; divisi: string }[] = [
      { name: 'reports_hrd', divisi: 'HRD' },
      { name: 'reports_acc', divisi: 'ACC' },
      { name: 'reports_pcc', divisi: 'PCC' },
      { name: 'reports_ga', divisi: 'GA' },
    ];

    for (const table of tables) {
      let query = supabase
        .from(table.name)
        .select('id, periode, updated_at, user_id')
        .order('updated_at', { ascending: false })
        .limit(5);

      if (!isAdmin) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;
      
      if (data && !error) {
        for (const item of data) {
          let userName = '';
          if (isAdmin && item.user_id) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('name')
              .eq('user_id', item.user_id)
              .single();
            userName = profile?.name || 'Unknown';
          }
          
          allActivities.push({
            id: item.id,
            divisi: table.divisi,
            periode: item.periode,
            updated_at: item.updated_at,
            user_name: userName,
          });
        }
      }
    }

    // Sort by date and take latest 10
    allActivities.sort((a, b) => 
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
    
    setActivities(allActivities.slice(0, 10));
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="h-10 w-10 rounded-lg bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="h-3 w-1/2 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <FileText className="h-12 w-12 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">Belum ada aktivitas</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div
          key={`${activity.divisi}-${activity.id}`}
          className="flex items-start gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-muted/50"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">
              {isAdmin && activity.user_name && (
                <span className="text-primary">{activity.user_name}</span>
              )}{' '}
              {isAdmin ? 'mengisi' : 'Anda mengisi'} form{' '}
              <span className="font-semibold">{activity.divisi}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Periode: {activity.periode}
            </p>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {format(new Date(activity.updated_at), "d MMM yyyy, HH:mm", { locale: id })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
