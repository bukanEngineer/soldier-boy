/**
 * Elevation / shadow tokens — mirrors Figma "Shadow/lv-1..3".
 * Maps to CSS custom properties defined in tokens.css.
 */

export const SHADOW = {
  /** Subtle raised surface (cards, dropdowns) */
  LEVEL_1: "var(--shadow-1)",
  /** Medium elevation (floating menus, popovers) */
  LEVEL_2: "var(--shadow-2)",
  /** High elevation (modals, dialogs) */
  LEVEL_3: "var(--shadow-3)",
} as const;

/** Corner radius tokens */
export const RADIUS = {
  SM: "var(--radius-sm)", // 4px — tags, chips
  MD: "var(--radius-md)", // 8px — inputs, smaller cards
  LG: "var(--radius-lg)", // 12px — modals, larger cards
  FULL: "var(--radius-full)", // 999px — pills, buttons, badges
} as const;

/** Motion / easing tokens */
export const MOTION = {
  EASE: "var(--ease)",
  DURATION_FAST: "var(--dur-1)", // 120ms
  DURATION_NORMAL: "var(--dur-2)", // 200ms
  DURATION_SLOW: "var(--dur-3)", // 320ms
} as const;
