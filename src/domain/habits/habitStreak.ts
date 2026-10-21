import type { Habit, HabitProgress } from './types';
import { INACTIVITY_RESET_DAYS_THRESHOLD } from './types';
import { getEnergyColorTheme } from './habitEnergy';

export function parseDateToMidnightMs(dateStr: string): number {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return NaN;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  return new Date(year, month, day, 0, 0, 0, 0).getTime();
}

export function daysBetweenDates(earlierIso: string, laterIso: string): number {
  const t1 = parseDateToMidnightMs(earlierIso);
  const t2 = parseDateToMidnightMs(laterIso);
  if (isNaN(t1) || isNaN(t2)) return 0;
  const diffMs = t2 - t1;
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

export function getTodayIsoString(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = (now.getMonth() + 1).toString().padStart(2, '0');
  const d = now.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function calculateHabitProgress(habit: Habit, todayStr: string = getTodayIsoString()): HabitProgress {
  const dates = [...habit.completedDates].sort();
  const isCompletedToday = dates.includes(todayStr);
  const targetDays = Math.max(1, habit.targetDays || 60);

  if (dates.length === 0) {
    return {
      totalCompletedDays: 0,
      targetDays,
      percent: 0,
      isCompletedToday: false,
      daysSinceLastCheckin: 0,
      isStreakResetNeeded: false,
      colorTheme: getEnergyColorTheme(0),
      isAchieved: habit.status === 'achieved',
    };
  }

  const lastCompleted = dates[dates.length - 1];
  const daysSinceLastCheckin = isCompletedToday ? 0 : daysBetweenDates(lastCompleted, todayStr);
  const isStreakResetNeeded = daysSinceLastCheckin >= INACTIVITY_RESET_DAYS_THRESHOLD;

  const totalCompletedDays = isStreakResetNeeded ? 0 : dates.length;
  const percent = Math.min(100, Math.round((totalCompletedDays / targetDays) * 100));
  const isAchieved = totalCompletedDays >= targetDays || habit.status === 'achieved';

  return {
    totalCompletedDays,
    targetDays,
    percent,
    isCompletedToday,
    daysSinceLastCheckin,
    isStreakResetNeeded,
    colorTheme: getEnergyColorTheme(percent),
    isAchieved,
  };
}

export function toggleHabitDate(habit: Habit, dateStr: string = getTodayIsoString()): Habit {
  const progress = calculateHabitProgress(habit, dateStr);
  const exists = habit.completedDates.includes(dateStr);

  let updatedDates: string[];
  if (exists) {
    updatedDates = habit.completedDates.filter((d) => d !== dateStr);
  } else {
    // If user missed 7+ days, reset accumulated days and start fresh today
    const base = progress.isStreakResetNeeded ? [] : habit.completedDates;
    updatedDates = [...new Set([...base, dateStr])].sort();
  }

  const isAchieved = updatedDates.length >= habit.targetDays;
  return {
    ...habit,
    completedDates: updatedDates,
    status: isAchieved ? 'achieved' : 'active',
    achievedAt: isAchieved ? (habit.achievedAt || new Date().toISOString()) : undefined,
  };
}

export function isHabitScheduledForToday(habit: Habit, date: Date = new Date()): boolean {
  if (habit.status === 'archived') return false;
  if (habit.cadence === 'weekdays') {
    const day = date.getDay(); // 0 is Sun, 6 is Sat
    return day >= 1 && day <= 5;
  }
  return true;
}
