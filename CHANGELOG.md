# Changelog

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
