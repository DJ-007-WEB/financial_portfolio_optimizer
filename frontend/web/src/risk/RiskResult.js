export default function RiskResult({ result }) {
  if (!result) return null;

  return (
    <div className="risk-result">
      <h3>Your Risk Profile</h3>
      <p className={`risk-badge ${result.category.toLowerCase()}`}>
        {result.category}
      </p>
      <p className="description">
        This profile will be used to optimize your portfolio strategy.
      </p>
    </div>
  );
}
