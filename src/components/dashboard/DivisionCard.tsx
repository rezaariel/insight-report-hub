import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DivisionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  variant: 'ga' | 'acc' | 'pcc' | 'hrd';
  stats?: { label: string; value: string | number }[];
}

const variantStyles = {
  ga: 'division-card-ga',
  acc: 'division-card-acc',
  pcc: 'division-card-pcc',
  hrd: 'division-card-hrd',
};

const iconBgColors = {
  ga: 'bg-division-ga/10 text-division-ga',
  acc: 'bg-division-acc/10 text-division-acc',
  pcc: 'bg-division-pcc/10 text-division-pcc',
  hrd: 'bg-division-hrd/10 text-division-hrd',
};

export function DivisionCard({ title, description, icon, href, variant, stats }: DivisionCardProps) {
  return (
    <Link
      to={href}
      className={cn("division-card group cursor-pointer", variantStyles[variant])}
    >
      <div className="flex items-start justify-between">
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", iconBgColors[variant])}>
          {icon}
        </div>
        <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      {stats && stats.length > 0 && (
        <div className="mt-4 flex gap-4 border-t pt-4">
          {stats.map((stat, index) => (
            <div key={index}>
              <p className="text-lg font-semibold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      )}
    </Link>
  );
}
