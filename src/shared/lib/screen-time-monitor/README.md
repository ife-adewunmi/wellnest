# screen-time-monitor

cd '..'

## Install

```bash
npm install screen-time-monitor
npx cap sync
```

## API

<docgen-index>

* [`isUsageStatsPermissionGranted()`](#isusagestatspermissiongranted)
* [`openUsageStatsSettings()`](#openusagestatssettings)
* [`queryAndAggregateUsageStats(...)`](#queryandaggregateusagestats)
* [`startMonitoring(...)`](#startmonitoring)
* [`stopMonitoring()`](#stopmonitoring)
* [`getMonitoringStatus()`](#getmonitoringstatus)
* [`getCurrentDayUsage()`](#getcurrentdayusage)
* [`addListener('screenTimeUpdate', ...)`](#addlistenerscreentimeupdate-)
* [`removeAllListeners()`](#removealllisteners)
* [Interfaces](#interfaces)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### isUsageStatsPermissionGranted()

```typescript
isUsageStatsPermissionGranted() => Promise<UsageStatsPermissionResult>
```

Check if usage stats permission is granted

**Returns:** <code>Promise&lt;<a href="#usagestatspermissionresult">UsageStatsPermissionResult</a>&gt;</code>

--------------------


### openUsageStatsSettings()

```typescript
openUsageStatsSettings() => Promise<void>
```

Open usage stats settings page

--------------------


### queryAndAggregateUsageStats(...)

```typescript
queryAndAggregateUsageStats(options: UsageStatsOptions) => Promise<{ stats: { [key: string]: UsageStats; }; }>
```

Query and aggregate usage stats for specified time period

| Param         | Type                                                            |
| ------------- | --------------------------------------------------------------- |
| **`options`** | <code><a href="#usagestatsoptions">UsageStatsOptions</a></code> |

**Returns:** <code>Promise&lt;{ stats: { [key: string]: <a href="#usagestats">UsageStats</a>; }; }&gt;</code>

--------------------


### startMonitoring(...)

```typescript
startMonitoring(options: StartMonitoringOptions) => Promise<void>
```

Start background monitoring of screen time

| Param         | Type                                                                      |
| ------------- | ------------------------------------------------------------------------- |
| **`options`** | <code><a href="#startmonitoringoptions">StartMonitoringOptions</a></code> |

--------------------


### stopMonitoring()

```typescript
stopMonitoring() => Promise<void>
```

Stop background monitoring

--------------------


### getMonitoringStatus()

```typescript
getMonitoringStatus() => Promise<MonitoringStatus>
```

Get current monitoring status

**Returns:** <code>Promise&lt;<a href="#monitoringstatus">MonitoringStatus</a>&gt;</code>

--------------------


### getCurrentDayUsage()

```typescript
getCurrentDayUsage() => Promise<{ apps: AppUsageData[]; }>
```

Get current day's app usage data

**Returns:** <code>Promise&lt;{ apps: AppUsageData[]; }&gt;</code>

--------------------


### addListener('screenTimeUpdate', ...)

```typescript
addListener(eventName: 'screenTimeUpdate', listenerFunc: (event: { apps: ScreenTimeEvent[]; }) => void) => Promise<PluginListenerHandle>
```

Listen for screen time updates

| Param              | Type                                                          |
| ------------------ | ------------------------------------------------------------- |
| **`eventName`**    | <code>'screenTimeUpdate'</code>                               |
| **`listenerFunc`** | <code>(event: { apps: ScreenTimeEvent[]; }) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### removeAllListeners()

```typescript
removeAllListeners() => Promise<void>
```

Remove all listeners

--------------------


### Interfaces


#### UsageStatsPermissionResult

| Prop          | Type                 |
| ------------- | -------------------- |
| **`granted`** | <code>boolean</code> |


#### UsageStats

| Prop                        | Type                |
| --------------------------- | ------------------- |
| **`packageName`**           | <code>string</code> |
| **`totalTimeInForeground`** | <code>number</code> |
| **`lastTimeUsed`**          | <code>number</code> |
| **`firstTimeStamp`**        | <code>number</code> |
| **`lastTimeStamp`**         | <code>number</code> |


#### UsageStatsOptions

| Prop            | Type                |
| --------------- | ------------------- |
| **`beginTime`** | <code>number</code> |
| **`endTime`**   | <code>number</code> |


#### StartMonitoringOptions

| Prop                  | Type                  |
| --------------------- | --------------------- |
| **`apps`**            | <code>string[]</code> |
| **`intervalMinutes`** | <code>number</code>   |


#### MonitoringStatus

| Prop                  | Type                  |
| --------------------- | --------------------- |
| **`isActive`**        | <code>boolean</code>  |
| **`intervalMinutes`** | <code>number</code>   |
| **`monitoredApps`**   | <code>string[]</code> |
| **`lastUpdate`**      | <code>number</code>   |


#### AppUsageData

| Prop                  | Type                |
| --------------------- | ------------------- |
| **`appName`**         | <code>string</code> |
| **`packageName`**     | <code>string</code> |
| **`durationSeconds`** | <code>number</code> |
| **`category`**        | <code>string</code> |
| **`lastUsed`**        | <code>number</code> |


#### PluginListenerHandle

| Prop         | Type                                      |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |


#### ScreenTimeEvent

| Prop                  | Type                |
| --------------------- | ------------------- |
| **`app`**             | <code>string</code> |
| **`packageName`**     | <code>string</code> |
| **`durationSeconds`** | <code>number</code> |
| **`lastUsed`**        | <code>number</code> |
| **`category`**        | <code>string</code> |

</docgen-api>
