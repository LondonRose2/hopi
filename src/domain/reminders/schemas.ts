import { z } from 'zod';
import type { Reminder, Settings } from './types';

export const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;
export const DATE_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export const reminderCategorySchema = z.enum([
  'water',
  'walk',
  'rest',
  'scripture',
  'custom',
]);

export const recurringTypeSchema = z.enum([
  'daily',
  'weekdays',
  'once',
]);

export const avatarTypeSchema = z.enum([
  'rabbit',
  'penguin',
  'mochi',
  'pip',
  'snowdrop',
]);

export const reminderSchema = z.object({
  id: z.string().min(1, 'ID cannot be empty'),
  title: z.string().trim().min(1, 'Title cannot be empty').max(100, 'Title cannot exceed 100 characters'),
  emoji: z.string().min(1, 'Emoji cannot be empty'),
  time: z.string().regex(TIME_REGEX, 'Time must be in 24-hour format HH:mm (00:00 to 23:59)'),
  date: z.string().regex(DATE_REGEX, 'Date must be in YYYY-MM-DD format'),
  completed: z.boolean(),
  completedAt: z.string().optional(),
  category: reminderCategorySchema,
  recurring: recurringTypeSchema,
});

export const settingsSchema = z.object({
  avatar: avatarTypeSchema,
  sleepStart: z.string().regex(TIME_REGEX, 'Sleep start must be in 24-hour format HH:mm'),
  sleepEnd: z.string().regex(TIME_REGEX, 'Sleep end must be in 24-hour format HH:mm'),
  encouragementsEnabled: z.boolean(),
  overlayEnabled: z.boolean(),
  notificationsEnabled: z.boolean(),
});

export const remindersListSchema = z.array(reminderSchema);

export function validateReminder(data: unknown): Reminder {
  return reminderSchema.parse(data);
}

export function validateSettings(data: unknown): Settings {
  return settingsSchema.parse(data);
}

export function safeValidateReminder(data: unknown) {
  return reminderSchema.safeParse(data);
}

export function safeValidateSettings(data: unknown) {
  return settingsSchema.safeParse(data);
}
