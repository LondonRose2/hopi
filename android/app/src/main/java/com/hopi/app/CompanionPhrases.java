package com.hopi.app;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Random;

public class CompanionPhrases {
    private static final Random RANDOM = new Random();
    private static final int HISTORY_SIZE = 12;
    private static final LinkedList<String> recentHistory = new LinkedList<>();

    // 1. Practical Adult Water Reminders
    public static final String[] WATER_REMINDERS = {
        "Good time for a glass of water. 💧",
        "Quick hydration check. Keep water nearby. 💧",
        "Hydration helps keep your focus sharp. 💧",
        "Pause for a moment and have some water. 💧",
        "Remember to stay hydrated throughout your day. 💧",
        "A glass of water can help reset your focus. 💧",
        "Take a quick break and grab some water. 💧",
        "Hydration is easy to forget when busy. Drink some water. 💧",
        "Keep your energy steady—drink some water. 💧",
        "Good moment for a water refill. 💧",
        "A cup of water or tea would be good right now. 💧",
        "Hydrate before your next task. 💧"
    };

    // 2. Hydration Confirmations
    public static final String[] WATER_CELEBRATIONS = {
        "Water logged. Good habit. 💧",
        "Hydration noted. Keep taking care of yourself. 💧",
        "Good pause. Hydration recorded. 💧",
        "Refreshed and ready to continue. 💧"
    };

    // 3. Grounded Adult Encouragement
    public static final String[] ENCOURAGEMENTS = {
        "Take it one step at a time. Steady progress counts. 🌿",
        "Pace yourself today. You don't have to do it all at once.",
        "Focus on what is directly in your control.",
        "Give yourself credit for the effort you put in.",
        "Small, consistent actions add up over time.",
        "You are managing a lot. Remember to breathe through it.",
        "Prioritize what matters most right now.",
        "Take breaks when you need them. Rest is productive.",
        "Keep your momentum steady, not rushed.",
        "You have handled demanding days before. You can handle today.",
        "Give yourself room to pause without feeling behind.",
        "Focus on the next right step."
    };

    // 4. Mindfulness & Grounding
    public static final String[] MINDFULNESS = {
        "Take a slow, deep breath. Release any tension in your jaw.",
        "Drop your shoulders away from your ears.",
        "Notice if you are holding tension anywhere right now.",
        "Step back for a brief moment and reset your thoughts.",
        "A minute of quiet can clear a lot of mental noise.",
        "Exhale fully and let your posture soften.",
        "Pause for thirty seconds. Let your mind catch up.",
        "Stay grounded in what you are doing right now.",
        "Give yourself permission to pause between tasks.",
        "Clear your head for a moment before moving forward."
    };

    // 5. Quiet Companion Presence
    public static final String[] COMPANION_PRESENCE = {
        "A calm presence alongside your day.",
        "Quiet focus for whatever is on your agenda.",
        "Checking in. Take a moment if you need one.",
        "Keep going at your own steady pace.",
        "Take your time with what you are working on.",
        "Here quietly in your corner."
    };

    // 6. Time-of-Day Specific
    public static final String[] MORNING = {
        "Good morning. Set your pace with intention today. ☀️",
        "A fresh start. Begin with your highest priority.",
        "Morning. Take a moment to plan your day with clarity.",
        "Start with focus and give yourself room to breathe."
    };

    public static final String[] AFTERNOON = {
        "Good afternoon. How is your energy holding up? ☀️",
        "Halfway through the day. Time for a quick stretch and water.",
        "Afternoon check-in. Step away from the screen for a minute.",
        "Keep your afternoon steady and manageable."
    };

    public static final String[] EVENING = {
        "Evening is here. Start wrapping up loose ends.",
        "You put in honest work today. Begin winding down.",
        "Good time to disconnect from work mode.",
        "Transition your evening into something restful."
    };

    public static final String[] NIGHT = {
        "Winding down. Prepare your mind for rest.",
        "Time to close out today. Tomorrow is a fresh start.",
        "Set aside tomorrow's concerns for the morning.",
        "Protect your sleep tonight. It makes all the difference."
    };

    // 7. Midnight Hourly Sleep Reminders
    public static final String[] MIDNIGHT_SLEEP_REMINDERS = {
        "It's past midnight. Sleep will serve you better than pushing through. 🌙",
        "The screen is still on. Give your eyes and mind a rest. 🛏️",
        "Late hours take a toll tomorrow. Time to close up for the night. 🌌",
        "You've worked late enough. Call it a night and get some rest. 🤍",
        "Put the phone away and let your mind completely recharge tonight. 💤"
    };

    public static synchronized String getPhraseForContext(float hoursSinceWater, boolean isRestHours, boolean isManualAwake, String companionName) {
        if (isRestHours && !isManualAwake) {
            return "Resting quietly for the night. 🌙";
        }

        // Hydration states
        if (hoursSinceWater >= 4.0f) {
            String[] tired = {
                "It has been hours without water. Please take a moment to drink a full glass. 💧",
                "Low hydration drains your energy. Grab a glass of water. 💧",
                "Hydration break needed. Please drink some water. 💧"
            };
            return pickNonRepeating(tired);
        }

        if (hoursSinceWater >= 2.0f) {
            return pickNonRepeating(WATER_REMINDERS);
        }

        List<String> pool = new ArrayList<>();
        Collections.addAll(pool, ENCOURAGEMENTS);
        Collections.addAll(pool, MINDFULNESS);
        Collections.addAll(pool, COMPANION_PRESENCE);

        int hour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY);
        if (hour >= 6 && hour < 12) {
            Collections.addAll(pool, MORNING);
        } else if (hour >= 12 && hour < 17) {
            Collections.addAll(pool, AFTERNOON);
        } else if (hour >= 17 && hour < 21) {
            Collections.addAll(pool, EVENING);
        } else {
            Collections.addAll(pool, NIGHT);
        }

        return pickNonRepeating(pool.toArray(new String[0]));
    }

    public static synchronized String getRandomWaterCelebration(String companionName) {
        return pickNonRepeating(WATER_CELEBRATIONS);
    }

    public static synchronized String getRandomWaterReminder(String companionName) {
        return pickNonRepeating(WATER_REMINDERS);
    }

    public static synchronized String getRandomMidnightSleepReminder(String companionName) {
        return pickNonRepeating(MIDNIGHT_SLEEP_REMINDERS);
    }

    private static String pickNonRepeating(String[] candidates) {
        if (candidates == null || candidates.length == 0) return "Steady pace today. 🌿";
        List<String> available = new ArrayList<>();
        for (String c : candidates) {
            if (!recentHistory.contains(c)) {
                available.add(c);
            }
        }

        String chosen;
        if (available.isEmpty()) {
            chosen = candidates[RANDOM.nextInt(candidates.length)];
        } else {
            chosen = available.get(RANDOM.nextInt(available.size()));
        }

        recentHistory.addLast(chosen);
        while (recentHistory.size() > HISTORY_SIZE) {
            recentHistory.removeFirst();
        }

        return chosen;
    }
}
