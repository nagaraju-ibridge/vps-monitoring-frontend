import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Cpu,
  MemoryStick,
  HardDrive,
  Clock,
  FolderGit2,
  AlertTriangle,
  Activity,
  Server,
  Globe,
  Zap,
} from 'lucide-react';
import { KpiCard } from '@/components/ui/KpiCard';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge, statusBadgeVariant } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import {
  getDashboardSummary,
  getServerMetrics,
  getServices,
} from '@/services/mockApi';
import { formatNumber, formatUptime, formatHour } from '@/lib/format';

export default function DashboardPage() {
  const summary = useMemo(() => getDashboardSummary().data, []);
  const metrics = useMemo(() => getServerMetrics('24h').data, []);
  const services = useMemo(() => getServices().data, []);

  const errorRate = ((summary.traffic.http5xx / summary.traffic.requestsToday) * 100).toFixed(2);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-50">Dashboard Overview</h1>
        <p className="text-sm text-slate-500">Real-time server health and project status</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          label="Server CPU"
          value={`${summary.server.cpuPercent}%`}
          icon={<Cpu className="h-5 w-5" />}
          accentColor="#3b82f6"
          trend={-2}
        >
          <ProgressBar value={summary.server.cpuPercent} />
        </KpiCard>
        <KpiCard
          label="Server RAM"
          value={`${summary.server.memoryPercent}%`}
          icon={<MemoryStick className="h-5 w-5" />}
          accentColor="#8b5cf6"
          trend={3}
        >
          <ProgressBar value={summary.server.memoryPercent} />
        </KpiCard>
        <KpiCard
          label="Disk Usage"
          value={`${summary.server.diskPercent}%`}
          icon={<HardDrive className="h-5 w-5" />}
          accentColor="#f59e0b"
          trend={1}
        >
          <ProgressBar value={summary.server.diskPercent} />
        </KpiCard>
        <KpiCard
          label="Uptime"
          value={formatUptime(summary.server.uptimeSeconds)}
          icon={<Clock className="h-5 w-5" />}
          accentColor="#10b981"
          subValue="Since last reboot"
        />
        <KpiCard
          label="Active Projects"
          value={`${summary.projects.up}/${summary.projects.total}`}
          icon={<FolderGit2 className="h-5 w-5" />}
          accentColor="#06b6d4"
          subValue={`${summary.projects.down} down · ${summary.projects.degraded} degraded`}
        />
        <KpiCard
          label="Active Alerts"
          value={summary.alerts.active.toString()}
          icon={<AlertTriangle className="h-5 w-5" />}
          accentColor="#ef4444"
          subValue={`${summary.alerts.critical} critical · ${summary.alerts.warning} warning`}
        />
      </div>

      {/* CPU & RAM Chart */}
      <Card>
        <CardHeader
          title="CPU & Memory Usage"
          subtitle="Last 24 hours"
          icon={<Activity className="h-4 w-4" />}
          action={
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> CPU
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-violet-500" /> Memory
              </span>
            </div>
          }
        />
        <div className="h-72 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatHour}
                stroke="#475569"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
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
              <Area
                type="monotone"
                dataKey="cpuUsagePercent"
                name="CPU %"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#cpuGrad)"
              />
              <Area
                type="monotone"
                dataKey="memoryUsagePercent"
                name="Memory %"
                stroke="#8b5cf6"
                strokeWidth={2}
                fill="url(#memGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Services Table & Traffic Summary */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Service Health"
            subtitle="Core system services"
            icon={<Server className="h-4 w-4" />}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-xs text-slate-500">
                  <th className="px-5 py-3 text-left font-medium">Service</th>
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                  <th className="px-5 py-3 text-left font-medium">Uptime</th>
                  <th className="px-5 py-3 text-right font-medium">CPU</th>
                  <th className="px-5 py-3 text-right font-medium">Memory</th>
                </tr>
              </thead>
              <tbody>
                {services.map((svc) => (
                  <tr key={svc.name} className="border-b border-slate-800/50 transition-colors hover:bg-slate-800/30">
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs text-slate-300">{svc.name}</span>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={statusBadgeVariant(svc.status)} dot>
                        {svc.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-slate-400">{svc.uptime}</td>
                    <td className="px-5 py-3 text-right text-slate-300">{svc.cpu.toFixed(1)}%</td>
                    <td className="px-5 py-3 text-right text-slate-300">{svc.memory.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader title="Traffic Summary" subtitle="Today" icon={<Globe className="h-4 w-4" />} />
          <div className="space-y-4 p-5">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Activity className="h-3.5 w-3.5" /> Total Requests
              </div>
              <p className="mt-1 text-2xl font-bold text-slate-50">{formatNumber(summary.traffic.requestsToday)}</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                <p className="text-xs text-emerald-500/70">2xx</p>
                <p className="mt-1 text-lg font-bold text-emerald-400">{formatNumber(summary.traffic.http2xx)}</p>
              </div>
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                <p className="text-xs text-amber-500/70">4xx</p>
                <p className="mt-1 text-lg font-bold text-amber-400">{formatNumber(summary.traffic.http4xx)}</p>
              </div>
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                <p className="text-xs text-red-500/70">5xx</p>
                <p className="mt-1 text-lg font-bold text-red-400">{formatNumber(summary.traffic.http5xx)}</p>
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Zap className="h-3.5 w-3.5" /> Error Rate
                </div>
                <span className={`text-lg font-bold ${parseFloat(errorRate) > 0.1 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {errorRate}%
                </span>
              </div>
              <ProgressBar value={parseFloat(errorRate)} max={5} className="mt-2" color="bg-amber-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick link to projects */}
      <Card hover className="p-4">
        <Link to="/projects" className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FolderGit2 className="h-5 w-5 text-blue-400" />
            <span className="text-sm text-slate-300">View all projects and web domains</span>
          </div>
          <span className="text-sm text-blue-400">View all →</span>
        </Link>
      </Card>
    </div>
  );
}
