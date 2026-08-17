import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TopNavigation } from "./TopNavigation";
import { renderSmoke } from "../../test-utils";

describe("TopNavigation", () => {
  // A: Renderability
  it("renders with no props", () => {
    renderSmoke(TopNavigation);
  });

  it("renders with user information", () => {
    render(
      <TopNavigation
        user={{ name: "Alice", initials: "AL" }}
        account="personal"
        notifications={3}
      />,
    );
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders with all props", () => {
    render(
      <TopNavigation
        account="business"
        user={{ name: "Alice", company: "ACME", initials: "AL" }}
        notifications={5}
        onMenuClick={() => {}}
        onNotificationsClick={() => {}}
        onMenuAction={() => {}}
      />,
    );
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  // B: Ergonomics
  it("forwards className to the header", () => {
    const { container } = render(<TopNavigation className="custom" />);
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });

  it("renders as a header element", () => {
    render(<TopNavigation />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  // C: Accessibility
  it("has accessible hamburger menu button", () => {
    render(<TopNavigation onMenuClick={() => {}} />);
    expect(
      screen.getByRole("button", { name: "Open menu" }),
    ).toBeInTheDocument();
  });

  it("has accessible notifications button", () => {
    render(<TopNavigation onNotificationsClick={() => {}} />);
    expect(
      screen.getByRole("button", { name: "Notifications" }),
    ).toBeInTheDocument();
  });

  // D: Interactions
  it("fires onMenuClick when hamburger clicked", async () => {
    const onMenuClick = vi.fn();
    render(<TopNavigation onMenuClick={onMenuClick} />);
    await userEvent.click(
      screen.getByRole("button", { name: "Open menu" }),
    );
    expect(onMenuClick).toHaveBeenCalledTimes(1);
  });

  it("fires onNotificationsClick when notifications clicked", async () => {
    const onNotificationsClick = vi.fn();
    render(<TopNavigation onNotificationsClick={onNotificationsClick} />);
    await userEvent.click(
      screen.getByRole("button", { name: "Notifications" }),
    );
    expect(onNotificationsClick).toHaveBeenCalledTimes(1);
  });

  // E: Children slot
  it("renders children content", () => {
    render(
      <TopNavigation>
        <span data-testid="custom-slot">Custom</span>
      </TopNavigation>,
    );
    expect(screen.getByTestId("custom-slot")).toBeInTheDocument();
  });
});
