export type Point = { x: number; y: number };

export type SampledPath = {
  points: Point[];
  length: number;
};

export function pointAt(path: SampledPath, distance: number): Point {
  const index = Math.max(0, Math.min(1, distance / path.length)) * (path.points.length - 1);
  const low = Math.floor(index);
  const a = path.points[low];
  const b = path.points[Math.min(low + 1, path.points.length - 1)];
  const t = index - low;
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

export function easeBeeProgress(value: number): number {
  const t = Math.max(0, Math.min(1, value));
  const edge = 0.15;
  const total = 1 - edge;
  if (t < edge) return (t * t) / (2 * edge * total);
  if (t > 1 - edge) return 1 - ((1 - t) ** 2) / (2 * edge * total);
  return (t - edge / 2) / total;
}

// Keyframe offsets use scroll progress; points use distance along the path.
export function scrollProgressAtDistance(progress: number): number {
  const edge = 0.15;
  const total = 1 - edge;
  const threshold = edge / (2 * total);
  if (progress < threshold) return Math.sqrt(progress * 2 * edge * total);
  if (progress > 1 - threshold) return 1 - Math.sqrt((1 - progress) * 2 * edge * total);
  return progress * total + edge / 2;
}
