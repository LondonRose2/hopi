import { useState, useEffect, useRef } from 'react';
import { X, Trash2, Clock, Calendar, CheckSquare, RefreshCw } from 'lucide-react';
import type { Reminder, RecurringType, ItemType } from '../types';
import { EMOJI_OPTIONS, to24Hour, to12Hour, getTodayDateString } from '../types';

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
  const [date, setDate] = useState(getTodayDateString());
  const [itemType, setItemType] = useState<ItemType>('task');
  const [recurring, setRecurring] = useState<RecurringType>('none');
  const [repeatIntervalHours, setRepeatIntervalHours] = useState<number>(2);
  const timeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialReminder) {
      setTitle(initialReminder.title);
      setEmoji(initialReminder.emoji);
      setTime(initialReminder.time);
      setDate(initialReminder.date);
      const isRoutine = initialReminder.itemType === 'routine' || (initialReminder.recurring && initialReminder.recurring !== 'none');
      setItemType(isRoutine ? 'routine' : 'task');
      setRecurring(initialReminder.recurring || (isRoutine ? 'daily' : 'none'));
      setRepeatIntervalHours(initialReminder.repeatIntervalHours || 2);
    } else {
      setTitle('');
      setEmoji('💧');
      setTime('09:00 AM');
      setDate(getTodayDateString());
      setItemType('task');
      setRecurring('none');
      setRepeatIntervalHours(2);
    }
  }, [initialReminder, isOpen]);

  if (!isOpen) return null;

  const handleTypeChange = (type: ItemType) => {
    setItemType(type);
    if (type === 'routine' && recurring === 'none') {
      setRecurring('daily');
    } else if (type === 'task') {
      setRecurring('none');
    }
  };

  const handleTimeClick = () => {
    const el = timeInputRef.current;
    if (!el) return;
    try {
      if (typeof (el as HTMLInputElement & { showPicker?: () => void }).showPicker === 'function') {
        (el as HTMLInputElement & { showPicker: () => void }).showPicker();
      } else {
        el.focus();
      }
    } catch {
      el.focus();
    }
  };

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
      itemType,
      recurring: itemType === 'routine' ? recurring : 'none',
      repeatIntervalHours: itemType === 'routine' && recurring === 'hourly' ? repeatIntervalHours : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-warm-900/35 backdrop-blur-sm">
      <div
        className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-t-[2rem] sm:rounded-pebble border border-[#EAE2D5] shadow-sheet p-5 sm:p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl p-1 bg-warm-100 rounded-full">{emoji}</span>
            <h3 className="text-base font-semibold text-warm-900">
              {initialReminder ? 'Edit Item' : 'Add New Item'}
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

        {/* Item Type Selector: Task vs Routine */}
        <div className="flex p-1 bg-warm-100/90 rounded-xl border border-warm-200">
          <button
            type="button"
            onClick={() => handleTypeChange('task')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              itemType === 'task' ? 'bg-white text-warm-900 shadow-sm' : 'text-warm-500 hover:text-warm-700'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Task (To-Do)</span>
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('routine')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              itemType === 'routine' ? 'bg-white text-warm-900 shadow-sm' : 'text-warm-500 hover:text-warm-700'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Daily Routine</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-warm-600 mb-1">Item Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={itemType === 'task' ? 'e.g., Pick up groceries or call mom' : 'e.g., Mindful herbal tea break'}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-warm-200 bg-warm-50/50 text-warm-900 placeholder-warm-400 focus:bg-white focus:border-terracotta outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-warm-600 mb-1">Choose Icon</label>
            <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5 max-h-32 overflow-y-auto p-1.5 rounded-xl border border-warm-200 bg-warm-50/40">
              {EMOJI_OPTIONS.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setEmoji(item)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-transform ${
                    emoji === item ? 'bg-terracotta-soft border-2 border-terracotta scale-105' : 'bg-white border border-warm-200 hover:bg-warm-100'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Native Clock Selector */}
            <div>
              <label className="block text-xs font-medium text-warm-600 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-warm-400" /> Time (Clock)
              </label>
              <div
                onClick={handleTimeClick}
                className="flex items-center justify-between px-3 py-2 text-xs rounded-xl border border-warm-200 bg-warm-50/50 hover:bg-white focus-within:bg-white focus-within:border-terracotta cursor-pointer transition-colors"
              >
                <input
                  ref={timeInputRef}
                  type="time"
                  value={to24Hour(time)}
                  onChange={(e) => setTime(to12Hour(e.target.value))}
                  className="w-full bg-transparent text-xs text-warm-900 font-medium outline-none cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-warm-600 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-warm-400" /> Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-warm-200 bg-warm-50/50 text-warm-900 focus:bg-white focus:border-terracotta outline-none cursor-pointer"
              />
            </div>
          </div>

          {itemType === 'routine' && (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-warm-600">Repeat Cadence</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['daily', 'hourly', 'weekdays', 'weekly'] as const).map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setRecurring(opt)}
                    className={`py-1.5 px-1.5 text-xs rounded-lg capitalize font-medium border transition-colors ${
                      recurring === opt ? 'bg-warm-900 text-white border-warm-900' : 'bg-warm-50 border-warm-200 text-warm-600 hover:bg-warm-100'
                    }`}
                  >
                    {opt === 'hourly' ? 'Every X hrs' : opt}
                  </button>
                ))}
              </div>

              {recurring === 'hourly' && (
                <div className="p-3 bg-warm-50/80 border border-warm-200 rounded-xl space-y-2 mt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-warm-700">Hours Apart</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-warm-500">Every</span>
                      <input
                        type="number"
                        min="1"
                        max="24"
                        value={repeatIntervalHours}
                        onChange={(e) => setRepeatIntervalHours(Math.max(1, Math.min(24, parseInt(e.target.value, 10) || 1)))}
                        className="w-12 px-1.5 py-0.5 text-xs text-center font-bold text-terracotta bg-white border border-warm-300 rounded-md outline-none"
                      />
                      <span className="text-xs font-bold text-warm-700">
                        {repeatIntervalHours === 1 ? 'hour' : 'hours'}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-6 gap-1">
                    {[1, 2, 3, 4, 6, 8].map((h) => (
                      <button
                        type="button"
                        key={h}
                        onClick={() => setRepeatIntervalHours(h)}
                        className={`py-1 rounded-lg text-xs font-semibold border transition-all ${
                          repeatIntervalHours === h
                            ? 'bg-warm-900 text-white border-warm-900 shadow-sm'
                            : 'bg-white text-warm-700 border-warm-200 hover:bg-warm-100'
                        }`}
                      >
                        {h}h
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 pt-3 pb-6 sm:pb-2">
            {initialReminder && onDelete && (
              <button
                type="button"
                onClick={() => { onDelete(initialReminder.id); onClose(); }}
                className="p-3 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                title="Delete item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-terracotta hover:bg-terracotta-hover text-white text-xs font-semibold tracking-wide shadow-md transition-all active:scale-[0.99]"
            >
              {initialReminder ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
