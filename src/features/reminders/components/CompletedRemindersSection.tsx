import { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import type { Reminder } from '../types';
import { ReminderItem } from './ReminderItem';

interface CompletedRemindersSectionProps {
  completed: Reminder[];
  onToggle: (id: string, e: React.MouseEvent) => void;
  onSelect: (reminder: Reminder) => void;
}

export function CompletedRemindersSection({ completed, onToggle, onSelect }: CompletedRemindersSectionProps) {
  const [show, setShow] = useState(false);
  if (completed.length === 0) return null;

  return (
    <div className="pt-2">
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="text-xs text-warm-500 hover:text-warm-700 flex items-center gap-1.5 px-1 py-1 font-medium transition-colors"
      >
        <Sparkles className="w-3.5 h-3.5 text-sage" />
        <span>{completed.length} completed today</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${show ? 'rotate-180' : ''}`} />
      </button>
      {show && (
        <div className="space-y-2 pt-2">
          {completed.map((r) => (
            <ReminderItem key={r.id} reminder={r} onToggle={onToggle} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}
