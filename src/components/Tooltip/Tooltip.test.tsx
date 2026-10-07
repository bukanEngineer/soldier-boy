import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tooltip } from "./Tooltip";

function Demo(props: Partial<React.ComponentProps<typeof Tooltip.Root>> & {
  popupProps?: Partial<React.ComponentProps<typeof Tooltip.Popup>>;
  label?: string;
}) {
  const { popupProps, label = "Helpful tip", ...rootProps } = props;
  return (
    <Tooltip.Provider delay={0}>
      <Tooltip.Root {...rootProps}>
        <Tooltip.Trigger>Hover me</Tooltip.Trigger>
        <Tooltip.Popup {...popupProps}>{label}</Tooltip.Popup>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

describe("Tooltip", () => {
  it("renders the trigger", () => {
    render(<Demo />);
    expect(screen.getByRole("button", { name: "Hover me" })).toBeInTheDocument();
    expect(document.querySelector(".tooltip__popup")).toBeNull();
  });

  it("shows on hover", async () => {
    render(<Demo />);
    await userEvent.hover(screen.getByRole("button", { name: "Hover me" }));
    await waitFor(() => {
      expect(document.querySelector(".tooltip__popup")).toHaveTextContent("Helpful tip");
    });
  });

  it("shows on focus", async () => {
    render(<Demo />);
    await userEvent.tab();
    await waitFor(() => {
      expect(document.querySelector(".tooltip__popup")).toBeTruthy();
    });
  });

  it("supports defaultOpen", async () => {
    render(<Demo defaultOpen />);
    await waitFor(() => {
      expect(document.querySelector(".tooltip__popup")).toHaveTextContent("Helpful tip");
    });
  });

  it("hides on mouse leave", async () => {
    render(<Demo />);
    const trigger = screen.getByRole("button", { name: "Hover me" });
    await userEvent.hover(trigger);
    await waitFor(() => expect(document.querySelector(".tooltip__popup")).toBeTruthy());
    await userEvent.unhover(trigger);
    await waitFor(() => expect(document.querySelector(".tooltip__popup")).toBeNull());
  });

  it("merges className onto the popup", async () => {
    render(<Demo defaultOpen popupProps={{ side: "bottom", className: "custom-tip" }} />);
    await waitFor(() => {
      const tip = document.querySelector(".tooltip__popup");
      expect(tip).toHaveClass("tooltip__popup", "custom-tip");
      expect(tip).toHaveAttribute("data-side", "bottom");
    });
  });

  it("marks the trigger as expanded while open", async () => {
    render(<Demo defaultOpen />);
    const trigger = screen.getByRole("button", { name: "Hover me" });
    await waitFor(() => {
      expect(document.querySelector(".tooltip__popup")).toBeTruthy();
      expect(trigger).toHaveAttribute("data-popup-open");
    });
  });
});
