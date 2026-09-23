import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { BarChart3, TrendingUp, Globe, Server, Activity } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { getServerMetrics, getProjects, getDashboardSummary } from '@/services/mockApi';
import { formatHour, formatNumber } from '@/lib/format';

const projectTypeColors: Record<string, string> = {
  NEXTJS: '#3b82f6',
  NODEJS: '#10b981',
  PHP: '#8b5cf6',
  WORDPRESS: '#f59e0b',
  NGINX: '#06b6d4',
};

const projectTypeLabels: Record<string, string> = {
  NEXTJS: 'Next.js',
  NODEJS: 'Node.js',
  PHP: 'PHP',
  WORDPRESS: 'WordPress',
  NGINX: 'Nginx',
};

export default function AnalyticsPage() {
  const metrics = useMemo(() => getServerMetrics('24h').data, []);
  const projects = useMemo(() => getProjects().data, []);
  const summary = useMemo(() => getDashboardSummary().data, []);

  const typeDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach((p) => {
      counts[p.projectType] = (counts[p.projectType] ?? 0) + 1;
    });
    return Object.entries(counts).map(([type, count]) => ({
      name: projectTypeLabels[type] ?? type,
      value: count,
      type,
    }));
  }, [projects]);

  const projectTraffic = useMemo(
    () =>
      projects
        .map((p) => ({
          domain: p.domain,
          requests: p.requestsToday,
        }))
        .sort((a, b) => b.requests - a.requests)
        .slice(0, 8),
    [projects]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-50">Analytics</h1>
        <p className="text-sm text-slate-500">Traffic patterns, resource trends, and project insights</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="card-base p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <TrendingUp className="h-3.5 w-3.5 text-blue-400" /> Total Requests
          </div>
          <p className="mt-1 text-2xl font-bold text-slate-50">{formatNumber(summary.traffic.requestsToday)}</p>
        </div>
        <div className="card-base p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Globe className="h-3.5 w-3.5 text-emerald-400" /> Active Domains
          </div>
          <p className="mt-1 text-2xl font-bold text-slate-50">{projects.length}</p>
        </div>
        <div className="card-base p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Server className="h-3.5 w-3.5 text-amber-400" /> Avg CPU
          </div>
          <p className="mt-1 text-2xl font-bold text-slate-50">
            {(metrics.reduce((s, m) => s + m.cpuUsagePercent, 0) / metrics.length).toFixed(1)}%
          </p>
        </div>
        <div className="card-base p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Activity className="h-3.5 w-3.5 text-violet-400" /> Avg Memory
          </div>
          <p className="mt-1 text-2xl font-bold text-slate-50">
            {(metrics.reduce((s, m) => s + m.memoryUsagePercent, 0) / metrics.length).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* CPU & Memory Trend */}
      <Card>
        <CardHeader title="System Resource Trends" subtitle="CPU and memory over last 24 hours" icon={<TrendingUp className="h-4 w-4" />} />
        <div className="h-72 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="timestamp" tickFormatter={formatHour} stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: '#94a3b8' }}
                labelFormatter={(label) => formatHour(String(label))}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="cpuUsagePercent" name="CPU %" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="memoryUsagePercent" name="Memory %" stroke="#8b5cf6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Project Type Distribution */}
        <Card>
          <CardHeader title="Project Type Distribution" subtitle="Frameworks across all domains" icon={<BarChart3 className="h-4 w-4" />} />
          <div className="flex items-center justify-center p-4">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={typeDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3}>
                  {typeDistribution.map((entry) => (
                    <Cell key={entry.type} fill={projectTypeColors[entry.type] ?? '#64748b'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Projects by Traffic */}
        <Card>
          <CardHeader title="Top Projects by Traffic" subtitle="Requests today" icon={<Globe className="h-4 w-4" />} />
          <div className="h-72 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectTraffic} layout="vertical" margin={{ top: 5, right: 10, left: 80, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="domain"
                  stroke="#475569"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(v) => [formatNumber(Number(v)), 'Requests']}
                />
                <Bar dataKey="requests" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Traffic Area Chart */}
      <Card>
        <CardHeader title="Request Volume" subtitle="Simulated request pattern over 24 hours" icon={<Activity className="h-4 w-4" />} />
        <div className="h-64 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="timestamp" tickFormatter={formatHour} stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: '#94a3b8' }}
                labelFormatter={(label) => formatHour(String(label))}
              />
              <Area type="monotone" dataKey="cpuUsagePercent" name="Load Index" stroke="#06b6d4" strokeWidth={2} fill="url(#trafficGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
