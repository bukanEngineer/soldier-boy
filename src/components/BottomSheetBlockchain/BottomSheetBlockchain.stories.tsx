import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BottomSheetBlockchain } from "./BottomSheetBlockchain";
import { AssetMark } from "../AssetMark/AssetMark";
import { Button } from "../Button";

const meta: Meta<typeof BottomSheetBlockchain> = {
  title: "Patterns/Bottom Sheet/Blockchain",
  component: BottomSheetBlockchain,
  parameters: { layout: "centered" },
  argTypes: {
    title: { control: "text" },
    value: { control: "text" },
    onValueChange: { action: "onValueChange" },
  },
};
export default meta;

type Story = StoryObj<typeof BottomSheetBlockchain>;

const chains = [
  { id: "ethereum", name: "Ethereum", description: "0x12ab…34cd", mark: <AssetMark asset="ETH" size={32} /> },
  { id: "polygon", name: "Polygon", description: "0x98fe…76ba", mark: <AssetMark asset="POLYGON" size={32} /> },
  { id: "solana", name: "Solana", description: "7Hn3…k9Qz", mark: <AssetMark asset="SOLANA" size={32} /> },
  { id: "avalanche", name: "Avalanche", description: "0x55aa…11ff", mark: <AssetMark asset="AVAX" size={32} /> },
  { id: "metamask", name: "MetaMask", description: "Connected", mark: <AssetMark asset="METAMASK" size={32} /> },
];

export const Default: Story = {
  render: function Render(args) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("ethereum");
    return (
      <>
        <Button onClick={() => setOpen(true)}>Select blockchain</Button>
        <BottomSheetBlockchain
          {...args}
          open={open}
          onOpenChange={setOpen}
          chains={chains}
          value={value}
          onValueChange={(id) => {
            setValue(id);
            setOpen(false);
          }}
        />
      </>
    );
  },
};

export const Open: Story = {
  args: { defaultOpen: true, chains, value: "ethereum" },
};
