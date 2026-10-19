package com.hopi.app;

import android.app.AlarmManager;
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
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.Manifest;
import android.content.pm.PackageManager;
import android.util.Log;
import androidx.core.content.ContextCompat;
import android.provider.Settings;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.speech.tts.TextToSpeech;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewConfiguration;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.core.app.NotificationCompat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import org.json.JSONArray;
import org.json.JSONObject;

public class FloatingMochiService extends Service {
    public static final String ACTION_SHOW_SPEECH = "com.hopi.app.ACTION_SHOW_SPEECH";
    public static final String ACTION_RECORD_WATER = "com.hopi.app.ACTION_RECORD_WATER";
    public static final String ACTION_UPDATE_AVATAR = "com.hopi.app.ACTION_UPDATE_AVATAR";
    public static final String EXTRA_SPEECH_TEXT = "extra_speech_text";
    private static final String PREFS_NAME = "hopi_companion_prefs";
    private static final String PREF_LAST_WATER = "last_water_time";
    private static final String PREF_COMPANION_NAME = "companion_name";
    private static final String PREF_COMPANION_AVATAR = "companion_avatar";
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
    private int currentIdleAction = 0, idleActionStep = 0;
    private final Handler animHandler = new Handler(Looper.getMainLooper());
    private boolean isScreenOn = true, isManualAwake = false, isDeepSleep = false;
    private long lastManualWakeTime = 0;
    private long lastMidnightReminderTime = 0;

    // Voice recognition & Text-to-Speech
    private SpeechRecognizer speechRecognizer;
    private TextToSpeech tts;
    private boolean isVoiceRecording = false;
    private VoiceParser.ParsedVoiceReminder pendingClarification = null;
    private long lastTapUpTime = 0;

    // --- Mochi Frames ---
    private static final int[] MOCHI_IDLE = {
        R.drawable.mochi_idle_0, R.drawable.mochi_idle_1, R.drawable.mochi_idle_2,
        R.drawable.mochi_idle_3, R.drawable.mochi_idle_4, R.drawable.mochi_idle_5, R.drawable.mochi_idle_6
    };
    private static final int[] MOCHI_WALK = {
        R.drawable.mochi_walk_0, R.drawable.mochi_walk_1, R.drawable.mochi_walk_2, R.drawable.mochi_walk_3,
        R.drawable.mochi_walk_4, R.drawable.mochi_walk_5, R.drawable.mochi_walk_6, R.drawable.mochi_walk_7
    };
    private static final int[] MOCHI_WAVE = {
        R.drawable.mochi_wave_0, R.drawable.mochi_wave_1, R.drawable.mochi_wave_2, R.drawable.mochi_wave_3
    };
    private static final int[] MOCHI_SAD = {
        R.drawable.mochi_sleep_0, R.drawable.mochi_sleep_1, R.drawable.mochi_sleep_2, R.drawable.mochi_sleep_1
    };
    private static final int[] MOCHI_SLEEP_INTRO = {
        R.drawable.mochi_sleep_0, R.drawable.mochi_sleep_1, R.drawable.mochi_sleep_2,
        R.drawable.mochi_sleep_3, R.drawable.mochi_sleep_4
    };

    // --- Pip Frames ---
    private static final int[] PIP_IDLE = {
        R.drawable.pip_idle_0, R.drawable.pip_idle_1, R.drawable.pip_idle_2,
        R.drawable.pip_idle_3, R.drawable.pip_idle_4, R.drawable.pip_idle_5
    };
    private static final int[] PIP_WALK = {
        R.drawable.pip_walk_0, R.drawable.pip_walk_1, R.drawable.pip_walk_2, R.drawable.pip_walk_3,
        R.drawable.pip_walk_4, R.drawable.pip_walk_5, R.drawable.pip_walk_6, R.drawable.pip_walk_7
    };
    private static final int[] PIP_WAVE = {
        R.drawable.pip_wave_0, R.drawable.pip_wave_1, R.drawable.pip_wave_2, R.drawable.pip_wave_3
    };
    private static final int[] PIP_SAD = {
        R.drawable.pip_sad_0, R.drawable.pip_sad_1, R.drawable.pip_sad_2, R.drawable.pip_sad_1
    };
    private static final int[] PIP_SLEEP_INTRO = {
        R.drawable.pip_sleep_0, R.drawable.pip_sleep_1, R.drawable.pip_sleep_2,
        R.drawable.pip_sleep_3, R.drawable.pip_sleep_4
    };

    // --- Snowdrop Frames ---
    private static final int[] SNOWDROP_IDLE = {
        R.drawable.snowdrop_idle_0, R.drawable.snowdrop_idle_1, R.drawable.snowdrop_idle_2,
        R.drawable.snowdrop_idle_3, R.drawable.snowdrop_idle_4, R.drawable.snowdrop_idle_5
    };
    private static final int[] SNOWDROP_WALK = {
        R.drawable.snowdrop_walk_0, R.drawable.snowdrop_walk_1, R.drawable.snowdrop_walk_2, R.drawable.snowdrop_walk_3,
        R.drawable.snowdrop_walk_4, R.drawable.snowdrop_walk_5, R.drawable.snowdrop_walk_6, R.drawable.snowdrop_walk_7
    };
    private static final int[] SNOWDROP_WAVE = {
        R.drawable.snowdrop_wave_0, R.drawable.snowdrop_wave_1, R.drawable.snowdrop_wave_2, R.drawable.snowdrop_wave_3
    };
    private static final int[] SNOWDROP_SAD = {
        R.drawable.snowdrop_sad_0, R.drawable.snowdrop_sad_1, R.drawable.snowdrop_sad_2, R.drawable.snowdrop_sad_1
    };
    private static final int[] SNOWDROP_SLEEP_INTRO = {
        R.drawable.snowdrop_sleep_0, R.drawable.snowdrop_sleep_1, R.drawable.snowdrop_sleep_2,
        R.drawable.snowdrop_sleep_3, R.drawable.snowdrop_sleep_4
    };

    private String getCompanionAvatar() {
        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        String avatar = prefs.getString(PREF_COMPANION_AVATAR, "mochi");
        if ("penguin".equals(avatar) || "pip".equals(avatar)) return "pip";
        if ("snowdrop".equals(avatar)) return "snowdrop";
        return "mochi";
    }

    private int[] getIdleFrames() {
        String a = getCompanionAvatar();
        if ("pip".equals(a)) return PIP_IDLE;
        if ("snowdrop".equals(a)) return SNOWDROP_IDLE;
        return MOCHI_IDLE;
    }

    private int[] getWalkFrames() {
        String a = getCompanionAvatar();
        if ("pip".equals(a)) return PIP_WALK;
        if ("snowdrop".equals(a)) return SNOWDROP_WALK;
        return MOCHI_WALK;
    }

    private int[] getWaveFrames() {
        String a = getCompanionAvatar();
        if ("pip".equals(a)) return PIP_WAVE;
        if ("snowdrop".equals(a)) return SNOWDROP_WAVE;
        return MOCHI_WAVE;
    }

    private int[] getSadFrames() {
        String a = getCompanionAvatar();
        if ("pip".equals(a)) return PIP_SAD;
        if ("snowdrop".equals(a)) return SNOWDROP_SAD;
        return MOCHI_SAD;
    }

    private int[] getSleepIntroFrames() {
        String a = getCompanionAvatar();
        if ("pip".equals(a)) return PIP_SLEEP_INTRO;
        if ("snowdrop".equals(a)) return SNOWDROP_SLEEP_INTRO;
        return MOCHI_SLEEP_INTRO;
    }

    private int getSleepStillFrame() {
        String a = getCompanionAvatar();
        if ("pip".equals(a)) return R.drawable.pip_sleep_5;
        if ("snowdrop".equals(a)) return R.drawable.snowdrop_sleep_5;
        return R.drawable.mochi_sleep_5;
    }

    private int getSleepBreathFrame() {
        String a = getCompanionAvatar();
        if ("pip".equals(a)) return R.drawable.pip_sleep_6;
        if ("snowdrop".equals(a)) return R.drawable.snowdrop_sleep_6;
        return R.drawable.mochi_sleep_6;
    }

    private int getCuriousFrame() {
        String a = getCompanionAvatar();
        if ("pip".equals(a)) return R.drawable.pip_curious;
        if ("snowdrop".equals(a)) return R.drawable.snowdrop_curious;
        return R.drawable.mochi_curious;
    }

    private int getGroomFrame() {
        String a = getCompanionAvatar();
        if ("pip".equals(a)) return R.drawable.pip_groom;
        if ("snowdrop".equals(a)) return R.drawable.snowdrop_groom;
        return R.drawable.mochi_groom;
    }

    private String getCompanionName() {
        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        return prefs.getString(PREF_COMPANION_NAME, "Mochi");
    }

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
            // Goes back to sleep ~1 minute after wake up
            if (isManualAwake && (System.currentTimeMillis() - lastManualWakeTime < 60 * 1000L)) {
                return AnimState.IDLE;
            }
            isManualAwake = false;
            return AnimState.SLEEP;
        }
        isManualAwake = false;
        float h = getHoursSinceWater();
        if (h >= 4.0f) return AnimState.SLEEP;
        if (h >= 2.5f) return AnimState.SAD;
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
                currentIdleAction = 0;
                idleActionStep = 0;
                isDeepSleep = false;
            }

            if (animState == AnimState.IDLE) {
                isDeepSleep = false;
                int[] idleFrames = getIdleFrames();
                if (currentIdleAction == 0) {
                    mochiImage.setImageResource(idleFrames[0]);
                    double roll = Math.random();
                    if (roll < 0.60) currentIdleAction = 1; // single blink
                    else if (roll < 0.80) currentIdleAction = 2; // double blink
                    else if (roll < 0.90) currentIdleAction = 3; // curious tilt
                    else currentIdleAction = 4; // groom / sniff
                    idleActionStep = 0;
                    animHandler.postDelayed(this, 2400 + (int)(Math.random() * 2600));
                    return;
                } else if (currentIdleAction == 1) {
                    // Single natural blink
                    if (idleActionStep == 0) {
                        mochiImage.setImageResource(idleFrames.length > 1 ? idleFrames[1] : idleFrames[0]);
                        idleActionStep = 1;
                        animHandler.postDelayed(this, 70);
                    } else if (idleActionStep == 1) {
                        mochiImage.setImageResource(idleFrames.length > 2 ? idleFrames[2] : idleFrames[0]);
                        idleActionStep = 2;
                        animHandler.postDelayed(this, 130);
                    } else {
                        mochiImage.setImageResource(idleFrames[0]);
                        currentIdleAction = 0;
                        animHandler.postDelayed(this, 2400 + (int)(Math.random() * 2600));
                    }
                    return;
                } else if (currentIdleAction == 2) {
                    // Double blink
                    if (idleActionStep == 0) {
                        mochiImage.setImageResource(idleFrames.length > 2 ? idleFrames[2] : idleFrames[0]);
                        idleActionStep = 1;
                        animHandler.postDelayed(this, 120);
                    } else if (idleActionStep == 1) {
                        mochiImage.setImageResource(idleFrames[0]);
                        idleActionStep = 2;
                        animHandler.postDelayed(this, 90);
                    } else if (idleActionStep == 2) {
                        mochiImage.setImageResource(idleFrames.length > 2 ? idleFrames[2] : idleFrames[0]);
                        idleActionStep = 3;
                        animHandler.postDelayed(this, 110);
                    } else {
                        mochiImage.setImageResource(idleFrames[0]);
                        currentIdleAction = 0;
                        animHandler.postDelayed(this, 2600 + (int)(Math.random() * 2600));
                    }
                    return;
                } else if (currentIdleAction == 3) {
                    // Curious head tilt
                    if (idleActionStep == 0) {
                        mochiImage.setImageResource(getCuriousFrame());
                        idleActionStep = 1;
                        animHandler.postDelayed(this, 650);
                    } else {
                        mochiImage.setImageResource(idleFrames[0]);
                        currentIdleAction = 0;
                        animHandler.postDelayed(this, 2600 + (int)(Math.random() * 2400));
                    }
                    return;
                } else {
                    // Groom / sniff
                    if (idleActionStep == 0) {
                        mochiImage.setImageResource(getGroomFrame());
                        idleActionStep = 1;
                        animHandler.postDelayed(this, 650);
                    } else {
                        mochiImage.setImageResource(idleFrames[0]);
                        currentIdleAction = 0;
                        animHandler.postDelayed(this, 2600 + (int)(Math.random() * 2400));
                    }
                    return;
                }
            }

            if (animState == AnimState.SLEEP) {
                if (!isDeepSleep) {
                    int[] frames = getSleepIntroFrames();
                    if (currentFrame < frames.length) {
                        mochiImage.setImageResource(frames[currentFrame]);
                        currentFrame++;
                        animHandler.postDelayed(this, 260);
                    } else {
                        isDeepSleep = true;
                        currentFrame = 0;
                        mochiImage.setImageResource(getSleepStillFrame());
                        animHandler.postDelayed(this, 3000 + (int)(Math.random() * 2400));
                    }
                } else {
                    if (currentFrame == 0) {
                        mochiImage.setImageResource(getSleepBreathFrame());
                        currentFrame = 1;
                        animHandler.postDelayed(this, 750);
                    } else {
                        mochiImage.setImageResource(getSleepStillFrame());
                        currentFrame = 0;
                        animHandler.postDelayed(this, 3000 + (int)(Math.random() * 2400));
                    }
                }
                return;
            }

            int[] frames;
            int delayMs = 140;
            if (animState == AnimState.WALK) {
                frames = getWalkFrames();
                delayMs = 140; // Graceful, grounded hop/waddle pace
            } else if (animState == AnimState.WAVE) {
                frames = getWaveFrames();
                delayMs = 140;
            } else {
                frames = getSadFrames();
                delayMs = 340;
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
        initTts();
        IntentFilter filter = new IntentFilter(Intent.ACTION_SCREEN_OFF);
        filter.addAction(Intent.ACTION_SCREEN_ON);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(screenReceiver, filter, Context.RECEIVER_NOT_EXPORTED);
        } else {
            registerReceiver(screenReceiver, filter);
        }
        initOverlay();
    }

    private void initTts() {
        try {
            tts = new TextToSpeech(getApplicationContext(), status -> {
                if (status == TextToSpeech.SUCCESS && tts != null) {
                    tts.setLanguage(Locale.US);
                    tts.setPitch(1.2f);
                    tts.setSpeechRate(0.95f);
                }
            });
        } catch (Exception ignored) {}
    }

    private void speakTts(String text) {
        if (tts != null && text != null && !text.isEmpty()) {
            try {
                // Strip emoji for clean speech output
                String clean = text.replaceAll("[^\\p{L}\\p{Nd}\\p{P}\\s]", "").trim();
                tts.speak(clean, TextToSpeech.QUEUE_FLUSH, null, "companion_voice");
            } catch (Exception ignored) {}
        }
    }

    private void triggerHaptic() {
        try {
            Vibrator v = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
            if (v != null) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    v.vibrate(VibrationEffect.createOneShot(70, VibrationEffect.DEFAULT_AMPLITUDE));
                } else {
                    v.vibrate(70);
                }
            }
        } catch (Exception ignored) {}
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
                showSpeechBubble(CompanionPhrases.getRandomWaterCelebration(getCompanionName()), 4000);
                animHandler.postDelayed(() -> setAnimState(AnimState.IDLE), 2200);
            } else if (ACTION_UPDATE_AVATAR.equals(intent.getAction())) {
                String avatar = intent.getStringExtra("avatar");
                String name = intent.getStringExtra("name");
                if (avatar != null || name != null) {
                    SharedPreferences.Editor ed = getSharedPreferences(PREFS_NAME, MODE_PRIVATE).edit();
                    if (avatar != null) ed.putString(PREF_COMPANION_AVATAR, avatar);
                    if (name != null) ed.putString(PREF_COMPANION_NAME, name);
                    ed.apply();
                }
                currentFrame = 0;
                isDeepSleep = false;
                animHandler.removeCallbacks(animRunnable);
                animHandler.post(animRunnable);
            }
        }
        return START_STICKY;
    }

    private static final long CHECKIN_INTERVAL_MS = 20 * 60 * 1000L;
    private final Runnable periodicCheckinRunnable = new Runnable() {
        @Override
        public void run() {
            if (isScreenOn) {
                if (isRestHours()) {
                    // Remind every hour if screen is still on after midnight
                    long now = System.currentTimeMillis();
                    if (now - lastMidnightReminderTime >= 55 * 60 * 1000L) {
                        lastMidnightReminderTime = now;
                        String sleepMsg = CompanionPhrases.getRandomMidnightSleepReminder(getCompanionName());
                        showSpeechBubble(sleepMsg, 7000);
                        speakTts(sleepMsg);
                    }
                } else if (animState != AnimState.WALK && !isVoiceRecording) {
                    float h = getHoursSinceWater();
                    if (h >= 2.0f) {
                        showSpeechBubble(CompanionPhrases.getRandomWaterReminder(getCompanionName()), 5000);
                    } else if (Math.random() < 0.40) {
                        showSpeechBubble(CompanionPhrases.getPhraseForContext(h, false, true, getCompanionName()), 4000);
                    }
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
            if (speechBubble != null) {
                speechBubble.setOnClickListener(v -> {
                    CharSequence currentText = speechBubble.getText();
                    String textStr = currentText != null ? currentText.toString() : "";
                    boolean isRetryMsg = textStr.toLowerCase().contains("retry") || textStr.contains("Mic ready");
                    boolean isMicOrAppMsg = textStr.contains("permission") || textStr.contains("open Hopi");
                    boolean isWaterMsg = textStr.contains("💧") ||
                            textStr.toLowerCase().contains("water") ||
                            textStr.toLowerCase().contains("hydrat");

                    if (isRetryMsg) {
                        triggerHaptic();
                        isVoiceRecording = true;
                        startVoiceListening();
                    } else if (!isMicOrAppMsg && (isWaterMsg || getHoursSinceWater() >= 2.0f || animState == AnimState.SAD || (animState == AnimState.SLEEP && !isRestHours()))) {
                        getSharedPreferences(PREFS_NAME, MODE_PRIVATE).edit()
                                .putLong(PREF_LAST_WATER, System.currentTimeMillis()).apply();
                        isDeepSleep = false;
                        triggerHaptic();
                        setAnimState(AnimState.WAVE);
                        String cheer = CompanionPhrases.getRandomWaterCelebration(getCompanionName());
                        showSpeechBubble(cheer, 4500);
                        speakTts(cheer);
                        animHandler.postDelayed(() -> setAnimState(AnimState.IDLE), 2400);
                    } else {
                        openHopiApp();
                    }
                });
            }

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
                animHandler.postDelayed(periodicCheckinRunnable, 10 * 60 * 1000L);
            } catch (Exception e) { stopSelf(); }
        }
    }

    private void setAnimState(AnimState newState) {
        if (animState != newState) {
            animState = newState;
            currentFrame = 0;
            currentIdleAction = 0;
            idleActionStep = 0;
            animHandler.removeCallbacks(animRunnable);
            animHandler.post(animRunnable);
        }
    }

    private void showTapFeedback() {
        float h = getHoursSinceWater();
        String phrase = CompanionPhrases.getPhraseForContext(h, isRestHours(), isManualAwake, getCompanionName());
        long duration = (h >= 4.0f || (isRestHours() && !isManualAwake)) ? 4500 : 4000;
        showSpeechBubble(phrase, duration);
    }

    // Voice recording lifecycle
    private void startVoiceListening() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            isVoiceRecording = false;
            showSpeechBubble("Mic permission needed! Tap here to open Hopi 🎙️", 6000);
            return;
        }

        if (!SpeechRecognizer.isRecognitionAvailable(this)) {
            isVoiceRecording = false;
            showSpeechBubble("Speech recognition is not available on this device 🐰", 4000);
            return;
        }

        showSpeechBubble("Listening... 🎙️ Speak your reminder", 12000);
        animHandler.post(() -> {
            try {
                if (speechRecognizer != null) {
                    try { speechRecognizer.destroy(); } catch (Exception ignored) {}
                    speechRecognizer = null;
                }
                speechRecognizer = SpeechRecognizer.createSpeechRecognizer(this);
                speechRecognizer.setRecognitionListener(new VoiceRecognitionListener());

                Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
                intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
                intent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true);
                intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 3);
                intent.putExtra(RecognizerIntent.EXTRA_CALLING_PACKAGE, getPackageName());
                speechRecognizer.startListening(intent);
            } catch (Exception e) {
                Log.e("FloatingMochi", "Failed to start speech recognition", e);
                showSpeechBubble("Mic ready! Tap to speak 🐰", 3500);
                isVoiceRecording = false;
            }
        });
    }

    private void stopVoiceListening() {
        isVoiceRecording = false;
        showSpeechBubble("Thinking... 💭", 3500);
        animHandler.post(() -> {
            try {
                if (speechRecognizer != null) {
                    speechRecognizer.stopListening();
                }
            } catch (Exception ignored) {}
        });
    }

    private class VoiceRecognitionListener implements RecognitionListener {
        @Override
        public void onReadyForSpeech(Bundle params) {}
        @Override
        public void onBeginningOfSpeech() {}
        @Override
        public void onRmsChanged(float rmsdB) {}
        @Override
        public void onBufferReceived(byte[] buffer) {}
        @Override
        public void onEndOfSpeech() {}
        @Override
        public void onError(int error) {
            Log.e("FloatingMochi", "SpeechRecognizer error: " + error);
            if (!isVoiceRecording) return;
            isVoiceRecording = false;
            try {
                if (speechRecognizer != null) {
                    speechRecognizer.cancel();
                }
            } catch (Exception ignored) {}

            switch (error) {
                case SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS:
                    showSpeechBubble("Mic permission needed! Tap here to open Hopi 🎙️", 6000);
                    break;
                case SpeechRecognizer.ERROR_NETWORK:
                case SpeechRecognizer.ERROR_NETWORK_TIMEOUT:
                    showSpeechBubble("Network issue with voice recognition. Tap to retry! 🌐", 3500);
                    break;
                case SpeechRecognizer.ERROR_RECOGNIZER_BUSY:
                    showSpeechBubble("Mic busy, please tap again in a moment 🐰", 3000);
                    break;
                case SpeechRecognizer.ERROR_NO_MATCH:
                case SpeechRecognizer.ERROR_SPEECH_TIMEOUT:
                default:
                    showSpeechBubble("Didn't catch that. Tap again to retry! 🐰", 3500);
                    break;
            }
        }
        @Override
        public void onResults(Bundle results) {
            isVoiceRecording = false;
            try {
                if (speechRecognizer != null) {
                    speechRecognizer.cancel();
                }
            } catch (Exception ignored) {}
            ArrayList<String> matches = (results != null) ? results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION) : null;
            if (matches != null && !matches.isEmpty()) {
                handleVoiceTranscript(matches.get(0));
            } else {
                showSpeechBubble("Didn't catch that. Tap again to retry! 🐰", 3500);
            }
        }
        @Override
        public void onPartialResults(Bundle partialResults) {}
        @Override
        public void onEvent(int eventType, Bundle params) {}
    }

    private void handleVoiceTranscript(String transcript) {
        if (VoiceParser.isWaterIntakePhrase(transcript)) {
            pendingClarification = null;
            getSharedPreferences(PREFS_NAME, MODE_PRIVATE).edit()
                    .putLong(PREF_LAST_WATER, System.currentTimeMillis()).apply();
            isDeepSleep = false;
            triggerHaptic();
            setAnimState(AnimState.WAVE);
            String cheer = CompanionPhrases.getRandomWaterCelebration(getCompanionName());
            showSpeechBubble(cheer, 4500);
            speakTts(cheer);
            animHandler.postDelayed(() -> setAnimState(AnimState.IDLE), 2400);
            return;
        }

        if (pendingClarification != null) {
            VoiceParser.ParsedVoiceReminder resolved = VoiceParser.fillClarification(pendingClarification, transcript);
            pendingClarification = null;
            if (resolved.isComplete) {
                saveAndScheduleVoiceReminder(resolved);
            } else {
                pendingClarification = resolved;
                speakAndPromptClarification(resolved.clarificationPrompt);
            }
            return;
        }

        VoiceParser.ParsedVoiceReminder parsed = VoiceParser.parse(transcript);
        if (parsed.isComplete) {
            saveAndScheduleVoiceReminder(parsed);
        } else {
            pendingClarification = parsed;
            speakAndPromptClarification(parsed.clarificationPrompt);
        }
    }

    private void speakAndPromptClarification(String question) {
        showSpeechBubble(question, 8000);
        speakTts(question);
        animHandler.postDelayed(() -> {
            isVoiceRecording = true;
            startVoiceListening();
        }, 2200);
    }

    private void saveAndScheduleVoiceReminder(VoiceParser.ParsedVoiceReminder item) {
        String id = "rem-voice-" + System.currentTimeMillis();
        long triggerAtMillis = parseReminderTimestamp(item.date, item.time, item.recurring);

        // Save to pending JSON for Hopi app auto-sync
        try {
            SharedPreferences prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
            String existing = prefs.getString("pending_voice_reminders", "[]");
            JSONArray arr = new JSONArray(existing);
            JSONObject obj = new JSONObject();
            obj.put("id", id);
            obj.put("title", item.title);
            obj.put("emoji", item.emoji);
            obj.put("time", item.time);
            obj.put("date", item.date);
            obj.put("recurring", item.recurring);
            if (item.repeatIntervalHours > 0) {
                obj.put("repeatIntervalHours", item.repeatIntervalHours);
            }
            obj.put("itemType", item.itemType);
            obj.put("completed", false);
            arr.put(obj);
            prefs.edit().putString("pending_voice_reminders", arr.toString()).apply();
        } catch (Exception ignored) {}

        // Schedule AlarmManager
        if (triggerAtMillis > System.currentTimeMillis() + 2000L) {
            AlarmManager alarmManager = (AlarmManager) getSystemService(Context.ALARM_SERVICE);
            Intent intent = new Intent(this, ReminderAlarmReceiver.class);
            intent.putExtra("id", id);
            intent.putExtra("title", item.title);
            intent.putExtra("emoji", item.emoji);
            PendingIntent pi = PendingIntent.getBroadcast(this, id.hashCode(), intent,
                    PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? PendingIntent.FLAG_IMMUTABLE : 0));
            if (alarmManager != null) {
                try {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                        alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAtMillis, pi);
                    } else {
                        alarmManager.setExact(AlarmManager.RTC_WAKEUP, triggerAtMillis, pi);
                    }
                } catch (Exception ignored) {}
            }
        }

        String confirm = String.format("Added %s: %s at %s ✨", item.itemType, item.title, item.time);
        showSpeechBubble(confirm, 5000);
        speakTts(confirm);
        setAnimState(AnimState.WAVE);
        animHandler.postDelayed(() -> setAnimState(AnimState.IDLE), 2400);
    }

    private long parseReminderTimestamp(String dateStr, String timeStr, String recurring) {
        try {
            Calendar cal = Calendar.getInstance();
            if (dateStr != null && dateStr.matches("^\\d{4}-\\d{2}-\\d{2}$")) {
                String[] parts = dateStr.split("-");
                cal.set(Calendar.YEAR, Integer.parseInt(parts[0]));
                cal.set(Calendar.MONTH, Integer.parseInt(parts[1]) - 1);
                cal.set(Calendar.DAY_OF_MONTH, Integer.parseInt(parts[2]));
            }

            if (timeStr != null) {
                SimpleDateFormat sdf = new SimpleDateFormat("hh:mm a", Locale.US);
                Date parsedTime = sdf.parse(timeStr.trim());
                if (parsedTime != null) {
                    Calendar timeCal = Calendar.getInstance();
                    timeCal.setTime(parsedTime);
                    cal.set(Calendar.HOUR_OF_DAY, timeCal.get(Calendar.HOUR_OF_DAY));
                    cal.set(Calendar.MINUTE, timeCal.get(Calendar.MINUTE));
                    cal.set(Calendar.SECOND, 0);
                    cal.set(Calendar.MILLISECOND, 0);
                }
            }

            if (cal.getTimeInMillis() <= System.currentTimeMillis() + 2000L && !"none".equalsIgnoreCase(recurring)) {
                cal.add(Calendar.DAY_OF_YEAR, 1);
            }
            return cal.getTimeInMillis();
        } catch (Exception e) {
            return System.currentTimeMillis() + 3600000L;
        }
    }

    private void setupTouchListener(View view) {
        final int touchSlop = ViewConfiguration.get(this).getScaledTouchSlop();
        final Runnable longPressRunnable = () -> {
            if (!isVoiceRecording) {
                isVoiceRecording = true;
                triggerHaptic();
                startVoiceListening();
            }
        };

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
                        animHandler.postDelayed(longPressRunnable, 500);
                        return true;

                    case MotionEvent.ACTION_MOVE:
                        float deltaX = event.getRawX() - initialTouchX;
                        float deltaY = event.getRawY() - initialTouchY;
                        float instantDeltaX = event.getRawX() - lastTouchX;

                        if (!isDragging && (Math.abs(deltaX) > touchSlop || Math.abs(deltaY) > touchSlop)) {
                            isDragging = true;
                            animHandler.removeCallbacks(longPressRunnable);
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
                        animHandler.removeCallbacks(longPressRunnable);
                        if (isDragging) {
                            setAnimState(AnimState.IDLE);
                            return true;
                        }

                        // Long press completed and finger released: keep mic recording!
                        if (isVoiceRecording && (System.currentTimeMillis() - touchStartTime >= 500)) {
                            return true;
                        }

                        // Check for Double-Tap (< 380ms)
                        long now = System.currentTimeMillis();
                        if (now - lastTapUpTime < 380) {
                            lastTapUpTime = 0;
                            if (isVoiceRecording) {
                                triggerHaptic();
                                stopVoiceListening();
                                return true;
                            }
                        } else {
                            lastTapUpTime = now;
                            if (!isVoiceRecording && (now - touchStartTime < 500)) {
                                showTapFeedback();
                                animHandler.postDelayed(() -> {
                                    if (System.currentTimeMillis() - lastTapUpTime >= 380 && !isVoiceRecording) {
                                        openHopiApp();
                                    }
                                }, 400);
                            }
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
                    CHANNEL_ID, "Companion Service", NotificationManager.IMPORTANCE_LOW);
            channel.setDescription("Shows your companion floating on your screen");
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) manager.createNotificationChannel(channel);
        }
    }

    private Notification createNotification() {
        PendingIntent pi = PendingIntent.getActivity(this, 0, new Intent(this, MainActivity.class),
                Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? PendingIntent.FLAG_IMMUTABLE : 0);
        return new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle(getCompanionName() + " is active")
                .setContentText(getCompanionName() + " is with you on your home screen ✨")
                .setSmallIcon(R.mipmap.ic_launcher).setContentIntent(pi).setPriority(NotificationCompat.PRIORITY_LOW).build();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        try { unregisterReceiver(screenReceiver); } catch (Exception ignored) {}
        animHandler.removeCallbacksAndMessages(null);
        if (speechRecognizer != null) {
            try { speechRecognizer.destroy(); } catch (Exception ignored) {}
            speechRecognizer = null;
        }
        if (tts != null) {
            try { tts.stop(); tts.shutdown(); } catch (Exception ignored) {}
            tts = null;
        }
        if (floatingView != null && windowManager != null) {
            try { windowManager.removeView(floatingView); } catch (Exception ignored) {}
            floatingView = null;
        }
    }
}
