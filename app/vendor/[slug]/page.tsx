import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { after } from "next/server";

import VendorHeader from "@/components/vendor/VendorHeader";
import {
  getVendorBySlug,
  getVendorMenu,
  recordPageView,
} from "@/lib/vendors";
import ProductSection from "@/components/reusuable/ProductSection";
import Pagination from "@/components/reusuable/PaginationProps";

const FALLBACK_COVER_IMAGE =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8";

const PAGE_SIZE = 8;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const vendor = await getVendorBySlug(slug);

  if (!vendor) {
    return {
      title: "Store not found | Bukka",
    };
  }

  return {
    title: `${vendor.name} | Bukka`,
    description:
      vendor.description ||
      `Explore products from ${vendor.name} on Bukka.`,
    openGraph: {
      title: `${vendor.name} | Bukka`,
      description:
        vendor.description ||
        `Discover products from ${vendor.name} on Bukka.`,
      images: [
        vendor.cover_image || FALLBACK_COVER_IMAGE,
      ],
      type: "website",
    },
  };
}

export default async function VendorPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;

  const parsedPage = Number.parseInt(pageParam ?? "1", 10);
  const requestedPage =
    Number.isFinite(parsedPage) && parsedPage > 0
      ? parsedPage
      : 1;

  const vendor = await getVendorBySlug(slug);

  if (!vendor) {
    notFound();
  }

  const allProducts = await getVendorMenu(vendor.id);

  after(async () => {
    try {
      await recordPageView(vendor.id);
    } catch (error) {
      console.error("Failed to record vendor page view:", error);
    }
  });

  const totalPages = Math.max(
    1,
    Math.ceil(allProducts.length / PAGE_SIZE),
  );

  // Prevent requesting pages beyond the available results.
  const currentPage = Math.min(requestedPage, totalPages);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const products = allProducts.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  return (
    <main className="min-h-screen bg-[#FCFAFD]">
      <VendorHeader
        vendor={{
          name: vendor.name,
          description: vendor.description,
          location: vendor.location,
          openingHours: vendor.opening_hours,
          image: vendor.cover_image || FALLBACK_COVER_IMAGE,
        }}
      />

      <ProductSection
        workingHours={vendor.opening_hours}
        dishes={products}
        phone={vendor.phone}
        vendorId={vendor.id}
      />

      <div className="mx-auto max-w-7xl px-6 pb-10">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          createPageHref={(page) =>
            page === 1
              ? `/vendor/${slug}`
              : `/vendor/${slug}?page=${page}`
          }
        />
      </div>

      <footer className="border-t border-[#EADFF0] py-8 text-center">
        <p className="text-xs text-gray-400">
          Powered by{" "}
          <span className="font-semibold text-[#763C92]">
            Bukka
          </span>
        </p>
      </footer>
    </main>
  );
}
