import { useState, useCallback, useMemo } from 'react';
import type { MochiState } from './MochiAvatar';
import { calculateHydrationStatus, isWaterReminder } from '../../domain/reminders/hydration';
import { floatingOverlayService } from '../../services/nativeOverlay';
import { companionPhrases } from '../../domain/companion/phrases';
import type { Reminder } from '../reminders/types';

const WATER_STORAGE_KEY = 'hopi_last_water_time';

export function useCompanionMood(reminders: Reminder[], onCheer?: () => void, companionName = 'Mochi') {
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
        ? `${companionName} is sleeping peacefully 🌙`
        : `${companionName} is sleeping from dehydration 💧😴`;
    }
    if (currentMood === 'sad') return `${companionName} is thirsty... Remember to hydrate 💧`;
    if (currentMood === 'cheer') return `${companionName} is energized and happy! ✨💧`;
    if (currentMood === 'wave') return 'Hello friend! 🐰✨';
    return companionPhrases.getPhrase(hoursSinceDrink, isRestHours, new Date().getHours(), companionName);
  }, [customPhrase, currentMood, isRestHours, isManualAwake, hoursSinceDrink, companionName]);

  const recordWater = useCallback(() => {
    const now = Date.now();
    setLastWaterTime(now);
    try { localStorage.setItem(WATER_STORAGE_KEY, String(now)); } catch {}
    setOverrideState('cheer');
    setCustomPhrase('Ah, refreshing! Thank you for hydrating! 💧✨');
    onCheer?.();
    floatingOverlayService.recordWaterIntake();
    setTimeout(() => { setOverrideState(null); setCustomPhrase(null); }, 3500);
  }, [onCheer]);

  const interactMochi = useCallback(() => {
    if (currentMood === 'sleep') {
      setIsManualAwake(true);
      setOverrideState('wave');
      setCustomPhrase(`${companionName} woke up to greet you! 🐰✨`);
      setTimeout(() => { setOverrideState(null); setCustomPhrase(null); }, 2500);
      // Auto-return to sleep after ~1 minute of inactivity during rest hours
      setTimeout(() => setIsManualAwake(false), 60000);
      return;
    }
    if (currentMood === 'sad' || hydrationLevel !== 'hydrated') {
      recordWater();
      return;
    }
    setOverrideState('wave');
    const phrase = companionPhrases.getPhrase(hoursSinceDrink, isRestHours, new Date().getHours(), companionName);
    setCustomPhrase(phrase);
    setTimeout(() => { setOverrideState(null); setCustomPhrase(null); }, 3500);
  }, [currentMood, hydrationLevel, recordWater, hoursSinceDrink, isRestHours, companionName]);

  return { currentMood, statusText, hydrationLevel, recordWater, interactMochi };
}
