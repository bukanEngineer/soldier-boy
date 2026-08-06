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

/** react-dom — types not installed as a devDep (React 19 ships its own) */
declare module "react-dom" {
  export function createPortal(children: React.ReactNode, container: Element | DocumentFragment): React.ReactPortal;
  export function flushSync<T>(fn: () => T): T;
}
