import { Layers, ArrowRight, X } from 'lucide-react';

interface OverlayPermissionPromptProps {
  onRequestPermission: () => void;
  onDismiss: () => void;
}

export function OverlayPermissionPrompt({
  onRequestPermission,
  onDismiss,
}: OverlayPermissionPromptProps) {
  return (
    <div className="mx-4 mb-3 p-4 bg-[#FFFDF9] rounded-pebble border border-terracotta/30 shadow-pebble relative overflow-hidden animate-fade-in">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-terracotta via-sand to-sage" />
      <button
        type="button"
        onClick={onDismiss}
        className="absolute top-3 right-3 p-1 rounded-full text-warm-400 hover:text-warm-700 hover:bg-warm-100 transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3.5 pr-6">
        <div className="w-10 h-10 rounded-2xl bg-terracotta-soft text-terracotta flex items-center justify-center shrink-0 shadow-sm">
          <Layers className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-warm-900 tracking-tight">
            Enable Floating Companion ✨
          </h4>
          <p className="text-[11px] leading-relaxed text-warm-600">
            Allow Hopi to <strong>Display over other apps</strong> in Android settings so Mochi can gently float alongside you on your screen.
          </p>
        </div>
      </div>

      <div className="mt-3.5 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onDismiss}
          className="px-3 py-1.5 text-xs text-warm-500 hover:text-warm-700 font-medium rounded-lg"
        >
          Not now
        </button>
        <button
          type="button"
          onClick={onRequestPermission}
          className="px-3.5 py-1.5 text-xs font-semibold bg-terracotta hover:bg-terracotta-dark text-white rounded-lg shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
        >
          <span>Open Settings</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
