/**
 * StraitsX Design System Theme — typed token object.
 *
 * Unlike straitsx-frontend (which uses hardcoded hex values consumed via
 * React Context), this theme object references CSS custom properties. It
 * provides typed JS access to the token system without runtime overhead.
 *
 * Usage:
 *   import { theme } from "../theme/theme";
 *   const color = theme.brand.action.default; // "var(--primary)"
 */

export const theme = {
  brand: {
    primary: {
      default: "var(--primary)",
      contrast: "var(--text-primary)",
    },
    action: {
      default: "var(--primary)",
      hover: "var(--btn-primary-hovered)",
      pressed: "var(--btn-primary-pressed)",
    },
    secondary: {
      onSurface: "var(--btn-secondary-text)",
      action: {
        hover: "var(--btn-secondary-hovered)",
        pressed: "var(--btn-secondary-pressed)",
      },
    },
    tertiary: {
      action: {
        hover: "var(--btn-tertiary-hovered)",
        pressed: "var(--btn-tertiary-pressed)",
      },
    },
    line: {
      base: "var(--border)",
    },
  },
  color: {
    background: {
      neutral: "var(--background)",
      surface: "var(--surface)",
      surfaceSecondary: "var(--surface-secondary)",
    },
    surface: {
      neutral: "var(--surface)",
      disabledSurface: "var(--surface-disabled)",
      disabledOnSurface: "var(--disabled-on-surface)",
      hovered: "var(--surface-hovered)",
      pressed: "var(--surface-pressed)",
    },
    interactive: {
      active: "var(--interactive-active)",
      hoverSurface: "var(--surface-hovered)",
      pressedSurface: "var(--surface-pressed)",
    },
    status: {
      positive: "var(--status-positive)",
      critical: "var(--status-critical)",
      warning: "var(--status-warning)",
      information: "var(--status-information)",
    },
    text: {
      primary: "var(--text-primary)",
      secondary: "var(--text-secondary)",
      inverse: "var(--text-inverse)",
      link: "var(--link)",
    },
  },
  spacing: {
    xs: "var(--space-1)",
    sm: "var(--space-2)",
    md: "var(--space-3)",
    lg: "var(--space-4)",
    xl: "var(--space-5)",
    xxl: "var(--space-6)",
    xxxl: "var(--space-7)",
  },
  radius: {
    sm: "var(--radius-sm)",
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
    full: "var(--radius-full)",
  },
  shadow: {
    level1: "var(--shadow-1)",
    level2: "var(--shadow-2)",
    level3: "var(--shadow-3)",
  },
  motion: {
    ease: "var(--ease)",
    fast: "var(--dur-1)",
    normal: "var(--dur-2)",
    slow: "var(--dur-3)",
  },
} as const;

export type Theme = typeof theme;
