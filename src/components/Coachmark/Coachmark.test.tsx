import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Coachmark } from "./Coachmark";

describe("Coachmark", () => {
  const targets: HTMLElement[] = [];

  const createTarget = () => {
    const el = document.createElement("button");
    el.textContent = "Target element";
    document.body.appendChild(el);
    targets.push(el);
    return { current: el };
  };

  afterEach(() => {
    targets.splice(0).forEach((el) => el.remove());
  });

  it("renders when open with a target", async () => {
    const target = createTarget();
    render(
      <Coachmark
        target={target}
        open
        title="Welcome"
        body="This is a feature tour"
        step={1}
        totalSteps={3}
      />,
    );
    expect(await screen.findByText("Welcome")).toBeInTheDocument();
    expect(screen.getByText("This is a feature tour")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    const target = createTarget();
    render(<Coachmark target={target} open={false} title="Hidden" body="Not shown" />);
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });

  it("forwards className onto the popup", async () => {
    const target = createTarget();
    render(<Coachmark target={target} open title="T" className="custom" />);
    expect(await screen.findByRole("dialog")).toHaveClass("custom");
  });

  it("shows Next and calls onNext", async () => {
    const onNext = vi.fn();
    const target = createTarget();
    render(
      <Coachmark
        target={target}
        open
        title="Step"
        step={1}
        totalSteps={3}
        onNext={onNext}
      />,
    );
    await userEvent.click(await screen.findByRole("button", { name: "Next" }));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it("shows Got it on the last step and calls onDismiss", async () => {
    const onDismiss = vi.fn();
    const target = createTarget();
    render(
      <Coachmark
        target={target}
        open
        title="Done"
        step={3}
        totalSteps={3}
        onDismiss={onDismiss}
      />,
    );
    await userEvent.click(await screen.findByRole("button", { name: "Got it" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("dismisses from the close control", async () => {
    const onDismiss = vi.fn();
    const target = createTarget();
    render(
      <Coachmark target={target} open title="Welcome" body="Body" onDismiss={onDismiss} />,
    );
    const dialog = await screen.findByRole("dialog");
    await userEvent.click(within(dialog).getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalled();
  });

  it("closes on Escape", async () => {
    const onDismiss = vi.fn();
    const target = createTarget();
    render(
      <Coachmark target={target} open title="Welcome" body="Body" onDismiss={onDismiss} />,
    );
    await screen.findByRole("dialog");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(onDismiss).toHaveBeenCalled());
  });
});
