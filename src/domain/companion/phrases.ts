// Grounded companion phrases for adult wellness, steady encouragement, and dignified reminders

export const WATER_REMINDERS = [
  'Good time for a glass of water. 💧',
  'Quick hydration check. Keep water nearby. 💧',
  'Hydration helps keep your focus sharp. 💧',
  'Pause for a moment and have some water. 💧',
  'Remember to stay hydrated throughout your day. 💧',
  'A glass of water can help reset your focus. 💧',
  'Take a quick break and grab some water. 💧',
  'Hydration is easy to forget when busy. Drink some water. 💧',
  'Keep your energy steady—drink some water. 💧',
  'Good moment for a water refill. 💧',
  'A cup of water or tea would be good right now. 💧',
  'Hydrate before your next task. 💧',
] as const;

export const WATER_CELEBRATIONS = [
  'Water logged. Good habit. 💧',
  'Hydration noted. Keep taking care of yourself. 💧',
  'Good pause. Hydration recorded. 💧',
  'Refreshed and ready to continue. 💧',
] as const;

export const ENCOURAGEMENTS = [
  'Take it one step at a time. Steady progress counts. 🌿',
  'Pace yourself today. You do not have to do it all at once.',
  'Focus on what is directly in your control.',
  'Give yourself credit for the effort you put in.',
  'Small, consistent actions add up over time.',
  'You are managing a lot. Remember to breathe through it.',
  'Prioritize what matters most right now.',
  'Take breaks when you need them. Rest is productive.',
  'Keep your momentum steady, not rushed.',
  'You have handled demanding days before. You can handle today.',
  'Give yourself room to pause without feeling behind.',
  'Focus on the next right step.',
] as const;

export const MINDFULNESS = [
  'Take a slow, deep breath. Release any tension in your jaw.',
  'Drop your shoulders away from your ears.',
  'Notice if you are holding tension anywhere right now.',
  'Step back for a brief moment and reset your thoughts.',
  'A minute of quiet can clear a lot of mental noise.',
  'Exhale fully and let your posture soften.',
  'Pause for thirty seconds. Let your mind catch up.',
  'Stay grounded in what you are doing right now.',
  'Give yourself permission to pause between tasks.',
  'Clear your head for a moment before moving forward.',
] as const;

export const COMPANION_PRESENCE = [
  'A calm presence alongside your day.',
  'Quiet focus for whatever is on your agenda.',
  'Checking in. Take a moment if you need one.',
  'Keep going at your own steady pace.',
  'Take your time with what you are working on.',
  'Here quietly in your corner.',
] as const;

export const MORNING_PHRASES = [
  'Good morning. Set your pace with intention today. ☀️',
  'A fresh start. Begin with your highest priority.',
  'Morning. Take a moment to plan your day with clarity.',
  'Start with focus and give yourself room to breathe.',
] as const;

export const AFTERNOON_PHRASES = [
  'Good afternoon. How is your energy holding up? ☀️',
  'Halfway through the day. Time for a quick stretch and water.',
  'Afternoon check-in. Step away from the screen for a minute.',
  'Keep your afternoon steady and manageable.',
] as const;

export const EVENING_PHRASES = [
  'Evening is here. Start wrapping up loose ends.',
  'You put in honest work today. Begin winding down.',
  'Good time to disconnect from work mode.',
  'Transition your evening into something restful.',
] as const;

export const NIGHT_PHRASES = [
  'Winding down. Prepare your mind for rest.',
  'Time to close out today. Tomorrow is a fresh start.',
  'Set aside tomorrow’s concerns for the morning.',
  'Protect your sleep tonight. It makes all the difference.',
] as const;

export const MIDNIGHT_SLEEP_REMINDERS = [
  'It is past midnight. Sleep will serve you better than pushing through. 🌙',
  'The screen is still on. Give your eyes and mind a rest. 🛏️',
  'Late hours take a toll tomorrow. Time to close up for the night. 🌌',
  'You have worked late enough. Call it a night and get some rest. 🤍',
  'Put the phone away and let your mind completely recharge tonight. 💤',
] as const;

// Non-repeating selector engine
export class PhraseSelector {
  private history: string[] = [];
  private maxHistory: number;

  constructor(maxHistory = 10) {
    this.maxHistory = maxHistory;
  }

  public format(template: string, companionName = 'Companion'): string {
    return template.replace(/\{name\}/g, companionName);
  }

  public pick(candidates: readonly string[], companionName = 'Companion'): string {
    if (!candidates || candidates.length === 0) return 'Steady pace today. 🌿';
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
    companionName = 'Companion'
  ): string {
    if (isRestHours) {
      return `Resting quietly for the night. 🌙`;
    }
    if (hoursSinceWater >= 4.0) {
      return this.pick([
        'It has been hours without water. Please take a moment to drink a full glass. 💧',
        'Low hydration drains your energy. Grab a glass of water. 💧',
        'Hydration break needed. Please drink some water. 💧',
      ], companionName);
    }
    if (hoursSinceWater >= 2.0) {
      return this.pick(WATER_REMINDERS, companionName);
    }

    const pool: string[] = [...ENCOURAGEMENTS, ...MINDFULNESS, ...COMPANION_PRESENCE];
    if (currentHour >= 6 && currentHour < 12) pool.push(...MORNING_PHRASES);
    else if (currentHour >= 12 && currentHour < 17) pool.push(...AFTERNOON_PHRASES);
    else if (currentHour >= 17 && currentHour < 21) pool.push(...EVENING_PHRASES);
    else pool.push(...NIGHT_PHRASES);

    return this.pick(pool, companionName);
  }

  public getMidnightSleepReminder(companionName = 'Companion'): string {
    return this.pick(MIDNIGHT_SLEEP_REMINDERS, companionName);
  }
}

export const companionPhrases = new PhraseSelector();
