import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FieldBank } from "./FieldBank";
import { Field } from "../Field/Field";
import { LinkButton } from "../LinkButton/LinkButton";

function Example(
  props: React.ComponentProps<typeof FieldBank> & {
    label?: string;
    helper?: string;
    error?: string;
    addAction?: { label: string; onClick: () => void };
  },
) {
  const { label = "Bank Account", helper, error, addAction, ...controlProps } = props;
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
      <FieldBank {...controlProps} />
      {helper && !error && <Field.Description>{helper}</Field.Description>}
      {error && <Field.Error match>{error}</Field.Error>}
    </Field.Root>
  );
}

const bankLogo = (label: string, bg: string) => (
  <span
    style={{
      minWidth: 44,
      height: 24,
      padding: "0 6px",
      borderRadius: 4,
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

const banks = [
  {
    value: "dbs",
    name: "John Doe",
    account: "DBS - 0053105977213",
    swift: "DBSSSGSG",
    logo: bankLogo("DBS", "#c4141a"),
  },
  {
    value: "uob",
    name: "John Doe",
    account: "UOB - 0053105977203",
    logo: bankLogo("UOB", "#005baa"),
  },
  {
    value: "ocbc",
    name: "John Doe",
    account: "OCBC - 0053105977199",
    logo: bankLogo("OCBC", "#c4141a"),
    status: { label: "Rejected", variant: "critical" as const },
    action: { label: "Resubmit", onClick: () => {} },
    disabled: true,
  },
];

const meta: Meta<typeof Example> = {
  title: "Patterns/Field/Bank",
  component: Example,
  args: { disabled: false },
  parameters: { layout: "padded" },
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    helper: { control: "text" },
    error: { control: "text" },
    disabled: { control: "boolean" },
  },
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
  args: { options: banks, addAction: { label: "Add Account", onClick: () => {} } },
};
export const Filled: Story = {
  args: {
    options: banks,
    defaultValue: "dbs",
    addAction: { label: "Add Account", onClick: () => {} },
  },
};
export const WithHelper: Story = {
  args: {
    options: banks,
    defaultValue: "dbs",
    helper: "Funds will be sent to this account.",
  },
};
export const Error: Story = {
  args: { options: banks, error: "Select a verified bank account." },
};
export const Disabled: Story = {
  args: { options: banks, defaultValue: "dbs", disabled: true },
};
export const InitialsFallback: Story = {
  args: {
    options: banks.map(({ logo: _logo, ...b }) => b),
    defaultValue: "uob",
  },
};
