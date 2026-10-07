import React, { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Toast, ToastProvider, useToast, type ToastTone } from "./Toast";
import { Button } from "../Button/Button";

const meta: Meta<typeof ToastProvider> = {
  title: "P1 Components/Toast",
  component: ToastProvider,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ToastProvider>;

const TONES: ToastTone[] = ["positive", "warning", "critical", "info"];

/* Opens one persistent toast per tone so every variant can be snapshotted. */
function AllTones() {
  const toast = useToast();
  useEffect(() => {
    TONES.forEach((tone) =>
      toast.add({ tone, title: tone, description: "This is a message", timeout: 0 }),
    );
    return () => toast.close();
  }, [toast]);
  return null;
}

export const Tones: Story = {
  render: () => (
    <ToastProvider limit={4}>
      <AllTones />
    </ToastProvider>
  ),
};

function Trigger() {
  const toast = useToast();
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Button
        size="sm"
        onClick={() =>
          toast.add({ tone: "positive", title: "Saved", description: "Your settings have been updated." })
        }
      >
        Show success
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={() =>
          toast.add({ tone: "critical", title: "Transfer failed", description: "Insufficient balance." })
        }
      >
        Show error
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => {
          const id = toast.add({
            tone: "info",
            title: "Address removed",
            description: "Address removed from whitelist.",
            action: { label: "Undo", onClick: () => toast.close(id) },
            dismissible: true,
          });
        }}
      >
        Show with action
      </Button>
    </div>
  );
}

export const WithProvider: Story = {
  render: () => (
    <ToastProvider>
      <Trigger />
    </ToastProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Show success" }));
    // The viewport is portaled to <body>.
    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByText("Your settings have been updated.")).toBeInTheDocument();
  },
};

export const CustomRender: Story = {
  render: () => (
    <ToastProvider
      renderToast={(toast) => (
        <Toast.Root toast={toast}>
          <Toast.Icon>celebration</Toast.Icon>
          <div className="toast__body">
            <Toast.Title />
            <Toast.Description />
          </div>
          <Toast.Close />
        </Toast.Root>
      )}
    >
      <Trigger />
    </ToastProvider>
  ),
};
