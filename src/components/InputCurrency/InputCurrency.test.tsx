import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { InputCurrency } from "./InputCurrency";
import { Field } from "../Field/Field";
import { renderSmoke } from "../../test-utils";

describe("InputCurrency", () => {
  it("renders without crashing", () => {
    renderSmoke(InputCurrency);
  });

  it("renders with common props without crashing", () => {
    const { container } = render(
      <InputCurrency value="100.00" disabled={false} asset={{ symbol: "SGD" }} />,
    );
    expect(container.firstChild).not.toBeNull();
  });

  it("displays the label from Field", () => {
    render(
      <Field.Root>
        <Field.Label>Transfer amount</Field.Label>
        <InputCurrency />
      </Field.Root>,
    );
    expect(screen.getByText("Transfer amount")).toBeInTheDocument();
  });

  it("handles large numeric values without crashing", () => {
    const { container } = render(
      <InputCurrency value="999999999.99" asset={{ symbol: "USD" }} />,
    );
    expect(container.firstChild).not.toBeNull();
  });

  it("renders the amount input", () => {
    render(<InputCurrency defaultValue="12.50" placeholder="0.00" />);
    expect(screen.getByDisplayValue("12.50")).toBeInTheDocument();
  });
});
