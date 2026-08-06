import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("toggles via the label and calls onChange", async () => {
    const onChange = vi.fn();
    render(<Switch label="Notifications" checked={false} onChange={onChange} />);
    await userEvent.click(screen.getByRole("switch", { name: "Notifications" }));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("does not respond when disabled", async () => {
    const onChange = vi.fn();
    render(<Switch label="Notifications" checked={false} disabled onChange={onChange} />);
    await userEvent.click(screen.getByRole("switch", { name: "Notifications" }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("reflects the checked state", () => {
    render(<Switch label="Notifications" checked readOnly />);
    expect(screen.getByRole("switch", { name: "Notifications" })).toBeChecked();
  });
});
