import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ListBank } from "./ListBank";

const Logo = () => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 40,
      height: 24,
      borderRadius: 4,
      background: "var(--surface-secondary)",
      font: "var(--label-small)",
      color: "var(--text-secondary)",
    }}
  >
    DBS
  </span>
);

const meta: Meta<typeof ListBank> = {
  title: "Patterns/List/Bank",
  component: ListBank,
  parameters: { layout: "padded" },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["unverified", "verified", "rejected"],
    },
  },
  args: {
    name: "John Doe",
    account: "DBS - 0053105977203",
    logo: <Logo />,
    variant: "unverified",
  },
  decorators: [
    (Story) => (
      <div className="list-bank-group" style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ListBank>;

export const Unverified: Story = {};
export const Verified: Story = {
  args: { variant: "verified", account: "DBS - 0053105977213", swift: "UOVBSGSG" },
};
export const Rejected: Story = { args: { variant: "rejected" } };

export const List: Story = {
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div className="list-bank-group" style={{ maxWidth: 343 }}>
      <ListBank logo={<Logo />} name="John Doe" account="DBS - 0053105977213" swift="UOVBSGSG" variant="verified" />
      <ListBank logo={<Logo />} name="Jane Lim" account="DBS - 0053105977213" variant="verified" />
      <ListBank logo={<Logo />} name="John Doe" account="DBS - 0053105977203" />
      <ListBank logo={<Logo />} name="Acme Pte Ltd" account="DBS - 0053105977299" variant="rejected" />
      <ListBank logo={<Logo />} name="Jane Lim" account="DBS - 0053105977213" variant="verified" />
    </div>
  ),
};
