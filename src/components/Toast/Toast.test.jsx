import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toast, ToastProvider, useToast } from "./Toast";
import { renderSmoke } from "../../test-utils";

describe("Toast", () => {
  // A: Renderability
  it("renders with no props", () => {
    renderSmoke(Toast);
  });

  it("renders with title and children", () => {
    render(<Toast title="Success" tone="positive">Item saved.</Toast>);
    expect(screen.getByText("Success")).toBeInTheDocument();
    expect(screen.getByText("Item saved.")).toBeInTheDocument();
  });

  it("renders with all optional props", () => {
    render(
      <Toast tone="critical" title="Error" onDismiss={() => {}}>
        Something failed.
      </Toast>,
    );
    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("Something failed.")).toBeInTheDocument();
  });

  // B: Ergonomics
  it("forwards className", () => {
    const { container } = render(
      <Toast title="Test" className="custom">
        Body
      </Toast>,
    );
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });

  it("spreads HTML attributes onto the root", () => {
    render(
      <Toast title="T" data-testid="spread-check">
        Body
      </Toast>,
    );
    expect(screen.getByTestId("spread-check")).toBeInTheDocument();
  });

  it("applies tone class", () => {
    const { container } = render(
      <Toast tone="critical" title="Error">
        Msg
      </Toast>,
    );
    expect(container.querySelector(".toast--critical")).toBeInTheDocument();
  });

  // C: Accessibility
  it("has role=status", () => {
    render(<Toast title="Done">Success</Toast>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("uses role=alert for critical tone", () => {
    render(<Toast tone="critical" title="Error">Something failed.</Toast>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("dismiss button has accessible label", () => {
    render(
      <Toast title="Info" onDismiss={() => {}}>
        Message
      </Toast>,
    );
    expect(
      screen.getByRole("button", { name: "Dismiss" }),
    ).toBeInTheDocument();
  });

  // D: Interactions
  it("fires onDismiss when dismiss button clicked", async () => {
    const onDismiss = vi.fn();
    render(
      <Toast title="Info" onDismiss={onDismiss}>
        Message
      </Toast>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});

describe("ToastProvider + useToast", () => {
  function TestConsumer() {
    const { show } = useToast();
    return (
      <button onClick={() => show({ title: "Toast!", tone: "info" })}>
        Show Toast
      </button>
    );
  }

  it("renders provider without crashing", () => {
    render(
      <ToastProvider>
        <div>App</div>
      </ToastProvider>,
    );
    expect(screen.getByText("App")).toBeInTheDocument();
  });

  it("shows a toast via useToast hook", async () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Show Toast" }));
    expect(screen.getByText("Toast!")).toBeInTheDocument();
  });

  it("renders toast region with correct role", () => {
    render(
      <ToastProvider>
        <div>App</div>
      </ToastProvider>,
    );
    expect(
      screen.getByRole("region", { name: "Notifications" }),
    ).toBeInTheDocument();
  });

  // Scalability: multiple toasts fired in sequence
  it("shows the latest toast when triggered multiple times", async () => {
    function MultiConsumer() {
      const { show } = useToast();
      return (
        <>
          <button onClick={() => show({ title: "Toast 1" })}>Show 1</button>
          <button onClick={() => show({ title: "Toast 2" })}>Show 2</button>
          <button onClick={() => show({ title: "Toast 3" })}>Show 3</button>
        </>
      );
    }
    render(
      <ToastProvider>
        <MultiConsumer />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Show 1" }));
    await userEvent.click(screen.getByRole("button", { name: "Show 2" }));
    await userEvent.click(screen.getByRole("button", { name: "Show 3" }));
    // At minimum the most recent toast should be visible
    expect(screen.getByText("Toast 3")).toBeInTheDocument();
  });
});
