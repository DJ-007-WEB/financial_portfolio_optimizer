import { useState } from "react";
import SymbolInput from "./SymbolInput";
import OptimizeButton from "./OptimizeButton";
import PortfolioResult from "./PortfolioResult";
import { optimizePortfolio } from "../api/backend";
import "./PortfolioSection.css";

export default function PortfolioSection({ user, riskProfile }) {
  const [symbols, setSymbols] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOptimize = async () => {
    if (!symbols.trim()) {
      setError("Please enter at least one stock symbol");
      return;
    }

    if (!user?.id) {
      setError("Please log in again to optimize your portfolio");
      return;
    }

    if (!riskProfile) {
      setError("Complete the risk assessment before optimizing");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const symbolList = symbols
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean);

      const data = await optimizePortfolio(user.id, symbolList);
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to optimize portfolio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portfolio-card">
      <h2>Portfolio Optimizer</h2>
      <p className="subtitle">
        Get AI-powered asset allocation based on your risk profile
      </p>

      <SymbolInput symbols={symbols} setSymbols={setSymbols} />
      <OptimizeButton onClick={handleOptimize} loading={loading} />

      {error && <p className="error">{error}</p>}
      {result && <PortfolioResult result={result} />}
    </div>
  );
}
