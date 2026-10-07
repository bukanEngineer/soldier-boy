import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BottomSheetBank } from "./BottomSheetBank";
import { AssetMark } from "../AssetMark/AssetMark";
import { Button } from "../Button";

const meta: Meta<typeof BottomSheetBank> = {
  title: "Patterns/Bottom Sheet/Bank",
  component: BottomSheetBank,
  parameters: { layout: "centered" },
  argTypes: {
    title: { control: "text" },
    value: { control: "text" },
    onValueChange: { action: "onValueChange" },
  },
};
export default meta;

type Story = StoryObj<typeof BottomSheetBank>;

const banks = [
  { id: "dbs", name: "DBS Bank", description: "•••• 1234", mark: <AssetMark label="DBS" color="var(--brand-secure-teal)" size={32} /> },
  { id: "uob", name: "UOB", description: "•••• 9981", mark: <AssetMark label="UOB" color="var(--brand-credible-blue)" size={32} /> },
  { id: "scb", name: "Standard Chartered", description: "•••• 4420", mark: <AssetMark label="SC" color="var(--status-positive)" size={32} /> },
  { id: "ocbc", name: "OCBC", description: "•••• 0073", mark: <AssetMark label="OC" color="var(--brand-wealthy-gold)" size={32} /> },
];

export const Default: Story = {
  render: function Render(args) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("dbs");
    return (
      <>
        <Button onClick={() => setOpen(true)}>Select bank</Button>
        <BottomSheetBank
          {...args}
          open={open}
          onOpenChange={setOpen}
          banks={banks}
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
  args: { defaultOpen: true, banks, value: "dbs" },
};
