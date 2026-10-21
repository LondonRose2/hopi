export type RecurringType = 'none' | 'daily' | 'weekdays' | 'weekly' | 'hourly';
export type ItemType = 'task' | 'routine' | 'habit';

export interface Reminder {
  id: string;
  title: string;
  emoji: string;
  time: string; // e.g. "09:00 AM"
  date: string; // ISO "YYYY-MM-DD"
  completed: boolean;
  recurring?: RecurringType;
  repeatIntervalHours?: number; // e.g. 1 to 24 hours apart
  itemType?: ItemType;
  targetDays?: number;
}

export const EMOJI_OPTIONS = [
  // Wellness & Health
  '💧', '💊', '🧘', '🏃', '🚶', '🍎', '🥗', '🍵', '☕', '🛌', '☀️', '🌙', '🦷', '🧼',
  // Daily Tasks & Life
  '📝', '💻', '📚', '📖', '🎯', '🧹', '🛒', '🧺', '🪴', '🐶', '🐱', '✉️', '📞', '🎒', '🚗',
  // Spiritual & Calm
  '🙏', '🕯️', '🕊️', '🌿', '🌸', '🎨', '🎵', '💖', '⭐', '⏰'
] as const;

export function parseDisplayTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!match) return 0;
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const meridiem = match[3]?.toUpperCase();
  if (meridiem === 'PM' && h < 12) h += 12;
  if (meridiem === 'AM' && h === 12) h = 0;
  return h * 60 + m;
}

export function to24Hour(timeStr: string): string {
  if (!timeStr) return '09:00';
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!match) return '09:00';
  let h = parseInt(match[1], 10);
  const m = match[2];
  const meridiem = match[3]?.toUpperCase();
  if (meridiem === 'PM' && h < 12) h += 12;
  if (meridiem === 'AM' && h === 12) h = 0;
  return `${h.toString().padStart(2, '0')}:${m}`;
}

export function to12Hour(timeStr: string): string {
  if (!timeStr) return '09:00 AM';
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!match) return timeStr;
  let h = parseInt(match[1], 10);
  const m = match[2];
  if (match[3]) {
    const meridiem = match[3].toUpperCase();
    return `${(h % 12 || 12).toString().padStart(2, '0')}:${m} ${meridiem}`;
  }
  const meridiem = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h.toString().padStart(2, '0')}:${m} ${meridiem}`;
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const INITIAL_REMINDERS: Reminder[] = [
  {
    id: 'rem-1',
    title: 'Morning glass of water',
    emoji: '💧',
    time: '08:30 AM',
    date: '2026-10-18',
    completed: false,
    recurring: 'none',
    itemType: 'task',
  },
  {
    id: 'rem-2',
    title: 'Breathe & gentle stretch',
    emoji: '🧘',
    time: '10:00 AM',
    date: '2026-10-18',
    completed: false,
    recurring: 'daily',
    itemType: 'routine',
  },
  {
    id: 'rem-3',
    title: 'Mindful herbal tea break',
    emoji: '☕',
    time: '02:00 PM',
    date: '2026-10-18',
    completed: false,
    recurring: 'weekdays',
    itemType: 'routine',
  },
  {
    id: 'rem-4',
    title: 'Afternoon sunshine walk',
    emoji: '🚶',
    time: '04:30 PM',
    date: '2026-10-18',
    completed: false,
    recurring: 'none',
    itemType: 'task',
  },
  {
    id: 'rem-5',
    title: 'Evening quiet reading',
    emoji: '📖',
    time: '08:45 PM',
    date: '2026-10-18',
    completed: false,
    recurring: 'daily',
    itemType: 'routine',
  },
  {
    id: 'rem-6',
    title: 'Nightly vitamins & magnesium',
    emoji: '💊',
    time: '10:00 PM',
    date: '2026-10-18',
    completed: false,
    recurring: 'daily',
    itemType: 'routine',
  },
  // Upcoming tasks for dates after today
  {
    id: 'rem-7',
    title: 'Weekly grocery basket',
    emoji: '🍎',
    time: '10:30 AM',
    date: '2026-10-19',
    completed: false,
    recurring: 'none',
    itemType: 'task',
  },
  {
    id: 'rem-8',
    title: 'Reflect & journal prayer notes',
    emoji: '🙏',
    time: '07:00 PM',
    date: '2026-10-19',
    completed: false,
    recurring: 'none',
    itemType: 'task',
  },
  {
    id: 'rem-9',
    title: 'Nature park stroll',
    emoji: '🚶',
    time: '09:00 AM',
    date: '2026-10-20',
    completed: false,
    recurring: 'none',
    itemType: 'task',
  },
  {
    id: 'rem-10',
    title: 'Water patio plants',
    emoji: '🪴',
    time: '05:00 PM',
    date: '2026-10-21',
    completed: false,
    recurring: 'weekly',
    itemType: 'routine',
  },
];
