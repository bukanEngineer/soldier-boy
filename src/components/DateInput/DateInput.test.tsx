import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DateInput } from "./DateInput";
import { Field } from "../Field/Field";
import { renderSmoke } from "../../test-utils";

describe("DateInput", () => {
  it("renders with no props", () => {
    renderSmoke(DateInput);
  });

  it("renders with Field label and error", () => {
    render(
      <Field.Root invalid>
        <Field.Label>Start date</Field.Label>
        <DateInput size="small" placeholder="DD/MM/YYYY" disabled />
        <Field.Error match>Invalid date</Field.Error>
      </Field.Root>,
    );
    expect(screen.getByText("Start date")).toBeInTheDocument();
    expect(screen.getByText("Invalid date")).toBeInTheDocument();
  });

  it("forwards className to the trigger button", () => {
    const { container } = render(<DateInput className="custom-date" />);
    expect(container.querySelector(".custom-date")).toBeInTheDocument();
  });

  it("shows placeholder text", () => {
    render(<DateInput placeholder="Select date" />);
    expect(screen.getByText("Select date")).toBeInTheDocument();
  });

  it("trigger has aria-haspopup", () => {
    const { container } = render(<DateInput />);
    const trigger = container.querySelector("[aria-haspopup]");
    expect(trigger).toBeInTheDocument();
  });

  it("trigger has aria-expanded=false when closed", () => {
    const { container } = render(<DateInput />);
    const trigger = container.querySelector("[aria-haspopup]");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("displays the controlled value", () => {
    render(<DateInput value="2024-01-15" />);
    expect(screen.getByText("15 January 2024")).toBeInTheDocument();
  });

  it("opens calendar popover on click", async () => {
    const { container } = render(<DateInput />);
    const trigger = container.querySelector("[aria-haspopup]");
    await userEvent.click(trigger!);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("does not open when disabled", async () => {
    const { container } = render(<DateInput disabled />);
    const trigger = container.querySelector("[aria-haspopup]");
    await userEvent.click(trigger!);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("renders in range mode", () => {
    render(<DateInput range placeholder="Start - End" />);
    expect(screen.getByText("Start - End")).toBeInTheDocument();
  });
});
