import { useState, useEffect, useCallback } from 'react';
import { INITIAL_REMINDERS, type Reminder } from './types';
import { isWaterReminder } from '../../domain/reminders/hydration';
import { calculateNextHourlyOccurrence } from '../../domain/reminders/recurrence';
import { floatingOverlayService } from '../../services/nativeOverlay';

const STORAGE_KEY = 'hopi_reminders';

export function useReminders(onCheer?: () => void, onWaterLogged?: () => void) {
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

  // Sync scheduled reminders, ingest voice reminders, and request notification permission
  useEffect(() => {
    floatingOverlayService.requestNotificationPermission();
    reminders.forEach((r) => {
      if (!r.completed) {
        floatingOverlayService.scheduleReminder(r);
      }
    });

    const checkVoiceReminders = async () => {
      const pending = await floatingOverlayService.getPendingVoiceReminders();
      if (pending && pending.length > 0) {
        setReminders((prev) => {
          const newItems = pending.filter((p: Reminder) => !prev.some((r) => r.id === p.id));
          if (newItems.length === 0) return prev;
          const merged = [...newItems, ...prev];
          persist(merged);
          return merged;
        });
        await floatingOverlayService.clearPendingVoiceReminders();
      }
    };
    checkVoiceReminders();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggle = useCallback((id: string) => {
    setReminders((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r));
      persist(updated);
      const target = updated.find((r) => r.id === id);
      if (target?.completed) {
        onCheer?.();
        if (isWaterReminder(target.title, target.emoji)) {
          if (onWaterLogged) {
            onWaterLogged();
          } else {
            try { localStorage.setItem('hopi_last_water_time', String(Date.now())); } catch {}
            floatingOverlayService.recordWaterIntake();
          }
        }
        floatingOverlayService.cancelReminder(id);

        if (target.recurring === 'hourly') {
          const hasPendingSame = updated.some(
            (r) => !r.completed && r.title.toLowerCase() === target.title.toLowerCase() && r.recurring === 'hourly'
          );
          if (!hasPendingSame) {
            const interval = target.repeatIntervalHours || 2;
            const next = calculateNextHourlyOccurrence(target.time, target.date, interval);
            const nextItem: Reminder = {
              id: `rem-h-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`,
              title: target.title,
              emoji: target.emoji,
              time: next.time,
              date: next.date,
              completed: false,
              recurring: 'hourly',
              repeatIntervalHours: interval,
              itemType: 'routine',
            };
            const withNext = [nextItem, ...updated];
            persist(withNext);
            floatingOverlayService.scheduleReminder(nextItem);
            floatingOverlayService.showSpeechBubble(`Completed! Next at ${next.time} ⏰`);
            return withNext;
          }
        } else if (!isWaterReminder(target.title, target.emoji)) {
          floatingOverlayService.showSpeechBubble(`Great job! ✨ ${target.title}`);
        }
      } else if (target && !target.completed) {
        floatingOverlayService.scheduleReminder(target);
      }
      return updated;
    });
  }, [persist, onCheer, onWaterLogged]);

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

  const completeOverdueWaterReminders = useCallback(() => {
    setReminders((prev) => {
      let changed = false;
      const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
      const updated = prev.map((r) => {
        if (r.completed || !isWaterReminder(r.title, r.emoji)) return r;
        const match = r.time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
        if (!match) return r;
        let h = parseInt(match[1], 10);
        const m = parseInt(match[2], 10);
        if (match[3]?.toUpperCase() === 'PM' && h < 12) h += 12;
        if (match[3]?.toUpperCase() === 'AM' && h === 12) h = 0;
        if ((h * 60 + m) <= (nowMinutes + 15)) {
          changed = true;
          return { ...r, completed: true };
        }
        return r;
      });
      if (changed) persist(updated);
      return changed ? updated : prev;
    });
  }, [persist]);

  return {
    reminders,
    handleToggle,
    handleSave,
    handleDelete,
    completeOverdueWaterReminders,
  };
}
