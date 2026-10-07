import React, { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MultiSelect } from "./MultiSelect";

const networks = [
  { value: "eth", label: "Ethereum" },
  { value: "polygon", label: "Polygon" },
  { value: "base", label: "Base" },
];
const items = networks.map((n) => n.value);
const labelFor = (value: string) => networks.find((n) => n.value === value)?.label ?? value;

function Demo(props: Partial<React.ComponentProps<typeof MultiSelect.Root>>) {
  return (
    <MultiSelect.Root items={items} multiple {...props}>
      <MultiSelect.InputGroup>
        <MultiSelect.Value>
          {(value: string[]) => (
            <MultiSelect.Chips aria-label={value.length ? "Selected" : undefined}>
              {value.map((v) => (
                <MultiSelect.Chip key={v} aria-label={labelFor(v)}>
                  {labelFor(v)}
                  <MultiSelect.ChipRemove aria-label={`Remove ${labelFor(v)}`} />
                </MultiSelect.Chip>
              ))}
              <MultiSelect.Input placeholder={value.length ? "" : "Select networks"} aria-label="Networks" />
            </MultiSelect.Chips>
          )}
        </MultiSelect.Value>
        <MultiSelect.Clear aria-label="Clear all" />
        <MultiSelect.Trigger aria-label="Open" />
      </MultiSelect.InputGroup>
      <MultiSelect.Popup>
        <MultiSelect.Empty>No networks found.</MultiSelect.Empty>
        <MultiSelect.List>
          {(item: string) => (
            <MultiSelect.Item key={item} value={item}>
              {labelFor(item)}
            </MultiSelect.Item>
          )}
        </MultiSelect.List>
      </MultiSelect.Popup>
    </MultiSelect.Root>
  );
}

describe("MultiSelect", () => {
  it("shows the placeholder when empty", () => {
    render(<Demo />);
    expect(screen.getByPlaceholderText("Select networks")).toBeInTheDocument();
  });

  it("opens a listbox and toggles options", async () => {
    const onValueChange = vi.fn();
    render(<Demo onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    const listbox = await screen.findByRole("listbox");
    await userEvent.click(within(listbox).getByRole("option", { name: "Ethereum" }));
    expect(onValueChange).toHaveBeenCalledWith(["eth"], expect.anything());
    expect(await screen.findByLabelText("Ethereum")).toBeInTheDocument();
  });

  it("supports defaultValue chips", () => {
    render(<Demo defaultValue={["eth", "base"]} />);
    expect(screen.getByLabelText("Ethereum")).toBeInTheDocument();
    expect(screen.getByLabelText("Base")).toBeInTheDocument();
  });

  it("is controlled via value + onValueChange", async () => {
    function Controlled() {
      const [value, setValue] = useState<string[]>([]);
      return <Demo value={value} onValueChange={setValue} />;
    }
    render(<Controlled />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    await userEvent.click(await screen.findByRole("option", { name: "Polygon" }));
    expect(screen.getByLabelText("Polygon")).toBeInTheDocument();
  });

  it("removes a chip with ChipRemove", async () => {
    render(<Demo defaultValue={["eth", "base"]} />);
    await userEvent.click(screen.getByRole("button", { name: "Remove Ethereum" }));
    await waitFor(() => expect(screen.queryByLabelText("Ethereum")).not.toBeInTheDocument());
    expect(screen.getByLabelText("Base")).toBeInTheDocument();
  });

  it("clears all selections", async () => {
    render(<Demo defaultValue={["eth", "base"]} />);
    await userEvent.click(screen.getByRole("button", { name: "Clear all" }));
    await waitFor(() => expect(screen.getByPlaceholderText("Select networks")).toBeInTheDocument());
  });

  it("does not open when disabled", async () => {
    render(<Demo disabled defaultValue={["eth"]} />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("filters options from the input", async () => {
    render(<Demo />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    await screen.findByRole("listbox");
    await userEvent.type(screen.getByLabelText("Networks"), "poly");
    expect(screen.getByRole("option", { name: "Polygon" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Ethereum" })).not.toBeInTheDocument();
  });
});
