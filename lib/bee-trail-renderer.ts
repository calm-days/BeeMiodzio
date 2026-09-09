import { pointAt, type SampledPath } from "@/lib/bee-path";

const TILE_HEIGHT = 256;
const DASH = 6;
const PERIOD = 18;
const STROKE = 4;

type Dash = { start: number; end: number; shape: Path2D };
type Tile = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  top: number;
  dashes: Dash[];
};

function segment(path: SampledPath, start: number, end: number): Path2D {
  const shape = new Path2D();
  const first = pointAt(path, start);
  shape.moveTo(first.x, first.y);
  const step = path.length / (path.points.length - 1);
  for (let i = Math.floor(start / step) + 1; i * step < end; i++) {
    const point = path.points[i];
    shape.lineTo(point.x, point.y);
  }
  const last = pointAt(path, end);
  shape.lineTo(last.x, last.y);
  return shape;
}

// Only tiles containing the changed end of the trail are repainted. Completed
// parts remain rasterized at device resolution, without a section-sized SVG mask.
export function createBeeTrailRenderer(host: HTMLElement, path: SampledPath) {
  const minX = Math.floor(Math.min(...path.points.map(p => p.x)) - STROKE);
  const maxX = Math.ceil(Math.max(...path.points.map(p => p.x)) + STROKE);
  const width = maxX - minX;
  const dpr = window.devicePixelRatio || 1;
  const color = getComputedStyle(host).color;
  const tiles = new Map<number, Tile>();
  const dashTiles = new Map<number, Set<Tile>>();

  for (let start = 0; start < path.length; start += PERIOD) {
    const end = Math.min(start + DASH, path.length);
    const dash = { start, end, shape: segment(path, start, end) };
    const a = pointAt(path, start);
    const b = pointAt(path, end);
    // Arc length bounds any intermediate curve excursion between the endpoints.
    const firstTile = Math.floor((Math.min(a.y, b.y) - DASH - STROKE) / TILE_HEIGHT);
    const lastTile = Math.floor((Math.max(a.y, b.y) + DASH + STROKE) / TILE_HEIGHT);
    const memberships = new Set<Tile>();
    for (let index = firstTile; index <= lastTile; index++) {
      let tile = tiles.get(index);
      if (!tile) {
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(width * dpr);
        canvas.height = Math.ceil(TILE_HEIGHT * dpr);
        canvas.style.cssText = `position:absolute;left:${minX}px;top:${index * TILE_HEIGHT}px;width:${width}px;height:${TILE_HEIGHT}px;contain:strict;`;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas 2D is unavailable");
        tile = { canvas, context, top: index * TILE_HEIGHT, dashes: [] };
        tiles.set(index, tile);
        host.append(canvas);
      }
      tile.dashes.push(dash);
      memberships.add(tile);
    }
    dashTiles.set(start / PERIOD, memberships);
  }

  let previous = 0;
  return {
    draw(distance: number) {
      const revealed = Math.max(0, Math.min(path.length, distance));
      if (revealed === previous) return;
      const dirty = new Set<Tile>();
      const from = Math.floor(Math.min(previous, revealed) / PERIOD);
      const to = Math.floor(Math.max(previous, revealed) / PERIOD);
      for (let i = from; i <= to; i++) {
        // Scrolling within a gap doesn't change any painted pixels.
        if (i * PERIOD >= Math.max(previous, revealed) || i * PERIOD + DASH <= Math.min(previous, revealed)) continue;
        dashTiles.get(i)?.forEach(tile => dirty.add(tile));
      }
      for (const tile of dirty) {
        const { context, canvas } = tile;
        context.resetTransform();
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.setTransform(dpr, 0, 0, dpr, -minX * dpr, -tile.top * dpr);
        context.strokeStyle = color;
        context.lineWidth = STROKE;
        context.lineCap = "round";
        context.lineJoin = "round";
        for (const dash of tile.dashes) {
          if (dash.start >= revealed) break;
          context.stroke(dash.end <= revealed ? dash.shape : segment(path, dash.start, revealed));
        }
      }
      previous = revealed;
    },
    destroy() {
      for (const { canvas } of tiles.values()) canvas.remove();
    },
  };
}
