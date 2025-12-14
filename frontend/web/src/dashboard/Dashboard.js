import { useState } from "react";
import RiskForm from "../risk/RiskForm";
import RiskResult from "../risk/RiskResult";
import SymbolInput from "../portfolio/SymbolInput";
import PortfolioResult from "../portfolio/PortfolioResult";

function Dashboard({ user }) {
  const [riskSubmitted, setRiskSubmitted] = useState(false);
  const [portfolioData, setPortfolioData] = useState(null);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {user.name}</p>

      {!riskSubmitted ? (
        <RiskForm
          userId={user.id}
          onSubmitted={() => setRiskSubmitted(true)}
        />
      ) : (
        <>
          <RiskResult userId={user.id} />

          <hr />

          <SymbolInput
            userId={user.id}
            onOptimized={setPortfolioData}
          />

          {portfolioData && (
            <PortfolioResult data={portfolioData} />
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
