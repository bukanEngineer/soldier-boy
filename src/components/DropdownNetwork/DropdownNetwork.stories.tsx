import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DropdownNetwork } from "./DropdownNetwork";

const meta: Meta<typeof DropdownNetwork> = {
  title: "Patterns/Dropdown/Network",
  component: DropdownNetwork,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 328 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    value: { control: "text" },
    onValueChange: { action: "onValueChange" },
  },
  args: { value: "eth" },
};
export default meta;

type Story = StoryObj<typeof DropdownNetwork>;

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

const networks = [
  { value: "eth", name: "Ethereum", logo: mark("E", "var(--status-information)") },
  { value: "polygon", name: "Polygon", logo: mark("P", "#8247e5") },
  { value: "arbitrum", name: "Arbitrum", logo: mark("A", "#2d374b") },
  { value: "bsc", name: "BNB Smart Chain", logo: mark("B", "var(--status-warning-strong)") },
];

export const Default: Story = { args: { options: networks, value: "eth" } };

export const WithNewTag: Story = {
  args: {
    value: "eth",
    options: [
      ...networks,
      {
        value: "solana",
        name: "Solana",
        logo: mark("S", "var(--text-primary)"),
        tag: { label: "New", variant: "positive" },
      },
    ],
  },
};

export const WithSecondary: Story = {
  args: {
    value: "eth",
    options: [
      {
        value: "eth",
        name: "Ethereum",
        secondary: "Last Used",
        logo: mark("E", "var(--status-information)"),
      },
      { value: "polygon", name: "Polygon", logo: mark("P", "#8247e5") },
    ],
  },
};

export const InitialsFallback: Story = {
  args: { value: "eth", options: networks.map(({ logo: _logo, ...n }) => n) },
};
