import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MultiSelect } from "./MultiSelect";
import { renderSmoke, generateItems } from "../../test-utils";

const defaultOptions = [
  { value: "sg", label: "Singapore" },
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "jp", label: "Japan" },
];

describe("MultiSelect", () => {
  // A: Renderability
  it("renders with no props", () => {
    renderSmoke(MultiSelect);
  });

  it("renders with all optional props", () => {
    render(
      <MultiSelect
        label="Countries"
        helper="Select multiple"
        error="At least one required"
        options={defaultOptions}
        placeholder="Choose countries..."
        disabled
      />,
    );
    expect(screen.getByText("Countries")).toBeInTheDocument();
    expect(screen.getByText("At least one required")).toBeInTheDocument();
  });

  // B: Ergonomics
  it("forwards className to the field wrapper", () => {
    const { container } = render(<MultiSelect className="custom" />);
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });

  it("shows placeholder when no values selected", () => {
    render(
      <MultiSelect options={defaultOptions} placeholder="Select..." />,
    );
    expect(screen.getByText("Select...")).toBeInTheDocument();
  });

  // C: Accessibility
  it("trigger has aria-haspopup=listbox", () => {
    const { container } = render(
      <MultiSelect options={defaultOptions} />,
    );
    const trigger = container.querySelector("[aria-haspopup='listbox']");
    expect(trigger).toBeInTheDocument();
  });

  it("trigger has aria-expanded=false when closed", () => {
    const { container } = render(
      <MultiSelect options={defaultOptions} />,
    );
    const trigger = container.querySelector("[aria-haspopup='listbox']");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  // D: Controlled mode
  it("displays selected chips in controlled mode", () => {
    render(
      <MultiSelect options={defaultOptions} value={["sg", "uk"]} />,
    );
    expect(screen.getByText("Singapore")).toBeInTheDocument();
    expect(screen.getByText("United Kingdom")).toBeInTheDocument();
  });

  // E: Interactions
  it("opens dropdown on click", async () => {
    const { container } = render(
      <MultiSelect options={defaultOptions} />,
    );
    const trigger = container.querySelector("[aria-haspopup='listbox']");
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("calls onChange with updated array when option selected", async () => {
    const onChange = vi.fn();
    const { container } = render(
      <MultiSelect options={defaultOptions} value={[]} onChange={onChange} />,
    );
    const trigger = container.querySelector("[aria-haspopup='listbox']");
    await userEvent.click(trigger);
    await userEvent.click(screen.getByText("Singapore"));
    expect(onChange).toHaveBeenCalledWith(["sg"]);
  });

  it("does not open when disabled", async () => {
    const { container } = render(
      <MultiSelect options={defaultOptions} disabled />,
    );
    const trigger = container.querySelector("[aria-haspopup='listbox']");
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  // F: Scalability — many options
  it("renders with 500 options without crashing", async () => {
    const manyOptions = generateItems(500, (i) => ({
      value: `opt-${i}`,
      label: `Option ${i}`,
    }));
    const { container } = render(
      <MultiSelect options={manyOptions} />,
    );
    const trigger = container.querySelector("[aria-haspopup='listbox']");
    await userEvent.click(trigger);
    expect(screen.getByText("Option 0")).toBeInTheDocument();
  });

  // G: Scalability — many selected values
  it("renders with many selected values as chips", () => {
    const manyOptions = generateItems(50, (i) => ({
      value: `opt-${i}`,
      label: `Option ${i}`,
    }));
    const allValues = manyOptions.map((o) => o.value);
    render(<MultiSelect options={manyOptions} value={allValues} />);
    expect(screen.getByText("Option 0")).toBeInTheDocument();
    expect(screen.getByText("Option 49")).toBeInTheDocument();
  });
});
