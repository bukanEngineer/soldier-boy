import React, { useEffect } from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Toast,
  ToastProvider,
  useToast,
  useOptionalToast,
  type ToastApi,
  type ToastProviderProps,
} from "./Toast";

/* Captures the toast API so tests can call it directly. */
const apiRef: { current: ToastApi | null } = { current: null };

function Capture() {
  const toast = useToast();
  useEffect(() => {
    apiRef.current = toast;
  }, [toast]);
  return null;
}

function setup(props: Partial<ToastProviderProps> = {}) {
  return render(
    <ToastProvider {...props}>
      <Capture />
      <button type="button">Outside</button>
    </ToastProvider>,
  );
}

const add = (options: Parameters<ToastApi["add"]>[0]) => {
  let id = "";
  act(() => {
    id = apiRef.current!.add(options);
  });
  return id;
};

afterEach(() => {
  vi.useRealTimers();
  apiRef.current = null;
});

describe("ToastProvider + useToast", () => {
  it("renders children and a Notifications region", () => {
    setup();
    expect(screen.getByRole("button", { name: "Outside" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Notifications" })).toBeInTheDocument();
  });

  it("throws when useToast is used outside the provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Capture />)).toThrow(/ToastProvider/);
    spy.mockRestore();
  });

  it("useOptionalToast returns null outside the provider", async () => {
    const valueRef: { current: ToastApi | null | undefined } = { current: undefined };
    function Probe() {
      const value = useOptionalToast();
      useEffect(() => {
        valueRef.current = value;
      }, [value]);
      return null;
    }
    render(<Probe />);
    await waitFor(() => expect(valueRef.current).toBeNull());
  });

  it("shows a toast with title and description", async () => {
    setup();
    add({ title: "Saved", description: "Your settings have been updated." });
    expect(await screen.findByText("Your settings have been updated.")).toBeInTheDocument();
    const toast = screen.getByRole("dialog");
    expect(toast).toHaveAccessibleName("Saved");
    expect(toast).toHaveAccessibleDescription("Your settings have been updated.");
  });

  it("defaults to the positive tone and exposes tone as data-type", async () => {
    setup();
    add({ description: "Done" });
    const toast = await screen.findByRole("dialog");
    expect(toast).toHaveAttribute("data-type", "positive");
    expect(toast).toHaveClass("toast");
    expect(toast.querySelector(".toast__icon")).toHaveTextContent("check_circle");
    expect(toast.querySelector(".toast__icon")).toHaveAttribute("aria-hidden", "true");
  });

  it.each([
    ["warning", "warning"],
    ["info", "info"],
  ] as const)("renders the %s tone", async (tone, icon) => {
    setup();
    add({ tone, description: "Msg" });
    const toast = await screen.findByRole("dialog");
    expect(toast).toHaveAttribute("data-type", tone);
    expect(toast.querySelector(".toast__icon")).toHaveTextContent(icon);
  });

  it("announces critical toasts assertively", async () => {
    setup();
    add({ tone: "critical", title: "Error", description: "Something failed." });
    expect(await screen.findByRole("alert")).toHaveTextContent("Something failed.");
  });

  it("shows only the latest toast by default", async () => {
    setup();
    add({ description: "Toast 1" });
    add({ description: "Toast 2" });
    add({ description: "Toast 3" });
    await screen.findByText("Toast 3");
    const visible = screen.getAllByRole("dialog").filter((el) => !el.hasAttribute("data-limited"));
    expect(visible).toHaveLength(1);
    expect(visible[0]).toHaveTextContent("Toast 3");
  });

  it("renders an action button that runs its handler", async () => {
    const onClick = vi.fn();
    setup();
    add({ description: "Removed", action: { label: "Undo", onClick } });
    await userEvent.click(await screen.findByRole("button", { name: "Undo" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders a close button when dismissible and closes on click", async () => {
    setup();
    add({ description: "Closable", dismissible: true });
    // Base UI hides Close from assistive tech until the viewport is focused (F6) or hovered.
    await userEvent.click(await screen.findByLabelText("Dismiss"));
    await waitFor(() => expect(screen.queryByText("Closable")).not.toBeInTheDocument());
  });

  it("has no close button unless dismissible", async () => {
    setup();
    add({ description: "Plain" });
    await screen.findByText("Plain");
    expect(screen.queryByLabelText("Dismiss")).not.toBeInTheDocument();
  });

  it("updates and closes a toast by id", async () => {
    setup();
    const id = add({ description: "Uploading" });
    act(() => apiRef.current!.update(id, { description: "Uploaded", tone: "positive" }));
    expect(await screen.findByText("Uploaded")).toBeInTheDocument();
    act(() => apiRef.current!.close(id));
    await waitFor(() => expect(screen.queryByText("Uploaded")).not.toBeInTheDocument());
  });

  it("auto-dismisses after the clamped duration", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const onClose = vi.fn();
    setup();
    // Below the 3s minimum, so it is clamped up to 3000ms.
    add({ description: "Brief", timeout: 500, onClose });
    await screen.findByText("Brief");
    act(() => vi.advanceTimersByTime(1000));
    expect(onClose).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(2500));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes the focused toast with Escape", async () => {
    setup();
    add({ description: "Esc me", timeout: 0 });
    const toast = await screen.findByRole("dialog");
    act(() => toast.focus());
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByText("Esc me")).not.toBeInTheDocument());
  });

  it("merges viewport className and spreads viewport props", () => {
    setup({ viewportProps: { className: "custom", "data-testid": "vp" } as never });
    const viewport = screen.getByTestId("vp");
    expect(viewport).toHaveClass("toast-region", "custom");
  });

  it("supports a custom renderer built from Toast parts", async () => {
    setup({
      renderToast: (toast) => (
        <Toast.Root toast={toast} className="mine" data-testid="custom">
          <Toast.Icon>bolt</Toast.Icon>
          <Toast.Description />
          <Toast.Close />
        </Toast.Root>
      ),
    });
    add({ description: "Custom" });
    const root = await screen.findByTestId("custom");
    expect(root).toHaveClass("toast", "mine");
    expect(root).toHaveTextContent("bolt");
    expect(screen.getByLabelText("Dismiss")).toBeInTheDocument();
  });
});
