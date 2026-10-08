import type { ComponentType, SVGProps } from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import * as ILLUSTRATIONS from "./illustrations/index";
import { EmptyState, EmptyStateMedia } from "../EmptyState/EmptyState";
import { ErrorResponse } from "../ErrorResponse/ErrorResponse";

const all = Object.entries(ILLUSTRATIONS) as [string, ComponentType<SVGProps<SVGSVGElement>>][];

describe("illustrations", () => {
  it("ships the 28 design-system illustrations", () => {
    expect(all).toHaveLength(28);
  });

  it.each(all)("%s is a decorative 120px inline svg", (_name, Illustration) => {
    const { container } = render(<Illustration />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("width", "120");
    expect(container.querySelector("img")).toBeNull();
    expect(container.innerHTML).not.toContain("data:image");
  });

  it("lets callers resize and label one", () => {
    const { container } = render(
      <ILLUSTRATIONS.RocketIllustration
        width={64}
        height={64}
        aria-hidden={false}
        role="img"
        aria-label="Launch"
      />,
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "64");
    expect(svg).toHaveAttribute("aria-label", "Launch");
    expect(svg).not.toHaveAttribute("aria-hidden", "true");
  });

  // Figma exports every gradient/filter with ids like paint0_linear_458_37897.
  // Inline SVGs share one id namespace per page, so two illustrations must
  // never reuse an id or one would paint with the other's gradient.
  it("gives every illustration its own gradient / filter / clip ids", () => {
    const seen = new Map<string, string>();
    for (const [name, Illustration] of all) {
      const { container, unmount } = render(<Illustration />);
      for (const el of container.querySelectorAll("[id]")) {
        const id = el.getAttribute("id") as string;
        expect(seen.get(id), `${id} is used by both ${seen.get(id)} and ${name}`).toBeUndefined();
        seen.set(id, name);
      }
      unmount();
    }
    expect(seen.size).toBeGreaterThan(0);
  });
});

describe("illustration slots", () => {
  it("EmptyState renders `media` before the title, and EmptyStateMedia as a child", () => {
    const { container, rerender } = render(
      <EmptyState media={<ILLUSTRATIONS.BankIllustration />} title="Nothing here" />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.firstElementChild).toHaveClass("empty__media");
    expect(root.querySelector(".empty__media svg")).toBeTruthy();
    expect(root.children[1]).toHaveClass("empty__title");

    rerender(
      <EmptyState>
        <EmptyStateMedia>
          <ILLUSTRATIONS.BankIllustration />
        </EmptyStateMedia>
      </EmptyState>,
    );
    expect(container.querySelector(".empty__media svg")).toBeTruthy();
  });

  it("ErrorResponse renders `media` before the code", () => {
    const { container } = render(
      <ErrorResponse media={<ILLUSTRATIONS.LockIllustration />} code="403" title="Denied" />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.firstElementChild).toHaveClass("error__media");
    expect(root.children[1]).toHaveClass("error__code");
  });
});
