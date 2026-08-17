import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SelectionBox } from "./SelectionBox";
import { renderSmoke, assertPropSpreading } from "../../test-utils";

describe("SelectionBox", () => {
  // A: Renderability
  it("renders with no props", () => {
    renderSmoke(SelectionBox);
  });

  it("renders with label and description", () => {
    render(
      <SelectionBox
        label="Bank Transfer"
        description="1-2 business days"
        name="method"
        value="bank"
      />,
    );
    expect(screen.getByText("Bank Transfer")).toBeInTheDocument();
    expect(screen.getByText("1-2 business days")).toBeInTheDocument();
  });

  // B: Ergonomics
  it("forwards className to the root label", () => {
    const { container } = render(
      <SelectionBox label="Test" className="custom" />,
    );
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });

  it("spreads HTML attributes onto the root", () => {
    assertPropSpreading(SelectionBox, { label: "Test" });
  });

  // C: Radio mode (default)
  it("renders a radio input by default", () => {
    render(<SelectionBox label="Option A" name="group" value="a" />);
    expect(screen.getByRole("radio", { name: /Option A/ })).toBeInTheDocument();
  });

  it("marks radio as checked when selected", () => {
    render(
      <SelectionBox label="Option A" name="group" value="a" selected />,
    );
    expect(screen.getByRole("radio")).toBeChecked();
  });

  // D: Checkbox mode
  it("renders a checkbox when type=check", () => {
    render(
      <SelectionBox type="check" label="Agree" name="terms" value="yes" />,
    );
    expect(
      screen.getByRole("checkbox", { name: /Agree/ }),
    ).toBeInTheDocument();
  });

  // E: Interactions
  it("fires onChange when clicked", async () => {
    const onChange = vi.fn();
    render(
      <SelectionBox
        label="Option"
        name="g"
        value="x"
        onChange={onChange}
      />,
    );
    await userEvent.click(screen.getByText("Option"));
    expect(onChange).toHaveBeenCalled();
  });

  it("does not fire onChange when disabled", async () => {
    const onChange = vi.fn();
    render(
      <SelectionBox
        label="Option"
        name="g"
        value="x"
        disabled
        onChange={onChange}
      />,
    );
    await userEvent.click(screen.getByText("Option"));
    expect(onChange).not.toHaveBeenCalled();
  });

  // F: Scalability — many selection boxes in a group
  it("renders many selection boxes without crashing", () => {
    const { container } = render(
      <div>
        {Array.from({ length: 50 }, (_, i) => (
          <SelectionBox
            key={i}
            label={`Option ${i}`}
            name="big-group"
            value={`v${i}`}
          />
        ))}
      </div>,
    );
    expect(container.querySelectorAll("input[type='radio']")).toHaveLength(50);
  });
});
