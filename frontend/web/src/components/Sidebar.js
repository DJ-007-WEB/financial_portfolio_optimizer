import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="logo">FPO</h2>

      <nav>
        <a className="active">Dashboard</a>
        <a>Risk Profile</a>
        <a>Portfolio</a>
        <a>Market</a>
        <a className="logout">Logout</a>
      </nav>
    </aside>
  );
}
