import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "./Switch";

const meta: Meta = {
  title: "Components/Switch",
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: function Render() {
    const [on, setOn] = useState(true);
    return (
      <label className="control" htmlFor="sw-default">
        <Switch.Root id="sw-default" checked={on} onCheckedChange={setOn}>
          <Switch.Thumb />
        </Switch.Root>
        <span className="control__label">Two-factor authentication</span>
      </label>
    );
  },
};

export const WithSub: Story = {
  render: () => (
    <label className="control has-sub" htmlFor="sw-sub">
      <Switch.Root id="sw-sub" defaultChecked>
        <Switch.Thumb />
      </Switch.Root>
      <span className="control__label">
        Marketing emails
        <span className="control__sub">Product updates and announcements</span>
      </span>
    </label>
  ),
};

export const Disabled: Story = {
  render: () => (
    <label className="control" htmlFor="sw-dis">
      <Switch.Root id="sw-dis" disabled checked>
        <Switch.Thumb />
      </Switch.Root>
      <span className="control__label">Locked</span>
    </label>
  ),
};
