export default function PortfolioResult({ result }) {
  if (!result) return null;

  const {
    strategy_used,
    recommended_weights,
    expected_return,
    expected_risk,
    sharpe_ratio,
  } = result;

  return (
    <div className="result-box">
      <h3>Optimization Result</h3>

      <p>
        <strong>Strategy:</strong> {strategy_used}
      </p>

      <h4>Recommended Allocation</h4>
      <ul>
        {recommended_weights &&
          Object.entries(recommended_weights).map(
            ([symbol, weight]) => (
              <li key={symbol}>
                {symbol}: {(weight * 100).toFixed(2)}%
              </li>
            )
          )}
      </ul>

      <div className="metrics">
        <p><strong>Expected Return:</strong> {expected_return}</p>
        <p><strong>Expected Risk:</strong> {expected_risk}</p>
        <p><strong>Sharpe Ratio:</strong> {sharpe_ratio}</p>
      </div>
    </div>
  );
}
