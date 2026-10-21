import { Droplets, Plus, Minus, Check } from 'lucide-react';
import {
  type WaterHistory,
  getPastDaysWaterLogs,
  getTodayDateString,
} from '../../../domain/reminders/waterTracker';

interface HydrationHistorySectionProps {
  history: WaterHistory;
  goal: number;
  todayCount: number;
  onUpdateGoal: (newGoal: number) => void;
  onAdjustToday: (delta: number) => void;
}

const GOAL_OPTIONS = [6, 8, 10, 12] as const;

export function HydrationHistorySection({
  history,
  goal,
  todayCount,
  onUpdateGoal,
  onAdjustToday,
}: HydrationHistorySectionProps) {
  const todayStr = getTodayDateString();
  const pastLogs = getPastDaysWaterLogs(history, todayStr, 7, goal);

  return (
    <div className="p-4 bg-white rounded-pebble border border-[#EAE2D5] shadow-pebble space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-warm-900">Hydration Log & Goal</h3>
            <p className="text-[11px] text-warm-500">Track daily water and review past days</p>
          </div>
        </div>

        {/* Today quick adjust */}
        <div className="flex items-center gap-1 bg-warm-50 rounded-lg p-1 border border-warm-200/70">
          <button
            type="button"
            onClick={() => onAdjustToday(-1)}
            disabled={todayCount <= 0}
            className="w-6 h-6 rounded flex items-center justify-center text-warm-600 hover:bg-white disabled:opacity-30 transition-colors"
            title="Remove 1 glass"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="text-xs font-bold text-warm-900 px-1 min-w-[20px] text-center">
            {todayCount}
          </span>
          <button
            type="button"
            onClick={() => onAdjustToday(1)}
            className="w-6 h-6 rounded flex items-center justify-center text-sky-600 hover:bg-white transition-colors"
            title="Add 1 glass"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Target Goal Selector */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[10px] uppercase font-bold text-warm-400 block">Daily Target</span>
        <div className="grid grid-cols-4 gap-2">
          {GOAL_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onUpdateGoal(opt)}
              className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                goal === opt
                  ? 'bg-sky-500 border-sky-500 text-white shadow-sm'
                  : 'bg-warm-50/60 border-warm-200 text-warm-600 hover:bg-warm-100'
              }`}
            >
              {opt} glasses
            </button>
          ))}
        </div>
      </div>

      {/* History Log List */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[10px] uppercase font-bold text-warm-400 block">Past 7 Days</span>
        <div className="divide-y divide-warm-100 rounded-xl border border-warm-100 overflow-hidden bg-warm-50/30">
          {pastLogs.map((log) => (
            <div key={log.date} className="flex items-center justify-between px-3 py-2 text-xs">
              <span className="font-medium text-warm-800">{log.displayDate}</span>
              <div className="flex items-center gap-2">
                <span className="text-warm-600 font-semibold">
                  {log.glasses} <span className="text-warm-400 font-normal">glasses ({log.ounces} oz)</span>
                </span>
                {log.goalMet ? (
                  <span className="flex items-center gap-0.5 text-[10px] font-bold text-sage-dark bg-sage/20 px-1.5 py-0.5 rounded-full">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                    <span>Met</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-warm-400">
                    {log.glasses}/{goal}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
