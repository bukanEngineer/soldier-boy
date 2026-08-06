// EmptyState.jsx — text-only empty state (illustration omitted per current design direction).

function EmptyState({ title, sub, compact = false }) {
  return (
    <div className={"sx-empty" + (compact ? " is-compact" : "")}>
      {title && <div className="sx-empty__title">{title}</div>}
      {sub && <div className="sx-empty__sub">{sub}</div>}
    </div>
  );
}

window.EmptyState = EmptyState;
