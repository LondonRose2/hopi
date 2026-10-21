export type AvatarId = 'mochi' | 'pip' | 'snowdrop';
export type AvatarChoice = AvatarId | 'rabbit' | 'penguin';

export interface AppSettings {
  avatarChoice: AvatarChoice;
  sleepStart: string;
  sleepEnd: string;
  encouragements: boolean;
  notifications: boolean;
  floatingCompanion: boolean;
  showHabitOnAvatar: boolean;
  showOverdueAlertDot: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  avatarChoice: 'mochi',
  sleepStart: '12:00 AM',
  sleepEnd: '09:00 AM',
  encouragements: true,
  notifications: true,
  floatingCompanion: true,
  showHabitOnAvatar: true,
  showOverdueAlertDot: true,
};

export function normalizeAvatar(choice?: string): AvatarId {
  if (choice === 'penguin' || choice === 'pip') return 'pip';
  if (choice === 'snowdrop') return 'snowdrop';
  return 'mochi';
}

export function getCompanionName(choice?: string): string {
  const norm = normalizeAvatar(choice);
  if (norm === 'pip') return 'Pip';
  if (norm === 'snowdrop') return 'Snowdrop';
  return 'Mochi';
}
