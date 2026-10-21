import type { Habit } from '../../../domain/habits/types';
import { calculateHabitProgress } from '../../../domain/habits/habitStreak';

interface HabitEnergyPillProps {
  habit: Habit | null;
  onClick?: () => void;
}

export function HabitEnergyPill({ habit, onClick }: HabitEnergyPillProps) {
  if (!habit) return null;

  const progress = calculateHabitProgress(habit);
  const { totalCompletedDays, targetDays, percent, colorTheme, isCompletedToday, isAchieved } = progress;

  return (
    <div
      onClick={onClick}
      className="mt-1.5 flex flex-col items-center gap-1 animate-fade-in select-none cursor-pointer group"
      title={`${habit.title}: ${totalCompletedDays} of ${targetDays} days (${percent}%)`}
    >
      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/85 border border-warm-200/70 shadow-xs backdrop-blur-sm group-hover:bg-white transition-all">
        <span className="text-xs">{isAchieved ? '🏆' : habit.emoji}</span>
        <span className="text-[11px] font-semibold text-warm-800">
          {totalCompletedDays} <span className="text-warm-400 font-normal">/ {targetDays} days</span>
        </span>
        {isCompletedToday && (
          <span className="text-[9px] bg-sage/20 text-sage-dark font-bold px-1.5 py-0.2 rounded-full">
            Done
          </span>
        )}
      </div>

      {/* Visual Energy Tube */}
      <div className="w-28 h-1.5 bg-warm-200/50 rounded-full overflow-hidden p-0.2 shadow-inner border border-warm-200/40 relative">
        <div
          className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${colorTheme.gradient}`}
          style={{
            width: `${Math.max(4, percent)}%`,
            boxShadow: `0 0 6px ${colorTheme.glowColor}`,
          }}
        />
      </div>
    </div>
  );
}
