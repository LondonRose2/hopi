import type { Reminder } from './types';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const;

/**
 * Formats a YYYY-MM-DD date string into a clean header like 'Thu, Jan 30'.
 * Avoids timezone drift by anchoring to local noon.
 */
export function formatDayHeader(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) {
    throw new Error(`Invalid date format: "${dateStr}". Expected YYYY-MM-DD`);
  }
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  if (
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    throw new Error(`Invalid date values in "${dateStr}"`);
  }

  const d = new Date(year, month - 1, day, 12, 0, 0);
  const weekday = WEEKDAYS[d.getDay()];
  const monthName = MONTHS[d.getMonth()];
  return `${weekday}, ${monthName} ${day}`;
}

/**
 * Groups reminders strictly occurring after `todayDateStr` into a dictionary keyed by formatted day headers.
 * Tasks are sorted chronologically by date and time.
 * Reminders occurring on or before `todayDateStr` are excluded.
 */
export function groupUpcomingTasksByDay(
  reminders: Reminder[],
  todayDateStr: string
): Record<string, Reminder[]> {
  const upcoming = reminders
    .filter((reminder) => reminder.date > todayDateStr)
    .slice()
    .sort((a, b) => {
      const dateCmp = a.date.localeCompare(b.date);
      if (dateCmp !== 0) return dateCmp;
      return a.time.localeCompare(b.time);
    });

  const grouped: Record<string, Reminder[]> = {};

  for (const reminder of upcoming) {
    const header = formatDayHeader(reminder.date);
    if (!grouped[header]) {
      grouped[header] = [];
    }
    grouped[header].push(reminder);
  }

  return grouped;
}

export interface OverdueCheckable {
  completed: boolean;
  date: string;
  time: string;
}

/**
 * Determines whether a reminder is overdue given the current timestamp.
 * A completed reminder is never overdue.
 * An uncompleted reminder is overdue if its scheduled date and time have passed.
 */
export function isReminderOverdue(reminder: OverdueCheckable, now = Date.now()): boolean {
  if (reminder.completed) return false;
  let hours = 9;
  let minutes = 0;
  const match = reminder.time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (match) {
    hours = parseInt(match[1], 10);
    minutes = parseInt(match[2], 10);
    const ampm = match[3]?.toUpperCase();
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
  }
  const dateParts = reminder.date.split('-');
  const year = parseInt(dateParts[0], 10);
  const month = (parseInt(dateParts[1], 10) || 1) - 1;
  const day = parseInt(dateParts[2], 10);
  if (!year || isNaN(month) || !day) return false;

  const scheduled = new Date(year, month, day, hours, minutes, 0, 0).getTime();
  return scheduled < now;
}

/**
 * Checks if there is at least one uncompleted reminder that is overdue.
 */
export function hasAnyOverdueReminders(reminders: OverdueCheckable[], now = Date.now()): boolean {
  return reminders.some((r) => isReminderOverdue(r, now));
}

