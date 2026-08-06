import React from "react";
import { Button } from "./Button";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Button> = {
  title: "Atoms/Button",
  component: Button,
  parameters: { layout: "centered" },
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "secondary", "tertiary"] },
    size: { control: "inline-radio", options: ["lg", "sm"] },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
  args: { children: "Take Assessment", variant: "primary", size: "lg", disabled: false },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { variant: "primary" } };
export const Secondary: Story = { args: { variant: "secondary", children: "Cancel" } };
export const Tertiary: Story = { args: { variant: "tertiary", children: "Learn more" } };
export const Disabled: Story = { args: { variant: "primary", disabled: true, children: "Submit" } };

export const AllVariants: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="primary" disabled>Disabled</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Button size="lg">Large 48</Button>
      <Button size="sm">Small 36</Button>
    </div>
  ),
};

/* Interaction states forced via state-class hooks so Chromatic can snapshot
 * hover / pressed without driving real pointer events. */
export const States: Story = {
  parameters: { layout: "padded" },
  render: () => {
    const variants = ["primary", "secondary", "tertiary"] as const;
    const cell = { display: "flex", flexDirection: "column" as const, gap: 8 };
    const colHead = { font: "var(--label-small)", color: "var(--text-secondary)" };
    return (
      <div style={{ display: "grid", gridTemplateColumns: "auto repeat(4, max-content)", gap: 16, alignItems: "center" }}>
        <span />
        <span style={colHead}>Enabled</span>
        <span style={colHead}>Hovered</span>
        <span style={colHead}>Pressed</span>
        <span style={colHead}>Disabled</span>
        {variants.map((v) => (
          <React.Fragment key={v}>
            <span style={{ ...colHead, textTransform: "capitalize" }}>{v}</span>
            <Button variant={v}>Button</Button>
            <Button variant={v} className="is-hovered">Button</Button>
            <Button variant={v} className="is-pressed">Button</Button>
            <Button variant={v} disabled>Button</Button>
          </React.Fragment>
        ))}
      </div>
    );
  },
};
