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
import android.content.SharedPreferences;
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
import android.widget.TextView;
import androidx.core.app.NotificationCompat;
import java.util.Calendar;

public class FloatingMochiService extends Service {
    public static final String ACTION_SHOW_SPEECH = "com.hopi.app.ACTION_SHOW_SPEECH";
    public static final String ACTION_RECORD_WATER = "com.hopi.app.ACTION_RECORD_WATER";
    public static final String EXTRA_SPEECH_TEXT = "extra_speech_text";
    private static final String PREFS_NAME = "hopi_companion_prefs";
    private static final String PREF_LAST_WATER = "last_water_time";
    private static final String CHANNEL_ID = "hopi_companion_channel";
    private static final int NOTIFICATION_ID = 1001;

    private WindowManager windowManager;
    private View floatingView;
    private ImageView mochiImage;
    private TextView speechBubble;
    private WindowManager.LayoutParams params;

    private enum AnimState { IDLE, WALK, WAVE, SLEEP, SAD }
    private AnimState animState = AnimState.IDLE;
    private int currentFrame = 0;
    private final Handler animHandler = new Handler(Looper.getMainLooper());
    private boolean isScreenOn = true, isManualAwake = false, isDeepSleep = false;
    private long lastManualWakeTime = 0;

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
    private static final int[] SAD_FRAMES = {
        R.drawable.mochi_sleep_0, R.drawable.mochi_sleep_1, R.drawable.mochi_sleep_2, R.drawable.mochi_sleep_1
    };
    private static final int[] SLEEP_INTRO_FRAMES = {
        R.drawable.mochi_sleep_0, R.drawable.mochi_sleep_1, R.drawable.mochi_sleep_2,
        R.drawable.mochi_sleep_3, R.drawable.mochi_sleep_4
    };
    private static final int[] SLEEP_LOOP_FRAMES = {
        R.drawable.mochi_sleep_5, R.drawable.mochi_sleep_6
    };

    private boolean isRestHours() {
        int hour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY);
        return hour >= 0 && hour < 8; // 12 AM to 8 AM
    }

    private float getHoursSinceWater() {
        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        long lastTime = prefs.getLong(PREF_LAST_WATER, 0);
        if (lastTime <= 0) {
            Calendar cal = Calendar.getInstance();
            cal.set(Calendar.HOUR_OF_DAY, 8);
            cal.set(Calendar.MINUTE, 0);
            cal.set(Calendar.SECOND, 0);
            lastTime = cal.getTimeInMillis();
            if (System.currentTimeMillis() < lastTime) lastTime -= 24 * 60 * 60 * 1000L;
        }
        return Math.max(0, System.currentTimeMillis() - lastTime) / (1000f * 60f * 60f);
    }

    private AnimState computeTargetState() {
        if (animState == AnimState.WALK || animState == AnimState.WAVE) return animState;
        if (isRestHours()) {
            if (isManualAwake && (System.currentTimeMillis() - lastManualWakeTime < 15 * 60 * 1000L)) {
                return AnimState.IDLE;
            }
            isManualAwake = false;
            return AnimState.SLEEP;
        }
        isManualAwake = false;
        float h = getHoursSinceWater();
        if (h >= 4.0f) return AnimState.SLEEP; // Dehydrated exhaustion
        if (h >= 2.5f) return AnimState.SAD;   // Thirsty
        return AnimState.IDLE;
    }

    private final Runnable hideSpeechRunnable = () -> {
        if (speechBubble != null) {
            speechBubble.animate().alpha(0f).scaleX(0.8f).scaleY(0.8f).setDuration(220)
                    .withEndAction(() -> { if (speechBubble != null) speechBubble.setVisibility(View.GONE); }).start();
        }
    };

    private final Runnable animRunnable = new Runnable() {
        @Override
        public void run() {
            if (mochiImage == null || !isScreenOn) return;
            AnimState target = computeTargetState();
            if (target != AnimState.WALK && target != AnimState.WAVE && animState != target) {
                animState = target;
                currentFrame = 0;
                isDeepSleep = false;
            }

            int[] frames = IDLE_FRAMES;
            int delayMs = 160;

            if (animState == AnimState.WALK) {
                frames = WALK_FRAMES; delayMs = 95; isDeepSleep = false;
            } else if (animState == AnimState.WAVE) {
                frames = WAVE_FRAMES; delayMs = 140; isDeepSleep = false;
            } else if (animState == AnimState.SAD) {
                frames = SAD_FRAMES; delayMs = 340; isDeepSleep = false;
            } else if (animState == AnimState.SLEEP) {
                if (!isDeepSleep) {
                    frames = SLEEP_INTRO_FRAMES; delayMs = 250;
                    if (currentFrame >= frames.length - 1) { isDeepSleep = true; currentFrame = 0; }
                } else {
                    frames = SLEEP_LOOP_FRAMES; delayMs = 850;
                }
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
        public void onReceive(Context c, Intent i) {
            isScreenOn = !Intent.ACTION_SCREEN_OFF.equals(i.getAction());
            if (isScreenOn) animHandler.post(animRunnable);
            else animHandler.removeCallbacks(animRunnable);
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
        if (intent != null) {
            if (ACTION_SHOW_SPEECH.equals(intent.getAction())) {
                String text = intent.getStringExtra(EXTRA_SPEECH_TEXT);
                if (text != null) showSpeechBubble(text, 9000);
            } else if (ACTION_RECORD_WATER.equals(intent.getAction())) {
                getSharedPreferences(PREFS_NAME, MODE_PRIVATE).edit()
                        .putLong(PREF_LAST_WATER, System.currentTimeMillis()).apply();
                isDeepSleep = false;
                setAnimState(AnimState.WAVE);
                showSpeechBubble(CompanionPhrases.getRandomWaterCelebration(), 4000);
                animHandler.postDelayed(() -> setAnimState(AnimState.IDLE), 2200);
            }
        }
        return START_STICKY;
    }

    private static final long CHECKIN_INTERVAL_MS = 35 * 60 * 1000L;
    private final Runnable periodicCheckinRunnable = new Runnable() {
        @Override
        public void run() {
            if (isScreenOn && !isRestHours() && animState != AnimState.WALK) {
                float h = getHoursSinceWater();
                if (h >= 2.0f) {
                    showSpeechBubble(CompanionPhrases.getRandomWaterReminder(), 5000);
                } else if (Math.random() < 0.45) {
                    showSpeechBubble(CompanionPhrases.getPhraseForContext(h, false, true), 4000);
                }
            }
            animHandler.postDelayed(this, CHECKIN_INTERVAL_MS);
        }
    };

    public void showSpeechBubble(String text, long durationMs) {
        if (speechBubble == null && floatingView != null) speechBubble = floatingView.findViewById(R.id.mochi_speech_bubble);
        if (speechBubble == null) return;
        animHandler.removeCallbacks(hideSpeechRunnable);
        speechBubble.setText(text);
        speechBubble.setVisibility(View.VISIBLE);
        speechBubble.setAlpha(0f);
        speechBubble.setScaleX(0.85f);
        speechBubble.setScaleY(0.85f);
        speechBubble.animate().alpha(1f).scaleX(1f).scaleY(1f).setDuration(200).start();
        animHandler.postDelayed(hideSpeechRunnable, durationMs);
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
            speechBubble = floatingView.findViewById(R.id.mochi_speech_bubble);
            if (speechBubble != null) speechBubble.setOnClickListener(v -> openHopiApp());

            int layoutType = (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                    ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY : WindowManager.LayoutParams.TYPE_PHONE;
            params = new WindowManager.LayoutParams(WindowManager.LayoutParams.WRAP_CONTENT,
                    WindowManager.LayoutParams.WRAP_CONTENT, layoutType, WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE, PixelFormat.TRANSLUCENT);
            params.gravity = Gravity.TOP | Gravity.START;
            params.x = 40; params.y = 250;
            setupTouchListener(floatingView);
            try {
                windowManager.addView(floatingView, params);
                animHandler.post(animRunnable);
                animHandler.postDelayed(periodicCheckinRunnable, 15 * 60 * 1000L);
            } catch (Exception e) { stopSelf(); }
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

    private void showTapFeedback() {
        float h = getHoursSinceWater();
        String phrase = CompanionPhrases.getPhraseForContext(h, isRestHours(), isManualAwake);
        long duration = (h >= 4.0f || (isRestHours() && !isManualAwake)) ? 4500 : 4000;
        showSpeechBubble(phrase, duration);
    }

    private void setupTouchListener(View view) {
        final int touchSlop = ViewConfiguration.get(this).getScaledTouchSlop();
        view.setOnTouchListener(new View.OnTouchListener() {
            private int initialX, initialY;
            private float initialTouchX, initialTouchY;
            private float lastTouchX;
            private long touchStartTime;
            private boolean isDragging;

            @Override
            public boolean onTouch(View v, MotionEvent event) {
                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        initialX = params.x; initialY = params.y;
                        initialTouchX = event.getRawX(); initialTouchY = event.getRawY();
                        lastTouchX = event.getRawX();
                        touchStartTime = System.currentTimeMillis();
                        isDragging = false;
                        return true;

                    case MotionEvent.ACTION_MOVE:
                        float deltaX = event.getRawX() - initialTouchX;
                        float deltaY = event.getRawY() - initialTouchY;
                        float instantDeltaX = event.getRawX() - lastTouchX;

                        if (!isDragging && (Math.abs(deltaX) > touchSlop || Math.abs(deltaY) > touchSlop)) {
                            isDragging = true;
                            isManualAwake = true;
                            lastManualWakeTime = System.currentTimeMillis();
                            isDeepSleep = false;
                            setAnimState(AnimState.WALK);
                        }
                        if (isDragging) {
                            if (mochiImage != null) {
                                if (instantDeltaX > 1.0f) {
                                    mochiImage.setScaleX(1.0f);
                                } else if (instantDeltaX < -1.0f) {
                                    mochiImage.setScaleX(-1.0f);
                                }
                            }
                            params.x = initialX + (int) deltaX;
                            params.y = initialY + (int) deltaY;
                            if (floatingView != null && windowManager != null) {
                                windowManager.updateViewLayout(floatingView, params);
                            }
                        }
                        lastTouchX = event.getRawX();
                        return true;

                    case MotionEvent.ACTION_UP:
                        long duration = System.currentTimeMillis() - touchStartTime;
                        if (isDragging) {
                            setAnimState(AnimState.IDLE);
                        } else if (duration < 500) {
                            showTapFeedback();
                            animHandler.postDelayed(() -> openHopiApp(), 500);
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
        PendingIntent pi = PendingIntent.getActivity(this, 0, new Intent(this, MainActivity.class),
                Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? PendingIntent.FLAG_IMMUTABLE : 0);
        return new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Hopi Companion Active").setContentText("Mochi is with you on your home screen ✨")
                .setSmallIcon(R.mipmap.ic_launcher).setContentIntent(pi).setPriority(NotificationCompat.PRIORITY_LOW).build();
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
