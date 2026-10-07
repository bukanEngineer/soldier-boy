import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BottomSheetBank } from "../BottomSheetBank";
import { BottomSheetBlockchain } from "../BottomSheetBlockchain";
import { BottomSheetNetwork } from "../BottomSheetNetwork";

const items = [
  { id: "dbs", name: "DBS Bank", description: "•••• 1234" },
  { id: "uob", name: "UOB" },
];

describe("BottomSheetSelect recipes", () => {
  it("BottomSheetBank renders a default title, rows and the selected state", async () => {
    render(<BottomSheetBank defaultOpen banks={items} value="dbs" />);
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAccessibleName("Select Bank");
    const dbs = screen.getByRole("button", { name: /DBS Bank/ });
    expect(dbs).toHaveAttribute("aria-pressed", "true");
    expect(dbs).toHaveAttribute("data-selected");
    const uob = screen.getByRole("button", { name: /UOB/ });
    expect(uob).toHaveAttribute("aria-pressed", "false");
    expect(uob).not.toHaveAttribute("data-selected");
    // Fallback mark is the first letter of the name.
    expect(uob.querySelector(".bsheet-select__mark")).toHaveTextContent("U");
  });

  it("calls onValueChange with the id and item", async () => {
    const onValueChange = vi.fn();
    render(<BottomSheetNetwork defaultOpen networks={items} onValueChange={onValueChange} />);
    await screen.findByRole("dialog");
    expect(screen.getByRole("dialog")).toHaveAccessibleName("Select Network");
    await userEvent.click(screen.getByRole("button", { name: /UOB/ }));
    expect(onValueChange).toHaveBeenCalledWith("uob", items[1]);
  });

  it("BottomSheetBlockchain merges className and supports a custom title", async () => {
    render(
      <BottomSheetBlockchain defaultOpen chains={items} title="Pick chain" className="extra" />,
    );
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAccessibleName("Pick chain");
    expect(dialog).toHaveClass("bsheet", "bsheet-select", "bsc", "extra");
  });

  it("closes via the header close button with onOpenChange", async () => {
    const onOpenChange = vi.fn();
    render(<BottomSheetBank open banks={items} onOpenChange={onOpenChange} />);
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });
});
