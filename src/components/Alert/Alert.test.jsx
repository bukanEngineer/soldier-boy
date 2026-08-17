import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Alert } from "./Alert";
import {
  renderSmoke,
  assertClassNameForwarding,
  assertPropSpreading,
} from "../../test-utils";

describe("Alert", () => {
  // A: Renderability
  it("renders with just children", () => {
    renderSmoke(Alert, { children: "Something happened" });
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Something happened")).toBeInTheDocument();
  });

  it("renders with all optional props", () => {
    render(
      <Alert
        tone="critical"
        title="Error"
        icon="error"
        onDismiss={() => {}}
        actions={<button>Retry</button>}
        actionPlacement="inline"
      >
        Something went wrong.
      </Alert>,
    );
    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  // B: Ergonomics
  it("forwards className", () => {
    assertClassNameForwarding(Alert, { children: "test" });
  });

  it("spreads HTML attributes onto the root div", () => {
    assertPropSpreading(Alert, { children: "test" });
  });

  it("applies tone classes", () => {
    const { container } = render(
      <Alert tone="warning">Warning message</Alert>,
    );
    expect(container.firstChild).toHaveClass("alert--warning");
  });

  it("uses default icon per tone", () => {
    const { container } = render(
      <Alert tone="positive">Success</Alert>,
    );
    const icon = container.querySelector(".alert__icon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("accepts a custom icon as string", () => {
    const { container } = render(
      <Alert icon="star">Custom icon</Alert>,
    );
    const icon = container.querySelector(".alert__icon");
    expect(icon).toBeInTheDocument();
  });

  it("accepts a custom icon as ReactNode", () => {
    render(
      <Alert icon={<svg data-testid="custom-svg" />}>Custom icon</Alert>,
    );
    expect(screen.getByTestId("custom-svg")).toBeInTheDocument();
  });

  // C: Accessibility
  it("has role=alert", () => {
    render(<Alert>Accessible alert</Alert>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("hides the icon from assistive technology", () => {
    const { container } = render(<Alert>Message</Alert>);
    const icon = container.querySelector(".alert__icon");
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("dismiss button has accessible label", () => {
    render(<Alert onDismiss={() => {}}>Dismissible</Alert>);
    expect(
      screen.getByRole("button", { name: "Dismiss" }),
    ).toBeInTheDocument();
  });

  // D: Interactions
  it("fires onDismiss when dismiss button clicked", async () => {
    const onDismiss = vi.fn();
    render(<Alert onDismiss={onDismiss}>Dismiss me</Alert>);
    await userEvent.click(
      screen.getByRole("button", { name: "Dismiss" }),
    );
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("renders actions in bottom placement by default", () => {
    const { container } = render(
      <Alert actions={<button>Action</button>}>With actions</Alert>,
    );
    const content = container.querySelector(".alert__content");
    expect(content).toContainElement(
      screen.getByRole("button", { name: "Action" }),
    );
  });

  // E: Scalability — compose multiple alerts
  it("renders a stack of alerts without crashing", () => {
    const tones = ["positive", "critical", "warning", "info", "neutral"];
    const { container } = render(
      <div>
        {tones.map((tone) => (
          <Alert key={tone} tone={tone} title={tone}>
            {tone} message
          </Alert>
        ))}
      </div>,
    );
    expect(container.querySelectorAll("[role='alert']")).toHaveLength(5);
  });
});
