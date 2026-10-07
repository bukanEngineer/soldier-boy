import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DropdownAsset } from "./DropdownAsset";

const meta: Meta<typeof DropdownAsset> = {
  title: "Patterns/Dropdown/Asset",
  component: DropdownAsset,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 260 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    value: { control: "text" },
    onValueChange: { action: "onValueChange" },
  },
  args: { value: "xsgd" },
};
export default meta;

type Story = StoryObj<typeof DropdownAsset>;

const mark = (label: string, bg: string) => (
  <span
    style={{
      width: 24,
      height: 24,
      borderRadius: 999,
      background: bg,
      color: "#fff",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      font: "var(--label-small)",
    }}
  >
    {label}
  </span>
);

const assets = [
  { value: "xsgd", name: "XSGD", logo: mark("S", "var(--brand-xsgd)") },
  { value: "xusd", name: "XUSD", logo: mark("U", "var(--brand-xusd)") },
  { value: "usdc", name: "USDC", logo: mark("C", "var(--status-information)") },
  { value: "usdt", name: "USDT", logo: mark("T", "var(--status-positive)") },
];

export const Default: Story = { args: { options: assets, value: "xsgd" } };

export const WithBalances: Story = {
  args: {
    value: "xsgd",
    options: assets.map((a, i) => ({
      ...a,
      balance: ["1,250.00", "980.50", "12,300.00", "0.00"][i],
    })),
  },
};

export const WithSecondary: Story = {
  args: {
    value: "usdc",
    options: [
      {
        value: "xsgd",
        name: "XSGD",
        secondary: "StraitsX Singapore Dollar",
        logo: mark("S", "var(--brand-xsgd)"),
      },
      {
        value: "usdc",
        name: "USDC",
        secondary: "USD Coin",
        logo: mark("C", "var(--status-information)"),
      },
    ],
  },
};

export const InitialsFallback: Story = {
  args: { value: "xsgd", options: assets.map(({ logo: _logo, ...a }) => a) },
};
