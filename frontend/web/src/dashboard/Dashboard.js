import "./Dashboard.css";
import InfoCard from "../components/InfoCard";
import PortfolioSection from "../portfolio/PortfolioSection";
import RiskSection from "../risk/RiskSection";

export default function Dashboard({ user }) {
  return (
    <div className="dashboard">
      
      {/* Header */}
      <div className="dashboard-header">
        <h2>Welcome, {user?.name || "Investor"} 👋</h2>
        <p className="subtitle">
          Track your risk profile and optimize your investments intelligently
        </p>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-cards">
        <InfoCard
          title="Risk Category"
          value={user?.riskCategory || "Not Assessed"}
          subtitle="Based on your answers"
        />

        <InfoCard
          title="Portfolio Status"
          value="Active"
          subtitle="Optimization ready"
        />

        <InfoCard
          title="AI Engine"
          value="Enabled"
          subtitle="Smart allocation"
        />
      </div>

      {/* Risk Profile Section */}
      <div className="dashboard-section">
        <RiskSection />
      </div>

      {/* Portfolio Optimizer */}
      <div className="dashboard-section">
        <PortfolioSection />
      </div>

    </div>
  );
}
