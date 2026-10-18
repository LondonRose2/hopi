// Companion phrases domain catalog: water reminders, mindfulness, encouragement, and greetings

export const WATER_REMINDERS = [
  'Time for a refreshing sip of water! 💧',
  'Stay refreshed! Your body will thank you 🌊✨',
  'A quick water break can brighten your day! 🚰🌸',
  'Hydration check! Grab a cool glass of water 💧🌿',
  "{name}'s ears perk up for water time! 🐰💧",
  'Don’t forget to nourish yourself with some water 💧🤍',
  'Sip sip! Staying hydrated keeps your mind clear ✨💧',
  'Water is life! Have a refreshing sip with {name} 💧🫧',
  'Take a little pause and drink some water 💧☁️',
  'A cup of water right now would feel wonderful 💧🍵',
  'Stay hydrated, stay glowing! ✨💧',
  '{name} is cheering for your hydration today! 🐰💧',
  'A little water goes a long way to feeling great 💧🌱',
  'Pour a fresh glass of water and enjoy every sip 💧🕊️',
] as const;

export const WATER_CELEBRATIONS = [
  'Ah, refreshing! Thank you for hydrating! 💧✨',
  '{name} feels energized and happy! Yay for water! 🐰💧',
  'Hydration complete! You are glowing ✨🌸',
  'Delicious! Keep up the wonderful care for yourself 💧🌿',
  '{name} wiggles happily! Water does wonders! 🐰🎉',
] as const;

export const ENCOURAGEMENTS = [
  "You're doing wonderfully, one step at a time ✨",
  '{name} believes in you, always 🐰🤍',
  'Be gentle with yourself today 🌿',
  "Whatever comes today, you've got this 🌟",
  'Your best is always enough 🌸',
  'Small progress is still beautiful progress 🌱',
  'I am so proud of how hard you try 🤍',
  'You bring so much warmth and light into the world ✨',
  'Take pride in the little victories today 🎈',
  'You are worthy of kindness and patience 🕊️',
  'Everything will unfold in its own good time 🌼',
  '{name} is right here beside you 🐰🤍',
] as const;

export const MINDFULNESS = [
  'Take a slow, deep breath in... and let it out 🌿',
  'Relax your shoulders and unclench your jaw ☁️',
  'In this quiet moment, all is well 🕊️',
  'Listen to the quiet around you for a second 🍃',
  'Pause and feel your feet grounded on the earth 🌿',
  'Breathe in peace, breathe out any tension 🌬️✨',
  'Allow your thoughts to pass like soft clouds ☁️',
  'A quiet pause does wonders for the soul 🍵',
  'Notice three peaceful things around you right now 🌸',
  'Give yourself permission to just be 🤍',
] as const;

export const PLAYFUL = [
  '{name} is right here watching over you! 🐰',
  '*boop* {name} wiggles its soft ears happily! 🐾',
  'Did you know rabbits hop when they are excited? Hop! 🐰✨',
  'Sending a pocketful of sunshine your way ☀️',
  '{name} is giving you a warm bunny hug 🐰🫂',
  'Just checking in on my favorite human! 💕',
  '*twitch* {name}’s nose twitched hello! 🐰🌸',
  '{name} curled up next to your pocket for good luck 🍀',
] as const;

export const MORNING_PHRASES = [
  'Good morning! Wishing you a peaceful start to the day ☀️',
  'The sun is up, and {name} is so happy to see you! 🌅',
  'Start this morning with kindness to yourself ☕✨',
  'A brand new day full of gentle possibilities 🌸',
] as const;

export const AFTERNOON_PHRASES = [
  'Hope your afternoon is going gently 🌼',
  'Halfway through the day! Remember to stretch a little 🧘',
  'A gentle afternoon reminder that you are appreciated 🌸',
  'Take a moment to enjoy the afternoon light ☀️🌿',
] as const;

export const EVENING_PHRASES = [
  'The evening is here. Time to start winding down 🌇',
  'You did your best today. Time to rest your mind 🍵',
  'Peaceful evening vibes... let go of the day’s rush 🕯️',
  'Twilight is here. Breathe easy tonight 🌆✨',
] as const;

export const NIGHT_PHRASES = [
  'Almost bedtime. Let tonight bring deep rest 🌙',
  'Soft blankets and calm dreams await 🛏️✨',
  'Rest well tonight, you deserve restful sleep 🌌',
  '{name} will keep watch while you rest peacefully 🐰💤',
] as const;

export const MIDNIGHT_SLEEP_REMINDERS = [
  'It is past midnight... time to close your eyes and rest 🌙',
  'The screen is still on, but your mind needs gentle sleep 🛏️✨',
  'It is late into the night... your body deserves deep sleep 🌌',
  'Please take care of yourself tonight and rest your eyes 🤍☁️',
  'A quiet night awaits. Time to drift off to sleep 💤🌿',
] as const;

// Non-repeating selector engine
export class PhraseSelector {
  private history: string[] = [];
  private maxHistory: number;

  constructor(maxHistory = 10) {
    this.maxHistory = maxHistory;
  }

  public format(template: string, companionName = 'Mochi'): string {
    return template.replace(/\{name\}/g, companionName);
  }

  public pick(candidates: readonly string[], companionName = 'Mochi'): string {
    if (!candidates || candidates.length === 0) return `${companionName} is right here 🐰`;
    const unpicked = candidates.filter((c) => !this.history.includes(c));
    const pool = unpicked.length > 0 ? unpicked : candidates;
    const index = Math.floor(Math.random() * pool.length);
    const chosen = pool[index];

    this.history.push(chosen);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
    return this.format(chosen, companionName);
  }

  public getPhrase(
    hoursSinceWater: number,
    isRestHours: boolean,
    currentHour: number,
    companionName = 'Mochi'
  ): string {
    if (isRestHours) {
      return `Zzz... ${companionName} is resting peacefully 🌙`;
    }
    if (hoursSinceWater >= 4.0) {
      return this.pick([
        '{name} has no energy... need water 💧😴',
        '{name} is sleepy and dehydrated... please drink water 💧',
        'Water break needed! {name} is feeling faint 💧😴',
      ], companionName);
    }
    if (hoursSinceWater >= 2.0) {
      return this.pick(WATER_REMINDERS, companionName);
    }

    const pool: string[] = [...ENCOURAGEMENTS, ...MINDFULNESS, ...PLAYFUL];
    if (currentHour >= 6 && currentHour < 12) pool.push(...MORNING_PHRASES);
    else if (currentHour >= 12 && currentHour < 17) pool.push(...AFTERNOON_PHRASES);
    else if (currentHour >= 17 && currentHour < 21) pool.push(...EVENING_PHRASES);
    else pool.push(...NIGHT_PHRASES);

    return this.pick(pool, companionName);
  }

  public getMidnightSleepReminder(companionName = 'Mochi'): string {
    return this.pick(MIDNIGHT_SLEEP_REMINDERS, companionName);
  }
}

export const companionPhrases = new PhraseSelector();
