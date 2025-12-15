import "./InfoCard.css";

export default function InfoCard({ title, value, subtitle }) {
  return (
    <div className="info-card">
      <p className="info-title">{title}</p>
      <h2 className="info-value">{value}</h2>
      {subtitle && <p className="info-subtitle">{subtitle}</p>}
    </div>
  );
}
