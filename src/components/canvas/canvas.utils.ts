import { retrieveValue, storeValue } from '../../utils/storage.utils.js';

export interface Center {
  x: number;
  y: number;
  size: number;
}

export const STORAGE_KEY = 'canvas';

export function storeCenter(center: Center) {
  storeValue(STORAGE_KEY, JSON.stringify(center));
}

export function defaultCenter(): Center {
  return { x: 50, y: 50, size: 100 };
}

export function readCenter(): Center | undefined {
  const center = retrieveValue(STORAGE_KEY);
  return center ? JSON.parse(center) : undefined;
}

export function diffCenter(event: DragEvent): Omit<Center, 'size'> {
  const { offsetHeight, offsetWidth } = document.body;
  const media = event.currentTarget as HTMLElement;
  const { left, top, height, width } = media.getBoundingClientRect();

  const mediaCenter = {
    x: ((left + width / 2) / offsetWidth) * 100,
    y: ((top + height / 2) / offsetHeight) * 100,
  };
  const mouseCenter = {
    x: (event.clientX / offsetWidth) * 100,
    y: (event.clientY / offsetHeight) * 100,
  };

  return {
    x: mouseCenter.x - mediaCenter.x,
    y: mouseCenter.y - mediaCenter.y,
  };
}

export function calculateCenter(
  event: DragEvent,
  delta: Omit<Center, 'size'>,
): Omit<Center, 'size'> {
  const { offsetHeight, offsetWidth } = document.body;
  const mouseCenter = {
    x: (event.clientX / offsetWidth) * 100,
    y: (event.clientY / offsetHeight) * 100,
  };

  return {
    x: mouseCenter.x - (delta?.x ?? 0),
    y: mouseCenter.y - (delta?.y ?? 0),
  };
}
