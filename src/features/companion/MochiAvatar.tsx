import { useEffect, useRef, useState, useMemo } from 'react';

export type MochiState = 'idle' | 'wave' | 'sleep' | 'cheer';

interface MochiAvatarProps {
  state?: MochiState;
  size?: number;
  className?: string;
  onClick?: () => void;
  speedMs?: number;
  title?: string;
}

interface Frame {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

const FRAMES: Record<MochiState, Frame[]> = {
  idle: [
    { sx: 2, sy: 7, sw: 81, sh: 79 },
    { sx: 89, sy: 7, sw: 80, sh: 79 },
    { sx: 174, sy: 7, sw: 81, sh: 79 },
    { sx: 261, sy: 7, sw: 79, sh: 79 },
    { sx: 346, sy: 7, sw: 81, sh: 79 },
    { sx: 432, sy: 7, sw: 81, sh: 79 },
    { sx: 518, sy: 7, sw: 81, sh: 79 },
  ],
  wave: [
    { sx: 4, sy: 287, sw: 78, sh: 77 },
    { sx: 88, sy: 287, sw: 82, sh: 77 },
    { sx: 175, sy: 287, sw: 80, sh: 77 },
    { sx: 260, sy: 287, sw: 81, sh: 77 },
  ],
  sleep: [
    { sx: 9, sy: 470, sw: 67, sh: 84 },
    { sx: 94, sy: 470, sw: 69, sh: 84 },
    { sx: 180, sy: 470, sw: 70, sh: 84 },
    { sx: 265, sy: 470, sw: 72, sh: 84 },
    { sx: 351, sy: 470, sw: 71, sh: 84 },
    { sx: 432, sy: 470, sw: 81, sh: 84 },
    { sx: 519, sy: 470, sw: 78, sh: 84 },
    { sx: 610, sy: 470, sw: 69, sh: 84 },
  ],
  cheer: [
    { sx: 2, sy: 563, sw: 81, sh: 85 },
    { sx: 88, sy: 563, sw: 81, sh: 85 },
    { sx: 174, sy: 563, sw: 81, sh: 85 },
    { sx: 260, sy: 563, sw: 81, sh: 85 },
    { sx: 347, sy: 563, sw: 79, sh: 85 },
    { sx: 432, sy: 563, sw: 81, sh: 85 },
  ],
};

const DEFAULT_SPEEDS: Record<MochiState, number> = {
  idle: 170,
  wave: 150,
  sleep: 280,
  cheer: 130,
};

export function MochiAvatar({
  state = 'idle',
  size = 112,
  className = '',
  onClick,
  speedMs,
  title = 'Mochi',
}: MochiAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load sprite sheet
  useEffect(() => {
    const img = new Image();
    img.src = '/mochi-sprites.png';
    img.onload = () => {
      imgRef.current = img;
      setLoaded(true);
    };
  }, []);

  const activeFrames = useMemo(() => FRAMES[state] || FRAMES.idle, [state]);
  const frameInterval = speedMs ?? DEFAULT_SPEEDS[state] ?? 160;

  // Frame sequencer
  useEffect(() => {
    setFrameIndex(0);
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

    ctx.drawImage(
      img,
      currentFrame.sx,
      currentFrame.sy,
      currentFrame.sw,
      currentFrame.sh,
      dx,
      dy,
      dw,
      dh
    );
  }, [frameIndex, activeFrames, loaded, size]);

  return (
    <div
      role="button"
      tabIndex={0}
      title={title}
      onClick={onClick}
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
