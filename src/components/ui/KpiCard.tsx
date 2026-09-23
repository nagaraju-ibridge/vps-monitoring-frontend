import type { ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  accentColor: string;
  subValue?: string;
  trend?: number;
  children?: ReactNode;
}

export function KpiCard({ label, value, icon, accentColor, subValue, trend, children }: KpiCardProps) {
  return (
    <div className="card-base group p-5 transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/80">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${accentColor}1a`, color: accentColor }}
          >
            {icon}
          </div>
          <span className="text-sm font-medium text-slate-400">{label}</span>
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-0.5 text-xs font-medium ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-slate-50">{value}</p>
        {subValue && <p className="mt-0.5 text-xs text-slate-500">{subValue}</p>}
      </div>
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
