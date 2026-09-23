import { useState } from 'react';
import { Settings, User, Bell, Shield, Database, Server, Save } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getCurrentUser } from '@/services/auth';

type Section = 'profile' | 'notifications' | 'security' | 'api' | 'system';

const sections: { id: Section; label: string; icon: typeof User }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'api', label: 'API & Integrations', icon: Database },
  { id: 'system', label: 'System', icon: Server },
];

export default function SettingsPage() {
  const user = getCurrentUser();
  const [section, setSection] = useState<Section>('profile');
  const [notifPrefs, setNotifPrefs] = useState({
    critical: true,
    warning: true,
    info: false,
    email: true,
    slack: false,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-50">Settings</h1>
        <p className="text-sm text-slate-500">Manage your account and system preferences</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar */}
        <div className="lg:w-56">
          <div className="flex gap-1 overflow-x-auto lg:flex-col">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  section === s.id
                    ? 'bg-blue-600/15 text-blue-400'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <s.icon className="h-4 w-4" />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {section === 'profile' && (
            <Card>
              <CardHeader title="Profile" subtitle="Your account information" icon={<User className="h-4 w-4" />} />
              <div className="space-y-4 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-teal-500 text-xl font-bold text-white">
                    {(user?.username ?? 'U')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{user?.name ?? 'admin'}</p>
                    <p className="text-xs text-slate-500">{user?.role ?? 'Administrator'}</p>
                  </div>
                </div>
                <Field label="Display Name" value={user?.name ?? 'admin'} />
                <Field label="Username" value={user?.username ?? 'admin'} />
                <Field label="Email" value="admin@vps-monitor.local" />
                <Field label="Role" value={user?.role ?? 'Administrator'} readOnly />
                <Button variant="primary">
                  <Save className="h-4 w-4" /> Save Changes
                </Button>
              </div>
            </Card>
          )}

          {section === 'notifications' && (
            <Card>
              <CardHeader title="Notification Preferences" subtitle="Choose what alerts you receive" icon={<Bell className="h-4 w-4" />} />
              <div className="space-y-1 p-5">
                <ToggleRow
                  label="Critical Alerts"
                  description="Immediate notifications for critical issues"
                  checked={notifPrefs.critical}
                  onChange={(v) => setNotifPrefs({ ...notifPrefs, critical: v })}
                />
                <ToggleRow
                  label="Warning Alerts"
                  description="Notifications for warnings and degraded services"
                  checked={notifPrefs.warning}
                  onChange={(v) => setNotifPrefs({ ...notifPrefs, warning: v })}
                />
                <ToggleRow
                  label="Info Alerts"
                  description="General system information and updates"
                  checked={notifPrefs.info}
                  onChange={(v) => setNotifPrefs({ ...notifPrefs, info: v })}
                />
                <div className="my-4 border-t border-slate-800" />
                <ToggleRow
                  label="Email Notifications"
                  description="Send alerts to your email address"
                  checked={notifPrefs.email}
                  onChange={(v) => setNotifPrefs({ ...notifPrefs, email: v })}
                />
                <ToggleRow
                  label="Slack Integration"
                  description="Post alerts to a Slack channel"
                  checked={notifPrefs.slack}
                  onChange={(v) => setNotifPrefs({ ...notifPrefs, slack: v })}
                />
              </div>
            </Card>
          )}

          {section === 'security' && (
            <Card>
              <CardHeader title="Security" subtitle="Authentication and access control" icon={<Shield className="h-4 w-4" />} />
              <div className="space-y-4 p-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">New Password</label>
                  <input type="password" placeholder="•••••••••" className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">Confirm Password</label>
                  <input type="password" placeholder="•••••••••" className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:border-blue-500 focus:outline-none" />
                </div>
                <Button variant="primary">
                  <Shield className="h-4 w-4" /> Update Password
                </Button>
              </div>
            </Card>
          )}

          {section === 'api' && (
            <Card>
              <CardHeader title="API & Integrations" subtitle="Spring Boot REST API connection" icon={<Database className="h-4 w-4" />} />
              <div className="space-y-4 p-5">
                <Field label="API Base URL" value="https://api.vps-monitor.local/api/v1" readOnly />
                <Field label="API Key" value="vps-mon-••••••••••••••••" readOnly />
                <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                  <p className="text-xs text-slate-500">Connection Status</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium text-emerald-400">Connected</span>
                  </div>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                  <p className="text-xs text-slate-500">Auto-Discovery</p>
                  <p className="mt-1 text-sm text-slate-300">Hestia CP domain scanning is active</p>
                  <p className="mt-1 text-xs text-slate-500">Last scan: 5 minutes ago · 13 domains found</p>
                </div>
              </div>
            </Card>
          )}

          {section === 'system' && (
            <Card>
              <CardHeader title="System Configuration" subtitle="VPS monitoring settings" icon={<Server className="h-4 w-4" />} />
              <div className="space-y-4 p-5">
                <Field label="Monitored Host" value="vps-prod-01" readOnly />
                <Field label="OS" value="Ubuntu 22.04 LTS" readOnly />
                <Field label="Hestia CP Version" value="1.9.2" readOnly />
                <Field label="Nginx Version" value="1.24.0" readOnly />
                <Field label="MySQL Version" value="8.0.36" readOnly />
                <Field label="PHP Version" value="8.2 FPM" readOnly />
                <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                  <p className="text-xs text-slate-500">Data Refresh Interval</p>
                  <p className="mt-1 text-sm text-slate-300">Every 30 seconds</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, readOnly }: { label: string; value: string; readOnly?: boolean }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-300">{label}</label>
      <input
        type="text"
        defaultValue={value}
        readOnly={readOnly}
        className={`w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 transition-colors focus:border-blue-500 focus:outline-none ${
          readOnly ? 'cursor-not-allowed opacity-70' : ''
        }`}
      />
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div>
        <p className="text-sm font-medium text-slate-200">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-slate-700'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}
