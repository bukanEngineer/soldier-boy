import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "./Select";
import { Field } from "../Field/Field";

const currencies = [
  { value: "xsgd", label: "XSGD — Singapore Dollar" },
  { value: "xidr", label: "XIDR — Indonesian Rupiah" },
  { value: "xusd", label: "XUSD — US Dollar" },
];

function Example({
  size = "large",
  placeholder = "Select…",
  disabled,
  defaultValue = null as string | null,
  clearable = true,
}: {
  size?: "large" | "small";
  placeholder?: string;
  disabled?: boolean;
  defaultValue?: string | null;
  clearable?: boolean;
}) {
  return (
    <Select.Root items={currencies} defaultValue={defaultValue} disabled={disabled}>
      <Select.Control size={size}>
        <Select.Trigger size={size}>
          <Select.Value placeholder={placeholder} />
          <Select.Icon />
        </Select.Trigger>
        {clearable && <Select.Clear />}
      </Select.Control>
      <Select.Popup>
        <Select.List>
          {currencies.map((c) => (
            <Select.Item key={c.value} value={c.value}>
              {c.label}
            </Select.Item>
          ))}
        </Select.List>
      </Select.Popup>
    </Select.Root>
  );
}

const meta: Meta<typeof Example> = {
  title: "Components/Select",
  component: Example,
  args: { disabled: false, size: "large", clearable: true },
  argTypes: {
    disabled: { control: "boolean" },
    size: { control: "inline-radio", options: ["large", "small"] },
    clearable: { control: "boolean" },
  },
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Example>;

export const Default: Story = {
  render: (args) => (
    <Field.Root>
      <Field.Label>Currency</Field.Label>
      <Example {...args} />
    </Field.Root>
  ),
};

export const Small: Story = {
  args: { size: "small", defaultValue: "xsgd" },
  render: (args) => (
    <Field.Root>
      <Field.Label>Currency</Field.Label>
      <Example {...args} />
    </Field.Root>
  ),
};

export const WithValue: Story = {
  args: { defaultValue: "xsgd" },
  render: (args) => (
    <Field.Root>
      <Field.Label>Currency</Field.Label>
      <Example {...args} />
    </Field.Root>
  ),
};

export const WithHelper: Story = {
  render: (args) => (
    <Field.Root>
      <Field.Label>Currency</Field.Label>
      <Example {...args} />
      <Field.Description>Pick the stablecoin you want to mint.</Field.Description>
    </Field.Root>
  ),
};

export const Error: Story = {
  render: (args) => (
    <Field.Root invalid>
      <Field.Label>Currency</Field.Label>
      <Example {...args} />
      <Field.Error match>Please select a currency.</Field.Error>
    </Field.Root>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "xsgd" },
  render: (args) => (
    <Field.Root>
      <Field.Label>Currency</Field.Label>
      <Example {...args} />
    </Field.Root>
  ),
};

export const Controlled: Story = {
  render: function Render() {
    const [value, setValue] = useState<string | null>("xsgd");
    return (
      <Field.Root>
        <Field.Label>Currency ({value ?? "none"})</Field.Label>
        <Select.Root items={currencies} value={value} onValueChange={setValue}>
          <Select.Control>
            <Select.Trigger>
              <Select.Value placeholder="Select…" />
              <Select.Icon />
            </Select.Trigger>
            <Select.Clear />
          </Select.Control>
          <Select.Popup>
            <Select.List>
              {currencies.map((c) => (
                <Select.Item key={c.value} value={c.value}>
                  {c.label}
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Root>
      </Field.Root>
    );
  },
};
