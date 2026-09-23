import { useMemo, useState } from 'react';
import { Bell, CheckCircle2, AlertTriangle, XCircle, Info, Clock, Zap } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge, statusBadgeVariant } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getAlerts, getAlertRules } from '@/services/mockApi';
import { formatTimeAgo } from '@/lib/format';
import type { Alert, AlertSeverity } from '@/types';

type Tab = 'active' | 'rules';

const severityIcon = (severity: AlertSeverity) => {
  switch (severity) {
    case 'CRITICAL':
      return <XCircle className="h-5 w-5 text-red-400" />;
    case 'WARNING':
      return <AlertTriangle className="h-5 w-5 text-amber-400" />;
    case 'INFO':
      return <Info className="h-5 w-5 text-blue-400" />;
  }
};

const severityBorder = (severity: AlertSeverity) => {
  switch (severity) {
    case 'CRITICAL':
      return 'border-l-red-500';
    case 'WARNING':
      return 'border-l-amber-500';
    case 'INFO':
      return 'border-l-blue-500';
  }
};

export default function AlertsPage() {
  const [tab, setTab] = useState<Tab>('active');
  const initialAlerts = useMemo(() => getAlerts().data, []);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const rules = useMemo(() => getAlertRules().data, []);

  const activeAlerts = alerts.filter((a) => a.status === 'ACTIVE');
  const acknowledgedAlerts = alerts.filter((a) => a.status === 'ACKNOWLEDGED');

  function acknowledge(id: string) {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, status: 'ACKNOWLEDGED' } : a)));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-50">Alerts & Incidents</h1>
        <p className="text-sm text-slate-500">Monitor and manage system alerts</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card-base p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <XCircle className="h-3.5 w-3.5 text-red-400" /> Critical
          </div>
          <p className="mt-1 text-2xl font-bold text-red-400">
            {alerts.filter((a) => a.severity === 'CRITICAL' && a.status === 'ACTIVE').length}
          </p>
        </div>
        <div className="card-base p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" /> Warning
          </div>
          <p className="mt-1 text-2xl font-bold text-amber-400">
            {alerts.filter((a) => a.severity === 'WARNING' && a.status === 'ACTIVE').length}
          </p>
        </div>
        <div className="card-base p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Bell className="h-3.5 w-3.5 text-blue-400" /> Total Active
          </div>
          <p className="mt-1 text-2xl font-bold text-slate-50">{activeAlerts.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-800">
        <button
          onClick={() => setTab('active')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
            tab === 'active' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bell className="h-4 w-4" /> Active Alerts
          {activeAlerts.length > 0 && (
            <span className="rounded-full bg-red-500/20 px-1.5 py-0.5 text-[10px] font-bold text-red-400">
              {activeAlerts.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('rules')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
            tab === 'rules' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="h-4 w-4" /> Alert Rules
        </button>
      </div>

      {/* Active Alerts */}
      {tab === 'active' && (
        <div className="space-y-4">
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`card-base border-l-4 p-4 ${severityBorder(alert.severity)}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">{severityIcon(alert.severity)}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-100">{alert.title}</h3>
                      <Badge variant={statusBadgeVariant(alert.severity)}>{alert.severity}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-400">{alert.description}</p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {formatTimeAgo(alert.timestamp)}
                      </span>
                      <span>Source: {alert.source}</span>
                    </div>
                  </div>
                </div>
                <Button variant="secondary" onClick={() => acknowledge(alert.id)} className="shrink-0">
                  <CheckCircle2 className="h-4 w-4" /> Acknowledge
                </Button>
              </div>
            </div>
          ))}

          {acknowledgedAlerts.length > 0 && (
            <>
              <div className="pt-4">
                <h3 className="mb-3 text-sm font-medium text-slate-500">Acknowledged</h3>
                <div className="space-y-3">
                  {acknowledgedAlerts.map((alert) => (
                    <div key={alert.id} className="card-base p-4 opacity-60">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-slate-500" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-medium text-slate-300">{alert.title}</h3>
                            <Badge variant="neutral">ACKNOWLEDGED</Badge>
                          </div>
                          <p className="mt-0.5 text-xs text-slate-500">{alert.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeAlerts.length === 0 && acknowledgedAlerts.length === 0 && (
            <Card className="p-12 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400" />
              <p className="mt-3 text-sm text-slate-400">No alerts — all systems healthy</p>
            </Card>
          )}
        </div>
      )}

      {/* Alert Rules */}
      {tab === 'rules' && (
        <Card>
          <CardHeader title="Configured Alert Rules" subtitle="Threshold monitoring rules (read-only)" icon={<Zap className="h-4 w-4" />} />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-xs text-slate-500">
                  <th className="px-5 py-3 text-left font-medium">Rule Name</th>
                  <th className="px-5 py-3 text-left font-medium">Metric</th>
                  <th className="px-5 py-3 text-left font-medium">Condition</th>
                  <th className="px-5 py-3 text-left font-medium">Threshold</th>
                  <th className="px-5 py-3 text-left font-medium">Duration</th>
                  <th className="px-5 py-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => (
                  <tr key={rule.id} className="border-b border-slate-800/50 transition-colors hover:bg-slate-800/30">
                    <td className="px-5 py-3 font-medium text-slate-200">{rule.name}</td>
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs text-slate-400">{rule.metric}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-400">{rule.condition}</td>
                    <td className="px-5 py-3 text-slate-300">{rule.threshold}</td>
                    <td className="px-5 py-3 text-slate-400">{rule.duration}</td>
                    <td className="px-5 py-3 text-right">
                      {rule.enabled ? (
                        <Badge variant="success" dot>Enabled</Badge>
                      ) : (
                        <Badge variant="neutral" dot>Disabled</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
