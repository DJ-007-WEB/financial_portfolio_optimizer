import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import "./DashboardLayout.css";

export default function DashboardLayout({
  user,
  children,
  onLogout,
  onNavigate,
  activeSection,
}) {
  return (
    <div className="app-shell">
      {/* Left Navigation */}
      <Sidebar
        activeSection={activeSection}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      {/* Main Area */}
      <div className="main-area">
        <TopBar user={user} onLogout={onLogout} />

        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
}
