import React, { useState, useEffect } from "react";
import { Sidebar, DEFAULT_NAV_ITEMS } from "./Sidebar";
import { SidebarProvider } from "./SidebarContext";
import { TopNavigation } from "../TopNavigation/TopNavigation";

export default {
  title: "P1 Components/Sidebar",
  component: Sidebar,
  parameters: { layout: "fullscreen" },
  args: {
    account: "personal",
    loading: false,
    loadingCount: 8,
    showCompany: false,
    companyDropdown: true,
  },
  argTypes: {
    account: {
      control: "select",
      options: ["personal", "business", "sandbox"],
    },
    loading: { control: "boolean" },
    loadingCount: {
      control: { type: "number", min: 1, max: 20, step: 1 },
      if: { arg: "loading" },
    },
    activeItemId: { control: "text" },
    showCompany: {
      control: "boolean",
      table: { category: "Story controls" },
    },
    companyDropdown: {
      control: "boolean",
      if: { arg: "showCompany", truthy: true },
      table: { category: "Story controls" },
    },
    items: { control: false, table: { category: "Data" } },
    company: { control: false, table: { category: "Data" } },
    companies: { control: false, table: { category: "Data" } },
    companyActions: { control: false, table: { category: "Data" } },
    onCompanyClick: { control: false, table: { category: "Events" } },
    onSwitchCompany: { control: false, table: { category: "Events" } },
    onCompanyAction: { control: false, table: { category: "Events" } },
    onSelect: { control: false, table: { category: "Events" } },
  },
};

function Frame({ children }) {
  return (
    <>
      <style>{`
        .sidebar-desktop-frame {
          display: grid;
          grid-template-columns: 240px 1fr;
          height: 720px;
          background: var(--background);
        }
        .sidebar-desktop-frame .sidebar {
          display: flex !important;
        }
        .sidebar-desktop-frame__main {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .sidebar-desktop-frame .topnav__hamburger {
          display: none !important;
        }
        .sidebar-desktop-frame .topnav__profile-text,
        .sidebar-desktop-frame .topnav__chevron {
          display: flex !important;
        }
        .sidebar-desktop-frame .topnav {
          height: 64px !important;
          padding: 0 var(--space-6) !important;
          gap: var(--space-4) !important;
          background: transparent !important;
          border-bottom-color: transparent !important;
        }
      `}</style>
      <div className="sidebar-desktop-frame">
        {children}
      </div>
    </>
  );
}

function MainContent({ children, account = "personal", user }) {
  return (
    <div className="sidebar-desktop-frame__main">
      <TopNavigation
        account={account}
        user={user || { name: "John Doe", initials: "JD" }}
        notifications={3}
      />
      <div style={{ flex: 1, padding: 32, color: "var(--text-secondary)" }}>
        {children}
      </div>
    </div>
  );
}

const COMPANIES = [
  { id: "abc", name: "ABC Pte. Ltd", type: "Business Account", selected: true },
  { id: "xyz", name: "XYZ Pte. Ltd", type: "Business Account" },
];

const NAV_ITEMS = DEFAULT_NAV_ITEMS.map((item) => ({
  ...item,
  href: `#${item.id}`,
  subItems: item.subItems?.map((sub) => ({ ...sub, href: `#${sub.id}` })),
}));

export const Personal = {
  args: {
    account: "personal",
    activeItemId: "home",
  },
  render: (args) => {
    const { showCompany, companyDropdown, ...sidebarArgs } = args;
    const [activeItemId, setActiveItemId] = useState(args.activeItemId);
    useEffect(() => setActiveItemId(args.activeItemId), [args.activeItemId]);
    return (
      <Frame>
        <Sidebar
          {...sidebarArgs}
          company={showCompany ? { name: "ABC Pte. Ltd", type: "Company" } : undefined}
          companies={showCompany && companyDropdown ? COMPANIES : undefined}
          items={NAV_ITEMS}
          activeItemId={activeItemId}
          onSelect={setActiveItemId}
        />
        <MainContent account={args.account}>Personal account</MainContent>
      </Frame>
    );
  },
};

export const BusinessWithCompanyDropdown = {
  args: {
    account: "business",
    showCompany: true,
    companyDropdown: true,
    activeItemId: "mint-buy",
  },
  render: (args) => {
    const { showCompany, companyDropdown, ...sidebarArgs } = args;
    const [activeItemId, setActiveItemId] = useState(args.activeItemId);
    useEffect(() => setActiveItemId(args.activeItemId), [args.activeItemId]);
    return (
      <Frame>
        <Sidebar
          {...sidebarArgs}
          company={showCompany ? { name: "ABC Pte. Ltd", type: "Company" } : undefined}
          companies={showCompany && companyDropdown ? COMPANIES : undefined}
          onSwitchCompany={companyDropdown ? (id) => console.log("switch", id) : undefined}
          onCompanyAction={companyDropdown ? (id) => console.log("action", id) : undefined}
          items={NAV_ITEMS}
          activeItemId={activeItemId}
          onSelect={setActiveItemId}
        />
        <MainContent account={args.account} user={{ name: "John Doe", company: "ABC Pte. Ltd.", initials: "JD" }}>
          Business — click the company profile to open the dropdown.
        </MainContent>
      </Frame>
    );
  },
};

export const Loading = {
  render: () => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      const timer = setTimeout(() => setLoading(false), 1500);
      return () => clearTimeout(timer);
    }, []);
    return (
      <Frame>
        <Sidebar account="personal" loading={loading} />
        <MainContent>
          {loading ? "Nav items loading…" : "Nav items loaded"}
        </MainContent>
      </Frame>
    );
  },
};

export const Sandbox = {
  render: () => (
    <Frame>
      <Sidebar account="sandbox" company={{ name: "ABC Pte. Ltd", type: "Company" }} onCompanyClick={() => {}} items={NAV_ITEMS} activeItemId="home" />
      <MainContent account="sandbox" user={{ name: "John Doe", company: "ABC Pte. Ltd.", initials: "JD" }}>
        Sandbox environment
      </MainContent>
    </Frame>
  ),
};

// ─── Scroll Behavior ─────────────────────────────────────────────────────────

const MANY_NAV_ITEMS = [
  { id: "home", icon: "home", label: "Home", href: "#home" },
  { id: "dashboard", icon: "dashboard", label: "Dashboard", href: "#dashboard" },
  {
    id: "mint", icon: "account_balance_wallet", label: "Mint", tag: "New",
    subItems: [
      { id: "mint-buy", label: "Buy", href: "#mint-buy" },
      { id: "mint-sell", label: "Sell", href: "#mint-sell" },
      { id: "mint-swap", label: "Swap", href: "#mint-swap" },
      { id: "mint-convert", label: "Convert", href: "#mint-convert" },
    ],
  },
  { id: "history", icon: "receipt_long", label: "Transaction History", href: "#history" },
  { id: "statement", icon: "description", label: "Account Statement", href: "#statement" },
  { id: "payments", icon: "payments", label: "Payments", href: "#payments" },
  { id: "cards", icon: "credit_card", label: "Cards", href: "#cards" },
  {
    id: "transfers", icon: "swap_horiz", label: "Transfers",
    subItems: [
      { id: "transfers-local", label: "Local Transfer", href: "#transfers-local" },
      { id: "transfers-intl", label: "International", href: "#transfers-intl" },
      { id: "transfers-scheduled", label: "Scheduled", href: "#transfers-scheduled" },
    ],
  },
  { id: "beneficiaries", icon: "group", label: "Beneficiaries", href: "#beneficiaries" },
  { id: "devtools", icon: "developer_mode", label: "Developer Tools", href: "#devtools" },
  { id: "webhooks", icon: "webhook", label: "Webhooks", href: "#webhooks" },
  { id: "api-keys", icon: "key", label: "API Keys", href: "#api-keys" },
  { id: "team", icon: "badge", label: "Team", href: "#team" },
  { id: "audit-log", icon: "history", label: "Audit Log", href: "#audit-log" },
  { id: "settings", icon: "tune", label: "Settings", href: "#settings" },
  { id: "support", icon: "support_agent", label: "Support", href: "#support" },
];

export const ScrollBehavior = {
  args: {
    account: "business",
    activeItemId: "mint-buy",
  },
  render: (args) => {
    const { showCompany, companyDropdown, ...sidebarArgs } = args;
    const [activeItemId, setActiveItemId] = useState(args.activeItemId);
    useEffect(() => setActiveItemId(args.activeItemId), [args.activeItemId]);
    return (
      <Frame>
        <Sidebar
          {...sidebarArgs}
          company={{ name: "ABC Pte. Ltd", type: "Business Account" }}
          items={MANY_NAV_ITEMS}
          activeItemId={activeItemId}
          onSelect={setActiveItemId}
        />
        <MainContent account={args.account} user={{ name: "John Doe", company: "ABC Pte. Ltd.", initials: "JD" }}>
          <div style={{ maxWidth: 480 }}>
            <h3 style={{ margin: "0 0 12px", color: "var(--text-primary)" }}>Sidebar Scroll Behavior</h3>
            <ul style={{ lineHeight: 1.8, paddingLeft: 20 }}>
              <li>The entire sidebar content scrolls when items overflow</li>
              <li>The MAS badge scrolls naturally with the nav items</li>
              <li>Expand &ldquo;Mint&rdquo; or &ldquo;Transfers&rdquo; groups to add more items and trigger scroll</li>
              <li>Scroll is locked when the company dropdown is open</li>
            </ul>
          </div>
        </MainContent>
      </Frame>
    );
  },
};

// ─── Mobile ───────────────────────────────────────────────────────────────────

export const Mobile = {
  parameters: {
    viewport: { defaultViewport: "mobile" },
    layout: "fullscreen",
  },
  render: () => {
    const [activeItemId, setActiveItemId] = useState("home");
    return (
      <SidebarProvider>
        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
          <TopNavigation
            account="personal"
            user={{ name: "John Doe", initials: "JD" }}
            notifications={3}
          />
          <div style={{ flex: 1, position: "relative" }}>
            <Sidebar
              account="personal"
              items={NAV_ITEMS}
              activeItemId={activeItemId}
              onSelect={setActiveItemId}
            />
          </div>
        </div>
      </SidebarProvider>
    );
  },
};
