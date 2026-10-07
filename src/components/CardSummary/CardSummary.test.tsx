import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { CardSummary } from "./CardSummary";
import { renderSmoke } from "../../test-utils";

describe("CardSummary", () => {
  it("renders without crashing (no props)", () => {
    renderSmoke(CardSummary);
  });

  it("renders with typical props", () => {
    const { container } = render(
      <CardSummary
        title="Transaction Summary"
        items={[
          { label: "Amount", value: "100 SGD" },
          { label: "Fee", value: "0.50 SGD" },
        ]}
      />,
    );
    expect(container.firstChild).not.toBeNull();
  });

  it("places the info icon on the value", () => {
    const { container } = render(
      <CardSummary items={[{ label: "Fee", value: "0.50 SGD", info: true }]} />,
    );
    const row = container.querySelector(".card-detail-row");
    expect(row).toHaveAttribute("data-info-placement", "value");
    expect(row?.querySelector(".card-detail-row__value .card-detail-row__info")).not.toBeNull();
  });
});
