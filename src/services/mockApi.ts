import type {
  ServerSummary,
  MetricPoint,
  ServiceHealth,
  Project,
  LogEntry,
  TrafficPoint,
  Alert,
  AlertRule,
  Notification,
} from '@/types';

function isoHoursAgo(hours: number): string {
  const d = new Date();
  d.setHours(d.getHours() - hours, 0, 0, 0);
  return d.toISOString();
}

function isoMinutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

export function getDashboardSummary(): { data: ServerSummary } {
  return {
    data: {
      server: {
        cpuPercent: 34.2,
        memoryPercent: 58.7,
        diskPercent: 71.3,
        uptimeSeconds: 1_842_300,
      },
      projects: {
        up: 10,
        down: 1,
        degraded: 2,
        total: 13,
      },
      traffic: {
        requestsToday: 152_340,
        http5xx: 47,
        http4xx: 1_204,
        http2xx: 151_089,
      },
      alerts: {
        active: 5,
        critical: 2,
        warning: 3,
      },
    },
  };
}

export function getServerMetrics(range = '24h'): { data: MetricPoint[] } {
  const points: MetricPoint[] = [];
  const count = range === '24h' ? 24 : 7;
  const baseCpu = 30;
  const baseMem = 55;
  for (let i = count - 1; i >= 0; i--) {
    const ts = isoHoursAgo(i);
    const wave = Math.sin((count - i) / 3) * 12;
    const spike = i === 5 || i === 11 ? 25 : 0;
    points.push({
      timestamp: ts,
      cpuUsagePercent: Math.max(5, Math.round((baseCpu + wave + spike + Math.random() * 8) * 10) / 10),
      memoryUsagePercent: Math.max(20, Math.round((baseMem + wave / 2 + Math.random() * 6) * 10) / 10),
    });
  }
  return { data: points };
}

export function getServices(): { data: ServiceHealth[] } {
  return {
    data: [
      { name: 'nginx', displayName: 'Nginx', status: 'RUNNING', uptime: '21d 8h', cpu: 2.1, memory: 1.8 },
      { name: 'mysql', displayName: 'MySQL', status: 'RUNNING', uptime: '21d 8h', cpu: 5.4, memory: 12.3 },
      { name: 'php8.2-fpm', displayName: 'PHP-FPM 8.2', status: 'RUNNING', uptime: '14d 3h', cpu: 3.2, memory: 4.1 },
      { name: 'redis', displayName: 'Redis', status: 'RUNNING', uptime: '21d 8h', cpu: 0.4, memory: 0.9 },
      { name: 'node-app', displayName: 'Node.js (PM2)', status: 'DEGRADED', uptime: '2d 5h', cpu: 18.7, memory: 22.4 },
      { name: 'fail2ban', displayName: 'Fail2Ban', status: 'RUNNING', uptime: '21d 8h', cpu: 0.1, memory: 0.3 },
    ],
  };
}

const projectDefs: Array<Omit<Project, 'lastChecked'> & { lastChecked?: string }> = [
  {
    id: '1',
    domain: 'acme-corp.com',
    projectType: 'NEXTJS',
    status: 'UP',
    ownerUsername: 'admin',
    sslStatus: 'VALID',
    sslExpiryDays: 87,
    documentRoot: '/home/admin/web/acme-corp.com/public_html',
    publicUrl: 'https://acme-corp.com',
    cpuPercent: 12.4,
    memoryPercent: 18.2,
    requestsToday: 8420,
    http2xx: 8310,
    http4xx: 95,
    http5xx: 15,
  },
  {
    id: '2',
    domain: 'blog.example.io',
    projectType: 'WORDPRESS',
    status: 'UP',
    ownerUsername: 'editor',
    sslStatus: 'EXPIRING_SOON',
    sslExpiryDays: 12,
    documentRoot: '/home/editor/web/blog.example.io/public_html',
    publicUrl: 'https://blog.example.io',
    cpuPercent: 4.1,
    memoryPercent: 7.8,
    requestsToday: 3210,
    http2xx: 3180,
    http4xx: 25,
    http5xx: 5,
  },
  {
    id: '3',
    domain: 'api.gateway.dev',
    projectType: 'NODEJS',
    status: 'DEGRADED',
    ownerUsername: 'developer',
    sslStatus: 'VALID',
    sslExpiryDays: 64,
    documentRoot: '/home/developer/web/api.gateway.dev/public_html',
    publicUrl: 'https://api.gateway.dev',
    cpuPercent: 28.9,
    memoryPercent: 34.5,
    requestsToday: 12_400,
    http2xx: 11_900,
    http4xx: 480,
    http5xx: 20,
  },
  {
    id: '4',
    domain: 'legacy-shop.net',
    projectType: 'PHP',
    status: 'DOWN',
    ownerUsername: 'admin',
    sslStatus: 'EXPIRED',
    sslExpiryDays: -3,
    documentRoot: '/home/admin/web/legacy-shop.net/public_html',
    publicUrl: 'https://legacy-shop.net',
    cpuPercent: 0,
    memoryPercent: 0,
    requestsToday: 0,
    http2xx: 0,
    http4xx: 0,
    http5xx: 0,
  },
  {
    id: '5',
    domain: 'portfolio.jane.io',
    projectType: 'NEXTJS',
    status: 'UP',
    ownerUsername: 'jane',
    sslStatus: 'VALID',
    sslExpiryDays: 210,
    documentRoot: '/home/jane/web/portfolio.jane.io/public_html',
    publicUrl: 'https://portfolio.jane.io',
    cpuPercent: 2.3,
    memoryPercent: 5.1,
    requestsToday: 980,
    http2xx: 975,
    http4xx: 4,
    http5xx: 1,
  },
  {
    id: '6',
    domain: 'docs.internal.dev',
    projectType: 'NEXTJS',
    status: 'UP',
    ownerUsername: 'admin',
    sslStatus: 'VALID',
    sslExpiryDays: 145,
    documentRoot: '/home/admin/web/docs.internal.dev/public_html',
    publicUrl: 'https://docs.internal.dev',
    cpuPercent: 6.7,
    memoryPercent: 9.2,
    requestsToday: 4100,
    http2xx: 4090,
    http4xx: 8,
    http5xx: 2,
  },
  {
    id: '7',
    domain: 'store.frontend.io',
    projectType: 'WORDPRESS',
    status: 'UP',
    ownerUsername: 'shop',
    sslStatus: 'VALID',
    sslExpiryDays: 33,
    documentRoot: '/home/shop/web/store.frontend.io/public_html',
    publicUrl: 'https://store.frontend.io',
    cpuPercent: 8.9,
    memoryPercent: 14.6,
    requestsToday: 6700,
    http2xx: 6650,
    http4xx: 40,
    http5xx: 10,
  },
  {
    id: '8',
    domain: 'staging.acme-corp.com',
    projectType: 'NODEJS',
    status: 'DEGRADED',
    ownerUsername: 'developer',
    sslStatus: 'EXPIRING_SOON',
    sslExpiryDays: 8,
    documentRoot: '/home/developer/web/staging.acme-corp.com/public_html',
    publicUrl: 'https://staging.acme-corp.com',
    cpuPercent: 15.2,
    memoryPercent: 19.8,
    requestsToday: 2100,
    http2xx: 2050,
    http4xx: 35,
    http5xx: 15,
  },
  {
    id: '9',
    domain: 'cdn.assets.io',
    projectType: 'NGINX',
    status: 'UP',
    ownerUsername: 'admin',
    sslStatus: 'VALID',
    sslExpiryDays: 300,
    documentRoot: '/var/www/cdn.assets.io',
    publicUrl: 'https://cdn.assets.io',
    cpuPercent: 3.4,
    memoryPercent: 2.1,
    requestsToday: 45_000,
    http2xx: 44_990,
    http4xx: 8,
    http5xx: 2,
  },
  {
    id: '10',
    domain: 'auth.service.dev',
    projectType: 'NODEJS',
    status: 'UP',
    ownerUsername: 'admin',
    sslStatus: 'VALID',
    sslExpiryDays: 78,
    documentRoot: '/home/admin/web/auth.service.dev/public_html',
    publicUrl: 'https://auth.service.dev',
    cpuPercent: 7.8,
    memoryPercent: 11.3,
    requestsToday: 9800,
    http2xx: 9750,
    http4xx: 45,
    http5xx: 5,
  },
  {
    id: '11',
    domain: 'analytics.portal.io',
    projectType: 'NEXTJS',
    status: 'UP',
    ownerUsername: 'data',
    sslStatus: 'VALID',
    sslExpiryDays: 92,
    documentRoot: '/home/data/web/analytics.portal.io/public_html',
    publicUrl: 'https://analytics.portal.io',
    cpuPercent: 11.5,
    memoryPercent: 16.7,
    requestsToday: 5600,
    http2xx: 5580,
    http4xx: 18,
    http5xx: 2,
  },
  {
    id: '12',
    domain: 'old-landing.net',
    projectType: 'PHP',
    status: 'UP',
    ownerUsername: 'admin',
    sslStatus: 'EXPIRING_SOON',
    sslExpiryDays: 5,
    documentRoot: '/home/admin/web/old-landing.net/public_html',
    publicUrl: 'https://old-landing.net',
    cpuPercent: 1.2,
    memoryPercent: 3.4,
    requestsToday: 340,
    http2xx: 338,
    http4xx: 1,
    http5xx: 1,
  },
  {
    id: '13',
    domain: 'beta.platform.io',
    projectType: 'NEXTJS',
    status: 'UP',
    ownerUsername: 'developer',
    sslStatus: 'VALID',
    sslExpiryDays: 180,
    documentRoot: '/home/developer/web/beta.platform.io/public_html',
    publicUrl: 'https://beta.platform.io',
    cpuPercent: 9.8,
    memoryPercent: 13.2,
    requestsToday: 7200,
    http2xx: 7180,
    http4xx: 15,
    http5xx: 5,
  },
];

export function getProjects(): { data: Project[] } {
  return {
    data: projectDefs.map((p) => ({
      ...p,
      lastChecked: isoMinutesAgo(Math.floor(Math.random() * 10) + 1),
  })) as Project[],
  };
}

export function getProjectById(id: string): { data: Project | null } {
  const all = getProjects().data;
  return { data: all.find((p) => p.id === id) ?? null };
}

export function getProjectTraffic(id: string): { data: TrafficPoint[] } {
  const project = getProjectById(id).data;
  const base2xx = project?.http2xx ?? 1000;
  const base4xx = project?.http4xx ?? 10;
  const base5xx = project?.http5xx ?? 1;
  const points: TrafficPoint[] = [];
  for (let i = 23; i >= 0; i--) {
    const ts = isoHoursAgo(i);
    const factor = 0.5 + Math.random();
    points.push({
      timestamp: ts,
      http2xx: Math.round((base2xx / 24) * factor),
      http4xx: Math.round((base4xx / 24) * factor),
      http5xx: Math.round((base5xx / 24) * factor),
    });
  }
  return { data: points };
}

export function getProjectLogs(id: string): { data: LogEntry[] } {
  const project = getProjectById(id).data;
  const domain = project?.domain ?? 'unknown';
  const logs: LogEntry[] = [
    { timestamp: isoMinutesAgo(1), level: 'ERROR', message: ` upstream timed out (110: Connection timed out) while reading response header from upstream, client: 203.0.113.45, server: ${domain}`, source: 'nginx-error' },
    { timestamp: isoMinutesAgo(2), level: 'WARN', message: ` upstream connection temporarily unavailable while connecting to upstream, server: ${domain}`, source: 'nginx-error' },
    { timestamp: isoMinutesAgo(3), level: 'INFO', message: ` 203.0.113.45 "GET /api/health HTTP/2.0" 200 0.002 "${domain}" "Mozilla/5.0"`, source: 'nginx-access' },
    { timestamp: isoMinutesAgo(4), level: 'INFO', message: ` 198.51.100.12 "POST /api/v1/login HTTP/2.0" 200 0.145 "${domain}" "axios/1.7"`, source: 'nginx-access' },
    { timestamp: isoMinutesAgo(5), level: 'WARN', message: ` 198.51.100.12 "GET /wp-admin/ HTTP/2.0" 404 0.003 "${domain}" "Mozilla/5.0"`, source: 'nginx-access' },
    { timestamp: isoMinutesAgo(6), level: 'ERROR', message: ` *2567 recv() failed (104: Connection reset by peer) while reading response header from upstream, client: 203.0.113.45, server: ${domain}`, source: 'nginx-error' },
    { timestamp: isoMinutesAgo(8), level: 'INFO', message: ` 192.0.2.1 "GET / HTTP/2.0" 200 0.001 "${domain}" "Mozilla/5.0 (compatible; Googlebot/2.1)"`, source: 'nginx-access' },
    { timestamp: isoMinutesAgo(10), level: 'DEBUG', message: ` *2564 connect() to unix:/run/php/php8.2-fpm.sock:78 failed (11: Resource temporarily unavailable), client: 198.51.100.12, server: ${domain}`, source: 'nginx-error' },
    { timestamp: isoMinutesAgo(12), level: 'INFO', message: ` 203.0.113.99 "GET /assets/app.js HTTP/2.0" 200 0.000 "${domain}" "Mozilla/5.0"`, source: 'nginx-access' },
    { timestamp: isoMinutesAgo(15), level: 'ERROR', message: ` *2560 upstream sent no valid HTTP/1.0 header while reading response header from upstream, client: 203.0.113.45, server: ${domain}`, source: 'nginx-error' },
    { timestamp: isoMinutesAgo(18), level: 'INFO', message: ` 192.0.2.50 "GET /robots.txt HTTP/2.0" 200 0.001 "${domain}" "Mozilla/5.0 (compatible; AhrefsBot/7.0)"`, source: 'nginx-access' },
    { timestamp: isoMinutesAgo(22), level: 'WARN', message: ` a client request body is buffered to a temporary file /var/lib/nginx/body/0000033, client: 198.51.100.12, server: ${domain}`, source: 'nginx-error' },
    { timestamp: isoMinutesAgo(25), level: 'INFO', message: ` 203.0.113.45 "GET /api/users HTTP/2.0" 200 0.089 "${domain}" "axios/1.7"`, source: 'nginx-access' },
    { timestamp: isoMinutesAgo(30), level: 'INFO', message: ` 192.0.2.1 "GET / HTTP/2.0" 200 0.001 "${domain}" "Mozilla/5.0"`, source: 'nginx-access' },
  ];
  return { data: logs };
}

export function getAlerts(): { data: Alert[] } {
  return {
    data: [
      {
        id: '1',
        title: 'High CPU Detected',
        description: 'CPU usage exceeded 90% for 5 minutes on host vps-prod-01',
        severity: 'CRITICAL',
        status: 'ACTIVE',
        timestamp: isoMinutesAgo(3),
        source: 'System Monitor',
      },
      {
        id: '2',
        title: 'Project Down: legacy-shop.net',
        description: 'Nginx returned 502 Bad Gateway. PHP-FPM process not responding.',
        severity: 'CRITICAL',
        status: 'ACTIVE',
        timestamp: isoMinutesAgo(12),
        source: 'Health Checker',
      },
      {
        id: '3',
        title: 'SSL Certificate Expiring Soon',
        description: 'SSL certificate for blog.example.io expires in 12 days',
        severity: 'WARNING',
        status: 'ACTIVE',
        timestamp: isoMinutesAgo(45),
        source: 'SSL Monitor',
      },
      {
        id: '4',
        title: 'Memory Usage Elevated',
        description: 'RAM usage has been above 80% for 10 minutes',
        severity: 'WARNING',
        status: 'ACTIVE',
        timestamp: isoMinutesAgo(62),
        source: 'System Monitor',
      },
      {
        id: '5',
        title: 'Elevated 5xx Error Rate',
        description: 'api.gateway.dev returned 20 HTTP 5xx errors in the last hour',
        severity: 'WARNING',
        status: 'ACTIVE',
        timestamp: isoMinutesAgo(90),
        source: 'Traffic Analyzer',
      },
      {
        id: '6',
        title: 'Disk Space Warning',
        description: 'Disk usage reached 71%. Consider cleaning up old logs.',
        severity: 'INFO',
        status: 'ACKNOWLEDGED',
        timestamp: isoMinutesAgo(180),
        source: 'System Monitor',
      },
    ],
  };
}

export function getAlertRules(): { data: AlertRule[] } {
  return {
    data: [
      { id: '1', name: 'High CPU', metric: 'cpu_usage', condition: '>', threshold: '90%', duration: '5m', enabled: true },
      { id: '2', name: 'High Memory', metric: 'memory_usage', condition: '>', threshold: '85%', duration: '10m', enabled: true },
      { id: '3', name: 'Disk Space Low', metric: 'disk_usage', condition: '>', threshold: '80%', duration: '0m', enabled: true },
      { id: '4', name: 'Service Down', metric: 'service_status', condition: '==', threshold: 'STOPPED', duration: '1m', enabled: true },
      { id: '5', name: 'High 5xx Rate', metric: 'http_5xx_rate', condition: '>', threshold: '10/min', duration: '5m', enabled: true },
      { id: '6', name: 'SSL Expiry', metric: 'ssl_days_remaining', condition: '<', threshold: '14 days', duration: '0m', enabled: true },
      { id: '7', name: 'High Load Average', metric: 'load_avg', condition: '>', threshold: '4.0', duration: '5m', enabled: false },
    ],
  };
}

export function getNotifications(): Notification[] {
  return [
    { id: '1', title: 'High CPU Detected', message: 'CPU usage exceeded 90% on vps-prod-01', timestamp: isoMinutesAgo(3), read: false, severity: 'CRITICAL' },
    { id: '2', title: 'Project Down', message: 'legacy-shop.net is not responding', timestamp: isoMinutesAgo(12), read: false, severity: 'CRITICAL' },
    { id: '3', title: 'SSL Expiring Soon', message: 'blog.example.io SSL expires in 12 days', timestamp: isoMinutesAgo(45), read: false, severity: 'WARNING' },
    { id: '4', title: 'Memory Elevated', message: 'RAM usage above 80% for 10 minutes', timestamp: isoMinutesAgo(62), read: false, severity: 'WARNING' },
    { id: '5', title: 'Disk Space Warning', message: 'Disk usage at 71%', timestamp: isoMinutesAgo(180), read: true, severity: 'INFO' },
  ];
}
