interface MetricCardProps {
  label: string;
  value: string | number;
  detail: string;
}

function MetricCard({
  label,
  value,
  detail,
}: MetricCardProps) {
  const isPositive = detail.trim().startsWith("+");

  return (
    <article className="metric-card">
      <div className="metric-card-top">
        <span className="metric-label">{label}</span>

        <span
          className={`metric-trend ${
            isPositive ? "up" : "neutral"
          }`}
          aria-hidden="true"
        >
          {isPositive ? "↗" : "—"}
        </span>
      </div>

      <strong className="metric-value">{value}</strong>

      <div className="metric-card-footer">
        <span className="metric-detail">{detail}</span>
      </div>
    </article>
  );
}

export default MetricCard;