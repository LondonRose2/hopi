import { describe, it, expect } from 'vitest';
import {
  isQuietHours,
  parseTimeToMinutes,
  formatDayHeader,
  groupUpcomingTasksByDay,
  reminderSchema,
  settingsSchema,
  validateReminder,
  validateSettings,
  safeValidateReminder,
  safeValidateSettings,
  DEFAULT_REMINDERS,
  DEFAULT_SETTINGS,
  UPLIFTING_VERSES,
  getVerseForDate,
  createDefaultReminders,
  calculateHydrationStatus,
  isWaterReminder,
  computeCompanionMood,
  type Reminder,
  type Settings,
} from '../src/domain/reminders';

describe('sleepSchedule domain logic', () => {
  describe('parseTimeToMinutes', () => {
    it('converts 00:00 to 0 minutes', () => {
      expect(parseTimeToMinutes('00:00')).toBe(0);
    });

    it('converts 09:30 to 570 minutes', () => {
      expect(parseTimeToMinutes('09:30')).toBe(570);
    });

    it('converts 23:59 to 1439 minutes', () => {
      expect(parseTimeToMinutes('23:59')).toBe(1439);
    });

    it('throws an error for invalid time format or numbers', () => {
      expect(() => parseTimeToMinutes('invalid')).toThrow();
      expect(() => parseTimeToMinutes('25:00')).toThrow();
      expect(() => parseTimeToMinutes('12:65')).toThrow();
    });
  });

  describe('isQuietHours - Default sleep window (00:00 to 09:00)', () => {
    const start = '00:00';
    const end = '09:00';

    it('is quiet at exact start (00:00)', () => {
      expect(isQuietHours('00:00', start, end)).toBe(true);
    });

    it('is quiet at 00:01', () => {
      expect(isQuietHours('00:01', start, end)).toBe(true);
    });

    it('is quiet at mid-sleep (04:30)', () => {
      expect(isQuietHours('04:30', start, end)).toBe(true);
    });

    it('is quiet at 08:59 (one minute before waking up)', () => {
      expect(isQuietHours('08:59', start, end)).toBe(true);
    });

    it('is NOT quiet at exact wake up time (09:00)', () => {
      expect(isQuietHours('09:00', start, end)).toBe(false);
    });

    it('is NOT quiet during daytime (12:00, 15:30)', () => {
      expect(isQuietHours('12:00', start, end)).toBe(false);
      expect(isQuietHours('15:30', start, end)).toBe(false);
    });

    it('is NOT quiet late evening before midnight (23:59)', () => {
      expect(isQuietHours('23:59', start, end)).toBe(false);
    });
  });

  describe('isQuietHours - Midnight crossover window (22:00 to 07:00)', () => {
    const start = '22:00';
    const end = '07:00';

    it('is NOT quiet just before sleep start (21:59)', () => {
      expect(isQuietHours('21:59', start, end)).toBe(false);
    });

    it('is quiet at exact start (22:00)', () => {
      expect(isQuietHours('22:00', start, end)).toBe(true);
    });

    it('is quiet late night before midnight (23:59)', () => {
      expect(isQuietHours('23:59', start, end)).toBe(true);
    });

    it('is quiet at midnight boundary (00:00)', () => {
      expect(isQuietHours('00:00', start, end)).toBe(true);
    });

    it('is quiet in early morning hours (03:30, 06:59)', () => {
      expect(isQuietHours('03:30', start, end)).toBe(true);
      expect(isQuietHours('06:59', start, end)).toBe(true);
    });

    it('is NOT quiet at exact wake up time (07:00)', () => {
      expect(isQuietHours('07:00', start, end)).toBe(false);
    });

    it('is NOT quiet during afternoon (14:00)', () => {
      expect(isQuietHours('14:00', start, end)).toBe(false);
    });
  });

  describe('isQuietHours - Equal start and end', () => {
    it('returns false when start and end are identical', () => {
      expect(isQuietHours('08:00', '08:00', '08:00')).toBe(false);
    });
  });
});

describe('grouping domain logic', () => {
  describe('formatDayHeader', () => {
    it('formats 2025-01-30 as "Thu, Jan 30"', () => {
      expect(formatDayHeader('2025-01-30')).toBe('Thu, Jan 30');
    });

    it('formats 2026-10-19 as "Mon, Oct 19"', () => {
      expect(formatDayHeader('2026-10-19')).toBe('Mon, Oct 19');
    });

    it('throws error for malformed date string', () => {
      expect(() => formatDayHeader('invalid-date')).toThrow();
    });
  });

  describe('groupUpcomingTasksByDay', () => {
    const today = '2025-01-29';

    const sampleTasks: Reminder[] = [
      {
        id: 'task-past',
        title: 'Yesterday task',
        emoji: '🚶',
        time: '10:00',
        date: '2025-01-28',
        completed: false,
        category: 'walk',
        recurring: 'once',
      },
      {
        id: 'task-today',
        title: 'Today task',
        emoji: '💧',
        time: '14:00',
        date: '2025-01-29',
        completed: false,
        category: 'water',
        recurring: 'daily',
      },
      {
        id: 'task-upcoming-2',
        title: 'Afternoon tea tomorrow',
        emoji: '☕',
        time: '15:00',
        date: '2025-01-30',
        completed: false,
        category: 'rest',
        recurring: 'daily',
      },
      {
        id: 'task-upcoming-1',
        title: 'Morning stretch tomorrow',
        emoji: '🚶',
        time: '08:00',
        date: '2025-01-30',
        completed: false,
        category: 'walk',
        recurring: 'daily',
      },
      {
        id: 'task-upcoming-3',
        title: 'Scripture Friday',
        emoji: '📖',
        time: '20:00',
        date: '2025-01-31',
        completed: false,
        category: 'scripture',
        recurring: 'weekdays',
      },
    ];

    it('strictly excludes past and today tasks', () => {
      const grouped = groupUpcomingTasksByDay(sampleTasks, today);
      const allUpcoming = Object.values(grouped).flat();
      expect(allUpcoming.some((t) => t.id === 'task-past')).toBe(false);
      expect(allUpcoming.some((t) => t.id === 'task-today')).toBe(false);
      expect(allUpcoming.length).toBe(3);
    });

    it('groups tasks under clean day headers like "Thu, Jan 30"', () => {
      const grouped = groupUpcomingTasksByDay(sampleTasks, today);
      expect(Object.keys(grouped)).toEqual(['Thu, Jan 30', 'Fri, Jan 31']);
    });

    it('sorts tasks within the same day chronologically by time', () => {
      const grouped = groupUpcomingTasksByDay(sampleTasks, today);
      const jan30Tasks = grouped['Thu, Jan 30'];
      expect(jan30Tasks).toHaveLength(2);
      expect(jan30Tasks[0].id).toBe('task-upcoming-1'); // 08:00
      expect(jan30Tasks[1].id).toBe('task-upcoming-2'); // 15:00
    });

    it('returns an empty object if there are no upcoming tasks', () => {
      const grouped = groupUpcomingTasksByDay(
        [
          {
            id: 'task-today',
            title: 'Today task',
            emoji: '💧',
            time: '14:00',
            date: '2025-01-29',
            completed: false,
            category: 'water',
            recurring: 'daily',
          },
        ],
        today
      );
      expect(grouped).toEqual({});
    });
  });
});

describe('schemas and validation domain logic', () => {
  it('validates a valid reminder', () => {
    const valid: Reminder = {
      id: 'rem-1',
      title: 'Water break',
      emoji: '💧',
      time: '11:15',
      date: '2026-10-18',
      completed: false,
      category: 'water',
      recurring: 'daily',
    };
    expect(() => validateReminder(valid)).not.toThrow();
    const result = safeValidateReminder(valid);
    expect(result.success).toBe(true);
    expect(reminderSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects reminder with invalid time format', () => {
    const invalid = {
      id: 'rem-2',
      title: 'Water break',
      emoji: '💧',
      time: '25:00', // invalid hour
      date: '2026-10-18',
      completed: false,
      category: 'water',
      recurring: 'daily',
    };
    const result = safeValidateReminder(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects reminder with invalid date format', () => {
    const invalid = {
      id: 'rem-3',
      title: 'Water break',
      emoji: '💧',
      time: '10:00',
      date: '10/18/2026', // invalid date format
      completed: false,
      category: 'water',
      recurring: 'daily',
    };
    const result = safeValidateReminder(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects reminder with invalid category', () => {
    const invalid = {
      id: 'rem-4',
      title: 'Water break',
      emoji: '💧',
      time: '10:00',
      date: '2026-10-18',
      completed: false,
      category: 'unknown_cat',
      recurring: 'daily',
    };
    const result = safeValidateReminder(invalid);
    expect(result.success).toBe(false);
  });

  it('validates valid settings', () => {
    const settings: Settings = {
      avatar: 'rabbit',
      sleepStart: '00:00',
      sleepEnd: '09:00',
      encouragementsEnabled: true,
      overlayEnabled: false,
      notificationsEnabled: true,
    };
    expect(() => validateSettings(settings)).not.toThrow();
    expect(settingsSchema.safeParse(settings).success).toBe(true);
  });

  it('validates mochi, pip, and snowdrop avatars', () => {
    const base = {
      sleepStart: '00:00',
      sleepEnd: '09:00',
      encouragementsEnabled: true,
      overlayEnabled: false,
      notificationsEnabled: true,
    };
    expect(settingsSchema.safeParse({ ...base, avatar: 'mochi' }).success).toBe(true);
    expect(settingsSchema.safeParse({ ...base, avatar: 'pip' }).success).toBe(true);
    expect(settingsSchema.safeParse({ ...base, avatar: 'snowdrop' }).success).toBe(true);
  });

  it('rejects invalid settings', () => {
    const invalidSettings = {
      avatar: 'dog', // invalid avatar
      sleepStart: '00:00',
      sleepEnd: '09:00',
      encouragementsEnabled: true,
      overlayEnabled: false,
      notificationsEnabled: true,
    };
    const result = safeValidateSettings(invalidSettings);
    expect(result.success).toBe(false);
  });
});

describe('defaultData domain logic', () => {
  it('default reminders all satisfy reminderSchema', () => {
    expect(DEFAULT_REMINDERS.length).toBe(4);
    for (const rem of DEFAULT_REMINDERS) {
      expect(() => validateReminder(rem)).not.toThrow();
    }
  });

  it('starter reminders contain water, walk, rest, and scripture', () => {
    const categories = DEFAULT_REMINDERS.map((r) => r.category);
    expect(categories).toContain('water');
    expect(categories).toContain('walk');
    expect(categories).toContain('rest');
    expect(categories).toContain('scripture');

    const emojis = DEFAULT_REMINDERS.map((r) => r.emoji);
    expect(emojis).toContain('💧');
    expect(emojis).toContain('🚶');
    expect(emojis).toContain('☕');
    expect(emojis).toContain('📖');
  });

  it('default settings satisfy settingsSchema', () => {
    expect(() => validateSettings(DEFAULT_SETTINGS)).not.toThrow();
    expect(DEFAULT_SETTINGS.sleepStart).toBe('00:00');
    expect(DEFAULT_SETTINGS.sleepEnd).toBe('09:00');
  });

  it('uplifting verses has at least 10 verses with required fields', () => {
    expect(UPLIFTING_VERSES.length).toBeGreaterThanOrEqual(10);
    for (const verse of UPLIFTING_VERSES) {
      expect(verse.id).toBeTruthy();
      expect(verse.reference).toBeTruthy();
      expect(verse.text).toBeTruthy();
    }
  });

  it('getVerseForDate returns a valid verse deterministically', () => {
    const v1 = getVerseForDate('2026-10-18');
    const v2 = getVerseForDate('2026-10-18');
    expect(v1).toEqual(v2);
    expect(v1.text).toBeTruthy();
  });

  it('createDefaultReminders assigns the specified date', () => {
    const reminders = createDefaultReminders('2026-11-01');
    expect(reminders.every((r) => r.date === '2026-11-01')).toBe(true);
  });
});

describe('display time conversion and sorting logic', () => {
  it('converts 12-hour AM/PM to minutes since midnight', async () => {
    const { parseDisplayTimeToMinutes } = await import('../src/features/reminders/types');
    expect(parseDisplayTimeToMinutes('12:00 AM')).toBe(0);
    expect(parseDisplayTimeToMinutes('08:30 AM')).toBe(510);
    expect(parseDisplayTimeToMinutes('12:00 PM')).toBe(720);
    expect(parseDisplayTimeToMinutes('02:15 PM')).toBe(855);
    expect(parseDisplayTimeToMinutes('11:59 PM')).toBe(1439);
  });

  it('converts 12-hour AM/PM to 24-hour HH:mm string', async () => {
    const { to24Hour } = await import('../src/features/reminders/types');
    expect(to24Hour('08:30 AM')).toBe('08:30');
    expect(to24Hour('12:00 PM')).toBe('12:00');
    expect(to24Hour('02:15 PM')).toBe('14:15');
    expect(to24Hour('12:30 AM')).toBe('00:30');
  });

  it('converts 24-hour HH:mm to 12-hour AM/PM string', async () => {
    const { to12Hour } = await import('../src/features/reminders/types');
    expect(to12Hour('08:30')).toBe('08:30 AM');
    expect(to12Hour('12:00')).toBe('12:00 PM');
    expect(to12Hour('14:15')).toBe('02:15 PM');
    expect(to12Hour('00:30')).toBe('12:30 AM');
  });

  it('sorts reminders chronologically by time due', async () => {
    const { parseDisplayTimeToMinutes } = await import('../src/features/reminders/types');
    const items = [
      { id: '1', time: '04:30 PM' },
      { id: '2', time: '08:30 AM' },
      { id: '3', time: '10:00 AM' },
      { id: '4', time: '02:00 PM' },
    ];
    const sorted = [...items].sort((a, b) => parseDisplayTimeToMinutes(a.time) - parseDisplayTimeToMinutes(b.time));
    expect(sorted.map((i) => i.id)).toEqual(['2', '3', '4', '1']);
  });
});

describe('hydration & companion mood domain logic', () => {
  describe('calculateHydrationStatus', () => {
    const baseTime = 1760850000000; // Reference timestamp

    it('returns hydrated when less than 2.5 hours have elapsed', () => {
      const drinkTime = baseTime - 1.5 * 3600 * 1000; // 1.5 hours ago
      const status = calculateHydrationStatus(drinkTime, baseTime);
      expect(status.hydrationLevel).toBe('hydrated');
      expect(status.hoursSinceDrink).toBe(1.5);
    });

    it('returns thirsty when between 2.5 and 4 hours have elapsed', () => {
      const drinkTime = baseTime - 3.0 * 3600 * 1000; // 3 hours ago
      const status = calculateHydrationStatus(drinkTime, baseTime);
      expect(status.hydrationLevel).toBe('thirsty');
      expect(status.hoursSinceDrink).toBe(3.0);
    });

    it('returns dehydrated when 4 or more hours have elapsed', () => {
      const drinkTime = baseTime - 4.5 * 3600 * 1000; // 4.5 hours ago
      const status = calculateHydrationStatus(drinkTime, baseTime);
      expect(status.hydrationLevel).toBe('dehydrated');
      expect(status.hoursSinceDrink).toBe(4.5);
    });

    it('safely handles missing or zero lastDrinkTimeMs', () => {
      const status = calculateHydrationStatus(0, baseTime);
      expect(status.hydrationLevel).toBe('dehydrated');
    });
  });

  describe('isWaterReminder', () => {
    it('detects water droplet and tea emojis', () => {
      expect(isWaterReminder('Morning drink', '💧')).toBe(true);
      expect(isWaterReminder('Afternoon chamomile', '🍵')).toBe(true);
      expect(isWaterReminder('Reading time', '📖')).toBe(false);
    });

    it('detects hydration keywords in title', () => {
      expect(isWaterReminder('Drink 8oz water', '⏰')).toBe(true);
      expect(isWaterReminder('Hydrate body', '✨')).toBe(true);
      expect(isWaterReminder('Afternoon tea hydration break', '☀️')).toBe(true);
      expect(isWaterReminder('Evening stretching', '🧘')).toBe(false);
    });
  });

  describe('computeCompanionMood', () => {
    it('returns sleep when in rest hours and not manually moved', () => {
      const mood = computeCompanionMood({
        isRestHours: true,
        isManualAwake: false,
        hydrationLevel: 'hydrated',
      });
      expect(mood).toBe('sleep');
    });

    it('returns idle when in rest hours but user manually moved Mochi', () => {
      const mood = computeCompanionMood({
        isRestHours: true,
        isManualAwake: true,
        hydrationLevel: 'hydrated',
      });
      expect(mood).toBe('idle');
    });

    it('returns sleep when severely dehydrated even outside rest hours', () => {
      const mood = computeCompanionMood({
        isRestHours: false,
        hydrationLevel: 'dehydrated',
      });
      expect(mood).toBe('sleep');
    });

    it('returns sad when thirsty', () => {
      const mood = computeCompanionMood({
        isRestHours: false,
        hydrationLevel: 'thirsty',
      });
      expect(mood).toBe('sad');
    });

    it('returns sad when has overdue water reminder even if hours are under threshold', () => {
      const mood = computeCompanionMood({
        isRestHours: false,
        hydrationLevel: 'hydrated',
        hasOverdueWaterReminder: true,
      });
      expect(mood).toBe('sad');
    });

    it('returns idle when fully hydrated and awake during daytime', () => {
      const mood = computeCompanionMood({
        isRestHours: false,
        isManualAwake: false,
        hydrationLevel: 'hydrated',
        hasOverdueWaterReminder: false,
      });
      expect(mood).toBe('idle');
    });
  });

  describe('PhraseSelector domain logic', () => {
    it('returns peaceful sleeping phrase during rest hours', async () => {
      const { PhraseSelector } = await import('../src/domain/companion/phrases');
      const selector = new PhraseSelector();
      expect(selector.getPhrase(0.5, true, 2, 'Mochi')).toBe('Resting quietly for the night. 🌙');
    });

    it('returns water reminders when thirsty (hoursSinceWater >= 2)', async () => {
      const { PhraseSelector, WATER_REMINDERS } = await import('../src/domain/companion/phrases');
      const selector = new PhraseSelector();
      const phrase = selector.getPhrase(2.5, false, 14, 'Mochi');
      expect(WATER_REMINDERS).toContain(phrase);
    });

    it('returns midnight sleep reminder when screen is on after midnight', async () => {
      const { PhraseSelector, MIDNIGHT_SLEEP_REMINDERS } = await import('../src/domain/companion/phrases');
      const selector = new PhraseSelector();
      const reminder = selector.getMidnightSleepReminder('Mochi');
      expect(MIDNIGHT_SLEEP_REMINDERS).toContain(reminder);
    });

    it('returns exhausted sleep phrase when severely dehydrated (hoursSinceWater >= 4)', async () => {
      const { PhraseSelector } = await import('../src/domain/companion/phrases');
      const selector = new PhraseSelector();
      const phrase = selector.getPhrase(4.5, false, 15, 'Mochi');
      expect(phrase).toMatch(/water|dehydrated|energy/i);
    });

    it('avoids repeating recently selected phrases sequentially', async () => {
      const { PhraseSelector } = await import('../src/domain/companion/phrases');
      const selector = new PhraseSelector(3);
      const candidates = ['Phrase A', 'Phrase B', 'Phrase C', 'Phrase D'];
      const seen = new Set<string>();
      for (let i = 0; i < 4; i++) {
        const p = selector.pick(candidates);
        seen.add(p);
      }
      expect(seen.size).toBeGreaterThanOrEqual(3);
    });
  });

  describe('voiceParser domain logic', () => {
    it('correctly classifies a single task and extracts time and date', async () => {
      const { parseVoiceInput } = await import('../src/domain/reminders/voiceParser');
      const fixedNow = new Date('2026-10-19T10:00:00');
      const result = parseVoiceInput('Remind me to pick up the package tomorrow at 8:00 PM', fixedNow);
      expect(result.itemType).toBe('task');
      expect(result.title).toBe('Pick up the package');
      expect(result.time).toBe('08:00 PM');
      expect(result.date).toBe('2026-10-20');
      expect(result.recurring).toBe('none');
      expect(result.emoji).toBe('📦');
      expect(result.isComplete).toBe(true);
    });

    it('correctly classifies a recurring routine and cleans title', async () => {
      const { parseVoiceInput } = await import('../src/domain/reminders/voiceParser');
      const fixedNow = new Date('2026-10-19T10:00:00');
      const result = parseVoiceInput('Remind me every month on the first rotary Tuesday to get the receipt at 9 am', fixedNow);
      expect(result.itemType).toBe('routine');
      expect(result.title).toBe('Get the receipt');
      expect(result.time).toBe('09:00 AM');
      expect(result.isComplete).toBe(true);
    });

    it('detects missing time and produces a conversational prompt', async () => {
      const { parseVoiceInput } = await import('../src/domain/reminders/voiceParser');
      const result = parseVoiceInput('Remind me to pick up the package');
      expect(result.itemType).toBe('task');
      expect(result.title).toBe('Pick up the package');
      expect(result.time).toBeNull();
      expect(result.isComplete).toBe(false);
      expect(result.missingField).toBe('time');
      expect(result.clarificationPrompt).toContain('What time should I remind you');
    });

    it('fills in missing slot with follow-up clarification answer', async () => {
      const { parseVoiceInput, fillClarification } = await import('../src/domain/reminders/voiceParser');
      const pending = parseVoiceInput('Remind me to pick up the package');
      expect(pending.isComplete).toBe(false);

      const resolved = fillClarification(pending, 'Tomorrow at 5 PM', new Date('2026-10-19T10:00:00'));
      expect(resolved.isComplete).toBe(true);
      expect(resolved.time).toBe('05:00 PM');
      expect(resolved.date).toBe('2026-10-20');
      expect(resolved.missingField).toBeNull();
    });

    it('infers correct emojis for health and wellness reminders', async () => {
      const { inferEmoji } = await import('../src/domain/reminders/voiceParser');
      expect(inferEmoji('Drink a glass of water')).toBe('💧');
      expect(inferEmoji('Take morning vitamins')).toBe('💊');
      expect(inferEmoji('Read book chapter')).toBe('📚');
      expect(inferEmoji('Morning prayer and devotion')).toBe('🙏');
      expect(inferEmoji('Call Mom for her birthday')).toBe('📞');
      expect(inferEmoji('Evening stretching')).toBe('🏃');
    });

    it('identifies conversational water intake phrases', async () => {
      const { isWaterIntakePhrase } = await import('../src/domain/reminders/voiceParser');
      expect(isWaterIntakePhrase('I drank water')).toBe(true);
      expect(isWaterIntakePhrase('I just drank a glass of water')).toBe(true);
      expect(isWaterIntakePhrase('Drank water')).toBe(true);
      expect(isWaterIntakePhrase('Had water')).toBe(true);
      expect(isWaterIntakePhrase('Finished my water bottle')).toBe(true);
      expect(isWaterIntakePhrase('Logged water')).toBe(true);
      expect(isWaterIntakePhrase('Water done')).toBe(true);
      expect(isWaterIntakePhrase('Remind me to call mom')).toBe(false);
      expect(isWaterIntakePhrase('Pick up groceries tomorrow')).toBe(false);
    });

    it('correctly parses hourly repeating routine and interval from voice', async () => {
      const { parseVoiceInput } = await import('../src/domain/reminders/voiceParser');
      const fixedNow = new Date('2026-10-19T09:00:00');
      const result = parseVoiceInput('Remind me every 2 hours to drink water', fixedNow);
      expect(result.itemType).toBe('routine');
      expect(result.recurring).toBe('hourly');
      expect(result.repeatIntervalHours).toBe(2);
      expect(result.title).toBe('Drink water');
      expect(result.emoji).toBe('💧');
      expect(result.isComplete).toBe(true);
    });

    it('defaults to 1 hour if every hour is said without a number', async () => {
      const { parseVoiceInput } = await import('../src/domain/reminders/voiceParser');
      const fixedNow = new Date('2026-10-19T10:00:00');
      const result = parseVoiceInput('Remind me every hour to stand and stretch', fixedNow);
      expect(result.itemType).toBe('routine');
      expect(result.recurring).toBe('hourly');
      expect(result.repeatIntervalHours).toBe(1);
      expect(result.title).toBe('Stand and stretch');
      expect(result.isComplete).toBe(true);
    });
  });

  describe('calculateNextHourlyOccurrence domain logic', () => {
    it('calculates next occurrence based on interval when completed on time', async () => {
      const { calculateNextHourlyOccurrence } = await import('../src/domain/reminders/recurrence');
      const refDate = new Date('2026-10-19T09:15:00');
      const next = calculateNextHourlyOccurrence('09:00 AM', '2026-10-19', 2, refDate);
      expect(next.time).toBe('11:00 AM');
      expect(next.date).toBe('2026-10-19');
    });

    it('advances in multiples of interval if user completes it late', async () => {
      const { calculateNextHourlyOccurrence } = await import('../src/domain/reminders/recurrence');
      const refDate = new Date('2026-10-19T11:45:00'); // Completed at 11:45 AM
      const next = calculateNextHourlyOccurrence('09:00 AM', '2026-10-19', 2, refDate);
      // 09:00 + 2h = 11:00 (past). 09:00 + 4h = 01:00 PM (future).
      expect(next.time).toBe('01:00 PM');
      expect(next.date).toBe('2026-10-19');
    });

    it('crosses into the next day when scheduled late at night', async () => {
      const { calculateNextHourlyOccurrence } = await import('../src/domain/reminders/recurrence');
      const refDate = new Date('2026-10-19T23:05:00');
      const next = calculateNextHourlyOccurrence('11:00 PM', '2026-10-19', 3, refDate);
      expect(next.time).toBe('02:00 AM');
      expect(next.date).toBe('2026-10-20');
    });

    it('respects 1-hour interval for frequent habits', async () => {
      const { calculateNextHourlyOccurrence } = await import('../src/domain/reminders/recurrence');
      const refDate = new Date('2026-10-19T14:10:00');
      const next = calculateNextHourlyOccurrence('02:00 PM', '2026-10-19', 1, refDate);
      expect(next.time).toBe('03:00 PM');
      expect(next.date).toBe('2026-10-19');
    });
  });

  describe('Water Tracker & Daily Hydration History', () => {
    it('returns 0 glasses when no entry exists for the date', async () => {
      const { getWaterForDate } = await import('../src/domain/reminders/waterTracker');
      expect(getWaterForDate({}, '2026-10-21')).toBe(0);
      expect(getWaterForDate({ '2026-10-20': 5 }, '2026-10-21')).toBe(0);
    });

    it('adds water glasses to the specified day', async () => {
      const { addWaterLog, getWaterForDate } = await import('../src/domain/reminders/waterTracker');
      let history = {};
      history = addWaterLog(history, '2026-10-21', 1);
      expect(getWaterForDate(history, '2026-10-21')).toBe(1);

      history = addWaterLog(history, '2026-10-21', 2);
      expect(getWaterForDate(history, '2026-10-21')).toBe(3);
    });

    it('sets exact water amount without going negative', async () => {
      const { setWaterLog, getWaterForDate } = await import('../src/domain/reminders/waterTracker');
      let history = setWaterLog({}, '2026-10-21', 6);
      expect(getWaterForDate(history, '2026-10-21')).toBe(6);

      history = setWaterLog(history, '2026-10-21', -3);
      expect(getWaterForDate(history, '2026-10-21')).toBe(0);
    });

    it('generates past N days of logs with goal status and friendly labels', async () => {
      const { getPastDaysWaterLogs } = await import('../src/domain/reminders/waterTracker');
      const history = {
        '2026-10-21': 8,
        '2026-10-20': 6,
        '2026-10-19': 9,
      };
      const logs = getPastDaysWaterLogs(history, '2026-10-21', 3, 8);
      expect(logs.length).toBe(3);

      expect(logs[0].date).toBe('2026-10-21');
      expect(logs[0].displayDate).toBe('Today');
      expect(logs[0].glasses).toBe(8);
      expect(logs[0].goalMet).toBe(true);

      expect(logs[1].date).toBe('2026-10-20');
      expect(logs[1].displayDate).toBe('Yesterday');
      expect(logs[1].glasses).toBe(6);
      expect(logs[1].goalMet).toBe(false);

      expect(logs[2].date).toBe('2026-10-19');
      expect(logs[2].displayDate).toBe('Oct 19');
      expect(logs[2].glasses).toBe(9);
      expect(logs[2].goalMet).toBe(true);
    });
  });
});

