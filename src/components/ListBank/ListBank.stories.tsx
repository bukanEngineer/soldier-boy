import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ListBank } from "./ListBank";
import { List as ListGroup } from "../List/List";

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
};
export default meta;

// Rows are flat on their own; the container look belongs to the picker, not the row.
const plain: Story["decorators"] = [
  (Story) => (
    <div style={{ maxWidth: 360 }}>
      <Story />
    </div>
  ),
];

type Story = StoryObj<typeof ListBank>;

export const Unverified: Story = { decorators: plain };
export const Verified: Story = {
  args: { variant: "verified", account: "DBS - 0053105977213", swift: "UOVBSGSG" },
  decorators: plain,
};
export const Rejected: Story = { args: { variant: "rejected" }, decorators: plain };

export const List: Story = {
  render: () => (
    <ListGroup divided style={{ maxWidth: 343 }}>
      <ListBank logo={<Logo />} name="John Doe" account="DBS - 0053105977213" swift="UOVBSGSG" variant="verified" />
      <ListBank logo={<Logo />} name="Jane Lim" account="DBS - 0053105977213" variant="verified" />
      <ListBank logo={<Logo />} name="John Doe" account="DBS - 0053105977203" />
      <ListBank logo={<Logo />} name="Acme Pte Ltd" account="DBS - 0053105977299" variant="rejected" />
      <ListBank logo={<Logo />} name="Jane Lim" account="DBS - 0053105977213" variant="verified" />
    </ListGroup>
  ),
};
