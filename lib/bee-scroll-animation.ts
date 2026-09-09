import { pointAt, scrollProgressAtDistance, type SampledPath } from "@/lib/bee-path";

type ViewTimelineConstructor = new (options: {
  subject: Element;
  axis: "block";
  inset: string;
}) => AnimationTimeline;

export function createBeeScrollAnimation(
  subject: HTMLElement,
  bee: HTMLElement,
  face: HTMLElement,
  path: SampledPath,
  isMobile: boolean,
  size: number,
): Animation[] {
  const ViewTimeline = (window as unknown as { ViewTimeline?: ViewTimelineConstructor }).ViewTimeline;
  if (!ViewTimeline) return [];

  const animations: Animation[] = [];
  try {
    const timeline = new ViewTimeline({
      subject,
      axis: "block",
      inset: isMobile ? "20% 40%" : "40% 20%",
    });
    const count = Math.ceil(path.length / 4);
    const frames: Keyframe[] = [];
    const flips: Keyframe[] = [];
    let previousFlip = 1;
    for (let i = 0; i <= count; i++) {
      const distance = (i / count) * path.length;
      const point = pointAt(path, distance);
      const offset = scrollProgressAtDistance(i / count);
      frames.push({ offset, transform: `translate3d(${point.x - size / 2}px, ${point.y - size * 0.65}px, 0)` });
      const flip = pointAt(path, distance + 20).x < pointAt(path, distance - 20).x ? -1 : 1;
      if (i === 0 || flip !== previousFlip || i === count) {
        flips.push({ offset, transform: `scaleX(${flip})`, easing: "steps(1, end)" });
      }
      previousFlip = flip;
    }
    const options: KeyframeAnimationOptions = { timeline, fill: "both", duration: "auto" };
    animations.push(bee.animate(frames, options));
    animations.push(face.animate(flips, options));
    return animations;
  } catch {
    // Older engines can expose ViewTimeline without accepting it in animate().
    animations.forEach(animation => animation.cancel());
    return [];
  }
}
