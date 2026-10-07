import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EstimatedBalance } from "./EstimatedBalance";
import { renderSmoke, assertPropSpreading } from "../../test-utils";

describe("EstimatedBalance", () => {
  // A: Renderability
  it("renders with no props (shows defaults)", () => {
    renderSmoke(EstimatedBalance);
    // Default label is "Estimated Balance", amount "2,081.23", currency "SGD"
    expect(screen.getByText(/Estimated Balance/)).toBeInTheDocument();
  });

  it("renders with custom props", () => {
    render(
      <EstimatedBalance
        label="Total Balance"
        amount="10,500.00"
        currency="USD"
      />,
    );
    expect(screen.getByText("Total Balance")).toBeInTheDocument();
    expect(screen.getByText(/10,500.00/)).toBeInTheDocument();
    expect(screen.getByText(/USD/)).toBeInTheDocument();
  });

  // B: Ergonomics
  it("forwards className", () => {
    const { container } = render(<EstimatedBalance className="custom" />);
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });

  it("spreads HTML attributes onto the root", () => {
    assertPropSpreading(EstimatedBalance);
  });

  // C: Scalability — large amounts
  it("handles very large amounts", () => {
    render(<EstimatedBalance amount="999,999,999.99" currency="SGD" />);
    expect(screen.getByText(/999,999,999.99/)).toBeInTheDocument();
  });
});
