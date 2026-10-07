import React from "react";
import { cn } from "../../lib/cn";
import "./ListSupportedNetwork.css";

export type ListSupportedNetworkProps = Omit<React.ComponentProps<"div">, "children"> & {
  networks?: React.ReactNode[];
  overflow?: number;
  isNew?: boolean;
};

/** Stacked network marks with optional overflow count and NEW badge. */
export function ListSupportedNetwork({
  networks = [],
  overflow = 0,
  isNew = false,
  className,
  ...rest
}: ListSupportedNetworkProps) {
  return (
    <div
      className={cn("supported-network", className)}
      data-new={isNew || undefined}
      {...rest}
    >
      <div className="supported-network__stack">
        {networks.map((node, i) => (
          <span className="supported-network__icon" key={i}>
            {node}
          </span>
        ))}
      </div>
      {overflow > 0 && <span className="supported-network__more">+{overflow}</span>}
      {isNew && <span className="supported-network__badge">NEW</span>}
    </div>
  );
}
