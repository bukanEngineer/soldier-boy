import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "./Checkbox";
import { renderSmoke, assertPropSpreading } from "../../test-utils";

describe("Checkbox", () => {
  // A: Renderability
  it("renders with no props", () => {
    renderSmoke(Checkbox);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("renders with all optional props", () => {
    render(
      <Checkbox
        label="I agree to terms"
        sub="Read our privacy policy"
        checked
        disabled
        error
        readOnly
      />,
    );
    expect(screen.getByRole("checkbox")).toBeDisabled();
    expect(screen.getByText("I agree to terms")).toBeInTheDocument();
    expect(screen.getByText("Read our privacy policy")).toBeInTheDocument();
  });

  // B: Ergonomics
  it("forwards className to the root label", () => {
    const { container } = render(<Checkbox className="custom" />);
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });

  it("spreads HTML attributes onto the input", () => {
    render(<Checkbox data-testid="cb-spread" />);
    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "data-testid",
      "cb-spread",
    );
  });

  // C: Accessibility
  it("associates label text with the checkbox", () => {
    render(<Checkbox label="Subscribe" id="sub" />);
    const checkbox = screen.getByRole("checkbox", { name: "Subscribe" });
    expect(checkbox).toBeInTheDocument();
  });

  // D: Controlled mode
  it("reflects checked state in controlled mode", () => {
    render(<Checkbox checked readOnly />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("reflects unchecked state in controlled mode", () => {
    render(<Checkbox checked={false} readOnly />);
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  // E: Uncontrolled mode
  it("toggles in uncontrolled mode", async () => {
    render(<Checkbox label="Toggle me" />);
    const cb = screen.getByRole("checkbox", { name: "Toggle me" });
    expect(cb).not.toBeChecked();
    await userEvent.click(cb);
    expect(cb).toBeChecked();
  });

  // F: Interactions
  it("fires onChange when clicked", async () => {
    const onChange = vi.fn();
    render(<Checkbox label="Check" onChange={onChange} />);
    await userEvent.click(screen.getByRole("checkbox", { name: "Check" }));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("does not fire onChange when disabled", async () => {
    const onChange = vi.fn();
    render(<Checkbox label="Check" disabled onChange={onChange} />);
    await userEvent.click(screen.getByRole("checkbox", { name: "Check" }));
    expect(onChange).not.toHaveBeenCalled();
  });

  // G: Indeterminate state
  it("supports indeterminate state", () => {
    const { container } = render(<Checkbox indeterminate />);
    expect(container.querySelector("[data-indeterminate]")).toBeInTheDocument();
  });

  // H: Scalability
  it("renders a large form with many checkboxes", () => {
    const { container } = render(
      <div>
        {Array.from({ length: 100 }, (_, i) => (
          <Checkbox key={i} label={`Option ${i}`} />
        ))}
      </div>,
    );
    expect(container.querySelectorAll("input[type='checkbox']")).toHaveLength(
      100,
    );
  });
});
