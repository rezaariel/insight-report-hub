import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';

export function DeadlineCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Example deadlines - in production these would come from the database
  const deadlines = [
    { date: new Date(2026, 0, 31), label: 'Laporan Bulanan Januari' },
    { date: new Date(2026, 1, 28), label: 'Laporan Bulanan Februari' },
  ];

  const upcomingDeadlines = deadlines
    .filter(d => d.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3);

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-lg border"
      />
      
      {upcomingDeadlines.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            Deadline Mendatang
          </h4>
          {upcomingDeadlines.map((deadline, index) => (
            <div
              key={index}
              className="rounded-lg border border-warning/30 bg-warning/10 p-3"
            >
              <p className="text-sm font-medium text-foreground">{deadline.label}</p>
              <p className="text-xs text-muted-foreground">
                {deadline.date.toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
