type OrderStatus = "pending" | "completed" | "cancelled";

interface OrderStatusBadgeProps {
  status: string | null;
}

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-600/10",
  completed: "bg-green-50 text-green-700 ring-green-600/10",
  cancelled: "bg-red-50 text-red-700 ring-red-600/10",
};

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const normalizedStatus = status?.toLowerCase() ?? "";
  const knownStatus = Object.hasOwn(statusStyles, normalizedStatus);

  const label = status
    ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
    : "Unknown";

  const className = knownStatus
    ? statusStyles[normalizedStatus as OrderStatus]
    : "bg-[#F7F0FA] text-[#763C92] ring-[#763C92]/10";

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${className}`}
    >
      {label}
    </span>
  );
}
