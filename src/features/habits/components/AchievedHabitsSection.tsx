import { useState } from 'react';
import { ChevronDown, ChevronUp, Trophy, Calendar } from 'lucide-react';
import type { Habit } from '../../../domain/habits/types';

interface AchievedHabitsSectionProps {
  habits: Habit[];
}

export function AchievedHabitsSection({ habits }: AchievedHabitsSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (habits.length === 0) return null;

  return (
    <section className="pt-2">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between py-2 px-1 text-xs font-semibold text-warm-700 uppercase tracking-wider hover:text-warm-900 transition-colors"
      >
        <div className="flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span>Achieved Habits</span>
          <span className="text-[11px] font-normal text-warm-400">({habits.length})</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-warm-400" /> : <ChevronDown className="w-4 h-4 text-warm-400" />}
      </button>

      {isOpen && (
        <div className="space-y-2 mt-2">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="p-3 rounded-2xl bg-gradient-to-r from-amber-50/60 to-warm-50/60 border border-amber-200/70 flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xl p-1.5 bg-amber-100 rounded-xl select-none">🏆</span>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-warm-900 truncate">{habit.title}</h4>
                  <p className="text-[10px] text-warm-500 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3 text-warm-400" />
                    <span>Completed {habit.targetDays} of {habit.targetDays} days</span>
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-300">
                Achieved ✨
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
