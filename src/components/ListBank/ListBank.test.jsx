import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ListBank } from "./ListBank";
import { renderSmoke, generateItems } from "../../test-utils";

describe("ListBank", () => {
  it("renders without crashing (no props)", () => {
    renderSmoke(ListBank);
  });

  it("renders with typical props", () => {
    const { container } = render(
      <ListBank
        banks={[
          { id: "dbs", name: "DBS Bank", accountNumber: "***1234" },
          { id: "ocbc", name: "OCBC Bank", accountNumber: "***5678" },
        ]}
      />,
    );
    expect(container.firstChild).not.toBeNull();
  });

  // Scalability
  it("renders many bank items without crashing", () => {
    const banks = generateItems(50, (i) => ({
      id: `bank-${i}`,
      name: `Bank ${i}`,
      accountNumber: `***${i}`,
    }));
    const { container } = render(<ListBank banks={banks} />);
    expect(container.firstChild).not.toBeNull();
  });
});
