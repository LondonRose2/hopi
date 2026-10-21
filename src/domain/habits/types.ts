export type HabitCadence = 'daily' | 'weekdays';

export interface Habit {
  id: string;
  title: string;
  emoji: string;
  time: string; // e.g. "08:00 AM" (reminder time of day)
  cadence: HabitCadence; // 'daily' (7 days) or 'weekdays' (Mon-Fri)
  targetDays: number; // default: 60
  completedDates: string[]; // sorted ISO strings ["YYYY-MM-DD", ...]
  startDate: string; // ISO date "YYYY-MM-DD"
  status: 'active' | 'achieved' | 'archived';
  achievedAt?: string; // ISO timestamp when target reached
  createdAt: number;
}

export type EnergyStage = 'seedling' | 'sprout' | 'growth' | 'bloom' | 'achieved';

export interface EnergyColorTheme {
  stage: EnergyStage;
  label: string;
  gradient: string;
  fillColor: string;
  glowColor: string;
  textColor: string;
}

export interface HabitProgress {
  totalCompletedDays: number;
  targetDays: number;
  percent: number; // 0 to 100
  isCompletedToday: boolean;
  daysSinceLastCheckin: number;
  isStreakResetNeeded: boolean;
  colorTheme: EnergyColorTheme;
  isAchieved: boolean;
}

export const DEFAULT_HABIT_TARGET_DAYS = 60;
export const QUICK_TARGET_DAYS_OPTIONS = [7, 21, 30, 60, 90] as const;
export const INACTIVITY_RESET_DAYS_THRESHOLD = 7;
