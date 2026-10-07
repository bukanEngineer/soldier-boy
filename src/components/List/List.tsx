import React, { createContext, useContext } from "react";
import { cn } from "../../lib/cn";
import "./List.css";

// Lets `ListItem` render an <li> inside a `List` and a <div> on its own.
const InListContext = createContext(false);

export type ListProps = React.ComponentProps<"ul"> & {
  /** Draw a divider between items instead of spacing them apart */
  divided?: boolean;
};

/** Vertical stack of `ListItem` rows. Renders a semantic <ul>. */
export function List({ divided = false, className, ...props }: ListProps) {
  return (
    <InListContext.Provider value>
      <ul
        data-divided={divided || undefined}
        className={cn("list", className)}
        {...props}
      />
    </InListContext.Provider>
  );
}

export type ListItemProps = Omit<React.ComponentProps<"div">, "title"> & {
  /** Slot before the text, e.g. an icon or logo */
  leading?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Slot at the end of the row, e.g. an action or chevron */
  trailing?: React.ReactNode;
};

/**
 * One row: `leading` + `title` / `description` + extra columns (`children`) + `trailing`.
 * Domain rows (`ListAsset`, `ListBank`, …) are thin presets over this.
 */
export function ListItem({
  leading,
  title,
  description,
  trailing,
  children,
  className,
  ...props
}: ListItemProps) {
  const inList = useContext(InListContext);
  const Root = (inList ? "li" : "div") as "div";
  const hasText = title != null || description != null;

  return (
    <Root className={cn("list-item", className)} {...props}>
      {(leading != null || hasText) && (
        <div className="list-item__lead">
          {leading != null && <span className="list-item__leading">{leading}</span>}
          {hasText && (
            <div className="list-item__main">
              {title != null && <span className="list-item__title">{title}</span>}
              {description != null && (
                <span className="list-item__description">{description}</span>
              )}
            </div>
          )}
        </div>
      )}
      {children}
      {trailing != null && <div className="list-item__trailing">{trailing}</div>}
    </Root>
  );
}
