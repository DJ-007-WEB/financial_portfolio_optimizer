import { useEffect, useState } from "react";
import RiskForm from "./RiskForm";
import RiskResult from "./RiskResult";
import { getRiskProfile } from "../api/backend";
import "./RiskSection.css";

export default function RiskSection({ user, onRiskChange }) {
  const [riskProfile, setRiskProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !user.id) return;

    async function fetchRisk() {
      try {
        setLoading(true);
        const data = await getRiskProfile(user.id);

        if (data && data.category) {
          setRiskProfile(data);
          onRiskChange?.(data);
        }
      } catch (err) {
        // no stored risk profile yet
      } finally {
        setLoading(false);
      }
    }

    fetchRisk();
  }, [user, onRiskChange]);

  if (!user) {
    return null;
  }

  const handleSubmitted = (profile) => {
    setRiskProfile(profile);
    onRiskChange?.(profile);
  };

  return (
    <div className="risk-section card">
      <div className="risk-header">
        <h2>Risk Assessment</h2>

        {riskProfile && (
          <span className="badge-success">
            {riskProfile.category}
          </span>
        )}
      </div>

      {loading ? (
        <p className="risk-loading">Loading risk profile...</p>
      ) : riskProfile ? (
        <RiskResult result={riskProfile} />
      ) : (
        <RiskForm
          user={user}
          onSubmitted={handleSubmitted}
        />
      )}
    </div>
  );
}
