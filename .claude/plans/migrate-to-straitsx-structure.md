# Migration Plan: Adopt straitsx-frontend Code Structure

## Goal
Restructure `prohellox-stx` to follow the `straitsx-frontend/packages/design-system` code structure while keeping the existing plain CSS + tokens approach and ESM-only build.

## Summary of Changes

### 1. Convert Components to TypeScript (`.jsx` → `.tsx`, `.js` → `.ts`)

**Current:** `Button/Button.jsx` (plain JS, no type annotations)  
**Target:** `Button/Button.tsx` (TypeScript with props interfaces)

Pattern for each component:
```tsx
// Button/Button.tsx
import React from "react";
import "./Button.css";

export type ButtonProps = {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "lg" | "sm";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">;

export function Button({ variant = "primary", size = "lg", ... }: ButtonProps) { ... }
```

- Stories remain `.stories.tsx` (rename from `.stories.jsx`)
- Tests remain `.test.tsx` (rename from `.test.jsx`)

### 2. Add Per-Component `index.tsx` Barrel Files

**Current:** No index files; `src/index.js` exports directly from `./components/Button/Button.jsx`  
**Target:** Each component folder gets an `index.tsx` re-exporting its public API

```tsx
// Button/index.tsx
export { Button } from "./Button";
export type { ButtonProps } from "./Button";
```

Then `src/index.ts` becomes:
```ts
export { Button } from "./components/Button";
export type { ButtonProps } from "./components/Button";
```

### 3. Add Separate `styles.ts` Files

**Current:** All styles in `Button.css`  
**Target:** Keep `Button.css` (unchanged), add a `styles.ts` that exports CSS class-name constants/helpers

Since we're keeping plain CSS (not switching to Emotion), the `styles.ts` will serve as a typed mapping of class names and style utilities — NOT CSS-in-JS template literals like straitsx-frontend. This bridges the structural pattern without changing the styling approach.

```ts
// Button/styles.ts
export const buttonClasses = {
  root: "btn",
  primary: "btn--primary",
  secondary: "btn--secondary",
  tertiary: "btn--tertiary",
  lg: "btn--lg",
  md: "btn--md",
  sm: "btn--sm",
} as const;

export type ButtonVariant = keyof typeof variantClasses;
```

Components will import from `styles.ts` instead of hardcoding class strings.

### 4. Reorganize Tokens/Theme into `constants/`, `shared/`, `theme/` Directories

**Current structure:**
```
src/
├── styles/
│   ├── tokens.css
│   └── global.css
```

**Target structure (mirroring straitsx-frontend):**
```
src/
├── constants/
│   ├── Colors/
│   │   ├── colors.ts          ← TS enums/objects for color primitives
│   │   └── Colors.stories.tsx  ← (move from src/stories/Colors.stories.jsx)
│   ├── Typography/
│   │   ├── typography.ts       ← font constants
│   │   └── Typography.stories.tsx
│   ├── spacing.ts
│   ├── breakpoints.ts
│   └── shadow.ts
├── shared/
│   ├── ColorStyles.ts          ← semantic color mappings (typed)
│   ├── TypographyStyles.ts     ← font style utilities
│   └── modalContext.tsx        ← (move ToastProvider/useToast context pattern here)
├── theme/
│   ├── theme.ts               ← theme object (CSS variable references, typed)
│   ├── ThemeContext.tsx        ← optional provider (for JS access to tokens)
│   └── tokens.css             ← (move from src/styles/tokens.css)
├── styles/
│   └── global.css             ← keep global resets here
```

**Key difference from straitsx-frontend:** Our `theme.ts` will reference CSS custom properties (not hardcoded hex values), making it a typed bridge to the token system:
```ts
// theme/theme.ts
export const theme = {
  brand: {
    action: { default: "var(--primary)", hover: "var(--btn-primary-hovered)" },
  },
  color: {
    surface: { neutral: "var(--surface)", disabled: "var(--surface-disabled)" },
  },
  // ...
} as const;
```

### 5. Update `src/index.ts` (rename from `src/index.js`)

Follow straitsx-frontend's barrel pattern — export components via their folder index, plus constants, theme, and shared utilities:

```ts
// Components
export { Button } from "./components/Button";
export type { ButtonProps } from "./components/Button";
// ... all components

// Theme
export { theme } from "./theme/theme";
// export { ThemeProvider, useTheme } from "./theme/ThemeContext"; // if needed

// Constants
export { COLORS, GREEN, GREY, ... } from "./constants/Colors/colors";
export { SPACING } from "./constants/spacing";

// Shared
export { ToastProvider, useToast } from "./shared/modalContext";
```

### 6. Update Build Pipeline

- `tsconfig.json`: Change `allowJs: true` → add `.ts,.tsx` to include, set `checkJs: true` or remove `allowJs` once migration is done
- `package.json` scripts: Replace Babel with `tsc` for compilation (since source is now TS) or keep Babel with `@babel/preset-typescript`
- Update Storybook `main.js` stories glob: `"../src/**/*.stories.@(ts|tsx)"`

---

## Migration Order (Incremental)

This is a large migration (~72 components). We'll do it incrementally:

### Phase 1: Infrastructure (do first)
1. Create `constants/`, `shared/`, `theme/` directories with initial files
2. Move `tokens.css` to `theme/tokens.css`, update imports
3. Add `colors.ts`, `spacing.ts`, `breakpoints.ts`, `shadow.ts` in `constants/`
4. Add `theme.ts` with typed CSS-variable-backed theme object
5. Move foundation stories (`Colors.stories.jsx`, etc.) into `constants/` folders
6. Rename `src/index.js` → `src/index.ts`
7. Update `tsconfig.json` for proper TS compilation
8. Add `typescript` as a devDependency (if not already)
9. Update build scripts for TS

### Phase 2: Pilot Component (Button)
1. Rename `Button.jsx` → `Button.tsx`, add `ButtonProps` interface
2. Create `Button/styles.ts` with class constants
3. Create `Button/index.tsx` barrel
4. Rename `Button.stories.jsx` → `Button.stories.tsx`
5. Rename `Button.test.jsx` → `Button.test.tsx` (if exists)
6. Verify build, storybook, and tests pass

### Phase 3: Batch Component Migration
Repeat Phase 2 pattern for all remaining components in batches (~10-15 at a time), grouped by category:
- Batch A: Primitives (IconButton, LinkButton, Tag, Badge)
- Batch B: Form (Input, Textarea, Select, MultiSelect, DateInput, etc.)
- Batch C: Layout (Card, Tabs, Table, Pagination, etc.)
- Batch D: Feedback (Alert, Toast, Modal, BottomSheet, Tooltip, etc.)
- Batch E: Brand (Logo, Logomark, Icon, PartnerLogo)
- Batch F: Product-specific (CardAsset, CardSwap, DropdownAsset, etc.)

### Phase 4: Cleanup
1. Remove legacy `src/styles/` directory (tokens.css moved to theme/)
2. Update all import paths in Storybook config
3. Run full test suite, fix any breakage
4. Update `package.json` exports if needed
5. Final build verification

---

## Files That Won't Change
- `.storybook/main.js` — only update stories glob
- `.storybook/preview.js` — keep as-is (already modern)
- `.storybook/manager.js` — keep as-is
- All `.css` files — keep the plain CSS approach unchanged
- Build output format — stays ESM-only

---

## Risks & Mitigations
- **Breaking imports for consumers**: The barrel `index.tsx` files mean `import { Button } from "prohellox-designsystem"` continues to work unchanged.
- **Build script changes**: We'll add `@babel/preset-typescript` to handle `.tsx` in Babel, avoiding a full build rewrite.
- **Gradual migration**: `.js` and `.ts` can coexist during migration since `allowJs: true` is already set.

---

## Shall I begin with Phase 1 (infrastructure) + Phase 2 (Button pilot)?
