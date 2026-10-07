import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Radio } from "./Radio";

describe("Radio", () => {
  it("selects an option in a group", async () => {
    const onValueChange = vi.fn();
    render(
      <Radio.Group onValueChange={onValueChange} aria-label="Pet">
        <Radio.Root value="cat" aria-label="Cat">
          <Radio.Indicator />
        </Radio.Root>
        <Radio.Root value="dog" aria-label="Dog">
          <Radio.Indicator />
        </Radio.Root>
      </Radio.Group>,
    );
    await userEvent.click(screen.getByRole("radio", { name: "Dog" }));
    expect(onValueChange).toHaveBeenCalledWith("dog", expect.anything());
  });

  it("supports controlled value", () => {
    render(
      <Radio.Group value="a">
        <Radio.Root value="a" aria-label="A">
          <Radio.Indicator />
        </Radio.Root>
        <Radio.Root value="b" aria-label="B">
          <Radio.Indicator />
        </Radio.Root>
      </Radio.Group>,
    );
    expect(screen.getByRole("radio", { name: "A" })).toBeChecked();
  });

  it("moves with arrow keys", async () => {
    render(
      <Radio.Group defaultValue="a">
        <Radio.Root value="a" aria-label="A">
          <Radio.Indicator />
        </Radio.Root>
        <Radio.Root value="b" aria-label="B">
          <Radio.Indicator />
        </Radio.Root>
      </Radio.Group>,
    );
    screen.getByRole("radio", { name: "A" }).focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: "B" })).toHaveFocus();
  });
});
