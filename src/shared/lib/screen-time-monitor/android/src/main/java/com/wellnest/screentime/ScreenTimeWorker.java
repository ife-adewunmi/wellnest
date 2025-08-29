package com.wellnest.screentime;

import android.content.Context;
import android.content.SharedPreferences;
import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;
import com.getcapacitor.JSObject;
import com.getcapacitor.Logger;

import java.util.HashSet;
import java.util.Set;

public class ScreenTimeWorker extends Worker {

    private static final String TAG = "ScreenTimeWorker";
    private static final String PREFS_NAME = "screen_time_monitor";
    private static final String KEY_MONITORING_ACTIVE = "monitoring_active";

    public ScreenTimeWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
    }

    @NonNull
    @Override
    public Result doWork() {
        Context context = getApplicationContext();
        Logger.info(TAG, "ScreenTimeWorker started");

        try {
            SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            boolean isActive = prefs.getBoolean(KEY_MONITORING_ACTIVE, false);

            if (!isActive) {
                Logger.info(TAG, "Monitoring is not active, skipping");
                return Result.success();
            }

            ScreenTimeMonitor monitor = new ScreenTimeMonitor();
            monitor.initialize(context);

            if (!monitor.isUsageStatsPermissionGranted(context)) {
                Logger.error(TAG, "Usage stats permission not granted");
                return Result.failure();
            }

            // Get current day usage
            JSObject currentUsage = monitor.getCurrentDayUsage(context);
            
            // Here you would typically send this data to your server or store it locally
            // For now, we'll just log it
            Logger.info(TAG, "Screen time data collected: " + currentUsage.toString());

            // You can also broadcast this data to the plugin if the app is active
            // This would require a more complex setup with static references or event bus

            return Result.success();

        } catch (Exception e) {
            Logger.error(TAG, "Error in ScreenTimeWorker: " + e.getMessage());
            return Result.failure();
        }
    }
}
