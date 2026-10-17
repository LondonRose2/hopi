import { useMemo } from 'react';
import { Calendar } from 'lucide-react';
import type { Reminder } from '../types';
import { ReminderItem } from './ReminderItem';

interface UpcomingTasksViewProps {
  reminders: Reminder[];
  onToggle: (id: string, e: React.MouseEvent) => void;
  onSelect: (reminder: Reminder) => void;
}

function formatDateHeader(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function UpcomingTasksView({
  reminders,
  onToggle,
  onSelect,
}: UpcomingTasksViewProps) {
  // Group reminders by date string
  const groupedTasks = useMemo(() => {
    const groups: Record<string, Reminder[]> = {};
    const sorted = [...reminders].sort((a, b) => a.date.localeCompare(b.date));
    sorted.forEach((item) => {
      if (!groups[item.date]) groups[item.date] = [];
      groups[item.date].push(item);
    });
    return groups;
  }, [reminders]);

  const dateKeys = Object.keys(groupedTasks);

  if (dateKeys.length === 0) {
    return (
      <div className="p-8 text-center rounded-pebble bg-white border border-[#EAE2D5] shadow-pebble space-y-2">
        <div className="w-12 h-12 mx-auto rounded-full bg-warm-100 flex items-center justify-center text-warm-500">
          <Calendar className="w-6 h-6 stroke-[1.8]" />
        </div>
        <h3 className="text-sm font-semibold text-warm-900">No upcoming tasks</h3>
        <p className="text-xs text-warm-500 max-w-xs mx-auto">
          Your schedule ahead is clear. Use the '+' button to add future routines or events.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {dateKeys.map((dateKey) => (
        <section key={dateKey} className="space-y-2.5">
          {/* Thin minimalist date divider line */}
          <div className="flex items-center gap-3 px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-warm-600 whitespace-nowrap">
              {formatDateHeader(dateKey)}
            </span>
            <div className="h-px bg-warm-200 flex-1" />
            <span className="text-[11px] text-warm-400 font-medium">
              {groupedTasks[dateKey].length} {groupedTasks[dateKey].length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {/* Clean rows under date */}
          <div className="space-y-2">
            {groupedTasks[dateKey].map((reminder) => (
              <ReminderItem
                key={reminder.id}
                reminder={reminder}
                onToggle={onToggle}
                onSelect={onSelect}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
