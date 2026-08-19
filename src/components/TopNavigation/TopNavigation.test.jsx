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

  // F: Profile menu interactions
  describe("profile menu", () => {
    it("opens on profile button click", async () => {
      render(<TopNavigation user={{ name: "Alice" }} />);
      await userEvent.click(screen.getByRole("button", { name: /account/i }));
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    it("closes on second profile button click", async () => {
      render(<TopNavigation user={{ name: "Alice" }} />);
      const trigger = screen.getByRole("button", { name: /account/i });
      await userEvent.click(trigger);
      expect(screen.getByRole("menu")).toBeInTheDocument();
      await userEvent.click(trigger);
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("closes on Escape key", async () => {
      render(<TopNavigation user={{ name: "Alice" }} />);
      await userEvent.click(screen.getByRole("button", { name: /account/i }));
      expect(screen.getByRole("menu")).toBeInTheDocument();
      await userEvent.keyboard("{Escape}");
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("closes on click outside", async () => {
      render(
        <div>
          <TopNavigation user={{ name: "Alice" }} />
          <button data-testid="outside">Outside</button>
        </div>,
      );
      await userEvent.click(screen.getByRole("button", { name: /account/i }));
      expect(screen.getByRole("menu")).toBeInTheDocument();
      await userEvent.click(screen.getByTestId("outside"));
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("fires onMenuAction and closes menu on action", async () => {
      const onMenuAction = vi.fn();
      render(
        <TopNavigation user={{ name: "Alice" }} onMenuAction={onMenuAction} />,
      );
      await userEvent.click(screen.getByRole("button", { name: /account/i }));
      const menuItems = screen.getAllByRole("menuitem");
      await userEvent.click(menuItems[0]);
      expect(onMenuAction).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("moves focus to first menu item on open", async () => {
      render(<TopNavigation user={{ name: "Alice" }} />);
      await userEvent.click(screen.getByRole("button", { name: /account/i }));
      // Wait for rAF-based focus
      await new Promise((r) => requestAnimationFrame(r));
      const firstItem = screen.getAllByRole("menuitem")[0];
      expect(document.activeElement).toBe(firstItem);
    });

    it("returns focus to trigger on close", async () => {
      render(<TopNavigation user={{ name: "Alice" }} />);
      const trigger = screen.getByRole("button", { name: /account/i });
      await userEvent.click(trigger);
      await new Promise((r) => requestAnimationFrame(r));
      await userEvent.keyboard("{Escape}");
      expect(document.activeElement).toBe(trigger);
    });
  });

  // G: Label rendering logic
  describe("label rendering", () => {
    it("personal account shows user name as primary, no sub-label", async () => {
      render(
        <TopNavigation account="personal" user={{ name: "Alice Smith" }} />,
      );
      const trigger = screen.getByRole("button", { name: /account: alice smith/i });
      expect(trigger).toBeInTheDocument();
      expect(trigger.querySelector(".topnav__profile-name")?.textContent).toBe("Alice Smith");
      expect(trigger.querySelector(".topnav__profile-sub")).toBeNull();
    });

    it("business account shows user name as primary and role as sub-label", () => {
      render(
        <TopNavigation
          account="business"
          user={{ name: "Bob Jones", role: "Admin" }}
        />,
      );
      const trigger = screen.getByRole("button", { name: /account: bob jones/i });
      expect(trigger.querySelector(".topnav__profile-name")?.textContent).toBe("Bob Jones");
      expect(trigger.querySelector(".topnav__profile-sub")?.textContent).toBe("Admin");
    });

    it("sandbox account shows company as primary and user name as sub-label", () => {
      render(
        <TopNavigation
          account="sandbox"
          user={{ name: "Carol", company: "ACME Corp" }}
        />,
      );
      const trigger = screen.getByRole("button", { name: /account: acme corp/i });
      expect(trigger.querySelector(".topnav__profile-name")?.textContent).toBe("ACME Corp");
      expect(trigger.querySelector(".topnav__profile-sub")?.textContent).toBe("Carol");
    });

    it("sandbox falls back to user name when company is absent", () => {
      render(
        <TopNavigation account="sandbox" user={{ name: "Carol" }} />,
      );
      const trigger = screen.getByRole("button", { name: /account: carol/i });
      expect(trigger.querySelector(".topnav__profile-name")?.textContent).toBe("Carol");
    });

    it("derives initials from name when initials prop is absent", () => {
      const { container } = render(
        <TopNavigation user={{ name: "John Doe" }} />,
      );
      expect(container.querySelector(".topnav__initials")?.textContent).toBe("JD");
    });

    it("uses explicit initials prop over derived", () => {
      const { container } = render(
        <TopNavigation user={{ name: "John Doe", initials: "XX" }} />,
      );
      expect(container.querySelector(".topnav__initials")?.textContent).toBe("XX");
    });
  });

  // H: Notification badge
  describe("notification badge", () => {
    it("shows badge when notifications > 0", () => {
      const { container } = render(<TopNavigation notifications={5} />);
      expect(container.querySelector(".badge")).toBeInTheDocument();
    });

    it("does not show badge when notifications is 0", () => {
      const { container } = render(<TopNavigation notifications={0} />);
      expect(container.querySelector(".badge")).not.toBeInTheDocument();
    });
  });
});
