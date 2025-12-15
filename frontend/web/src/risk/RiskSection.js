import { useEffect, useState } from "react";
import RiskForm from "./RiskForm";
import RiskResult from "./RiskResult";
import { getRiskProfile } from "../api/backend";
import "./RiskSection.css";

export default function RiskSection({ user }) {
  const [riskProfile, setRiskProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 🔒 Guard INSIDE the effect (this is the key fix)
    if (!user || !user.id) return;

    async function fetchRisk() {
      try {
        setLoading(true);
        const data = await getRiskProfile(user.id);

        if (data && data.category) {
          setRiskProfile(data);
        }
      } catch (err) {
        console.log("No risk profile yet");
      } finally {
        setLoading(false);
      }
    }

    fetchRisk();
  }, [user]);

  // Optional UI guard (safe, no hooks below this)
  if (!user) {
    return null;
  }

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
        <RiskResult riskProfile={riskProfile} />
      ) : (
        <RiskForm
          user={user}
          onSubmitted={(profile) => setRiskProfile(profile)}
        />
      )}
    </div>
  );
}
