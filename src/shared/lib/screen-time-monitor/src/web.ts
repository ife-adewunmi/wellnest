import { WebPlugin } from '@capacitor/core';
import type { PluginListenerHandle } from '@capacitor/core';

import type { 
  AppUsageData, 
  MonitoringStatus, 
  ScreenTimeMonitorPlugin, 
  StartMonitoringOptions, 
  UsageStats, 
  UsageStatsOptions, 
  UsageStatsPermissionResult 
} from './definitions';

export class ScreenTimeMonitorWeb extends WebPlugin implements ScreenTimeMonitorPlugin {
  async startMonitoring(_options: StartMonitoringOptions): Promise<void> {
    throw this.unavailable('This method is not available on the web.');
  }

  async stopMonitoring(): Promise<void> {
    throw this.unavailable('This method is not available on the web.');
  }

  async getMonitoringStatus(): Promise<MonitoringStatus> {
    throw this.unavailable('This method is not available on the web.');
  }

  async getCurrentDayUsage(): Promise<{ apps: AppUsageData[] }> {
    throw this.unavailable('This method is not available on the web.');
  }

  async isUsageStatsPermissionGranted(): Promise<UsageStatsPermissionResult> {
    return { granted: false };
  }

  async openUsageStatsSettings(): Promise<void> {
    throw this.unavailable('This method is not available on the web.');
  }

  async queryAndAggregateUsageStats(_options: UsageStatsOptions): Promise<{ stats: { [key: string]: UsageStats } }> {
    throw this.unavailable('This method is not available on the web.');
  }

  async addListener(_eventName: 'screenTimeUpdate', _listenerFunc: (event: { apps: any[] }) => void): Promise<PluginListenerHandle> {
    throw this.unavailable('This method is not available on the web.');
  }

  async removeAllListeners(): Promise<void> {
    // Web implementation - no-op since there are no listeners to remove
    return Promise.resolve();
  }
}
