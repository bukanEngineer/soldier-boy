import React, { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("toggles and calls onCheckedChange", async () => {
    const onCheckedChange = vi.fn();
    render(
      <Checkbox.Root aria-label="Accept" onCheckedChange={onCheckedChange}>
        <Checkbox.Indicator />
      </Checkbox.Root>,
    );
    await userEvent.click(screen.getByRole("checkbox"));
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it("supports controlled checked", () => {
    render(
      <Checkbox.Root aria-label="On" checked readOnly>
        <Checkbox.Indicator />
      </Checkbox.Root>,
    );
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("supports indeterminate", () => {
    render(
      <Checkbox.Root aria-label="Mixed" indeterminate>
        <Checkbox.Indicator />
      </Checkbox.Root>,
    );
    expect(screen.getByRole("checkbox")).toHaveAttribute("data-indeterminate");
  });

  it("does not toggle when disabled", async () => {
    const onCheckedChange = vi.fn();
    render(
      <Checkbox.Root aria-label="Off" disabled onCheckedChange={onCheckedChange}>
        <Checkbox.Indicator />
      </Checkbox.Root>,
    );
    await userEvent.click(screen.getByRole("checkbox"));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("works in a Checkbox.Group", async () => {
    function Demo() {
      const [value, setValue] = useState<string[]>([]);
      return (
        <Checkbox.Group value={value} onValueChange={setValue}>
          <Checkbox.Root value="a" aria-label="A">
            <Checkbox.Indicator />
          </Checkbox.Root>
          <Checkbox.Root value="b" aria-label="B">
            <Checkbox.Indicator />
          </Checkbox.Root>
        </Checkbox.Group>
      );
    }
    render(<Demo />);
    await userEvent.click(screen.getByRole("checkbox", { name: "A" }));
    expect(screen.getByRole("checkbox", { name: "A" })).toBeChecked();
  });
});
