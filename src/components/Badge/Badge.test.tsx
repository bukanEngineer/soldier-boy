import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";
import {
  renderSmoke,
  assertClassNameForwarding,
  assertPropSpreading,
} from "../../test-utils";

describe("Badge", () => {
  // A: Renderability
  it("renders with just a number", () => {
    renderSmoke(Badge, { children: 5 });
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders with all optional props and caps numbers above max", () => {
    render(
      <Badge tone="critical" size="lg" max={50}>
        {75}
      </Badge>,
    );
    expect(screen.getByText("50+")).toBeInTheDocument();
  });

  it("renders as a dot badge (no content)", () => {
    const { container } = render(<Badge dot />);
    expect(container.firstChild).toHaveClass("badge--dot");
    expect(container.firstChild.textContent).toBe("");
  });

  // B: Ergonomics
  it("forwards className", () => {
    assertClassNameForwarding(Badge, { children: "3" });
  });

  it("spreads HTML attributes onto the span", () => {
    assertPropSpreading(Badge, { children: "3" });
  });

  it("applies tone classes", () => {
    const { container } = render(<Badge tone="critical">1</Badge>);
    expect(container.firstChild).toHaveClass("badge--critical");
  });

  it("applies size classes", () => {
    const { container } = render(<Badge size="lg">1</Badge>);
    expect(container.firstChild).toHaveClass("badge--lg");
  });

  // C: Max capping behavior
  it("displays count when under max", () => {
    render(<Badge max={99}>{50}</Badge>);
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("displays max+ when count exceeds max", () => {
    render(<Badge max={99}>{150}</Badge>);
    expect(screen.getByText("99+")).toBeInTheDocument();
  });

  it("displays exact count when equal to max", () => {
    render(<Badge max={99}>{99}</Badge>);
    expect(screen.getByText("99")).toBeInTheDocument();
  });

  // D: Badge.Wrap composition
  it("renders Badge.Wrap with children and badge", () => {
    render(
      <Badge.Wrap badge={<Badge tone="critical">3</Badge>}>
        <button>Notifications</button>
      </Badge.Wrap>,
    );
    expect(
      screen.getByRole("button", { name: "Notifications" }),
    ).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  // E: Scalability
  it("renders many badges without crashing", () => {
    const { container } = render(
      <div>
        {Array.from({ length: 200 }, (_, i) => (
          <Badge key={i} tone="info">
            {i}
          </Badge>
        ))}
      </div>,
    );
    expect(container.querySelectorAll(".badge")).toHaveLength(200);
  });
});
