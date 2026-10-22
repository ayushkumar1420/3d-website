export type SceneMotion = {
  scroll: number;
  transition: number;
  spin: number;
  rotation: number;
  dragging: boolean;
  paused: boolean;
  reducedMotion: boolean;
};

export function smoothstep(min: number, max: number, value: number) {
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return t * t * (3 - 2 * t);
}
