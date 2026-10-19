import { Check } from 'lucide-react';
import type { Reminder } from '../types';

interface ReminderItemProps {
  reminder: Reminder;
  onToggle: (id: string, e: React.MouseEvent) => void;
  onSelect: (reminder: Reminder) => void;
}

export function ReminderItem({ reminder, onToggle, onSelect }: ReminderItemProps) {
  const isDone = reminder.completed;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(reminder)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSelect(reminder);
      }}
      className={`group relative flex items-center justify-between p-3.5 sm:p-4 rounded-pebble bg-white border border-[#EAE2D5] shadow-pebble transition-all active:scale-[0.99] hover:border-warm-300 cursor-pointer ${
        isDone ? 'opacity-55 bg-warm-50/70' : 'hover:shadow-pebble-lg'
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0 pr-2">
        <div className="w-10 h-10 rounded-full bg-warm-100 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
          {reminder.emoji}
        </div>
        <div className="min-w-0">
          <p
            className={`text-sm font-medium tracking-tight text-warm-900 truncate ${
              isDone ? 'line-through text-warm-400' : ''
            }`}
          >
            {reminder.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-warm-500 font-normal">
              {reminder.time}
            </span>
            {reminder.recurring && reminder.recurring !== 'none' && (
              <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded-full bg-warm-100 text-warm-600 border border-warm-200">
                {reminder.recurring === 'hourly'
                  ? `Every ${reminder.repeatIntervalHours || 2}h`
                  : reminder.recurring}
              </span>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label={isDone ? 'Mark incomplete' : 'Mark completed'}
        onClick={(e) => {
          e.stopPropagation();
          onToggle(reminder.id, e);
        }}
        className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all shrink-0 ${
          isDone
            ? 'bg-sage border-sage text-white'
            : 'border-warm-300 hover:border-sage hover:bg-sage-soft text-transparent hover:text-sage'
        }`}
      >
        <Check className="w-4 h-4 stroke-[2.5]" />
      </button>
    </div>
  );
}
