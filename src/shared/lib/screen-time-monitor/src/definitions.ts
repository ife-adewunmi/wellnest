import type { PluginListenerHandle } from '@capacitor/core';

export interface UsageStatsOptions {
  beginTime: number;
  endTime: number;
}

export interface UsageStats {
  packageName: string;
  totalTimeInForeground: number;
  lastTimeUsed: number;
  firstTimeStamp: number;
  lastTimeStamp: number;
}

export interface UsageStatsPermissionResult {
  granted: boolean;
}

export interface StartMonitoringOptions {
  apps?: string[]; // e.g. ["com.instagram.android", "com.facebook.katana"]
  intervalMinutes?: number; // default 15
}

export interface ScreenTimeEvent {
  app: string;
  packageName: string;
  durationSeconds: number;
  lastUsed: number;
  category?: string;
}

export interface AppUsageData {
  appName: string;
  packageName: string;
  durationSeconds: number;
  category: string;
  lastUsed: number;
}

export interface MonitoringStatus {
  isActive: boolean;
  intervalMinutes: number;
  monitoredApps: string[];
  lastUpdate?: number;
}

export interface ScreenTimeMonitorPlugin {
  /**
   * Check if usage stats permission is granted
   */
  isUsageStatsPermissionGranted(): Promise<UsageStatsPermissionResult>;

  /**
   * Open usage stats settings page
   */
  openUsageStatsSettings(): Promise<void>;

  /**
   * Query and aggregate usage stats for specified time period
   */
  queryAndAggregateUsageStats(options: UsageStatsOptions): Promise<{ stats: { [key: string]: UsageStats } }>;

  /**
   * Start background monitoring of screen time
   */
  startMonitoring(options: StartMonitoringOptions): Promise<void>;

  /**
   * Stop background monitoring
   */
  stopMonitoring(): Promise<void>;

  /**
   * Get current monitoring status
   */
  getMonitoringStatus(): Promise<MonitoringStatus>;

  /**
   * Get current day's app usage data
   */
  getCurrentDayUsage(): Promise<{ apps: AppUsageData[] }>;

  /**
   * Listen for screen time updates
   */
  addListener(
    eventName: 'screenTimeUpdate',
    listenerFunc: (event: { apps: ScreenTimeEvent[] }) => void,
  ): Promise<PluginListenerHandle>;

  /**
   * Remove all listeners
   */
  removeAllListeners(): Promise<void>;
}
