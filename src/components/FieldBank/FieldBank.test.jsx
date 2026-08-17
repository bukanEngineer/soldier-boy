import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { FieldBank } from "./FieldBank";
import { renderSmoke } from "../../test-utils";

describe("FieldBank", () => {
  it("renders without crashing (no props)", () => {
    renderSmoke(FieldBank);
  });

  it("renders with typical props", () => {
    const { container } = render(
      <FieldBank
        label="Bank account"
        bank={{ id: "dbs", name: "DBS", accountNumber: "***1234" }}
      />,
    );
    expect(container.firstChild).not.toBeNull();
  });
});
