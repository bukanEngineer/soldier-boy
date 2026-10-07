import React, { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "./Select";
import { Field } from "../Field/Field";

const options = [
  { value: "sg", label: "Singapore" },
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
];

type DemoProps = Partial<React.ComponentProps<typeof Select.Root>> & {
  size?: "large" | "small";
  placeholder?: string;
  clearable?: boolean;
  label?: string;
};

function Demo({
  size = "large",
  placeholder = "Pick one",
  clearable = true,
  label,
  children,
  items = options,
  ...rootProps
}: DemoProps & { children?: React.ReactNode }) {
  const select = (
    <Select.Root items={items} {...rootProps}>
      <Select.Control size={size}>
        <Select.Trigger size={size} aria-label={label ? undefined : "Country"}>
          <Select.Value placeholder={placeholder} />
          <Select.Icon />
        </Select.Trigger>
        {clearable && <Select.Clear />}
      </Select.Control>
      <Select.Popup>
        <Select.List>
          {children ??
            options.map((o) => (
              <Select.Item key={o.value} value={o.value}>
                {o.label}
              </Select.Item>
            ))}
        </Select.List>
      </Select.Popup>
    </Select.Root>
  );

  if (!label) return select;
  return (
    <Field.Root>
      <Field.Label>{label}</Field.Label>
      {select}
    </Field.Root>
  );
}

describe("Select", () => {
  it("shows the placeholder when empty", () => {
    render(<Demo />);
    expect(screen.getByText("Pick one")).toBeInTheDocument();
  });

  it("trigger exposes listbox popup semantics", () => {
    render(<Demo />);
    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("opens a listbox and selects an option", async () => {
    const onValueChange = vi.fn();
    render(<Demo onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("combobox"));
    const listbox = await screen.findByRole("listbox");
    await userEvent.click(within(listbox).getByRole("option", { name: "United States" }));
    expect(onValueChange).toHaveBeenCalledWith("us", expect.anything());
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
    expect(screen.getByRole("combobox")).toHaveTextContent("United States");
  });

  it("supports defaultValue (uncontrolled)", async () => {
    render(<Demo defaultValue="sg" />);
    expect(screen.getByRole("combobox")).toHaveTextContent("Singapore");
  });

  it("is controlled via value + onValueChange", async () => {
    function Controlled() {
      const [value, setValue] = useState<string | null>(null);
      return <Demo value={value} onValueChange={setValue} />;
    }
    render(<Controlled />);
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(await screen.findByRole("option", { name: "Singapore" }));
    expect(screen.getByRole("combobox")).toHaveTextContent("Singapore");
  });

  it("does not open when disabled", async () => {
    render(<Demo disabled />);
    const trigger = screen.getByRole("combobox");
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("moves highlight with arrow keys while open", async () => {
    render(<Demo />);
    await userEvent.click(screen.getByRole("combobox"));
    const listbox = await screen.findByRole("listbox");
    await userEvent.keyboard("{ArrowDown}");
    await waitFor(() => {
      expect(listbox.querySelector("[data-highlighted]")).toBeTruthy();
    });
  });

  it("clears via a real sibling button outside the trigger", async () => {
    render(<Demo defaultValue="sg" />);
    const clear = screen.getByRole("button", { name: "Clear selection" });
    expect(clear.tagName).toBe("BUTTON");
    expect(screen.getByRole("combobox").contains(clear)).toBe(false);
    await userEvent.click(clear);
    await waitFor(() => expect(screen.getByText("Pick one")).toBeInTheDocument());
    expect(screen.queryByRole("button", { name: "Clear selection" })).not.toBeInTheDocument();
  });

  it("wires label through Field", () => {
    render(<Demo label="Country" />);
    expect(screen.getByLabelText("Country")).toBeInTheDocument();
  });

  it("applies size as a data attribute", () => {
    render(<Demo size="small" />);
    expect(screen.getByRole("combobox")).toHaveAttribute("data-size", "small");
  });

  it("skips disabled options", async () => {
    const onValueChange = vi.fn();
    render(
      <Demo onValueChange={onValueChange}>
        <Select.Item value="sg">Singapore</Select.Item>
        <Select.Item value="us" disabled>
          United States
        </Select.Item>
      </Demo>,
    );
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(await screen.findByRole("option", { name: "United States" }));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
