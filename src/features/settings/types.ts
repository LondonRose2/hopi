export interface AppSettings {
  avatarChoice: 'rabbit' | 'penguin';
  sleepStart: string;
  sleepEnd: string;
  encouragements: boolean;
  notifications: boolean;
  floatingCompanion: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  avatarChoice: 'rabbit',
  sleepStart: '12:00 AM',
  sleepEnd: '09:00 AM',
  encouragements: true,
  notifications: true,
  floatingCompanion: true,
};
