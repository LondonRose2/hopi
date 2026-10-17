export type RecurringType = 'none' | 'daily' | 'weekdays' | 'weekly';

export interface Reminder {
  id: string;
  title: string;
  emoji: string;
  time: string; // e.g. "09:00 AM"
  date: string; // ISO "YYYY-MM-DD"
  completed: boolean;
  recurring?: RecurringType;
}

export const EMOJI_OPTIONS = ['💧', '🚶', '☕', '📖', '🧘', '💊', '🍎'] as const;

export const INITIAL_REMINDERS: Reminder[] = [
  {
    id: 'rem-1',
    title: 'Morning glass of water',
    emoji: '💧',
    time: '08:30 AM',
    date: '2026-10-18',
    completed: false,
    recurring: 'daily',
  },
  {
    id: 'rem-2',
    title: 'Breathe & gentle stretch',
    emoji: '🧘',
    time: '10:00 AM',
    date: '2026-10-18',
    completed: false,
    recurring: 'daily',
  },
  {
    id: 'rem-3',
    title: 'Mindful herbal tea break',
    emoji: '☕',
    time: '02:00 PM',
    date: '2026-10-18',
    completed: false,
    recurring: 'weekdays',
  },
  {
    id: 'rem-4',
    title: 'Afternoon sunshine walk',
    emoji: '🚶',
    time: '04:30 PM',
    date: '2026-10-18',
    completed: false,
    recurring: 'daily',
  },
  {
    id: 'rem-5',
    title: 'Evening quiet reading',
    emoji: '📖',
    time: '08:45 PM',
    date: '2026-10-18',
    completed: false,
    recurring: 'daily',
  },
  {
    id: 'rem-6',
    title: 'Nightly vitamins & magnesium',
    emoji: '💊',
    time: '10:00 PM',
    date: '2026-10-18',
    completed: false,
    recurring: 'daily',
  },
  // Upcoming tasks for dates after today
  {
    id: 'rem-7',
    title: 'Weekly grocery basket',
    emoji: '🍎',
    time: '10:30 AM',
    date: '2026-10-19',
    completed: false,
    recurring: 'weekly',
  },
  {
    id: 'rem-8',
    title: 'Reflect & journal prayer notes',
    emoji: '📖',
    time: '07:00 PM',
    date: '2026-10-19',
    completed: false,
    recurring: 'none',
  },
  {
    id: 'rem-9',
    title: 'Nature park stroll',
    emoji: '🚶',
    time: '09:00 AM',
    date: '2026-10-20',
    completed: false,
    recurring: 'none',
  },
  {
    id: 'rem-10',
    title: 'Water patio plants',
    emoji: '💧',
    time: '05:00 PM',
    date: '2026-10-21',
    completed: false,
    recurring: 'weekly',
  },
];
