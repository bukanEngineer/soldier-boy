import React from "react";
import { LinkButton } from "./LinkButton";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof LinkButton> = {
  title: "Atoms/Link Button",
  component: LinkButton,
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: "inline-radio", options: ["lg", "md", "sm"] },
    onDark: { control: "boolean" },
    leadingIcon: { control: "text" },
    trailingIcon: { control: "text" },
    children: { control: "text" },
  },
  args: { children: "Learn more", trailingIcon: "arrow_forward", onDark: false },
};
export default meta;

type Story = StoryObj<typeof LinkButton>;

export const Default: Story = {};
export const NoIcon: Story = { args: { leadingIcon: undefined, trailingIcon: undefined, children: "Learn more" } };
export const WithLeadingIcon: Story = { args: { leadingIcon: "download", trailingIcon: undefined, children: "Download statement" } };
export const OnDarkSurface: Story = {
  args: { onDark: true, children: "Request Quote" },
  decorators: [(S) => <div style={{ background: "#054948", padding: 24, borderRadius: 12 }}><S /></div>],
};
export const AllSizes: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
      <LinkButton size="lg" trailingIcon="arrow_forward">Large</LinkButton>
      <LinkButton size="md" trailingIcon="arrow_forward">Medium</LinkButton>
      <LinkButton size="sm" trailingIcon="arrow_forward">Small</LinkButton>
    </div>
  ),
};
