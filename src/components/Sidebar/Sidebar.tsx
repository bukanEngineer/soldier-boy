import React, { useContext, useState } from "react";
import { createPortal } from "react-dom";
import { Collapsible } from "@base-ui/react/collapsible";
import { Logo } from "../Logo/Logo";
import { Menu } from "../Menu/Menu";
import { CompanyProfileMenu } from "../CompanyProfileMenu/CompanyProfileMenu";
import type { CompanyProfileAction, CompanyProfileCompany } from "../CompanyProfileMenu/CompanyProfileMenu";
import { SidebarContext } from "./SidebarContext";
import { cn } from "../../lib/cn";
import "./Sidebar.css";

export type SidebarSubItem = {
  id: string;
  label: string;
  href?: string;
  as?: React.ElementType;
  linkProps?: Record<string, unknown>;
};

export type SidebarNavItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  tag?: React.ReactNode;
  subItems?: SidebarSubItem[];
  autoSelectFirstSubItem?: boolean;
  href?: string;
  as?: React.ElementType;
  linkProps?: Record<string, unknown>;
};

export type SidebarCompany = {
  name: string;
  type: string;
};

export type SidebarAccount = "personal" | "business" | "sandbox";

export const DEFAULT_NAV_ITEMS: SidebarNavItem[] = [
  { id: "home", icon: "home", label: "Home" },
  {
    id: "mint",
    icon: "account_balance_wallet",
    label: "Mint",
    tag: "New",
    subItems: [
      { id: "mint-buy", label: "Buy" },
      { id: "mint-sell", label: "Sell" },
    ],
  },
  { id: "history", icon: "receipt_long", label: "Transaction History" },
  { id: "statement", icon: "description", label: "Account Statement" },
  { id: "devtools", icon: "developer_mode", label: "Developer Tools" },
  { id: "team", icon: "badge", label: "Team" },
  { id: "settings", icon: "tune", label: "Settings" },
  { id: "support", icon: "support_agent", label: "Support" },
];

const ACCOUNT_LABEL: Record<SidebarAccount, string> = {
  personal: "Personal Account",
  business: "Business Account",
  sandbox: "Sandbox",
};

function renderIcon(icon?: React.ReactNode) {
  if (icon == null) return null;
  if (typeof icon === "string") {
    return (
      <span className="material-symbols-rounded" aria-hidden="true">
        {icon}
      </span>
    );
  }
  return (
    <span className="nav-item__icon" aria-hidden="true">
      {icon}
    </span>
  );
}

export type SidebarProps = {
  account?: SidebarAccount;
  company?: SidebarCompany;
  onCompanyClick?: () => void;
  companies?: CompanyProfileCompany[];
  companyActions?: CompanyProfileAction[];
  onSwitchCompany?: (id: string) => void;
  onCompanyAction?: (id: string) => void;
  items?: SidebarNavItem[];
  activeItemId?: string;
  onSelect?: (id: string) => void;
  loading?: boolean;
  loadingCount?: number;
  linkComponent?: React.ElementType;
  className?: string;
};

export function Sidebar({
  account = "personal",
  company,
  onCompanyClick,
  companies,
  companyActions,
  onSwitchCompany,
  onCompanyAction,
  items = DEFAULT_NAV_ITEMS,
  activeItemId,
  onSelect,
  loading = false,
  loadingCount = 8,
  linkComponent,
  className,
}: SidebarProps) {
  const context = useContext(SidebarContext);
  const open = context?.open ?? true;
  const isMobile = context?.isMobile ?? false;

  const isSandbox = account === "sandbox";
  const hasMenu = !!(companies || companyActions);

  const activeGroupId = items.find(
    (item) =>
      item.subItems &&
      (item.id === activeItemId || item.subItems.some((sub) => sub.id === activeItemId)),
  )?.id;

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const handleSelect = (id: string) => {
    onSelect?.(id);
    if (isMobile && context) context.setOpen(false);
  };

  if (!open && !isMobile) return null;

  const sidebarContent = (
    <aside
      className={cn("sidebar", className)}
      data-account={isSandbox ? "sandbox" : account}
    >
      <div className="sidebar__scroll">
        <div className="sidebar__top">
          <div className="sidebar__brand">
            <Logo size={172} tone={isSandbox ? "white" : "default"} />
            <div className="sidebar__brand-sub">
              {ACCOUNT_LABEL[account] || ACCOUNT_LABEL.personal}
            </div>
          </div>

          {company && (
            <div className="sidebar__company-wrap">
              {hasMenu ? (
                <Menu.Root>
                  <Menu.Trigger className="sidebar__company">
                    <span className="sidebar__company-text">
                      <span className="sidebar__company-name">{company.name}</span>
                      <span className="sidebar__company-type">{company.type}</span>
                    </span>
                    <span
                      className="material-symbols-rounded sidebar__company-chevron"
                      aria-hidden="true"
                    >
                      expand_more
                    </span>
                  </Menu.Trigger>
                  <Menu.Popup side="right" align="start" sideOffset={8} className="company-menu">
                    <CompanyProfileMenu
                      switchCompany={!!companies}
                      companies={companies || []}
                      actions={companyActions}
                      onSwitch={(id) => onSwitchCompany?.(id)}
                      onAction={(id) => onCompanyAction?.(id)}
                    />
                  </Menu.Popup>
                </Menu.Root>
              ) : (
                <button
                  type="button"
                  className="sidebar__company"
                  onClick={onCompanyClick}
                >
                  <span className="sidebar__company-text">
                    <span className="sidebar__company-name">{company.name}</span>
                    <span className="sidebar__company-type">{company.type}</span>
                  </span>
                  {onCompanyClick && (
                    <span
                      className="material-symbols-rounded sidebar__company-chevron"
                      aria-hidden="true"
                    >
                      expand_more
                    </span>
                  )}
                </button>
              )}
            </div>
          )}

          <nav className="sidebar__nav" aria-label="Main" aria-busy={loading || undefined}>
            {loading
              ? Array.from({ length: loadingCount }, (_, i) => (
                  <div
                    key={i}
                    className="nav-item-skeleton"
                    style={
                      {
                        "--skeleton-width": `${55 + ((i * 17) % 35)}%`,
                      } as React.CSSProperties
                    }
                    aria-hidden="true"
                  >
                    <span className="nav-item-skeleton__icon" />
                    <span className="nav-item-skeleton__label" />
                  </div>
                ))
              : items.map((item) => {
                  const hasSub = !!(item.subItems && item.subItems.length > 0);
                  const isOpen = expanded[item.id] ?? item.id === activeGroupId;
                  const isActive = activeItemId === item.id;

                  if (hasSub) {
                    return (
                      <Collapsible.Root
                        key={item.id}
                        className="sidebar__group"
                        open={isOpen}
                        onOpenChange={(next) => {
                          setExpanded((current) => ({ ...current, [item.id]: next }));
                          if (next && item.autoSelectFirstSubItem && item.subItems?.[0]) {
                            onSelect?.(item.subItems[0].id);
                          }
                        }}
                      >
                        <Collapsible.Trigger className="nav-item">
                          {renderIcon(item.icon)}
                          <span className="nav-item__label">{item.label}</span>
                          {item.tag != null && (
                            <span className="nav-item__tag">{item.tag}</span>
                          )}
                          <span
                            className="material-symbols-rounded nav-item__chevron"
                            aria-hidden="true"
                          >
                            keyboard_arrow_down
                          </span>
                        </Collapsible.Trigger>
                        <Collapsible.Panel className="sidebar__subnav">
                          {item.subItems!.map((sub) => {
                            const subActive = activeItemId === sub.id;
                            const SubItem = sub.href
                              ? sub.as || linkComponent || "a"
                              : sub.as || "button";
                            const subIsButton = SubItem === "button";
                            return (
                              <SubItem
                                key={sub.id}
                                className="subitem"
                                data-active={subActive || undefined}
                                onClick={() => handleSelect(sub.id)}
                                {...(subIsButton ? { type: "button" } : {})}
                                {...(subActive ? { "aria-current": "page" } : {})}
                                {...(sub.href ? { href: sub.href } : {})}
                                {...sub.linkProps}
                              >
                                {sub.label}
                              </SubItem>
                            );
                          })}
                        </Collapsible.Panel>
                      </Collapsible.Root>
                    );
                  }

                  const Item = item.href
                    ? item.as || linkComponent || "a"
                    : item.as || "button";
                  const isButton = Item === "button";

                  return (
                    <div key={item.id} className="sidebar__group">
                      <Item
                        className="nav-item"
                        data-active={isActive || undefined}
                        onClick={() => handleSelect(item.id)}
                        {...(isButton ? { type: "button" } : {})}
                        {...(isActive ? { "aria-current": "page" } : {})}
                        {...(item.href ? { href: item.href } : {})}
                        {...item.linkProps}
                      >
                        {renderIcon(item.icon)}
                        <span className="nav-item__label">{item.label}</span>
                        {item.tag != null && (
                          <span className="nav-item__tag">{item.tag}</span>
                        )}
                      </Item>
                    </div>
                  );
                })}
          </nav>
        </div>

        <div className="sidebar__mas">
          <span className="material-symbols-rounded" aria-hidden="true">
            verified_user
          </span>
          <span className="sidebar__mas-text">
            Licensed &amp; Regulated by Monetary Authority of Singapore
          </span>
        </div>
      </div>
    </aside>
  );

  if (isMobile) {
    if (!open) return null;
    return createPortal(
      <div className="sidebar-overlay">
        <button
          type="button"
          className="sidebar-overlay__backdrop"
          aria-label="Close navigation"
          onClick={() => context?.setOpen(false)}
        />
        {sidebarContent}
      </div>,
      document.body,
    );
  }

  return sidebarContent;
}
