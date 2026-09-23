import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import {
  Activity,
  LayoutDashboard,
  FolderGit2,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Info,
  XCircle,
} from 'lucide-react';
import { getCurrentUser, logout } from '@/services/auth';
import { getNotifications } from '@/services/mockApi';
import { formatTimeAgo } from '@/lib/format';
import type { Notification } from '@/types';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderGit2 },
  { to: '/alerts', label: 'Alerts', icon: Bell },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    setNotifications(getNotifications());
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function markAllRead() {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  }

  const notifIcon = (severity: string) => {
    if (severity === 'CRITICAL') return <XCircle className="h-4 w-4 text-red-400" />;
    if (severity === 'WARNING') return <AlertTriangle className="h-4 w-4 text-amber-400" />;
    return <Info className="h-4 w-4 text-blue-400" />;
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-slate-800 bg-slate-900/40 transition-all duration-200 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-slate-800 px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 shadow-lg shadow-blue-600/20">
            <Activity className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-50">VPS Monitor</p>
              <p className="text-[10px] text-slate-500">Observability</p>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-1 px-2 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center gap-2 border-t border-slate-800 py-3 text-slate-500 transition-colors hover:text-slate-300"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!collapsed && <span className="text-xs">Collapse</span>}
        </button>
      </aside>

      {/* Main content */}
      <div className={`flex flex-1 flex-col transition-all duration-200 ${collapsed ? 'ml-16' : 'ml-60'}`}>
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-2 text-sm text-slate-500">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              System Online
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 animate-fade-in overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                    <span className="text-sm font-semibold text-slate-100">Notifications</span>
                    <button onClick={markAllRead} className="text-xs text-blue-400 hover:text-blue-300">
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`flex gap-3 border-b border-slate-800/50 px-4 py-3 transition-colors hover:bg-slate-800/30 ${
                          !n.read ? 'bg-slate-800/20' : ''
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">{notifIcon(n.severity)}</div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-200">{n.title}</p>
                          <p className="text-xs text-slate-500">{n.message}</p>
                          <p className="mt-1 text-[10px] text-slate-600">{formatTimeAgo(n.timestamp)}</p>
                        </div>
                        {!n.read && <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-800"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-teal-500 text-sm font-bold text-white">
                  {(user?.username ?? 'U')[0].toUpperCase()}
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-medium text-slate-200">{user?.name ?? 'admin'}</p>
                  <p className="text-[10px] text-slate-500">{user?.role ?? 'Administrator'}</p>
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-48 animate-fade-in overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
                  <div className="border-b border-slate-800 px-4 py-3">
                    <p className="text-sm font-medium text-slate-200">{user?.name ?? 'admin'}</p>
                    <p className="text-xs text-slate-500">{user?.role ?? 'Administrator'}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-red-400"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
