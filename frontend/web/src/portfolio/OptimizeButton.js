export default function OptimizeButton({ onClick, loading }) {
  return (
    <button
      className="optimize-btn"
      onClick={onClick}
      disabled={loading}
    >
      {loading ? "Optimizing..." : "Optimize Portfolio"}
    </button>
  );
}
