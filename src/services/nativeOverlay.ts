import { registerPlugin, Capacitor } from '@capacitor/core';

interface FloatingMochiPlugin {
  isOverlayPermissionGranted(): Promise<{ granted: boolean }>;
  requestOverlayPermission(): Promise<{ requested: boolean; alreadyGranted?: boolean }>;
  startOverlay(): Promise<{ success: boolean; reason?: string; error?: string }>;
  stopOverlay(): Promise<{ success: boolean; error?: string }>;
}

const NativeFloatingMochi = registerPlugin<FloatingMochiPlugin>('FloatingMochi');

export const floatingOverlayService = {
  isNativePlatform(): boolean {
    return Capacitor.isNativePlatform();
  },

  async isPermissionGranted(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return false;
    try {
      const res = await NativeFloatingMochi.isOverlayPermissionGranted();
      return res?.granted ?? false;
    } catch {
      return false;
    }
  },

  async requestPermission(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return false;
    try {
      const res = await NativeFloatingMochi.requestOverlayPermission();
      return res?.requested ?? false;
    } catch {
      return false;
    }
  },

  async setEnabled(enabled: boolean): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return false;
    try {
      if (enabled) {
        const res = await NativeFloatingMochi.startOverlay();
        return res?.success ?? false;
      } else {
        await NativeFloatingMochi.stopOverlay();
        return true;
      }
    } catch {
      return false;
    }
  },
};

