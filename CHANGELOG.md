# Changelog

## [Unreleased]

### Added

- `ResponsiveSheet`: one parts API that renders a `BottomSheet` below 600px and a `Modal` above (`breakpoint` prop).
- `BottomSheetSelect` is now exported: single-select list sheet on `OptionList` with optional `searchable`, `description` and an empty state.
- `BottomSheet` detents via `snapPoints` (e.g. `[0.5, 1]`) and keyboard handling for forms (`keyboardAware`, on by default).
- Layering tokens `--z-overlay`, `--z-popup`, `--z-toast`.
- `IconButton` `touchTarget` prop: keeps the small (36px) look and extends the tap area to 48x48 without taking up layout space.

### Changed

- `BottomSheet.Close` is a small (36px) `IconButton` with a 48px touch target; text-only close is `BottomSheet.Close` with children.
- Mobile web: sheet height uses `dvh`, bottom padding uses `env(safe-area-inset-bottom)` (set `viewport-fit=cover` in your viewport meta tag), the body no longer scroll-chains, and the sheet slides fully in from the bottom without a fade.
- Select, MultiSelect, Menu, Popover and Tooltip now layer above Modal / BottomSheet, so dropdowns opened inside a sheet are visible. Toasts also layer above them.
- Bank / Blockchain / Network sheets use listbox semantics (`role="option"`, `aria-selected`) instead of pressed buttons; marks are 24px like `OptionList`.
- Title uses the `--title-small` type token.
- `Modal.Close` is now a small `IconButton` (square, tertiary) with a 48px touch target, matching `BottomSheet.Close`. The glyph is the tertiary-button colour instead of `--text-secondary`; text-only `<Modal.Close>Cancel</Modal.Close>` is unstyled apart from inheriting the font.
- `BottomSheet` no longer accepts `swipeDirection` (it is always `down`).

## [0.3.0] — 2026-10-07

Breaking Base UI migration. See `docs/migration-0.3.md` for old → new snippets.

Package and GitHub repo renamed from `soldier-boy` to **`stxdesign-sandbox`**. Install with `npm install stxdesign-sandbox@0.3.0`. The old npm name is retired (deprecate on npm if previously published).

### Breaking

- Package identity: `soldier-boy` → `stxdesign-sandbox` (update imports and CSS entry paths).
- Compound APIs for Tabs, Menu, Select, MultiSelect, Modal, BottomSheet, Tooltip, Popover, Field, Card, Table, Pagination, Breadcrumb, Steps, and related domain recipes.
- Form labels / helpers / errors move off controls onto `Field`.
- Removed aliases: `EmptyState.sub`, `ErrorResponse.body`, `PaginationNav.onChange`, `TableData`, `OptionList.onSelect`.
- TypeScript-only package source (`allowJs` removed).
- Runtime dependency on `@base-ui/react`.

### Added

- `ButtonGroup`, `Popover`, shared `OptionList` / `FieldOptionSelect`.
- `--status-warning-strong` and WCAG AA token adjustments (link, disabled, placeholder, gold, sidebar active text).
- Storybook a11y gate (`a11y.test: "error"`, zero violations).
- `docs/migration-0.3.md`, `docs/base-ui-migration.md`.

### Changed

- Overlays use Base UI focus trap / scroll lock / portal behavior.
- Domain Dropdown* / Field* / List* / Card* / Modal* / BottomSheet* rebuilt as thin compositions.
- `ThemeProvider` / `useTheme` kept as optional JS token access (CSS variables preferred).

### Fixed

- Select listbox semantics and clear control.
- Menu keyboard / typeahead / portal.
- Tabs roving tabindex and ARIA wiring.
- Tooltip vs Popover split for interactive content.
- Assorted contrast and accessible-name issues across stories.

## [0.2.2]

Prior stable release before the Base UI migration.
