# Migrating to stxdesign-sandbox 0.5

Assets release: fonts, icons, logos and illustrations are now all self-hosted and tree-shakeable. The package no longer makes any request to Google Fonts. Most apps need a few search-and-replace edits; the list below is complete.

Plan and measurements: `docs/assets-plan.md`. Full change list: `CHANGELOG.md`.

## Checklist

1. Search your app for the **removed or changed** APIs in the table below.
2. If you import `stxdesign-sandbox/tokens.css` on its own, also import `stxdesign-sandbox/fonts.css`.
3. Search for `material-symbols` (CSS or markup) and for icon names that are not in the set.
4. Replace `PartnerLogo` / `AssetMark` uses of banks and partners with the `logo` prop.
5. Replace `Logomark` with `Logo`.

## What changed

| Was (0.4)                                                                                                          | Now (0.5)                                                                                            |
| ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `<Icon name="x" />` renders a `<span>` with the icon font                                                          | renders an inline `<svg>`; `name` is the `IconName` union                                            |
| `<Icon filled />`                                                                                                  | removed (it never worked: the font had no fill axis)                                                 |
| `icon="any_material_symbol"`                                                                                       | a name from the set, or an element: `icon={<MySvg />}`                                               |
| `.material-symbols-rounded` class                                                                                  | `.sx-icon` (1em square, `currentColor`)                                                              |
| `Toast.Icon`, `Select.Icon`, `Select.Clear`, `MultiSelect` chip-remove / clear / trigger children as a name string | still a name, or an element                                                                          |
| `tokens.css` contains `@font-face`                                                                                 | `tokens.css` is variables only; `fonts.css` has `@font-face`; `global.css` imports both              |
| Red Hat Mono from Google Fonts                                                                                     | self-hosted WOFF2                                                                                    |
| TTF fonts                                                                                                          | WOFF2 fonts (same families and weights)                                                              |
| `<PartnerLogo name="dbs" />`                                                                                       | `<PartnerLogo name="dbs" logo={DbsLogo} />` with `import { DbsLogo } from "stxdesign-sandbox/logos"` |
| `<AssetMark asset="..." />` for any asset                                                                          | unchanged for the stablecoins and main chains; others fall back to initials                          |
| `Logomark`                                                                                                         | removed; use `Logo`                                                                                  |
| `stxdesign-sandbox/dist/styles/tokens.css` re-export                                                               | removed (it was never in `exports`)                                                                  |

## Icons

Icons are Material Symbols Rounded (weight 500), vendored as SVG into `src/assets/icons`.

```tsx
import { Icon, IconButton } from "stxdesign-sandbox";
import { CloseIcon } from "stxdesign-sandbox/icons";

<Icon name="chevron_right" size={20} />
<IconButton icon="close" label="Close" />
<IconButton icon={<MyCustomSvg />} label="Custom" />   {/* any element works */}
<CloseIcon width={20} height={20} />                   {/* direct, tree-shakeable import */}
```

- The icon is `1em` square: size it with the `size` prop or `font-size`, colour it with `color` or `currentColor`.
- A name that is not in the set renders nothing (TypeScript catches it for typed props). Names Google renamed but the old font still accepted keep working: `expand_more`, `developer_mode`, `business`.
- To add an icon to the package: use its name somewhere in `src/` (or add it to `scripts/icon-extras.json`) and run `npm run vendor:icons`.
- If you styled `.material-symbols-rounded` in your own CSS, target `.sx-icon` instead, and expect `svg` rather than text: no `line-height` or `letter-spacing` is needed.
- Visual difference: SVG icons are drawn at optical size 48, so at 24px they are very slightly lighter than the old font. Weight 500 is used to compensate (600 would match exactly).

## Fonts

```css
/* before: tokens.css carried the @font-face rules */
@import "stxdesign-sandbox/tokens.css";

/* after: either import global.css (fonts + tokens + reset), or both files */
@import "stxdesign-sandbox/fonts.css";
@import "stxdesign-sandbox/tokens.css";
```

Apps that load the families another way (for example `next/font`) can keep importing `tokens.css` alone. `--font-display` and `--font-body` now list a metric-matched Arial fallback (`"Red Hat Display Fallback"`, `"Hanken Grotesk Fallback"`) so the layout barely moves when the web font loads.

## Logos

Everything except the stablecoins and main chains is now a named export of `stxdesign-sandbox/logos`, so your bundle only contains the logos you import (one `AssetMark` used to add about 490 KB).

Built in (no `logo` prop needed): xsgd, xusd, xidr, usdc, usdt, ethereum, polygon, arbitrum, base, solana, tron, avalanche, bsc, ripple, hedera, metamask, walletconnect, binance.

If bank or partner names come from an API, build the lookup in your app from the logos you support:

```tsx
import { PartnerLogo } from "stxdesign-sandbox";
import { DbsLogo, UobLogo, MandiriLogo } from "stxdesign-sandbox/logos";

const BANK_LOGOS = { dbs: DbsLogo, uob: UobLogo, mandiri: MandiriLogo };

<PartnerLogo name={bank.code} logo={BANK_LOGOS[bank.code]} />   {/* unknown codes show a text pill */}
```

Zilliqa, Crypto.com and Coinhako were PNGs embedded in SVG; they are redrawn as vectors and look the same at normal sizes.

## New

- `stxdesign-sandbox/illustrations`: 28 spot illustrations as components (`<RocketIllustration />`), 120px, decorative by default.
- `EmptyState` / `ErrorResponse` `media` prop and `EmptyStateMedia` / `ErrorResponseMedia` parts.
- `stxdesign-sandbox/icons`, `stxdesign-sandbox/logos`, `stxdesign-sandbox/fonts.css` subpath exports.

```tsx
import { EmptyState, EmptyStateMedia, EmptyStateTitle } from "stxdesign-sandbox";
import { DocumentWithMagnifierIllustration } from "stxdesign-sandbox/illustrations";

<EmptyState>
  <EmptyStateMedia>
    <DocumentWithMagnifierIllustration />
  </EmptyStateMedia>
  <EmptyStateTitle>No transactions found</EmptyStateTitle>
</EmptyState>;
```

## Size

|                                | 0.4                                   | 0.5                                                                    |
| ------------------------------ | ------------------------------------- | ---------------------------------------------------------------------- |
| Published package (tarball)    | 1.1 MB                                | 0.5 MB                                                                 |
| One `AssetMark` in your bundle | 489 KB min (264 KB gzip)              | 31 KB min (10 KB gzip)                                                 |
| Icons                          | 374 KB font from Google               | 65 KB min (22 KB gzip) when any component that uses `Icon` is imported |
| Fonts                          | 465 KB TTF + Red Hat Mono from Google | 232 KB WOFF2, all self-hosted                                          |
