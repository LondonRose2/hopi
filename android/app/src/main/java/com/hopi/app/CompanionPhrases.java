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

    // 1. Varied Water Reminders (Regular & Caring)
    public static final String[] WATER_REMINDERS = {
        "Time for a refreshing sip of water! 💧",
        "Stay refreshed! Your body will thank you 🌊✨",
        "A quick water break can brighten your day! 🚰🌸",
        "Hydration check! Grab a cool glass of water 💧🌿",
        "Mochi's ears perk up for water time! 🐰💧",
        "Don't forget to nourish yourself with some water 💧🤍",
        "Sip sip! Staying hydrated keeps your mind clear ✨💧",
        "Water is life! Have a refreshing sip with Mochi 💧🫧",
        "Take a little pause and drink some water 💧☁️",
        "A cup of water right now would feel wonderful 💧🍵",
        "Stay hydrated, stay glowing! ✨💧",
        "Mochi is cheering for your hydration today! 🐰💧",
        "A little water goes a long way to feeling great 💧🌱",
        "Pour a fresh glass of water and enjoy every sip 💧🕊️"
    };

    // 2. Refreshment Celebrations (After Hydrating)
    public static final String[] WATER_CELEBRATIONS = {
        "Ah, refreshing! Thank you for hydrating! 💧✨",
        "Mochi feels energized and happy! Yay for water! 🐰💧",
        "Hydration complete! You're glowing ✨🌸",
        "Delicious! Keep up the wonderful care for yourself 💧🌿",
        "Mochi wiggles happily! Water does wonders! 🐰🎉"
    };

    // 3. Gentle Encouragement & Warmth
    public static final String[] ENCOURAGEMENTS = {
        "You're doing wonderfully, one step at a time ✨",
        "Mochi believes in you, always 🐰🤍",
        "Be gentle with yourself today 🌿",
        "Whatever comes today, you've got this 🌟",
        "Your best is always enough 🌸",
        "Small progress is still beautiful progress 🌱",
        "I'm so proud of how hard you try 🤍",
        "You bring so much warmth and light into the world ✨",
        "Take pride in the little victories today 🎈",
        "You are worthy of kindness and patience 🕊️",
        "Everything will unfold in its own good time 🌼",
        "Mochi is right here beside you 🐰🤍"
    };

    // 4. Mindfulness & Calm Breathing
    public static final String[] MINDFULNESS = {
        "Take a slow, deep breath in... and let it out 🌿",
        "Relax your shoulders and unclench your jaw ☁️",
        "In this quiet moment, all is well 🕊️",
        "Listen to the quiet around you for a second 🍃",
        "Pause and feel your feet grounded on the earth 🌿",
        "Breathe in peace, breathe out any tension 🌬️✨",
        "Allow your thoughts to pass like soft clouds ☁️",
        "A quiet pause does wonders for the soul 🍵",
        "Notice three peaceful things around you right now 🌸",
        "Give yourself permission to just be 🤍"
    };

    // 5. Playful & Sweet Companion Interactions
    public static final String[] PLAYFUL = {
        "Mochi is right here watching over you! 🐰",
        "*boop* Mochi wiggles its soft ears happily! 🐾",
        "Did you know rabbits hop when they're excited? Hop! 🐰✨",
        "Sending a pocketful of sunshine your way ☀️",
        "Mochi is giving you a warm bunny hug 🐰🫂",
        "Just checking in on my favorite human! 💕",
        "*twitch* Mochi's nose twitched hello! 🐰🌸",
        "Mochi curled up next to your pocket for good luck 🍀"
    };

    // 6. Time-of-Day Specific Greetings
    public static final String[] MORNING = {
        "Good morning! Wishing you a peaceful start to the day ☀️",
        "The sun is up, and Mochi is so happy to see you! 🌅",
        "Start this morning with kindness to yourself ☕✨",
        "A brand new day full of gentle possibilities 🌸"
    };

    public static final String[] AFTERNOON = {
        "Hope your afternoon is going gently 🌼",
        "Halfway through the day! Remember to stretch a little 🧘",
        "A gentle afternoon reminder that you are appreciated 🌸",
        "Take a moment to enjoy the afternoon light ☀️🌿"
    };

    public static final String[] EVENING = {
        "The evening is here. Time to start winding down 🌇",
        "You did your best today. Time to rest your mind 🍵",
        "Peaceful evening vibes... let go of the day's rush 🕯️",
        "Twilight is here. Breathe easy tonight 🌆✨"
    };

    public static final String[] NIGHT = {
        "Almost bedtime. Let tonight bring deep rest 🌙",
        "Soft blankets and calm dreams await 🛏️✨",
        "Rest well tonight, you deserve restful sleep 🌌",
        "Mochi will keep watch while you rest peacefully 🐰💤"
    };

    /**
     * Get a non-repeating phrase tailored to the current context.
     */
    public static synchronized String getPhraseForContext(float hoursSinceWater, boolean isRestHours, boolean isManualAwake) {
        if (isRestHours && !isManualAwake) {
            return "Zzz... Mochi is resting peacefully 🌙";
        }

        // Hydration states
        if (hoursSinceWater >= 4.0f) {
            String[] tired = {
                "Mochi has no energy... need water 💧😴",
                "Mochi is so sleepy and dehydrated... please drink water 💧",
                "Water break needed! Mochi is feeling faint 💧😴"
            };
            return pickNonRepeating(tired);
        }

        if (hoursSinceWater >= 2.0f) {
            // Remind to hydrate with great variety
            return pickNonRepeating(WATER_REMINDERS);
        }

        // If well hydrated, compose a diverse candidate pool
        List<String> pool = new ArrayList<>();
        Collections.addAll(pool, ENCOURAGEMENTS);
        Collections.addAll(pool, MINDFULNESS);
        Collections.addAll(pool, PLAYFUL);

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

    public static synchronized String getRandomWaterCelebration() {
        return pickNonRepeating(WATER_CELEBRATIONS);
    }

    public static synchronized String getRandomWaterReminder() {
        return pickNonRepeating(WATER_REMINDERS);
    }

    private static String pickNonRepeating(String[] candidates) {
        if (candidates == null || candidates.length == 0) return "Mochi is right here 🐰";
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
