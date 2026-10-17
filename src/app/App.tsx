import { useState, useCallback } from 'react';
import { Plus, Settings as SettingsIcon, ArrowLeft } from 'lucide-react';
import { MochiAvatar, type MochiState } from '../features/companion/MochiAvatar';
import { useOverlayCompanion } from '../features/companion/useOverlayCompanion';
import { OverlayPermissionPrompt } from '../features/companion/OverlayPermissionPrompt';
import { ConfettiCelebration } from '../features/reminders/components/ConfettiCelebration';
import { TodayRemindersView } from '../features/reminders/components/TodayRemindersView';
import { UpcomingTasksView } from '../features/reminders/components/UpcomingTasksView';
import { ReminderEditModal } from '../features/reminders/components/ReminderEditModal';
import { SettingsView } from '../features/settings/components/SettingsView';
import { useReminders } from '../features/reminders/useReminders';
import { DEFAULT_SETTINGS, type AppSettings } from '../features/settings/types';
import type { Reminder } from '../features/reminders/types';

export function App() {
  const [tab, setTab] = useState<'today' | 'upcoming' | 'settings'>('today');
  const [mochiState, setMochiState] = useState<MochiState>('idle');
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<Reminder | null>(null);
  const [confettiKey, setConfettiKey] = useState(0);

  const triggerCheer = useCallback(() => {
    setConfettiKey((k) => k + 1);
    setMochiState('cheer');
    setTimeout(() => setMochiState('idle'), 2400);
  }, []);

  const { reminders, handleToggle, handleSave, handleDelete } = useReminders(triggerCheer);
  const overlay = useOverlayCompanion({ enabled: settings.floatingCompanion });

  const todayReminders = reminders.filter((r) => r.date <= '2026-10-18');
  const upcomingReminders = reminders.filter((r) => r.date > '2026-10-18');

  return (
    <div className="min-h-screen bg-linen text-warm-900 flex flex-col items-center justify-end relative">
      <ConfettiCelebration triggerKey={confettiKey} />

      <div className="pt-8 pb-3 flex flex-col items-center text-center select-none z-10">
        <MochiAvatar
          state={mochiState}
          size={110}
          onClick={() => {
            setMochiState((s) => (s === 'idle' ? 'wave' : 'idle'));
            setTimeout(() => setMochiState('idle'), 2000);
          }}
        />
        <p className="text-xs font-semibold text-warm-600 mt-1 tracking-wide">
          {tab === 'settings' ? 'Companion Settings' : 'Mochi is here with you'}
        </p>
      </div>

      <main className="w-full max-w-lg h-[75vh] bg-white rounded-t-[2.2rem] border-t border-x border-[#EAE2D5] shadow-sheet flex flex-col overflow-hidden z-20">
        <header className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-warm-100">
          <div className="w-9">
            {tab === 'settings' ? (
              <button onClick={() => setTab('today')} className="p-2 rounded-full hover:bg-warm-100 text-warm-600" aria-label="Back"><ArrowLeft className="w-5 h-5" /></button>
            ) : (
              <button onClick={() => { setActiveItem(null); setModalOpen(true); }} className="p-2 rounded-full bg-warm-100 hover:bg-warm-200 text-warm-700" aria-label="Add Item" title="Add Item"><Plus className="w-4 h-4 stroke-[2.5]" /></button>
            )}
          </div>

          {tab !== 'settings' ? (
            <div className="flex bg-warm-100/80 p-1 rounded-full border border-warm-200">
              <button onClick={() => setTab('today')} className={`px-4 py-1 rounded-full text-xs font-semibold transition-all ${tab === 'today' ? 'bg-white text-warm-900 shadow-sm' : 'text-warm-500'}`}>Today</button>
              <button onClick={() => setTab('upcoming')} className={`px-4 py-1 rounded-full text-xs font-semibold transition-all ${tab === 'upcoming' ? 'bg-white text-warm-900 shadow-sm' : 'text-warm-500'}`}>Upcoming</button>
            </div>
          ) : (
            <span className="text-xs font-semibold text-warm-700 uppercase tracking-wider">Preferences</span>
          )}

          <div className="w-9 flex justify-end">
            <button onClick={() => setTab((t) => (t === 'settings' ? 'today' : 'settings'))} className={`p-2 rounded-full transition-colors ${tab === 'settings' ? 'bg-warm-900 text-white' : 'hover:bg-warm-100 text-warm-600'}`} aria-label="Settings"><SettingsIcon className="w-4 h-4" /></button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4 sheet-safe-bottom">
          {overlay.showPrompt && <OverlayPermissionPrompt onRequestPermission={overlay.requestPermission} onDismiss={overlay.dismissPrompt} />}
          {tab === 'today' && <TodayRemindersView reminders={todayReminders} onToggle={handleToggle} onSelect={(r) => { setActiveItem(r); setModalOpen(true); }} />}
          {tab === 'upcoming' && <UpcomingTasksView reminders={upcomingReminders} onToggle={handleToggle} onSelect={(r) => { setActiveItem(r); setModalOpen(true); }} />}
          {tab === 'settings' && <SettingsView settings={settings} onUpdate={(u) => setSettings((s) => ({ ...s, ...u }))} />}
        </div>
      </main>

      <ReminderEditModal isOpen={modalOpen} initialReminder={activeItem} onClose={() => setModalOpen(false)} onSave={handleSave} onDelete={handleDelete} />
    </div>
  );
}
