import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FieldBlockchain } from "./FieldBlockchain";
import { Field } from "../Field/Field";
import { LinkButton } from "../LinkButton/LinkButton";

function Example(
  props: React.ComponentProps<typeof FieldBlockchain> & {
    label?: string;
    helper?: string;
    error?: string;
    addAction?: { label: string; onClick: () => void };
  },
) {
  const { label = "Blockchain Wallet", helper, error, addAction, ...controlProps } = props;
  return (
    <Field.Root invalid={!!error}>
      <div className="field__label-row" style={{ justifyContent: "space-between", width: "100%" }}>
        <Field.Label>{label}</Field.Label>
        {addAction && (
          <LinkButton size="sm" leadingIcon="add" onClick={addAction.onClick}>
            {addAction.label}
          </LinkButton>
        )}
      </div>
      <FieldBlockchain {...controlProps} />
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

const wallets = [
  {
    value: "mm",
    name: "Metamask",
    address: "0x934ddab12av012345c1ertf897fec124f2gyb1",
    logo: mark("M", "var(--status-warning-strong)"),
  },
  {
    value: "w2",
    name: "Wallet 2",
    address: "0x934ddab12av012345c1ertf897fec124f2gyb1",
    logo: mark("W", "var(--text-secondary)"),
    status: { label: "Pending", variant: "warning" as const },
  },
  {
    value: "w3",
    name: "Wallet 3",
    address: "0x934ddab12av012345c1ertf897fec124f2gyb1",
    logo: mark("W", "var(--text-secondary)"),
    action: { label: "Verify", onClick: () => {} },
  },
];

const meta: Meta<typeof Example> = {
  title: "Patterns/Field/Blockchain",
  component: Example,
  args: { disabled: false },
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400, minHeight: 420 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Example>;

export const Unfilled: Story = {
  args: { options: wallets, addAction: { label: "Add Wallet", onClick: () => {} } },
};
export const Filled: Story = {
  args: {
    options: wallets,
    defaultValue: "mm",
    addAction: { label: "Add Wallet", onClick: () => {} },
  },
};
export const WithHelper: Story = {
  args: {
    options: wallets,
    defaultValue: "mm",
    helper: "Tokens will be sent to this wallet address.",
  },
};
export const Error: Story = {
  args: { options: wallets, error: "Select a verified wallet." },
};
export const Disabled: Story = {
  args: { options: wallets, defaultValue: "mm", disabled: true },
};
export const InitialsFallback: Story = {
  args: {
    options: wallets.map(({ logo: _logo, ...w }) => w),
    defaultValue: "mm",
  },
};
