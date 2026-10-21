interface HydrationWaterPillProps {
  count: number;
  goal: number;
  hydrationLevel: 'hydrated' | 'thirsty' | 'dehydrated';
  onLogWater: () => void;
}

export function HydrationWaterPill({
  count,
  goal,
  hydrationLevel,
  onLogWater,
}: HydrationWaterPillProps) {
  const isGoalMet = count >= goal;
  const isThirsty = hydrationLevel !== 'hydrated';
  const progressPercent = Math.min(100, Math.round((count / Math.max(1, goal)) * 100));

  return (
    <div className="mt-2 flex flex-col items-center gap-1 animate-fade-in select-none">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-warm-200/80 shadow-sm backdrop-blur-sm">
        <button
          type="button"
          onClick={onLogWater}
          className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full transition-transform active:scale-95 ${
            isThirsty
              ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-sm animate-pulse'
              : 'bg-sky-50 hover:bg-sky-100 text-sky-700'
          }`}
          title="Log 1 glass of water"
        >
          <span>💧</span>
          <span>{isThirsty ? 'Drink water' : '+1 Glass'}</span>
        </button>

        <div className="flex items-center gap-1.5 pl-0.5 pr-1">
          <span className="text-xs font-semibold text-warm-800">
            {count} <span className="text-warm-400 font-normal">/ {goal}</span>
          </span>
          {isGoalMet && (
            <span className="text-[10px] bg-sage/20 text-sage-dark font-bold px-1.5 py-0.5 rounded-full" title="Goal reached!">
              ✨ Goal
            </span>
          )}
        </div>
      </div>

      {/* Subtle micro progress bar */}
      <div className="w-24 h-1 bg-warm-200/60 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            isGoalMet ? 'bg-sage' : 'bg-sky-400'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
