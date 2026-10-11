"use client";

import { useEffect, useMemo, useState } from "react";
import FoodCard from "@/components/reusuable/ProductCard";
import type { Dish } from "@/lib/vendors";
import EmptyState from "./EmptyState";
import { Dropbox } from "iconsax-react";

type Props = {
  dishes: Dish[];
  phone: string;
  vendorId: string;
  workingHours?: string;
};

const TIMEZONE = "Africa/Lagos";

function getMinutesNow(date: Date): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const hour = Number(parts.find((p) => p.type === "hour")?.value) % 24;
  const minute = Number(parts.find((p) => p.type === "minute")?.value);

  return hour * 60 + minute;
}

function toMinutes(hour: string, minute: string | undefined, period: string) {
  let h = Number(hour) % 12;

  if (period.toLowerCase() === "pm") h += 12;

  return h * 60 + Number(minute || 0);
}

const HOURS_REGEX =
  /(\d{1,2})(?::(\d{2}))?\s*(am|pm)\s*(?:-|–|—|to)\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i;

function checkIsOpen(workingHours: string | undefined, now: Date): boolean {
  if (!workingHours) return false;

  const match = workingHours.match(HOURS_REGEX);
  if (!match) return false;

  const [, sh, sm, sp, eh, em, ep] = match;

  const start = toMinutes(sh, sm, sp);
  const end = toMinutes(eh, em, ep);
  const current = getMinutesNow(now);

  if (start < end) {
    return current >= start && current < end;
  }

  return current >= start || current < end;
}

export default function MenuSection({
  workingHours,
  dishes,
  phone,
  vendorId,
}: Props) {
  const [query, setQuery] = useState("");
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60 * 1000);

    return () => clearInterval(timer);
  }, []);

  const isOpen = useMemo(
    () => (currentTime ? checkIsOpen(workingHours, currentTime) : false),
    [workingHours, currentTime],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return dishes;

    return dishes.filter(
      (food) =>
        (food.name ?? "").toLowerCase().includes(q) ||
        (food.description ?? "").toLowerCase().includes(q),
    );
  }, [query, dishes]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      {/* Menu heading */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#351B46]">
            Today&rsquo;s Menu
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {dishes.length} item{dishes.length === 1 ? "" : "s"} available
          </p>

          {workingHours && (
            <p className="mt-1 text-sm text-gray-500">
              Working hours: {workingHours}
            </p>
          )}
        </div>

        {currentTime && (
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${
              isOpen
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isOpen ? "bg-green-500" : "bg-red-500"
              }`}
            />
            {isOpen ? "Open Now" : "Closed"}
          </span>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-10 max-w-md">
        <SearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search dishes by name or description..."
          aria-label="Search menu"
          className="w-full rounded-full border border-[#EADFF0] bg-white py-3 pl-11 pr-5 text-sm text-[#351B46] outline-none transition placeholder:text-gray-400 focus:border-[#763C92] focus:ring-4 focus:ring-[#763C92]/10"
        />
      </div>

      {/* Menu items */}
      {filtered.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              phone={phone}
              vendorId={vendorId}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center sm:py-20">
          <div className="rounded-3xl border border-[#EADFF0] bg-white">
            <EmptyState
              icon={<Dropbox size={28} color="#763C92" />}
              title={
                dishes.length === 0
                  ? "No dishes available"
                  : `No dishes match "${query}"`
              }
              description={
                dishes.length === 0
                  ? "The menu doesn't have any dishes yet."
                  : "Try another search term to find something delicious."
              }
            />
          </div>
        </div>
      )}
    </section>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}
