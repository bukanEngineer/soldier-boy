import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Copybox } from "./Copybox";
import {
  renderSmoke,
  assertClassNameForwarding,
  assertPropSpreading,
} from "../../test-utils";

describe("Copybox", () => {
  // A: Renderability
  it("renders with no props", () => {
    renderSmoke(Copybox);
  });

  it("renders with all optional props", () => {
    render(
      <Copybox
        value="0x1234abcd"
        multiline
        size="sm"
        label="Wallet address"
        helper="Click to copy"
        info="Your public address"
        error="Invalid"
        action
        buttonVariant="icon"
        truncate
      />,
    );
    expect(screen.getByText("Wallet address")).toBeInTheDocument();
    expect(screen.getByText("0x1234abcd")).toBeInTheDocument();
  });

  // B: Ergonomics
  it("forwards className to the copybox wrapper", () => {
    const { container } = render(<Copybox className="custom" value="test" />);
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });

  it("spreads HTML attributes onto the root div", () => {
    assertPropSpreading(Copybox, { value: "test" });
  });

  it("applies size classes", () => {
    const { container } = render(<Copybox value="test" size="sm" />);
    expect(container.querySelector(".copybox--sm")).toBeInTheDocument();
  });

  it("applies multiline class", () => {
    const { container } = render(<Copybox value="test" multiline />);
    expect(container.querySelector(".copybox--multiline")).toBeInTheDocument();
  });

  // C: Accessibility
  it("copy button has accessible label", () => {
    render(<Copybox value="test" action />);
    expect(screen.getByRole("button", { name: /copy/i })).toBeInTheDocument();
  });

  // D: Interactions
  it("copies value to clipboard when action button is clicked", async () => {
    // Mock clipboard API
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText },
    });

    render(<Copybox value="copy-me" action />);
    await userEvent.click(screen.getByRole("button", { name: /copy/i }));
    expect(writeText).toHaveBeenCalledWith("copy-me");
  });

  // E: Display variations
  it("shows helper text", () => {
    render(<Copybox value="test" helper="Helpful info" />);
    expect(screen.getByText("Helpful info")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(<Copybox value="test" error="Something wrong" />);
    expect(screen.getByText("Something wrong")).toBeInTheDocument();
  });

  it("renders a logo when provided", () => {
    render(
      <Copybox value="test" logo={<img data-testid="logo" alt="logo" />} />,
    );
    expect(screen.getByTestId("logo")).toBeInTheDocument();
  });

  // F: Scalability — long values
  it("handles very long values without crashing", () => {
    const longValue = "x".repeat(5000);
    render(<Copybox value={longValue} />);
    expect(screen.getByText(longValue)).toBeInTheDocument();
  });
});
