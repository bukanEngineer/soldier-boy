import React, { useState } from "react";
import { Checkbox } from "./Checkbox";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Checkbox> = {
  title: "Atoms/Checkbox",
  component: Checkbox,
  parameters: { layout: "padded" },
  args: { label: "I agree to the terms", indeterminate: false, disabled: false, error: false },
  argTypes: {
    label: { control: "text" },
    sub: { control: "text" },
    indeterminate: { control: "boolean" },
    disabled: { control: "boolean" },
    error: { control: "boolean" },
    checked: { control: "boolean" },
    onChange: { action: "onChange" },
  },
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const WithSubtext: Story = { args: { label: "Send me product updates", sub: "Monthly newsletter, no marketing." } };
export const Indeterminate: Story = { args: { indeterminate: true, label: "Select all" } };
export const Error: Story = { args: { error: true, label: "Required field" } };
export const Disabled: Story = { args: { disabled: true, defaultChecked: true } };

export const Group: Story = {
  render: () => {
    const [picks, setPicks] = useState({ xsgd: true, xidr: false, xusd: false });
    const toggle = (k: keyof typeof picks) => setPicks((p) => ({ ...p, [k]: !p[k] }));
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Checkbox label="XSGD" checked={picks.xsgd} onChange={() => toggle("xsgd")} />
        <Checkbox label="XIDR" checked={picks.xidr} onChange={() => toggle("xidr")} />
        <Checkbox label="XUSD" checked={picks.xusd} onChange={() => toggle("xusd")} />
      </div>
    );
  },
};
