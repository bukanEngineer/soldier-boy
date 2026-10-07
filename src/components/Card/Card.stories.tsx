import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./Card";
import { Button } from "../Button/Button";
import { Tag } from "../Tag/Tag";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  parameters: { layout: "padded" },
  argTypes: {
    shadow: { control: "inline-radio", options: [false, 1, 2, 3] },
  },
  args: { shadow: false },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Verify Your Identity</CardTitle>
        <CardDescription>
          Complete identity verification for a smooth and secure experience.
        </CardDescription>
      </CardHeader>
    </Card>
  ),
};

export const Shadow1: Story = {
  args: { shadow: 1 },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360, background: "#F1F2F4", padding: 24 }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Verify Your Identity</CardTitle>
        <CardDescription>
          Complete identity verification for a smooth and secure experience.
        </CardDescription>
      </CardHeader>
    </Card>
  ),
};

export const Shadow2: Story = {
  ...Shadow1,
  args: { shadow: 2 },
};

export const Shadow3: Story = {
  ...Shadow1,
  args: { shadow: 3 },
};

export const WithFooter: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Verify Your Identity</CardTitle>
        <CardDescription>
          Complete identity verification for a smooth and secure experience.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Tag tone="positive">Verified</Tag>
        <Button size="sm" variant="tertiary">
          Edit
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const WithContent: Story = {
  render: (args) => (
    <Card {...args} shadow={1}>
      <CardHeader>
        <CardTitle>Account summary</CardTitle>
        <CardDescription>Balances update every few minutes.</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ margin: 0, font: "var(--body-large)" }}>S$12,450.00</p>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="secondary">
          View details
        </Button>
      </CardFooter>
    </Card>
  ),
};
