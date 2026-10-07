import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FieldNetwork } from "./FieldNetwork";
import { Field } from "../Field/Field";

function Example(
  props: React.ComponentProps<typeof FieldNetwork> & {
    label?: string;
    helper?: string;
    error?: string;
  },
) {
  const { label = "Network", helper, error, ...controlProps } = props;
  return (
    <Field.Root invalid={!!error}>
      <Field.Label>{label}</Field.Label>
      <FieldNetwork {...controlProps} />
      {helper && !error && <Field.Description>{helper}</Field.Description>}
      {error && <Field.Error match>{error}</Field.Error>}
    </Field.Root>
  );
}

const mark = (label: string, bg: string) => (
  <span
    style={{
      width: 24,
      height: 24,
      borderRadius: 999,
      background: bg,
      color: "#fff",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      font: "var(--label-small)",
    }}
  >
    {label}
  </span>
);

const networks = [
  { value: "eth", name: "Ethereum", logo: mark("E", "var(--status-information)") },
  { value: "bsc", name: "BNB Smart Chain", logo: mark("B", "var(--status-warning-strong)") },
  { value: "polygon", name: "Polygon", logo: mark("P", "#8247e5") },
  {
    value: "solana",
    name: "Solana",
    logo: mark("S", "var(--text-primary)"),
    status: { label: "New", variant: "positive" as const },
  },
];

const meta: Meta<typeof Example> = {
  title: "Patterns/Field/Network",
  component: Example,
  args: { disabled: false },
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400, minHeight: 360 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Example>;

export const Unfilled: Story = { args: { options: networks } };
export const Filled: Story = { args: { options: networks, defaultValue: "eth" } };
export const WithHelper: Story = {
  args: { options: networks, helper: "Select the network for this transfer." },
};
export const Error: Story = { args: { options: networks, error: "Please select a network." } };
export const Disabled: Story = {
  args: { options: networks, defaultValue: "eth", disabled: true },
};
export const InitialsFallback: Story = {
  args: {
    options: networks.map(({ logo: _logo, ...n }) => n),
    defaultValue: "bsc",
  },
};
