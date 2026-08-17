import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tooltip } from "./Tooltip";
import { renderSmoke } from "../../test-utils";

describe("Tooltip", () => {
  // A: Renderability
  it("renders the trigger children", () => {
    renderSmoke(Tooltip, {
      label: "Helpful tip",
      children: <button>Hover me</button>,
    });
    expect(
      screen.getByRole("button", { name: "Hover me" }),
    ).toBeInTheDocument();
  });

  it("renders nothing extra when no label/content provided", () => {
    const { container } = render(
      <Tooltip>
        <span>Just text</span>
      </Tooltip>,
    );
    // Should render children directly without wrapper
    expect(container.querySelector(".tooltip")).toBeNull();
  });

  it("renders with rich content props", () => {
    render(
      <Tooltip
        title="Title"
        content="Detailed content"
        links={[{ label: "Learn more", onClick: () => {} }]}
      >
        <button>Rich tooltip</button>
      </Tooltip>,
    );
    expect(
      screen.getByRole("button", { name: "Rich tooltip" }),
    ).toBeInTheDocument();
  });

  // B: Ergonomics — tooltip wraps children in a span
  it("wraps children in a tooltip trigger span", () => {
    const { container } = render(
      <Tooltip label="Tip">
        <button>Trigger</button>
      </Tooltip>,
    );
    expect(container.querySelector(".tooltip")).toBeInTheDocument();
  });

  // C: Accessibility
  it("shows tooltip with role=tooltip on hover", async () => {
    render(
      <Tooltip label="Help text">
        <button>Hover</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole("button", { name: "Hover" })
      .closest(".tooltip");
    await userEvent.hover(trigger);
    // The tooltip bubble has role="tooltip"
    expect(await screen.findByRole("tooltip")).toBeInTheDocument();
  });

  it("shows tooltip on focus of child element (bubbles to wrapper)", async () => {
    render(
      <Tooltip label="Focus tip">
        <button>Focus me</button>
      </Tooltip>,
    );
    // Focus the inner button — the focus event bubbles to the tooltip wrapper
    await userEvent.tab();
    expect(await screen.findByRole("tooltip")).toBeInTheDocument();
  });

  it("hides tooltip on mouse leave", async () => {
    render(
      <Tooltip label="Disappear">
        <button>Leave</button>
      </Tooltip>,
    );
    const trigger = screen.getByRole("button", { name: "Leave" })
      .closest(".tooltip");
    await userEvent.hover(trigger);
    expect(await screen.findByRole("tooltip")).toBeInTheDocument();
    await userEvent.unhover(trigger);
    // Wait for the 80ms hide delay
    await new Promise((r) => setTimeout(r, 150));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  // D: Default open state
  it("renders tooltip immediately when defaultOpen is true", () => {
    render(
      <Tooltip label="Already open" defaultOpen>
        <button>Open</button>
      </Tooltip>,
    );
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });
});
