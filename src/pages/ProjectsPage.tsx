import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Search, Filter, Shield, ShieldAlert, ShieldX, ShieldOff } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge, statusBadgeVariant } from '@/components/ui/Badge';
import { getProjects } from '@/services/mockApi';
import { formatTimeAgo } from '@/lib/format';
import type { ProjectStatus, SslStatus, ProjectType } from '@/types';

const projectTypeLabels: Record<ProjectType, string> = {
  NEXTJS: 'Next.js',
  NODEJS: 'Node.js',
  PHP: 'PHP',
  WORDPRESS: 'WordPress',
  NGINX: 'Nginx',
};

function SslBadge({ status, days }: { status: SslStatus; days: number }) {
  const icon =
    status === 'VALID' ? <Shield className="h-3 w-3" /> :
    status === 'EXPIRING_SOON' ? <ShieldAlert className="h-3 w-3" /> :
    status === 'EXPIRED' ? <ShieldX className="h-3 w-3" /> :
    <ShieldOff className="h-3 w-3" />;

  const label =
    status === 'VALID' ? `Valid (${days}d)` :
    status === 'EXPIRING_SOON' ? `Expiring (${days}d)` :
    status === 'EXPIRED' ? 'Expired' :
    'None';

  return (
    <Badge variant={statusBadgeVariant(status)}>
      {icon}
      {label}
    </Badge>
  );
}

export default function ProjectsPage() {
  const navigate = useNavigate();
  const projects = useMemo(() => getProjects().data, []);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'ALL'>('ALL');

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.domain.toLowerCase().includes(search.toLowerCase()) ||
      p.ownerUsername.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    UP: projects.filter((p) => p.status === 'UP').length,
    DOWN: projects.filter((p) => p.status === 'DOWN').length,
    DEGRADED: projects.filter((p) => p.status === 'DEGRADED').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-50">Projects</h1>
        <p className="text-sm text-slate-500">Auto-discovered web domains from Hestia CP</p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card-base p-4">
          <p className="text-xs text-slate-500">Up</p>
          <p className="mt-1 text-2xl font-bold text-emerald-400">{statusCounts.UP}</p>
        </div>
        <div className="card-base p-4">
          <p className="text-xs text-slate-500">Degraded</p>
          <p className="mt-1 text-2xl font-bold text-amber-400">{statusCounts.DEGRADED}</p>
        </div>
        <div className="card-base p-4">
          <p className="text-xs text-slate-500">Down</p>
          <p className="mt-1 text-2xl font-bold text-red-400">{statusCounts.DOWN}</p>
        </div>
      </div>

      {/* Filters & Table */}
      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-800 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search domains or owners..."
              className="w-full rounded-lg border border-slate-800 bg-slate-900 py-2 pl-9 pr-3 text-sm text-slate-100 placeholder-slate-600 transition-colors focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <div className="flex gap-1">
              {(['ALL', 'UP', 'DEGRADED', 'DOWN'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    statusFilter === s
                      ? 'bg-blue-600/20 text-blue-400'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {s === 'ALL' ? 'All' : s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs text-slate-500">
                <th className="px-5 py-3 text-left font-medium">Domain</th>
                <th className="px-5 py-3 text-left font-medium">Owner</th>
                <th className="px-5 py-3 text-left font-medium">Framework</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-left font-medium">SSL</th>
                <th className="px-5 py-3 text-right font-medium">Last Checked</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => navigate(`/projects/${p.id}`)}
                  className="cursor-pointer border-b border-slate-800/50 transition-colors hover:bg-slate-800/30"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Globe className="h-4 w-4 text-slate-500" />
                      <span className="font-medium text-slate-200">{p.domain}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">{p.ownerUsername}</td>
                  <td className="px-5 py-3.5">
                    <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                      {projectTypeLabels[p.projectType]}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={statusBadgeVariant(p.status)} dot>
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <SslBadge status={p.sslStatus} days={p.sslExpiryDays} />
                  </td>
                  <td className="px-5 py-3.5 text-right text-xs text-slate-500">{formatTimeAgo(p.lastChecked)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-slate-500">No projects found</div>
          )}
        </div>
      </Card>
    </div>
  );
}
