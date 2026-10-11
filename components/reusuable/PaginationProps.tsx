import Link from "next/link";
import type { ReactNode } from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  createPageHref: (page: number) => string;
};

export default function Pagination({
  currentPage,
  totalPages,
  createPageHref,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between border-t border-[#EADFF0] px-4 py-4 sm:px-6"
    >
      <PageLink
        href={createPageHref(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        Previous
      </PageLink>

      <div className="hidden items-center gap-1 sm:flex">
        {pages.map((page, i) =>
          page === "ellipsis" ? (
            <span key={`ellipsis-${i}`} className="px-2 text-sm text-gray-400">
              …
            </span>
          ) : (
            <Link
              key={page}
              href={createPageHref(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                page === currentPage
                  ? "bg-[#763C92] text-white shadow-sm shadow-[#763C92]/20"
                  : "text-gray-600 hover:bg-[#F7F0FA] hover:text-[#763C92]"
              }`}
            >
              {page}
            </Link>
          ),
        )}
      </div>

      <span className="text-sm text-gray-500 sm:hidden">
        Page {currentPage} of {totalPages}
      </span>

      <PageLink
        href={createPageHref(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  disabled,
  children,
}: {
  href: string;
  disabled: boolean;
  children: ReactNode;
}) {
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className="cursor-not-allowed rounded-full px-4 py-2 text-sm font-medium text-gray-300"
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="rounded-full px-4 py-2 text-sm font-medium text-[#763C92] transition-colors hover:bg-[#F7F0FA] hover:text-[#5D2D75]"
    >
      {children}
    </Link>
  );
}

function getPageNumbers(
  current: number,
  total: number,
): (number | "ellipsis")[] {
  const delta = 1;
  const range: (number | "ellipsis")[] = [];
  const rangeStart = Math.max(2, current - delta);
  const rangeEnd = Math.min(total - 1, current + delta);

  range.push(1);

  if (rangeStart > 2) range.push("ellipsis");

  for (let i = rangeStart; i <= rangeEnd; i++) {
    range.push(i);
  }

  if (rangeEnd < total - 1) range.push("ellipsis");

  if (total > 1) range.push(total);

  return range;
}
