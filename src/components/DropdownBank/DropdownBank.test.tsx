import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { DropdownBank } from "./DropdownBank";
import { renderSmoke } from "../../test-utils";

describe("DropdownBank", () => {
  it("renders without crashing", () => {
    renderSmoke(DropdownBank);
  });

  it("maps account to secondary text", () => {
    const { container } = render(
      <DropdownBank
        value="dbs"
        options={[{ value: "dbs", name: "DBS Bank", account: "•••• 1234" }]}
      />,
    );
    expect(container).toHaveTextContent("•••• 1234");
  });
});
