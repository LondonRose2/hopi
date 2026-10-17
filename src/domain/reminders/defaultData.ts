import type { Reminder, Settings, BibleVerse } from './types';

export const DEFAULT_SETTINGS: Settings = {
  avatar: 'rabbit',
  sleepStart: '00:00',
  sleepEnd: '09:00',
  encouragementsEnabled: true,
  overlayEnabled: false,
  notificationsEnabled: true,
};

export function createDefaultReminders(dateStr: string = '2026-10-18'): Reminder[] {
  return [
    {
      id: 'default-water',
      title: 'Drink a glass of water',
      emoji: '💧',
      time: '09:30',
      date: dateStr,
      completed: false,
      category: 'water',
      recurring: 'daily',
    },
    {
      id: 'default-walk',
      title: 'Gentle stroll or stretch',
      emoji: '🚶',
      time: '12:30',
      date: dateStr,
      completed: false,
      category: 'walk',
      recurring: 'daily',
    },
    {
      id: 'default-rest',
      title: 'Mindful pause & cup of tea',
      emoji: '☕',
      time: '15:30',
      date: dateStr,
      completed: false,
      category: 'rest',
      recurring: 'daily',
    },
    {
      id: 'default-scripture',
      title: 'Scripture reading & quiet prayer',
      emoji: '📖',
      time: '20:30',
      date: dateStr,
      completed: false,
      category: 'scripture',
      recurring: 'daily',
    },
  ];
}

export const DEFAULT_REMINDERS: Reminder[] = createDefaultReminders('2026-10-18');

export const UPLIFTING_VERSES: BibleVerse[] = [
  {
    id: 'phil-4-6-7',
    reference: 'Philippians 4:6-7',
    text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds.',
    theme: 'Peace',
  },
  {
    id: 'matt-11-28',
    reference: 'Matthew 11:28',
    text: 'Come to me, all you who are weary and burdened, and I will give you rest.',
    theme: 'Rest',
  },
  {
    id: 'isa-40-31',
    reference: 'Isaiah 40:31',
    text: 'Those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.',
    theme: 'Strength',
  },
  {
    id: 'psalm-23-1-3',
    reference: 'Psalm 23:1-3',
    text: 'The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.',
    theme: 'Comfort',
  },
  {
    id: 'jer-29-11',
    reference: 'Jeremiah 29:11',
    text: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.',
    theme: 'Hope',
  },
  {
    id: 'prov-3-5-6',
    reference: 'Proverbs 3:5-6',
    text: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',
    theme: 'Trust',
  },
  {
    id: 'josh-1-9',
    reference: 'Joshua 1:9',
    text: 'Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.',
    theme: 'Courage',
  },
  {
    id: 'psalm-46-10',
    reference: 'Psalm 46:10',
    text: 'Be still, and know that I am God.',
    theme: 'Stillness',
  },
  {
    id: 'zeph-3-17',
    reference: 'Zephaniah 3:17',
    text: 'The Lord your God is with you, the Mighty Warrior who saves. He will take great delight in you; in his love he will no longer rebuke you, but will rejoice over you with singing.',
    theme: 'Love',
  },
  {
    id: 'rom-15-13',
    reference: 'Romans 15:13',
    text: 'May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.',
    theme: 'Joy',
  },
];

/**
 * Returns a deterministic verse for any given date string (YYYY-MM-DD).
 */
export function getVerseForDate(dateStr: string): BibleVerse {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % UPLIFTING_VERSES.length;
  return UPLIFTING_VERSES[index];
}
