import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./Checkbox";

const meta: Meta = {
  title: "Components/Checkbox",
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <label className="control" htmlFor="cb-default">
      <Checkbox.Root id="cb-default" defaultChecked>
        <Checkbox.Indicator />
      </Checkbox.Root>
      <span className="control__label">Accept terms</span>
    </label>
  ),
};

export const WithSub: Story = {
  render: () => (
    <label className="control has-sub" htmlFor="cb-sub">
      <Checkbox.Root id="cb-sub">
        <Checkbox.Indicator />
      </Checkbox.Root>
      <span className="control__label">
        Marketing emails
        <span className="control__sub">Product updates and announcements</span>
      </span>
    </label>
  ),
};

export const Indeterminate: Story = {
  render: () => (
    <label className="control" htmlFor="cb-ind">
      <Checkbox.Root id="cb-ind" indeterminate>
        <Checkbox.Indicator />
      </Checkbox.Root>
      <span className="control__label">Select all</span>
    </label>
  ),
};

export const Disabled: Story = {
  render: () => (
    <label className="control" htmlFor="cb-dis">
      <Checkbox.Root id="cb-dis" disabled checked>
        <Checkbox.Indicator />
      </Checkbox.Root>
      <span className="control__label">Locked</span>
    </label>
  ),
};

export const Group: Story = {
  render: function Render() {
    const [value, setValue] = useState(["xsgd"]);
    return (
      <Checkbox.Group value={value} onValueChange={setValue} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {["xsgd", "xidr", "xusd"].map((v) => (
          <label key={v} className="control" htmlFor={`cb-${v}`}>
            <Checkbox.Root id={`cb-${v}`} value={v}>
              <Checkbox.Indicator />
            </Checkbox.Root>
            <span className="control__label">{v.toUpperCase()}</span>
          </label>
        ))}
      </Checkbox.Group>
    );
  },
};
