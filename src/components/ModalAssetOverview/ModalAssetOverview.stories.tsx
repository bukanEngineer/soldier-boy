import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ModalAssetOverview, type AssetMethod, type AssetNetwork } from "./ModalAssetOverview";
import { Button } from "../Button";
import { PartnerLogo } from "../PartnerLogo/PartnerLogo";

const meta: Meta<typeof ModalAssetOverview> = {
  title: "Patterns/Modal/Asset Overview",
  component: ModalAssetOverview,
  parameters: { layout: "centered" },
  argTypes: {
    symbol: { control: "text" },
    subtitle: { control: "text" },
    networkLabel: { control: "text" },
    onSelectMethod: { action: "onSelectMethod" },
  },
};
export default meta;

type Story = StoryObj<typeof ModalAssetOverview>;

const methods: AssetMethod[] = [
  {
    id: "in",
    title: "Transfer In",
    description: "Receive crypto from my external wallet or bank transfer",
    icon: <span className="material-symbols-rounded">add</span>,
  },
  {
    id: "out",
    title: "Transfer Out",
    description: "Send crypto to my blockchain address or bank account",
    icon: <span className="material-symbols-rounded">arrow_outward</span>,
  },
];

const networks: AssetNetwork[] = [
  { label: "Ethereum", mark: <PartnerLogo name="ethereum" size={16} monochrome={false} /> },
  { label: "Polygon", mark: <PartnerLogo name="polygon" size={16} monochrome={false} /> },
  { label: "Avalanche C-Chain", mark: <PartnerLogo name="avalanche" size={16} monochrome={false} /> },
  { label: "Arbitrum", mark: <PartnerLogo name="arbitrum" size={16} monochrome={false} /> },
  { label: "Hedera", mark: <PartnerLogo name="hedera" size={16} monochrome={false} /> },
  { label: "Ripple", mark: <PartnerLogo name="ripple" size={16} monochrome={false} /> },
];

const withTrigger: Story["render"] = function Render(args) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open asset overview</Button>
      <ModalAssetOverview {...args} open={open} onOpenChange={setOpen} />
    </>
  );
};

export const Stablecoin: Story = {
  render: withTrigger,
  args: {
    mark: <PartnerLogo name="xsgd" size={36} />,
    symbol: "XSGD",
    subtitle: "1:1 to SGD",
    methods,
    networks,
    banks: "FAST, MEPS, SWIFT",
  },
};

export const Fiat: Story = {
  render: withTrigger,
  args: { symbol: "SGD", subtitle: "Singapore Dollar", methods, banks: "FAST, MEPS, SWIFT" },
};

export const Open: Story = { args: { ...Stablecoin.args, defaultOpen: true } };
