import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Menu } from "./Menu";
import { IconButton } from "../IconButton/IconButton";
import { Button } from "../Button/Button";

const meta: Meta<typeof Menu.Popup> = {
  title: "Components/Menu",
  component: Menu.Popup,
  parameters: { layout: "centered" },
  argTypes: {
    side: { control: "inline-radio", options: ["top", "bottom", "left", "right"] },
    align: { control: "inline-radio", options: ["start", "center", "end"] },
    sideOffset: { control: "number" },
  },
  args: { side: "bottom", align: "start", sideOffset: 6 },
};
export default meta;

type Story = StoryObj<typeof Menu.Popup>;

const moreTrigger = <IconButton icon="more_vert" variant="secondary" label="More" />;

export const FromIconButton: Story = {
  render: (args) => (
    <Menu.Root>
      <Menu.Trigger render={moreTrigger} />
      <Menu.Popup {...args}>
        <Menu.Item icon="download">Download statement</Menu.Item>
        <Menu.Item icon="share">Share</Menu.Item>
        <Menu.Separator />
        <Menu.Item icon="delete" variant="critical">Delete</Menu.Item>
      </Menu.Popup>
    </Menu.Root>
  ),
};

export const Sectioned: Story = {
  args: { align: "end" },
  render: (args) => (
    <Menu.Root>
      <Menu.Trigger render={<Button variant="secondary" />}>Filters</Menu.Trigger>
      <Menu.Popup {...args}>
        <Menu.Group>
          <Menu.GroupLabel>Status</Menu.GroupLabel>
          <Menu.Item icon="check_circle">Active</Menu.Item>
          <Menu.Item icon="schedule">Pending</Menu.Item>
        </Menu.Group>
        <Menu.Separator />
        <Menu.Group>
          <Menu.GroupLabel>Currency</Menu.GroupLabel>
          <Menu.Item>XSGD</Menu.Item>
          <Menu.Item>XIDR</Menu.Item>
          <Menu.Item>XUSD</Menu.Item>
        </Menu.Group>
      </Menu.Popup>
    </Menu.Root>
  ),
};

export const SingleSelect: Story = {
  render: function Render(args) {
    const [value, setValue] = useState("xsgd");
    return (
      <Menu.Root>
        <Menu.Trigger render={<Button variant="secondary" />}>Currency</Menu.Trigger>
        <Menu.Popup {...args}>
          <Menu.RadioGroup value={value} onValueChange={setValue}>
            <Menu.GroupLabel>Currency</Menu.GroupLabel>
            {["xsgd", "xidr", "xusd"].map((c) => (
              <Menu.RadioItem key={c} value={c}>{c.toUpperCase()}</Menu.RadioItem>
            ))}
          </Menu.RadioGroup>
        </Menu.Popup>
      </Menu.Root>
    );
  },
};

export const MultiSelect: Story = {
  render: function Render(args) {
    const [sel, setSel] = useState(["active"]);
    const toggle = (k: string, on: boolean) =>
      setSel((s) => (on ? [...s, k] : s.filter((x) => x !== k)));
    const opts = [
      { k: "active", label: "Active" },
      { k: "pending", label: "Pending" },
      { k: "failed", label: "Failed" },
    ];
    return (
      <Menu.Root>
        <Menu.Trigger render={<Button variant="secondary" />}>Status</Menu.Trigger>
        <Menu.Popup {...args}>
          <Menu.Group>
            <Menu.GroupLabel>Status</Menu.GroupLabel>
            {opts.map((o) => (
              <Menu.CheckboxItem
                key={o.k}
                checked={sel.includes(o.k)}
                onCheckedChange={(on) => toggle(o.k, on)}
              >
                {o.label}
              </Menu.CheckboxItem>
            ))}
          </Menu.Group>
        </Menu.Popup>
      </Menu.Root>
    );
  },
};

export const WithDisabledItem: Story = {
  parameters: { layout: "padded" },
  render: (args) => (
    <div style={{ minHeight: 220 }}>
      <Menu.Root defaultOpen modal={false}>
        <Menu.Trigger render={moreTrigger} />
        <Menu.Popup {...args}>
          <Menu.Item icon="download">Download statement</Menu.Item>
          <Menu.Item icon="share" disabled>Share (disabled)</Menu.Item>
          <Menu.Separator />
          <Menu.Item icon="delete" variant="critical" disabled>Delete (disabled)</Menu.Item>
        </Menu.Popup>
      </Menu.Root>
    </div>
  ),
};

export const WithSecondaryText: Story = {
  render: (args) => (
    <Menu.Root>
      <Menu.Trigger render={moreTrigger} />
      <Menu.Popup {...args}>
        <Menu.Item icon="account_balance" secondary="DBS •••• 8829" trailing="Default">Primary account</Menu.Item>
        <Menu.Item icon="credit_card" secondary="Visa •••• 4012" trailing="2m ago">Card</Menu.Item>
        <Menu.Separator />
        <Menu.Item icon="add">Add payment method</Menu.Item>
      </Menu.Popup>
    </Menu.Root>
  ),
};

/** Popups are portaled, so an `overflow: hidden` ancestor no longer clips them. */
export const InsideOverflowHidden: Story = {
  parameters: { layout: "padded" },
  render: (args) => (
    <div style={{ overflow: "hidden", height: 56, padding: 8, border: "1px dashed var(--border)" }}>
      <Menu.Root>
        <Menu.Trigger render={moreTrigger} />
        <Menu.Popup {...args}>
          <Menu.Item icon="download">Download statement</Menu.Item>
          <Menu.Item icon="share">Share</Menu.Item>
          <Menu.Item icon="print">Print</Menu.Item>
        </Menu.Popup>
      </Menu.Root>
    </div>
  ),
};
