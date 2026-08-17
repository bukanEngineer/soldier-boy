import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Textarea } from "./Textarea";
import { renderSmoke, generateItems } from "../../test-utils";

describe("Textarea", () => {
  // A: Renderability
  it("renders with no props", () => {
    renderSmoke(Textarea);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders with all optional props", () => {
    render(
      <Textarea
        label="Description"
        helper="Max 500 characters"
        error="Too long"
        maxLength={500}
        showCount
        rows={5}
        disabled
      />,
    );
    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Too long")).toBeInTheDocument();
  });

  // B: Ergonomics
  it("forwards className to the field wrapper", () => {
    const { container } = render(<Textarea className="custom" />);
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });

  it("spreads HTML attributes onto the textarea", () => {
    render(<Textarea data-testid="spread" aria-describedby="help" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("data-testid", "spread");
    expect(textarea).toHaveAttribute("aria-describedby", "help");
  });

  // C: Accessibility
  it("associates label with textarea via id", () => {
    render(<Textarea label="Notes" id="notes" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("id", "notes");
  });

  // D: Controlled mode
  it("works as controlled textarea", async () => {
    const onChange = vi.fn();
    render(<Textarea value="hello" onChange={onChange} />);
    expect(screen.getByRole("textbox")).toHaveValue("hello");
    await userEvent.type(screen.getByRole("textbox"), "x");
    expect(onChange).toHaveBeenCalled();
  });

  // E: Uncontrolled mode
  it("works as uncontrolled textarea with defaultValue", async () => {
    render(<Textarea defaultValue="initial" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveValue("initial");
    await userEvent.clear(textarea);
    await userEvent.type(textarea, "updated");
    expect(textarea).toHaveValue("updated");
  });

  // F: Character count
  it("shows character count when showCount is true", () => {
    render(<Textarea showCount maxLength={100} defaultValue="hello" />);
    expect(screen.getByText("5/100")).toBeInTheDocument();
  });

  // G: Interactions
  it("does not accept input when disabled", () => {
    render(<Textarea disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  // H: Scalability
  it("handles long text content without crashing", () => {
    const longText = "a".repeat(10000);
    render(<Textarea defaultValue={longText} />);
    expect(screen.getByRole("textbox")).toHaveValue(longText);
  });
});
