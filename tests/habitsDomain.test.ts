import { describe, it, expect } from 'vitest';
import {
  type Habit,
  DEFAULT_HABIT_TARGET_DAYS,
  daysBetweenDates,
  calculateHabitProgress,
  toggleHabitDate,
  getEnergyColorTheme,
  isHabitScheduledForToday,
} from '../src/domain/habits';

describe('Habit Domain Logic', () => {
  const createMockHabit = (overrides?: Partial<Habit>): Habit => ({
    id: 'test-habit-1',
    title: 'Morning Meditation',
    emoji: '🧘',
    time: '08:00 AM',
    cadence: 'daily',
    targetDays: DEFAULT_HABIT_TARGET_DAYS, // 60
    completedDates: [],
    startDate: '2026-10-01',
    status: 'active',
    createdAt: Date.now(),
    ...overrides,
  });

  describe('daysBetweenDates', () => {
    it('calculates days between two dates correctly', () => {
      expect(daysBetweenDates('2026-10-01', '2026-10-02')).toBe(1);
      expect(daysBetweenDates('2026-10-01', '2026-10-08')).toBe(7);
      expect(daysBetweenDates('2026-10-01', '2026-10-01')).toBe(0);
    });

    it('returns 0 for invalid inputs', () => {
      expect(daysBetweenDates('invalid', '2026-10-02')).toBe(0);
    });
  });

  describe('calculateHabitProgress & Inactivity Rules', () => {
    it('defaults to 60 days target with 0% progress when new', () => {
      const habit = createMockHabit();
      const progress = calculateHabitProgress(habit, '2026-10-22');
      expect(progress.targetDays).toBe(60);
      expect(progress.totalCompletedDays).toBe(0);
      expect(progress.percent).toBe(0);
      expect(progress.isCompletedToday).toBe(false);
      expect(progress.colorTheme.stage).toBe('seedling');
    });

    it('preserves accumulated days when missing 1 day (no penalty)', () => {
      const habit = createMockHabit({
        completedDates: ['2026-10-18', '2026-10-19'],
      });
      // Last completed is Oct 19. Today is Oct 21 (2 days gap)
      const progress = calculateHabitProgress(habit, '2026-10-21');
      expect(progress.daysSinceLastCheckin).toBe(2);
      expect(progress.isStreakResetNeeded).toBe(false);
      expect(progress.totalCompletedDays).toBe(2);
    });

    it('preserves accumulated days when missing 6 consecutive days (grace period)', () => {
      const habit = createMockHabit({
        completedDates: ['2026-10-10', '2026-10-11', '2026-10-12'],
      });
      // Last completed is Oct 12. Today is Oct 18 (6 days gap)
      const progress = calculateHabitProgress(habit, '2026-10-18');
      expect(progress.daysSinceLastCheckin).toBe(6);
      expect(progress.isStreakResetNeeded).toBe(false);
      expect(progress.totalCompletedDays).toBe(3);
    });

    it('triggers streak reset when missing 7 or more consecutive days (1 full week)', () => {
      const habit = createMockHabit({
        completedDates: ['2026-10-10', '2026-10-11', '2026-10-12'],
      });
      // Last completed is Oct 12. Today is Oct 19 (7 days gap)
      const progress = calculateHabitProgress(habit, '2026-10-19');
      expect(progress.daysSinceLastCheckin).toBe(7);
      expect(progress.isStreakResetNeeded).toBe(true);
      expect(progress.totalCompletedDays).toBe(0); // Resets to zero for fresh start
      expect(progress.percent).toBe(0);
    });

    it('recognizes when today is completed', () => {
      const habit = createMockHabit({
        completedDates: ['2026-10-22'],
      });
      const progress = calculateHabitProgress(habit, '2026-10-22');
      expect(progress.isCompletedToday).toBe(true);
      expect(progress.daysSinceLastCheckin).toBe(0);
      expect(progress.totalCompletedDays).toBe(1);
    });
  });

  describe('toggleHabitDate', () => {
    it('adds today to completed dates and marks as completed', () => {
      const habit = createMockHabit({ completedDates: ['2026-10-21'] });
      const updated = toggleHabitDate(habit, '2026-10-22');
      expect(updated.completedDates).toContain('2026-10-22');
      expect(updated.completedDates.length).toBe(2);
    });

    it('unchecks today when toggled again', () => {
      const habit = createMockHabit({ completedDates: ['2026-10-21', '2026-10-22'] });
      const updated = toggleHabitDate(habit, '2026-10-22');
      expect(updated.completedDates).not.toContain('2026-10-22');
      expect(updated.completedDates.length).toBe(1);
    });

    it('resets old history if toggling after missing 7+ days', () => {
      const habit = createMockHabit({ completedDates: ['2026-10-01', '2026-10-02'] });
      // Oct 15 is 13 days later (> 7 days)
      const updated = toggleHabitDate(habit, '2026-10-15');
      expect(updated.completedDates).toEqual(['2026-10-15']);
      expect(updated.completedDates.length).toBe(1);
    });

    it('transitions status to achieved when reaching target days', () => {
      const habit = createMockHabit({
        targetDays: 5,
        completedDates: ['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04'],
      });
      const updated = toggleHabitDate(habit, '2026-10-05');
      expect(updated.completedDates.length).toBe(5);
      expect(updated.status).toBe('achieved');
      expect(updated.achievedAt).toBeDefined();
    });
  });

  describe('getEnergyColorTheme', () => {
    it('maps 0-24% to seedling', () => {
      expect(getEnergyColorTheme(0).stage).toBe('seedling');
      expect(getEnergyColorTheme(24).stage).toBe('seedling');
    });

    it('maps 25-49% to sprout (momentum)', () => {
      expect(getEnergyColorTheme(25).stage).toBe('sprout');
      expect(getEnergyColorTheme(49).stage).toBe('sprout');
    });

    it('maps 50-74% to growth', () => {
      expect(getEnergyColorTheme(50).stage).toBe('growth');
      expect(getEnergyColorTheme(74).stage).toBe('growth');
    });

    it('maps 75-99% to bloom', () => {
      expect(getEnergyColorTheme(75).stage).toBe('bloom');
      expect(getEnergyColorTheme(99).stage).toBe('bloom');
    });

    it('maps 100% to achieved with golden trophy theme', () => {
      const theme = getEnergyColorTheme(100);
      expect(theme.stage).toBe('achieved');
      expect(theme.label).toContain('🏆');
      expect(theme.fillColor).toBe('#FBBF24');
    });
  });

  describe('isHabitScheduledForToday', () => {
    it('returns true every day for daily cadence', () => {
      const habit = createMockHabit({ cadence: 'daily' });
      // Sunday (0)
      expect(isHabitScheduledForToday(habit, new Date(2026, 9, 18))).toBe(true);
      // Wednesday (3)
      expect(isHabitScheduledForToday(habit, new Date(2026, 9, 21))).toBe(true);
    });

    it('returns true on weekdays and false on weekends for weekdays cadence', () => {
      const habit = createMockHabit({ cadence: 'weekdays' });
      // Sunday Oct 18, 2026
      expect(isHabitScheduledForToday(habit, new Date(2026, 9, 18))).toBe(false);
      // Monday Oct 19, 2026
      expect(isHabitScheduledForToday(habit, new Date(2026, 9, 19))).toBe(true);
      // Friday Oct 23, 2026
      expect(isHabitScheduledForToday(habit, new Date(2026, 9, 23))).toBe(true);
      // Saturday Oct 24, 2026
      expect(isHabitScheduledForToday(habit, new Date(2026, 9, 24))).toBe(false);
    });
  });

  describe('Habit Voice Parsing', () => {
    it('classifies "Add a new habit morning reading at 8am" with default 60 days and daily cadence', async () => {
      const { parseVoiceInput } = await import('../src/domain/reminders/voiceParser');
      const fixedNow = new Date('2026-10-19T10:00:00');
      const res = parseVoiceInput('Add a new habit morning reading at 8am', fixedNow);
      expect(res.itemType).toBe('habit');
      expect(res.title).toBe('Morning reading');
      expect(res.time).toBe('08:00 AM');
      expect(res.targetDays).toBe(60);
      expect(res.recurring).toBe('daily');
      expect(res.isComplete).toBe(true);
    });

    it('extracts explicit target days and weekday cadence', async () => {
      const { parseVoiceInput } = await import('../src/domain/reminders/voiceParser');
      const fixedNow = new Date('2026-10-19T10:00:00');
      const res = parseVoiceInput('Start a weekday habit yoga for 30 days at 7:30 am', fixedNow);
      expect(res.itemType).toBe('habit');
      expect(res.title).toBe('Yoga');
      expect(res.time).toBe('07:30 AM');
      expect(res.targetDays).toBe(30);
      expect(res.recurring).toBe('weekdays');
      expect(res.isComplete).toBe(true);
    });
  });
});
