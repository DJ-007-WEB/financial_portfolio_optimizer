import { useState } from "react";
import { optimizePortfolio } from "../api/backend";

function SymbolInput({ userId, onOptimized }) {
  const [symbols, setSymbols] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOptimize = async () => {
    const symbolList = symbols
      .split(",")
      .map(s => s.trim().toUpperCase())
      .filter(Boolean);

    if (symbolList.length === 0) {
      setError("Please enter at least one symbol");
      return;
    }

    try {
      setLoading(true);
      const result = await optimizePortfolio(userId, symbolList);

      if (!result || !result.recommended_weights) {
        throw new Error("Invalid portfolio response");
}

      onOptimized(result);
      setError(null);
    } catch {
      setError("Failed to optimize portfolio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Portfolio Optimizer</h3>

      <input
        type="text"
        placeholder="e.g. RELIANCE, TCS, INFY"
        value={symbols}
        onChange={(e) => setSymbols(e.target.value)}
        style={{ width: "300px" }}
      />

      <br /><br />

      <button onClick={handleOptimize} disabled={loading}>
        {loading ? "Optimizing..." : "Optimize Portfolio"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default SymbolInput;
