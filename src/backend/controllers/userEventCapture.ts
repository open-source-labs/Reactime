/**
 * Captures the last user interaction (click) in the target page so we can
 * attach it to snapshots and show a "laser pointer" replay when time traveling.
 * Uses viewport coordinates (clientX, clientY) for the overlay.
 */

export interface LastUserEvent {
  type: 'click';
  x: number;
  y: number;
  timestamp: number;
}

let lastUserEvent: LastUserEvent | null = null;

function handleClick(e: MouseEvent): void {
  lastUserEvent = {
    type: 'click',
    x: e.clientX,
    y: e.clientY,
    timestamp: Date.now(),
  };
}

/**
 * Returns the most recent user click event (viewport coordinates).
 * Used when building a snapshot payload so we can show where the user clicked.
 */
export function getLastUserEvent(): LastUserEvent | null {
  return lastUserEvent ? { ...lastUserEvent } : null;
}

/**
 * Attach document-level click listener. Call once when the backend initializes.
 */
export function initUserEventCapture(): void {
  if (typeof document === 'undefined') return;
  document.addEventListener('click', handleClick, true);
}
