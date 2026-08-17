import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ImportantNotes } from "./ImportantNotes";
import {
  renderSmoke,
  assertClassNameForwarding,
  assertPropSpreading,
} from "../../test-utils";

describe("ImportantNotes", () => {
  // A: Renderability
  it("renders with no props", () => {
    renderSmoke(ImportantNotes);
  });

  it("renders with all optional props", () => {
    render(
      <ImportantNotes tone="warning" title="Please note">
        <p>Transfer may take 1-2 business days.</p>
      </ImportantNotes>,
    );
    expect(screen.getByText("Please note")).toBeInTheDocument();
    expect(
      screen.getByText("Transfer may take 1-2 business days."),
    ).toBeInTheDocument();
  });

  // B: Ergonomics
  it("forwards className", () => {
    assertClassNameForwarding(ImportantNotes);
  });

  it("spreads HTML attributes onto the root", () => {
    assertPropSpreading(ImportantNotes);
  });

  // C: Accessibility
  it("has role=alert (wraps Alert component)", () => {
    render(<ImportantNotes>Notice</ImportantNotes>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  // D: Tone variants
  it("renders with each tone without crashing", () => {
    const tones = ["positive", "critical", "warning", "info", "neutral"];
    tones.forEach((tone) => {
      const { unmount } = render(
        <ImportantNotes tone={tone} title={`Note ${tone}`}>
          Content
        </ImportantNotes>,
      );
      expect(screen.getByText(`Note ${tone}`)).toBeInTheDocument();
      unmount();
    });
  });

  // E: Composability — rich children
  it("accepts complex children", () => {
    render(
      <ImportantNotes title="Fees">
        <ul>
          <li>Platform fee: 0.1%</li>
          <li>Network fee: varies</li>
        </ul>
      </ImportantNotes>,
    );
    expect(screen.getByText("Platform fee: 0.1%")).toBeInTheDocument();
    expect(screen.getByText("Network fee: varies")).toBeInTheDocument();
  });
});
