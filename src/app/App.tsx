import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Plus, Settings as SettingsIcon, ArrowLeft } from 'lucide-react';
import { MochiAvatar, useOverlayCompanion, useCompanionMood, HydrationWaterPill, OverlayPermissionPrompt } from '../features/companion';
import { ConfettiCelebration } from '../features/reminders/components/ConfettiCelebration';
import { TodayRemindersView } from '../features/reminders/components/TodayRemindersView';
import { UpcomingTasksView } from '../features/reminders/components/UpcomingTasksView';
import { ReminderEditModal } from '../features/reminders/components/ReminderEditModal';
import { SettingsView } from '../features/settings/components/SettingsView';
import { useReminders } from '../features/reminders/useReminders';
import { DEFAULT_SETTINGS, type AppSettings, getCompanionName } from '../features/settings/types';
import { type Reminder, getTodayDateString } from '../features/reminders/types';
import { hasAnyOverdueReminders } from '../domain/reminders';
import { floatingOverlayService } from '../services/nativeOverlay';
import { useHabits, HabitsView, HabitEnergyPill, HabitEditModal } from '../features/habits';
import { calculateHabitProgress } from '../domain/habits/habitStreak';
import type { Habit } from '../domain/habits/types';

export function App() {
  const [tab, setTab] = useState<'today' | 'habits' | 'upcoming' | 'settings'>('today');
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [modalOpen, setModalOpen] = useState(false);
  const [habitModalOpen, setHabitModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<Reminder | null>(null);
  const [activeHabit, setActiveHabit] = useState<Habit | null>(null);
  const [confettiKey, setConfettiKey] = useState(0);
  const companionName = getCompanionName(settings.avatarChoice);
  const triggerCheer = useCallback(() => setConfettiKey((k) => k + 1), []);
  const onWaterLoggedRef = useRef<() => void>(() => {});
  const { reminders, handleToggle, handleSave, handleDelete, completeOverdueWaterReminders } = useReminders(triggerCheer, () => onWaterLoggedRef.current());
  const { activeHabits, achievedHabits, primaryHabit, handleToggleHabit, handleSaveHabit, handleDeleteHabit } = useHabits(triggerCheer);
  const habitContext = useMemo(() => ({
    hasActiveHabits: activeHabits.length > 0,
    daysSinceLastCheckin: primaryHabit ? calculateHabitProgress(primaryHabit).daysSinceLastCheckin : 0,
  }), [activeHabits.length, primaryHabit]);
  const companion = useCompanionMood(reminders, triggerCheer, companionName, completeOverdueWaterReminders, habitContext);
  onWaterLoggedRef.current = () => companion.recordWater(1);
  const overlay = useOverlayCompanion({ enabled: settings.floatingCompanion });
  const todayStr = getTodayDateString();
  const todayReminders = reminders.filter((r) => r.date <= todayStr);
  const upcomingReminders = reminders.filter((r) => r.date > todayStr);
  const hasOverdue = hasAnyOverdueReminders(reminders);

  useEffect(() => { floatingOverlayService.setOverdueStatus(hasOverdue); }, [hasOverdue]);
  useEffect(() => {
    floatingOverlayService.consumeLaunchAction().then((a) => { if (a === 'add_task') { setActiveItem(null); setModalOpen(true); } });
  }, []);

  return (
    <div className="min-h-screen bg-linen text-warm-900 flex flex-col items-center justify-end relative">
      <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#2D2721]/30 via-[#2D2721]/10 to-transparent pointer-events-none z-0" />
      <ConfettiCelebration triggerKey={confettiKey} />
      <div className="pt-safe pt-8 pb-3 flex flex-col items-center text-center select-none z-10">
        <MochiAvatar avatar={settings.avatarChoice} state={companion.currentMood} size={110} onClick={companion.interactMochi} title={companionName} hasAlert={settings.showOverdueAlertDot && hasOverdue} />
        <p className="text-xs font-semibold text-warm-600 mt-1 tracking-wide">{tab === 'settings' ? 'Companion Settings' : companion.statusText}</p>
        {tab !== 'settings' && (
          <div className="flex flex-col items-center">
            <HydrationWaterPill count={companion.todayWaterCount} goal={companion.dailyWaterGoal} hydrationLevel={companion.hydrationLevel} onLogWater={() => companion.recordWater(1)} />
            {settings.showHabitOnAvatar && <HabitEnergyPill habit={primaryHabit} onClick={() => setTab('habits')} />}
          </div>
        )}
      </div>

      <main className="w-full max-w-lg h-[78vh] bg-white rounded-t-[2.2rem] border-t border-x border-[#EAE2D5] shadow-sheet flex flex-col overflow-hidden z-20">
        <header className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-warm-100">
          <div className="w-9">
            {tab === 'settings' ? (
              <button onClick={() => setTab('today')} className="p-2 rounded-full hover:bg-warm-100 text-warm-600" aria-label="Back"><ArrowLeft className="w-5 h-5" /></button>
            ) : (
              <button onClick={() => { if (tab === 'habits') { setActiveHabit(null); setHabitModalOpen(true); } else { setActiveItem(null); setModalOpen(true); } }} className="p-2.5 rounded-full bg-warm-100 hover:bg-warm-200 text-warm-700 shadow-sm" aria-label="Add Item"><Plus className="w-4 h-4 stroke-[2.5]" /></button>
            )}
          </div>

          {tab !== 'settings' ? (
            <div className="flex bg-warm-100/80 p-1 rounded-full border border-warm-200">
              {(['today', 'habits', 'upcoming'] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`px-3.5 py-1 rounded-full text-xs font-semibold capitalize transition-all ${tab === t ? 'bg-white text-warm-900 shadow-sm' : 'text-warm-500'}`}>{t}</button>
              ))}
            </div>
          ) : <span className="text-xs font-semibold text-warm-700 uppercase tracking-wider">Preferences</span>}

          <div className="w-9 flex justify-end">
            <button onClick={() => setTab((t) => (t === 'settings' ? 'today' : 'settings'))} className={`p-2 rounded-full transition-colors ${tab === 'settings' ? 'bg-warm-900 text-white' : 'hover:bg-warm-100 text-warm-600'}`} aria-label="Settings"><SettingsIcon className="w-4 h-4" /></button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4 sheet-safe-bottom">
          {overlay.showPrompt && <OverlayPermissionPrompt onRequestPermission={overlay.requestPermission} onDismiss={overlay.dismissPrompt} />}
          {tab === 'today' && <TodayRemindersView reminders={todayReminders} onToggle={handleToggle} onSelect={(r) => { setActiveItem(r); setModalOpen(true); }} />}
          {tab === 'habits' && <HabitsView activeHabits={activeHabits} achievedHabits={achievedHabits} onToggle={handleToggleHabit} onSelect={(h) => { setActiveHabit(h); setHabitModalOpen(true); }} onAddNew={() => { setActiveHabit(null); setHabitModalOpen(true); }} />}
          {tab === 'upcoming' && <UpcomingTasksView reminders={upcomingReminders} onToggle={handleToggle} onSelect={(r) => { setActiveItem(r); setModalOpen(true); }} />}
          {tab === 'settings' && <SettingsView settings={settings} onUpdate={(u) => setSettings((s) => ({ ...s, ...u }))} waterHistory={companion.waterHistory} dailyWaterGoal={companion.dailyWaterGoal} todayWaterCount={companion.todayWaterCount} onUpdateWaterGoal={companion.updateDailyGoal} onAdjustTodayWater={(d) => companion.updateTodayWater(companion.todayWaterCount + d)} />}
        </div>
      </main>

      <ReminderEditModal isOpen={modalOpen} initialReminder={activeItem} onClose={() => setModalOpen(false)} onSave={handleSave} onDelete={handleDelete} />
      <HabitEditModal isOpen={habitModalOpen} initialHabit={activeHabit} onClose={() => setHabitModalOpen(false)} onSave={handleSaveHabit} onDelete={handleDeleteHabit} />
    </div>
  );
}
