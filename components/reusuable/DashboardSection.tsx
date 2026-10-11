import type { ReactNode } from "react";
import Link from "next/link";

interface DashboardSectionProps {
  title: string;
  children: ReactNode;
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
}

export default function DashboardSection({
  title,
  children,
  viewAllHref,
  viewAllLabel = "View all",
  className = "",
}: DashboardSectionProps) {
  return (
    <section
      className={`overflow-hidden rounded-2xl border border-[#EADFF0] bg-white shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between gap-4 border-b border-[#F0E7F4] px-5 py-5 sm:px-6">
        <h2 className="font-bold text-[#351B46]">{title}</h2>

        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="shrink-0 text-sm font-semibold text-[#763C92] underline-offset-4 transition-colors hover:text-[#5D2D75] hover:underline"
          >
            {viewAllLabel}
          </Link>
        )}
      </div>

      {children}
    </section>
  );
}
