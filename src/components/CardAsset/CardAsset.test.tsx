import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { CardAsset } from "./CardAsset";
import { renderSmoke } from "../../test-utils";

describe("CardAsset", () => {
  it("renders without crashing (no props)", () => {
    renderSmoke(CardAsset);
  });

  it("renders with typical props", () => {
    const { container } = render(
      <CardAsset
        name="XSGD"
        balance="1,000.00"
        currency="SGD"
        icon="xsgd"
      />,
    );
    expect(container.firstChild).not.toBeNull();
  });

  const assets = [
    {
      symbol: "XSGD",
      balance: "1,000.00",
      networks: ["Ethereum", "Polygon", "Avalanche", "Solana", "Base", "Tron"].map((name) => ({ name })),
    },
    { symbol: "USDC", balance: "500.00" },
  ];

  it("renders each asset as a list item", () => {
    render(<CardAsset assets={assets} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("caps networks at 4 and shows the overflow count", () => {
    render(<CardAsset assets={assets} />);
    const [first] = screen.getAllByRole("listitem");
    expect(within(first).getByText("+2")).toBeInTheDocument();
  });

  it("falls back to symbol initials when there is no logo", () => {
    render(<CardAsset assets={assets} />);
    expect(screen.getByText("XS")).toBeInTheDocument();
  });

  it("passes the asset to onAdd / onSend", async () => {
    const onAdd = vi.fn();
    const onSend = vi.fn();
    render(<CardAsset assets={assets} onAdd={onAdd} onSend={onSend} />);
    const [first] = screen.getAllByRole("listitem");
    await userEvent.click(within(first).getByRole("button", { name: "Add" }));
    await userEvent.click(within(first).getByRole("button", { name: "Send" }));
    expect(onAdd).toHaveBeenCalledWith(assets[0]);
    expect(onSend).toHaveBeenCalledWith(assets[0]);
  });
});
