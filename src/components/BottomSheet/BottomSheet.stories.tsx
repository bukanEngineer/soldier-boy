import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BottomSheet } from "./BottomSheet";
import { Button } from "../Button";
import { Field } from "../Field/Field";
import { Input } from "../Input";
import { Select } from "../Select";

const meta: Meta<typeof BottomSheet.Root> = {
  title: "P1 Components/Bottom Sheet",
  component: BottomSheet.Root,
  parameters: {
    layout: "centered",
    // Sheets are a phone pattern: Chromatic should capture them at phone width too.
    chromatic: { viewports: [360, 1024] },
  },
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

/** Detents: opens at half height; drag the handle area up for full height, down to dismiss. */
export const SnapPoints: Story = {
  render: (args) => (
    <BottomSheet.Root {...args} snapPoints={[0.5, 1]}>
      <BottomSheet.Trigger render={<Button />}>Open with detents</BottomSheet.Trigger>
      <BottomSheet.Popup>
        <BottomSheet.Header>
          <BottomSheet.Title>Recent recipients</BottomSheet.Title>
          <BottomSheet.Close />
        </BottomSheet.Header>
        <BottomSheet.Body>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Array.from({ length: 14 }, (_, i) => (
              <Button key={i} variant="secondary">
                Recipient {i + 1}
              </Button>
            ))}
          </div>
        </BottomSheet.Body>
      </BottomSheet.Popup>
    </BottomSheet.Root>
  ),
};

/** Long content scrolls inside the body; header and footer stay put. */
export const LongContent: Story = {
  render: (args) => (
    <BottomSheet.Root {...args}>
      <BottomSheet.Trigger render={<Button />}>Open long sheet</BottomSheet.Trigger>
      <BottomSheet.Popup>
        <BottomSheet.Header>
          <BottomSheet.Title>Terms</BottomSheet.Title>
          <BottomSheet.Close />
        </BottomSheet.Header>
        <BottomSheet.Body>
          {Array.from({ length: 12 }, (_, i) => (
            <p key={i} style={{ ...text, marginBottom: 12 }}>
              Section {i + 1}. Transfers settle within one business day. Fees are shown before you
              confirm and are never charged twice.
            </p>
          ))}
        </BottomSheet.Body>
        <BottomSheet.Footer>
          <BottomSheet.Close render={<Button variant="primary" />}>Accept</BottomSheet.Close>
        </BottomSheet.Footer>
      </BottomSheet.Popup>
    </BottomSheet.Root>
  ),
};

/** Form content: the sheet lifts above the on-screen keyboard and the focused field scrolls into view. */
export const WithForm: Story = {
  render: (args) => (
    <BottomSheet.Root {...args}>
      <BottomSheet.Trigger render={<Button />}>Open form</BottomSheet.Trigger>
      <BottomSheet.Popup>
        <BottomSheet.Header>
          <BottomSheet.Title>Add recipient</BottomSheet.Title>
          <BottomSheet.Close />
        </BottomSheet.Header>
        <BottomSheet.Body>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field.Root>
              <Field.Label>Name</Field.Label>
              <Input placeholder="Full name" />
            </Field.Root>
            <Field.Root>
              <Field.Label>Account number</Field.Label>
              <Input inputMode="numeric" placeholder="0000000000" />
            </Field.Root>
            <Field.Root>
              <Field.Label>Reference</Field.Label>
              <Input placeholder="Optional" />
            </Field.Root>
          </div>
        </BottomSheet.Body>
        <BottomSheet.Footer>
          <BottomSheet.Close render={<Button variant="secondary" />}>Cancel</BottomSheet.Close>
          <BottomSheet.Close render={<Button variant="primary" />}>Save</BottomSheet.Close>
        </BottomSheet.Footer>
      </BottomSheet.Popup>
    </BottomSheet.Root>
  ),
};

const currencies = [
  { value: "xsgd", label: "XSGD — Singapore Dollar" },
  { value: "xidr", label: "XIDR — Indonesian Rupiah" },
  { value: "xusd", label: "XUSD — US Dollar" },
];

/** A dropdown opened inside the sheet must render above it (see the `--z-popup` token). */
export const WithDropdown: Story = {
  render: (args) => (
    <BottomSheet.Root {...args}>
      <BottomSheet.Trigger render={<Button />}>Open with dropdown</BottomSheet.Trigger>
      <BottomSheet.Popup>
        <BottomSheet.Header>
          <BottomSheet.Title>Choose currency</BottomSheet.Title>
          <BottomSheet.Close />
        </BottomSheet.Header>
        <BottomSheet.Body>
          <Select.Root items={currencies} defaultValue={null}>
            <Select.Control>
              <Select.Trigger>
                <Select.Value placeholder="Select…" />
                <Select.Icon />
              </Select.Trigger>
            </Select.Control>
            <Select.Popup>
              <Select.List>
                {currencies.map((c) => (
                  <Select.Item key={c.value} value={c.value}>
                    {c.label}
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Root>
        </BottomSheet.Body>
      </BottomSheet.Popup>
    </BottomSheet.Root>
  ),
};
