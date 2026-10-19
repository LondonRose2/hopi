// Voice Parser Domain Logic: Speech intent, Task vs Routine classification, date/time extraction, and slot clarification

import type { ItemType, RecurringType } from '../../features/reminders/types';

export interface ParsedVoiceReminder {
  rawTranscript: string;
  itemType: ItemType;
  title: string;
  emoji: string;
  time: string | null;      // e.g. "08:00 PM"
  date: string | null;      // e.g. "2026-10-19"
  recurring: RecurringType;
  repeatIntervalHours?: number;
  isComplete: boolean;
  missingField?: 'time' | 'title' | null;
  clarificationPrompt?: string | null;
}

const ROUTINE_KEYWORDS = [
  'every', 'each', 'daily', 'routine', 'weekdays', 'weekly', 'repeat', 'regularly',
  'every day', 'every month', 'every week', 'every morning', 'every evening', 'every night',
  'every monday', 'every tuesday', 'every wednesday', 'every thursday', 'every friday', 'every saturday', 'every sunday'
];

export function classifyItemType(transcript: string): { itemType: ItemType; recurring: RecurringType; repeatIntervalHours?: number } {
  const lower = transcript.toLowerCase();
  const hourlyMatch = lower.match(/\bevery\s+(\d+)?\s*(?:hour|hours|hr|hrs)\b/);
  if (hourlyMatch) {
    const hours = hourlyMatch[1] ? parseInt(hourlyMatch[1], 10) : 1;
    return { itemType: 'routine', recurring: 'hourly', repeatIntervalHours: hours };
  }

  const isRoutine = ROUTINE_KEYWORDS.some((kw) => lower.includes(kw));

  if (!isRoutine) {
    return { itemType: 'task', recurring: 'none' };
  }

  if (lower.includes('weekday') || lower.includes('week day')) {
    return { itemType: 'routine', recurring: 'weekdays' };
  }
  if (lower.includes('weekly') || lower.includes('every week') || /every (monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i.test(lower)) {
    return { itemType: 'routine', recurring: 'weekly' };
  }
  return { itemType: 'routine', recurring: 'daily' };
}

export function isWaterIntakePhrase(transcript: string): boolean {
  if (!transcript) return false;
  const lower = transcript.toLowerCase().trim();
  return (
    /\b(drank|drunk|drink|had|finished|logged)\b.*\b(water|hydration|glass of water|bottle)\b/i.test(lower) ||
    /\b(water|hydration)\b.*\b(done|checked|finished|logged)\b/i.test(lower) ||
    lower === 'i drank water' ||
    lower === 'drank water' ||
    lower === 'had water' ||
    lower === 'water intake' ||
    lower === 'log water' ||
    lower === 'drink water'
  );
}

export function inferEmoji(title: string): string {
  const t = title.toLowerCase();
  if (/water|hydrate|hydration|drink/i.test(t)) return '💧';
  if (/pill|medicine|vitamin|supplement/i.test(t)) return '💊';
  if (/pray|prayer|verse|bible|devotion|meditat/i.test(t)) return '🙏';
  if (/read|book|study|chapter/i.test(t)) return '📚';
  if (/call|phone|ring/i.test(t)) return '📞';
  if (/package|mail|letter|delivery|amazon|pickup|pick up/i.test(t)) return '📦';
  if (/clean|laundry|tidy|sweep|wash|dishes/i.test(t)) return '🧹';
  if (/walk|run|exercise|workout|gym|stretch/i.test(t)) return '🏃';
  if (/sleep|bed|rest|nap/i.test(t)) return '🛌';
  if (/grocery|store|shopping|buy|market/i.test(t)) return '🛒';
  if (/bill|receipt|pay|tax|bank/i.test(t)) return '📝';
  return '⏰';
}

export function parseVoiceTime(transcript: string): string | null {
  const lower = transcript.toLowerCase();

  // Exact time: e.g. "8:30 pm", "8:30pm", "8 pm", "8pm", "8:00 AM", "8 o'clock"
  const timeRegex = /(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm|o'clock)?\b/i;
  const match = lower.match(timeRegex);

  if (match) {
    let hour = parseInt(match[1], 10);
    const minute = match[2] ? match[2].padStart(2, '0') : '00';
    let meridiem = match[3]?.toUpperCase();

    if (hour >= 1 && hour <= 24) {
      if (meridiem === "O'CLOCK" || !meridiem) {
        // If unspecified, assume PM if hour between 1 and 7, else AM or PM based on contextual words
        if (lower.includes('tonight') || lower.includes('evening') || lower.includes('afternoon') || (hour >= 1 && hour <= 7)) {
          meridiem = 'PM';
        } else {
          meridiem = 'AM';
        }
      }
      if (hour > 12) {
        hour -= 12;
        meridiem = 'PM';
      }
      return `${hour.toString().padStart(2, '0')}:${minute} ${meridiem}`;
    }
  }

  // Broad natural keywords
  if (lower.includes('noon')) return '12:00 PM';
  if (lower.includes('midnight')) return '12:00 AM';
  if (lower.includes('morning')) return '09:00 AM';
  if (lower.includes('afternoon')) return '02:00 PM';
  if (lower.includes('evening')) return '07:00 PM';
  if (lower.includes('night') || lower.includes('tonight')) return '08:30 PM';

  return null;
}

export function parseVoiceDate(transcript: string, now: Date = new Date()): string | null {
  const lower = transcript.toLowerCase();
  const year = now.getFullYear();

  if (lower.includes('tomorrow')) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const m = (tomorrow.getMonth() + 1).toString().padStart(2, '0');
    const d = tomorrow.getDate().toString().padStart(2, '0');
    return `${tomorrow.getFullYear()}-${m}-${d}`;
  }

  if (lower.includes('today') || lower.includes('tonight') || lower.includes('this afternoon') || lower.includes('this evening')) {
    const m = (now.getMonth() + 1).toString().padStart(2, '0');
    const d = now.getDate().toString().padStart(2, '0');
    return `${year}-${m}-${d}`;
  }

  // Day of week (e.g. "on Tuesday", "next Friday")
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  for (let i = 0; i < days.length; i++) {
    if (lower.includes(days[i])) {
      const currentDay = now.getDay();
      let diff = i - currentDay;
      if (diff <= 0 || lower.includes('next ' + days[i])) diff += 7;
      const target = new Date(now);
      target.setDate(target.getDate() + diff);
      const m = (target.getMonth() + 1).toString().padStart(2, '0');
      const d = target.getDate().toString().padStart(2, '0');
      return `${target.getFullYear()}-${m}-${d}`;
    }
  }

  // Default to today if not a forward date
  const m = (now.getMonth() + 1).toString().padStart(2, '0');
  const d = now.getDate().toString().padStart(2, '0');
  return `${year}-${m}-${d}`;
}

export function cleanTitle(transcript: string): string {
  let cleaned = transcript
    .replace(/^(?:remind me to|remind me|set a reminder to|set a reminder for|don't forget to|schedule a routine to|add a task to|create a task to|add routine to|remember to)\s+/i, '')
    .replace(/\b(?:every month|every day|every week|every morning|every evening|daily|weekly|weekdays)\b/gi, '')
    .replace(/\b(?:every \d+\s*(?:hours|hour|hrs|hr)|every hour)\b/gi, '')
    .replace(/\b(?:on the (?:first|second|third|fourth|last)|rotary)\b/gi, '')
    .replace(/\b(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi, '')
    .replace(/\b(?:tomorrow|today|tonight|next week|at \d{1,2}(?::\d{2})?\s*(?:am|pm|o'clock)?)\b/gi, '')
    .replace(/\b(?:in the morning|in the afternoon|in the evening|at noon|at midnight)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Strip leading connectors like "to ", "for ", "on "
  cleaned = cleaned.replace(/^(?:to|for|on)\s+/i, '').trim();

  if (!cleaned) return 'Gentle Reminder';
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export function parseVoiceInput(transcript: string, now: Date = new Date()): ParsedVoiceReminder {
  const trimmed = transcript.trim();
  const { itemType, recurring, repeatIntervalHours } = classifyItemType(trimmed);
  let time = parseVoiceTime(trimmed);
  const date = parseVoiceDate(trimmed, now);
  const title = cleanTitle(trimmed);
  const emoji = inferEmoji(title);

  if (recurring === 'hourly' && !time) {
    const nextH = (now.getHours() + 1) % 24;
    const meridiem = nextH >= 12 ? 'PM' : 'AM';
    const displayH = nextH % 12 || 12;
    time = `${displayH.toString().padStart(2, '0')}:00 ${meridiem}`;
  }

  const isMissingTime = !time;
  const isMissingTitle = !title || title === 'Gentle Reminder';

  let missingField: 'time' | 'title' | null = null;
  let clarificationPrompt: string | null = null;

  if (isMissingTime) {
    missingField = 'time';
    clarificationPrompt = `What time should I remind you about ${title}?`;
  } else if (isMissingTitle) {
    missingField = 'title';
    clarificationPrompt = `What would you like me to remind you to do?`;
  }

  return {
    rawTranscript: trimmed,
    itemType,
    title,
    emoji,
    time,
    date,
    recurring,
    repeatIntervalHours,
    isComplete: !isMissingTime && !isMissingTitle,
    missingField,
    clarificationPrompt,
  };
}

export function fillClarification(
  pending: ParsedVoiceReminder,
  answer: string,
  now: Date = new Date()
): ParsedVoiceReminder {
  const updated = { ...pending };
  if (pending.missingField === 'time') {
    const time = parseVoiceTime(answer);
    if (time) {
      updated.time = time;
      updated.missingField = null;
      updated.clarificationPrompt = null;
      updated.isComplete = true;
    }
    // Also check if they specified a date in the clarification
    const date = parseVoiceDate(answer, now);
    if (date) updated.date = date;
  } else if (pending.missingField === 'title') {
    const title = cleanTitle(answer);
    if (title && title !== 'Gentle Reminder') {
      updated.title = title;
      updated.emoji = inferEmoji(title);
      updated.missingField = null;
      updated.clarificationPrompt = null;
      updated.isComplete = true;
    }
  }
  return updated;
}
