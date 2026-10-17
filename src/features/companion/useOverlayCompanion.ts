import { useState, useEffect, useCallback } from 'react';
import { floatingOverlayService } from '../../services/nativeOverlay';

interface UseOverlayCompanionOptions {
  enabled: boolean;
}

export function useOverlayCompanion({ enabled }: UseOverlayCompanionOptions) {
  const [isNative] = useState(() => floatingOverlayService.isNativePlatform());
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const checkPermissionAndSync = useCallback(async () => {
    if (!floatingOverlayService.isNativePlatform()) return;
    const granted = await floatingOverlayService.isPermissionGranted();
    setPermissionGranted(granted);

    if (granted && enabled) {
      await floatingOverlayService.setEnabled(true);
    }
  }, [enabled]);

  // Initial check & auto-start on mount
  useEffect(() => {
    checkPermissionAndSync();
  }, [checkPermissionAndSync]);

  // Re-check when user navigates back to Hopi from Android Settings
  useEffect(() => {
    const handleResume = () => {
      if (document.visibilityState === 'visible') {
        checkPermissionAndSync();
      }
    };

    document.addEventListener('visibilitychange', handleResume);
    window.addEventListener('focus', handleResume);
    return () => {
      document.removeEventListener('visibilitychange', handleResume);
      window.removeEventListener('focus', handleResume);
    };
  }, [checkPermissionAndSync]);

  // Sync when enabled toggle changes
  useEffect(() => {
    if (!floatingOverlayService.isNativePlatform()) return;
    if (enabled && permissionGranted) {
      floatingOverlayService.setEnabled(true);
    } else if (!enabled) {
      floatingOverlayService.setEnabled(false);
    }
  }, [enabled, permissionGranted]);

  const requestPermission = useCallback(async () => {
    await floatingOverlayService.requestPermission();
  }, []);

  const dismissPrompt = useCallback(() => {
    setDismissed(true);
  }, []);

  return {
    isNative,
    permissionGranted,
    showPrompt: isNative && enabled && !permissionGranted && !dismissed,
    requestPermission,
    dismissPrompt,
    recheck: checkPermissionAndSync,
  };
}
