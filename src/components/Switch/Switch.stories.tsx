import React, { useState } from "react";
import { Switch } from "./Switch";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Switch> = {
  title: "Atoms/Switch",
  component: Switch,
  parameters: { layout: "padded" },
  args: { label: "Two-factor authentication", disabled: false },
  argTypes: {
    label: { control: "text" },
    sub: { control: "text" },
    disabled: { control: "boolean" },
    checked: { control: "boolean" },
    onChange: { action: "onChange" },
  },
};
export default meta;

type Story = StoryObj<typeof Switch>;

export const Off: Story = {};
export const On: Story = { args: { defaultChecked: true } };
export const WithSubtext: Story = {
  args: {
    label: "Email notifications",
    sub: "Receive transaction confirmations to your inbox.",
    defaultChecked: true,
  },
};
export const Disabled: Story = { args: { disabled: true } };
export const SelectedDisabled: Story = { args: { defaultChecked: true, disabled: true } };

export const SettingsList: Story = {
  render: () => {
    const [a, setA] = useState(true);
    const [b, setB] = useState(false);
    const [c, setC] = useState(true);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 480 }}>
        <Switch label="Two-factor authentication" sub="Required for transactions over S$10,000." checked={a} onChange={(e) => setA(e.target.checked)} />
        <Switch label="Marketing emails" sub="Product updates and announcements." checked={b} onChange={(e) => setB(e.target.checked)} />
        <Switch label="Allow API access" checked={c} onChange={(e) => setC(e.target.checked)} />
      </div>
    );
  },
};
