import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FieldBank } from "./FieldBank";
import { Field } from "../Field/Field";
import { renderSmoke } from "../../test-utils";

describe("FieldBank", () => {
  it("renders without crashing", () => {
    renderSmoke(FieldBank);
  });

  it("renders with Field label", () => {
    render(
      <Field.Root>
        <Field.Label>Bank Account</Field.Label>
        <FieldBank
          options={[{ value: "dbs", name: "John Doe", account: "DBS - 123" }]}
          defaultValue="dbs"
        />
      </Field.Root>,
    );
    expect(screen.getByText("Bank Account")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
});
