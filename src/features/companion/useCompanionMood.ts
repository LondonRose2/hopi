import { useState, useCallback, useMemo, useEffect } from 'react';
import type { MochiState } from './MochiAvatar';
import { calculateHydrationStatus, isWaterReminder } from '../../domain/reminders/hydration';
import {
  type WaterHistory,
  DEFAULT_DAILY_WATER_GOAL,
  getWaterForDate,
  addWaterLog,
  setWaterLog,
  getTodayDateString,
} from '../../domain/reminders/waterTracker';
import { floatingOverlayService } from '../../services/nativeOverlay';
import { companionPhrases } from '../../domain/companion/phrases';
import type { Reminder } from '../reminders/types';

const WATER_STORAGE_KEY = 'hopi_last_water_time';
const WATER_HISTORY_KEY = 'hopi_water_history';
const WATER_GOAL_KEY = 'hopi_water_goal';

export function useCompanionMood(
  reminders: Reminder[],
  onCheer?: () => void,
  companionName = 'Mochi',
  onWaterLogged?: (newCount: number) => void
) {
  const [overrideState, setOverrideState] = useState<MochiState | null>(null);
  const [customPhrase, setCustomPhrase] = useState<string | null>(null);
  const [isManualAwake, setIsManualAwake] = useState(false);
  const [lastWaterTime, setLastWaterTime] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(WATER_STORAGE_KEY);
      if (saved) return Number(saved);
    } catch {}
    const cal = new Date();
    cal.setHours(8, 0, 0, 0);
    return cal.getTime() <= Date.now() ? cal.getTime() : cal.getTime() - 86400000;
  });

  const [waterHistory, setWaterHistory] = useState<WaterHistory>(() => {
    try {
      const saved = localStorage.getItem(WATER_HISTORY_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  const [dailyWaterGoal, setDailyWaterGoal] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(WATER_GOAL_KEY);
      if (saved) return Number(saved);
    } catch {}
    return DEFAULT_DAILY_WATER_GOAL;
  });

  const todayDateStr = getTodayDateString();
  const todayWaterCount = useMemo(
    () => getWaterForDate(waterHistory, todayDateStr),
    [waterHistory, todayDateStr]
  );

  useEffect(() => {
    const syncNative = async () => {
      const nativeTime = await floatingOverlayService.getLastWaterTime();
      if (nativeTime > 0) {
        setLastWaterTime((prev) => (nativeTime > prev ? nativeTime : prev));
      }
    };
    syncNative();
    window.addEventListener('focus', syncNative);
    return () => window.removeEventListener('focus', syncNative);
  }, []);

  const isRestHours = useMemo(() => new Date().getHours() < 8, []);

  const hasOverdueWater = useMemo(() => {
    const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
    return reminders.some((r) => {
      if (r.completed || !isWaterReminder(r.title, r.emoji)) return false;
      const match = r.time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
      if (!match) return false;
      let h = parseInt(match[1], 10);
      const m = parseInt(match[2], 10);
      if (match[3]?.toUpperCase() === 'PM' && h < 12) h += 12;
      if (match[3]?.toUpperCase() === 'AM' && h === 12) h = 0;
      return (h * 60 + m) <= (nowMinutes - 30);
    });
  }, [reminders]);

  const { hydrationLevel, hoursSinceDrink } = useMemo(
    () => calculateHydrationStatus(lastWaterTime, Date.now()),
    [lastWaterTime]
  );

  const baseMood: MochiState = useMemo(() => {
    if (isRestHours && !isManualAwake) return 'sleep';
    if (hydrationLevel === 'dehydrated') return 'sleep';
    if (hydrationLevel === 'thirsty' || hasOverdueWater) return 'sad';
    return 'idle';
  }, [isRestHours, isManualAwake, hydrationLevel, hasOverdueWater]);

  const currentMood = overrideState ?? baseMood;

  const statusText = useMemo(() => {
    if (customPhrase) return customPhrase;
    if (currentMood === 'sleep') {
      return isRestHours && !isManualAwake
        ? 'Resting quietly for the night 🌙'
        : 'Tired from low hydration. Tap 💧 to water!';
    }
    if (currentMood === 'sad') return 'Thirsty & drooping. Tap 💧 to water!';
    if (currentMood === 'cheer') return 'Water logged! Happy and hydrated 💧';
    if (currentMood === 'wave') return 'Ready when you are. 🌿';
    return companionPhrases.getPhrase(hoursSinceDrink, isRestHours, new Date().getHours(), companionName);
  }, [customPhrase, currentMood, isRestHours, isManualAwake, hoursSinceDrink, companionName]);

  const recordWater = useCallback((amount: number = 1) => {
    const now = Date.now();
    setLastWaterTime(now);
    try { localStorage.setItem(WATER_STORAGE_KEY, String(now)); } catch {}

    const todayKey = getTodayDateString();
    let updatedCount = 1;
    setWaterHistory((prev) => {
      const next = addWaterLog(prev, todayKey, amount);
      try { localStorage.setItem(WATER_HISTORY_KEY, JSON.stringify(next)); } catch {}
      updatedCount = getWaterForDate(next, todayKey);
      if (updatedCount >= dailyWaterGoal && getWaterForDate(prev, todayKey) < dailyWaterGoal) {
        setCustomPhrase(`Goal reached! ${updatedCount}/${dailyWaterGoal} glasses today ✨`);
      } else {
        setCustomPhrase(`Water logged! ${updatedCount}/${dailyWaterGoal} glasses today 💧`);
      }
      return next;
    });

    setOverrideState('cheer');
    onCheer?.();
    floatingOverlayService.recordWaterIntake();
    onWaterLogged?.(updatedCount);
    setTimeout(() => { setOverrideState(null); setCustomPhrase(null); }, 3200);
  }, [onCheer, onWaterLogged, dailyWaterGoal]);

  const updateDailyGoal = useCallback((goal: number) => {
    const safe = Math.max(1, Math.min(24, Math.round(goal)));
    setDailyWaterGoal(safe);
    try { localStorage.setItem(WATER_GOAL_KEY, String(safe)); } catch {}
  }, []);

  const updateTodayWater = useCallback((glasses: number) => {
    const todayKey = getTodayDateString();
    setWaterHistory((prev) => {
      const next = setWaterLog(prev, todayKey, glasses);
      try { localStorage.setItem(WATER_HISTORY_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const interactMochi = useCallback(() => {
    if (hydrationLevel !== 'hydrated' || hasOverdueWater) {
      recordWater(1);
      return;
    }
    if (currentMood === 'sleep') {
      setIsManualAwake(true);
      setOverrideState('wave');
      setCustomPhrase('Active. Ready to assist. 🌿');
      setTimeout(() => { setOverrideState(null); setCustomPhrase(null); }, 2500);
      setTimeout(() => setIsManualAwake(false), 60000);
      return;
    }
    setOverrideState('wave');
    const phrase = companionPhrases.getPhrase(hoursSinceDrink, isRestHours, new Date().getHours(), companionName);
    setCustomPhrase(phrase);
    setTimeout(() => { setOverrideState(null); setCustomPhrase(null); }, 3500);
  }, [currentMood, hydrationLevel, hasOverdueWater, recordWater, hoursSinceDrink, isRestHours, companionName]);

  return {
    currentMood,
    statusText,
    hydrationLevel,
    todayWaterCount,
    dailyWaterGoal,
    waterHistory,
    recordWater,
    interactMochi,
    updateDailyGoal,
    updateTodayWater,
  };
}
