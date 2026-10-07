import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BottomSheet } from "./BottomSheet";
import { Button } from "../Button";

const meta: Meta<typeof BottomSheet.Root> = {
  title: "P1 Components/Bottom Sheet",
  component: BottomSheet.Root,
  parameters: { layout: "centered" },
  argTypes: {
    dismissable: { control: "boolean" },
  },
  args: { dismissable: true },
};
export default meta;

type Story = StoryObj<typeof BottomSheet.Root>;

const text = { font: "var(--body-medium)", color: "var(--text-secondary)", margin: 0 };

export const Default: Story = {
  render: (args) => (
    <BottomSheet.Root {...args}>
      <BottomSheet.Trigger render={<Button />}>Open bottom sheet</BottomSheet.Trigger>
      <BottomSheet.Popup>
        <BottomSheet.Header>
          <BottomSheet.Title>Send to</BottomSheet.Title>
          <BottomSheet.Close />
        </BottomSheet.Header>
        <BottomSheet.Body>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <BottomSheet.Description style={text}>
              Choose how you&apos;d like to send funds.
            </BottomSheet.Description>
            <Button>Bank transfer</Button>
            <Button variant="secondary">Stablecoin wallet</Button>
            <Button variant="tertiary">QR code</Button>
          </div>
        </BottomSheet.Body>
      </BottomSheet.Popup>
    </BottomSheet.Root>
  ),
};

/** Rendered open so the layout is visible without interaction. */
export const Open: Story = { ...Default, args: { defaultOpen: true } };

export const WithFooter: Story = {
  render: (args) => (
    <BottomSheet.Root {...args}>
      <BottomSheet.Trigger render={<Button />}>Open with footer</BottomSheet.Trigger>
      <BottomSheet.Popup>
        <BottomSheet.Header>
          <BottomSheet.Title>Confirm transfer</BottomSheet.Title>
          <BottomSheet.Close />
        </BottomSheet.Header>
        <BottomSheet.Body>
          <p style={text}>
            You are about to send 1,250 XSGD to John Doe. This action cannot be undone.
          </p>
        </BottomSheet.Body>
        <BottomSheet.Footer>
          <BottomSheet.Close render={<Button variant="secondary" />}>Cancel</BottomSheet.Close>
          <BottomSheet.Close render={<Button variant="primary" />}>Confirm</BottomSheet.Close>
        </BottomSheet.Footer>
      </BottomSheet.Popup>
    </BottomSheet.Root>
  ),
};

/** No header close button: leave out `<BottomSheet.Close />`. */
export const WithoutClose: Story = {
  render: (args) => (
    <BottomSheet.Root {...args}>
      <BottomSheet.Trigger render={<Button />}>Open without close</BottomSheet.Trigger>
      <BottomSheet.Popup>
        <BottomSheet.Header>
          <BottomSheet.Title>Select an option</BottomSheet.Title>
        </BottomSheet.Header>
        <BottomSheet.Body>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Button variant="secondary">Bank transfer</Button>
            <Button variant="secondary">Stablecoin wallet</Button>
          </div>
        </BottomSheet.Body>
        <BottomSheet.Footer>
          <BottomSheet.Close render={<Button variant="primary" />}>Done</BottomSheet.Close>
        </BottomSheet.Footer>
      </BottomSheet.Popup>
    </BottomSheet.Root>
  ),
};

/** `dismissable={false}`: backdrop clicks, Escape and swipe are ignored. */
export const NonDismissable: Story = { ...WithoutClose, args: { dismissable: false } };

/** Controlled: `open` + `onOpenChange`. */
export const Controlled: Story = {
  render: function Render(args) {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open controlled sheet</Button>
        <BottomSheet.Root {...args} open={open} onOpenChange={setOpen}>
          <BottomSheet.Popup>
            <BottomSheet.Header>
              <BottomSheet.Title>Controlled</BottomSheet.Title>
              <BottomSheet.Close />
            </BottomSheet.Header>
            <BottomSheet.Body>
              <p style={text}>Open state lives in the parent.</p>
            </BottomSheet.Body>
            <BottomSheet.Footer>
              <Button onClick={() => setOpen(false)}>Done</Button>
            </BottomSheet.Footer>
          </BottomSheet.Popup>
        </BottomSheet.Root>
      </>
    );
  },
};
