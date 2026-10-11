"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const links = [
  { label: "How it works", href: "#how-it-works" },
  { label: "For vendors", href: "#vendors" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#EADFF0] bg-[#FCFAFD]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <img
            className="w-[56px] object-contain"
            src="/images/logo.png"
            alt="Bukka logo"
          />
          <span className="text-xl font-bold tracking-tight text-[#351B46]">
            Bukka
          </span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden items-center gap-8 font-medium text-gray-600 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-[#763C92]"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="hidden rounded-full px-4 py-2.5 text-sm font-semibold text-[#351B46] transition-colors hover:text-[#763C92] sm:block"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-[#763C92] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#763C92]/20 transition-all duration-300 hover:bg-[#5D2D75] hover:shadow-xl hover:shadow-[#763C92]/25 sm:px-6"
          >
            Get started
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="rounded-full p-2 text-[#351B46] hover:bg-[#F7F0FA] md:hidden"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-[#EADFF0] bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 font-medium text-gray-700 hover:bg-[#F7F0FA] hover:text-[#763C92]"
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 font-medium text-gray-700 hover:bg-[#F7F0FA] hover:text-[#763C92]"
            >
              Log in
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
