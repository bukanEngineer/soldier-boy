# Base UI migration plan

Goal: move soldier-boy from Ant-style monolithic components (config props, hand-rolled behavior) to the Base UI / shadcn approach (compound parts, headless primitives, data-attribute state). Keep the existing tokens and plain CSS.

Reference: https://base-ui.com and https://ui.shadcn.com/docs/components/base

Status legend: `[ ]` todo, `[~]` in progress, `[x]` done. Update this file as work lands so a new session can pick up where the last one stopped.

## Decisions

- Behavior layer: `@base-ui/react` (latest 1.8.0 as of 2026-10-06; the old `@base-ui-components/react` name is deprecated). Pin an exact version.
- Styling: keep plain CSS + `tokens.css`. No Tailwind. Style Base UI parts with `className` and `[data-*]` selectors.
- Language: TypeScript only. Convert `.jsx` components as they are touched.
- Release: breaking changes ship as a 0.x minor bump (e.g. `0.3.0`) with a migration section in `CHANGELOG`/README. Dashboard app needs a matching update PR.
- Old APIs: no long-term compatibility shims. Where cheap, keep a thin legacy wrapper for one release and mark it `@deprecated`.

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

- [ ] Install `@base-ui/react` (exact version) as a dependency; confirm it builds through Babel and is externalized correctly in `dist`.
- [ ] Add `src/lib/cn.ts` and use it in new code.
- [ ] Add a portal root / `isolation: isolate` note to `global.css` per Base UI setup docs.
- [ ] Add `docs/component-template/` (or update `docs/story-template.stories.jsx`) showing a compound component, its CSS with data-attribute selectors, story and test.
- [ ] Decide how story-only states are rendered (e.g. `storybook-addon-pseudo-states`) and remove `is-hovered` / `is-pressed` / `is-focused` from `Button.css` and others.
- [ ] Update `AGENTS.md` with the conventions above (short pointer to this file).
- [ ] Delete or rewrite stale `src/COMPONENT_AUDIT.md` (it names another repo and an old count).

## Phase 1: behavior-heavy primitives (highest value, known bugs)

Order matters: later items depend on earlier ones.

### 1.1 Menu
- [ ] Rebuild on Base UI `Menu` (`Root`, `Trigger`, `Portal`, `Positioner`, `Popup`, `Item`, `RadioGroup`/`RadioItem`, `CheckboxItem`, `Separator`, `Group`/`GroupLabel`).
- [ ] Map current `MenuItem` props: `icon`/`leading`/`trailing`/`secondary` become children slots; `tone="critical"` becomes `data-variant="critical"` or a `variant` prop; `selectable` becomes `RadioItem` / `CheckboxItem`.
- [ ] Fixes: arrow keys, typeahead, focus into popup, portal (no clipping), no `cloneElement` `__close` injection.
- [ ] Consumers to update: `InputCurrency`, `TopNavProfileMenu`, `CompanyProfileMenu` (verify these), `Select` (replaced in 1.2).

### 1.2 Select
- [ ] Rebuild on Base UI `Select` (`Root`, `Trigger`, `Value`, `Icon`, `Portal`, `Positioner`, `Popup`, `List`, `Item`, `ItemText`, `ItemIndicator`).
- [ ] `options=[]` becomes children `Select.Item`s. `onChange(value, option)` becomes `onValueChange(value)`.
- [ ] Label/helper/error move to `Field` (see 1.6).
- [ ] Clear action: real sibling `<button>` outside the trigger, not a `span role="button"` inside it.
- [ ] Fixes: correct `listbox` semantics, keyboard nav.

### 1.3 Combobox / MultiSelect and the domain families
- [ ] Rebuild `MultiSelect` on Base UI `Combobox` (multiple) or `Select multiple`.
- [ ] Replace `DropdownBank`, `DropdownBlockchain`, `DropdownNetwork` (near-identical copies) with one generic primitive plus item recipes (asset mark + name + secondary text).
- [ ] Same for `FieldBank` / `FieldBlockchain` / `FieldNetwork` and `ListBank` / `ListBlockchain` / `ListSupportedNetwork`.
- [ ] Decide which of these stay exported vs move to `src/examples` / dashboard app as recipes.

### 1.4 Dialog (Modal) and sheets
- [ ] Rebuild `Modal` on Base UI `Dialog` (`Root`, `Trigger`, `Portal`, `Backdrop`, `Popup`, `Title`, `Description`, `Close`). Delete hand-rolled focus trap, scroll lock and Escape handling.
- [ ] Replace `variant="illustration" | "new-feature"` and `illustration` / `media` / `footer` props with composable parts (`Modal.Header`, `Modal.Media`, `Modal.Body`, `Modal.Footer`).
- [ ] `open` + `onClose` becomes `open` + `onOpenChange`. `dismissable={false}` maps to Base UI's dismissal controls.
- [ ] Rebuild `BottomSheet` on `Dialog` (or Base UI `Drawer` if available in the pinned version).
- [ ] Rebuild consumers as compositions: `Modal2FA`, `ModalAssetOverview`, `ModalAssetSelection`, `BottomSheetBank`, `BottomSheetBlockchain`, `BottomSheetNetwork`. Consider moving them out of core.

### 1.5 Tooltip, Popover, Coachmark
- [ ] Rebuild `Tooltip` on Base UI `Tooltip` (`Provider`, `Root`, `Trigger`, `Portal`, `Positioner`, `Popup`, `Arrow`). Plain text content only.
- [ ] Add `Popover` on Base UI `Popover` for rich content (title + tag + links). Move the current rich-tooltip usage there; interactive content must not live in a tooltip.
- [ ] Rebuild `Coachmark` on `Popover`.
- [ ] Consumers to update: `InputCurrency`, `Table`.

### 1.6 Field and form controls
- [ ] Add `Field` on Base UI `Field` (`Root`, `Label`, `Control`, `Description`, `Error`) and optionally `Fieldset` / `Form`.
- [ ] `Input`, `Textarea`, `InputCurrency`, `DateInput`: become bare controls used inside `Field`. Remove baked-in `label` / `helper` / `error` props (or keep a thin `TextField` convenience wrapper; decide once).
- [ ] `Checkbox` on Base UI `Checkbox` (+ `CheckboxGroup`), `onCheckedChange`, indeterminate support.
- [ ] `Radio` on Base UI `RadioGroup` + `Radio` (arrow-key group nav).
- [ ] `Switch` on Base UI `Switch` (`Root`, `Thumb`).
- [ ] `SelectionBox`: evaluate as a styled `RadioGroup` / `CheckboxGroup` item.

### 1.7 Tabs
- [ ] Rebuild on Base UI `Tabs` (`Root`, `List`, `Tab`, `Indicator`, `Panel`). `items=[]` becomes children; `activeTab`/`onTabChange` becomes `value`/`onValueChange`.
- [ ] `variant="secondary"` and `fill` stay as props on `Tabs.List` (or `Root`).

### 1.8 Toast
- [ ] Rebuild on Base UI `Toast` (`Provider`, `Viewport`, `Root`, `Title`, `Description`, `Close`) with `useToastManager`.
- [ ] Consumer to update: `Copybox`.

## Phase 2: non-primitive components (conventions only)

No Base UI primitive; apply the conventions (TS, ref + prop spread, `cn()`, data attributes, children over content props).

- [ ] `Button`: add `render` prop (via `useRender`) so it can render as a link; remove story-only state classes. Consider merging `LinkButton` / `IconButton` into `Button` variants/sizes.
- [ ] Add `ButtonGroup` (shadcn style: `role="group"`, orientation, separator). New component.
- [ ] `Card` and `Card*` family (`CardAsset`, `CardAttribute`, `CardChecklist`, `CardStatus`, `CardSteps`, `CardSummary`, `CardSwap`): base `Card` becomes `Card` / `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter`; domain cards become recipes.
- [ ] `Tag`, `Badge`, `Alert`, `EmptyState`, `ImportantNotes`, `ErrorResponse`, `PageTitle`, `StatusIcon`: children-based parts, ref + spread.
- [ ] `Table`: split into `Table` / `TableHeader` / `TableBody` / `TableRow` / `TableHead` / `TableCell` parts (shadcn style). Move timezone/date formatting helpers out to `src/lib`. Data-driven behavior (sort, infinite load) stays in an optional higher-level wrapper or recipe.
- [ ] `Pagination`, `Breadcrumb`, `Steps`: compound parts, `nav` + `aria-current`.
- [ ] `Sidebar`, `TopNavigation`, `TopNavProfileMenu`, `CompanyProfileMenu`: compositions using `Menu`, `Collapsible`/`Accordion` where relevant.
- [ ] `Calendar`, `DateInput`: evaluate `react-day-picker` (shadcn's choice) vs keeping custom; at minimum apply conventions.
- [ ] `Upload`, `Copybox`, `QR`, `EstimatedBalance`, `OtcBanner`, `InlineCrossAsset`, `AssetMark`, `Logo`, `Logomark`, `PartnerLogo`, `Icon`: conventions only.

## Phase 3: cleanup

- [ ] All components in `.tsx`; remove `allowJs` from `tsconfig.json` when done.
- [ ] Remove `ThemeContext` / `useTheme` if nothing consumes it (CSS variables are the source of truth). Check the dashboard app first.
- [ ] Remove deprecated legacy wrappers from the previous release.
- [ ] Audit icons: replace Material Symbols ligature text with SVG icons or ensure every decorative instance has `aria-hidden`.
- [ ] Run `@storybook/addon-a11y` across all stories; zero violations.
- [ ] Update README usage examples to the compound APIs.

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
