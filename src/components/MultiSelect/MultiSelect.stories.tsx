import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MultiSelect } from "./MultiSelect";
import { Field } from "../Field/Field";

const networks = [
  { value: "eth", label: "Ethereum" },
  { value: "polygon", label: "Polygon" },
  { value: "arbitrum", label: "Arbitrum" },
  { value: "base", label: "Base" },
  { value: "solana", label: "Solana", disabled: true },
];

const items = networks.map((n) => n.value);
const labelFor = (value: string) => networks.find((n) => n.value === value)?.label ?? value;

function Example({
  disabled,
  defaultValue = [] as string[],
  placeholder = "Select networks",
}: {
  disabled?: boolean;
  defaultValue?: string[];
  placeholder?: string;
}) {
  return (
    <MultiSelect.Root
      items={items}
      multiple
      defaultValue={defaultValue}
      disabled={disabled}
      isItemEqualToValue={(a, b) => a === b}
    >
      <MultiSelect.InputGroup>
        <MultiSelect.Value>
          {(value: string[]) => (
            <MultiSelect.Chips aria-label={value.length ? "Selected networks" : undefined}>
              {value.map((v) => (
                <MultiSelect.Chip
                  key={v}
                  aria-label={labelFor(v)}
                  aria-description="Press Backspace or Delete to remove"
                >
                  {labelFor(v)}
                  <MultiSelect.ChipRemove aria-label={`Remove ${labelFor(v)}`} />
                </MultiSelect.Chip>
              ))}
              <MultiSelect.Input
                placeholder={value.length > 0 ? "" : placeholder}
                aria-description={
                  value.length > 0
                    ? `${value.length} selected. From the start of the input, press Left Arrow to focus the selected items`
                    : undefined
                }
              />
            </MultiSelect.Chips>
          )}
        </MultiSelect.Value>
        <MultiSelect.Clear aria-label="Clear all" />
        <MultiSelect.Trigger aria-label="Open" />
      </MultiSelect.InputGroup>
      <MultiSelect.Popup>
        <MultiSelect.Empty>No networks found.</MultiSelect.Empty>
        <MultiSelect.List>
          {(item: string) => {
            const opt = networks.find((n) => n.value === item);
            return (
              <MultiSelect.Item key={item} value={item} disabled={opt?.disabled}>
                {opt?.label ?? item}
              </MultiSelect.Item>
            );
          }}
        </MultiSelect.List>
      </MultiSelect.Popup>
    </MultiSelect.Root>
  );
}

const meta: Meta<typeof Example> = {
  title: "Components/Multi Select",
  component: Example,
  args: { disabled: false },
  argTypes: { disabled: { control: "boolean" } },
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360, minHeight: 360 }}>
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
      <Field.Label>Supported networks</Field.Label>
      <Example {...args} />
    </Field.Root>
  ),
};

export const WithValue: Story = {
  args: { defaultValue: ["eth", "base"] },
  render: (args) => (
    <Field.Root>
      <Field.Label>Supported networks</Field.Label>
      <Example {...args} />
    </Field.Root>
  ),
};

export const WithHelper: Story = {
  render: (args) => (
    <Field.Root>
      <Field.Label>Supported networks</Field.Label>
      <Example {...args} />
      <Field.Description>Choose one or more networks for this asset.</Field.Description>
    </Field.Root>
  ),
};

export const Error: Story = {
  render: (args) => (
    <Field.Root invalid>
      <Field.Label>Supported networks</Field.Label>
      <Example {...args} />
      <Field.Error match>Select at least one network.</Field.Error>
    </Field.Root>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: ["eth"] },
  render: (args) => (
    <Field.Root>
      <Field.Label>Supported networks</Field.Label>
      <Example {...args} />
    </Field.Root>
  ),
};

export const Controlled: Story = {
  render: function Render() {
    const [value, setValue] = useState<string[]>(["eth"]);
    return (
      <Field.Root>
        <Field.Label>Supported networks ({value.length})</Field.Label>
        <MultiSelect.Root items={items} multiple value={value} onValueChange={setValue}>
          <MultiSelect.InputGroup>
            <MultiSelect.Value>
              {(selected: string[]) => (
                <MultiSelect.Chips>
                  {selected.map((v) => (
                    <MultiSelect.Chip key={v}>
                      {labelFor(v)}
                      <MultiSelect.ChipRemove aria-label={`Remove ${labelFor(v)}`} />
                    </MultiSelect.Chip>
                  ))}
                  <MultiSelect.Input placeholder={selected.length ? "" : "Select networks"} />
                </MultiSelect.Chips>
              )}
            </MultiSelect.Value>
            <MultiSelect.Clear aria-label="Clear all" />
            <MultiSelect.Trigger aria-label="Open" />
          </MultiSelect.InputGroup>
          <MultiSelect.Popup>
            <MultiSelect.List>
              {(item: string) => (
                <MultiSelect.Item key={item} value={item}>
                  {labelFor(item)}
                </MultiSelect.Item>
              )}
            </MultiSelect.List>
          </MultiSelect.Popup>
        </MultiSelect.Root>
      </Field.Root>
    );
  },
};
