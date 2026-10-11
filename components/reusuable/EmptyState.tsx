import Link from "next/link";
import type { ReactNode } from "react";

type Action =
  | { label: string; href: string; onClick?: never }
  | { label: string; onClick: () => void; href?: never };

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: Action;
};

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  const actionClassName =
    "mt-5 inline-flex items-center justify-center rounded-full bg-[#763C92] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#5D2D75] active:scale-[0.98]";

  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7F0FA] text-[#763C92]">
          {icon}
        </div>
      )}

      <h3 className="font-bold text-[#351B46]">{title}</h3>

      {description && (
        <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-gray-500">
          {description}
        </p>
      )}

      {action &&
        (action.href ? (
          <Link href={action.href} className={actionClassName}>
            {action.label}
          </Link>
        ) : (
          <button
            type="button"
            onClick={action.onClick}
            className={actionClassName}
          >
            {action.label}
          </button>
        ))}
    </div>
  );
}
