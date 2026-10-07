import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DropdownBank } from "./DropdownBank";
import { AssetMark } from "../AssetMark/AssetMark";

const meta: Meta<typeof DropdownBank> = {
  title: "Patterns/Dropdown/Bank",
  component: DropdownBank,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 328 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    value: { control: "text" },
    onValueChange: { action: "onValueChange" },
  },
  args: { value: "dbs" },
};
export default meta;

type Story = StoryObj<typeof DropdownBank>;

const banks = [
  { value: "dbs", name: "DBS Bank", logo: <AssetMark label="DBS" color="var(--brand-secure-teal)" size={24} /> },
  { value: "uob", name: "UOB", logo: <AssetMark label="UOB" color="var(--brand-credible-blue)" size={24} /> },
  { value: "scb", name: "Standard Chartered", logo: <AssetMark label="SC" color="var(--status-positive)" size={24} /> },
  { value: "ocbc", name: "OCBC", logo: <AssetMark label="OC" color="var(--brand-wealthy-gold)" size={24} /> },
];

export const Default: Story = { args: { options: banks, value: "dbs" } };

export const WithAccountNumbers: Story = {
  args: {
    value: "dbs",
    options: banks.map((b, i) => ({
      ...b,
      account: ["•••• 1234", "•••• 9981", "•••• 4420", "•••• 0073"][i],
    })),
  },
};

export const WithStatus: Story = {
  args: {
    value: "dbs",
    options: [
      {
        value: "dbs",
        name: "DBS Bank",
        account: "•••• 1234",
        logo: <AssetMark label="DBS" color="var(--brand-secure-teal)" size={24} />,
        tag: { label: "Verified", variant: "positive" },
      },
      {
        value: "uob",
        name: "UOB",
        account: "•••• 9981",
        logo: <AssetMark label="UOB" color="var(--brand-credible-blue)" size={24} />,
        tag: { label: "Pending", variant: "warning" },
      },
    ],
  },
};

export const InitialsFallback: Story = {
  args: { value: "dbs", options: banks.map(({ logo: _logo, ...b }) => b) },
};
