export var documentRef = {
  current: typeof document === 'undefined' ? null : document
};
export var windowRef = {
  current: typeof window === 'undefined' ? null : window
};
export { default as EventListener } from './EventListener';
export * from './types';
export { default as useEventListener } from './useEventListener';