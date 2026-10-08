# Fonts, icons and illustrations plan

Goal: one predictable way to ship fonts, icons, logos and illustrations: self-hosted, tree-shakeable, typed, and with no requests to third parties.

Status legend: `[ ]` todo, `[~]` in progress, `[x]` done. Update this file as work lands so a new session can pick up where the last one stopped.

Findings come from a review on 2026-10-08 (package version 0.4.0). Issue ids (F1, I1, L1, ...) are referenced by the phases below.

## Current state (before the work; see Results below)

- **Fonts:** Red Hat Display and Hanken Grotesk are self-hosted as variable TTFs (`src/fonts`, about 465 KB) with `@font-face` in `src/theme/tokens.css`. Red Hat Mono and Material Symbols Rounded load from the Google Fonts CDN through CSS `@import`.
- **Icons:** Material Symbols Rounded as a ligature font. `<Icon>` exists, but about 40 places write `<span className="material-symbols-rounded">` directly.
- **Logos:** `scripts/generate-partner-logos.mjs` runs SVGO + SVGR over `src/assets/partners/*.svg` and generates one React component per logo (git-ignored output). `Logo` and `Logomark` are hand-written inline SVG. `OtcBanner` loads five SVGs through `new URL(..., import.meta.url)`.
- **Illustrations:** none in the package. `EmptyState` and `ErrorResponse` have no media slot. Design already has a 27-illustration collection in Figma (see "Illustration inventory").

## Issues

### Fonts

| Id  | Issue                                                                                                                                                                                                                        |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F1  | Font files ship as TTF. WOFF2 is usually 40–60% smaller and supported by every target browser.                                                                                                                               |
| F2  | `tokens.css` has an `@import` of `fonts.googleapis.com` for Red Hat Mono, so every consumer makes a hidden third-party request (CSP, offline and GDPR problems). It chains with the Material Symbols import in `global.css`. |
| F3  | `tokens.css` mixes variables with `@font-face`. An app that loads fonts its own way (e.g. `next/font`) cannot take the tokens alone.                                                                                         |
| F4  | Duplicates: root `fonts/` and `assets/`, and `src/styles/tokens.css` (a 3-line re-export shim).                                                                                                                              |
| F5  | No metric-matched fallback font, so the swap from `system-ui` shifts layout.                                                                                                                                                 |

### Icons

| Id  | Issue                                                                                                                                                                                                                               |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I1  | **Bug:** `<Icon filled>` does nothing. `global.css` requests `FILL@0`, so Google serves a static font without the FILL axis and `'FILL' 1` has nothing to change. Requesting `FILL@0..1` returns a different font file (confirmed). |
| I2  | `Icon.css` styles `.icon` and `.icon--filled`, which `Icon.tsx` never renders (dead CSS).                                                                                                                                           |
| I3  | `<Icon>` is bypassed in Sidebar, Pagination, Input, Select, Toast, Menu, Upload and others, and about 25 CSS rules override `.material-symbols-rounded` font size one by one.                                                       |
| I4  | Icon props have inconsistent types: `string` (Menu, LinkButton), `ReactNode` (Sidebar, ListAsset), `string \| ReactNode` with separate resolve functions (Tag, Alert, CardSteps).                                                   |
| I5  | Icon names are untyped (a typo renders the literal word), `display=block` hides text until the font loads, and consumers' CSP must allow Google.                                                                                    |

### Logos and illustrations

| Id  | Issue                                                                                                                                                                                                                             |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| L1  | A single `AssetMark` costs 489 KB minified (264 KB gzipped) in a consumer bundle. `logos/index.ts` puts all 50 logo components in one `Record`, so nothing can be tree-shaken. Measured by bundling `dist/index.js` with esbuild. |
| L2  | `zilliqa.svg` (244 KB) and `crypto-com.svg` (56 KB) embed base64 raster images. They are 60% of the logo weight and blur when scaled.                                                                                             |
| L3  | `Logomark` draws a circle with a check mark, while `Logo` uses the real wave mark. Check against Figma whether this is a placeholder.                                                                                             |
| L4  | `logomark-full.svg`, `wordmark-x.svg` and `logo-icon-stroke.svg` are copied to `dist/assets` but unused. `Logo` hardcodes `#054948` and `#00D37E` instead of tokens.                                                              |
| L5  | `OtcBanner` is the only component loading assets through `new URL(..., import.meta.url)` plus `<img>`. It works in Vite and webpack 5 but is a second asset strategy for five files under 4 KB each.                              |
| L6  | No illustration support: `EmptyState` and `ErrorResponse` have no media slot, so every app arranges its own image.                                                                                                                |

## Decisions

- **Pipeline:** one generic SVGO + SVGR script (evolved from `generate-partner-logos.mjs`) turns `src/assets/{icons,logos,brand,illustrations}/*.svg` into one component per file, generated and git-ignored like the logos today.
- **Icons:** replace the ligature font with SVG components from `@material-symbols/svg-500/rounded` (filled variants are separate files). Drawn with `currentColor`. `<Icon name>` gets a generated `IconName` union.
- **Icon props:** every component takes `icon?: IconName | React.ReactElement`. A name covers the built-in set; an element covers anything else. One shared `resolveIcon()` replaces the per-component versions.
- **Sizing:** a `--icon-size` CSS variable (set by `<Icon size>`), not `font-size` overrides.
- **Icon weight:** one set only, weight 400 and optical size 24 (what `global.css` requested); later changed to weight 500, see the Icon weight note under Open questions. The SVG packages ship one folder per weight, so a second weight would double the vendored files. Revisit only if design asks for a bold icon style.
- **Tree-shaking:** logos, icons and illustrations are separate modules behind subpath exports (`./icons`, `./logos`, `./illustrations`) with named exports, so a consumer imports only what it renders. No `React.lazy` (see "Why not lazy" below).
- **Name-based lookup** (`PartnerLogo name="..."`, `AssetMark asset="..."`): the built-in registry holds only the core set (the 5 stablecoins and the main chains, about 29 KB of generated source for 17 logos). Anything else is passed as an element (`logo` prop) or imported from `./logos`.
- **Fonts:** WOFF2 only, all self-hosted (including Red Hat Mono), split into `fonts.css`, `tokens.css` and `global.css` (which imports both). No third-party requests from the package.
- **Illustrations:** use the existing Figma collection (see "Illustration inventory"), exported as SVG and generated into one component each behind `./illustrations`. Colors stay baked in: they are the brand gradient (`#00D37E` to `#054948`, the same values as `--brand-vibrant-green` and `--brand-secure-teal`) plus a neutral tint, i.e. brand identity like the logos, not themeable surfaces. Revisit only if dark mode needs a different look.

### Why not lazy

`React.lazy` makes every logo an async chunk. It needs a `Suspense` boundary, shows a fallback first (layout shift on a 24 px logo), and each logo becomes its own request. Server rendering also gets more complicated. Logos are small (0.6–3.5 KB each for the core set), so the real problem is only that all 50 end up in the bundle. Named exports plus a small core registry fix that with synchronous code that renders the same on the server and in the browser.

The one thing that would change this: if the dashboard renders bank or partner logos from a runtime string (for example a bank list returned by the API), the long tail cannot be tree-shaken. In that case the app builds its own `{ dbs: DbsLogo, ... }` map from `./logos` and passes it in. Confirm with the dashboard team (open question below).

- **Release:** the icon prop change and removal of the Google import are breaking. Ship as `0.5.0` with a migration section in `CHANGELOG.md`.

## Phase 1: quick fixes

- [x] I1: removed the `filled` prop (nothing in the repo used it). Requesting `FILL@0..1` would add 169 KB to the icon font (374 KB to 543 KB) for every consumer. Filled icons return in Phase 4 as separate SVG files.
- [x] I2: deleted `Icon.css` and its import (all rules were dead).
- [x] L4: removed the three unused brand SVGs; `Logo` fills use `--brand-vibrant-green` / `--brand-secure-teal` with literal fallbacks (through `style`; `tone` behavior unchanged). `Logomark` still takes a literal `fill` prop default.
- [x] F4: deleted root `fonts/` and `assets/` (identical copies of `src/`) and `src/styles/tokens.css`. `scripts/migrate-tokens.py` still lists it in a skip set (legacy script, harmless). `dist/assets/` is now an empty folder until Phase 5 removes the copy step.

## Phase 2: logo bundle size

- [x] L2: get true vector Zilliqa and Crypto.com logos (or drop the embedded raster and use a simple vector mark). Add a check to `generate-partner-logos.mjs` that fails on `<image` / `data:image` in any source SVG. Done: Figma's own frames are pasted PNGs, so there was no vector source. Zilliqa and Crypto.com are redrawn from the high-resolution PNGs (Zilliqa as three exact polygons, Crypto.com as hexagon plus a traced inner mark). The check also found Coinhako (a 20 KB embedded PNG), now redrawn too. The generator throws on any `<image` / `data:image`. Ask design for the official brand SVGs if pixel-exact artwork matters.
- [x] L1: generate named exports (`XsgdLogo`, `DbsLogo`, ...) and add the `./logos` subpath export. Check that `"sideEffects"` lets bundlers drop unused modules. Done; the barrel has named exports only and `./logos` is in `package.json` `exports`.
- [x] L1: shrink the `PartnerLogo` / `AssetMark` registry to the core set (xsgd, xusd, xidr, usdc, usdt and the main chains). Add a `logo` prop for anything else; unknown names keep the existing fallback pill. Document the dynamic-name pattern in the README. Done: 18 built-in logos (the 17 coins and chains plus binance, which `AssetMark` uses) and the `logo` prop. README has a Logos section.
- [x] L1: add a bundle-size check to `scripts/smoke-test-pack.mjs` (esbuild one `AssetMark`, fail above a budget). Record the target number here once measured. Done in `scripts/smoke-test-pack.mjs`: AssetMark from the root must stay under 60 KB minified (31 KB now) and one logo from `./logos` under 10 KB (2.5 KB now).
- [x] L3: decided to remove `Logomark` instead (it drew a circle with a check mark, not the brand mark). `Logo` is the only brand component; the examples that used `Logomark` now use `Logo`.

## Phase 3: fonts

- [x] F1: convert the four TTFs to WOFF2 (`fonttools` or `woff2_compress`); update `@font-face` to a single `format("woff2")`; update `copy-build-assets.mjs` if needed. Done: 465 KB to 198 KB. Italic files kept (not subsetted).
- [x] F2: self-host Red Hat Mono (variable WOFF2, weights 300–700) and remove the Google `@import` from `tokens.css`. Done: Latin and Latin Extended from `@fontsource-variable/red-hat-mono` (OFL licence file shipped in `src/fonts`).
- [x] F3: split `src/theme/fonts.css` out of `tokens.css`; `global.css` imports both; add `./fonts.css` to `package.json` `exports`; update `README.md`. Done: `fonts.css` is imported by `global.css` and exported as `stxdesign-sandbox/fonts.css`; `tokens.css` is variables only.
- [x] F5 (optional): add a fallback `@font-face` with `size-adjust` / `ascent-override` for `system-ui`. Done: Arial-based fallbacks (regular and bold) with `size-adjust` and ascent/descent overrides computed from each font's frequency-weighted average width; wired into `--font-display` / `--font-body`.

## Phase 4: icons to SVG

- [x] Generalize `scripts/generate-partner-logos.mjs` into one script that handles icons, logos and illustrations (same SVGO + SVGR config; barrel with names). Keep `generate:logos` as an alias until the rename lands in `package.json` pre-scripts. Done: `scripts/generate-svg-components.mjs` (targets: logos, icons; illustrations next). `npm run generate:assets`; the old script name is gone.
- [x] Inventory every icon name used in `src/` (components, stories, examples) and vendor those SVGs (regular and filled) into `src/assets/icons/`. Done with `npm run vendor:icons` (`scripts/vendor-icons.mjs`): scans `src/` for icon names, vendors 89 SVGs from `@material-symbols/svg-500@0.47.6`. Noise words (`list`, `tab`, ...) are in `scripts/icon-ignore.json`; names Google renamed are in `scripts/icon-aliases.json`. Regular only; filled variants are not vendored (nothing used them).
- [x] Generate `IconName` and rebuild `<Icon>` on the generated components (`size`, `filled`, `color`, `aria-hidden`, `className`). Done: generated `registry.ts` (`ICON_COMPONENTS`, `IconName`) and `./icons` named exports. `Icon` is an `<svg>` sized `1em` (`.sx-icon`), with `data-icon`. `filled` is not back.
- [x] Define the shared `icon?: IconName | React.ReactElement` prop type and `resolveIcon()`; migrate component by component (Menu, LinkButton, Tag, Alert, CardSteps, CardChecklist, Sidebar, ListAsset, StatusIcon, Upload, Input, Select, MultiSelect, Toast, Pagination, ...). Done: `IconSource = IconName | ReactElement` and `resolveIcon()` in `Icon.tsx`; every component listed was migrated.
- [x] Replace hand-written `material-symbols-rounded` spans with `<Icon>` and delete the per-component font-size overrides (I3). Done; component CSS selectors renamed to `.sx-icon`, and wrappers that were the glyph (`select__chevron`, ...) pass their `font-size` down.
- [x] Remove the Google Material Symbols `@import` and the `.material-symbols-rounded` rule from `global.css`. Done.
- [x] Update tests that query `.material-symbols-rounded` (`Copybox.test.tsx`, `IconButton.test.tsx`). Done (Copybox, IconButton, Toast).
- [x] Update `preview/components-icons.html` and `Icon.stories.tsx` to show the generated set. Partly: `Icon.stories.tsx` has a new AllIcons story. `preview/` is a legacy kit (excluded from lint, still loads Google Fonts) and was left alone.
- [x] Add an ESLint rule or test that fails on new `material-symbols-rounded` usage. Done as a test in `Icon.test.tsx` (scans `src/` for the icon font).

## Phase 5: illustrations and OtcBanner

- [x] L5: inline the `OtcBanner` patterns and arrow through the pipeline; remove `new URL(..., import.meta.url)` and the `assets/` folder from `copy-build-assets.mjs`. Done: patterns and arrow live in `src/assets/otc`, generated into `OtcBanner/art`, drawn inline (colours unchanged); `new URL(...)` and the component `assets/` folder are gone, and `dist/assets` is no longer created.
- [x] L6: add `EmptyStateMedia` and `ErrorResponseMedia` slots (compound parts, per the conventions in `docs/base-ui-migration.md`). Done: `media` prop plus `EmptyStateMedia` / `ErrorResponseMedia` parts.
- [x] L6: export the 28 illustrations from Figma (node ids in the inventory) into `src/assets/illustrations/<slug>.svg`, using the clean per-layer SVG (`download_assets` `svgAssets`), not the node `export`, which includes the section background. Done: all 28 exported (the section has 28 components, not 27).
- [x] L6: extend the generator for illustrations: strip the Figma `width`, `height` and `preserveAspectRatio="none"`, keep `viewBox="0 0 120 120"`, name components `<Name>Illustration`, add a `size` prop (default 120). Done: `./illustrations` target, 120px default, `aria-hidden` by default. Figma exports needed an extra cleaning step: `scripts/clean-figma-export.mjs` strips the page background and section frame.
- [x] L6: make gradient and filter ids unique per instance. Figma exports ids like `paint0_linear_0_4`, and SVGO `cleanupIds` shortens them to `a`, `b`, ...; two illustrations on one page would then share ids and one would pick up the other's gradient. Use SVGO `prefixIds` (or `useId` in the wrapper) and add a test that renders two illustrations and checks the ids differ. Check the generated partner logos for the same problem. Done with SVGO `prefixIds` (`lock__a`, ...); `Illustration.test.tsx` renders all 28 and fails on any shared id. Partner logos have no gradients/filters/clip paths that need it, so they were left alone.
- [x] L6: Storybook page showing all 27 with names; `EmptyState` and `ErrorResponse` stories that use them. Done: Atoms / Illustration (All, Sizes) plus WithIllustration stories for both slots.
- [x] L6: no new empty-state illustration: `EmptyState` uses `DocumentWithMagnifierIllustration` (decided). Nothing else is missing for now.

## Phase 6: release

- [ ] `docs/migration-0.5.md` with before/after snippets: icon prop type, Google import removal, `fonts.css`, logo subpath exports.
- [ ] `CHANGELOG.md` entry and version bump to `0.5.0`.
- [ ] Run `npm run prepublishOnly` and compare `dist` size and the AssetMark bundle against the numbers in this file.

## Illustration inventory

Source: Figma "StraitsX - Design System", section "Section 1" (node `7496:7523`). 28 components, each 120 x 120. All vector (no embedded rasters). A clean export is about 4.8 KB each (Rocket), so roughly 130 KB of source for all 27. They use the brand gradient, a pale tint (`#CAE6DE`) and a grey "glass" look made with Gaussian blur filters.

| Figma name              | Node id      | Possible use                |
| ----------------------- | ------------ | --------------------------- |
| Rocket                  | `2668:19359` | onboarding, launch          |
| Lock with Refresh       | `2668:21337` | reset, re-authenticate      |
| Passcode with Key       | `2692:20946` | passcode, 2FA               |
| Form with Question      | `2776:18277` | help, form review           |
| Document with Magnifier | `2776:18114` | no results, not found (404) |
| ID Card                 | `2808:20720` | KYC, identity               |
| Blockchain              | `2808:21251` | network, transfer           |
| Phone with Shield       | `2808:21460` | device security             |
| Document with Check     | `2808:21704` | approved, submitted         |
| Document with X         | `2809:21158` | rejected                    |
| Verified Badge          | `2868:16710` | verified                    |
| Phone with Chat         | `2868:18092` | contact, support            |
| Document with Alert     | `2868:18123` | action required             |
| Payment Confirmation    | `3488:16223` | payment success             |
| Coin Exchange           | `3490:16612` | swap, convert               |
| List with Refresh       | `3795:25739` | pending, syncing            |
| Document with Settings  | `4088:15243` | settings                    |
| Bank with Hourglass     | `4089:15357` | bank transfer pending       |
| Light Bulb              | `6185:9973`  | tips, coachmark             |
| Bank                    | `6766:9101`  | bank                        |
| Maintenance Wrench      | `6755:8490`  | maintenance, 500            |
| Regulatory Compliant    | `6841:2617`  | compliance                  |
| Identity with Check     | `6846:2664`  | identity verified           |
| Guard with X            | `6846:3827`  | access denied (403)         |
| Review Verification     | `6846:3727`  | under review                |
| Chat with Question Mark | `6846:3778`  | help, FAQ                   |
| Lock                    | `6846:3856`  | locked, security            |
| Link Expired Locked     | `6846:3907`  | expired link                |

Gaps: nothing generic for an empty list ("no transactions yet") or a generic error. "Document with Magnifier" can cover no results and 404, "Maintenance Wrench" can cover 500, but an empty-state illustration is worth asking design for.

## Open questions

- Icon bundle cost: is 22 KB gzipped for the whole icon set (paid by any component that uses `Icon`) acceptable, or should components import named icons? Blocks Phase 6. See the explanation in the chat.
- Icon weight: 500 is in use. Weight 600 matches the old font almost exactly; switching is one constant in `scripts/vendor-icons.mjs`.
- Bank logos: the dashboard loads the bank list from an API, so it builds its own name-to-logo map from `stxdesign-sandbox/logos` for the banks it supports (README has the pattern).
- Zilliqa, Crypto.com and Coinhako were redrawn from the PNGs in Figma. Official vector logos would replace them.

## Results after Phase 2

- One `AssetMark` in a consumer bundle: 489 KB to 31 KB minified, 264 KB to 10 KB gzipped.
- One logo imported from `./logos`: 2.5 KB minified.
- Generated logo source: 505 KB to 192 KB (the three raster logos were 320 KB of it).

## Results after Phases 3 to 5

- Fonts: 465 KB of TTF to 198 KB of WOFF2 plus 34 KB of Red Hat Mono; no request to Google Fonts for fonts or icons.
- Icons: 89 inline SVGs (Material Symbols Rounded 500). `Icon` costs 65 KB minified (22 KB gzipped) for any component that uses it; one icon from `./icons` is 0.4 KB.
- Illustrations: 28 components, one from `./illustrations` is 3.8 KB minified.
- `dist/`: 5.2 MB to 3.8 MB even with the new icon and illustration components, because sources, stories and tests no longer ship.
- Smoke-test budgets: AssetMark 60 KB, Icon 90 KB, one icon 5 KB, one illustration 15 KB, one logo 10 KB.

## Baselines (2026-10-08, before the work)

- `dist/`: 5.2 MB total; `dist/components` 4.6 MB (of which `PartnerLogo/logos` 1.4 MB); `dist/fonts` 460 KB.
- One `AssetMark` in a consumer bundle: 489 KB minified, 264 KB gzipped.
- Largest logo sources: `zilliqa.svg` 244 KB, `bss.svg` 87 KB, `qcp-capital.svg` 60 KB, `crypto-com.svg` 56 KB.
