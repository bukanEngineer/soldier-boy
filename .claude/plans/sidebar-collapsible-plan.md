# Sidebar Collapsible Mode + Provider Implementation Plan

## Overview

Add three features to the Sidebar component:
1. **Collapsible mode** — icon-only collapse on desktop
2. **Mobile overlay** — offcanvas drawer with backdrop on mobile
3. **`useSidebar()` context** — shared state accessible from any component (e.g., TopNavigation's hamburger)

## straitsx-frontend Integration Context

The production app (`straitsx-frontend`) currently uses:
- **Desktop:** Fixed 257px sidebar (`StraitsXNavigation`) always visible, wrapped in a `NavigationWrapper` div in `biz/Root.tsx`
- **Mobile:** Local `useState` in `StraitsXUserInfoBar` toggles a `MobileNavigation` portal overlay (256px panel + backdrop)
- **Layout:** Flexbox row — `NavigationWrapper` (sidebar) + `MainContainer` (top bar + routes + footer)
- **Routing:** `react-router-dom <Link>` (our `linkComponent` prop handles this)
- **No context/Redux for nav state** — purely local state

### Migration path in straitsx-frontend

```
// Before (Root.tsx)
Container (flexbox row)
├── NavigationWrapper (hidden mobile, 257px desktop)
│   └── StraitsXNavigation
└── MainContainer
    ├── StraitsXUserInfoBar (hamburger → local useState → MobileNavigation portal)
    └── <Routes />

// After (Root.tsx)
<SidebarProvider>
  Container (flexbox row)
  ├── Sidebar (auto-handles desktop/mobile via context)
  └── MainContainer
      ├── StraitsXUserInfoBar (hamburger → useSidebar().toggleSidebar())
      └── <Routes />
</SidebarProvider>
```

This eliminates: `MobileNavigation` component, `NavigationWrapper` hide/show logic, local `isMobileNavOpen` state in `StraitsXUserInfoBar`.

---

## Architecture

Follow the project's established context patterns (like `ToastContext` — context initialized as `null`, hook throws if used outside provider).

### New Files

| File | Purpose |
|------|---------|
| `src/components/Sidebar/SidebarContext.jsx` | `SidebarProvider` + `useSidebar()` hook |
| `src/hooks/useMediaQuery.js` | Reusable `useMediaQuery` hook (uses existing `MEDIA` constants from `src/constants/breakpoints.ts`) |

### Modified Files

| File | Changes |
|------|---------|
| `src/components/Sidebar/Sidebar.jsx` | Consume context for collapsed/open state, render offcanvas + backdrop in mobile mode, icon-only mode in desktop collapsed |
| `src/components/Sidebar/Sidebar.css` | Add collapsed width (64px), transitions, mobile overlay/backdrop styles, hide labels when collapsed |
| `src/components/Sidebar/index.tsx` | Re-export `SidebarProvider`, `useSidebar` |
| `src/components/Sidebar/Sidebar.stories.jsx` | Add stories for collapsed, mobile overlay states |

---

## Implementation Details

### 1. `useMediaQuery` hook (`src/hooks/useMediaQuery.js`)

```js
import { useState, useEffect } from "react";

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);
  return matches;
}
```

### 2. `SidebarContext.jsx`

```jsx
const SidebarContext = createContext(null);

export function SidebarProvider({ defaultOpen = true, children }) {
  const isMobile = useMediaQuery(MEDIA.MOBILE);
  const [open, setOpen] = useState(defaultOpen);

  const toggleSidebar = () => setOpen((o) => !o);

  // Auto-close on mobile, auto-open on desktop when crossing breakpoint
  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  return (
    <SidebarContext.Provider value={{ open, setOpen, toggleSidebar, isMobile }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used inside a <SidebarProvider>");
  return ctx;
}
```

**Context value:**
- `open` — `boolean` — sidebar is expanded (true) or collapsed/closed (false)
- `setOpen` — `(open: boolean) => void` — controlled setter
- `toggleSidebar` — `() => void` — convenience toggle
- `isMobile` — `boolean` — whether viewport is below tablet breakpoint

### 3. Sidebar component changes

The Sidebar will optionally consume context (so it can still be used standalone without a provider for backward compatibility):

```jsx
export function Sidebar({ ...props }) {
  // Try to read context; fallback to always-open if no provider
  const context = useContext(SidebarContext);
  const open = context?.open ?? true;
  const isMobile = context?.isMobile ?? false;

  // Desktop: render as collapsed (icon-only, 64px) or expanded (240px)
  // Mobile: render as offcanvas overlay when open, hidden when closed
}
```

**Desktop collapsed mode (icon-only):**
- Width shrinks from 240px → 64px
- Labels, tags, chevrons, company text, brand-sub, MAS text are hidden
- Icons remain visible and centered
- Sub-items hidden (parent group shows only icon)
- Tooltip on hover showing the label (optional, can add later)

**Mobile overlay mode:**
- Sidebar is `position: fixed`, full height, slides in from left
- Backdrop overlay behind it (semi-transparent)
- Clicking backdrop or selecting a nav item closes the sidebar
- Close transitions via `transform: translateX(-100%)`
- Matches existing straitsx-frontend behavior (MobileNavigation portal + backdrop)

### 4. CSS changes

```css
/* Collapsed state — desktop icon-only */
.sidebar.is-collapsed {
  width: 64px;
}
.sidebar.is-collapsed .nav-item__label,
.sidebar.is-collapsed .nav-item__tag,
.sidebar.is-collapsed .nav-item__chevron,
.sidebar.is-collapsed .sidebar__brand-sub,
.sidebar.is-collapsed .sidebar__company-text,
.sidebar.is-collapsed .sidebar__mas-text,
.sidebar.is-collapsed .sidebar__subnav {
  display: none;
}
.sidebar.is-collapsed .nav-item {
  justify-content: center;
}

/* Mobile overlay — replaces the separate MobileNavigation component in straitsx-frontend */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
}
.sidebar-overlay__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
}
.sidebar-overlay .sidebar {
  position: relative;
  z-index: 1;
  height: 100%;
  width: 240px;
}

/* Transitions */
.sidebar {
  transition: width var(--dur-2) var(--ease);
}
```

### 5. Integration with straitsx-frontend

**TopNavigation / StraitsXUserInfoBar** — the hamburger button currently manages local state. With the provider:

```jsx
// In StraitsXUserInfoBar (or any component inside the provider):
import { useSidebar } from "soldier-boy/Sidebar";

function HamburgerButton() {
  const { toggleSidebar } = useSidebar();
  return <IconButton icon="menu" onClick={toggleSidebar} label="Open menu" />;
}
```

**Root.tsx layout migration:**

```jsx
import { SidebarProvider } from "soldier-boy/Sidebar";

function Root() {
  return (
    <SidebarProvider>
      <div className="container">
        <Sidebar
          items={navItems}
          activeItemId={activeRoute}
          onSelect={navigate}
          linkComponent={Link} // react-router-dom Link
        />
        <main className="main-container">
          <StraitsXUserInfoBar /> {/* hamburger uses useSidebar() internally */}
          <Routes />
          <StraitsXFooter />
        </main>
      </div>
    </SidebarProvider>
  );
}
```

This replaces: `NavigationWrapper` (CSS hide/show), `MobileNavigation` (portal overlay), local `isMobileNavOpen` state.

### 6. SidebarTrigger convenience component

A small component that auto-wires to context — drop it anywhere inside the provider tree:

```jsx
export function SidebarTrigger({ className }) {
  const { toggleSidebar } = useSidebar();
  return (
    <button type="button" className={className} onClick={toggleSidebar} aria-label="Toggle navigation">
      <span className="material-symbols-rounded">menu</span>
    </button>
  );
}
```

---

## Backward Compatibility

- Sidebar without a `SidebarProvider` wrapper works exactly as before (always expanded, no collapse)
- All existing props remain unchanged
- No breaking changes to the public API
- straitsx-frontend can adopt incrementally: wrap with `SidebarProvider`, then remove `MobileNavigation` and local state

## Deliverables

1. `src/hooks/useMediaQuery.js`
2. `src/components/Sidebar/SidebarContext.jsx` (includes `SidebarProvider`, `useSidebar`, `SidebarTrigger`)
3. Updated `src/components/Sidebar/Sidebar.jsx`
4. Updated `src/components/Sidebar/Sidebar.css`
5. Updated `src/components/Sidebar/index.tsx`
6. Updated `src/components/Sidebar/Sidebar.stories.jsx` (collapsed + mobile overlay stories)
