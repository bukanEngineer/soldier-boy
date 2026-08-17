import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./Input";
import {
  renderSmoke,
  assertClassNameForwarding,
  generateItems,
} from "../../test-utils";

describe("Input", () => {
  // A: Renderability
  it("renders with no props", () => {
    renderSmoke(Input);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders with all optional props", () => {
    render(
      <Input
        label="Email"
        helper="Enter your email"
        error="Invalid email"
        type="email"
        size="sm"
        disabled
        placeholder="you@example.com"
      />,
    );
    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Invalid email")).toBeInTheDocument();
  });

  // B: Ergonomics
  it("forwards className to the input wrapper", () => {
    const { container } = render(<Input className="custom-class" />);
    expect(container.querySelector(".custom-class")).toBeInTheDocument();
  });

  it("spreads HTML attributes onto the input element", () => {
    render(<Input data-testid="spread-check" aria-describedby="desc" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("data-testid", "spread-check");
    expect(input).toHaveAttribute("aria-describedby", "desc");
  });

  it("applies size classes", () => {
    const { container } = render(<Input size="small" />);
    expect(container.querySelector(".input--small")).toBeInTheDocument();
  });

  // C: Accessibility
  it("associates label with input via id", () => {
    render(<Input label="Username" id="username" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("id", "username");
  });

  it("shows error message", () => {
    render(<Input error="Required field" />);
    expect(screen.getByText("Required field")).toBeInTheDocument();
  });

  it("shows helper text", () => {
    render(<Input helper="Hint text" />);
    expect(screen.getByText("Hint text")).toBeInTheDocument();
  });

  // D: Controlled mode
  it("works as controlled input", async () => {
    const onChange = vi.fn();
    render(<Input value="hello" onChange={onChange} />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("hello");
    await userEvent.type(input, "x");
    expect(onChange).toHaveBeenCalled();
  });

  // E: Uncontrolled mode
  it("works as uncontrolled input with defaultValue", async () => {
    render(<Input defaultValue="initial" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("initial");
    await userEvent.clear(input);
    await userEvent.type(input, "new value");
    expect(input).toHaveValue("new value");
  });

  // F: Interactions
  it("does not accept input when disabled", () => {
    render(<Input disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("fires onChange when user types", async () => {
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);
    await userEvent.type(screen.getByRole("textbox"), "abc");
    expect(onChange).toHaveBeenCalledTimes(3);
  });

  // G: Scalability
  it("renders many inputs without crashing", () => {
    const { container } = render(
      <div>
        {generateItems(50, (i) => (
          <Input key={i} label={`Field ${i}`} />
        ))}
      </div>,
    );
    expect(container.querySelectorAll("input")).toHaveLength(50);
  });
});
