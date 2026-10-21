import { registerPlugin, Capacitor } from '@capacitor/core';

interface FloatingMochiPlugin {
  isOverlayPermissionGranted(): Promise<{ granted: boolean }>;
  requestOverlayPermission(): Promise<{ requested: boolean; alreadyGranted?: boolean }>;
  requestNotificationPermission(): Promise<{ granted: boolean }>;
  isAudioPermissionGranted(): Promise<{ granted: boolean }>;
  requestAudioPermission(): Promise<{ granted: boolean }>;
  requestAppPermissions(): Promise<{ requested: boolean; audioGranted?: boolean }>;
  startOverlay(): Promise<{ success: boolean; reason?: string; error?: string }>;
  stopOverlay(): Promise<{ success: boolean; error?: string }>;
  scheduleReminder(options: { id: string; title: string; emoji: string; triggerAtMillis: number }): Promise<{ scheduled: boolean }>;
  cancelReminder(options: { id: string }): Promise<{ cancelled: boolean }>;
  showSpeechBubble(options: { text: string }): Promise<{ shown: boolean }>;
  recordWaterIntake(): Promise<{ recorded: boolean }>;
  getLastWaterTime(): Promise<{ lastWaterTime: number }>;
  setOverdueStatus(options: { hasOverdue: boolean }): Promise<{ saved: boolean }>;
  consumeLaunchAction(): Promise<{ action?: string | null }>;
}

const NativeFloatingMochi = registerPlugin<FloatingMochiPlugin>('FloatingMochi');

export function parseReminderTimestamp(dateStr: string, timeStr: string, recurring?: string): number {
  let hours = 9;
  let minutes = 0;
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (match) {
    hours = parseInt(match[1], 10);
    minutes = parseInt(match[2], 10);
    const ampm = match[3]?.toUpperCase();
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
  }
  const dateParts = dateStr.split('-');
  const year = parseInt(dateParts[0], 10) || new Date().getFullYear();
  const month = (parseInt(dateParts[1], 10) || 1) - 1;
  const day = parseInt(dateParts[2], 10) || new Date().getDate();

  const target = new Date(year, month, day, hours, minutes, 0, 0);
  if (recurring === 'daily' && target.getTime() <= Date.now()) {
    target.setDate(target.getDate() + 1);
  }
  return target.getTime();
}

export const floatingOverlayService = {
  isNativePlatform(): boolean {
    return Capacitor.isNativePlatform();
  },

  async isPermissionGranted(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return false;
    try {
      const res = await NativeFloatingMochi.isOverlayPermissionGranted();
      return res?.granted ?? false;
    } catch {
      return false;
    }
  },

  async requestPermission(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return false;
    try {
      const res = await NativeFloatingMochi.requestOverlayPermission();
      return res?.requested ?? false;
    } catch {
      return false;
    }
  },

  async requestNotificationPermission(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return true;
    try {
      const res = await NativeFloatingMochi.requestNotificationPermission();
      return res?.granted ?? true;
    } catch {
      return true;
    }
  },

  async isAudioPermissionGranted(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return true;
    try {
      const res = await NativeFloatingMochi.isAudioPermissionGranted();
      return res?.granted ?? false;
    } catch {
      return false;
    }
  },

  async requestAudioPermission(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return true;
    try {
      const res = await NativeFloatingMochi.requestAudioPermission();
      return res?.granted ?? false;
    } catch {
      return false;
    }
  },

  async requestAppPermissions(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return true;
    try {
      const res = await NativeFloatingMochi.requestAppPermissions();
      return res?.requested ?? false;
    } catch {
      return false;
    }
  },

  async setEnabled(enabled: boolean): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return false;
    try {
      if (enabled) {
        const res = await NativeFloatingMochi.startOverlay();
        return res?.success ?? false;
      } else {
        await NativeFloatingMochi.stopOverlay();
        return true;
      }
    } catch {
      return false;
    }
  },

  async scheduleReminder(reminder: { id: string; title: string; emoji: string; date: string; time: string; recurring?: string }): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return false;
    try {
      const triggerAtMillis = parseReminderTimestamp(reminder.date, reminder.time, reminder.recurring);
      // Never schedule alarms for times that have already passed
      if (triggerAtMillis <= Date.now() + 2000) {
        return false;
      }
      const res = await NativeFloatingMochi.scheduleReminder({
        id: reminder.id,
        title: reminder.title,
        emoji: reminder.emoji,
        triggerAtMillis,
      });
      return res?.scheduled ?? false;
    } catch {
      return false;
    }
  },

  async cancelReminder(id: string): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return false;
    try {
      const res = await NativeFloatingMochi.cancelReminder({ id });
      return res?.cancelled ?? false;
    } catch {
      return false;
    }
  },

  async showSpeechBubble(text: string): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return false;
    try {
      const res = await NativeFloatingMochi.showSpeechBubble({ text });
      return res?.shown ?? false;
    } catch {
      return false;
    }
  },

  async recordWaterIntake(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return false;
    try {
      const res = await NativeFloatingMochi.recordWaterIntake();
      return res?.recorded ?? false;
    } catch {
      return false;
    }
  },

  async getLastWaterTime(): Promise<number> {
    if (!Capacitor.isNativePlatform()) return 0;
    try {
      const res = await NativeFloatingMochi.getLastWaterTime();
      return res?.lastWaterTime ?? 0;
    } catch {
      return 0;
    }
  },

  async getPendingVoiceReminders(): Promise<any[]> {
    if (!Capacitor.isNativePlatform()) return [];
    try {
      const res = await (NativeFloatingMochi as any).getPendingVoiceReminders();
      return res?.remindersJson ? JSON.parse(res.remindersJson) : [];
    } catch {
      return [];
    }
  },

  async clearPendingVoiceReminders(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await (NativeFloatingMochi as any).clearPendingVoiceReminders();
    } catch {}
  },

  async setCompanionName(name: string): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await (NativeFloatingMochi as any).setCompanionName({ name });
    } catch {}
  },

  async setCompanionAvatar(avatar: string, name: string): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await (NativeFloatingMochi as any).setCompanionAvatar({ avatar, name });
    } catch {}
  },

  async setOverdueStatus(hasOverdue: boolean): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await (NativeFloatingMochi as any).setOverdueStatus({ hasOverdue });
    } catch {}
  },

  async consumeLaunchAction(): Promise<string | null> {
    if (!Capacitor.isNativePlatform()) return null;
    try {
      const res = await (NativeFloatingMochi as any).consumeLaunchAction();
      return res?.action ?? null;
    } catch {
      return null;
    }
  },
};

