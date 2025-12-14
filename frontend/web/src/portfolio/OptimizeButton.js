import { useState } from "react";
import { optimizePortfolio } from "../api/backend";

function OptimizeButton({ userId, symbols, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleOptimize = async () => {
    // -----------------------------
    // 1. Basic validation
    // -----------------------------
    if (!userId) {
      setError("User not found");
      return;
    }

    if (!symbols || symbols.length === 0) {
      setError("Please enter at least one stock symbol");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // -----------------------------
      // 2. API call
      // -----------------------------
      const result = await optimizePortfolio(userId, symbols);

      // -----------------------------
      // 3. Pass result to parent
      // -----------------------------
      onSuccess(result);
    } catch (err) {
      console.error("Optimization error:", err);
      setError("Failed to optimize portfolio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleOptimize} disabled={loading}>
        {loading ? "Optimizing..." : "Optimize Portfolio"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: "8px" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default OptimizeButton;
