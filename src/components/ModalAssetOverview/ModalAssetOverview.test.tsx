import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModalAssetOverview } from "./ModalAssetOverview";

const methods = [
  { id: "in", title: "Transfer In", description: "Receive crypto" },
  { id: "out", title: "Transfer Out" },
];

describe("ModalAssetOverview", () => {
  it("renders the asset header as the dialog title, methods and support info", async () => {
    render(
      <ModalAssetOverview
        defaultOpen
        symbol="XSGD"
        subtitle="1:1 to SGD"
        methods={methods}
        networks={[{ label: "Ethereum" }]}
        banks="FAST"
      />,
    );
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAccessibleName(/XSGD/);
    expect(screen.getByRole("button", { name: /Transfer In/ })).toBeInTheDocument();
    expect(screen.getByText("Ethereum")).toBeInTheDocument();
    expect(screen.getByText("FAST")).toBeInTheDocument();
  });

  it("calls onSelectMethod with the method", async () => {
    const onSelectMethod = vi.fn();
    render(<ModalAssetOverview defaultOpen symbol="SGD" methods={methods} onSelectMethod={onSelectMethod} />);
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: /Transfer Out/ }));
    expect(onSelectMethod).toHaveBeenCalledWith(methods[1]);
  });

  it("closes from the header close button", async () => {
    const onOpenChange = vi.fn();
    render(<ModalAssetOverview open onOpenChange={onOpenChange} symbol="SGD" />);
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });
});
