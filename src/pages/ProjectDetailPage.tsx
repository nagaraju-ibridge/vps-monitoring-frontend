import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  ArrowLeft,
  ExternalLink,
  Globe,
  Code2,
  FolderTree,
  Shield,
  Cpu,
  MemoryStick,
  Activity,
  Terminal,
  FileText,
  LayoutDashboard,
  BarChart3,
  Server,
} from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge, statusBadgeVariant } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { getProjectById, getProjectTraffic, getProjectLogs } from '@/services/mockApi';
import { formatNumber, formatTimeAgo, formatTime, formatHour } from '@/lib/format';
import type { LogLevel } from '@/types';

const projectTypeLabels: Record<string, string> = {
  NEXTJS: 'Next.js',
  NODEJS: 'Node.js',
  PHP: 'PHP',
  WORDPRESS: 'WordPress',
  NGINX: 'Nginx',
};

const logColors: Record<LogLevel, string> = {
  ERROR: 'text-red-400',
  WARN: 'text-amber-400',
  INFO: 'text-blue-400',
  DEBUG: 'text-slate-500',
};

type Tab = 'overview' | 'traffic' | 'logs' | 'resources';

const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'traffic', label: 'Traffic', icon: BarChart3 },
  { id: 'logs', label: 'Recent Logs', icon: Terminal },
  { id: 'resources', label: 'Resource Usage', icon: Server },
];

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const project = useMemo(() => (id ? getProjectById(id).data : null), [id]);
  const traffic = useMemo(() => (id ? getProjectTraffic(id).data : []), [id]);
  const logs = useMemo(() => (id ? getProjectLogs(id).data : []), [id]);
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  if (!project) {
    return (
      <div className="space-y-4">
        <Link to="/projects" className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200">
          <ArrowLeft className="h-4 w-4" /> Back to projects
        </Link>
        <Card className="p-12 text-center">
          <p className="text-slate-400">Project not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link to="/projects" className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-200">
        <ArrowLeft className="h-4 w-4" /> Back to projects
      </Link>

      {/* Header */}
      <div className="card-base p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-800">
              <Globe className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-50">{project.domain}</h1>
              <p className="text-sm text-slate-500">
                {projectTypeLabels[project.projectType]} · {project.ownerUsername}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={statusBadgeVariant(project.status)} dot>
              {project.status}
            </Badge>
            <a
              href={project.publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-slate-800"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Visit
            </a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader title="Project Details" icon={<Code2 className="h-4 w-4" />} />
            <div className="space-y-3 p-5">
              <DetailRow label="Framework" value={projectTypeLabels[project.projectType]} />
              <DetailRow label="Document Root" value={project.documentRoot} mono />
              <DetailRow label="Owner" value={project.ownerUsername} />
              <DetailRow label="Last Checked" value={formatTimeAgo(project.lastChecked)} />
            </div>
          </Card>

          <Card>
            <CardHeader title="SSL Certificate" icon={<Shield className="h-4 w-4" />} />
            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Status</span>
                <Badge variant={statusBadgeVariant(project.sslStatus)} dot>
                  {project.sslStatus}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Days Remaining</span>
                <span
                  className={`text-lg font-bold ${
                    project.sslExpiryDays < 0
                      ? 'text-red-400'
                      : project.sslExpiryDays < 14
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {project.sslExpiryDays < 0 ? `${Math.abs(project.sslExpiryDays)}d expired` : `${project.sslExpiryDays}d`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Public URL</span>
                <a
                  href={project.publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                >
                  {project.publicUrl} <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'traffic' && (
        <Card>
          <CardHeader
            title="HTTP Traffic"
            subtitle="Response codes over the last 24 hours"
            icon={<BarChart3 className="h-4 w-4" />}
            action={
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> 2xx
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> 4xx
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> 5xx
                </span>
              </div>
            }
          />
          <div className="h-80 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={traffic} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatHour}
                  stroke="#475569"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: '#94a3b8' }}
                  labelFormatter={(label) => formatHour(String(label))}
                />
                <Bar dataKey="http2xx" name="2xx" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="http4xx" name="4xx" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                <Bar dataKey="http5xx" name="5xx" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 border-t border-slate-800 p-5">
            <div>
              <p className="text-xs text-slate-500">Total Requests Today</p>
              <p className="mt-1 text-xl font-bold text-slate-50">{formatNumber(project.requestsToday)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Error Rate</p>
              <p className="mt-1 text-xl font-bold text-amber-400">
                {project.requestsToday > 0
                  ? ((project.http5xx / project.requestsToday) * 100).toFixed(2)
                  : '0'}
                %
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">5xx Errors</p>
              <p className="mt-1 text-xl font-bold text-red-400">{project.http5xx}</p>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'logs' && (
        <Card>
          <CardHeader
            title="Recent Logs"
            subtitle="Nginx access & error logs"
            icon={<FileText className="h-4 w-4" />}
          />
          <div className="rounded-b-xl bg-black p-4 font-mono text-xs leading-relaxed">
            <div className="max-h-[480px] overflow-y-auto">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-2 py-0.5 hover:bg-white/5">
                  <span className="shrink-0 text-slate-600">{formatTime(log.timestamp)}</span>
                  <span className={`shrink-0 font-semibold ${logColors[log.level]}`}>
                    {log.level.padEnd(5)}
                  </span>
                  <span className="shrink-0 text-slate-600">[{log.source}]</span>
                  <span className="text-slate-300">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'resources' && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader title="Process CPU Usage" icon={<Cpu className="h-4 w-4" />} />
            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Current CPU</span>
                <span className="text-2xl font-bold text-slate-50">{project.cpuPercent.toFixed(1)}%</span>
              </div>
              <ProgressBar value={project.cpuPercent} />
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
                  <p className="text-xs text-slate-500">Process Type</p>
                  <p className="mt-1 text-sm text-slate-300">{projectTypeLabels[project.projectType]}</p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
                  <p className="text-xs text-slate-500">Status</p>
                  <p className="mt-1 text-sm text-slate-300">{project.status}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Process Memory Usage" icon={<MemoryStick className="h-4 w-4" />} />
            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Current Memory</span>
                <span className="text-2xl font-bold text-slate-50">{project.memoryPercent.toFixed(1)}%</span>
              </div>
              <ProgressBar value={project.memoryPercent} color="bg-violet-500" />
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
                  <p className="text-xs text-slate-500">Document Root</p>
                  <p className="mt-1 truncate text-sm text-slate-300" title={project.documentRoot}>
                    {project.documentRoot}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
                  <p className="text-xs text-slate-500">Requests Today</p>
                  <p className="mt-1 text-sm text-slate-300">{formatNumber(project.requestsToday)}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader title="Activity" icon={<Activity className="h-4 w-4" />} />
            <div className="space-y-2 p-5">
              <ActivityItem label="HTTP 2xx Responses" value={formatNumber(project.http2xx)} color="text-emerald-400" />
              <ActivityItem label="HTTP 4xx Responses" value={formatNumber(project.http4xx)} color="text-amber-400" />
              <ActivityItem label="HTTP 5xx Responses" value={formatNumber(project.http5xx)} color="text-red-400" />
              <ActivityItem label="Total Requests Today" value={formatNumber(project.requestsToday)} color="text-slate-200" />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="shrink-0 text-sm text-slate-400">{label}</span>
      <span className={`text-right text-sm text-slate-200 ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
    </div>
  );
}

function ActivityItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-800/50 py-2 last:border-0">
      <span className="text-sm text-slate-400">{label}</span>
      <span className={`font-semibold ${color}`}>{value}</span>
    </div>
  );
}
