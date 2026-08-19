import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Badge } from "../Badge/Badge";
import { IconButton } from "../IconButton/IconButton";
import { TopNavProfileMenu } from "../TopNavProfileMenu/TopNavProfileMenu";
import { SidebarContext } from "../Sidebar/SidebarContext";
import "./TopNavigation.css";

export function TopNavigation({
  account = "personal",
  user = {},
  notifications = 0,
  onMenuClick,
  onNotificationsClick,
  onMenuAction,
  className = "",
  children,
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  // Auto-wire to SidebarContext when available (Option A).
  // Falls back to onMenuClick prop if no provider is present.
  const sidebarCtx = useContext(SidebarContext);
  const handleMenuClick = sidebarCtx ? sidebarCtx.toggleSidebar : onMenuClick;

  // Focus management: move focus into the menu on open, restore on close.
  const prevOpenRef = useRef(false);
  useEffect(() => {
    if (profileOpen && !prevOpenRef.current) {
      // Menu just opened — focus first menu item
      requestAnimationFrame(() => {
        const firstItem = menuRef.current?.querySelector('[role="menuitem"]');
        firstItem?.focus();
      });
    } else if (!profileOpen && prevOpenRef.current) {
      // Menu just closed — return focus to the trigger
      triggerRef.current?.focus();
    }
    prevOpenRef.current = profileOpen;
  }, [profileOpen]);

  // Arrow-key navigation within the profile menu
  const handleMenuKeyDown = useCallback((e) => {
    const items = menuRef.current?.querySelectorAll('[role="menuitem"]');
    if (!items?.length) return;
    const currentIdx = Array.from(items).indexOf(document.activeElement);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = (currentIdx + 1) % items.length;
      items[next]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (currentIdx - 1 + items.length) % items.length;
      items[prev]?.focus();
    }
  }, []);

  useEffect(() => {
    if (!profileOpen) return undefined;
    const onClickAway = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setProfileOpen(false); };
    document.addEventListener("mousedown", onClickAway);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickAway);
      document.removeEventListener("keydown", onKey);
    };
  }, [profileOpen]);

  const isSandbox = account === "sandbox";
  const isBusiness = account === "business";

  // Primary line: Personal & Business → user name; Sandbox → company name
  // (fall back to name). Business intentionally leads with the person, not the
  // company.
  const primaryLabel = isSandbox
    ? (user.company || user.name || "")
    : (user.name || "");

  // Sub line: Business → role (sourced from an API, e.g. "Admin",
  // "Operations", "Developer"); Sandbox → user name; Personal → none.
  const subLabel = isBusiness
    ? (user.role || "")
    : isSandbox
      ? (user.name || "")
      : "";
  const initials =
    user.initials ||
    (user.name || "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase();

  const avatar = (
    <span className="topnav__avatar" aria-hidden="true">
      {user.avatar ? (
        <img className="topnav__avatar-img" src={user.avatar} alt="" />
      ) : initials ? (
        <span className="topnav__initials">{initials}</span>
      ) : (
        <span className="material-symbols-rounded">person</span>
      )}
    </span>
  );

  const cls = ["topnav", sidebarCtx ? "topnav--collapsible" : "", className].filter(Boolean).join(" ");

  return (
    <header className={cls} data-account={account}>
      <IconButton
        icon="menu"
        variant="tertiary"
        label="Open menu"
        onClick={handleMenuClick}
        className="topnav__hamburger"
      />

      <div className="topnav__right">
        {children}

        <Badge.Wrap
          badge={
            notifications > 0 ? (
              <Badge tone="critical" size="sm">
                {notifications}
              </Badge>
            ) : null
          }
        >
          <IconButton
            icon="notifications"
            variant="secondary"
            size="sm"
            label="Notifications"
            onClick={onNotificationsClick}
          />
        </Badge.Wrap>

        <div className="topnav__profile-wrap" ref={profileRef}>
          <button
            ref={triggerRef}
            type="button"
            className="topnav__profile"
            onClick={() => setProfileOpen((o) => !o)}
            aria-label={primaryLabel ? `Account: ${primaryLabel}` : "Account"}
            aria-haspopup="menu"
            aria-expanded={profileOpen}
          >
            {avatar}
            {primaryLabel && (
              <span className="topnav__profile-text">
                <span className="topnav__profile-name">{primaryLabel}</span>
                {subLabel && (
                  <span className="topnav__profile-sub">{subLabel}</span>
                )}
              </span>
            )}
            <span
              className="material-symbols-rounded topnav__chevron"
              aria-hidden="true"
            >
              expand_more
            </span>
          </button>
          {profileOpen && (
            <div
              className="topnav__profile-menu"
              ref={menuRef}
              onKeyDown={handleMenuKeyDown}
            >
              <TopNavProfileMenu
                account={account}
                onAction={(id) => {
                  setProfileOpen(false);
                  onMenuAction && onMenuAction(id);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
