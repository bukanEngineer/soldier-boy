import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ButtonGroup } from "./ButtonGroup";
import { Button } from "../Button/Button";

const meta: Meta<typeof ButtonGroup> = {
  title: "Atoms/Button Group",
  component: ButtonGroup,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ButtonGroup>;

export const SecondaryPrimary: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="secondary">Cancel</Button>
      <Button variant="primary">Confirm</Button>
    </ButtonGroup>
  ),
};

export const TertiarySecondary: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="tertiary">Skip</Button>
      <Button variant="secondary">Back</Button>
    </ButtonGroup>
  ),
};

/** Children passed in the wrong order are still rendered least to most prominent. */
export const OrderedByHierarchy: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="primary">Confirm</Button>
      <Button variant="secondary">Cancel</Button>
    </ButtonGroup>
  ),
};

export const Medium: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="secondary" size="md">Cancel</Button>
      <Button variant="primary" size="md">Confirm</Button>
    </ButtonGroup>
  ),
};

export const Small: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="secondary" size="sm">Cancel</Button>
      <Button variant="primary" size="sm">Confirm</Button>
    </ButtonGroup>
  ),
};
