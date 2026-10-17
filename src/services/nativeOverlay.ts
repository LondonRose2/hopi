import { registerPlugin } from '@capacitor/core';

interface FloatingMochiPlugin {
  isOverlayPermissionGranted(): Promise<{ granted: boolean }>;
  requestOverlayPermission(): Promise<{ requested: boolean }>;
  startOverlay(): Promise<{ success: boolean; reason?: string }>;
  stopOverlay(): Promise<{ success: boolean }>;
}

const NativeFloatingMochi = registerPlugin<FloatingMochiPlugin>('FloatingMochi');

export const floatingOverlayService = {
  async setEnabled(enabled: boolean): Promise<boolean> {
    try {
      if (enabled) {
        const res = await NativeFloatingMochi.startOverlay();
        return res?.success ?? false;
      } else {
        await NativeFloatingMochi.stopOverlay();
        return true;
      }
    } catch {
      // In web browser or preview mode, fail gracefully
      return false;
    }
  },
};
