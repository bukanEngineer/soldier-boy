import React from "react";
import { Modal, type ModalRootProps } from "../Modal";
import { cn } from "../../lib/cn";
import "./ModalAssetOverview.css";
import { Icon } from "../Icon/Icon";

export type AssetMethod = {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Icon element. Defaults to a swap icon. */
  icon?: React.ReactNode;
};

export type AssetNetwork = {
  label: string;
  /** Logo / mark element. Falls back to the first letter of `label`. */
  mark?: React.ReactNode;
};

export type ModalAssetOverviewProps = Omit<ModalRootProps, "children"> & {
  /** Asset logo. Falls back to the first two letters of `symbol`. */
  mark?: React.ReactNode;
  symbol: string;
  subtitle?: React.ReactNode;
  /** Transfer methods listed as tappable rows */
  methods?: AssetMethod[];
  /** Supported blockchains */
  networks?: AssetNetwork[];
  /** Supported bank rails, e.g. "FAST, MEPS, SWIFT" */
  banks?: React.ReactNode;
  networkLabel?: React.ReactNode;
  onSelectMethod?: (method: AssetMethod) => void;
  /** Class names for the modal panel */
  className?: string;
};

/** Asset header + transfer methods + supported network / bank, composed from Modal. */
export function ModalAssetOverview({
  mark,
  symbol,
  subtitle,
  methods = [],
  networks = [],
  banks,
  networkLabel = "Supported Network",
  onSelectMethod,
  className,
  ...rootProps
}: ModalAssetOverviewProps) {
  return (
    <Modal.Root {...rootProps}>
      <Modal.Popup size="small" className={cn("asset-ov", className)}>
        <Modal.Header>
          <Modal.Title>
            <span className="asset-ov__header">
              <span className="asset-ov__mark" aria-hidden="true">
                {mark || symbol.slice(0, 2)}
              </span>
              <span className="asset-ov__heading">
                <span className="asset-ov__symbol">{symbol}</span>
                {subtitle && <span className="asset-ov__subtitle">{subtitle}</span>}
              </span>
            </span>
          </Modal.Title>
          <Modal.Close />
        </Modal.Header>
        <Modal.Body>
          <p className="asset-ov__section-label">Available Method:</p>
          <ul className="asset-ov__methods">
            {methods.map((m) => (
              <li key={m.id}>
                <button type="button" className="asset-ov__method" onClick={() => onSelectMethod?.(m)}>
                  <span className="asset-ov__method-icon" aria-hidden="true">
                    {m.icon || <Icon name="swap_horiz" />}
                  </span>
                  <span className="asset-ov__method-text">
                    <span className="asset-ov__method-title">{m.title}</span>
                    {m.description && <span className="asset-ov__method-desc">{m.description}</span>}
                  </span>
                  <Icon name="chevron_right" className="asset-ov__chevron" />
                </button>
              </li>
            ))}
          </ul>

          {(networks.length > 0 || banks) && (
            <div className="asset-ov__support">
              <span className="asset-ov__support-link">{networkLabel}</span>
              {networks.length > 0 && (
                <div className="asset-ov__support-group">
                  <span className="asset-ov__support-key">Blockchain:</span>
                  <div className="asset-ov__networks">
                    {networks.map((n) => (
                      <span className="asset-ov__network" key={n.label}>
                        <span className="asset-ov__network-mark" aria-hidden="true">
                          {n.mark || n.label.slice(0, 1)}
                        </span>
                        {n.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {banks && (
                <div className="asset-ov__support-group">
                  <span className="asset-ov__support-key">Bank:</span>
                  <span className="asset-ov__support-value">{banks}</span>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal.Popup>
    </Modal.Root>
  );
}
