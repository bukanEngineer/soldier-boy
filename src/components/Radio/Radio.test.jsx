import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Radio, RadioGroup } from "./Radio";
import { renderSmoke } from "../../test-utils";

describe("Radio", () => {
  // A: Renderability
  it("renders with minimal props", () => {
    render(<Radio label="Option A" name="test" value="a" />);
    expect(screen.getByRole("radio", { name: "Option A" })).toBeInTheDocument();
  });

  it("renders with all optional props", () => {
    render(
      <Radio
        label="Option B"
        sub="Description"
        name="test"
        value="b"
        checked
        disabled
        error
        readOnly
      />,
    );
    // Accessible name includes sub text since label wraps both
    expect(screen.getByRole("radio", { name: /Option B/ })).toBeDisabled();
    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  // B: Ergonomics
  it("forwards className to the root label", () => {
    const { container } = render(
      <Radio label="A" name="t" value="a" className="custom" />,
    );
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });

  it("spreads HTML attributes onto the input", () => {
    render(<Radio label="A" name="t" value="a" data-testid="radio-spread" />);
    expect(screen.getByRole("radio", { name: "A" })).toHaveAttribute(
      "data-testid",
      "radio-spread",
    );
  });

  // C: Accessibility
  it("associates label with radio input", () => {
    render(<Radio label="Cats" name="pet" value="cats" id="cats" />);
    const radio = screen.getByRole("radio", { name: "Cats" });
    expect(radio).toHaveAttribute("id", "cats");
  });

  // D: Interactions
  it("fires onChange when selected", async () => {
    const onChange = vi.fn();
    render(<Radio label="A" name="t" value="a" onChange={onChange} />);
    await userEvent.click(screen.getByRole("radio", { name: "A" }));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("does not fire onChange when disabled", async () => {
    const onChange = vi.fn();
    render(
      <Radio label="A" name="t" value="a" disabled onChange={onChange} />,
    );
    await userEvent.click(screen.getByRole("radio", { name: "A" }));
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("RadioGroup", () => {
  const options = [
    { value: "a", label: "Alpha" },
    { value: "b", label: "Beta" },
    { value: "c", label: "Gamma" },
  ];

  // A: Renderability
  it("renders with required name and options", () => {
    render(<RadioGroup name="group" options={options} />);
    expect(screen.getByRole("radio", { name: "Alpha" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Beta" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Gamma" })).toBeInTheDocument();
  });

  it("renders with legend", () => {
    render(<RadioGroup name="group" options={options} legend="Choose one" />);
    expect(screen.getByText("Choose one")).toBeInTheDocument();
  });

  // B: Accessibility
  it("uses fieldset/legend for grouping semantics", () => {
    const { container } = render(
      <RadioGroup name="group" options={options} legend="Pick" />,
    );
    expect(container.querySelector("fieldset")).toBeInTheDocument();
    expect(container.querySelector("legend")).toBeInTheDocument();
  });

  // C: Controlled mode
  it("marks the correct radio as checked", () => {
    render(<RadioGroup name="group" options={options} value="b" />);
    expect(screen.getByRole("radio", { name: "Beta" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Alpha" })).not.toBeChecked();
  });

  // D: Interactions
  it("calls onChange with the selected value", async () => {
    const onChange = vi.fn();
    render(
      <RadioGroup name="group" options={options} value="a" onChange={onChange} />,
    );
    await userEvent.click(screen.getByRole("radio", { name: "Gamma" }));
    expect(onChange).toHaveBeenCalledWith("c");
  });

  // E: Scalability
  it("renders many radio options without crashing", () => {
    const manyOptions = Array.from({ length: 50 }, (_, i) => ({
      value: `v${i}`,
      label: `Option ${i}`,
    }));
    render(<RadioGroup name="big" options={manyOptions} />);
    expect(screen.getByRole("radio", { name: "Option 0" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Option 49" })).toBeInTheDocument();
  });
});
