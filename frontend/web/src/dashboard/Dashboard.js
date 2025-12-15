import { useEffect, useRef, useState } from "react";
import "./Dashboard.css";
import InfoCard from "../components/InfoCard";
import PortfolioSection from "../portfolio/PortfolioSection";
import RiskSection from "../risk/RiskSection";

export default function Dashboard({ user, activeSection }) {
  const [riskProfile, setRiskProfile] = useState(null);
  const dashboardRef = useRef(null);
  const riskRef = useRef(null);
  const portfolioRef = useRef(null);

  useEffect(() => {
    const sectionMap = {
      dashboard: dashboardRef,
      risk: riskRef,
      portfolio: portfolioRef,
    };

    const target = sectionMap[activeSection];
    if (target?.current) {
      target.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [activeSection]);

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header" ref={dashboardRef}>
        <h2>Welcome, {user?.name || "Investor"} 👋</h2>
        <p className="subtitle">
          Track your risk profile and optimize your investments intelligently
        </p>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-cards">
        <InfoCard
          title="Risk Category"
          value={riskProfile?.category || "Not Assessed"}
          subtitle="Based on your answers"
        />

        <InfoCard
          title="Portfolio Status"
          value={riskProfile ? "Ready" : "Incomplete"}
          subtitle="Complete risk assessment first"
        />

        <InfoCard
          title="AI Engine"
          value="Enabled"
          subtitle="Smart allocation"
        />
      </div>

      {/* Risk Profile Section */}
      <div className="dashboard-section" ref={riskRef}>
        <RiskSection
          user={user}
          onRiskChange={setRiskProfile}
        />
      </div>

      {/* Portfolio Optimizer */}
      <div className="dashboard-section" ref={portfolioRef}>
        <PortfolioSection
          user={user}
          riskProfile={riskProfile}
        />
      </div>
    </div>
  );
}
