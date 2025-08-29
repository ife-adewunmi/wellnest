package com.wellnest.screentime;

import android.app.AppOpsManager;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.provider.Settings;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.List;
import java.util.Map;

@CapacitorPlugin(name = "ScreenTimeMonitor")
public class ScreenTimeMonitorPlugin extends Plugin {

    private ScreenTimeMonitor implementation = new ScreenTimeMonitor();

    @Override
    public void load() {
        super.load();
        implementation.initialize(getContext());
    }

    /**
     * Checks if the PACKAGE_USAGE_STATS permission has been granted using AppOpsManager.
     * @param call The plugin call.
     */
    @PluginMethod()
    public void isUsageStatsPermissionGranted(PluginCall call) {
        Context context = getContext();
        AppOpsManager appOps = (AppOpsManager) context.getSystemService(Context.APP_OPS_SERVICE);
        int mode = appOps.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, android.os.Process.myUid(), context.getPackageName());
        boolean granted = mode == AppOpsManager.MODE_ALLOWED;
        JSObject ret = new JSObject();
        ret.put("granted", granted);
        call.resolve(ret);
    }

    /**
     * Opens the Android usage stats settings screen so the user can grant permission.
     * @param call The plugin call.
     */
    @PluginMethod()
    public void openUsageStatsSettings(PluginCall call) {
        try {
            Intent intent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
            getActivity().startActivity(intent);
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to open usage access settings", e);
        }
    }

    /**
     * Queries and aggregates usage stats for a given time range after checking permission.
     * @param call The plugin call with `beginTime` and `endTime` options.
     */
    @PluginMethod()
    public void queryAndAggregateUsageStats(PluginCall call) {
        long beginTime = call.getLong("beginTime");
        long endTime = call.getLong("endTime");
        Context context = getContext();
        AppOpsManager appOps = (AppOpsManager) context.getSystemService(Context.APP_OPS_SERVICE);
        int mode = appOps.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, android.os.Process.myUid(), context.getPackageName());
        if (mode != AppOpsManager.MODE_ALLOWED) {
            call.reject("Permission not granted. Please open settings and grant usage access.");
            return;
        }
        try {
            JSObject result = implementation.queryAndAggregateUsageStats(getContext(), beginTime, endTime);
            call.resolve(result);
        } catch (Exception e) {
            call.reject("Error querying usage stats: " + e.getMessage());
        }
    }

    @PluginMethod
    public void startMonitoring(PluginCall call) {
        JSArray apps = call.getArray("apps");
        Integer intervalMinutes = call.getInt("intervalMinutes", 15);
        
        try {
            implementation.startMonitoring(getContext(), this, apps, intervalMinutes);
            call.resolve();
        } catch (Exception e) {
            call.reject("Error starting monitoring: " + e.getMessage());
        }
    }

    @PluginMethod
    public void stopMonitoring(PluginCall call) {
        try {
            implementation.stopMonitoring(getContext());
            call.resolve();
        } catch (Exception e) {
            call.reject("Error stopping monitoring: " + e.getMessage());
        }
    }

    @PluginMethod
    public void getMonitoringStatus(PluginCall call) {
        try {
            JSObject status = implementation.getMonitoringStatus(getContext());
            call.resolve(status);
        } catch (Exception e) {
            call.reject("Error getting monitoring status: " + e.getMessage());
        }
    }

    @PluginMethod
    public void getCurrentDayUsage(PluginCall call) {
        try {
            JSObject result = implementation.getCurrentDayUsage(getContext());
            call.resolve(result);
        } catch (Exception e) {
            call.reject("Error getting current day usage: " + e.getMessage());
        }
    }

    // Called by background worker to send events
    public void notifyScreenTimeUpdate(JSObject data) {
        notifyListeners("screenTimeUpdate", data);
    }
}
