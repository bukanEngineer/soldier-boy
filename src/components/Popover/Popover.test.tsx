import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Popover } from "./Popover";

function Demo(props: Partial<React.ComponentProps<typeof Popover.Root>> & {
  popupProps?: Partial<React.ComponentProps<typeof Popover.Popup>>;
}) {
  const { popupProps, ...rootProps } = props;
  return (
    <Popover.Root {...rootProps}>
      <Popover.Trigger>Open</Popover.Trigger>
      <Popover.Popup {...popupProps}>
        <Popover.Header>
          <Popover.Title>Transfer limit</Popover.Title>
        </Popover.Header>
        <Popover.Description>Max S$10,000/day.</Popover.Description>
        <Popover.Footer>
          <button type="button" className="popover__link">Learn more</button>
        </Popover.Footer>
      </Popover.Popup>
    </Popover.Root>
  );
}

describe("Popover", () => {
  it("renders the trigger and keeps the popup closed", () => {
    render(<Demo />);
    expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens on click and exposes dialog semantics", async () => {
    render(<Demo />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAccessibleName("Transfer limit");
    expect(dialog).toHaveAccessibleDescription("Max S$10,000/day.");
  });

  it("supports defaultOpen", async () => {
    render(<Demo defaultOpen />);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("keeps interactive content reachable", async () => {
    const onClick = vi.fn();
    render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Popup>
          <Popover.Title>Actions</Popover.Title>
          <Popover.Footer>
            <button type="button" className="popover__link" onClick={onClick}>
              Learn more
            </button>
          </Popover.Footer>
        </Popover.Popup>
      </Popover.Root>,
    );
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: "Learn more" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape", async () => {
    render(<Demo defaultOpen />);
    await screen.findByRole("dialog");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});
