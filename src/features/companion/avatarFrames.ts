export type MochiState = 'idle' | 'wave' | 'sleep' | 'cheer' | 'sad';
export type AvatarId = 'mochi' | 'pip' | 'snowdrop';

export interface Frame {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

export interface AvatarFrameSet {
  idle: {
    still: Frame;
    blinkHalf: Frame;
    blinkClosed: Frame;
    curious: Frame;
    sniff: Frame;
  };
  sleep: {
    still: Frame;
    breath: Frame;
  };
  wave: Frame[];
  cheer: Frame[];
  sad: Frame[];
  walk: Frame[];
}

export const MOCHI_FRAMES: AvatarFrameSet = {
  idle: {
    still: { sx: 2, sy: 7, sw: 81, sh: 79 },
    blinkHalf: { sx: 89, sy: 7, sw: 81, sh: 79 },
    blinkClosed: { sx: 174, sy: 7, sw: 81, sh: 79 },
    curious: { sx: 87, sy: 748, sw: 83, sh: 86 },
    sniff: { sx: 87, sy: 658, sw: 83, sh: 80 },
  },
  sleep: {
    still: { sx: 432, sy: 470, sw: 81, sh: 84 },
    breath: { sx: 519, sy: 470, sw: 78, sh: 84 },
  },
  wave: [
    { sx: 4, sy: 287, sw: 78, sh: 77 },
    { sx: 88, sy: 287, sw: 82, sh: 77 },
    { sx: 175, sy: 287, sw: 80, sh: 77 },
    { sx: 260, sy: 287, sw: 81, sh: 77 },
  ],
  sad: [
    { sx: 9, sy: 470, sw: 67, sh: 84 },
    { sx: 94, sy: 470, sw: 69, sh: 84 },
    { sx: 180, sy: 470, sw: 70, sh: 84 },
    { sx: 94, sy: 470, sw: 69, sh: 84 },
  ],
  cheer: [
    { sx: 2, sy: 563, sw: 81, sh: 85 },
    { sx: 88, sy: 563, sw: 81, sh: 85 },
    { sx: 174, sy: 563, sw: 81, sh: 85 },
    { sx: 260, sy: 563, sw: 81, sh: 85 },
    { sx: 347, sy: 563, sw: 79, sh: 85 },
    { sx: 432, sy: 563, sw: 81, sh: 85 },
  ],
  walk: [
    { sx: 4, sy: 100, sw: 82, sh: 79 },
    { sx: 90, sy: 100, sw: 80, sh: 79 },
    { sx: 177, sy: 100, sw: 78, sh: 79 },
    { sx: 261, sy: 100, sw: 80, sh: 79 },
    { sx: 347, sy: 100, sw: 80, sh: 79 },
    { sx: 434, sy: 100, sw: 80, sh: 79 },
    { sx: 519, sy: 100, sw: 80, sh: 79 },
    { sx: 604, sy: 100, sw: 81, sh: 79 },
  ],
};

export const SNOWDROP_FRAMES: AvatarFrameSet = {
  idle: {
    still: { sx: 0, sy: 28, sw: 86, sh: 60 },
    blinkHalf: { sx: 86, sy: 28, sw: 86, sh: 60 },
    blinkClosed: { sx: 172, sy: 28, sw: 86, sh: 60 },
    curious: { sx: 86, sy: 775, sw: 86, sh: 60 },
    sniff: { sx: 86, sy: 682, sw: 86, sh: 60 },
  },
  sleep: {
    still: { sx: 516, sy: 868, sw: 86, sh: 58 }, // Flat on tummy, head on paws, eyes closed!
    breath: { sx: 602, sy: 868, sw: 86, sh: 58 }, // Gentle slumber breathing
  },
  wave: [
    { sx: 0, sy: 305, sw: 86, sh: 65 },
    { sx: 86, sy: 305, sw: 86, sh: 65 },
    { sx: 172, sy: 305, sw: 86, sh: 65 },
    { sx: 258, sy: 305, sw: 86, sh: 65 },
  ],
  sad: [
    { sx: 344, sy: 495, sw: 86, sh: 60 },
    { sx: 258, sy: 495, sw: 86, sh: 60 },
    { sx: 344, sy: 495, sw: 86, sh: 60 },
    { sx: 430, sy: 495, sw: 86, sh: 60 },
  ],
  cheer: [
    { sx: 0, sy: 375, sw: 86, sh: 86 },
    { sx: 86, sy: 375, sw: 86, sh: 86 },
    { sx: 172, sy: 375, sw: 86, sh: 86 },
    { sx: 258, sy: 375, sw: 86, sh: 86 },
    { sx: 344, sy: 375, sw: 86, sh: 86 },
  ],
  walk: [
    { sx: 0, sy: 125, sw: 86, sh: 58 },
    { sx: 86, sy: 125, sw: 86, sh: 58 },
    { sx: 172, sy: 125, sw: 86, sh: 58 },
    { sx: 258, sy: 125, sw: 86, sh: 58 },
    { sx: 344, sy: 125, sw: 86, sh: 58 },
    { sx: 430, sy: 125, sw: 86, sh: 58 },
    { sx: 516, sy: 125, sw: 86, sh: 58 },
    { sx: 602, sy: 125, sw: 86, sh: 58 },
  ],
};

export const PIP_FRAMES: AvatarFrameSet = {
  idle: {
    still: { sx: 0, sy: 15, sw: 86, sh: 74 },
    blinkHalf: { sx: 86, sy: 15, sw: 86, sh: 74 },
    blinkClosed: { sx: 258, sy: 15, sw: 86, sh: 74 },
    curious: { sx: 86, sy: 760, sw: 86, sh: 74 },
    sniff: { sx: 86, sy: 667, sw: 86, sh: 74 },
  },
  sleep: {
    still: { sx: 344, sy: 854, sw: 86, sh: 74 }, // Tucked down, eyes closed curled pose!
    breath: { sx: 258, sy: 854, sw: 86, sh: 74 }, // Gentle soft slumber breath
  },
  wave: [
    { sx: 0, sy: 292, sw: 86, sh: 76 },
    { sx: 86, sy: 292, sw: 86, sh: 76 },
    { sx: 172, sy: 292, sw: 86, sh: 76 },
    { sx: 258, sy: 292, sw: 86, sh: 76 },
  ],
  sad: [
    { sx: 0, sy: 667, sw: 86, sh: 74 },
    { sx: 86, sy: 667, sw: 86, sh: 74 },
    { sx: 172, sy: 667, sw: 86, sh: 74 },
    { sx: 86, sy: 667, sw: 86, sh: 74 },
  ],
  cheer: [
    { sx: 0, sy: 375, sw: 86, sh: 86 },
    { sx: 86, sy: 375, sw: 86, sh: 86 },
    { sx: 172, sy: 375, sw: 86, sh: 86 },
    { sx: 258, sy: 375, sw: 86, sh: 86 },
    { sx: 344, sy: 375, sw: 86, sh: 86 },
  ],
  walk: [
    { sx: 0, sy: 105, sw: 86, sh: 77 },
    { sx: 86, sy: 105, sw: 86, sh: 77 },
    { sx: 172, sy: 105, sw: 86, sh: 77 },
    { sx: 258, sy: 105, sw: 86, sh: 77 },
    { sx: 344, sy: 105, sw: 86, sh: 77 },
    { sx: 430, sy: 105, sw: 86, sh: 77 },
    { sx: 516, sy: 105, sw: 86, sh: 77 },
    { sx: 602, sy: 105, sw: 86, sh: 77 },
  ],
};

export const AVATAR_SPRITE_PATHS: Record<AvatarId, string> = {
  mochi: '/mochi-sprites.png',
  pip: '/pip-sprites.png',
  snowdrop: '/snowdrop-sprites.png',
};

export function getAvatarConfig(avatarChoice?: string) {
  let id: AvatarId = 'mochi';
  if (avatarChoice === 'penguin' || avatarChoice === 'pip') id = 'pip';
  else if (avatarChoice === 'snowdrop') id = 'snowdrop';

  const frameSets: Record<AvatarId, AvatarFrameSet> = {
    mochi: MOCHI_FRAMES,
    snowdrop: SNOWDROP_FRAMES,
    pip: PIP_FRAMES,
  };

  return {
    id,
    spriteSrc: AVATAR_SPRITE_PATHS[id],
    frameSet: frameSets[id],
  };
}
