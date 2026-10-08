import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SelectionBox } from "./SelectionBox";
import { Radio } from "../Radio/Radio";
import { Icon } from "../Icon/Icon";

const WalletIcon = <Icon name="account_balance_wallet" />;

const meta: Meta<typeof SelectionBox> = {
  title: "Components/Selection Box",
  component: SelectionBox,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SelectionBox>;

export const RadioGroup: Story = {
  render: function Render() {
    const [value, setValue] = useState("sgd");
    return (
      <Radio.Group value={value} onValueChange={setValue} style={{ display: "grid", gap: 8 }}>
        <SelectionBox type="radio" value="sgd" label="SGD account" description="Singapore Dollar" />
        <SelectionBox type="radio" value="usd" label="USD account" description="US Dollar" />
        <SelectionBox type="radio" value="locked" label="Locked" description="Unavailable" disabled />
      </Radio.Group>
    );
  },
};

export const WithIcons: Story = {
  render: function Render() {
    const [value, setValue] = useState("a");
    return (
      <Radio.Group value={value} onValueChange={setValue} style={{ display: "grid", gap: 8 }}>
        <SelectionBox type="radio" value="a" icon={WalletIcon} label="Primary" description="Default wallet" />
        <SelectionBox type="radio" value="b" icon={WalletIcon} label="Secondary" description="Backup wallet" />
      </Radio.Group>
    );
  },
};

export const MultiCheck: Story = {
  render: function Render() {
    const [sel, setSel] = useState(["security"]);
    const toggle = (id: string, on: boolean) =>
      setSel((s) => (on ? [...s, id] : s.filter((x) => x !== id)));
    return (
      <div style={{ display: "grid", gap: 8 }}>
        <SelectionBox
          type="check"
          label="Product updates"
          description="New features & releases"
          selected={sel.includes("product")}
          onChange={(on) => toggle("product", on)}
        />
        <SelectionBox
          type="check"
          label="Security alerts"
          description="Important account activity"
          selected={sel.includes("security")}
          onChange={(on) => toggle("security", on)}
        />
      </div>
    );
  },
};
