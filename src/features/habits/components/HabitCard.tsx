import React from 'react';
import { Check, Clock, Calendar } from 'lucide-react';
import type { Habit } from '../../../domain/habits/types';
import { calculateHabitProgress } from '../../../domain/habits/habitStreak';

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string, e: React.MouseEvent) => void;
  onSelect: (habit: Habit) => void;
}

export function HabitCard({ habit, onToggle, onSelect }: HabitCardProps) {
  const progress = calculateHabitProgress(habit);
  const { totalCompletedDays, targetDays, percent, isCompletedToday, colorTheme, isAchieved } = progress;

  return (
    <div
      onClick={() => onSelect(habit)}
      className={`group relative p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
        isCompletedToday
          ? 'bg-warm-50/70 border-warm-200/80 shadow-xs'
          : 'bg-white border-[#EAE2D5] hover:border-warm-300 shadow-sm hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-2xl p-1.5 bg-warm-100 rounded-xl flex-shrink-0 select-none">
            {isAchieved ? '🏆' : habit.emoji}
          </span>
          <div className="flex-1 min-w-0">
            <h4
              className={`text-sm font-semibold truncate ${
                isCompletedToday ? 'text-warm-500 line-through' : 'text-warm-900'
              }`}
            >
              {habit.title}
            </h4>
            <div className="flex items-center gap-3 mt-1 text-[11px] text-warm-500">
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3 text-warm-400" />
                {habit.time}
              </span>
              <span className="inline-flex items-center gap-1 capitalize">
                <Calendar className="w-3 h-3 text-warm-400" />
                {habit.cadence === 'weekdays' ? 'Weekdays' : 'Every day'}
              </span>
            </div>
          </div>
        </div>

        {/* 1-Tap Checkmark Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle(habit.id, e);
          }}
          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 active:scale-90 flex-shrink-0 ${
            isCompletedToday
              ? 'bg-sage border-sage text-white shadow-sm'
              : 'border-warm-300 hover:border-sage hover:bg-sage/10 text-transparent'
          }`}
          aria-label={isCompletedToday ? 'Mark as incomplete' : 'Mark done for today'}
          title={isCompletedToday ? 'Completed today' : 'Tap to mark done today'}
        >
          <Check className={`w-4 h-4 stroke-[2.5] ${isCompletedToday ? 'text-white' : 'text-warm-300'}`} />
        </button>
      </div>

      {/* Visual Energy Tube Gauge */}
      <div className="mt-3 pt-2.5 border-t border-warm-100/80">
        <div className="flex items-center justify-between text-[11px] mb-1.5">
          <span className="font-semibold text-warm-700">
            {totalCompletedDays} <span className="text-warm-400 font-normal">of {targetDays} days</span>
          </span>
          <span className={`text-[10px] font-bold ${colorTheme.textColor}`}>
            {isAchieved ? '🏆 Goal Reached' : `${percent}% • ${colorTheme.label}`}
          </span>
        </div>

        <div className="w-full h-2.5 bg-warm-100 rounded-full overflow-hidden p-0.5 border border-warm-200/60 shadow-inner relative">
          <div
            className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${colorTheme.gradient}`}
            style={{
              width: `${Math.max(3, percent)}%`,
              boxShadow: `0 0 8px ${colorTheme.glowColor}`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
