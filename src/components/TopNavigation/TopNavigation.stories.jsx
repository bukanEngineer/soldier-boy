import { TopNavigation } from "./TopNavigation";
import { SidebarProvider, useSidebar } from "../Sidebar/SidebarContext";

export default {
  title: "P1 Components/Top Navigation",
  component: TopNavigation,
  parameters: { layout: "fullscreen" },
  argTypes: {
    account: {
      control: "inline-radio",
      options: ["personal", "business", "sandbox"],
    },
    notifications: { control: { type: "number", min: 0, max: 99 } },
  },
};

export const Personal = {
  args: {
    account: "personal",
    notifications: 3,
    user: { name: "John Doe", initials: "JD" },
    onMenuAction: () => {},
    onMenuClick: () => {},
  },
};

export const Business = {
  args: {
    account: "business",
    notifications: 12,
    // Business leads with the person; `role` comes from an API (e.g. Admin,
    // Operations, Developer). No company name is shown.
    user: { name: "John Doe", role: "Admin", initials: "JD" },
    onMenuAction: () => {},
    onMenuClick: () => {},
  },
};

export const Sandbox = {
  args: {
    account: "sandbox",
    notifications: 0,
    user: { name: "John Doe", company: "ABC Pte. Ltd.", initials: "AB" },
    onMenuAction: () => {},
    onMenuClick: () => {},
  },
};

// Same props as `Business` — narrower viewport demonstrates the responsive
// (hamburger + collapsed profile) behavior; there is no separate mobile prop.
export const Responsive = {
  args: { ...Business.args },
  parameters: { viewport: { defaultViewport: "mobile" } },
};

// Demonstrates TopNavigation auto-wiring to SidebarContext — hamburger is
// visible on desktop and toggles the sidebar open/collapsed state.
function SidebarState() {
  const { open } = useSidebar();
  return (
    <p style={{ padding: "var(--space-4)" }}>
      Sidebar is <strong>{open ? "open" : "collapsed"}</strong>
    </p>
  );
}

export const WithCollapsibleSidebar = {
  render: (args) => (
    <SidebarProvider>
      <TopNavigation {...args} />
      <SidebarState />
    </SidebarProvider>
  ),
  args: {
    account: "personal",
    notifications: 3,
    user: { name: "John Doe", initials: "JD" },
  },
};
