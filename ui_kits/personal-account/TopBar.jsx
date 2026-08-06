// TopBar.jsx — notifications + user identity (top-right)
function TopBar({ unread = 2, name = "John Doe", company = "ABC Pte. Ltd." }) {
  return (
    <div className="sx-topbar">
      <button type="button" className="sx-icon-button" aria-label="Notifications">
        <span className="material-symbols-rounded">notifications</span>
        {unread > 0 && <span className="sx-icon-button__badge">{unread}</span>}
      </button>
      <div className="sx-topbar__user">
        <span className="material-symbols-rounded sx-topbar__avatar">person</span>
        <div className="sx-topbar__user-text">
          <div className="sx-topbar__user-name">{name}</div>
          <div className="sx-topbar__user-sub">{company}</div>
        </div>
      </div>
    </div>
  );
}
window.TopBar = TopBar;
