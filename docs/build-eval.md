# Build & Delivery Eval — StraitsX DS refactor + net-new components

Run after completing the token refactor and net-new component build. Branch
`claude/wonderful-carson-TnV6z` (PR #2).

## Verification results — ALL PASS

| Check | Result |
|---|---|
| **Storybook production build** (`npm run build-storybook`) | ✅ **built successfully** — every component + story compiles & bundles via Vite |
| Component count | ✅ 66 components, each with `.jsx` + `.css` + `.stories.jsx` (66/66/66) |
| Barrel exports (`src/index.js`) | ✅ all resolve to an existing file that exports the symbol |
| Token references repo-wide (`var(--sx-*)`) | ✅ 100% resolve to a defined token (or component-local var) |
| Hardcoded hex in component CSS | ✅ 0 remaining (cleaned to semantic tokens) |
| Remote Figma asset URLs embedded | ✅ 0 (logos passed as ReactNode props) |
| Cross-component imports | ✅ all resolve (Modal/BottomSheet/Table/Button/Tag/Icon reused) |

## What was delivered

### Token system (foundation)
`src/styles/tokens.css` rebuilt as a two-tier system mirroring Figma `STX - New
Token`: `Brand Color/*` primitives → `Base Color`/`Background`/`Surface`/`Status`/
`Component-Button` semantic tokens, full typography ramp (Display/Title/Title-
Mobile/Headline/Label/Body/Body-Bold), spacing (4·8·12·16·20·24·40), radius
(4/8/12/full), shadows lv-1..3. Value bugs fixed (XSGD/XIDR swap, Background vs
Surface, Border). Legacy `--sx-*` aliases retained (deprecated) for compat.

### Existing components migrated (≈40)
All migrated off legacy/ad-hoc tokens onto the semantic layer (398 replacements,
`scripts/migrate-tokens.py`) + residual hex cleanup. Button & Table additionally
aligned to Figma metrics.

### Net-new components built (25)
- **MultiSelect** (Dropdown - Multiple Select)
- **Cards:** CardAsset, CardSwap, CardStatus, CardSummary, CardChecklist, CardAttribute, CardSteps, EstimatedBalance
- **Lists & atoms:** ListAsset, ListBlockchain, ListBank, ListSupportedNetwork, InlineCrossAsset, StatusIcon
- **Fields & product dropdowns:** FieldBank, FieldBlockchain, FieldNetwork, DropdownAsset, DropdownNetwork
- **Overlays & data:** ModalAssetOverview, ModalAssetSelection, BottomSheetNetwork, Modal2FA, TransactionHistoryTable

All compose existing primitives where the design does, use semantic tokens only,
and ship CSF3 stories.

## Already-covered (no new work needed)
`Input` already implements Text Field + Search + Password + Prefix/Suffix +
Input-with-Button via props. `Toast`, `Breadcrumb`, `Page Title`, `QR`,
`Vertical Steps` already existed in the repo and were token-migrated.

## Notes / follow-ups
- **Chromatic** (PR #2) will show intended visual diffs from the token alignment
  (feedback/status colors, borders) — review & approve there.
- Product composites use **placeholder/initials marks**; wire real coin/bank/
  network logos (repo `Logomark`/`PartnerLogo` or asset set) when integrating.
- Legacy `--sx-*` aliases can be removed once external consumers migrate.
