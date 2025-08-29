import { registerPlugin } from '@capacitor/core';

import type { ScreenTimeMonitorPlugin } from './definitions';

const ScreenTimeMonitor = registerPlugin<ScreenTimeMonitorPlugin>('ScreenTimeMonitor', {
  web: () => import('./web').then(m => new m.ScreenTimeMonitorWeb()),
});

export * from './definitions';
export { ScreenTimeMonitor };
