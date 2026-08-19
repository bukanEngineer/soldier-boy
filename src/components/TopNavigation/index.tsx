import React from "react";

export { TopNavigation } from "./TopNavigation";

export interface TopNavigationUser {
  /** Display name */
  name?: string;
  /** Pre-computed initials (falls back to derived from name) */
  initials?: string;
  /** Avatar image URL */
  avatar?: string;
  /** Company name (shown as primary label in sandbox mode) */
  company?: string;
  /** Role label (shown as sub-label in business mode, e.g. "Admin") */
  role?: string;
}

export interface TopNavigationProps {
  /** Account type — controls label layout and theming */
  account?: "personal" | "business" | "sandbox";
  /** User information for avatar and labels */
  user?: TopNavigationUser;
  /** Notification count; badge shown when > 0 */
  notifications?: number;
  /** Hamburger click handler (falls back to SidebarContext.toggleSidebar) */
  onMenuClick?: () => void;
  /** Notifications bell click handler */
  onNotificationsClick?: () => void;
  /** Profile menu action handler; receives action id (e.g. "logout") */
  onMenuAction?: (actionId: string) => void;
  /** Additional class name(s) on the root header element */
  className?: string;
  /** Slot rendered before the notifications bell (custom actions) */
  children?: React.ReactNode;
}
