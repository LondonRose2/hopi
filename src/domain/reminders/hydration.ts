export type HydrationLevel = 'hydrated' | 'thirsty' | 'dehydrated';

export interface HydrationCalculationResult {
  hoursSinceDrink: number;
  hydrationLevel: HydrationLevel;
}

/**
 * Calculates hydration status based on elapsed time since last water intake.
 * - < 2.5 hours: fully hydrated
 * - 2.5h - 4.0h: thirsty (companion looks sad)
 * - >= 4.0h: dehydrated / exhausted (companion sleeps / low energy)
 */
export function calculateHydrationStatus(
  lastDrinkTimeMs: number,
  currentTimeMs: number = Date.now()
): HydrationCalculationResult {
  if (lastDrinkTimeMs <= 0 || Number.isNaN(lastDrinkTimeMs)) {
    return { hoursSinceDrink: 4.5, hydrationLevel: 'dehydrated' };
  }

  const elapsedMs = Math.max(0, currentTimeMs - lastDrinkTimeMs);
  const hoursSinceDrink = Math.round((elapsedMs / (1000 * 60 * 60)) * 10) / 10;

  if (hoursSinceDrink < 2.5) {
    return { hoursSinceDrink, hydrationLevel: 'hydrated' };
  }
  if (hoursSinceDrink < 4.0) {
    return { hoursSinceDrink, hydrationLevel: 'thirsty' };
  }
  return { hoursSinceDrink, hydrationLevel: 'dehydrated' };
}

/**
 * Checks whether a reminder item represents water / hydration intake.
 */
export function isWaterReminder(title: string, emoji: string): boolean {
  if (emoji === '💧' || emoji === '🍵') return true;
  const lower = title.toLowerCase();
  return (
    lower.includes('water') ||
    lower.includes('hydrate') ||
    lower.includes('hydration') ||
    lower.includes('drink')
  );
}

export interface CompanionStateInput {
  isRestHours: boolean;
  isManualAwake?: boolean;
  hydrationLevel: HydrationLevel;
  hasOverdueWaterReminder?: boolean;
}

export type ComputedCompanionMood = 'idle' | 'sleep' | 'sad';

/**
 * Determines Mochi's baseline mood/animation based on sleep hours and hydration.
 * Invariants:
 * 1. Rest hours put Mochi to sleep unless explicitly moved (manual awake).
 * 2. Severe dehydration (>=4h without water) causes Mochi to sleep / doze off from lack of energy.
 * 3. Mild dehydration (thirsty) or overdue water reminders make Mochi look sad.
 * 4. Otherwise, Mochi is happy and idle.
 */
export function computeCompanionMood({
  isRestHours,
  isManualAwake = false,
  hydrationLevel,
  hasOverdueWaterReminder = false,
}: CompanionStateInput): ComputedCompanionMood {
  if (isRestHours && !isManualAwake) {
    return 'sleep';
  }

  if (hydrationLevel === 'dehydrated') {
    return 'sleep';
  }

  if (hydrationLevel === 'thirsty' || hasOverdueWaterReminder) {
    return 'sad';
  }

  return 'idle';
}
