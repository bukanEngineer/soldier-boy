import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Coachmark } from "./Coachmark";
import { renderSmoke } from "../../test-utils";

describe("Coachmark", () => {
  // Create a target ref element
  const createTarget = () => {
    const el = document.createElement("div");
    el.textContent = "Target element";
    document.body.appendChild(el);
    return { current: el };
  };

  // A: Renderability
  it("renders when open with a target", () => {
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
    expect(screen.getByText("Welcome")).toBeInTheDocument();
    expect(screen.getByText("This is a feature tour")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    const target = createTarget();
    render(
      <Coachmark target={target} open={false} title="Hidden" body="Not shown" />,
    );
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });

  // B: Ergonomics
  it("forwards className", () => {
    const target = createTarget();
    render(
      <Coachmark target={target} open title="T" className="custom" />,
    );
    expect(document.querySelector(".custom")).toBeInTheDocument();
  });

  // C: Navigation buttons
  it("shows Next button", () => {
    const target = createTarget();
    render(
      <Coachmark
        target={target}
        open
        title="Step"
        step={1}
        totalSteps={3}
        onNext={() => {}}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Next" }),
    ).toBeInTheDocument();
  });

  it("shows Done button on last step", () => {
    const target = createTarget();
    render(
      <Coachmark
        target={target}
        open
        title="Last step"
        step={3}
        totalSteps={3}
        onDismiss={() => {}}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Got it" }),
    ).toBeInTheDocument();
  });

  // D: Interactions
  it("fires onNext when Next button clicked", async () => {
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
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it("fires onDismiss when Done button clicked", async () => {
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
    await userEvent.click(screen.getByRole("button", { name: "Got it" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  // E: Custom labels
  it("supports custom button labels", () => {
    const target = createTarget();
    render(
      <Coachmark
        target={target}
        open
        title="Step"
        step={1}
        totalSteps={2}
        nextLabel="Continue"
        onNext={() => {}}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Continue" }),
    ).toBeInTheDocument();
  });
});
