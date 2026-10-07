import React, { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("toggles and calls onCheckedChange", async () => {
    const onCheckedChange = vi.fn();
    render(
      <Switch.Root aria-label="Notifications" onCheckedChange={onCheckedChange}>
        <Switch.Thumb />
      </Switch.Root>,
    );
    await userEvent.click(screen.getByRole("switch"));
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it("supports controlled checked", () => {
    render(
      <Switch.Root aria-label="Notifications" checked readOnly>
        <Switch.Thumb />
      </Switch.Root>,
    );
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("does not toggle when disabled", async () => {
    const onCheckedChange = vi.fn();
    render(
      <Switch.Root aria-label="Notifications" disabled onCheckedChange={onCheckedChange}>
        <Switch.Thumb />
      </Switch.Root>,
    );
    await userEvent.click(screen.getByRole("switch"));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("works controlled from React state", async () => {
    function Demo() {
      const [on, setOn] = useState(false);
      return (
        <Switch.Root aria-label="Sandbox" checked={on} onCheckedChange={setOn}>
          <Switch.Thumb />
        </Switch.Root>
      );
    }
    render(<Demo />);
    await userEvent.click(screen.getByRole("switch"));
    expect(screen.getByRole("switch")).toBeChecked();
  });
});
