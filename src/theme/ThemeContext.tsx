/**
 * Optional ThemeContext — JS access to the theme object via React Context.
 *
 * Prefer CSS custom properties (`var(--primary)`, etc.) for styling. Keep this
 * export for rare programmatic token reads. The dashboard app today uses its
 * own local ThemeContext; soldier-boy's copy stays for package consumers that
 * import `ThemeProvider` / `useTheme` from `soldier-boy`.
 *
 *   import { ThemeProvider, useTheme } from "soldier-boy";
 *   <ThemeProvider><App /></ThemeProvider>
 *   const theme = useTheme(); // theme.brand.action.default → "var(--primary)"
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
