import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { CardStatus } from "./CardStatus";
import { renderSmoke } from "../../test-utils";

describe("CardStatus", () => {
  it("renders without crashing (no props)", () => {
    renderSmoke(CardStatus);
  });

  it("renders with typical props", () => {
    const { container } = render(
      <CardStatus
        title="Transfer Submitted"
        status="success"
        description="Your transfer has been processed."
      />,
    );
    expect(container.firstChild).not.toBeNull();
  });

  it("places the info icon on the label", () => {
    const { container } = render(
      <CardStatus
        sections={[
          {
            items: [{ label: "Network fee", value: "1.00 SGD", info: true }],
          },
        ]}
      />,
    );
    const row = container.querySelector(".card-detail-row");
    expect(row).toHaveAttribute("data-info-placement", "label");
    expect(row?.querySelector(".card-detail-row__label .card-detail-row__info")).not.toBeNull();
  });
});
