import type { ReactNode } from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  label?: string;
  icon?: ReactNode;
  className?: string;
}

export function ProgressBar({ value, max = 100, color, label, icon, className = '' }: ProgressBarProps) {
  const pct = Math.min(100, (value / max) * 100);
  const autoColor = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-emerald-500';
  const barColor = color ?? autoColor;

  return (
    <div className={className}>
      {(label || icon) && (
        <div className="mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            {icon}
            {label}
          </span>
          <span className="text-xs font-medium text-slate-300">{pct.toFixed(1)}%</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
