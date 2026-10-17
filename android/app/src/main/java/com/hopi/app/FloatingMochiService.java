package com.hopi.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.ServiceInfo;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.provider.Settings;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewConfiguration;
import android.view.WindowManager;
import android.widget.ImageView;
import androidx.core.app.NotificationCompat;

public class FloatingMochiService extends Service {
    private WindowManager windowManager;
    private View floatingView;
    private ImageView mochiImage;
    private WindowManager.LayoutParams params;
    private static final String CHANNEL_ID = "hopi_companion_channel";
    private static final int NOTIFICATION_ID = 1001;

    private enum AnimState { IDLE, WALK, WAVE, SLEEP }
    private AnimState animState = AnimState.IDLE;
    private int currentFrame = 0;
    private final Handler animHandler = new Handler(Looper.getMainLooper());
    private boolean isScreenOn = true;

    private static final int[] IDLE_FRAMES = {
        R.drawable.mochi_idle_0, R.drawable.mochi_idle_1, R.drawable.mochi_idle_2,
        R.drawable.mochi_idle_3, R.drawable.mochi_idle_4, R.drawable.mochi_idle_5, R.drawable.mochi_idle_6
    };
    private static final int[] WALK_FRAMES = {
        R.drawable.mochi_walk_0, R.drawable.mochi_walk_1, R.drawable.mochi_walk_2, R.drawable.mochi_walk_3,
        R.drawable.mochi_walk_4, R.drawable.mochi_walk_5, R.drawable.mochi_walk_6, R.drawable.mochi_walk_7
    };
    private static final int[] WAVE_FRAMES = {
        R.drawable.mochi_wave_0, R.drawable.mochi_wave_1, R.drawable.mochi_wave_2, R.drawable.mochi_wave_3
    };
    private static final int[] SLEEP_FRAMES = {
        R.drawable.mochi_sleep_0, R.drawable.mochi_sleep_1, R.drawable.mochi_sleep_2, R.drawable.mochi_sleep_3,
        R.drawable.mochi_sleep_4, R.drawable.mochi_sleep_5, R.drawable.mochi_sleep_6, R.drawable.mochi_sleep_7
    };

    private boolean isRestHours() {
        int hour = java.util.Calendar.getInstance().get(java.util.Calendar.HOUR_OF_DAY);
        return hour >= 0 && hour < 9;
    }

    private final Runnable animRunnable = new Runnable() {
        @Override
        public void run() {
            if (mochiImage == null || !isScreenOn) return;

            int[] frames;
            int delayMs;
            if (animState == AnimState.WALK) {
                frames = WALK_FRAMES;
                delayMs = 95;
            } else if (animState == AnimState.WAVE) {
                frames = WAVE_FRAMES;
                delayMs = 140;
            } else if (animState == AnimState.SLEEP || (animState == AnimState.IDLE && isRestHours())) {
                frames = SLEEP_FRAMES;
                delayMs = 280;
            } else {
                frames = IDLE_FRAMES;
                delayMs = 160;
            }

            if (frames.length > 0) {
                currentFrame = currentFrame % frames.length;
                mochiImage.setImageResource(frames[currentFrame]);
                currentFrame = (currentFrame + 1) % frames.length;
            }
            animHandler.postDelayed(this, delayMs);
        }
    };

    private final BroadcastReceiver screenReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (Intent.ACTION_SCREEN_OFF.equals(intent.getAction())) {
                isScreenOn = false;
                animHandler.removeCallbacks(animRunnable);
            } else if (Intent.ACTION_SCREEN_ON.equals(intent.getAction())) {
                isScreenOn = true;
                animHandler.post(animRunnable);
            }
        }
    };

    @Override
    public IBinder onBind(Intent intent) { return null; }

    @Override
    public void onCreate() {
        super.onCreate();
        ensureForegroundNotification();
        IntentFilter filter = new IntentFilter(Intent.ACTION_SCREEN_OFF);
        filter.addAction(Intent.ACTION_SCREEN_ON);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(screenReceiver, filter, Context.RECEIVER_NOT_EXPORTED);
        } else {
            registerReceiver(screenReceiver, filter);
        }
        initOverlay();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        ensureForegroundNotification();
        if (floatingView == null) initOverlay();
        return START_STICKY;
    }

    private void ensureForegroundNotification() {
        createNotificationChannel();
        Notification notification = createNotification();
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
                startForeground(NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE);
            } else {
                startForeground(NOTIFICATION_ID, notification);
            }
        } catch (Exception e) {
            try { startForeground(NOTIFICATION_ID, notification); } catch (Exception ignored) {}
        }
    }

    private void initOverlay() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(this)) {
            stopSelf();
            return;
        }

        if (windowManager == null) windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        if (floatingView == null) {
            LayoutInflater inflater = (LayoutInflater) getSystemService(LAYOUT_INFLATER_SERVICE);
            floatingView = inflater.inflate(R.layout.floating_mochi_layout, null);
            mochiImage = floatingView.findViewById(R.id.mochi_image);

            int layoutType = (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                    ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
                    : WindowManager.LayoutParams.TYPE_PHONE;

            params = new WindowManager.LayoutParams(
                    WindowManager.LayoutParams.WRAP_CONTENT,
                    WindowManager.LayoutParams.WRAP_CONTENT,
                    layoutType,
                    WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
                    PixelFormat.TRANSLUCENT
            );

            params.gravity = Gravity.TOP | Gravity.START;
            params.x = 40;
            params.y = 250;

            setupTouchListener(floatingView);

            try {
                windowManager.addView(floatingView, params);
                animHandler.post(animRunnable);
            } catch (Exception e) {
                stopSelf();
            }
        }
    }

    private void setAnimState(AnimState newState) {
        if (animState != newState) {
            animState = newState;
            currentFrame = 0;
            animHandler.removeCallbacks(animRunnable);
            animHandler.post(animRunnable);
        }
    }

    private void setupTouchListener(View view) {
        final int touchSlop = ViewConfiguration.get(this).getScaledTouchSlop();

        view.setOnTouchListener(new View.OnTouchListener() {
            private int initialX, initialY;
            private float initialTouchX, initialTouchY;
            private long touchStartTime;
            private boolean isDragging;

            @Override
            public boolean onTouch(View v, MotionEvent event) {
                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        initialX = params.x;
                        initialY = params.y;
                        initialTouchX = event.getRawX();
                        initialTouchY = event.getRawY();
                        touchStartTime = System.currentTimeMillis();
                        isDragging = false;
                        return true;

                    case MotionEvent.ACTION_MOVE:
                        float deltaX = event.getRawX() - initialTouchX;
                        float deltaY = event.getRawY() - initialTouchY;
                        if (!isDragging && (Math.abs(deltaX) > touchSlop || Math.abs(deltaY) > touchSlop)) {
                            isDragging = true;
                            setAnimState(AnimState.WALK);
                        }
                        if (isDragging) {
                            if (mochiImage != null) {
                                if (deltaX > 2) mochiImage.setScaleX(1.0f);
                                else if (deltaX < -2) mochiImage.setScaleX(-1.0f);
                            }
                            params.x = initialX + (int) deltaX;
                            params.y = initialY + (int) deltaY;
                            if (floatingView != null && windowManager != null) {
                                windowManager.updateViewLayout(floatingView, params);
                            }
                        }
                        return true;

                    case MotionEvent.ACTION_UP:
                        long duration = System.currentTimeMillis() - touchStartTime;
                        if (isDragging) {
                            setAnimState(AnimState.IDLE);
                        } else if (duration < 500) {
                            setAnimState(AnimState.WAVE);
                            animHandler.postDelayed(() -> {
                                setAnimState(AnimState.IDLE);
                                openHopiApp();
                            }, 650);
                        }
                        return true;
                }
                return false;
            }
        });
    }

    private void openHopiApp() {
        try {
            Intent intent = new Intent(this, MainActivity.class)
                    .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            PendingIntent.getActivity(this, 0, intent,
                    PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? PendingIntent.FLAG_IMMUTABLE : 0)
            ).send();
        } catch (Exception e) {
            try {
                startActivity(new Intent(this, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP));
            } catch (Exception ignored) {}
        }
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID, "Hopi Companion Service", NotificationManager.IMPORTANCE_LOW);
            channel.setDescription("Shows Mochi floating on your screen");
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) manager.createNotificationChannel(channel);
        }
    }

    private Notification createNotification() {
        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, notificationIntent,
                Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? PendingIntent.FLAG_IMMUTABLE : 0);

        return new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Hopi Companion Active")
                .setContentText("Mochi is with you on your home screen ✨")
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentIntent(pendingIntent)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .build();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        try { unregisterReceiver(screenReceiver); } catch (Exception ignored) {}
        animHandler.removeCallbacksAndMessages(null);
        if (floatingView != null && windowManager != null) {
            try { windowManager.removeView(floatingView); } catch (Exception ignored) {}
            floatingView = null;
        }
    }
}
