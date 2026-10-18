import { useState, useEffect, useCallback } from 'react';
import { INITIAL_REMINDERS, type Reminder } from './types';
import { floatingOverlayService } from '../../services/nativeOverlay';

const STORAGE_KEY = 'hopi_reminders';

export function useReminders(onCheer?: () => void) {
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
    } catch {
      return INITIAL_REMINDERS;
    }
  });

  const persist = useCallback((list: Reminder[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {}
  }, []);

  // Sync scheduled reminders and request notification permission on mount
  useEffect(() => {
    floatingOverlayService.requestNotificationPermission();
    reminders.forEach((r) => {
      if (!r.completed) {
        floatingOverlayService.scheduleReminder(r);
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggle = useCallback((id: string) => {
    setReminders((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r));
      persist(updated);
      const target = updated.find((r) => r.id === id);
      if (target?.completed) {
        onCheer?.();
        if (target.emoji === '💧' || target.emoji === '🍵' || target.title.toLowerCase().includes('water')) {
          localStorage.setItem('hopi_last_water_time', String(Date.now()));
          floatingOverlayService.recordWaterIntake();
        } else {
          floatingOverlayService.showSpeechBubble(`Great job! ✨ ${target.title}`);
        }
        floatingOverlayService.cancelReminder(id);
      } else if (target && !target.completed) {
        floatingOverlayService.scheduleReminder(target);
      }
      return updated;
    });
  }, [persist, onCheer]);

  const handleSave = useCallback((item: Reminder) => {
    setReminders((prev) => {
      const idx = prev.findIndex((r) => r.id === item.id);
      const updated = idx >= 0 ? prev.map((r) => (r.id === item.id ? item : r)) : [item, ...prev];
      persist(updated);
      return updated;
    });
    floatingOverlayService.scheduleReminder(item);
    floatingOverlayService.showSpeechBubble(`Saved: ${item.emoji} ${item.title} 💧`);
  }, [persist]);

  const handleDelete = useCallback((id: string) => {
    setReminders((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      persist(updated);
      return updated;
    });
    floatingOverlayService.cancelReminder(id);
  }, [persist]);

  return {
    reminders,
    handleToggle,
    handleSave,
    handleDelete,
  };
}
