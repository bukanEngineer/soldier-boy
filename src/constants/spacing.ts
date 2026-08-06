/**
 * Spacing scale — mirrors Figma "Padding Scale": 4 8 12 16 20 24 40.
 * Maps to CSS custom properties defined in tokens.css.
 */

export const SPACING = {
  XS: "var(--space-1)", // 4px
  SM: "var(--space-2)", // 8px
  MD: "var(--space-3)", // 12px
  LG: "var(--space-4)", // 16px
  XL: "var(--space-5)", // 20px
  XXL: "var(--space-6)", // 24px
  XXXL: "var(--space-7)", // 40px
} as const;

/** Raw pixel values for JS calculations (avoid in styles — use CSS vars). */
export const SPACING_PX = {
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 20,
  XXL: 24,
  XXXL: 40,
} as const;
