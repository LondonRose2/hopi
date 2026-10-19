export interface HourlyOccurrenceResult {
  time: string; // e.g. "11:00 AM"
  date: string; // e.g. "2026-10-19"
}

/**
 * Calculates the next occurrence timestamp for an hourly repeating routine.
 * Guarantees that the returned date and time is strictly in the future relative to referenceDate.
 */
export function calculateNextHourlyOccurrence(
  dueTimeStr: string,
  baseDateStr: string,
  intervalHours: number,
  referenceDate: Date = new Date()
): HourlyOccurrenceResult {
  const safeInterval = Math.max(1, Math.min(24, Math.floor(intervalHours) || 1));
  const intervalMs = safeInterval * 60 * 60 * 1000;

  // Parse due time (supports both "09:00 AM" and "09:00")
  let hours = 9;
  let minutes = 0;
  const match = dueTimeStr.trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (match) {
    hours = parseInt(match[1], 10);
    minutes = parseInt(match[2], 10);
    const ampm = match[3]?.toUpperCase();
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
  }

  const parts = baseDateStr.split('-');
  const y = parseInt(parts[0], 10) || referenceDate.getFullYear();
  const m = (parseInt(parts[1], 10) || 1) - 1;
  const d = parseInt(parts[2], 10) || referenceDate.getDate();

  let targetMs = new Date(y, m, d, hours, minutes, 0, 0).getTime();
  const refMs = referenceDate.getTime();

  if (targetMs + intervalMs > refMs) {
    targetMs += intervalMs;
  } else {
    const diff = refMs - targetMs;
    const steps = Math.floor(diff / intervalMs) + 1;
    targetMs += steps * intervalMs;
  }

  const nextDate = new Date(targetMs);
  const nextYear = nextDate.getFullYear();
  const nextMonth = (nextDate.getMonth() + 1).toString().padStart(2, '0');
  const nextDay = nextDate.getDate().toString().padStart(2, '0');

  let nextHours = nextDate.getHours();
  const nextMinutes = nextDate.getMinutes().toString().padStart(2, '0');
  const meridiem = nextHours >= 12 ? 'PM' : 'AM';
  nextHours = nextHours % 12 || 12;
  const formattedTime = `${nextHours.toString().padStart(2, '0')}:${nextMinutes} ${meridiem}`;

  return {
    time: formattedTime,
    date: `${nextYear}-${nextMonth}-${nextDay}`,
  };
}
