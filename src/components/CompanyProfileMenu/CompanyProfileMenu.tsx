import React from "react";
import { Menu } from "../Menu/Menu";
import "./CompanyProfileMenu.css";

export type CompanyProfileCompany = {
  id: string;
  name: string;
  type?: string;
  selected?: boolean;
};

export type CompanyProfileAction = {
  id: string;
  icon?: string;
  label: React.ReactNode;
};

const DEFAULT_ACTIONS: CompanyProfileAction[] = [
  { id: "company-settings", icon: "business", label: "Company Settings" },
  { id: "teams", icon: "group", label: "Teams" },
  { id: "billing", icon: "receipt_long", label: "Billing" },
  { id: "statements", icon: "description", label: "Statements" },
];

export type CompanyProfileMenuProps = {
  switchCompany?: boolean;
  companies?: CompanyProfileCompany[];
  onSwitch?: (companyId: string) => void;
  actions?: CompanyProfileAction[];
  onAction?: (actionId: string) => void;
};

/**
 * Company switcher + action items for the sidebar company trigger.
 * Must be rendered inside `Menu.Popup`.
 */
export function CompanyProfileMenu({
  switchCompany = false,
  companies = [],
  onSwitch,
  actions = DEFAULT_ACTIONS,
  onAction,
}: CompanyProfileMenuProps) {
  const selectedId = companies.find((c) => c.selected)?.id ?? null;

  return (
    <>
      {switchCompany && companies.length > 0 && (
        <>
          <Menu.RadioGroup
            value={selectedId}
            onValueChange={(value) => {
              if (value != null) onSwitch?.(String(value));
            }}
          >
            <Menu.GroupLabel>Switch Company</Menu.GroupLabel>
            {companies.map((c) => (
              <Menu.RadioItem key={c.id} value={c.id} secondary={c.type}>
                {c.name}
              </Menu.RadioItem>
            ))}
          </Menu.RadioGroup>
          {actions.length > 0 && <Menu.Separator />}
        </>
      )}

      {actions.map((a) => (
        <Menu.Item key={a.id} icon={a.icon} onClick={() => onAction?.(a.id)}>
          {a.label}
        </Menu.Item>
      ))}
    </>
  );
}
