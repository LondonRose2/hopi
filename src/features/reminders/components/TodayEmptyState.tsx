import { CheckCircle2 } from 'lucide-react';

export function TodayEmptyState() {
  return (
    <div className="p-8 text-center rounded-pebble bg-white border border-[#EAE2D5] shadow-pebble space-y-2">
      <div className="w-12 h-12 mx-auto rounded-full bg-sage-soft flex items-center justify-center text-sage">
        <CheckCircle2 className="w-6 h-6 stroke-[2]" />
      </div>
      <h3 className="text-sm font-semibold text-warm-900">All done for today</h3>
      <p className="text-xs text-warm-500 max-w-xs mx-auto">
        Take a deep breath and enjoy your calm day. Mochi is proud of you.
      </p>
    </div>
  );
}
