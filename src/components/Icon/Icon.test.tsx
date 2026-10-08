import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Icon, isIconName, resolveIcon } from "./Icon";

describe("Icon", () => {
  it("renders an inline svg that is hidden from assistive technology", () => {
    const { container } = render(<Icon name="close" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("data-icon", "close");
    expect(svg?.querySelector("path")).toBeTruthy();
  });

  it("sizes with `size` and colours with `color`", () => {
    const { container } = render(<Icon name="home" size={40} color="red" />);
    const svg = container.querySelector("svg") as SVGElement;
    expect(svg.style.fontSize).toBe("40px");
    expect(svg.style.color).toBe("red");
  });

  it("merges className and forwards other props", () => {
    const { container } = render(<Icon name="home" className="mine" data-testid="x" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("sx-icon", "mine");
    expect(svg).toHaveAttribute("data-testid", "x");
  });

  it("renders nothing for a name outside the vendored set", () => {
    const { container } = render(<Icon name={"not_an_icon" as never} />);
    expect(container.firstChild).toBeNull();
  });

  it("keeps names the old icon font accepted (expand_more, developer_mode, business)", () => {
    for (const name of ["expand_more", "developer_mode", "business"]) {
      expect(isIconName(name), name).toBe(true);
    }
  });
});

describe("resolveIcon", () => {
  it("turns a name into an icon and passes elements through", () => {
    const { container } = render(
      <>
        {resolveIcon("check")}
        {resolveIcon(<b data-testid="mine" />)}
        {resolveIcon("nope")}
        {resolveIcon(null)}
      </>,
    );
    expect(container.querySelectorAll("svg")).toHaveLength(1);
    expect(container.querySelector('[data-testid="mine"]')).toBeTruthy();
  });
});

// Guard: icons are inline SVG now. Anything that renders glyph text through the
// icon font would show the icon *name* as visible text without that font.
describe("icon font", () => {
  it("is not used anywhere in src", () => {
    const root = path.resolve(import.meta.dirname, "../..");
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.(tsx?|css)$/.test(entry.name) && !entry.name.endsWith("Icon.test.tsx")) {
          if (/material-symbols|Material Symbols Rounded|fonts\.googleapis/.test(readFileSync(full, "utf8"))) {
            offenders.push(path.relative(root, full));
          }
        }
      }
    };
    walk(root);
    expect(offenders).toEqual([]);
  });
});
