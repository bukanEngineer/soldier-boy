import React from "react";
import { afterEach, describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResponsiveSheet } from "./ResponsiveSheet";

/** jsdom has no matchMedia: report `min-width: Npx` as matching when `width >= N`. */
function mockViewport(width: number) {
  const listeners = new Set<() => void>();
  let current = width;
  window.matchMedia = ((query: string) => {
    const min = Number(/min-width:\s*(\d+)px/.exec(query)?.[1] ?? 0);
    return {
      get matches() {
        return current >= min;
      },
      media: query,
      addEventListener: (_: string, cb: () => void) => listeners.add(cb),
      removeEventListener: (_: string, cb: () => void) => listeners.delete(cb),
    };
  }) as unknown as typeof window.matchMedia;
  return (next: number) => {
    current = next;
    listeners.forEach((cb) => cb());
  };
}

function Demo(props: Partial<React.ComponentProps<typeof ResponsiveSheet.Root>>) {
  return (
    <ResponsiveSheet.Root {...props}>
      <ResponsiveSheet.Trigger>Open</ResponsiveSheet.Trigger>
      <ResponsiveSheet.Popup data-testid="popup" size="large">
        <ResponsiveSheet.Header>
          <ResponsiveSheet.Title>Send to</ResponsiveSheet.Title>
          <ResponsiveSheet.Close />
        </ResponsiveSheet.Header>
        <ResponsiveSheet.Body>
          <ResponsiveSheet.Description>Choose a method.</ResponsiveSheet.Description>
        </ResponsiveSheet.Body>
        <ResponsiveSheet.Footer>
          <ResponsiveSheet.Close>Done</ResponsiveSheet.Close>
        </ResponsiveSheet.Footer>
      </ResponsiveSheet.Popup>
    </ResponsiveSheet.Root>
  );
}

afterEach(() => {
  // @ts-expect-error restore jsdom default (no matchMedia)
  delete window.matchMedia;
});

describe("ResponsiveSheet", () => {
  it("renders a bottom sheet below the breakpoint", async () => {
    mockViewport(390);
    render(<Demo defaultOpen />);
    const popup = await screen.findByTestId("popup");
    expect(popup).toHaveClass("bsheet");
    expect(popup).toHaveAccessibleName("Send to");
    expect(popup).toHaveAccessibleDescription("Choose a method.");
  });

  it("renders a modal at and above the breakpoint, honoring size", async () => {
    mockViewport(1024);
    render(<Demo defaultOpen />);
    const popup = await screen.findByTestId("popup");
    expect(popup).toHaveClass("modal");
    expect(popup).toHaveAttribute("data-size", "large");
    expect(popup).toHaveAccessibleName("Send to");
  });

  it("supports a custom breakpoint", async () => {
    mockViewport(700);
    render(<Demo defaultOpen breakpoint={800} />);
    expect(await screen.findByTestId("popup")).toHaveClass("bsheet");
  });

  it("opens from the trigger and closes with the close button in both modes", async () => {
    for (const width of [390, 1024]) {
      mockViewport(width);
      const { unmount } = render(<Demo />);
      await userEvent.click(screen.getByRole("button", { name: "Open" }));
      await screen.findByRole("dialog");
      await userEvent.click(screen.getByRole("button", { name: "Done" }));
      await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
      unmount();
    }
  });

  it("honors dismissable={false} in both modes", async () => {
    for (const width of [390, 1024]) {
      mockViewport(width);
      const onOpenChange = vi.fn();
      const { unmount } = render(
        <Demo defaultOpen dismissable={false} onOpenChange={onOpenChange} />,
      );
      await screen.findByRole("dialog");
      await userEvent.keyboard("{Escape}");
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(onOpenChange).not.toHaveBeenCalled();
      unmount();
    }
  });

  it("switches presentation when the viewport crosses the breakpoint", async () => {
    const resize = mockViewport(390);
    render(<Demo open />);
    expect(await screen.findByTestId("popup")).toHaveClass("bsheet");
    resize(1024);
    await waitFor(() => expect(screen.getByTestId("popup")).toHaveClass("modal"));
  });

  it("falls back to the bottom sheet where matchMedia is unavailable", async () => {
    render(<Demo defaultOpen />);
    expect(await screen.findByTestId("popup")).toHaveClass("bsheet");
  });
});

function FormDemo() {
  const [count, setCount] = React.useState(0);
  return (
    <>
      <input aria-label="Uncontrolled note" defaultValue="" />
      <button onClick={() => setCount(count + 1)}>Count {count}</button>
    </>
  );
}

describe("ResponsiveSheet state across resizes", () => {
  it("preserves trigger-open state, DOM values, child state, and focus in both directions", async () => {
    const resize = mockViewport(390);
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <ResponsiveSheet.Root onOpenChange={onOpenChange}>
        <ResponsiveSheet.Trigger>Open form</ResponsiveSheet.Trigger>
        <ResponsiveSheet.Popup data-testid="form-popup">
          <ResponsiveSheet.Title>Form</ResponsiveSheet.Title>
          <ResponsiveSheet.Body>
            <FormDemo />
          </ResponsiveSheet.Body>
        </ResponsiveSheet.Popup>
      </ResponsiveSheet.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Open form" }));
    const input = await screen.findByRole("textbox");
    await user.click(screen.getByRole("button", { name: "Count 0" }));
    await user.type(input, "Keep this note");
    onOpenChange.mockClear();
    for (const [width, className] of [
      [1024, "modal"],
      [390, "bsheet"],
    ] as const) {
      resize(width);
      await waitFor(() => expect(screen.getByTestId("form-popup")).toHaveClass(className));
      expect(screen.getByRole("textbox")).toBe(input);
      expect(input).toHaveValue("Keep this note");
      expect(input).toHaveFocus();
      expect(screen.getByRole("button", { name: "Count 1" })).toBeInTheDocument();
      expect(onOpenChange).not.toHaveBeenCalled();
    }
  });

  it("does not reopen a closed defaultOpen overlay after resize", async () => {
    const resize = mockViewport(390);
    render(<Demo defaultOpen />);
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: "Done" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    resize(1024);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(await screen.findByTestId("popup")).toHaveClass("modal");
  });

  it("disables starting swipes in modal mode and re-enables them in sheet mode", async () => {
    const resize = mockViewport(1024);
    render(<Demo defaultOpen />);
    const popup = await screen.findByTestId("popup");
    expect(popup).toHaveAttribute("data-base-ui-swipe-ignore");
    resize(390);
    await waitFor(() => expect(popup).not.toHaveAttribute("data-base-ui-swipe-ignore"));
  });
});
