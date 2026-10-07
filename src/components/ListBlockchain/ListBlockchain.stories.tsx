import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ListBlockchain } from "./ListBlockchain";

const ChainIcon = ({
  label = "Ξ",
  bg = "var(--brand-stable-deep-ivy)",
}: {
  label?: string;
  bg?: string;
}) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100%",
      background: bg,
      color: "var(--text-inverse)",
      fontSize: 12,
      fontWeight: 700,
    }}
  >
    {label}
  </span>
);

const ADDRESS = "0x934ddab12av012345c1ertf897fec124f2gyb1";

const meta: Meta<typeof ListBlockchain> = {
  title: "Patterns/List/Blockchain",
  component: ListBlockchain,
  parameters: { layout: "padded" },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["verifiedPrivateWallet", "verifiedCustodial", "pending", "verify"],
    },
  },
  args: {
    name: "Metamask",
    address: ADDRESS,
    icon: <ChainIcon label="M" bg="var(--status-warning-strong)" />,
    variant: "verifiedPrivateWallet",
    meta: "Last Used",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400, border: "1px solid var(--border)", borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ListBlockchain>;

export const VerifiedPrivateWallet: Story = {};
export const VerifiedCustodial: Story = {
  args: { variant: "verifiedCustodial", name: "Wallet 3", meta: undefined, icon: <ChainIcon /> },
};
export const Pending: Story = {
  args: { variant: "pending", name: "Wallet 2", meta: undefined, icon: <ChainIcon /> },
};
export const Verify: Story = {
  args: { variant: "verify", name: "Wallet 3", meta: undefined, icon: <ChainIcon /> },
};

export const List: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid var(--border)",
        borderRadius: 8,
      }}
    >
      <ListBlockchain
        variant="verifiedPrivateWallet"
        name="Metamask"
        address={ADDRESS}
        meta="Last Used"
        icon={<ChainIcon label="M" bg="var(--status-warning-strong)" />}
      />
      <ListBlockchain variant="verifiedCustodial" name="Wallet 3" address={ADDRESS} icon={<ChainIcon />} />
      <ListBlockchain variant="pending" name="Wallet 2" address={ADDRESS} icon={<ChainIcon />} />
      <ListBlockchain variant="verify" name="Wallet 3" address={ADDRESS} icon={<ChainIcon />} />
    </div>
  ),
};
