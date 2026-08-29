
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
  return (
    <article className="metric-card">
      <span className="metric-label">{label}</span>

      <strong className="metric-value">{value}</strong>

      <span className="metric-detail">{detail}</span>
    </article>
  );
}

export default MetricCard;

