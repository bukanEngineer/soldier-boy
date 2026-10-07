import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModalAssetSelection } from "./ModalAssetSelection";

const assets = [
  { id: "xsgd", symbol: "XSGD", subtitle: "1:1 to SGD" },
  { id: "sgd", symbol: "SGD" },
];

describe("ModalAssetSelection", () => {
  it("labels the dialog with title and description", async () => {
    render(<ModalAssetSelection defaultOpen description="Deposit funds" assets={assets} />);
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAccessibleName("Transfer In");
    expect(dialog).toHaveAccessibleDescription("Deposit funds");
    expect(screen.getByText("Select Asset:")).toBeInTheDocument();
  });

  it("calls onSelect with the asset", async () => {
    const onSelect = vi.fn();
    render(<ModalAssetSelection defaultOpen assets={assets} onSelect={onSelect} />);
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: "SGD" }));
    expect(onSelect).toHaveBeenCalledWith(assets[1]);
  });

  it("merges className onto the modal panel", async () => {
    render(<ModalAssetSelection defaultOpen assets={assets} className="extra" />);
    expect(await screen.findByRole("dialog")).toHaveClass("modal", "asset-sel", "extra");
  });
});
