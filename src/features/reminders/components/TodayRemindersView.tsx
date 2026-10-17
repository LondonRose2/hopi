import { useState, useMemo } from 'react';
import { ChevronDown, CheckSquare, RefreshCw } from 'lucide-react';
import type { Reminder } from '../types';
import { parseDisplayTimeToMinutes } from '../types';
import { ReminderItem } from './ReminderItem';
import { TodayEmptyState } from './TodayEmptyState';
import { CompletedRemindersSection } from './CompletedRemindersSection';

interface TodayRemindersViewProps {
  reminders: Reminder[];
  onToggle: (id: string, e: React.MouseEvent) => void;
  onSelect: (reminder: Reminder) => void;
}

const INITIAL_LIMIT = 6;

export function TodayRemindersView({ reminders, onToggle, onSelect }: TodayRemindersViewProps) {
  const [displayLimit, setDisplayLimit] = useState(INITIAL_LIMIT);

  const { visibleTasks, visibleRoutines, totalPendingCount, completed } = useMemo(() => {
    const isRoutine = (r: Reminder) => r.itemType === 'routine' || (r.recurring && r.recurring !== 'none');
    const sorted = [...reminders].sort((a, b) => parseDisplayTimeToMinutes(a.time) - parseDisplayTimeToMinutes(b.time));
    const pendingTasks = sorted.filter((r) => !r.completed && !isRoutine(r));
    const pendingRoutines = sorted.filter((r) => !r.completed && isRoutine(r));
    const vTasks = pendingTasks.slice(0, displayLimit);
    const remainingForRoutines = Math.max(0, displayLimit - vTasks.length);
    const vRoutines = pendingRoutines.slice(0, remainingForRoutines);
    return {
      visibleTasks: vTasks,
      visibleRoutines: vRoutines,
      totalPendingCount: pendingTasks.length + pendingRoutines.length,
      completed: sorted.filter((r) => r.completed),
    };
  }, [reminders, displayLimit]);

  const visibleCount = visibleTasks.length + visibleRoutines.length;
  const hasMore = totalPendingCount > visibleCount;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-warm-900">Today's Focus</h2>
          <p className="text-xs text-warm-500">
            {totalPendingCount === 0 ? 'All clear and peaceful for today' : `${totalPendingCount} gentle ${totalPendingCount === 1 ? 'item' : 'items'} prioritized by time`}
          </p>
        </div>
        {totalPendingCount > 0 && (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-warm-100 text-warm-700 border border-warm-200">
            {visibleCount} of {totalPendingCount}
          </span>
        )}
      </div>

      {totalPendingCount > 0 ? (
        <div className="space-y-4">
          {visibleTasks.length > 0 && (
            <section className="space-y-2">
              <div className="flex items-center gap-1.5 px-1 text-xs font-semibold text-warm-700 uppercase tracking-wider">
                <CheckSquare className="w-3.5 h-3.5 text-warm-500" />
                <span>Tasks</span>
                <span className="text-[11px] font-normal text-warm-400">({visibleTasks.length})</span>
              </div>
              <div className="space-y-2">
                {visibleTasks.map((r) => (
                  <ReminderItem key={r.id} reminder={r} onToggle={onToggle} onSelect={onSelect} />
                ))}
              </div>
            </section>
          )}

          {visibleRoutines.length > 0 && (
            <section className="space-y-2 pt-1">
              <div className="flex items-center gap-1.5 px-1 text-xs font-semibold text-warm-700 uppercase tracking-wider">
                <RefreshCw className="w-3.5 h-3.5 text-warm-500" />
                <span>Daily Routines</span>
                <span className="text-[11px] font-normal text-warm-400">({visibleRoutines.length})</span>
              </div>
              <div className="space-y-2">
                {visibleRoutines.map((r) => (
                  <ReminderItem key={r.id} reminder={r} onToggle={onToggle} onSelect={onSelect} />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <TodayEmptyState />
      )}

      {hasMore && (
        <button
          type="button"
          onClick={() => setDisplayLimit((p) => p + 6)}
          className="w-full py-2.5 rounded-pebble border border-dashed border-warm-300 text-xs font-medium text-warm-600 hover:text-warm-900 bg-white/60 hover:bg-white transition-all flex items-center justify-center gap-1.5 shadow-sm"
        >
          <span>Load {totalPendingCount - visibleCount} more items</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      )}

      <CompletedRemindersSection completed={completed} onToggle={onToggle} onSelect={onSelect} />
    </div>
  );
}
