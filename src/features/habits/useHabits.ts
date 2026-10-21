import { useState, useCallback, useMemo, useEffect } from 'react';
import type { Habit } from '../../domain/habits/types';
import {
  toggleHabitDate,
  calculateHabitProgress,
  getTodayIsoString,
  isHabitScheduledForToday,
} from '../../domain/habits/habitStreak';
import { floatingOverlayService } from '../../services/nativeOverlay';

const HABITS_STORAGE_KEY = 'hopi_habits';

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit-1',
    title: 'Morning Sunshine & Stretch',
    emoji: '🧘',
    time: '08:00 AM',
    cadence: 'daily',
    targetDays: 60,
    completedDates: ['2026-10-19', '2026-10-20', '2026-10-21'],
    startDate: '2026-10-19',
    status: 'active',
    createdAt: Date.now() - 3 * 86400000,
  },
  {
    id: 'habit-2',
    title: 'Mindful Reading & Reflection',
    emoji: '📖',
    time: '08:30 PM',
    cadence: 'daily',
    targetDays: 60,
    completedDates: ['2026-10-20', '2026-10-21'],
    startDate: '2026-10-20',
    status: 'active',
    createdAt: Date.now() - 2 * 86400000,
  },
];

export function useHabits(onCheer?: () => void) {
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem(HABITS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_HABITS;
    } catch {
      return INITIAL_HABITS;
    }
  });

  const persist = useCallback((list: Habit[]) => {
    try {
      localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(list));
    } catch {}
  }, []);

  // Schedule native alarms for all active habits
  useEffect(() => {
    habits.forEach((h) => {
      if (h.status === 'active') {
        const todayStr = getTodayIsoString();
        const progress = calculateHabitProgress(h, todayStr);
        if (!progress.isCompletedToday && isHabitScheduledForToday(h)) {
          floatingOverlayService.scheduleReminder({
            id: `hbt-${h.id}`,
            title: `Habit: ${h.title}`,
            emoji: h.emoji,
            time: h.time,
            date: todayStr,
            recurring: h.cadence,
          });
        }
      }
    });
  }, [habits]);

  const handleToggleHabit = useCallback((id: string) => {
    const todayStr = getTodayIsoString();
    setHabits((prev) => {
      const target = prev.find((h) => h.id === id);
      if (!target) return prev;

      const wasCompleted = target.completedDates.includes(todayStr);
      const updatedHabit = toggleHabitDate(target, todayStr);
      const updatedList = prev.map((h) => (h.id === id ? updatedHabit : h));
      persist(updatedList);

      if (!wasCompleted) {
        onCheer?.();
        const progress = calculateHabitProgress(updatedHabit, todayStr);
        if (progress.isAchieved) {
          floatingOverlayService.showSpeechBubble(`🏆 Habit Achieved! ${updatedHabit.title} completed! ✨`);
        } else {
          floatingOverlayService.showSpeechBubble(`Great job! Day ${progress.totalCompletedDays} of ${progress.targetDays} 🌿`);
        }
        floatingOverlayService.cancelReminder(`hbt-${id}`);
      }
      return updatedList;
    });
  }, [persist, onCheer]);

  const handleSaveHabit = useCallback((item: Habit) => {
    setHabits((prev) => {
      const idx = prev.findIndex((h) => h.id === item.id);
      const updated = idx >= 0 ? prev.map((h) => (h.id === item.id ? item : h)) : [item, ...prev];
      persist(updated);
      return updated;
    });
    floatingOverlayService.showSpeechBubble(`Habit set: ${item.emoji} ${item.title} (${item.targetDays}d) ✨`);
  }, [persist]);

  const handleDeleteHabit = useCallback((id: string) => {
    setHabits((prev) => {
      const updated = prev.filter((h) => h.id !== id);
      persist(updated);
      return updated;
    });
    floatingOverlayService.cancelReminder(`hbt-${id}`);
  }, [persist]);

  const activeHabits = useMemo(() => habits.filter((h) => h.status === 'active'), [habits]);
  const achievedHabits = useMemo(() => habits.filter((h) => h.status === 'achieved'), [habits]);

  // Primary active habit for the sub-avatar indicator
  const primaryHabit = useMemo(() => {
    if (activeHabits.length === 0) return null;
    const todayStr = getTodayIsoString();
    // Prioritize one that is not completed today, else first active
    const pending = activeHabits.find((h) => !h.completedDates.includes(todayStr));
    return pending || activeHabits[0];
  }, [activeHabits]);

  return {
    habits,
    activeHabits,
    achievedHabits,
    primaryHabit,
    handleToggleHabit,
    handleSaveHabit,
    handleDeleteHabit,
  };
}
