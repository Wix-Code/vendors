import type { ReactNode } from "react";

interface DashboardStatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  tone?: "primary" | "success" | "warning" | "danger";
}

const toneStyles = {
  primary: "bg-[#F7F0FA] text-[#763C92]",
  success: "bg-green-50 text-green-600",
  warning: "bg-amber-50 text-amber-600",
  danger: "bg-red-50 text-red-600",
};

export default function DashboardStatCard({
  label,
  value,
  icon,
  tone = "primary",
}: DashboardStatCardProps) {
  return (
    <div className="rounded-2xl border border-[#EADFF0] bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#351B46]/5">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${toneStyles[tone]}`}
      >
        {icon}
      </div>

      <p className="mt-4 break-words text-2xl font-bold tracking-tight text-[#351B46]">
        {value}
      </p>

      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </div>
  );
}
