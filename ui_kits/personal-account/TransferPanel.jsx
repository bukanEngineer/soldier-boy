// TransferPanel.jsx — tab strip + body
const { useState: __useStateTP } = React;

function TransferPanel() {
  const [tab, setTab] = __useStateTP("in");
  const tabs = [
    { id: "in", label: "Transfer In" },
    { id: "out", label: "Transfer Out" },
    { id: "swap", label: "Swap" },
  ];
  return (
    <section className="sx-card sx-transfer">
      <div className="sx-tabs" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={"sx-tab" + (tab === t.id ? " is-active" : "")}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="sx-transfer__body">
        <EmptyState
          title="Verify your account and complete the assessment to transact."
          sub="You won't be able to initiate any transactions until verification is completed."
        />
      </div>
    </section>
  );
}

window.TransferPanel = TransferPanel;
