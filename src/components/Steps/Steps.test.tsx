import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  HorizontalSteps,
  VerticalSteps,
  VerticalStep,
  BadgeSteps,
} from "./Steps";
import { renderSmoke, assertPropSpreading } from "../../test-utils";

describe("HorizontalSteps", () => {
  it("renders with no props", () => {
    renderSmoke(HorizontalSteps);
  });

  it("renders with total and current", () => {
    const { container } = render(<HorizontalSteps total={5} current={3} />);
    expect(container.querySelector(".h-steps")).toBeInTheDocument();
  });

  it("forwards className", () => {
    const { container } = render(
      <HorizontalSteps total={3} current={1} className="custom" />,
    );
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });

  it("spreads HTML attributes", () => {
    assertPropSpreading(HorizontalSteps, { total: 3, current: 1 });
  });

  it("has progressbar role", () => {
    render(<HorizontalSteps total={5} current={2} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("has correct aria-valuemin, aria-valuemax, aria-valuenow", () => {
    render(<HorizontalSteps total={5} current={3} />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuemin", "0");
    expect(progressbar).toHaveAttribute("aria-valuemax", "5");
    expect(progressbar).toHaveAttribute("aria-valuenow", "3");
  });

  it("shows step count when showCount is true", () => {
    render(<HorizontalSteps total={5} current={3} showCount />);
    expect(screen.getByText(/3\/5/)).toBeInTheDocument();
  });

  it("clamps total to minimum of 2", () => {
    const { container } = render(<HorizontalSteps total={1} current={1} />);
    expect(container.querySelectorAll(".h-steps__segment")).toHaveLength(2);
  });

  it("clamps total to maximum of 7", () => {
    const { container } = render(<HorizontalSteps total={10} current={1} />);
    expect(container.querySelectorAll(".h-steps__segment")).toHaveLength(7);
  });

  it("handles current greater than total gracefully", () => {
    const { container } = render(<HorizontalSteps total={3} current={5} />);
    expect(container.querySelectorAll(".h-steps__segment[data-filled]")).toHaveLength(3);
  });

  it("handles current of 0 with no filled segments", () => {
    const { container } = render(<HorizontalSteps total={4} current={0} />);
    expect(container.querySelectorAll(".h-steps__segment[data-filled]")).toHaveLength(0);
  });
});

describe("VerticalSteps", () => {
  const timeline = (
    <VerticalSteps>
      <VerticalStep status="completed" timestamp="10:00 AM">
        Order placed
      </VerticalStep>
      <VerticalStep status="completed" timestamp="10:05 AM">
        Payment confirmed
      </VerticalStep>
      <VerticalStep status="inactive">Shipped</VerticalStep>
    </VerticalSteps>
  );

  it("renders with no props", () => {
    renderSmoke(VerticalSteps);
  });

  it("renders composed steps", () => {
    render(timeline);
    expect(screen.getByText("Order placed")).toBeInTheDocument();
    expect(screen.getByText("Payment confirmed")).toBeInTheDocument();
    expect(screen.getByText("Shipped")).toBeInTheDocument();
  });

  it("forwards className", () => {
    const { container } = render(
      <VerticalSteps className="custom">
        <VerticalStep status="completed">One</VerticalStep>
      </VerticalSteps>,
    );
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });

  it("spreads HTML attributes", () => {
    assertPropSpreading(VerticalSteps);
  });

  it("renders as an ordered list", () => {
    const { container } = render(timeline);
    expect(container.firstChild?.nodeName).toBe("OL");
  });

  it("renders many steps without crashing", () => {
    render(
      <VerticalSteps>
        {Array.from({ length: 50 }, (_, i) => (
          <VerticalStep
            key={i}
            status={i < 25 ? "completed" : "inactive"}
            timestamp={`${i}:00`}
          >
            Step {i}
          </VerticalStep>
        ))}
      </VerticalSteps>,
    );
    expect(screen.getByText("Step 0")).toBeInTheDocument();
    expect(screen.getByText("Step 49")).toBeInTheDocument();
  });

  it("auto-generates Failed note when failed item has no note", () => {
    render(
      <VerticalSteps>
        <VerticalStep status="failed" timestamp="10:00 AM">
          Verification Failed
        </VerticalStep>
      </VerticalSteps>,
    );
    expect(screen.getByText("Failed")).toBeInTheDocument();
  });

  it("uses provided note for failed items", () => {
    render(
      <VerticalSteps>
        <VerticalStep
          status="failed"
          timestamp="10:00 AM"
          note="Document was unreadable"
        >
          Verification Failed
        </VerticalStep>
      </VerticalSteps>,
    );
    expect(screen.getByText("Document was unreadable")).toBeInTheDocument();
  });

  it("renders all-failed items without crashing", () => {
    render(
      <VerticalSteps>
        <VerticalStep status="failed" timestamp="10:00" note="Error A">
          Step 1
        </VerticalStep>
        <VerticalStep status="failed" timestamp="11:00" note="Error B">
          Step 2
        </VerticalStep>
        <VerticalStep status="failed" timestamp="12:00">
          Step 3
        </VerticalStep>
      </VerticalSteps>,
    );
    expect(screen.getByText("Step 1")).toBeInTheDocument();
    expect(screen.getByText("Step 3")).toBeInTheDocument();
    expect(screen.getByText("Failed")).toBeInTheDocument();
  });

  it("marks completed connectors via data-status sibling CSS", () => {
    const { container } = render(timeline);
    const doneAfter = container.querySelectorAll(
      '.v-steps__item[data-status="completed"] .v-steps__connector[data-edge="after"]',
    );
    expect(doneAfter.length).toBeGreaterThan(0);
  });
});

describe("BadgeSteps", () => {
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

  it("forwards className", () => {
    const { container } = render(<BadgeSteps className="custom" />);
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });

  it("spreads HTML attributes", () => {
    assertPropSpreading(BadgeSteps);
  });

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
