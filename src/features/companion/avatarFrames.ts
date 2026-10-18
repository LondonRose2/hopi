export type MochiState = 'idle' | 'wave' | 'sleep' | 'cheer' | 'sad';
export type AvatarId = 'mochi' | 'pip' | 'snowdrop';

export interface Frame {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

const MOCHI_FRAMES: Record<MochiState, Frame[]> = {
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
    { sx: 432, sy: 470, sw: 81, sh: 84 },
    { sx: 519, sy: 470, sw: 78, sh: 84 },
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
};

const STANDARD_GRID_FRAMES: Record<MochiState, Frame[]> = {
  idle: [
    { sx: 0, sy: 0, sw: 86, sh: 95 },
    { sx: 86, sy: 0, sw: 86, sh: 95 },
    { sx: 172, sy: 0, sw: 86, sh: 95 },
    { sx: 258, sy: 0, sw: 86, sh: 95 },
    { sx: 344, sy: 0, sw: 86, sh: 95 },
    { sx: 430, sy: 0, sw: 86, sh: 95 },
  ],
  wave: [
    { sx: 0, sy: 282, sw: 86, sh: 90 },
    { sx: 86, sy: 282, sw: 86, sh: 90 },
    { sx: 172, sy: 282, sw: 86, sh: 90 },
    { sx: 258, sy: 282, sw: 86, sh: 90 },
  ],
  sleep: [
    { sx: 430, sy: 465, sw: 86, sh: 93 }, // peaceful slumber
    { sx: 516, sy: 465, sw: 86, sh: 93 }, // gentle breathing
  ],
  sad: [
    { sx: 0, sy: 652, sw: 86, sh: 93 },
    { sx: 86, sy: 652, sw: 86, sh: 93 },
    { sx: 172, sy: 652, sw: 86, sh: 93 },
    { sx: 86, sy: 652, sw: 86, sh: 93 },
  ],
  cheer: [
    { sx: 0, sy: 372, sw: 86, sh: 93 },
    { sx: 86, sy: 372, sw: 86, sh: 93 },
    { sx: 172, sy: 372, sw: 86, sh: 93 },
    { sx: 258, sy: 372, sw: 86, sh: 93 },
    { sx: 344, sy: 372, sw: 86, sh: 93 },
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

  return {
    id,
    spriteSrc: AVATAR_SPRITE_PATHS[id],
    frames: id === 'mochi' ? MOCHI_FRAMES : STANDARD_GRID_FRAMES,
  };
}
