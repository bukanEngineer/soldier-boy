import React from "react";
import { Icon } from "./Icon";
import { ICON_COMPONENTS } from "./icons/registry";

export default {
  title: "Atoms/Icon",
  component: Icon,
  parameters: { layout: "padded" },
  argTypes: {
    name: { control: "text" },
    size: { control: { type: "range", min: 12, max: 96, step: 2 } },
    color: { control: "color" },
  },
  args: { name: "home", size: 24 },
};

export const Default = {};
export const BrandColor = { args: { name: "check_circle", color: "var(--primary)", size: 32 } };

const COMMON = [
  "home", "account_circle", "notifications", "settings", "support_agent",
  "credit_card", "swap_horiz", "savings", "receipt_long", "description",
  "developer_mode", "badge", "group", "help", "flag",
  "search", "close", "check", "expand_more", "arrow_forward",
  "content_copy", "download", "share", "delete", "edit",
  "visibility", "visibility_off", "info", "warning", "error",
  "cloud_upload", "qr_code", "lock", "lock_open", "tune",
];

export const Showcase = {
  args: {},
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16 }}>
      {COMMON.map((name) => (
        <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: 12, border: "1px solid var(--border)", borderRadius: 8 }}>
          <Icon name={name} size={28} />
          <code style={{ font: "var(--body-small)", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{name}</code>
        </div>
      ))}
    </div>
  ),
};

export const AllIcons = {
  parameters: { docs: { description: { story: "Every icon in the vendored set. Add a name by using it in code or listing it in `scripts/icon-extras.json`, then run `npm run vendor:icons`." } } },
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
      {Object.keys(ICON_COMPONENTS).map((name) => (
        <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: 12, border: "1px solid var(--border)", borderRadius: 8 }}>
          <Icon name={name as keyof typeof ICON_COMPONENTS} size={28} />
          <code style={{ font: "var(--body-small)", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>{name}</code>
        </div>
      ))}
    </div>
  ),
};
