import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Radio } from "./Radio";

const meta: Meta = {
  title: "Components/Radio",
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj;

export const Group: Story = {
  render: function Render() {
    const [value, setValue] = useState("personal");
    return (
      <Radio.Group value={value} onValueChange={setValue} aria-label="Account type">
        <label className="control has-sub" htmlFor="radio-personal">
          <Radio.Root id="radio-personal" value="personal">
            <Radio.Indicator />
          </Radio.Root>
          <span className="control__label">
            Personal
            <span className="control__sub">For individuals</span>
          </span>
        </label>
        <label className="control has-sub" htmlFor="radio-business">
          <Radio.Root id="radio-business" value="business">
            <Radio.Indicator />
          </Radio.Root>
          <span className="control__label">
            Business
            <span className="control__sub">For companies</span>
          </span>
        </label>
      </Radio.Group>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <Radio.Group defaultValue="a" disabled aria-label="Locked group">
      <label className="control" htmlFor="radio-a">
        <Radio.Root id="radio-a" value="a">
          <Radio.Indicator />
        </Radio.Root>
        <span className="control__label">Locked A</span>
      </label>
      <label className="control" htmlFor="radio-b">
        <Radio.Root id="radio-b" value="b">
          <Radio.Indicator />
        </Radio.Root>
        <span className="control__label">Locked B</span>
      </label>
    </Radio.Group>
  ),
};
