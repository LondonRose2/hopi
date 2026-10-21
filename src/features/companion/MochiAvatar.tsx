import { useEffect, useRef, useState, useMemo } from 'react';
import { getAvatarConfig, type MochiState, type Frame } from './avatarFrames';

export type { MochiState };

interface MochiAvatarProps {
  state?: MochiState;
  size?: number;
  className?: string;
  onClick?: () => void;
  onLongPress?: () => void;
  onDoubleTap?: () => void;
  title?: string;
  avatar?: string;
  hasAlert?: boolean;
}

export function MochiAvatar({
  state = 'idle',
  size = 112,
  className = '',
  onClick,
  onLongPress,
  onDoubleTap,
  title = 'Companion',
  avatar = 'mochi',
  hasAlert = false,
}: MochiAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentFrame, setCurrentFrame] = useState<Frame | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const longPressTimer = useRef<any>(null);
  const lastTapRef = useRef<number>(0);
  const isPressing = useRef(false);

  const { spriteSrc, frameSet } = useMemo(() => getAvatarConfig(avatar), [avatar]);

  useEffect(() => {
    setLoaded(false);
    const img = new Image();
    img.src = spriteSrc;
    img.onload = () => { imgRef.current = img; setLoaded(true); };
  }, [spriteSrc]);

  // Organic frame sequencer (varied, calm, non-repetitive)
  useEffect(() => {
    let active = true;
    const timeouts: any[] = [];
    const addTimeout = (fn: () => void, ms: number) => {
      if (!active) return;
      timeouts.push(setTimeout(() => { if (active) fn(); }, ms));
    };

    if (state === 'idle') {
      setCurrentFrame(frameSet.idle.still);
      const scheduleIdleAction = () => {
        if (!active) return;
        const roll = Math.random();
        if (roll < 0.45) {
          // Single natural blink (calm and brief)
          setCurrentFrame(frameSet.idle.blinkHalf);
          addTimeout(() => {
            setCurrentFrame(frameSet.idle.blinkClosed);
            addTimeout(() => {
              setCurrentFrame(frameSet.idle.still);
              addTimeout(scheduleIdleAction, 3800 + Math.random() * 2400);
            }, 110);
          }, 60);
        } else if (roll < 0.65) {
          // Double blink
          setCurrentFrame(frameSet.idle.blinkClosed);
          addTimeout(() => {
            setCurrentFrame(frameSet.idle.still);
            addTimeout(() => {
              setCurrentFrame(frameSet.idle.blinkClosed);
              addTimeout(() => {
                setCurrentFrame(frameSet.idle.still);
                addTimeout(scheduleIdleAction, 4000 + Math.random() * 2600);
              }, 90);
            }, 70);
          }, 90);
        } else if (roll < 0.82) {
          // Curious head-tilt
          setCurrentFrame(frameSet.idle.curious);
          addTimeout(() => {
            setCurrentFrame(frameSet.idle.still);
            addTimeout(scheduleIdleAction, 3600 + Math.random() * 2200);
          }, 1200);
        } else {
          // Sniff / wing wiggle / groom
          setCurrentFrame(frameSet.idle.sniff);
          addTimeout(() => {
            setCurrentFrame(frameSet.idle.still);
            addTimeout(scheduleIdleAction, 3600 + Math.random() * 2200);
          }, 1200);
        }
      };
      addTimeout(scheduleIdleAction, 3000 + Math.random() * 1800);
    } else if (state === 'sleep') {
      setCurrentFrame(frameSet.sleep.still);
      const scheduleSleepCycle = () => {
        if (!active) return;
        setCurrentFrame(frameSet.sleep.breath);
        addTimeout(() => {
          setCurrentFrame(frameSet.sleep.still);
          addTimeout(scheduleSleepCycle, 3000 + Math.random() * 2400);
        }, 750);
      };
      addTimeout(scheduleSleepCycle, 3000 + Math.random() * 1800);
    } else {
      const actionFrames = frameSet[state] || frameSet.wave;
      let frameIdx = 0;
      setCurrentFrame(actionFrames[0]);
      const interval = setInterval(() => {
        frameIdx = (frameIdx + 1) % actionFrames.length;
        setCurrentFrame(actionFrames[frameIdx]);
      }, state === 'sad' ? 340 : 140);
      return () => { active = false; clearInterval(interval); timeouts.forEach(clearTimeout); };
    }

    return () => { active = false; timeouts.forEach(clearTimeout); };
  }, [state, frameSet]);

  // Canvas drawer with fixed baseline anchoring (no bouncing or scaling shifts)
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !loaded || !currentFrame) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    ctx.imageSmoothingEnabled = false;

    // Anchor with fixed reference scale and bottom ground alignment
    const refH = 84;
    const scale = (size * 0.90) / refH;
    const dw = currentFrame.sw * scale;
    const dh = currentFrame.sh * scale;
    const dx = (size - dw) / 2;
    const dy = (size - dh); // Pinned to bottom baseline so body never jumps
    ctx.drawImage(img, currentFrame.sx, currentFrame.sy, currentFrame.sw, currentFrame.sh, dx, dy, dw, dh);
  }, [currentFrame, loaded, size]);

  const handlePointerDown = () => {
    isPressing.current = true;
    longPressTimer.current = setTimeout(() => { if (isPressing.current) onLongPress?.(); }, 320);
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

  return (
    <div
      role="button"
      tabIndex={0}
      title={title}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => { isPressing.current = false; if (longPressTimer.current) clearTimeout(longPressTimer.current); }}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); } }}
      className={`relative inline-flex items-center justify-center cursor-pointer transition-transform active:scale-95 ${className}`}
      style={{ width: size, height: size }}
    >
      <canvas ref={canvasRef} style={{ width: size, height: size }} className="drop-shadow-[0_4px_10px_rgba(224,122,95,0.12)] pointer-events-none select-none" />
      {hasAlert && (
        <span
          className="absolute top-1 right-2 w-3.5 h-3.5 bg-terracotta-500 border-2 border-white rounded-full shadow-sm animate-pulse pointer-events-none z-10"
          title="Overdue task pending"
        />
      )}
      {!loaded && <div className="absolute inset-0 flex items-center justify-center text-xs text-warm-400">Loading...</div>}
    </div>
  );
}
