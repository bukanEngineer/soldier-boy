import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DateInput } from "./DateInput";
import { renderSmoke } from "../../test-utils";

describe("DateInput", () => {
  // A: Renderability
  it("renders with no props", () => {
    renderSmoke(DateInput);
  });

  it("renders with all optional props", () => {
    render(
      <DateInput
        label="Start date"
        helper="Choose a date"
        error="Invalid date"
        size="small"
        placeholder="DD/MM/YYYY"
        disabled
      />,
    );
    expect(screen.getByText("Start date")).toBeInTheDocument();
    expect(screen.getByText("Invalid date")).toBeInTheDocument();
  });

  // B: Ergonomics
  it("forwards className to the trigger button", () => {
    const { container } = render(<DateInput className="custom-date" />);
    expect(container.querySelector(".custom-date")).toBeInTheDocument();
  });

  it("shows placeholder text", () => {
    render(<DateInput placeholder="Select date" />);
    expect(screen.getByText("Select date")).toBeInTheDocument();
  });

  // C: Accessibility
  it("trigger has aria-haspopup=dialog", () => {
    const { container } = render(<DateInput />);
    const trigger = container.querySelector("[aria-haspopup='dialog']");
    expect(trigger).toBeInTheDocument();
  });

  it("trigger has aria-expanded=false when closed", () => {
    const { container } = render(<DateInput />);
    const trigger = container.querySelector("[aria-haspopup='dialog']");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  // D: Controlled mode
  it("displays the controlled value", () => {
    render(<DateInput value="2024-01-15" />);
    expect(screen.getByText("15 January 2024")).toBeInTheDocument();
  });

  // E: Interactions
  it("opens calendar popover on click", async () => {
    const { container } = render(<DateInput />);
    const trigger = container.querySelector("[aria-haspopup='dialog']");
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("does not open when disabled", async () => {
    const { container } = render(<DateInput disabled />);
    const trigger = container.querySelector("[aria-haspopup='dialog']");
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  // F: Range mode
  it("renders in range mode", () => {
    render(<DateInput range placeholder="Start - End" />);
    expect(screen.getByText("Start - End")).toBeInTheDocument();
  });
});
