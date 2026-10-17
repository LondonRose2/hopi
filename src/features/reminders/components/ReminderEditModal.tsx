import { useState, useEffect } from 'react';
import { X, Trash2, Clock, Calendar } from 'lucide-react';
import type { Reminder, RecurringType } from '../types';
import { EMOJI_OPTIONS } from '../types';

interface ReminderEditModalProps {
  isOpen: boolean;
  initialReminder?: Reminder | null;
  onClose: () => void;
  onSave: (reminder: Reminder) => void;
  onDelete?: (id: string) => void;
}

export function ReminderEditModal({
  isOpen,
  initialReminder,
  onClose,
  onSave,
  onDelete,
}: ReminderEditModalProps) {
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('💧');
  const [time, setTime] = useState('09:00 AM');
  const [date, setDate] = useState('2026-10-18');
  const [recurring, setRecurring] = useState<RecurringType>('none');

  useEffect(() => {
    if (initialReminder) {
      setTitle(initialReminder.title);
      setEmoji(initialReminder.emoji);
      setTime(initialReminder.time);
      setDate(initialReminder.date);
      setRecurring(initialReminder.recurring || 'none');
    } else {
      setTitle('');
      setEmoji('💧');
      setTime('09:00 AM');
      setDate('2026-10-18');
      setRecurring('none');
    }
  }, [initialReminder, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      id: initialReminder ? initialReminder.id : crypto.randomUUID(),
      title: title.trim(),
      emoji,
      time,
      date,
      completed: initialReminder ? initialReminder.completed : false,
      recurring,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-warm-900/35 backdrop-blur-sm">
      <div
        className="w-full max-w-md bg-white rounded-t-[2rem] sm:rounded-pebble border border-[#EAE2D5] shadow-sheet p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl p-1 bg-warm-100 rounded-full">{emoji}</span>
            <h3 className="text-base font-semibold text-warm-900">
              {initialReminder ? 'Edit Routine' : 'Add New Routine'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-warm-400 hover:text-warm-700 hover:bg-warm-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-warm-600 mb-1">Routine Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Mindful herbal tea break"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-warm-200 bg-warm-50/50 text-warm-900 placeholder-warm-400 focus:bg-white focus:border-terracotta outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-warm-600 mb-1">Choose Icon</label>
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {EMOJI_OPTIONS.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setEmoji(item)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-base transition-transform shrink-0 ${
                    emoji === item ? 'bg-terracotta-soft border-2 border-terracotta scale-105' : 'bg-warm-100 border border-warm-200 hover:scale-105'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-warm-600 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-warm-400" /> Time
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="09:00 AM"
                className="w-full px-3 py-2 text-xs rounded-xl border border-warm-200 bg-warm-50/50 text-warm-900 focus:bg-white focus:border-terracotta outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-warm-600 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-warm-400" /> Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-warm-200 bg-warm-50/50 text-warm-900 focus:bg-white focus:border-terracotta outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-warm-600 mb-1">Repeat Cadence</label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['none', 'daily', 'weekdays', 'weekly'] as const).map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setRecurring(opt)}
                  className={`py-1.5 px-2 text-xs rounded-lg capitalize font-medium border transition-colors ${
                    recurring === opt ? 'bg-warm-900 text-white border-warm-900' : 'bg-warm-50 border-warm-200 text-warm-600 hover:bg-warm-100'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            {initialReminder && onDelete && (
              <button
                type="button"
                onClick={() => { onDelete(initialReminder.id); onClose(); }}
                className="p-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                title="Delete reminder"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-terracotta hover:bg-terracotta-hover text-white text-xs font-semibold tracking-wide shadow-sm transition-all"
            >
              {initialReminder ? 'Save Changes' : 'Create Reminder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
