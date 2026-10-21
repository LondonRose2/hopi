import React from 'react';
import { Sparkles, Plus } from 'lucide-react';
import type { Habit } from '../../../domain/habits/types';
import { HabitCard } from './HabitCard';
import { AchievedHabitsSection } from './AchievedHabitsSection';

interface HabitsViewProps {
  activeHabits: Habit[];
  achievedHabits: Habit[];
  onToggle: (id: string, e: React.MouseEvent) => void;
  onSelect: (habit: Habit) => void;
  onAddNew: () => void;
}

export function HabitsView({
  activeHabits,
  achievedHabits,
  onToggle,
  onSelect,
  onAddNew,
}: HabitsViewProps) {
  return (
    <div className="space-y-4">
      {/* Header Summary */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-warm-900">Habit Former</h2>
          <p className="text-xs text-warm-500">
            {activeHabits.length === 0
              ? 'No active habits yet. Tap + to start one!'
              : `${activeHabits.length} active ${activeHabits.length === 1 ? 'journey' : 'journeys'} in progress`}
          </p>
        </div>
        <button
          type="button"
          onClick={onAddNew}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warm-900 hover:bg-warm-800 text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Habit</span>
        </button>
      </div>

      {/* Active Habits */}
      {activeHabits.length > 0 ? (
        <div className="space-y-3">
          {activeHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-2xl border border-warm-200/80 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-2xl select-none">
            🌱
          </div>
          <div>
            <h3 className="text-sm font-semibold text-warm-900">Start Your Habit Journey</h3>
            <p className="text-xs text-warm-500 mt-1 max-w-xs mx-auto">
              Choose a small daily practice. Hopi gives you grace: missing a day never resets your progress.
            </p>
          </div>
          <button
            type="button"
            onClick={onAddNew}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-terracotta text-white text-xs font-semibold shadow-sm hover:bg-terracotta-hover transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Form 60-Day Habit</span>
          </button>
        </div>
      )}

      {/* Achieved Habits Trophy Hall */}
      <AchievedHabitsSection habits={achievedHabits} />
    </div>
  );
}
