/**
 * Optional ThemeContext — provides JS access to the theme object via React
 * Context. Most components should use CSS custom properties directly, but
 * this is available for components that need programmatic token access.
 *
 * Usage:
 *   import { ThemeProvider, useTheme } from "../theme/ThemeContext";
 *
 *   // Wrap app
 *   <ThemeProvider><App /></ThemeProvider>
 *
 *   // In component
 *   const theme = useTheme();
 *   const bg = theme.brand.action.default; // "var(--primary)"
 */
import React, { createContext, useContext } from "react";
import { theme, type Theme } from "./theme";

const ThemeContext = createContext<Theme>(theme);

export type ThemeProviderProps = {
  /** Override the default theme (advanced — most apps use the default). */
  value?: Theme;
  children: React.ReactNode;
};

export function ThemeProvider({ value = theme, children }: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
