import type { ReactNode } from 'react';

type Variant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

const variantStyles: Record<Variant, string> = {
  default: 'bg-slate-800 text-slate-300 border-slate-700',
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  error: 'bg-red-500/10 text-red-400 border-red-500/30',
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  neutral: 'bg-slate-800/50 text-slate-400 border-slate-700/50',
};

interface BadgeProps {
  children: ReactNode;
  variant?: Variant;
  dot?: boolean;
  className?: string;
}

export function Badge({ children, variant = 'default', dot = false, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export function statusBadgeVariant(status: string): Variant {
  switch (status) {
    case 'UP':
    case 'RUNNING':
    case 'VALID':
    case 'RESOLVED':
      return 'success';
    case 'DEGRADED':
    case 'EXPIRING_SOON':
    case 'WARNING':
      return 'warning';
    case 'DOWN':
    case 'STOPPED':
    case 'EXPIRED':
    case 'CRITICAL':
    case 'ERROR':
      return 'error';
    case 'INFO':
    case 'NONE':
      return 'info';
    default:
      return 'neutral';
  }
}
