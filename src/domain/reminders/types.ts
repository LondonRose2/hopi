export type ReminderCategory = 'water' | 'walk' | 'rest' | 'scripture' | 'custom';

export type RecurringType = 'daily' | 'weekdays' | 'once' | 'weekly' | 'hourly';

export type AvatarType = 'rabbit' | 'penguin' | 'mochi' | 'pip' | 'snowdrop';

export interface Reminder {
  id: string;
  title: string;
  emoji: string;
  time: string; // HH:mm format e.g. '09:30'
  date: string; // YYYY-MM-DD format e.g. '2026-10-18'
  completed: boolean;
  completedAt?: string;
  category: ReminderCategory;
  recurring: RecurringType;
  repeatIntervalHours?: number;
}

export interface Settings {
  avatar: AvatarType;
  sleepStart: string; // HH:mm format e.g. '00:00'
  sleepEnd: string; // HH:mm format e.g. '09:00'
  encouragementsEnabled: boolean;
  overlayEnabled: boolean;
  notificationsEnabled: boolean;
}

export interface BibleVerse {
  id: string;
  text: string;
  reference: string;
  theme?: string;
}
