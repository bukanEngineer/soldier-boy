/**
 * Color primitives — mirrors Figma "Brand Color/*" palette.
 * Components should NOT use these directly. Use the semantic layer
 * (theme.ts / CSS custom properties) instead.
 */

// ── Brand primitives ──
export const BRAND = {
  VIBRANT_GREEN: "#00d37e",
  STABLE_DEEP_IVY: "#002b2a",
  SECURE_TEAL: "#054948",
  WEALTHY_GOLD: "#b59b58",
  CREDIBLE_BLUE: "#187d97",
  SEAMLESS_MINT: "#79ffca",
  INNOVATIVE_GREY: "#d8d8d8",
  MODERN_LIGHT_GREY: "#f0f0f0",
} as const;

// ── Stablecoin marks ──
export const STABLECOIN = {
  XSGD: "#0e3fc7",
  XIDR: "#df1312",
  XUSD: "#257c58",
} as const;

// ── Semantic: Base Color ──
export const BASE_COLOR = {
  PRIMARY: "var(--primary)",
  INTERACTIVE_ACTIVE: "var(--interactive-active)",
  TEXT_PRIMARY: "var(--text-primary)",
  TEXT_SECONDARY: "var(--text-secondary)",
  TEXT_INVERSE: "var(--text-inverse)",
  BORDER: "var(--border)",
  LINK: "var(--link)",
  OVERLAY: "var(--overlay)",
  ON_CONTAINER: "var(--on-container)",
} as const;

// ── Semantic: Background & Surface ──
export const BACKGROUND = {
  DEFAULT: "var(--background)",
  SURFACE: "var(--surface)",
  SURFACE_SECONDARY: "var(--surface-secondary)",
  SURFACE_DISABLED: "var(--surface-disabled)",
  DISABLED_ON_SURFACE: "var(--disabled-on-surface)",
  SURFACE_HOVERED: "var(--surface-hovered)",
  SURFACE_PRESSED: "var(--surface-pressed)",
} as const;

// ── Semantic: Status ──
export const STATUS = {
  POSITIVE: "var(--status-positive)",
  CRITICAL: "var(--status-critical)",
  WARNING: "var(--status-warning)",
  INFORMATION: "var(--status-information)",
  SURFACE_POSITIVE: "var(--status-surface-positive)",
  SURFACE_CRITICAL: "var(--status-surface-critical)",
  SURFACE_WARNING: "var(--status-surface-warning)",
  SURFACE_INFORMATION: "var(--status-surface-information)",
} as const;

// ── Semantic: Component/Button ──
export const BUTTON_COLORS = {
  SECONDARY_TEXT: "var(--btn-secondary-text)",
  PRIMARY_HOVERED: "var(--btn-primary-hovered)",
  PRIMARY_PRESSED: "var(--btn-primary-pressed)",
  SECONDARY_HOVERED: "var(--btn-secondary-hovered)",
  SECONDARY_PRESSED: "var(--btn-secondary-pressed)",
  TERTIARY_HOVERED: "var(--btn-tertiary-hovered)",
  TERTIARY_PRESSED: "var(--btn-tertiary-pressed)",
} as const;
