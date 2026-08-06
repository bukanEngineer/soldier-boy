// Type declarations for non-TS modules used across the design system.

/** CSS file imports (side-effect only) */
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

/** SVG imports (used by @svgr or as URL) */
declare module "*.svg" {
  import type { FC, SVGProps } from "react";
  const ReactComponent: FC<SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
