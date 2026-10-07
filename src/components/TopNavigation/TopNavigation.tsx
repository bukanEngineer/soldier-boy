import React, { useContext } from "react";
import { Badge } from "../Badge/Badge";
import { IconButton } from "../IconButton/IconButton";
import { Menu } from "../Menu/Menu";
import { TopNavProfileMenu } from "../TopNavProfileMenu/TopNavProfileMenu";
import { SidebarContext } from "../Sidebar/SidebarContext";
import { cn } from "../../lib/cn";
import "./TopNavigation.css";

export type TopNavigationUser = {
  name?: string;
  initials?: string;
  avatar?: string;
  company?: string;
  role?: string;
};

export type TopNavigationProps = React.ComponentProps<"header"> & {
  account?: "personal" | "business" | "sandbox";
  user?: TopNavigationUser;
  notifications?: number;
  /** Hamburger click handler (falls back to SidebarContext.toggleSidebar) */
  onMenuClick?: () => void;
  onNotificationsClick?: () => void;
  /** Profile menu action handler; receives action id (e.g. "logout") */
  onMenuAction?: (actionId: string) => void;
};

export function TopNavigation({
  account = "personal",
  user = {},
  notifications = 0,
  onMenuClick,
  onNotificationsClick,
  onMenuAction,
  className,
  children,
  ...rest
}: TopNavigationProps) {
  const sidebarCtx = useContext(SidebarContext);
  const handleMenuClick = sidebarCtx ? sidebarCtx.toggleSidebar : onMenuClick;

  const isSandbox = account === "sandbox";
  const isBusiness = account === "business";

  const primaryLabel = isSandbox
    ? user.company || user.name || ""
    : user.name || "";

  const subLabel = isBusiness
    ? user.role || ""
    : isSandbox
      ? user.name || ""
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

  return (
    <header
      className={cn("topnav", sidebarCtx && "topnav--collapsible", className)}
      data-account={account}
      {...rest}
    >
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

        <Menu.Root>
          <Menu.Trigger
            className="topnav__profile"
            aria-label={primaryLabel ? `Account: ${primaryLabel}` : "Account"}
          >
            {avatar}
            {primaryLabel && (
              <span className="topnav__profile-text">
                <span className="topnav__profile-name">{primaryLabel}</span>
                {subLabel && <span className="topnav__profile-sub">{subLabel}</span>}
              </span>
            )}
            <span className="material-symbols-rounded topnav__chevron" aria-hidden="true">
              expand_more
            </span>
          </Menu.Trigger>
          <Menu.Popup align="end" className="topnav-menu">
            <TopNavProfileMenu account={account} onAction={onMenuAction} />
          </Menu.Popup>
        </Menu.Root>
      </div>
    </header>
  );
}
