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
        if (roll < 0.60) {
          // Single natural blink
          setCurrentFrame(frameSet.idle.blinkHalf);
          addTimeout(() => {
            setCurrentFrame(frameSet.idle.blinkClosed);
            addTimeout(() => {
              setCurrentFrame(frameSet.idle.still);
              addTimeout(scheduleIdleAction, 2400 + Math.random() * 2600);
            }, 130);
          }, 70);
        } else if (roll < 0.80) {
          // Double blink
          setCurrentFrame(frameSet.idle.blinkClosed);
          addTimeout(() => {
            setCurrentFrame(frameSet.idle.still);
            addTimeout(() => {
              setCurrentFrame(frameSet.idle.blinkClosed);
              addTimeout(() => {
                setCurrentFrame(frameSet.idle.still);
                addTimeout(scheduleIdleAction, 2600 + Math.random() * 2800);
              }, 110);
            }, 90);
          }, 120);
        } else if (roll < 0.90) {
          // Curious head tilt
          setCurrentFrame(frameSet.idle.curious);
          addTimeout(() => {
            setCurrentFrame(frameSet.idle.still);
            addTimeout(scheduleIdleAction, 2800 + Math.random() * 2400);
          }, 650);
        } else {
          // Gentle groom / sniff
          setCurrentFrame(frameSet.idle.sniff);
          addTimeout(() => {
            setCurrentFrame(frameSet.idle.still);
            addTimeout(scheduleIdleAction, 2800 + Math.random() * 2400);
          }, 650);
        }
      };
      addTimeout(scheduleIdleAction, 2200 + Math.random() * 1500);
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

  // Canvas drawer
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

    const scale = Math.min((size * 0.92) / currentFrame.sw, (size * 0.92) / currentFrame.sh);
    const dw = currentFrame.sw * scale;
    const dh = currentFrame.sh * scale;
    ctx.drawImage(img, currentFrame.sx, currentFrame.sy, currentFrame.sw, currentFrame.sh, (size - dw) / 2, (size - dh) / 2, dw, dh);
  }, [currentFrame, loaded, size]);

  const handlePointerDown = () => {
    isPressing.current = true;
    longPressTimer.current = setTimeout(() => { if (isPressing.current) onLongPress?.(); }, 500);
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
      {!loaded && <div className="absolute inset-0 flex items-center justify-center text-xs text-warm-400">Loading...</div>}
    </div>
  );
}
