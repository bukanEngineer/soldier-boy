import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FieldBlockchain } from "./FieldBlockchain";
import { Field } from "../Field/Field";
import { renderSmoke } from "../../test-utils";

describe("FieldBlockchain", () => {
  it("renders without crashing", () => {
    renderSmoke(FieldBlockchain);
  });

  it("renders with Field label", () => {
    render(
      <Field.Root>
        <Field.Label>Wallet</Field.Label>
        <FieldBlockchain
          options={[{ value: "mm", name: "Metamask", address: "0xabc" }]}
          defaultValue="mm"
        />
      </Field.Root>,
    );
    expect(screen.getByText("Wallet")).toBeInTheDocument();
    expect(screen.getByText("Metamask")).toBeInTheDocument();
  });
});
