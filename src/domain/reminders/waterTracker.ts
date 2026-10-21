export type WaterHistory = Record<string, number>;

export const DEFAULT_DAILY_WATER_GOAL = 8;
export const GLASS_OUNCES = 8; // 8 oz per glass (~240 ml)

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export interface WaterDayLog {
  date: string;
  displayDate: string;
  glasses: number;
  ounces: number;
  goalMet: boolean;
}

/**
 * Returns the number of glasses logged for a specific date (defaults to 0).
 */
export function getWaterForDate(history: WaterHistory, dateStr: string): number {
  if (!history || typeof history !== 'object') return 0;
  const count = history[dateStr];
  return typeof count === 'number' && !Number.isNaN(count) && count > 0 ? count : 0;
}

/**
 * Adds glasses to a specific date's log (cannot be negative).
 */
export function addWaterLog(
  history: WaterHistory,
  dateStr: string,
  amount: number = 1
): WaterHistory {
  const current = getWaterForDate(history, dateStr);
  const next = Math.max(0, current + amount);
  return {
    ...history,
    [dateStr]: next,
  };
}

/**
 * Sets the exact number of glasses for a specific date.
 */
export function setWaterLog(
  history: WaterHistory,
  dateStr: string,
  glasses: number
): WaterHistory {
  return {
    ...history,
    [dateStr]: Math.max(0, Math.round(glasses)),
  };
}

/**
 * Formats a YYYY-MM-DD date into friendly short text like "Today", "Yesterday", or "Oct 19".
 */
export function formatDayLabel(dateStr: string, todayStr: string): string {
  if (dateStr === todayStr) return 'Today';

  const [y1, m1, d1] = todayStr.split('-').map(Number);
  const [y2, m2, d2] = dateStr.split('-').map(Number);

  const todayDate = new Date(y1, m1 - 1, d1);
  const targetDate = new Date(y2, m2 - 1, d2);

  const diffDays = Math.round((todayDate.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 1) return 'Yesterday';

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[m2 - 1]} ${d2}`;
}

/**
 * Returns past N days of hydration history ending at todayStr.
 */
export function getPastDaysWaterLogs(
  history: WaterHistory,
  todayStr: string,
  numDays: number = 7,
  goal: number = DEFAULT_DAILY_WATER_GOAL
): WaterDayLog[] {
  const logs: WaterDayLog[] = [];
  const [year, month, day] = todayStr.split('-').map(Number);
  const baseDate = new Date(year, month - 1, day);

  for (let i = 0; i < numDays; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() - i);
    const yStr = d.getFullYear();
    const mStr = String(d.getMonth() + 1).padStart(2, '0');
    const dStr = String(d.getDate()).padStart(2, '0');
    const dateKey = `${yStr}-${mStr}-${dStr}`;

    const glasses = getWaterForDate(history, dateKey);
    logs.push({
      date: dateKey,
      displayDate: formatDayLabel(dateKey, todayStr),
      glasses,
      ounces: glasses * GLASS_OUNCES,
      goalMet: glasses >= goal,
    });
  }

  return logs;
}
