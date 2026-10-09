import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ResponsiveSheet } from "./ResponsiveSheet";
import { Button } from "../Button";

const meta: Meta<typeof ResponsiveSheet.Root> = {
  title: "Patterns/Responsive Sheet",
  component: ResponsiveSheet.Root,
  parameters: {
    layout: "centered",
    // Same story, two presentations: bottom sheet at phone width, modal on desktop.
    chromatic: { viewports: [360, 1024] },
  },
  argTypes: { breakpoint: { control: "number" }, dismissable: { control: "boolean" } },
  args: { dismissable: true },
};
export default meta;

type Story = StoryObj<typeof ResponsiveSheet.Root>;

const text = { font: "var(--body-medium)", color: "var(--text-secondary)", margin: 0 };

/** Resize the viewport across 600px (or `breakpoint`) to switch between sheet and modal. */
export const Default: Story = {
  render: (args) => (
    <ResponsiveSheet.Root {...args}>
      <ResponsiveSheet.Trigger render={<Button />}>Confirm transfer</ResponsiveSheet.Trigger>
      <ResponsiveSheet.Popup size="small">
        <ResponsiveSheet.Header>
          <ResponsiveSheet.Title>Confirm transfer</ResponsiveSheet.Title>
          <ResponsiveSheet.Close />
        </ResponsiveSheet.Header>
        <ResponsiveSheet.Body>
          <ResponsiveSheet.Description style={text}>
            You are about to send 1,250 XSGD to John Doe. This action cannot be undone.
          </ResponsiveSheet.Description>
        </ResponsiveSheet.Body>
        <ResponsiveSheet.Footer>
          <ResponsiveSheet.Close render={<Button variant="secondary" />}>
            Cancel
          </ResponsiveSheet.Close>
          <ResponsiveSheet.Close render={<Button variant="primary" />}>
            Confirm
          </ResponsiveSheet.Close>
        </ResponsiveSheet.Footer>
      </ResponsiveSheet.Popup>
    </ResponsiveSheet.Root>
  ),
};

export const Open: Story = { ...Default, args: { defaultOpen: true } };

function FormFields() {
  const [notes, setNotes] = React.useState("");
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <label>
        Reference <input aria-label="Reference" defaultValue="" />
      </label>
      <label>
        Notes{" "}
        <input
          aria-label="Notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
      </label>
    </div>
  );
}

/** Enter both fields, then resize across 600px: values and focus are retained. */
export const FormState: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <ResponsiveSheet.Root {...args}>
      <ResponsiveSheet.Trigger render={<Button />}>Open transfer form</ResponsiveSheet.Trigger>
      <ResponsiveSheet.Popup>
        <ResponsiveSheet.Header>
          <ResponsiveSheet.Title>Transfer form</ResponsiveSheet.Title>
          <ResponsiveSheet.Close />
        </ResponsiveSheet.Header>
        <ResponsiveSheet.Body>
          <FormFields />
        </ResponsiveSheet.Body>
        <ResponsiveSheet.Footer>
          <ResponsiveSheet.Close>Done</ResponsiveSheet.Close>
        </ResponsiveSheet.Footer>
      </ResponsiveSheet.Popup>
    </ResponsiveSheet.Root>
  ),
};
