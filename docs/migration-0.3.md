# Migrating to soldier-boy 0.3

Breaking release: Ant-style config props → Base UI / shadcn compound parts.
Peer: React 19. New runtime dependency: `@base-ui/react` (pinned).

Prefer this guide over hunting through Storybook. Full status: `docs/base-ui-migration.md`.

## Quick rename table

| Was (≤0.2) | Now (0.3) |
|---|---|
| `EmptyState` `sub` | `description` (or `<EmptyStateDescription>`) |
| `ErrorResponse` `body` | `description` (or `<ErrorResponseDescription>`) |
| `Pagination` / `PaginationNav` `onChange` | `onPageChange` |
| `TableData` | `DataTable` |
| `OptionList` / `Dropdown*` `onSelect` | `onValueChange` |
| `Modal` `onClose` / flat props | `Modal.Root` `onOpenChange` + compound parts |
| `Select` `options=[]` + `onChange` | `Select.Item` children + `onValueChange` |
| `Tabs` `items=[]` | `Tabs.Tab` / `Tabs.Panel` children |
| `Menu` flat items | `Menu.Item` children |
| `Card` `title` / `body` props | `CardTitle` / `CardContent` children |
| Form `label` / `helper` / `error` on controls | Wrap with `Field.Root` + `Field.Label` / `Description` / `Error` |
| Tooltip with links / actions | `Popover` (interactive content) |

## Theme / tokens

- Styling uses CSS variables from `soldier-boy/tokens.css` (and `global.css` for resets).
- `theme` object, `ThemeProvider`, and `useTheme` remain exported for optional JS token access. Prefer `var(--…)` in CSS. The StraitsX dashboard currently uses its own local ThemeContext — soldier-boy’s copy is kept for package consumers, not deleted in 0.3.

Contrast-related token tweaks in 0.3 (WCAG AA): darker `--brand-credible-blue`, `--brand-wealthy-gold`, `--disabled-on-surface`, `--input-placeholder`, `--sidebar-menuitem-text`; new `--status-warning-strong` for warning text and solid fills with white glyphs.

## Forms

```tsx
// Before
<Input label="Email" helper="Work email" error={err} />

// After
<Field.Root invalid={!!err}>
  <Field.Label>Email</Field.Label>
  <Input type="email" />
  <Field.Description>Work email</Field.Description>
  <Field.Error match={!!err}>{err}</Field.Error>
</Field.Root>
```

```tsx
// Before
<Select options={opts} value={v} onChange={(v) => setV(v)} />

// After
<Select.Root items={opts} value={v} onValueChange={setV}>
  <Select.Control>
    <Select.Trigger>
      <Select.Value placeholder="Select…" />
      <Select.Icon />
    </Select.Trigger>
    <Select.Clear />
  </Select.Control>
  <Select.Popup>
    <Select.List>
      {opts.map((o) => (
        <Select.Item key={o.value} value={o.value}>{o.label}</Select.Item>
      ))}
    </Select.List>
  </Select.Popup>
</Select.Root>
```

`MultiSelect` follows the same Field + compound pattern (see Storybook).

## Overlays

```tsx
// Before
<Modal open={open} onClose={() => setOpen(false)} title="Confirm">…</Modal>

// After
<Modal.Root open={open} onOpenChange={setOpen}>
  <Modal.Popup>
    <Modal.Header>
      <Modal.Title>Confirm</Modal.Title>
      <Modal.Close />
    </Modal.Header>
    <Modal.Body>…</Modal.Body>
    <Modal.Footer>…</Modal.Footer>
  </Modal.Popup>
</Modal.Root>
```

`BottomSheet` is the same Dialog-based compound API. `Tooltip` is plain text only; use `Popover` for titles, tags, and action links.

## Navigation & lists

```tsx
// Before
<Tabs items={[{ key: "in", label: "In", children: <In /> }]} />

// After
<Tabs.Root defaultValue="in">
  <Tabs.List>
    <Tabs.Tab value="in">In</Tabs.Tab>
    <Tabs.Tab value="out">Out</Tabs.Tab>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Panel value="in"><In /></Tabs.Panel>
  <Tabs.Panel value="out"><Out /></Tabs.Panel>
</Tabs.Root>
```

```tsx
<PaginationNav page={page} totalPages={n} onPageChange={setPage} />
```

```tsx
<OptionList
  value={selected}
  onValueChange={(value, option) => setSelected(value)}
  options={[{ value: "dbs", name: "DBS Bank" }]}
/>
```

Domain `Dropdown*` / `Field*` recipes still export; they accept `onValueChange` like `OptionList`.

## Surfaces

```tsx
// Before
<Card title="Balance" body={<Amount />}>…</Card>

// After
<Card>
  <CardHeader>
    <CardTitle>Balance</CardTitle>
  </CardHeader>
  <CardContent><Amount /></CardContent>
</Card>
```

Table: compose `Table` / `TableWrap` / `TableHeader` / … or use the data-driven `DataTable` recipe (not `TableData`).

## Removed aliases (no compatibility shims)

These were soft-deprecated during the migration and **do not** exist in 0.3:

- `EmptyState.sub`
- `ErrorResponse.body`
- `PaginationNav.onChange`
- `TableData`
- `OptionList.onSelect` (and story `onSelect` on Dropdown*)

## Checklist for consumer apps

1. Bump to `soldier-boy@0.3.0` and ensure `@base-ui/react` resolves (bundled as a dependency of the package).
2. Import `soldier-boy/global.css` (or `tokens.css`) once at the app root.
3. Replace form labels with `Field.*`.
4. Replace overlay / tabs / menu / select call sites with compound parts.
5. Run the rename table find-and-replace.
6. Smoke Storybook / Chromatic on the dashboard PR that lands beside this release.
