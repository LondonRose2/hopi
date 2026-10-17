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
