import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ButtonGroup } from "./ButtonGroup";
import { Button } from "../Button/Button";
import { IconButton } from "../IconButton/IconButton";

const meta: Meta<typeof ButtonGroup> = {
  title: "Atoms/Button Group",
  component: ButtonGroup,
  parameters: { layout: "centered" },
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
  },
  args: { orientation: "horizontal" },
};
export default meta;

type Story = StoryObj<typeof ButtonGroup>;

export const Horizontal: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="secondary">Left</Button>
      <Button variant="secondary">Middle</Button>
      <Button variant="secondary">Right</Button>
    </ButtonGroup>
  ),
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="secondary">Top</Button>
      <Button variant="secondary">Middle</Button>
      <Button variant="secondary">Bottom</Button>
    </ButtonGroup>
  ),
};

export const WithIconButtons: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <IconButton icon="format_align_left" label="Align left" variant="secondary" shape="square" size="sm" />
      <IconButton icon="format_align_center" label="Align center" variant="secondary" shape="square" size="sm" />
      <IconButton icon="format_align_right" label="Align right" variant="secondary" shape="square" size="sm" />
    </ButtonGroup>
  ),
};
