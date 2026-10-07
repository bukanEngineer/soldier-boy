import React from "react";
import { Menu } from "../Menu/Menu";
import "./TopNavProfileMenu.css";

export type TopNavAccount = "personal" | "business" | "sandbox";

export type TopNavProfileMenuProps = {
  account?: TopNavAccount;
  onAction?: (actionId: string) => void;
};

/**
 * Profile menu items for the top navigation. Must be rendered inside `Menu.Popup`.
 *
 *   <Menu.Root>
 *     <Menu.Trigger>…</Menu.Trigger>
 *     <Menu.Popup className="topnav-menu">
 *       <TopNavProfileMenu account="personal" onAction={…} />
 *     </Menu.Popup>
 *   </Menu.Root>
 */
export function TopNavProfileMenu({
  account = "personal",
  onAction,
}: TopNavProfileMenuProps) {
  return (
    <>
      <Menu.Item icon="settings" onClick={() => onAction?.("my-account")}>
        My Account
      </Menu.Item>
      {account === "personal" && (
        <Menu.Item icon="toggle_on" onClick={() => onAction?.("switch-to-sandbox")}>
          Switch to Sandbox
        </Menu.Item>
      )}
      <Menu.Separator />
      <Menu.Item icon="logout" variant="critical" onClick={() => onAction?.("logout")}>
        Log Out
      </Menu.Item>
    </>
  );
}
