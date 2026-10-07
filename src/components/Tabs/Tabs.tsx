import React from "react";
import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { withClass } from "../../lib/cn";
import "./Tabs.css";

export type TabsRootProps = BaseTabs.Root.Props;

function TabsRoot({ className, ...props }: TabsRootProps) {
  return <BaseTabs.Root className={withClass("tabs", className)} {...props} />;
}

export type TabsListProps = BaseTabs.List.Props & {
  /** Visual variant: underline strip or pill group */
  variant?: "default" | "secondary";
  /** Stretch tabs to fill the available width */
  fill?: boolean;
};

function TabsList({ variant = "default", fill = false, className, ...props }: TabsListProps) {
  return (
    <BaseTabs.List
      data-variant={variant}
      data-fill={fill || undefined}
      className={withClass("tabs__list", className)}
      {...props}
    />
  );
}

export type TabsTabProps = BaseTabs.Tab.Props;

function TabsTab({ className, ...props }: TabsTabProps) {
  return <BaseTabs.Tab className={withClass("tabs__tab", className)} {...props} />;
}

export type TabsPanelProps = BaseTabs.Panel.Props;

function TabsPanel({ className, ...props }: TabsPanelProps) {
  return <BaseTabs.Panel className={withClass("tabs__panel", className)} {...props} />;
}

/**
 * Tabs built on Base UI. Compose the parts:
 *
 *   <Tabs.Root defaultValue="in">
 *     <Tabs.List>
 *       <Tabs.Tab value="in">Transfer In</Tabs.Tab>
 *     </Tabs.List>
 *     <Tabs.Panel value="in">…</Tabs.Panel>
 *   </Tabs.Root>
 */
export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Tab: TabsTab,
  Panel: TabsPanel,
};
