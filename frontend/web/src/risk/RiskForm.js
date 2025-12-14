import { useState } from "react";
import { createRiskProfile } from "../api/backend";

function RiskForm({ userId, onSubmitted }) {
  const [answers, setAnswers] = useState(
    Array(10).fill(0)
  );
  const [error, setError] = useState(null);

  const handleChange = (index, value) => {
    const updated = [...answers];
    updated[index] = Number(value);
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    const payload = {
      user_id: userId,
      q1: answers[0],
      q2: answers[1],
      q3: answers[2],
      q4: answers[3],
      q5: answers[4],
      q6: answers[5],
      q7: answers[6],
      q8: answers[7],
      q9: answers[8],
      q10: answers[9],
    };

    try {
      await createRiskProfile(payload);
      onSubmitted();
    } catch {
      setError("Failed to submit risk profile");
    }
  };

  return (
    <div>
      <h3>Risk Assessment</h3>

      {answers.map((value, i) => (
        <div key={i}>
          <label>Question {i + 1}:</label>
          <select
            value={value}
            onChange={(e) => handleChange(i, e.target.value)}
          >
            <option value={0}>Low</option>
            <option value={1}>Medium</option>
            <option value={2}>High</option>
          </select>
        </div>
      ))}

      <br />
      <button onClick={handleSubmit}>Submit Risk Profile</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default RiskForm;
