import "./TopBar.css";

export default function TopBar({ user, onLogout }) {
  const initial = user?.name?.[0]?.toUpperCase() || "U";

  const handleProfileClick = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header className="topbar">
      <h1>Dashboard</h1>

      <div
        className="user-info"
        title={user?.id ? `User ID: ${user.id}` : "Profile"}
      >
        <span>Hello, {user?.name || "Investor"}</span>
        <div
          className="avatar"
          onClick={handleProfileClick}
          style={{ cursor: onLogout ? "pointer" : "default" }}
          role={onLogout ? "button" : undefined}
        >
          {initial}
        </div>
      </div>
    </header>
  );
}
