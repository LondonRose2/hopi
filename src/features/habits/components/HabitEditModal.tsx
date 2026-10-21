import { useState, useEffect, useRef } from 'react';
import { X, Trash2, Clock, Calendar, Mic, Sparkles } from 'lucide-react';
import type { Habit, HabitCadence } from '../../../domain/habits/types';
import { DEFAULT_HABIT_TARGET_DAYS, QUICK_TARGET_DAYS_OPTIONS } from '../../../domain/habits/types';
import { getTodayIsoString } from '../../../domain/habits/habitStreak';
import { EmojiGrid } from '../../reminders/components/EmojiGrid';
import { to24Hour, to12Hour } from '../../reminders/types';
import { floatingOverlayService } from '../../../services/nativeOverlay';
import { parseVoiceInput } from '../../../domain/reminders/voiceParser';

interface HabitEditModalProps {
  isOpen: boolean;
  initialHabit?: Habit | null;
  onClose: () => void;
  onSave: (habit: Habit) => void;
  onDelete?: (id: string) => void;
}

export function HabitEditModal({ isOpen, initialHabit, onClose, onSave, onDelete }: HabitEditModalProps) {
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('🧘');
  const [time, setTime] = useState('08:00 AM');
  const [cadence, setCadence] = useState<HabitCadence>('daily');
  const [targetDays, setTargetDays] = useState<number>(DEFAULT_HABIT_TARGET_DAYS);
  const [isListening, setIsListening] = useState(false);
  const timeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialHabit) {
      setTitle(initialHabit.title);
      setEmoji(initialHabit.emoji);
      setTime(initialHabit.time);
      setCadence(initialHabit.cadence);
      setTargetDays(initialHabit.targetDays || DEFAULT_HABIT_TARGET_DAYS);
    } else {
      setTitle('');
      setEmoji('🧘');
      setTime('08:00 AM');
      setCadence('daily');
      setTargetDays(DEFAULT_HABIT_TARGET_DAYS);
    }
  }, [initialHabit, isOpen]);

  if (!isOpen) return null;

  const handleVoiceFill = async () => {
    setIsListening(true);
    try {
      const res = await floatingOverlayService.promptSpeechInput();
      if (res.success && res.transcript) {
        const parsed = parseVoiceInput(res.transcript);
        if (parsed.title) setTitle(parsed.title);
        if (parsed.emoji) setEmoji(parsed.emoji);
        if (parsed.time) setTime(parsed.time);
        if (parsed.targetDays) setTargetDays(parsed.targetDays);
        if (parsed.recurring === 'weekdays') setCadence('weekdays');
        else if (parsed.recurring === 'daily') setCadence('daily');
      }
    } finally {
      setIsListening(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: initialHabit ? initialHabit.id : crypto.randomUUID(),
      title: title.trim(),
      emoji,
      time,
      cadence,
      targetDays: Math.max(1, Math.min(365, targetDays)),
      completedDates: initialHabit ? initialHabit.completedDates : [],
      startDate: initialHabit ? initialHabit.startDate : getTodayIsoString(),
      status: initialHabit ? initialHabit.status : 'active',
      achievedAt: initialHabit?.achievedAt,
      createdAt: initialHabit ? initialHabit.createdAt : Date.now(),
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
              {initialHabit ? 'Edit Habit' : 'Form a New Habit'}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-full text-warm-400 hover:text-warm-700 hover:bg-warm-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Name Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-warm-600">Habit Name</label>
              <button
                type="button"
                onClick={handleVoiceFill}
                disabled={isListening}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all ${
                  isListening ? 'bg-terracotta text-white border-terracotta animate-pulse' : 'bg-warm-100 text-warm-700 border-warm-200 shadow-xs'
                }`}
              >
                <Mic className="w-3 h-3" />
                <span>{isListening ? 'Listening...' : 'Voice Fill'}</span>
              </button>
            </div>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Morning reflection or 20-min reading"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-warm-200 bg-warm-50/50 text-warm-900 focus:bg-white focus:border-terracotta outline-none transition-all"
            />
          </div>

          <EmojiGrid selected={emoji} onSelect={setEmoji} />

          {/* Target Journey in Days */}
          <div className="p-3 bg-warm-50/70 rounded-xl border border-warm-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-warm-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Target Journey (Days)
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  min="1"
                  max="365"
                  value={targetDays}
                  onChange={(e) => setTargetDays(Math.max(1, Math.min(365, parseInt(e.target.value, 10) || 1)))}
                  className="w-14 px-2 py-0.5 text-xs text-center font-bold text-terracotta bg-white border border-warm-300 rounded-lg outline-none shadow-xs"
                />
                <span className="text-xs font-bold text-warm-700">days</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="grid grid-cols-5 gap-1 pt-0.5">
              {QUICK_TARGET_DAYS_OPTIONS.map((days) => (
                <button
                  type="button"
                  key={days}
                  onClick={() => setTargetDays(days)}
                  className={`py-1 rounded-lg text-xs font-semibold border transition-all ${
                    targetDays === days
                      ? 'bg-warm-900 text-white border-warm-900 shadow-xs'
                      : 'bg-white text-warm-700 border-warm-200 hover:bg-warm-100'
                  }`}
                >
                  {days === 60 ? '60d ✨' : `${days}d`}
                </button>
              ))}
            </div>
          </div>

          {/* Cadence & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-warm-600 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-warm-400" /> Cadence
              </label>
              <div className="flex p-0.5 bg-warm-100/90 rounded-xl border border-warm-200">
                <button
                  type="button"
                  onClick={() => setCadence('daily')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    cadence === 'daily' ? 'bg-white text-warm-900 shadow-xs' : 'text-warm-500'
                  }`}
                >
                  Daily
                </button>
                <button
                  type="button"
                  onClick={() => setCadence('weekdays')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    cadence === 'weekdays' ? 'bg-white text-warm-900 shadow-xs' : 'text-warm-500'
                  }`}
                >
                  Weekdays
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-warm-600 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-warm-400" /> Time (Reminder)
              </label>
              <div
                onClick={() => timeInputRef.current?.showPicker?.() || timeInputRef.current?.focus()}
                className="flex items-center justify-between px-3 py-2 text-xs rounded-xl border border-warm-200 bg-warm-50/50 hover:bg-white focus-within:bg-white focus-within:border-terracotta cursor-pointer"
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
          </div>

          <div className="flex items-center gap-3 pt-3 pb-6 sm:pb-2">
            {initialHabit && onDelete && (
              <button
                type="button"
                onClick={() => { onDelete(initialHabit.id); onClose(); }}
                className="p-3 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                title="Delete habit"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-terracotta hover:bg-terracotta-hover text-white text-xs font-semibold tracking-wide shadow-md transition-all active:scale-[0.99]"
            >
              {initialHabit ? 'Save Changes' : 'Form Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
