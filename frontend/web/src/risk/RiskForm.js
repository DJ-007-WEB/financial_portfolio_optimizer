import { useState } from "react";
import RiskResult from "./RiskResult";
import { createRiskProfile } from "../api/backend";
import "./RiskForm.css";

export default function RiskForm({ user }) {
  const questions = [
    "How comfortable are you with market volatility?",
    "What is your investment horizon?",
    "How would you react to a market crash?",
    "What is your income stability?",
    "What percentage of savings are you investing?",
    "Have you invested in equities before?",
    "How often do you track investments?",
    "What return do you expect?",
    "How important is capital protection?",
    "Would you accept short-term losses?"
  ];

  const [answers, setAnswers] = useState(
    Array(questions.length).fill("Low")
  );
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = {
        user_id: user.id,
        answers,
      };
      const res = await createRiskProfile(data);
      setResult(res);
    } catch (err) {
      alert("Failed to submit risk profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="risk-card">
      <h2>Risk Assessment</h2>
      <p className="subtitle">
        Help us understand your risk-taking capacity
      </p>

      {questions.map((q, i) => (
        <div key={i} className="question">
          <label>{q}</label>
          <select
            value={answers[i]}
            onChange={(e) => handleChange(i, e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      ))}

      <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
        {loading ? "Submitting..." : "Submit Risk Profile"}
      </button>

      {result && <RiskResult result={result} />}
    </div>
  );
}
