/**
 * Semantic color style utilities — typed references to CSS custom properties.
 * Mirrors straitsx-frontend's shared/ColorStyles.ts pattern but backed by
 * CSS variables instead of hardcoded hex values.
 */

export const TEXT_COLORS = {
  PRIMARY: "var(--text-primary)",
  SECONDARY: "var(--text-secondary)",
  INVERSE: "var(--text-inverse)",
  LINK: "var(--link)",
} as const;

export const BACKGROUND_COLORS = {
  DEFAULT: "var(--background)",
  SURFACE: "var(--surface)",
  SURFACE_SECONDARY: "var(--surface-secondary)",
} as const;

export const STATUS_COLORS = {
  POSITIVE: "var(--status-positive)",
  CRITICAL: "var(--status-critical)",
  WARNING: "var(--status-warning)",
  INFORMATION: "var(--status-information)",
} as const;

export const INTERACTIVE_COLORS = {
  ACTIVE: "var(--interactive-active)",
  HOVERED: "var(--surface-hovered)",
  PRESSED: "var(--surface-pressed)",
  DISABLED_SURFACE: "var(--surface-disabled)",
  DISABLED_ON_SURFACE: "var(--disabled-on-surface)",
} as const;
