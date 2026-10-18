import { useEffect, useRef, useState, useMemo } from 'react';
import { getAvatarConfig, type MochiState } from './avatarFrames';

export type { MochiState };

interface MochiAvatarProps {
  state?: MochiState;
  size?: number;
  className?: string;
  onClick?: () => void;
  onLongPress?: () => void;
  onDoubleTap?: () => void;
  speedMs?: number;
  title?: string;
  avatar?: string;
}

const DEFAULT_SPEEDS: Record<MochiState, number> = {
  idle: 170,
  wave: 150,
  sleep: 800,
  cheer: 130,
  sad: 340,
};

export function MochiAvatar({
  state = 'idle',
  size = 112,
  className = '',
  onClick,
  onLongPress,
  onDoubleTap,
  speedMs,
  title = 'Companion',
  avatar = 'mochi',
}: MochiAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const longPressTimer = useRef<any>(null);
  const lastTapRef = useRef<number>(0);
  const isPressing = useRef(false);

  const { spriteSrc, frames } = useMemo(() => getAvatarConfig(avatar), [avatar]);

  // Load sprite sheet whenever avatar changes
  useEffect(() => {
    setLoaded(false);
    const img = new Image();
    img.src = spriteSrc;
    img.onload = () => {
      imgRef.current = img;
      setLoaded(true);
    };
  }, [spriteSrc]);

  const activeFrames = useMemo(() => frames[state] || frames.idle, [frames, state]);
  const frameInterval = speedMs ?? DEFAULT_SPEEDS[state] ?? 160;

  // Frame sequencer: organic sleep with occasional breathing
  useEffect(() => {
    setFrameIndex(0);
    if (state === 'sleep') {
      let isBreathing = false;
      let timer: any;
      const scheduleNext = () => {
        isBreathing = !isBreathing;
        setFrameIndex(isBreathing ? 1 : 0);
        const nextDelay = isBreathing
          ? 650 + Math.random() * 300 // gentle breath
          : 2800 + Math.random() * 2400; // calm stillness
        timer = setTimeout(scheduleNext, nextDelay);
      };
      timer = setTimeout(scheduleNext, 2800);
      return () => clearTimeout(timer);
    }

    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % activeFrames.length);
    }, frameInterval);
    return () => clearInterval(interval);
  }, [state, activeFrames.length, frameInterval]);

  // Canvas drawer with device pixel ratio scaling
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !loaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0, 0, size, size);
    ctx.imageSmoothingEnabled = false;

    const currentFrame = activeFrames[frameIndex % activeFrames.length];
    if (!currentFrame) return;

    const scale = Math.min((size * 0.92) / currentFrame.sw, (size * 0.92) / currentFrame.sh);
    const dw = currentFrame.sw * scale;
    const dh = currentFrame.sh * scale;
    const dx = (size - dw) / 2;
    const dy = (size - dh) / 2;

    ctx.drawImage(img, currentFrame.sx, currentFrame.sy, currentFrame.sw, currentFrame.sh, dx, dy, dw, dh);
  }, [frameIndex, activeFrames, loaded, size]);

  const handlePointerDown = () => {
    isPressing.current = true;
    longPressTimer.current = setTimeout(() => {
      if (isPressing.current) {
        onLongPress?.();
      }
    }, 500);
  };

  const handlePointerUp = () => {
    isPressing.current = false;
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    const now = Date.now();
    if (now - lastTapRef.current < 380) {
      lastTapRef.current = 0;
      onDoubleTap?.();
    } else {
      lastTapRef.current = now;
      onClick?.();
    }
  };

  const handlePointerCancel = () => {
    isPressing.current = false;
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      title={title}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`relative inline-flex items-center justify-center cursor-pointer transition-transform active:scale-95 ${className}`}
      style={{ width: size, height: size }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="drop-shadow-[0_4px_10px_rgba(224,122,95,0.12)] pointer-events-none select-none"
      />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-warm-400">
          Loading...
        </div>
      )}
    </div>
  );
}
