/**
 * Shared styling + defaults for react-hot-toast across the Reactime panel.
 *
 * Centralizing here so every toast matches the extension's theme tokens
 * (dark/light aware via CSS custom properties) and picks up changes in one place.
 * Positioning defaults to top-right to stay out of the way of the primary
 * left-column action list and bottom-row controls.
 */

import type { ToastOptions } from 'react-hot-toast';

export const REACTIME_TOAST_POSITION: ToastOptions['position'] = 'top-right';

/**
 * Base visual style used by all Reactime toasts. Uses CSS variables that
 * ThemeProvider sets, so the toast automatically matches the active theme.
 */
export const REACTIME_TOAST_STYLE: ToastOptions['style'] = {
  background: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  border: '1px solid var(--border-primary, rgba(255,255,255,0.08))',
};

/**
 * Icon colors for success toasts; keeps the green checkmark readable against
 * the themed background in both light and dark modes.
 */
export const REACTIME_TOAST_ICON_THEME: ToastOptions['iconTheme'] = {
  primary: 'var(--color-primary)',
  secondary: 'var(--text-primary)',
};

/**
 * Default options applied to every non-promise Reactime toast.
 * Individual call sites can override any field (e.g. longer duration for
 * errors, specific ids to dedupe repeat events).
 */
export const REACTIME_TOAST_DEFAULTS: ToastOptions = {
  duration: 3000,
  position: REACTIME_TOAST_POSITION,
  style: REACTIME_TOAST_STYLE,
  iconTheme: REACTIME_TOAST_ICON_THEME,
};
