// Sidebar.jsx — StraitsX Personal Account left navigation
// Source: Figma /Sidebar-New, dashboard screenshot.
const { useState } = React;

const NAV_ITEMS = [
  { id: "get-started", icon: "flag", label: "Get Started" },
  { id: "home", icon: "home", label: "Home" },
  { id: "earn", icon: "savings", label: "Earn", tag: "New" },
  { id: "mint", icon: "account_balance_wallet", label: "Mint", tag: "New" },
  { id: "history", icon: "receipt_long", label: "Transaction History" },
  { id: "statement", icon: "description", label: "Account Statement" },
  { id: "devtools", icon: "developer_mode", label: "Developer Tools" },
  { id: "team", icon: "badge", label: "Team" },
  { id: "users", icon: "group", label: "Users" },
  { id: "settings", icon: "tune", label: "Settings" },
  { id: "faq", icon: "help", label: "FAQ" },
  { id: "support", icon: "support_agent", label: "Support" },
];

function StraitsXLogomark({ size = 36 }) {
  // The brand's official logomark (paths extracted from Figma).
  return (
    <svg width={size} height={size * (90 / 219)} viewBox="0 0 219.184 89.975" fill="none" aria-hidden="true">
      <path
        d="M 216.132 24.793 L 198.312 10.033 C 189.882 3.033 165.042 -12.737 126.342 19.813 L 79.782 58.973 C 67.572 69.243 47.892 80.263 31.762 66.863 L 23.862 60.323 C 22.772 59.423 22.762 57.753 23.852 56.843 L 66.722 20.783 C 67.562 20.083 68.782 20.073 69.622 20.773 C 72.902 23.493 80.612 29.873 80.652 29.903 C 86.922 35.073 96.012 34.973 102.232 29.743 L 108.652 24.343 C 109.472 23.653 108.962 22.303 107.882 22.343 C 98.592 22.713 93.542 18.523 91.382 16.723 L 73.532 1.953 C 70.372 -0.667 65.782 -0.647 62.642 1.993 L 3.152 52.033 C 1.732 53.223 0.682 54.813 0.242 56.613 C -0.538 59.843 0.612 63.143 3.072 65.183 L 20.892 79.943 C 29.322 86.943 54.162 102.713 92.862 70.163 L 139.422 31.003 C 151.632 20.733 171.322 9.713 187.442 23.113 L 195.342 29.653 C 196.432 30.553 196.442 32.223 195.352 33.133 L 152.482 69.193 C 151.642 69.893 150.422 69.903 149.582 69.203 C 146.302 66.483 138.592 60.103 138.552 60.073 C 132.282 54.903 123.192 55.003 116.972 60.233 L 110.552 65.633 C 109.732 66.323 110.242 67.673 111.322 67.633 C 120.612 67.263 125.662 71.453 127.822 73.253 L 145.652 88.023 C 148.812 90.643 153.402 90.623 156.542 87.983 L 216.032 37.953 C 217.452 36.763 218.502 35.173 218.942 33.373 C 219.722 30.143 218.572 26.843 216.112 24.803 L 216.132 24.793 Z"
        fill="#00D37E"
        fillRule="nonzero"
      />
    </svg>
  );
}

function Sidebar({ active, onSelect }) {
  return (
    <aside className="sx-sidebar">
      <div className="sx-sidebar__brand">
        <StraitsXLogomark size={42} />
        <div>
          <div className="sx-sidebar__brand-name">StraitsX</div>
          <div className="sx-sidebar__brand-sub">Personal Account</div>
        </div>
      </div>
      <nav className="sx-sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={"sx-nav-item" + (active === item.id ? " is-active" : "")}
            onClick={() => onSelect(item.id)}
          >
            <span className="material-symbols-rounded">{item.icon}</span>
            <span className="sx-nav-item__label">{item.label}</span>
            {item.tag && <span className="sx-nav-item__tag">{item.tag}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
}

window.Sidebar = Sidebar;
window.StraitsXLogomark = StraitsXLogomark;
