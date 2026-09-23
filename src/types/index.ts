export type ProjectStatus = 'UP' | 'DOWN' | 'DEGRADED';
export type ProjectType = 'NEXTJS' | 'NODEJS' | 'PHP' | 'WORDPRESS' | 'NGINX';
export type SslStatus = 'VALID' | 'EXPIRING_SOON' | 'EXPIRED' | 'NONE';
export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';
export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
export type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';

export interface ServerSummary {
  server: {
    cpuPercent: number;
    memoryPercent: number;
    diskPercent: number;
    uptimeSeconds: number;
  };
  projects: {
    up: number;
    down: number;
    degraded: number;
    total: number;
  };
  traffic: {
    requestsToday: number;
    http5xx: number;
    http4xx: number;
    http2xx: number;
  };
  alerts: {
    active: number;
    critical: number;
    warning: number;
  };
}

export interface MetricPoint {
  timestamp: string;
  cpuUsagePercent: number;
  memoryUsagePercent: number;
}

export interface ServiceHealth {
  name: string;
  displayName: string;
  status: 'RUNNING' | 'STOPPED' | 'DEGRADED';
  uptime: string;
  cpu: number;
  memory: number;
}

export interface Project {
  id: string;
  domain: string;
  projectType: ProjectType;
  status: ProjectStatus;
  ownerUsername: string;
  sslStatus: SslStatus;
  sslExpiryDays: number;
  documentRoot: string;
  publicUrl: string;
  cpuPercent: number;
  memoryPercent: number;
  requestsToday: number;
  http2xx: number;
  http4xx: number;
  http5xx: number;
  lastChecked: string;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  source: string;
}

export interface TrafficPoint {
  timestamp: string;
  http2xx: number;
  http4xx: number;
  http5xx: number;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  status: AlertStatus;
  timestamp: string;
  source: string;
}

export interface AlertRule {
  id: string;
  name: string;
  metric: string;
  condition: string;
  threshold: string;
  duration: string;
  enabled: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  severity: AlertSeverity;
}
