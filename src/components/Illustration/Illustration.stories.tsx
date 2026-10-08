import React from "react";
import * as ILLUSTRATIONS from "./illustrations/index";

export default {
  title: "Atoms/Illustration",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Spot illustrations from the StraitsX design system, as inline SVG components. Import only the ones you use from `stxdesign-sandbox/illustrations`: `import { RocketIllustration } from \"stxdesign-sandbox/illustrations\"`. They are 120px by default (`width` / `height` override it) and decorative (`aria-hidden`); for a meaningful one pass `aria-hidden={false} role=\"img\" aria-label=\"...\"`. Colours are baked in (the brand gradient), so they do not change with the theme.",
      },
    },
  },
};

export const All = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
      {Object.entries(ILLUSTRATIONS).map(([name, Component]) => {
        const Illustration = Component as React.ComponentType;
        return (
          <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: 16, border: "1px solid var(--border)", borderRadius: 8 }}>
            <Illustration />
            <code style={{ font: "var(--body-small)", color: "var(--text-secondary)", fontFamily: "var(--font-mono)", textAlign: "center" }}>{name}</code>
          </div>
        );
      })}
    </div>
  ),
};

export const Sizes = {
  render: () => (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 24 }}>
      <ILLUSTRATIONS.RocketIllustration width={64} height={64} />
      <ILLUSTRATIONS.RocketIllustration />
      <ILLUSTRATIONS.RocketIllustration width={200} height={200} />
    </div>
  ),
};
