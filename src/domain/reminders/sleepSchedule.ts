/**
 * Converts a 24-hour time string "HH:mm" to minutes since midnight (0 - 1439).
 */
export function parseTimeToMinutes(timeStr: string): number {
  const parts = timeStr.split(':');
  if (parts.length !== 2) {
    throw new Error(`Invalid time format: "${timeStr}". Expected "HH:mm"`);
  }
  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);
  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    throw new Error(`Invalid time values in "${timeStr}"`);
  }
  return hours * 60 + minutes;
}

/**
 * Determines whether the specified time falls within quiet (sleep) hours.
 * Handles both same-day ranges (e.g. 00:00 to 09:00) and midnight crossovers (e.g. 22:00 to 07:00).
 * Quiet hours are inclusive of start time, exclusive of end time [sleepStart, sleepEnd).
 */
export function isQuietHours(timeStr: string, sleepStart: string, sleepEnd: string): boolean {
  const currentMinutes = parseTimeToMinutes(timeStr);
  const startMinutes = parseTimeToMinutes(sleepStart);
  const endMinutes = parseTimeToMinutes(sleepEnd);

  if (startMinutes === endMinutes) {
    return false;
  }

  if (startMinutes < endMinutes) {
    // Range within the same calendar day (e.g. 00:00 to 09:00 or 13:00 to 15:00)
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }

  // Range spans across midnight (e.g. 22:00 to 07:00)
  return currentMinutes >= startMinutes || currentMinutes < endMinutes;
}
