interface PriceChangeBadgeProps {
  changePercent: number | undefined;
}

export function PriceChangeBadge({ changePercent }: PriceChangeBadgeProps) {
  if (changePercent === undefined) {
    return <span>—</span>;
  }
  const isPositive = changePercent > 0;
  const isNegative = changePercent < 0;

  const className = isPositive
    ? "text-green-600"
    : isNegative
      ? "text-red-600"
      : "text-gray-500";

  return (
    <span className={className}>
      {isPositive ? "+" : ""}
      {changePercent.toFixed(2)}%
    </span>
  );
}
