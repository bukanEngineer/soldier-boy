# Changelog

## [0.5.0] — 2026-10-08

### Added

- `stxdesign-sandbox/logos` subpath export: every partner, bank, chain and stablecoin logo as a named component (`DbsLogo`, `XsgdLogo`, ...). Import only the ones you render; unused logos are tree-shaken.
- `stxdesign-sandbox/illustrations` subpath export: the 28 spot illustrations from the design system (`RocketIllustration`, `DocumentWithMagnifierIllustration`, ...) as inline SVG components, 120px by default and decorative (`aria-hidden`). Their gradient ids are unique per illustration, so several can share a page.
- `EmptyState` and `ErrorResponse` `media` prop and `EmptyStateMedia` / `ErrorResponseMedia` parts for an illustration above the title / code.
- `stxdesign-sandbox/icons` subpath export: every icon as a named component (`CloseIcon`, `ArrowForwardIcon`, ...), plus the `IconName` and `IconSource` types. `npm run vendor:icons` adds an icon to the set (see README).
- `stxdesign-sandbox/fonts.css` export: the `@font-face` rules for Red Hat Display, Hanken Grotesk and Red Hat Mono, plus metric-matched `Red Hat Display Fallback` / `Hanken Grotesk Fallback` faces that keep layout stable while the web fonts load.
- `PartnerLogo` `logo` prop: pass a component from `stxdesign-sandbox/logos` for names outside the built-in set.

### Changed

- `OtcBanner` draws its decorative patterns and arrow as inline SVG instead of loading `.svg` files through `new URL(..., import.meta.url)` and `<img>`, so it no longer depends on the bundler copying assets. Nothing changes visually.
- **Breaking:** icons are inline SVG (Material Symbols Rounded, weight 500, about 90 icons in `src/assets/icons`) instead of the Google icon font, so the package no longer requests `fonts.googleapis.com` and icon names can no longer flash as text while a font loads. Consequences:
  - `Icon` renders an `<svg>` (was a `<span>`), `IconProps` are SVG props, and `name` is the `IconName` union. A name outside the set renders nothing.
  - Every `icon` prop (`IconButton`, `Menu` items, `LinkButton` `leadingIcon` / `trailingIcon`, `StatusIcon`, `CardStatus` `statusIcon`, `Tag`, `Alert`, `CardSteps`, `Sidebar` items, `CompanyProfileMenu` items) takes an `IconName` or any element (your own SVG).
  - `Select.Icon`, `Select.Clear`, `MultiSelect` chip-remove / clear / trigger and `Toast.Icon` children, and the `Breadcrumb.Separator` child, accept an icon name or an element.
  - The `.material-symbols-rounded` class is gone. Icons are `.sx-icon` (1em square, `currentColor`); size them with `font-size` or the `size` prop.
  - Names the font accepted but Google renamed keep working (`expand_more`, `developer_mode`, `business`). Any other name must be in the set: use it in code and run `npm run vendor:icons`, or pass an element.
  - The set uses weight 500: the SVGs are drawn at optical size 48, whose strokes look thinner than the old font (optical size 24) at 24px, and 500 compensates. Weight 600 matches the old font almost exactly (change `WEIGHT` in `scripts/vendor-icons.mjs` and run `npm run vendor:icons`).
- **Breaking:** `tokens.css` no longer contains `@font-face`. `global.css` imports both `fonts.css` and `tokens.css`; if you imported `stxdesign-sandbox/tokens.css` on its own and relied on the fonts, also import `stxdesign-sandbox/fonts.css`, or load the families yourself (e.g. `next/font`).
- Fonts ship as WOFF2 (465 KB of TTF became 198 KB). Red Hat Mono is now self-hosted (Latin and Latin Extended, loaded on demand) instead of fetched from Google Fonts, so the package no longer makes a request to `fonts.googleapis.com` for it.
- **Breaking:** `PartnerLogo` and `AssetMark` only bundle the stablecoins and main chains (xsgd, xusd, xidr, usdc, usdt, ethereum, polygon, arbitrum, base, solana, tron, avalanche, bsc, ripple, hedera, metamask, walletconnect, binance). Every other name (banks, partners, zilliqa, ...) renders the fallback pill unless you pass `logo`, e.g. `<PartnerLogo name="dbs" logo={DbsLogo} />`. One `AssetMark` used to add about 490 KB (264 KB gzipped) to a bundle; it is now about 31 KB (10 KB gzipped).
- Zilliqa, Crypto.com and Coinhako logos are redrawn as real vectors. They were PNGs embedded in SVG (244 KB, 56 KB and 20 KB), so they blurred when scaled.
- `Logo` fills use the `--brand-vibrant-green` / `--brand-secure-teal` tokens (literal colors as fallback), so it renders the same without `tokens.css`.

### Removed

- **Breaking:** `Logomark` (a circle with a check mark, not the brand mark). Use `Logo` (the full StraitsX lockup).
- `Icon` `filled` prop. It had no effect: the icon font is loaded with `FILL@0` (a static font without the fill axis). The SVG icon set has no filled variants yet.
- The `dist/` folder no longer contains TypeScript sources, stories, tests or `test-utils` (it shipped them next to the compiled JS).
- Unused brand files `logomark-full.svg`, `wordmark-x.svg` and `logo-icon-stroke.svg` from `dist/assets`, and the `styles/tokens.css` re-export (import `tokens.css` from the package root export instead).

## [0.4.0] — 2026-10-07

### Added

- `ResponsiveSheet`: one parts API that renders a `BottomSheet` below 600px and a `Modal` above (`breakpoint` prop).
- `BottomSheetSelect` is now exported: single-select list sheet on `OptionList` with optional `searchable`, `description` and an empty state.
- `BottomSheet` detents via `snapPoints` (e.g. `[0.5, 1]`) and keyboard handling for forms (`keyboardAware`, on by default).
- Layering tokens `--z-overlay`, `--z-popup`, `--z-toast`.
- `List` / `ListItem`: shared row primitives (`leading`, `title`, `description`, `trailing` slots). `List` renders a `<ul>` and supports `divided`; `ListItem` renders an `<li>` inside a `List` and a `<div>` on its own.
- `CardDetailRow`: shared label / value row for detail cards. Optional info icon via `info`, `infoPlacement` (`"label"` | `"value"`) and `infoSize`.
- `IconButton` `touchTarget` prop: keeps the small (36px) look and extends the tap area to 48x48 without taking up layout space.

### Changed

- `BottomSheet.Close` is a small (36px) `IconButton` with a 48px touch target; text-only close is `BottomSheet.Close` with children.
- Mobile web: sheet height uses `dvh`, bottom padding uses `env(safe-area-inset-bottom)` (set `viewport-fit=cover` in your viewport meta tag), the body no longer scroll-chains, and the sheet slides fully in from the bottom without a fade.
- Select, MultiSelect, Menu, Popover and Tooltip now layer above Modal / BottomSheet, so dropdowns opened inside a sheet are visible. Toasts also layer above them.
- Bank / Blockchain / Network sheets use listbox semantics (`role="option"`, `aria-selected`) instead of pressed buttons; marks are 24px like `OptionList`.
- Title uses the `--title-small` type token.
- `Modal.Close` is now a small `IconButton` (square, tertiary) with a 48px touch target, matching `BottomSheet.Close`. The glyph is the tertiary-button colour instead of `--text-secondary`; text-only `<Modal.Close>Cancel</Modal.Close>` is unstyled apart from inheriting the font.
- `BottomSheet` no longer accepts `swipeDirection` (it is always `down`).
- `ListAsset`, `ListBank` and `ListBlockchain` are built on `ListItem`; `CardAsset` and `CardChecklist` render their rows with `List`. Every `Card*` variant now uses `Card` as its surface.
- `CardStatus` and `CardSummary` detail items render through `CardDetailRow` (Status: info on label at 16px; Summary: info on value at 18px).
- `ListAsset` shows the symbol's first two letters when no `icon` is given, uses `IconButton` for its actions, and gives the network column an equal share so columns align across rows. `ListAsset`, `ListBank` and `ListBlockchain` no longer accept the HTML `title` attribute (it is a content slot).
- `ListBlockchain`'s Verify action is a `LinkButton`, matching `ListBank`.
- Removed placeholder defaults: `ListAsset` (`symbol`, `subtitle`, `balance`), `ListBank` / `ListBlockchain` (`name`), `CardSwap` (`rate`, `footnote`) and `CardChecklist` (`title`). Pass them explicitly.

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
