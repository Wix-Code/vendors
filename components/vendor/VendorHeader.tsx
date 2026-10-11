import { ArrowLeft, Clock, Location } from "iconsax-react";
import Link from "next/link";

interface Props {
  vendor: {
    name: string;
    description: string;
    location: string;
    openingHours: string;
    image: string;
  };
}

export default function VendorHeader({ vendor }: Props) {
  return (
    <section className="relative isolate min-h-[360px] overflow-hidden bg-[#351B46] sm:min-h-[420px]">
      {/* Store cover */}
      <img
        src={vendor.image}
        alt={`${vendor.name} storefront cover`}
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Contrast overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1D1027]/90 via-[#351B46]/45 to-black/15" />

      {/* Back link */}
      <Link
        href="/"
        className="absolute left-4 top-5 z-10 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/95 px-4 py-2.5 text-sm font-semibold text-[#351B46] shadow-sm transition hover:bg-[#F7F0FA] hover:text-[#763C92] sm:left-6 sm:top-6"
      >
        <ArrowLeft size={18} color="currentColor" />
        <span>Bukka</span>
      </Link>

      {/* Store information */}
      <div className="relative z-10 mx-auto flex min-h-[360px] max-w-7xl items-end px-5 pb-8 pt-24 text-white sm:min-h-[420px] sm:px-8 sm:pb-12">
        <div className="max-w-3xl">
          <span className="mb-3 inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-white/90 backdrop-blur-sm">
            Online Store
          </span>

          <h1 className="text-3xl font-bold tracking-tight drop-shadow-sm sm:text-4xl md:text-5xl">
            {vendor.name}
          </h1>

          {vendor.description && (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85 sm:text-base sm:leading-7">
              {vendor.description}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-white/90">
            {vendor.location && (
              <span className="flex items-center gap-2">
                <Location size={18} color="currentColor" />
                {vendor.location}
              </span>
            )}

            {vendor.openingHours && (
              <span className="flex items-center gap-2">
                <Clock size={18} color="currentColor" />
                {vendor.openingHours}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
