import { useState } from "react";
import RiskResult from "./RiskResult";
import { createRiskProfile } from "../api/backend";
import "./RiskForm.css";

const SCORE_MAP = {
  Low: 3,
  Medium: 6,
  High: 9,
};

export default function RiskForm({ user, onSubmitted }) {
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
    if (!user?.id) return;

    setLoading(true);
    try {
      const payload = { user_id: user.id };
      answers.forEach((ans, idx) => {
        const score = SCORE_MAP[ans] ?? SCORE_MAP.Low;
        payload[`q${idx + 1}`] = score;
      });

      const res = await createRiskProfile(payload);
      setResult(res);
      onSubmitted?.(res);
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
