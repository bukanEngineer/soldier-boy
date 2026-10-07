import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DropdownBlockchain } from "./DropdownBlockchain";
import { AssetMark } from "../AssetMark/AssetMark";

const meta: Meta<typeof DropdownBlockchain> = {
  title: "Patterns/Dropdown/Blockchain",
  component: DropdownBlockchain,
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
  args: { value: "ethereum" },
};
export default meta;

type Story = StoryObj<typeof DropdownBlockchain>;

const chains = [
  { value: "ethereum", name: "Ethereum", logo: <AssetMark asset="ETH" size={24} /> },
  { value: "polygon", name: "Polygon", logo: <AssetMark asset="POLYGON" size={24} /> },
  { value: "solana", name: "Solana", logo: <AssetMark asset="SOLANA" size={24} /> },
  { value: "avalanche", name: "Avalanche", logo: <AssetMark asset="AVAX" size={24} /> },
];

export const Default: Story = { args: { options: chains, value: "ethereum" } };

export const WithAddresses: Story = {
  args: {
    value: "ethereum",
    options: chains.map((c, i) => ({
      ...c,
      address: ["0x12ab…34cd", "0x98fe…76ba", "7Hn3…k9Qz", "0x55aa…11ff"][i],
    })),
  },
};

export const WithStatus: Story = {
  args: {
    value: "ethereum",
    options: [
      {
        value: "ethereum",
        name: "Ethereum",
        address: "0x12ab…34cd",
        logo: <AssetMark asset="ETH" size={24} />,
        tag: { label: "Connected", variant: "positive" },
      },
      {
        value: "solana",
        name: "Solana",
        logo: <AssetMark asset="SOLANA" size={24} />,
        tag: { label: "New", variant: "information" },
      },
      { value: "metamask", name: "MetaMask", address: "0x12ab…34cd", logo: <AssetMark asset="METAMASK" size={24} /> },
      { value: "walletconnect", name: "WalletConnect", logo: <AssetMark asset="WALLETCONNECT" size={24} /> },
    ],
  },
};

export const InitialsFallback: Story = {
  args: { value: "ethereum", options: chains.map(({ logo: _logo, ...c }) => c) },
};
