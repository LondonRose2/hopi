import { EMOJI_OPTIONS } from '../types';

interface EmojiGridProps {
  selected: string;
  onSelect: (emoji: string) => void;
}

export function EmojiGrid({ selected, onSelect }: EmojiGridProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-warm-600 mb-1">Choose Icon</label>
      <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5 max-h-32 overflow-y-auto p-1.5 rounded-xl border border-warm-200 bg-warm-50/40">
        {EMOJI_OPTIONS.map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => onSelect(item)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-transform ${
              selected === item ? 'bg-terracotta-soft border-2 border-terracotta scale-105' : 'bg-white border border-warm-200 hover:bg-warm-100'
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
