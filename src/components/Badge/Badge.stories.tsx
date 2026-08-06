import React from "react";
import { Badge } from "./Badge";
import { IconButton } from "../IconButton/IconButton";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Badge> = {
  title: "Atoms/Badge",
  component: Badge,
  parameters: { layout: "centered" },
  argTypes: {
    tone: { control: "inline-radio", options: ["brand", "critical", "warning", "info", "neutral"] },
    size: { control: "inline-radio", options: ["lg", "md", "sm"] },
    dot: { control: "boolean" },
    children: { control: "number" },
  },
  args: { tone: "brand", size: "md", children: 3 },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Numeric: Story = {};
export const Dot: Story = { args: { dot: true, tone: "critical" } };
export const OverflowMax: Story = { args: { children: 248, max: 99 } };

export const OnIconButton: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
      <Badge.Wrap badge={<Badge>2</Badge>}>
        <IconButton icon="notifications" variant="secondary" label="Notifications" />
      </Badge.Wrap>
      <Badge.Wrap badge={<Badge tone="critical">12</Badge>}>
        <IconButton icon="mail" variant="secondary" label="Mail" />
      </Badge.Wrap>
      <Badge.Wrap badge={<Badge dot tone="critical" />}>
        <IconButton icon="chat" variant="secondary" label="Chat" />
      </Badge.Wrap>
    </div>
  ),
};

export const AllTones: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Badge tone="brand">5</Badge>
      <Badge tone="critical">3</Badge>
      <Badge tone="warning">7</Badge>
      <Badge tone="info">2</Badge>
      <Badge tone="neutral">9</Badge>
    </div>
  ),
};

export const AllSizes: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Badge size="lg">12</Badge>
      <Badge size="md">12</Badge>
      <Badge size="sm">12</Badge>
    </div>
  ),
};
