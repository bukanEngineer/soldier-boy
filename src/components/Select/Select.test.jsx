import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "./Select";
import { renderSmoke, generateItems } from "../../test-utils";

const defaultOptions = [
  { value: "sg", label: "Singapore" },
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
];

describe("Select", () => {
  // A: Renderability
  it("renders with no props", () => {
    renderSmoke(Select);
  });

  it("renders with all optional props", () => {
    render(
      <Select
        label="Country"
        helper="Select your country"
        error="Required"
        options={defaultOptions}
        placeholder="Choose..."
        size="sm"
        disabled
      />,
    );
    expect(screen.getByText("Country")).toBeInTheDocument();
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  // B: Ergonomics
  it("forwards className to the field wrapper", () => {
    const { container } = render(<Select className="custom" />);
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });

  it("shows placeholder when no value selected", () => {
    render(<Select options={defaultOptions} placeholder="Pick one" />);
    expect(screen.getByText("Pick one")).toBeInTheDocument();
  });

  // C: Accessibility
  it("trigger has aria-haspopup=listbox", () => {
    const { container } = render(<Select options={defaultOptions} />);
    const trigger = container.querySelector("[aria-haspopup='listbox']");
    expect(trigger).toBeInTheDocument();
  });

  it("trigger has aria-expanded=false when closed", () => {
    const { container } = render(<Select options={defaultOptions} />);
    const trigger = container.querySelector("[aria-haspopup='listbox']");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  // D: Controlled mode
  it("displays selected value in controlled mode", () => {
    render(<Select options={defaultOptions} value="sg" />);
    expect(screen.getByText("Singapore")).toBeInTheDocument();
  });

  // E: Uncontrolled mode
  it("selects a value in uncontrolled mode", async () => {
    render(<Select options={defaultOptions} defaultValue="" />);
    const { container } = render(<Select options={defaultOptions} />);
    const trigger = container.querySelector("[aria-haspopup='listbox']");
    await userEvent.click(trigger);
    await userEvent.click(screen.getByText("Singapore"));
    expect(screen.getByText("Singapore")).toBeInTheDocument();
  });

  // F: Interactions
  it("opens dropdown on click", async () => {
    const { container } = render(<Select options={defaultOptions} />);
    const trigger = container.querySelector("[aria-haspopup='listbox']");
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("calls onChange with value when option selected", async () => {
    const onChange = vi.fn();
    const { container } = render(
      <Select options={defaultOptions} onChange={onChange} />,
    );
    const trigger = container.querySelector("[aria-haspopup='listbox']");
    await userEvent.click(trigger);
    await userEvent.click(screen.getByText("United States"));
    expect(onChange).toHaveBeenCalledWith("us", defaultOptions[1]);
  });

  it("does not open when disabled", async () => {
    const { container } = render(
      <Select options={defaultOptions} disabled />,
    );
    const trigger = container.querySelector("[aria-haspopup='listbox']");
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  // G: Scalability — large option lists
  it("renders with 500 options without crashing", async () => {
    const manyOptions = generateItems(500, (i) => ({
      value: `opt-${i}`,
      label: `Option ${i}`,
    }));
    const { container } = render(<Select options={manyOptions} />);
    const trigger = container.querySelector("[aria-haspopup='listbox']");
    await userEvent.click(trigger);
    expect(screen.getByText("Option 0")).toBeInTheDocument();
    expect(screen.getByText("Option 499")).toBeInTheDocument();
  });
});
