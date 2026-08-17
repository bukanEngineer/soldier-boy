import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InputCurrency } from "./InputCurrency";
import { renderSmoke } from "../../test-utils";

describe("InputCurrency", () => {
  // A: Renderability — basic smoke test for untyped component
  it("renders without crashing", () => {
    renderSmoke(InputCurrency);
  });

  it("renders with common props without crashing", () => {
    const { container } = render(
      <InputCurrency
        label="Amount"
        currency="SGD"
        value="100.00"
        disabled={false}
      />,
    );
    expect(container.firstChild).not.toBeNull();
  });

  // B: Ergonomics
  it("displays the label", () => {
    render(<InputCurrency label="Transfer amount" />);
    expect(screen.getByText("Transfer amount")).toBeInTheDocument();
  });

  // C: Scalability — large numbers
  it("handles large numeric values without crashing", () => {
    const { container } = render(
      <InputCurrency value="999999999.99" currency="USD" />,
    );
    expect(container.firstChild).not.toBeNull();
  });
});
