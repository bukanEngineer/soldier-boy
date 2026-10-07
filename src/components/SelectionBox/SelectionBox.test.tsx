import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SelectionBox } from "./SelectionBox";
import { Radio } from "../Radio/Radio";

describe("SelectionBox", () => {
  it("selects a radio option inside Radio.Group", async () => {
    const onValueChange = vi.fn();
    render(
      <Radio.Group onValueChange={onValueChange}>
        <SelectionBox type="radio" value="a" label="Option A" />
        <SelectionBox type="radio" value="b" label="Option B" />
      </Radio.Group>,
    );
    await userEvent.click(screen.getByText("Option B"));
    expect(onValueChange).toHaveBeenCalledWith("b", expect.anything());
  });

  it("toggles a check selection box", async () => {
    const onChange = vi.fn();
    render(
      <SelectionBox type="check" label="Agree" selected={false} onChange={onChange} />,
    );
    await userEvent.click(screen.getByText("Agree"));
    expect(onChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it("supports controlled check state", () => {
    render(<SelectionBox type="check" label="On" selected />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("does not select when disabled", async () => {
    const onValueChange = vi.fn();
    render(
      <Radio.Group onValueChange={onValueChange}>
        <SelectionBox type="radio" value="a" label="Locked" disabled />
      </Radio.Group>,
    );
    await userEvent.click(screen.getByText("Locked"));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
