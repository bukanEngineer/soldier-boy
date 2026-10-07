import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs } from "./Tabs";

function Example(props: Partial<React.ComponentProps<typeof Tabs.Root>> & { listProps?: React.ComponentProps<typeof Tabs.List> }) {
  const { listProps, ...rootProps } = props;
  return (
    <Tabs.Root defaultValue="overview" {...rootProps}>
      <Tabs.List {...listProps}>
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="details">Details</Tabs.Tab>
        <Tabs.Tab value="settings" disabled>Settings</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">Overview content</Tabs.Panel>
      <Tabs.Panel value="details">Details content</Tabs.Panel>
      <Tabs.Panel value="settings">Settings content</Tabs.Panel>
    </Tabs.Root>
  );
}

describe("Tabs", () => {
  it("renders tabs and the default panel", () => {
    render(<Example />);
    expect(screen.getAllByRole("tab")).toHaveLength(3);
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Overview content");
  });

  it("links tabs and panels with ARIA", () => {
    render(<Example />);
    const tab = screen.getByRole("tab", { name: "Overview" });
    const panel = screen.getByRole("tabpanel");
    expect(tab).toHaveAttribute("aria-selected", "true");
    expect(tab).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveAttribute("aria-labelledby", tab.id);
  });

  it("switches panel on click and marks the active tab", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("tab", { name: "Details" }));
    expect(screen.getByRole("tab", { name: "Details" })).toHaveAttribute("data-active");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Details content");
  });

  // Disabled tabs stay focusable (WAI-ARIA APG) but can't be activated.
  it("moves focus with arrow keys and loops", async () => {
    render(<Example />);
    await userEvent.tab();
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Details" })).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveFocus();
  });

  it("calls onValueChange in controlled mode", async () => {
    const onValueChange = vi.fn();
    render(<Example value="overview" defaultValue={undefined} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("tab", { name: "Details" }));
    expect(onValueChange).toHaveBeenCalledWith("details", expect.anything());
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Overview content");
  });

  it("does not activate a disabled tab", async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole("tab", { name: "Settings" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Overview content");
  });

  it("applies variant and fill as data attributes on the list", () => {
    render(<Example listProps={{ variant: "secondary", fill: true }} />);
    const list = screen.getByRole("tablist");
    expect(list).toHaveAttribute("data-variant", "secondary");
    expect(list).toHaveAttribute("data-fill");
    expect(list).toHaveClass("tabs__list");
  });

  it("merges className and spreads props on every part", () => {
    render(<Example className="custom" data-testid="root" />);
    expect(screen.getByTestId("root")).toHaveClass("tabs", "custom");
  });
});
