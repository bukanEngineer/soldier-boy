import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HorizontalSteps, VerticalSteps, BadgeSteps } from "./Steps";
import { renderSmoke, assertPropSpreading } from "../../test-utils";

describe("HorizontalSteps", () => {
  // A: Renderability
  it("renders with no props", () => {
    renderSmoke(HorizontalSteps);
  });

  it("renders with total and current", () => {
    const { container } = render(
      <HorizontalSteps total={5} current={3} />,
    );
    expect(container.querySelector(".h-steps")).toBeInTheDocument();
  });

  // B: Ergonomics
  it("forwards className", () => {
    const { container } = render(
      <HorizontalSteps total={3} current={1} className="custom" />,
    );
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });

  it("spreads HTML attributes", () => {
    assertPropSpreading(HorizontalSteps, { total: 3, current: 1 });
  });

  // C: Accessibility
  it("has progressbar role", () => {
    render(<HorizontalSteps total={5} current={2} />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toBeInTheDocument();
  });

  it("has correct aria-valuemin, aria-valuemax, aria-valuenow", () => {
    render(<HorizontalSteps total={5} current={3} />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuemin", "0");
    expect(progressbar).toHaveAttribute("aria-valuemax", "5");
    expect(progressbar).toHaveAttribute("aria-valuenow", "3");
  });

  // D: Shows count label
  it("shows step count when showCount is true", () => {
    render(<HorizontalSteps total={5} current={3} showCount />);
    expect(screen.getByText(/3\/5/)).toBeInTheDocument();
  });

  // E: Edge cases — clamping
  it("clamps total to minimum of 2", () => {
    const { container } = render(<HorizontalSteps total={1} current={1} />);
    const segments = container.querySelectorAll(".h-steps__segment");
    expect(segments).toHaveLength(2);
  });

  it("clamps total to maximum of 7", () => {
    const { container } = render(<HorizontalSteps total={10} current={1} />);
    const segments = container.querySelectorAll(".h-steps__segment");
    expect(segments).toHaveLength(7);
  });

  it("handles current greater than total gracefully", () => {
    const { container } = render(<HorizontalSteps total={3} current={5} />);
    const filled = container.querySelectorAll(".h-steps__segment.is-filled");
    // All segments should be filled since current exceeds total
    expect(filled).toHaveLength(3);
  });

  it("handles current of 0 with no filled segments", () => {
    const { container } = render(<HorizontalSteps total={4} current={0} />);
    const filled = container.querySelectorAll(".h-steps__segment.is-filled");
    expect(filled).toHaveLength(0);
  });
});

describe("VerticalSteps", () => {
  const items = [
    { status: "completed", title: "Order placed", timestamp: "10:00 AM" },
    { status: "completed", title: "Payment confirmed", timestamp: "10:05 AM" },
    { status: "inactive", title: "Shipped", timestamp: "" },
  ];

  // A: Renderability
  it("renders with no props", () => {
    renderSmoke(VerticalSteps);
  });

  it("renders with items", () => {
    render(<VerticalSteps items={items} />);
    expect(screen.getByText("Order placed")).toBeInTheDocument();
    expect(screen.getByText("Payment confirmed")).toBeInTheDocument();
    expect(screen.getByText("Shipped")).toBeInTheDocument();
  });

  // B: Ergonomics
  it("forwards className", () => {
    const { container } = render(
      <VerticalSteps items={items} className="custom" />,
    );
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });

  it("spreads HTML attributes", () => {
    assertPropSpreading(VerticalSteps, { items });
  });

  it("renders as an ordered list", () => {
    const { container } = render(<VerticalSteps items={items} />);
    expect(container.firstChild.tagName).toBe("OL");
  });

  // C: Scalability
  it("renders many steps without crashing", () => {
    const manyItems = Array.from({ length: 50 }, (_, i) => ({
      status: i < 25 ? "completed" : "inactive",
      title: `Step ${i}`,
      timestamp: `${i}:00`,
    }));
    render(<VerticalSteps items={manyItems} />);
    expect(screen.getByText("Step 0")).toBeInTheDocument();
    expect(screen.getByText("Step 49")).toBeInTheDocument();
  });

  // D: Failed state handling
  it("auto-generates 'Failed' note when failed item has no note", () => {
    const failedItems = [
      { status: "failed", title: "Verification Failed", timestamp: "10:00 AM" },
    ];
    render(<VerticalSteps items={failedItems} />);
    expect(screen.getByText("Failed")).toBeInTheDocument();
  });

  it("uses provided note for failed items", () => {
    const failedItems = [
      { status: "failed", title: "Verification Failed", timestamp: "10:00 AM", note: "Document was unreadable" },
    ];
    render(<VerticalSteps items={failedItems} />);
    expect(screen.getByText("Document was unreadable")).toBeInTheDocument();
  });

  it("renders all-failed items without crashing", () => {
    const allFailed = [
      { status: "failed", title: "Step 1", timestamp: "10:00", note: "Error A" },
      { status: "failed", title: "Step 2", timestamp: "11:00", note: "Error B" },
      { status: "failed", title: "Step 3", timestamp: "12:00" },
    ];
    render(<VerticalSteps items={allFailed} />);
    expect(screen.getByText("Step 1")).toBeInTheDocument();
    expect(screen.getByText("Step 3")).toBeInTheDocument();
    expect(screen.getByText("Failed")).toBeInTheDocument();
  });

  // E: Connector coloring
  it("applies is-done class to connector after completed step", () => {
    const { container } = render(<VerticalSteps items={items} />);
    const doneConnectors = container.querySelectorAll(".v-steps__connector.is-done");
    // First item (completed) should have a done bottom connector
    // Second item (completed) should have a done top connector (prev is completed) and done bottom connector
    expect(doneConnectors.length).toBeGreaterThan(0);
  });
});

describe("BadgeSteps", () => {
  // A: Renderability
  it("renders with no props", () => {
    renderSmoke(BadgeSteps);
  });

  it("renders with step, title, and description", () => {
    render(
      <BadgeSteps step={2} title="Verify identity" description="Upload your ID" />,
    );
    expect(screen.getByText("Verify identity")).toBeInTheDocument();
    expect(screen.getByText("Upload your ID")).toBeInTheDocument();
  });

  // B: Ergonomics
  it("forwards className", () => {
    const { container } = render(<BadgeSteps className="custom" />);
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });

  it("spreads HTML attributes", () => {
    assertPropSpreading(BadgeSteps);
  });

  // C: Displays step number
  it("displays the step number in the badge", () => {
    render(<BadgeSteps step={5} title="Final step" />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders without title and description", () => {
    const { container } = render(<BadgeSteps step={1} />);
    expect(container.querySelector(".badge-steps__title")).not.toBeInTheDocument();
    expect(container.querySelector(".badge-steps__description")).not.toBeInTheDocument();
  });
});
