import "./TopBar.css";

export default function TopBar({ user }) {
  return (
    <header className="topbar">
      <h1>Dashboard</h1>

      <div className="user-info">
        <span>Hello, {user?.name || "Investor"}</span>
        <div className="avatar">
          {user?.name?.[0]?.toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
}
