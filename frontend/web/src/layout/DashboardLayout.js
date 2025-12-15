import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import "./DashboardLayout.css";

export default function DashboardLayout({ children }) {
  return (
    <div className="app-shell">
      {/* Left Navigation */}
      <Sidebar />

      {/* Main Area */}
      <div className="main-area">
        <TopBar />

        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
}
