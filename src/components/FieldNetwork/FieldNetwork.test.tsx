import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FieldNetwork } from "./FieldNetwork";
import { Field } from "../Field/Field";
import { renderSmoke } from "../../test-utils";

describe("FieldNetwork", () => {
  it("renders without crashing", () => {
    renderSmoke(FieldNetwork);
  });

  it("renders with Field label", () => {
    render(
      <Field.Root>
        <Field.Label>Network</Field.Label>
        <FieldNetwork options={[{ value: "eth", name: "Ethereum" }]} defaultValue="eth" />
      </Field.Root>,
    );
    expect(screen.getByText("Network")).toBeInTheDocument();
    expect(screen.getByText("Ethereum")).toBeInTheDocument();
  });
});
