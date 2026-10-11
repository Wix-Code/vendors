"use client";

import { useEffect, useState } from "react";
import { Eye, X } from "lucide-react";
import { supabase } from "@/libs/supabase";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  phone?: string;
};

type ProductCardProps = {
  phone?: string;
  vendorId: string;
  vendorName?: string;
  product: Product;
};

const clean = (value?: string | null) => {
  const text = (value ?? "").trim();

  return text &&
    !["none", "null", "undefined"].includes(text.toLowerCase())
    ? text
    : "";
};

const naira = (amount: number) =>
  `₦${amount.toLocaleString("en-NG")}`;

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("0")) {
    return `234${digits.slice(1)}`;
  }

  return digits;
}

function buildOrderMessage({
  name,
  description,
  price,
  vendorName,
}: {
  name: string;
  description?: string;
  price: number;
  vendorName?: string;
}) {
  const lines = [
    "🛍️ *NEW ORDER REQUEST*",
    "━━━━━━━━━━━━━━━",
    vendorName
      ? `Hello *${vendorName}*, I'd like to order this product:`
      : "Hello, I'd like to order this product:",
    "",
    `*${name}*`,
    clean(description) ? `_${clean(description)}_` : "",
    "",
    `💰 Price: *${naira(price)}*`,
    "",
    "Please confirm availability, available sizes/colours if applicable, and delivery options.",
    "Thank you!",
  ];

  return lines.filter(Boolean).join("\n");
}

export default function ProductCard({
  product,
  phone,
  vendorId,
  vendorName,
}: ProductCardProps) {
  const [placing, setPlacing] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const orderPhone = clean(product.phone) || clean(phone);

  useEffect(() => {
    if (!previewOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setPreviewOpen(false);
      }
    }

    const previousOverflow = document.body.style.overflow;

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [previewOpen]);

  async function handleOrder() {
    if (!orderPhone || placing) return;

    setPlacing(true);

    // Open the tab before awaiting the database request
    // to reduce the chance of the browser blocking it.
    const newTab = window.open("about:blank", "_blank");

    if (newTab) {
      newTab.opener = null;
    }

    try {
      const { error } = await supabase.from("orders").insert({
        vendor_id: vendorId,
        menu_item_id: product.id,
        item_name: product.name,
        item_price: product.price,
      });

      if (error) {
        console.error("Order insert failed:", error.message);
      }
    } catch (error) {
      console.error("Order insert failed:", error);
    } finally {
      setPlacing(false);
    }

    const message = buildOrderMessage({
      name: product.name,
      description: product.description,
      price: product.price,
      vendorName: clean(vendorName),
    });

    const whatsappUrl =
      `https://wa.me/${normalizePhone(orderPhone)}` +
      `?text=${encodeURIComponent(message)}`;

    if (newTab && !newTab.closed) {
      newTab.location.href = whatsappUrl;
    } else {
      window.location.href = whatsappUrl;
    }
  }

  const orderButtonClass =
    "cursor-pointer rounded-full bg-[#763C92] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#5D2D75] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <>
      <article className="group overflow-hidden rounded-3xl border border-[#EADFF0] bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl">
        {/* Product image */}
        <div className="relative h-52 overflow-hidden bg-[#F7F0FA]">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[#763C92]">
              No product image
            </div>
          )}

          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />

          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            aria-label={`View ${product.name}`}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/90 text-[#351B46] shadow-md backdrop-blur-md transition hover:scale-105 hover:text-[#763C92] active:scale-95"
          >
            <Eye size={19} />
          </button>
        </div>

        {/* Product details */}
        <div className="p-5">
          <h3 className="text-xl font-bold text-[#351B46]">
            {product.name}
          </h3>

          {clean(product.description) && (
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-gray-500">
              {product.description}
            </p>
          )}

          <div className="mt-5 flex items-center justify-between gap-3">
            <span className="text-lg font-bold text-[#763C92]">
              {naira(product.price)}
            </span>

            {orderPhone ? (
              <button
                type="button"
                onClick={handleOrder}
                disabled={placing}
                className={orderButtonClass}
              >
                {placing ? "Opening…" : "Order"}
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-full bg-gray-100 px-6 py-2.5 text-sm font-medium text-gray-400"
              >
                Unavailable
              </button>
            )}
          </div>
        </div>
      </article>

      {/* Product image preview */}
      {previewOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} product preview`}
          onClick={() => setPreviewOpen(false)}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-[700px]"
          >
            <button
              type="button"
              onClick={() => setPreviewOpen(false)}
              aria-label="Close product preview"
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg transition hover:bg-[#F7F0FA] hover:text-[#763C92] active:scale-95 sm:right-4 sm:top-4"
            >
              <X size={20} />
            </button>

            <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
              <div className="flex max-h-[65vh] min-h-[300px] items-center justify-center bg-[#F7F0FA]">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-[65vh] w-full object-contain"
                  />
                ) : (
                  <p className="text-sm text-[#763C92]">
                    No product image available
                  </p>
                )}
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-5">
                  <div className="min-w-0">
                    <h3 className="text-xl font-bold text-[#351B46] sm:text-2xl">
                      {product.name}
                    </h3>

                    {clean(product.description) && (
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                        {product.description}
                      </p>
                    )}
                  </div>

                  <span className="shrink-0 text-lg font-bold text-[#763C92] sm:text-xl">
                    {naira(product.price)}
                  </span>
                </div>

                {orderPhone && (
                  <button
                    type="button"
                    onClick={handleOrder}
                    disabled={placing}
                    className={`mt-5 w-full sm:w-auto ${orderButtonClass}`}
                  >
                    {placing ? "Opening WhatsApp…" : "Order product"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}