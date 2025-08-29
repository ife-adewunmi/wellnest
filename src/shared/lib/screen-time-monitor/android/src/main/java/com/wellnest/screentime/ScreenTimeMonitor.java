package com.wellnest.screentime;

import android.app.AppOpsManager;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import androidx.work.*;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Logger;

import java.util.*;
import java.util.concurrent.TimeUnit;

public class ScreenTimeMonitor {
    
    private static final String TAG = "ScreenTimeMonitor";
    private static final String PREFS_NAME = "screen_time_monitor";
    private static final String KEY_MONITORING_ACTIVE = "monitoring_active";
    private static final String KEY_INTERVAL_MINUTES = "interval_minutes";
    private static final String KEY_MONITORED_APPS = "monitored_apps";
    private static final String WORK_TAG = "screen_time_monitoring";
    
    private UsageStatsManager usageStatsManager;
    private PackageManager packageManager;
    
    public void initialize(Context context) {
        usageStatsManager = (UsageStatsManager) context.getSystemService(Context.USAGE_STATS_SERVICE);
        packageManager = context.getPackageManager();
    }
    
    public boolean isUsageStatsPermissionGranted(Context context) {
        AppOpsManager appOps = (AppOpsManager) context.getSystemService(Context.APP_OPS_SERVICE);
        int mode = appOps.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, android.os.Process.myUid(), context.getPackageName());
        return mode == AppOpsManager.MODE_ALLOWED;
    }
    
    public JSObject queryAndAggregateUsageStats(Context context, long beginTime, long endTime) throws Exception {
        if (!isUsageStatsPermissionGranted(context)) {
            throw new Exception("Permission not granted. Please open settings and grant usage access.");
        }
        
        Map<String, UsageStats> aggregatedStats = usageStatsManager.queryAndAggregateUsageStats(beginTime, endTime);
        JSObject result = new JSObject();
        
        if (aggregatedStats != null) {
            JSObject statsObject = new JSObject();
            for (Map.Entry<String, UsageStats> entry : aggregatedStats.entrySet()) {
                String packageName = entry.getKey();
                UsageStats stats = entry.getValue();
                JSObject usageStatsJson = new JSObject();
                usageStatsJson.put("packageName", stats.getPackageName());
                usageStatsJson.put("totalTimeInForeground", stats.getTotalTimeInForeground());
                usageStatsJson.put("lastTimeUsed", stats.getLastTimeUsed());
                usageStatsJson.put("firstTimeStamp", stats.getFirstTimeStamp());
                usageStatsJson.put("lastTimeStamp", stats.getLastTimeStamp());
                statsObject.put(packageName, usageStatsJson);
            }
            result.put("stats", statsObject);
        } else {
            throw new Exception("Failed to retrieve usage stats.");
        }
        
        return result;
    }
    
    public void startMonitoring(Context context, ScreenTimeMonitorPlugin plugin, JSArray apps, int intervalMinutes) throws Exception {
        if (!isUsageStatsPermissionGranted(context)) {
            throw new Exception("Permission not granted. Please open settings and grant usage access.");
        }
        
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        
        editor.putBoolean(KEY_MONITORING_ACTIVE, true);
        editor.putInt(KEY_INTERVAL_MINUTES, intervalMinutes);
        
        // Store monitored apps
        Set<String> appSet = new HashSet<>();
        if (apps != null) {
            for (int i = 0; i < apps.length(); i++) {
                try {
                    appSet.add(apps.getString(i));
                } catch (Exception e) {
                    Logger.error(TAG, "Error parsing app: " + e.getMessage());
                }
            }
        }
        editor.putStringSet(KEY_MONITORED_APPS, appSet);
        editor.apply();
        
        // Schedule periodic work
        Constraints constraints = new Constraints.Builder()
                .setRequiredNetworkType(NetworkType.NOT_REQUIRED)
                .build();
        
        PeriodicWorkRequest workRequest = new PeriodicWorkRequest.Builder(
                ScreenTimeWorker.class,
                intervalMinutes,
                TimeUnit.MINUTES
        )
                .setConstraints(constraints)
                .addTag(WORK_TAG)
                .build();
        
        WorkManager.getInstance(context)
                .enqueueUniquePeriodicWork(
                        "screen_time_monitoring",
                        ExistingPeriodicWorkPolicy.REPLACE,
                        workRequest
                );
        
        Logger.info(TAG, "Started monitoring with interval: " + intervalMinutes + " minutes");
    }
    
    public void stopMonitoring(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        editor.putBoolean(KEY_MONITORING_ACTIVE, false);
        editor.apply();
        
        WorkManager.getInstance(context).cancelAllWorkByTag(WORK_TAG);
        Logger.info(TAG, "Stopped monitoring");
    }
    
    public JSObject getMonitoringStatus(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        
        JSObject status = new JSObject();
        status.put("isActive", prefs.getBoolean(KEY_MONITORING_ACTIVE, false));
        status.put("intervalMinutes", prefs.getInt(KEY_INTERVAL_MINUTES, 15));
        
        Set<String> apps = prefs.getStringSet(KEY_MONITORED_APPS, new HashSet<>());
        JSArray appsArray = new JSArray();
        for (String app : apps) {
            appsArray.put(app);
        }
        status.put("monitoredApps", appsArray);
        
        return status;
    }
    
    public JSObject getCurrentDayUsage(Context context) throws Exception {
        if (!isUsageStatsPermissionGranted(context)) {
            throw new Exception("Permission not granted. Please open settings and grant usage access.");
        }
        
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        long startOfDay = calendar.getTimeInMillis();
        long endOfDay = System.currentTimeMillis();
        
        List<UsageStats> stats = usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                startOfDay,
                endOfDay
        );
        
        JSArray appsArray = new JSArray();
        
        if (stats != null && !stats.isEmpty()) {
            // Filter out system apps and apps with minimal usage
            for (UsageStats usageStats : stats) {
                if (usageStats.getTotalTimeInForeground() > 0) {
                    String packageName = usageStats.getPackageName();
                    
                    try {
                        ApplicationInfo appInfo = packageManager.getApplicationInfo(packageName, 0);
                        String appName = packageManager.getApplicationLabel(appInfo).toString();
                        String category = getCategoryForPackage(packageName);
                        
                        JSObject appUsage = new JSObject();
                        appUsage.put("appName", appName);
                        appUsage.put("packageName", packageName);
                        appUsage.put("durationSeconds", usageStats.getTotalTimeInForeground() / 1000);
                        appUsage.put("category", category);
                        appUsage.put("lastUsed", usageStats.getLastTimeUsed());
                        
                        appsArray.put(appUsage);
                    } catch (PackageManager.NameNotFoundException e) {
                        Logger.debug(TAG, "App not found: " + packageName);
                    }
                }
            }
        }
        
        JSObject result = new JSObject();
        result.put("apps", appsArray);
        return result;
    }
    
    private String getCategoryForPackage(String packageName) {
        // Social media apps
        if (packageName.contains("facebook") || packageName.contains("instagram") || 
            packageName.contains("twitter") || packageName.contains("snapchat") ||
            packageName.contains("tiktok") || packageName.contains("whatsapp") ||
            packageName.contains("telegram") || packageName.contains("discord")) {
            return "Social";
        }
        
        // Entertainment apps
        if (packageName.contains("youtube") || packageName.contains("netflix") || 
            packageName.contains("spotify") || packageName.contains("twitch") ||
            packageName.contains("gaming") || packageName.contains("game")) {
            return "Entertainment";
        }
        
        // Productivity apps
        if (packageName.contains("office") || packageName.contains("docs") || 
            packageName.contains("sheets") || packageName.contains("slides") ||
            packageName.contains("note") || packageName.contains("calendar") ||
            packageName.contains("gmail") || packageName.contains("mail")) {
            return "Productivity";
        }
        
        // Communication apps
        if (packageName.contains("phone") || packageName.contains("sms") || 
            packageName.contains("message") || packageName.contains("call")) {
            return "Communication";
        }
        
        return "Other";
    }
}
