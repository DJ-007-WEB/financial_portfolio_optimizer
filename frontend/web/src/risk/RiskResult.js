import { useEffect, useState } from "react";
import { getRiskProfile } from "../api/backend";

function RiskResult({ userId }) {
  const [risk, setRisk] = useState(null);

  useEffect(() => {
    getRiskProfile(userId).then(setRisk);
  }, [userId]);

  if (!risk) return <p>Loading risk profile...</p>;

  return (
    <div>
      <h3>Your Risk Profile</h3>
      <p>
        Risk Category: <strong>{risk.category}</strong>
      </p>
    </div>
  );
}

export default RiskResult;
