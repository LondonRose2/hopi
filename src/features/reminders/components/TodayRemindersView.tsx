import { useState } from 'react';
import { ChevronDown, Sparkles, CheckCircle2 } from 'lucide-react';
import type { Reminder } from '../types';
import { ReminderItem } from './ReminderItem';

interface TodayRemindersViewProps {
  reminders: Reminder[];
  onToggle: (id: string, e: React.MouseEvent) => void;
  onSelect: (reminder: Reminder) => void;
}

const INITIAL_LIMIT = 4;

export function TodayRemindersView({ reminders, onToggle, onSelect }: TodayRemindersViewProps) {
  const [displayLimit, setDisplayLimit] = useState(INITIAL_LIMIT);
  const [showCompleted, setShowCompleted] = useState(false);

  const pending = reminders.filter((r) => !r.completed);
  const completed = reminders.filter((r) => r.completed);
  const visiblePending = pending.slice(0, displayLimit);
  const hasMore = pending.length > displayLimit;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-warm-900">Today's Focus</h2>
          <p className="text-xs text-warm-500">
            {pending.length === 0 ? 'All clear and peaceful for today' : `${pending.length} gentle ${pending.length === 1 ? 'task' : 'tasks'} waiting`}
          </p>
        </div>
        {pending.length > 0 && (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-warm-100 text-warm-700 border border-warm-200">
            {visiblePending.length} of {pending.length}
          </span>
        )}
      </div>

      {visiblePending.length > 0 ? (
        <div className="space-y-2.5">
          {visiblePending.map((r) => (
            <ReminderItem key={r.id} reminder={r} onToggle={onToggle} onSelect={onSelect} />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center rounded-pebble bg-white border border-[#EAE2D5] shadow-pebble space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-sage-soft flex items-center justify-center text-sage">
            <CheckCircle2 className="w-6 h-6 stroke-[2]" />
          </div>
          <h3 className="text-sm font-semibold text-warm-900">All done for today</h3>
          <p className="text-xs text-warm-500 max-w-xs mx-auto">Take a deep breath and enjoy your calm day. Mochi is proud of you.</p>
        </div>
      )}

      {hasMore && (
        <button
          type="button"
          onClick={() => setDisplayLimit((p) => p + 3)}
          className="w-full py-2.5 rounded-pebble border border-dashed border-warm-300 text-xs font-medium text-warm-600 hover:text-warm-900 bg-white/60 hover:bg-white transition-all flex items-center justify-center gap-1.5 shadow-sm"
        >
          <span>Load {pending.length - displayLimit} more reminders</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      )}

      {completed.length > 0 && (
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowCompleted((v) => !v)}
            className="text-xs text-warm-500 hover:text-warm-700 flex items-center gap-1.5 px-1 py-1 font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-sage" />
            <span>{completed.length} completed today</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showCompleted ? 'rotate-180' : ''}`} />
          </button>
          {showCompleted && (
            <div className="space-y-2 pt-2">
              {completed.map((r) => (
                <ReminderItem key={r.id} reminder={r} onToggle={onToggle} onSelect={onSelect} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
