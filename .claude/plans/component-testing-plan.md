# Component Usability & Scalability Test Plan

## Goal
Add comprehensive tests verifying that every component in the `soldier-boy` design system is:
1. **Easily usable by engineers** — renders with minimal props, has proper TypeScript types, accessible, predictable API
2. **Scalable** — handles large datasets, many items, responsive behavior, composable patterns

## Current State
- 73 component directories, only 4 have unit tests (Button, Switch, Sidebar, PartnerLogo)
- Storybook stories exist for most components (tested via `@storybook/addon-vitest` in browser)
- No shared test utilities or custom render wrappers
- Vitest unit test glob only matches `.test.jsx` (not `.test.tsx` — needs fixing)
- a11y addon exists but is in "todo" mode (non-blocking)

---

## Phase 1: Fix Infrastructure & Create Test Utilities

### 1a. Fix vitest include pattern
Update `vite.config.js` to include both `.test.jsx` and `.test.tsx` files:
```
include: ['src/**/*.test.{jsx,tsx}']
```

### 1b. Create shared test utilities (`src/test-utils.tsx`)
- Custom `render` wrapper that includes `ThemeProvider` if needed
- `axe` helper for accessibility testing (using `vitest-axe` or `@axe-core/react`)
- Utility to assert a component renders without errors with only required props
- Utility to check that `className` prop is forwarded (composability check)

---

## Phase 2: "Usability" Tests for Every Component

For each of the 73 components, write a `.test.jsx` file that verifies:

### Category A: Basic Renderability
- **Renders with minimal/no props** — smoke test that the component doesn't crash
- **Renders with all optional props** — exercises the full API surface
- **Exports are correct** — component and types can be imported from the barrel

### Category B: Developer Ergonomics
- **TypeScript types are exported** — verify prop types exist (via import assertion in .test.tsx)
- **className forwarding** — custom classes are applied (composability)
- **Prop spreading** — extra HTML attributes reach the DOM (for components that support it)
- **Controlled & uncontrolled modes** — form components work in both patterns

### Category C: Accessibility
- **Has accessible role** — uses correct ARIA role
- **Keyboard navigable** — interactive components respond to keyboard
- **axe audit passes** — automated WCAG check on rendered output
- **Labels present** — form components have associated labels

### Category D: Interaction Contracts
- **Callbacks fire** — onClick, onChange, onClose, etc. invoke with expected arguments
- **Disabled state respected** — no callbacks fire, visual indicator present
- **Loading state** — if supported, shows loading indicator and disables interaction

---

## Phase 3: "Scalability" Tests

### Category E: Data Volume
- **Table with 1000+ rows** — renders without crashing, measures render time
- **Select/MultiSelect with 500+ options** — dropdown remains responsive
- **Pagination with large page counts** — handles edge cases (page 1, last page, overflow)
- **Lists (ListAsset, ListBank, etc.) with many items** — no performance cliff

### Category F: Composition & Extensibility
- **Nested components** — Modal containing Forms, Cards containing Tables
- **Custom children** — components accepting `children` render arbitrary content
- **Slot props** — `footer`, `actions`, `illustration` slots accept complex nodes
- **linkComponent pattern** — Sidebar/navigation works with custom router links
- **ThemeProvider nesting** — components work at any depth

### Category G: Responsive & Layout
- **Responsive variants** — components with responsive props adapt correctly
- **Container width stress** — components in very narrow (320px) and very wide (1920px) containers
- **Overflow handling** — long text, many tags, truncation behavior

---

## Phase 4: Component Priority Order

Start with the most critical/commonly-used components, grouped by complexity:

**Batch 1 — Primitives** (simple, high-frequency):
Button, IconButton, LinkButton, Tag, Badge, Alert, Tooltip

**Batch 2 — Form Controls** (interaction-heavy):
Input, Textarea, Select, MultiSelect, DateInput, Checkbox, Radio, Switch, Upload, InputCurrency, Copybox

**Batch 3 — Layout & Data** (composition-heavy):
Card, Tabs, Table, Pagination, Modal, BottomSheet, Breadcrumb, Steps, Menu

**Batch 4 — Navigation & Dashboard**:
Sidebar, TopNavigation, PageTitle, Toast/ToastProvider

**Batch 5 — Product-specific** (StraitsX domain components):
CardAsset, CardSwap, ListAsset, ListBank, FieldNetwork, FieldBank, DropdownAsset, etc.

---

## Phase 5: CI Integration

- Ensure all new tests run in the `unit` vitest project
- Promote a11y addon from `"todo"` to `"error"` mode (make a11y failures block CI)
- Add test coverage reporting (vitest coverage with c8/istanbul)
- Consider adding bundle-size checks (e.g., `size-limit`) for scalability tracking

---

## Test File Convention

Each test file lives alongside its component:
```
src/components/Button/
├── Button.tsx
├── Button.css
├── Button.stories.tsx
├── Button.test.jsx        ← new/existing test
├── styles.ts
└── index.tsx
```

Test file structure:
```jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentName } from "./ComponentName";

describe("ComponentName", () => {
  // A: Renderability
  it("renders with minimal props", () => { ... });
  
  // B: Ergonomics
  it("forwards className", () => { ... });
  it("spreads HTML attributes", () => { ... });
  
  // C: Accessibility
  it("has correct ARIA role", () => { ... });
  it("is keyboard accessible", () => { ... });
  
  // D: Interactions
  it("calls onChange when value changes", () => { ... });
  it("does not respond when disabled", () => { ... });
  
  // E: Scale (where applicable)
  it("handles large data sets without crashing", () => { ... });
});
```

---

## Deliverables

1. `src/test-utils.tsx` — shared test helpers
2. Updated `vite.config.js` — fix glob pattern  
3. 73 test files (one per component) — comprehensive usability + scalability coverage
4. Updated `.storybook/preview.js` — promote a11y to error mode (optional, can be separate PR)

---

## Estimated Scope

- ~73 test files × ~5-15 tests each = ~500-800 individual test cases
- I recommend starting with **Batch 1 (Primitives)** to establish the pattern, then proceeding through the batches

Would you like me to proceed with all batches, or start with Batch 1 to validate the approach first?
