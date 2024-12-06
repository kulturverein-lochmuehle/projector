import { retrieveValue, storeValue } from '../../utils/storage.utils.js';

export type Point = { x: number; y: number };
export type Square = { tl: Point; tr: Point; br: Point; bl: Point };

export const STORAGE_KEY = 'mask';

export function storePosition(position: Square) {
  storeValue(STORAGE_KEY, JSON.stringify(position));
}

export function defaultPosition(): Square {
  return {
    tl: { x: 10, y: 10 },
    tr: { x: 90, y: 10 },
    br: { x: 90, y: 90 },
    bl: { x: 10, y: 90 },
  };
}

export function readPosition(): Square | undefined {
  const position = retrieveValue(STORAGE_KEY);
  return position ? JSON.parse(position) : undefined;
}

export function updatePositionFromEvent(event: DragEvent, point: keyof Square): Point {
  const { offsetHeight, offsetWidth } = document.body;
  let x = (event.clientX / offsetWidth) * 100;
  let y = (event.clientY / offsetHeight) * 100;

  if (point.endsWith('l')) x = Math.max(0, x);
  if (point.endsWith('r')) x = Math.min(x, 100);
  if (point.startsWith('t')) y = Math.max(0, y);
  if (point.startsWith('b')) y = Math.min(y, 100);

  return { x, y };
}
