import React, { useState } from "react";
import { Radio, RadioGroup } from "./Radio";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Radio> = {
  title: "Atoms/Radio",
  component: Radio,
  args: { label: "XSGD", disabled: false, error: false },
  argTypes: {
    label: { control: "text" },
    sub: { control: "text" },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    error: { control: "boolean" },
    name: { control: "text" },
    value: { control: "text" },
    onChange: { action: "onChange" },
  },
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof Radio>;

export const Default: Story = { args: { label: "XSGD", name: "stablecoin" } };
export const Selected: Story = { args: { label: "XSGD", defaultChecked: true, name: "stablecoin" } };
export const Disabled: Story = { args: { label: "XUSD", disabled: true, name: "stablecoin" } };
export const SelectedDisabled: Story = { args: { label: "XSGD", defaultChecked: true, disabled: true, name: "stablecoin" } };

export const Group: Story = {
  render: () => {
    const [v, setV] = useState("xsgd");
    return (
      <RadioGroup
        name="coin"
        legend="Select stablecoin"
        value={v}
        onChange={setV}
        options={[
          { value: "xsgd", label: "XSGD", sub: "Singapore Dollar — pegged 1:1" },
          { value: "xidr", label: "XIDR", sub: "Indonesian Rupiah — pegged 1:1" },
          { value: "xusd", label: "XUSD", sub: "US Dollar — pegged 1:1" },
        ]}
      />
    );
  },
};
