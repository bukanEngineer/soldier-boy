import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BottomSheetNetwork } from "./BottomSheetNetwork";
import { Button } from "../Button";

const meta: Meta<typeof BottomSheetNetwork> = {
  title: "Patterns/Bottom Sheet/Network",
  component: BottomSheetNetwork,
  parameters: { layout: "centered" },
  argTypes: {
    title: { control: "text" },
    value: { control: "text" },
    onValueChange: { action: "onValueChange" },
  },
};
export default meta;

type Story = StoryObj<typeof BottomSheetNetwork>;

const networks = [
  { id: "ethereum", name: "Ethereum", description: "ERC-20" },
  { id: "polygon", name: "Polygon", description: "Polygon PoS" },
  { id: "avalanche", name: "Avalanche C-Chain", description: "AVAX C-Chain" },
  { id: "arbitrum", name: "Arbitrum", description: "Arbitrum One" },
  { id: "hedera", name: "Hedera", description: "HTS" },
];

export const Default: Story = {
  render: function Render(args) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("polygon");
    return (
      <>
        <Button onClick={() => setOpen(true)}>Select network</Button>
        <BottomSheetNetwork
          {...args}
          open={open}
          onOpenChange={setOpen}
          networks={networks}
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
  args: { defaultOpen: true, networks, value: "polygon" },
};
