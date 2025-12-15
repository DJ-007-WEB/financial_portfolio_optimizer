import "./Sidebar.css";

export default function Sidebar({
  activeSection = "dashboard",
  onNavigate = () => {},
  onLogout = () => {},
}) {
  const handleNav = (event, section) => {
    event.preventDefault();
    onNavigate(section);
  };

  return (
    <aside className="sidebar">
      <h2 className="logo">FPO</h2>

      <nav>
        <a
          href="#dashboard"
          className={activeSection === "dashboard" ? "active" : ""}
          onClick={(e) => handleNav(e, "dashboard")}
        >
          Dashboard
        </a>
        <a
          href="#risk"
          className={activeSection === "risk" ? "active" : ""}
          onClick={(e) => handleNav(e, "risk")}
        >
          Risk Profile
        </a>
        <a
          href="#portfolio"
          className={activeSection === "portfolio" ? "active" : ""}
          onClick={(e) => handleNav(e, "portfolio")}
        >
          Portfolio
        </a>
        <a
          href="#market"
          className={activeSection === "market" ? "active" : ""}
          onClick={(e) => handleNav(e, "market")}
        >
          Market
        </a>
        <a
          href="#logout"
          className="logout"
          onClick={(e) => {
            e.preventDefault();
            onLogout();
          }}
        >
          Logout
        </a>
      </nav>
    </aside>
  );
}
