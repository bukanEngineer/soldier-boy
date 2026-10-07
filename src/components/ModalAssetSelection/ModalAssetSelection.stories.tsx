import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ModalAssetSelection, type AssetOption } from "./ModalAssetSelection";
import { Button } from "../Button";
import { PartnerLogo } from "../PartnerLogo/PartnerLogo";

const meta: Meta<typeof ModalAssetSelection> = {
  title: "Patterns/Modal/Asset Selection",
  component: ModalAssetSelection,
  parameters: { layout: "centered" },
  argTypes: {
    title: { control: "text" },
    description: { control: "text" },
    label: { control: "text" },
    onSelect: { action: "onSelect" },
  },
};
export default meta;

type Story = StoryObj<typeof ModalAssetSelection>;

const stablecoins: AssetOption[] = [
  { id: "xsgd", symbol: "XSGD", subtitle: "1:1 to SGD", mark: <PartnerLogo name="xsgd" size={32} /> },
  { id: "xusd", symbol: "XUSD", subtitle: "1:1 to USD", mark: <PartnerLogo name="xusd" size={32} /> },
  { id: "usdc", symbol: "USDC", mark: <PartnerLogo name="usdc" size={32} /> },
  { id: "usdt", symbol: "USDT", mark: <PartnerLogo name="usdt" size={32} /> },
];

const fiat: AssetOption[] = [
  { id: "sgd", symbol: "SGD" },
  { id: "usd", symbol: "USD" },
];

const withTrigger: Story["render"] = function Render(args) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open asset selection</Button>
      <ModalAssetSelection {...args} open={open} onOpenChange={setOpen} />
    </>
  );
};

export const TransferIn: Story = {
  render: withTrigger,
  args: {
    title: "Transfer In",
    description: "Deposit funds from your blockchain wallet or bank account",
    assets: stablecoins,
  },
};

export const TransferOut: Story = {
  render: withTrigger,
  args: {
    title: "Transfer Out",
    description: "Withdraw funds to your blockchain wallet or bank account",
    assets: stablecoins,
  },
};

export const Fiat: Story = {
  render: withTrigger,
  args: { title: "Transfer In", description: "Deposit funds from your bank account", assets: fiat },
};

export const Open: Story = { args: { ...TransferIn.args, defaultOpen: true } };
