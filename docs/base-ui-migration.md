# Base UI migration plan

Goal: move stxdesign-sandbox from Ant-style monolithic components (config props, hand-rolled behavior) to the Base UI / shadcn approach (compound parts, headless primitives, data-attribute state). Keep the existing tokens and plain CSS.

Reference: https://base-ui.com and https://ui.shadcn.com/docs/components/base

Status legend: `[ ]` todo, `[~]` in progress, `[x]` done. Update this file as work lands so a new session can pick up where the last one stopped.

## Decisions

- Behavior layer: `@base-ui/react` (latest 1.8.0 as of 2026-10-06; the old `@base-ui-components/react` name is deprecated). Pin an exact version.
- Styling: keep plain CSS + `tokens.css`. No Tailwind. Style Base UI parts with `className` and `[data-*]` selectors.
- Language: TypeScript only. Convert `.jsx` components as they are touched.
- Release: breaking changes ship as a 0.x minor bump (e.g. `0.3.0`) with a migration section in `CHANGELOG`/README. Dashboard app needs a matching update PR.
- Old APIs: clean break in `0.3.0`, no deprecated wrappers. Migration snippets go in `docs/migration-0.3.md`.
- Form controls (`Input`, `Textarea`, `Select`, ...) are bare controls; label / helper / error come from `Field` (shadcn style). Control-level features (clear button, password reveal, trailing button) stay on the control.
- Domain components (`Dropdown*`, `Field*`, `List*`, `BottomSheet*`, `Modal*`, `Card*`) stay exported for now but are rebuilt as thin compositions over the generic primitives, with shared code deduplicated.
- Reference implementations to copy: `Button` (single part + `render`), `Tabs` (compound namespace), `Field` (form wiring). Shared helpers: `cn()` and `withClass()` in `src/lib/cn.ts`.

## Conventions (apply to every migrated component)

1. Compound parts exported as a namespace: `Tabs.Root`, `Tabs.List`, `Tabs.Tab`, `Tabs.Panel`. Display components follow shadcn naming instead: `Card`, `CardHeader`, `CardTitle`, `CardContent`.
2. Every part forwards `ref` (React 19 `ref` prop) and spreads remaining native props onto its root element.
3. Polymorphism via Base UI's `render` prop. For our own non-Base UI components, use `useRender` from `@base-ui/react/use-render`.
4. Controlled state naming: `value` / `defaultValue` / `onValueChange`, `open` / `defaultOpen` / `onOpenChange`, `checked` / `onCheckedChange`.
5. State styling via data attributes (`[data-open]`, `[data-disabled]`, `[data-highlighted]`, `[data-selected]`, `[data-invalid]`). Remove `is-*` state classes.
6. Story-only visual states (`.is-hovered`, `.is-pressed`, `.is-focused`) must not ship in production CSS. Use Storybook pseudo-state addon or a story-only stylesheet.
7. Class merging via a shared `cn()` helper in `src/lib/cn.ts`. No string concatenation or `.filter(Boolean).join(" ")`.
8. Content goes in `children`, not props like `title` / `body` / `items` / `options` / `links`.
9. Icons: decorative icons get `aria-hidden="true"`. Icon-only controls need `aria-label`.
10. No `cloneElement` / `child.type ===` checks for parent-child wiring. Use context.

## Phase 0: foundation

- [x] Install `@base-ui/react` (exact version) as a dependency; confirm it builds through Babel and is externalized correctly in `dist`.
- [x] Add `src/lib/cn.ts` (`cn()` + `withClass()` for Base UI state-function classNames) and use it in new code.
- [x] Add `isolation: isolate` on the app root and `body { position: relative }` to `global.css` per Base UI setup docs.
- [x] Reference implementations instead of a template: `src/components/{Button,Tabs,Field}` (component, CSS with data-attribute selectors, TS story, TS test).
- [x] Story-only states use `storybook-addon-pseudo-states` (`parameters.pseudo`, see `Button.stories.tsx` `States`). Removed from `Button.css`; remaining components are removed as they migrate.
- [x] Deleted stale `src/COMPONENT_AUDIT.md` (wrong repo / outdated counts). `docs/base-ui-migration.md` is the status source of truth.

## Phase 1: behavior-heavy primitives (highest value, known bugs)

Order matters: later items depend on earlier ones.

### 1.1 Menu
- [x] Rebuild on Base UI `Menu` (`Root`, `Trigger`, `Portal`, `Positioner`, `Popup`, `Item`, `RadioGroup`/`RadioItem`, `CheckboxItem`, `Separator`, `Group`/`GroupLabel`).
- [x] Map current `MenuItem` props: `icon`/`leading`/`trailing`/`secondary` become children slots; `tone="critical"` becomes `data-variant="critical"` or a `variant` prop; `selectable` becomes `RadioItem` / `CheckboxItem`.
- [x] Fixes: arrow keys, typeahead, focus into popup, portal (no clipping), no `cloneElement` `__close` injection.
- [x] Consumers to update: `InputCurrency` updated to compound `Menu` + `RadioGroup`. `TopNavProfileMenu` / `CompanyProfileMenu` verified — they are static markup menus, not `Menu` consumers. `Select` replaced in 1.2.

### 1.2 Select
- [x] Rebuild on Base UI `Select` (`Root`, `Trigger`, `Value`, `Icon`, `Portal`, `Positioner`, `Popup`, `List`, `Item`, `ItemText`, `ItemIndicator`).
- [x] `options=[]` becomes children `Select.Item`s. `onChange(value, option)` becomes `onValueChange(value)`. Pass `items` on Root for closed-state labels.
- [x] Label/helper/error move to `Field` (see 1.6).
- [x] Clear action: real sibling `<button>` (`Select.Clear`) outside the trigger, not a `span role="button"` inside it.
- [x] Fixes: correct `listbox` semantics, keyboard nav.

### 1.3 Combobox / MultiSelect and the domain families
- [x] Rebuild `MultiSelect` on Base UI `Combobox` (multiple) with chips / clear / filter input.
- [x] Replace `DropdownBank`, `DropdownBlockchain`, `DropdownNetwork`, `DropdownAsset` with shared `OptionList` primitive + thin domain recipes (`account` / `address` / `balance` → secondary/trailing).
- [x] Replace `FieldBank` / `FieldBlockchain` / `FieldNetwork` with shared `FieldOptionSelect` (Select + rich rows) + thin recipes. Label/helper/error via `Field`.
- [x] `ListBank` / `ListBlockchain` / `ListSupportedNetwork`: conventions (TS, `cn()`, `data-variant`).
- [x] Keep domain Dropdown/Field/List recipes exported for now (thin compositions); revisit moving to examples/dashboard later.

### 1.4 Dialog (Modal) and sheets
- [x] Rebuild `Modal` on Base UI `Dialog` (`Root`, `Trigger`, `Portal`, `Backdrop`, `Popup`, `Title`, `Description`, `Close`). Delete hand-rolled focus trap, scroll lock and Escape handling.
- [x] Replace `variant="illustration" | "new-feature"` and `illustration` / `media` / `footer` props with composable parts (`Modal.Header`, `Modal.Media`, `Modal.Body`, `Modal.Footer`).
- [x] `open` + `onClose` becomes `open` + `onOpenChange`. `dismissable={false}` maps to Base UI's dismissal controls.
- [x] Rebuild `BottomSheet` on `Dialog` (or Base UI `Drawer` if available in the pinned version).
- [x] Rebuild consumers as compositions: `Modal2FA`, `ModalAssetOverview`, `ModalAssetSelection`, `BottomSheetBank`, `BottomSheetBlockchain`, `BottomSheetNetwork`. Consider moving them out of core. Shared list UI lives in internal `BottomSheetSelect` (not package-exported).

### 1.5 Tooltip, Popover, Coachmark
- [x] Rebuild `Tooltip` on Base UI `Tooltip` (`Provider`, `Root`, `Trigger`, `Portal`, `Positioner`, `Popup`, `Arrow`). Plain text content only.
- [x] Add `Popover` on Base UI `Popover` for rich content (title + tag + links). Move the current rich-tooltip usage there; interactive content must not live in a tooltip.
- [x] Rebuild `Coachmark` on `Popover`.
- [x] Consumers to update: `InputCurrency` (plain `Tooltip`), `Table` (rich → `Popover`).

### 1.6 Field and form controls
- [x] Add `Field` on Base UI `Field` (`Root`, `Label`, `Control`, `Description`, `Error`) and optionally `Fieldset` / `Form`.
- [x] `Input`, `Textarea`: bare controls used inside `Field` (clear / password / trailing button stay on Input).
- [x] `InputCurrency`: bare control inside `Field`; asset picker stays on the control (`Menu` + `RadioGroup`). Label hint is a `Field` + `Tooltip` composition in stories.
- [x] `DateInput`: bare control inside `Field`; calendar opens in `Popover` (light surface). Full `react-day-picker` evaluation stays in Phase 2.
- [x] `Checkbox` on Base UI `Checkbox` (+ `CheckboxGroup`), `onCheckedChange`, indeterminate support.
- [x] `Radio` on Base UI `RadioGroup` + `Radio` (arrow-key group nav).
- [x] `Switch` on Base UI `Switch` (`Root`, `Thumb`).
- [x] `SelectionBox`: styled `Radio` / `Checkbox` item (card chrome).

### 1.7 Tabs
- [x] Rebuild on Base UI `Tabs` (`Root`, `List`, `Tab`, `Indicator`, `Panel`). `items=[]` becomes children; `activeTab`/`onTabChange` becomes `value`/`onValueChange`.
- [x] `variant="secondary"` and `fill` are props on `Tabs.List` (exposed as `data-variant` / `data-fill`).

### 1.8 Toast
- [x] Rebuild on Base UI `Toast` (`Provider`, `Viewport`, `Root`, `Title`, `Description`, `Close`) with `useToastManager`. `ToastProvider` + `useToast` / `useOptionalToast` facade.
- [x] Consumer to update: `Copybox` (optional toast via `useOptionalToast`).

## Phase 2: non-primitive components (conventions only)

No Base UI primitive; apply the conventions (TS, ref + prop spread, `cn()`, data attributes, children over content props).

- [x] `Button`: built on Base UI `Button` (`render` + `nativeButton={false}` for links); story-only state classes removed.
- [x] Keep `LinkButton` / `IconButton` as separate exports (distinct ergonomics: required `label`, link chrome / `onDark`). Both rebuilt on Base UI `Button` + `cn()` / `data-*`.
- [x] Add `ButtonGroup` (shadcn style: `role="group"`, orientation, attached sibling edges).
- [x] `Card` compound parts: `Card` / `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter` (shadcn style; `title`/`body` props removed). Domain cards (`CardAsset`, `CardAttribute`, `CardChecklist`, `CardStatus`, `CardSteps`, `CardSummary`, `CardSwap`) converted to TS recipes with `cn()` / `data-*`.
- [x] `Tag`, `Badge`, `Alert` (+ `AlertTitle` / `AlertDescription` / `AlertActions`), `EmptyState`, `ImportantNotes`, `ErrorResponse`, `PageTitle`, `StatusIcon`: TS + `cn()` + `data-*`; children-based parts where useful.
- [x] `Table` compound parts (`Table` / `TableWrap` / `TableHeader` / `TableBody` / `TableRow` / `TableHead` / `TableCell` / `TableCaption`). Timezone helpers moved to `src/lib/timezone.ts`. Data-driven API lives in `DataTable` (recipe).
- [x] `Pagination`, `Breadcrumb`, `Steps`: compound parts, `nav` + `aria-current`. `PaginationNav` is the page-aware recipe (`page` / `totalPages` / `onPageChange`). `VerticalStep` replaces `items[]`.
- [x] `Sidebar`, `TopNavigation`, `TopNavProfileMenu`, `CompanyProfileMenu`: compositions using `Menu` + `Collapsible`; TS + `cn()` + `data-*`.
- [x] `Calendar`, `DateInput`: keep the custom calendar (no `react-day-picker` — surface is small, already token-styled, range + multi-month covered). Applied conventions (`cn()`, `data-*`, prop spread). `DateInput` already on `Popover` + `Field`.
- [x] `Upload`, `Copybox`: conventions applied (TS, `cn()`, data attributes, Field composition).
- [x] `QR`, `EstimatedBalance`, `OtcBanner`, `InlineCrossAsset`, `AssetMark`, `Logo`, `Logomark`, `PartnerLogo`, `Icon`: conventions applied (TS + `cn()` / `data-*`). Generated PartnerLogo marks emit `.tsx`.

## Phase 3: cleanup

- [x] All package source in `.tsx` / `.ts` (including generated PartnerLogo SVGs); `allowJs` removed from `tsconfig.json`.
- [x] `ThemeContext` / `useTheme`: kept as optional export for JS token access (CSS variables remain preferred). Dashboard uses its own local ThemeContext today — not imported from stxdesign-sandbox — so safe to keep for package consumers in 0.3.
- [x] Clean break: removed soft aliases (`EmptyState.sub`, `ErrorResponse.body`, `PaginationNav.onChange`, `TableData`, `OptionList.onSelect`). Documented in `docs/migration-0.3.md` + `CHANGELOG.md`.
- [x] Decorative Material Symbols: production components audited; icon-only controls keep `aria-label`, glyphs use `aria-hidden` (parent or self). Full SVG migration deferred.
- [x] Run `@storybook/addon-a11y` across all stories; zero violations with `a11y.test: "error"`. Token pass (`--status-warning-strong`, darker link/disabled/placeholder/gold/sidebar-active text); ARIA (StatusIcon, HorizontalSteps, OptionList); Calendar/Table opacity → solid muted colors; Select/MultiSelect Field wrappers; sandbox topnav surface; TableWrap `tabIndex={0}`; exclude Base UI focus guards.
- [x] Update README usage examples to the compound APIs.
- [x] `docs/migration-0.3.md` + `CHANGELOG.md` for the 0.3.0 cut.

## Per-component definition of done

- [ ] Built on the Base UI primitive (if one exists) or follows the conventions above.
- [ ] TypeScript, exported prop types for every part, exported from `src/index.ts`.
- [ ] CSS uses tokens and `[data-*]` selectors; no `is-*` state classes; visually matches Figma.
- [ ] Stories updated to the new API, including keyboard and disabled/invalid states.
- [ ] Tests cover keyboard interaction and ARIA roles (Vitest unit + storybook project).
- [ ] `npm run lint`, `npm run test`, `npm run build`, `npm run test:pack` pass.
- [ ] Migration note added (old API to new API snippet).
- [ ] Status checkbox in this file updated.

## Example: before and after

```jsx
// Before
<Tabs
  items={[
    { id: "in", label: "Transfer In", content: <TransferIn /> },
    { id: "out", label: "Transfer Out", content: <TransferOut /> },
  ]}
  activeTab={tab}
  onTabChange={setTab}
/>

// After
<Tabs.Root value={tab} onValueChange={setTab}>
  <Tabs.List>
    <Tabs.Tab value="in">Transfer In</Tabs.Tab>
    <Tabs.Tab value="out">Transfer Out</Tabs.Tab>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Panel value="in"><TransferIn /></Tabs.Panel>
  <Tabs.Panel value="out"><TransferOut /></Tabs.Panel>
</Tabs.Root>
```

## Known bugs fixed by this migration (from the 2026-10-06 review)

- `Select`: trigger uses `aria-haspopup="listbox"` but the popup is `role="menu"`; clear control is a `span role="button"` nested in a `button` (invalid, not keyboard reachable).
- `Menu`: no arrow keys or typeahead; focus not moved into the popup; not portaled (clipped in overflow containers); `cloneElement` close wiring breaks if an item is wrapped.
- `Tabs`: no arrow keys or roving tabindex; tabs and panels not linked with `aria-controls` / `aria-labelledby`.
- `Tooltip`: no flip/collision handling; contains interactive links (should be a popover).
- `Modal`: hand-rolled focus trap and scroll lock duplicated in `BottomSheet`.
