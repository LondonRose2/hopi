package com.hopi.app;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import androidx.core.app.NotificationCompat;

public class ReminderAlarmReceiver extends BroadcastReceiver {
    private static final String CHANNEL_ID = "hopi_reminder_channel";

    @Override
    public void onReceive(Context context, Intent intent) {
        String id = intent.getStringExtra("id");
        String title = intent.getStringExtra("title");
        String emoji = intent.getStringExtra("emoji");
        if (title == null) title = "Reminder";
        if (emoji == null) emoji = "✨";

        // 1. Post High-Priority Push Notification
        NotificationManager manager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && manager != null) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "Hopi Routine Reminders",
                    NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("Gentle reminders for your daily wellness and spiritual routines");
            channel.enableVibration(true);
            manager.createNotificationChannel(channel);
        }

        Intent appIntent = new Intent(context, MainActivity.class)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivity(
                context,
                (id != null) ? id.hashCode() : 0,
                appIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? PendingIntent.FLAG_IMMUTABLE : 0)
        );

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(emoji + " " + title)
                .setContentText("Time for your gentle routine ✨")
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setDefaults(NotificationCompat.DEFAULT_ALL)
                .setAutoCancel(true)
                .setContentIntent(pendingIntent);

        if (manager != null) {
            int notifId = (id != null) ? Math.abs(id.hashCode()) : (int) System.currentTimeMillis();
            manager.notify(notifId, builder.build());
        }

        // 2. Trigger On-Screen Mochi Speech Bubble if floating companion is active
        try {
            Intent bubbleIntent = new Intent(context, FloatingMochiService.class);
            bubbleIntent.setAction(FloatingMochiService.ACTION_SHOW_SPEECH);
            bubbleIntent.putExtra(FloatingMochiService.EXTRA_SPEECH_TEXT, emoji + " " + title + " ✨");
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(bubbleIntent);
            } else {
                context.startService(bubbleIntent);
            }
        } catch (Exception ignored) {}
    }
}
