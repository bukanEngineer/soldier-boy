import React from "react";
import { Modal, type ModalRootProps } from "../Modal";
import { cn } from "../../lib/cn";
import "./ModalAssetSelection.css";

export type AssetOption = {
  id: string;
  symbol: string;
  subtitle?: React.ReactNode;
  /** Asset logo. Falls back to the first two letters of `symbol`. */
  mark?: React.ReactNode;
};

export type ModalAssetSelectionProps = Omit<ModalRootProps, "children"> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Label above the list; pass an empty value to hide it */
  label?: React.ReactNode;
  assets?: AssetOption[];
  onSelect?: (asset: AssetOption) => void;
  /** Class names for the modal panel */
  className?: string;
};

/** Header + tappable asset list, composed from Modal. */
export function ModalAssetSelection({
  title = "Transfer In",
  description,
  label = "Select Asset:",
  assets = [],
  onSelect,
  className,
  ...rootProps
}: ModalAssetSelectionProps) {
  return (
    <Modal.Root {...rootProps}>
      <Modal.Popup size="small" className={cn("asset-sel", className)}>
        <Modal.Header>
          <span className="asset-sel__header">
            <Modal.Title className="asset-sel__title">{title}</Modal.Title>
            {description && (
              <Modal.Description className="asset-sel__desc">{description}</Modal.Description>
            )}
          </span>
          <Modal.Close />
        </Modal.Header>
        <Modal.Body>
          {label && <p className="asset-sel__label">{label}</p>}
          <ul className="asset-sel__list">
            {assets.map((a) => (
              <li key={a.id}>
                <button type="button" className="asset-sel__item" onClick={() => onSelect?.(a)}>
                  <span className="asset-sel__mark" aria-hidden="true">
                    {a.mark || a.symbol.slice(0, 2)}
                  </span>
                  <span className="asset-sel__text">
                    <span className="asset-sel__symbol">{a.symbol}</span>
                    {a.subtitle && <span className="asset-sel__subtitle">{a.subtitle}</span>}
                  </span>
                  <span className="material-symbols-rounded asset-sel__chevron" aria-hidden="true">
                    arrow_forward_ios
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Modal.Body>
      </Modal.Popup>
    </Modal.Root>
  );
}
