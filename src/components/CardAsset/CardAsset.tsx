import React from "react";
import { Icon } from "../Icon/Icon";
import { Card } from "../Card/Card";
import { List } from "../List/List";
import { ListAsset } from "../ListAsset/ListAsset";
import { cn } from "../../lib/cn";
import "./CardAsset.css";

export type CardAssetNetwork = {
  name?: string;
  logo?: React.ReactNode;
};

export type CardAssetItem = {
  symbol?: string;
  subtitle?: React.ReactNode;
  logo?: React.ReactNode;
  balance?: React.ReactNode;
  fiat?: React.ReactNode;
  networks?: CardAssetNetwork[];
};

export type CardAssetProps = Omit<React.ComponentProps<"section">, "title"> & {
  title?: React.ReactNode;
  assets?: CardAssetItem[];
  banner?: React.ReactNode;
  onRefresh?: () => void;
  onAdd?: (asset: CardAssetItem) => void;
  onSend?: (asset: CardAssetItem) => void;
};

/** Portfolio asset list card. */
export function CardAsset({
  title = "My Assets",
  assets = [],
  banner,
  onRefresh,
  onAdd,
  onSend,
  className,
  ...rest
}: CardAssetProps) {
  return (
    <Card className={cn("card-asset", className)} {...rest}>
      <header className="card-asset__header">
        <div className="card-asset__title">
          <span>{title}</span>
          {onRefresh && (
            <button
              type="button"
              className="card-asset__refresh"
              onClick={onRefresh}
              aria-label="Refresh"
            >
              <Icon name="refresh" size={20} />
            </button>
          )}
        </div>
      </header>

      {banner && (
        <div className="card-asset__banner" role="status">
          <Icon name="info" size={24} className="card-asset__banner-icon" />
          <p className="card-asset__banner-text">{banner}</p>
        </div>
      )}

      <List className="card-asset__list">
        {assets.map((a, i) => {
          const networks = a.networks ?? [];
          return (
            <ListAsset
              key={a.symbol || i}
              symbol={a.symbol}
              subtitle={a.subtitle}
              icon={a.logo}
              balance={a.balance}
              balanceSub={a.fiat}
              networks={networks.slice(0, MAX_NETWORKS).map((n, j) => (
                <Network key={n.name || j} logo={n.logo} name={n.name} />
              ))}
              networkOverflow={Math.max(0, networks.length - MAX_NETWORKS)}
              onAdd={onAdd ? () => onAdd(a) : undefined}
              onSend={onSend ? () => onSend(a) : undefined}
            />
          );
        })}
      </List>
    </Card>
  );
}

const MAX_NETWORKS = 4;

function Network({ logo, name }: { logo?: React.ReactNode; name?: string }) {
  return (
    <span className="card-asset__network" title={name}>
      {logo || (
        <span className="card-asset__network-initial" aria-hidden="true">
          {(name || "?").charAt(0)}
        </span>
      )}
    </span>
  );
}
