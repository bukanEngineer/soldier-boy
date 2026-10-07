## Quick start

```bash
# 1. Install
npm install

# 2. Run Storybook (http://localhost:6006)
npm run storybook

# 3. Build the static Storybook (used by Chromatic CI)
npm run build-storybook

# 4. Run Chromatic locally — needs CHROMATIC_PROJECT_TOKEN in env
npx chromatic --project-token=<your-token>
```

## Using this package in an app

Install it as a dependency, then import components and stylesheets from the built `dist/` output:

```bash
npm install soldier-boy
```

```tsx
import "soldier-boy/global.css"; // resets + tokens + @font-face (once, at your app's entry)
import {
  Button,
  Tag,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Tabs,
  Field,
  Input,
} from "soldier-boy";

export default function Example() {
  return (
    <Card shadow={1}>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent>
        <Tag tone="positive">Verified</Tag>
        <Button variant="primary">Continue</Button>
      </CardContent>
    </Card>
  );
}
```

### Compound APIs (Base UI migration)

Form controls are bare; labels/errors come from `Field`. Overlays and navigation use compound parts:

```tsx
import { Field, Input, Select, Tabs, Menu, PaginationNav } from "soldier-boy";

<Field.Root>
  <Field.Label>Email</Field.Label>
  <Input type="email" />
  <Field.Error match>Required</Field.Error>
</Field.Root>

<Tabs.Root defaultValue="in">
  <Tabs.List>
    <Tabs.Tab value="in">Transfer In</Tabs.Tab>
    <Tabs.Tab value="out">Transfer Out</Tabs.Tab>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.Panel value="in">…</Tabs.Panel>
  <Tabs.Panel value="out">…</Tabs.Panel>
</Tabs.Root>

<Menu.Root>
  <Menu.Trigger>Actions</Menu.Trigger>
  <Menu.Popup>
    <Menu.Item icon="download">Download</Menu.Item>
    <Menu.Separator />
    <Menu.Item icon="logout" variant="critical">Log out</Menu.Item>
  </Menu.Popup>
</Menu.Root>

<PaginationNav page={2} totalPages={12} onPageChange={setPage} />
```

Upgrading from 0.2: see `docs/migration-0.3.md`. Full migration status and conventions: `docs/base-ui-migration.md`.

Each component imports its own CSS (`import "./Button.css"` etc.) as part of the package — this requires a bundler that handles CSS-from-JS imports (Vite, webpack, Next.js, Remix, CRA all do this out of the box, including for `node_modules` dependencies). Running the package's compiled output directly under plain Node (no bundler) is not a supported consumption path.

`soldier-boy/tokens.css` is also available on its own if you only want the CSS variables and `@font-face` rules without the body reset from `global.css`.

### Building the package

`npm run build` compiles `src/` with Babel into `dist/` (ESM, `.jsx`/`.tsx` extensions preserved, cross-file imports rewritten to match), generates type declarations with `tsc`, and copies fonts/assets/CSS alongside — mirroring the `src/` layout so relative asset paths keep resolving. `npm run prepublishOnly` runs lint + test + build + a smoke test of the packed tarball automatically before `npm publish`.

## Wiring up Chromatic

1. Sign in at [chromatic.com](https://www.chromatic.com) and link your GitHub repo. Chromatic gives you a **project token**.
2. In your repo, go to **Settings → Secrets and variables → Actions → New repository secret** and add:
   - Name: `CHROMATIC_PROJECT_TOKEN`
   - Value: the token from step 1.
3. Push to `main` or open a PR. The workflow at `.github/workflows/chromatic.yml` will build Storybook, upload it to Chromatic, and post a PR comment with the diff URL.

The workflow uses `onlyChanged: true` (TurboSnap) so only stories whose dependencies changed get re-snapshotted — keeps your monthly snapshot budget low.

## Stable Storybook URL (Vercel)

Chromatic build URLs change per run. Vercel serves the static Storybook at a stable URL and updates it on every push to `main` (Git integration on `bukanEngineer/soldier-boy`). PRs get preview URLs automatically.

Build is locked to Storybook via `vercel.json` and project settings:

- Build Command: `npm run build-storybook`
- Output Directory: `storybook-static`
- Framework: Other (not the package `npm run build` → `dist/`)

Chromatic (visual regression) and Vercel (hosted Storybook) both run from git pushes — they are independent. Local `npm run storybook` / Chromatic CLI does **not** update the Vercel URL; push to `main` (or open a PR for a preview).

## Project layout

The source follows the `straitsx-frontend/packages/design-system` structure — TypeScript components with per-folder barrels, plus `constants/`, `shared/`, and `theme/` — while keeping the plain CSS + tokens approach and an ESM-only build.

```
soldier-boy/
├── package.json
├── vite.config.js
├── chromatic.config.json
├── vercel.json                 ← Storybook static deploy to Vercel
├── .storybook/
│   ├── main.js                 ← stories glob + framework config
│   └── preview.js              ← global styles + backgrounds + story sort
├── .github/workflows/
│   └── chromatic.yml           ← visual regression on every PR
├── scripts/                    ← build assets, logo generation, pack smoke test
├── src/
│   ├── index.ts                ← package exports (component + constant + theme barrels)
│   ├── theme/
│   │   ├── tokens.css          ← --sx-* CSS variables + @font-face
│   │   ├── theme.ts            ← typed theme object backed by CSS variables
│   │   └── ThemeContext.tsx    ← optional ThemeProvider / useTheme (CSS vars preferred)
│   ├── styles/
│   │   └── global.css          ← resets, body defaults, Material Symbols
│   ├── constants/              ← Colors/, Typography/, Spacing/, spacing, breakpoints, shadow
│   ├── shared/                 ← ColorStyles.ts, TypographyStyles.ts
│   ├── fonts/                  ← Hanken Grotesk + Red Hat Display ttfs
│   ├── assets/                 ← logomark + partner SVGs
│   ├── hooks/
│   ├── stories/                ← Examples.stories.tsx
│   └── components/             ← one folder per component: {Component}.tsx + .css
│                                  + index.tsx barrel + .stories.tsx (+ .test.tsx)
└── examples/                   ← full dashboard compositions
```
