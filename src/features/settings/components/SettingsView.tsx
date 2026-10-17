import { Moon, Sparkles, Bell, Layers, Check } from 'lucide-react';
import type { AppSettings } from '../types';
import { floatingOverlayService } from '../../../services/nativeOverlay';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdate: (newSettings: Partial<AppSettings>) => void;
}

export function SettingsView({ settings, onUpdate }: SettingsViewProps) {
  const toggleRow = (label: string, desc: string, icon: React.ReactNode, value: boolean, key: keyof AppSettings) => (
    <div className="flex items-center justify-between p-3.5 bg-white rounded-pebble border border-[#EAE2D5] shadow-pebble">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-warm-100 flex items-center justify-center text-warm-600 shrink-0">{icon}</div>
        <div>
          <p className="text-xs font-semibold text-warm-900">{label}</p>
          <p className="text-[11px] text-warm-500">{desc}</p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={async () => {
          const next = !value;
          if (key === 'floatingCompanion') {
            const isNative = floatingOverlayService.isNativePlatform();
            if (next && isNative && !(await floatingOverlayService.isPermissionGranted())) {
              await floatingOverlayService.requestPermission();
            } else {
              await floatingOverlayService.setEnabled(next);
            }
          }
          onUpdate({ [key]: next });
        }}
        className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${value ? 'bg-sage' : 'bg-warm-200'}`}
      ><div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`} /></button>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Avatar Choice */}
      <div className="p-4 bg-white rounded-pebble border border-[#EAE2D5] shadow-pebble space-y-2.5">
        <label className="text-xs font-semibold text-warm-900 block">Companion Character</label>
        <div className="grid grid-cols-2 gap-2">
          {(['rabbit', 'penguin'] as const).map((avatar) => (
            <button
              key={avatar}
              type="button"
              onClick={() => onUpdate({ avatarChoice: avatar })}
              className={`p-3 rounded-xl border flex items-center justify-between capitalize text-xs font-medium transition-all ${
                settings.avatarChoice === avatar
                  ? 'border-terracotta bg-terracotta-soft text-warm-900 font-semibold'
                  : 'border-warm-200 bg-warm-50/50 text-warm-600 hover:bg-warm-100'
              }`}
            >
              <span>{avatar === 'rabbit' ? '🐰 Mochi (Rabbit)' : '🐧 Pip (Penguin)'}</span>
              {settings.avatarChoice === avatar && <Check className="w-4 h-4 text-terracotta stroke-[2.5]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Sleep Mode Hours */}
      <div className="p-4 bg-white rounded-pebble border border-[#EAE2D5] shadow-pebble space-y-2.5">
        <div className="flex items-center gap-2">
          <Moon className="w-4 h-4 text-warm-500" />
          <h3 className="text-xs font-semibold text-warm-900">Sleep Schedule</h3>
        </div>
        <p className="text-[11px] text-warm-500">During rest hours, Mochi sleeps peacefully and alerts remain silent.</p>
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div>
            <span className="text-[10px] uppercase font-bold text-warm-400 block mb-1">Rest From</span>
            <input type="text" value={settings.sleepStart} onChange={(e) => onUpdate({ sleepStart: e.target.value })} className="w-full px-3 py-1.5 text-xs rounded-lg border border-warm-200 bg-warm-50/50 text-warm-900" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-warm-400 block mb-1">Wake At</span>
            <input type="text" value={settings.sleepEnd} onChange={(e) => onUpdate({ sleepEnd: e.target.value })} className="w-full px-3 py-1.5 text-xs rounded-lg border border-warm-200 bg-warm-50/50 text-warm-900" />
          </div>
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-2">
        {toggleRow('Encouragements', 'Heartwarming micro-affirmations', <Sparkles className="w-4 h-4" />, settings.encouragements, 'encouragements')}
        {toggleRow('Gentle Notifications', 'Timely reminder alerts', <Bell className="w-4 h-4" />, settings.notifications, 'notifications')}
        {toggleRow('Floating Companion', 'Keep Mochi visible over other apps', <Layers className="w-4 h-4" />, settings.floatingCompanion, 'floatingCompanion')}
      </div>
    </div>
  );
}
