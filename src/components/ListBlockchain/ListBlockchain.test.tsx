import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { ListBlockchain } from "./ListBlockchain";
import { renderSmoke } from "../../test-utils";

describe("ListBlockchain", () => {
  it("renders without crashing", () => {
    renderSmoke(ListBlockchain);
  });

  it("renders name and address", () => {
    render(<ListBlockchain name="Metamask" address="0xabc" />);
    expect(screen.getByText("Metamask")).toBeInTheDocument();
    expect(screen.getByText("0xabc")).toBeInTheDocument();
  });

  it("shows a Pending tag for pending wallets", () => {
    render(<ListBlockchain variant="pending" />);
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("fires onAction from the Verify button", async () => {
    const onAction = vi.fn();
    render(<ListBlockchain variant="verify" onAction={onAction} />);
    await userEvent.click(screen.getByRole("button", { name: "Verify" }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("has no action for verified wallets", () => {
    render(<ListBlockchain variant="verifiedCustodial" />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  const long = "0x934ddab12av012345c1ertf897fec124f2gyb1";

  it("middle-truncates long addresses but keeps the full value for assistive tech", () => {
    const { container } = render(<ListBlockchain address={long} />);
    expect(container.querySelector(".list-blockchain__trunc")).toHaveTextContent(
      `${long.slice(0, 10)}…${long.slice(-8)}`,
    );
    expect(container.querySelector(".list-blockchain__trunc")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText(long)).toHaveClass("list-blockchain__sr");
    expect(container.querySelector(".list-blockchain__address")).toHaveAttribute("title", long);
  });

  it("leaves short addresses untouched", () => {
    const { container } = render(<ListBlockchain address="0xabc" />);
    expect(container.querySelector(".list-blockchain__address")).toBeNull();
    expect(screen.getByText("0xabc")).toBeInTheDocument();
  });
});
