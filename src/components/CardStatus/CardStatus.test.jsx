import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
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
});
