import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
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
});
