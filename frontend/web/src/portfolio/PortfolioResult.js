function PortfolioResult({ data }) {
  if (!data || !data.recommended_weights) {
    return <p>Loading portfolio results...</p>;
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Optimization Result</h3>

      <p>
        <strong>Strategy:</strong> {data.strategy_used}
      </p>

      <h4>Recommended Allocation</h4>
      <ul>
        {Object.entries(data.recommended_weights).map(
          ([symbol, weight]) => (
            <li key={symbol}>
              {symbol}: {(weight * 100).toFixed(2)}%
            </li>
          )
        )}
      </ul>

      <p>
        <strong>Expected Return:</strong> {data.expected_return}
      </p>
      <p>
        <strong>Expected Risk:</strong> {data.expected_risk}
      </p>
      <p>
        <strong>Sharpe Ratio:</strong> {data.sharpe_ratio}
      </p>
    </div>
  );
}

export default PortfolioResult;
