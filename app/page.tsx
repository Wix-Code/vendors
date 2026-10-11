"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  Gem,
  Heart,
  MessageCircle,
  Package,
  QrCode,
  Shirt,
  ShoppingBag,
  Smartphone,
  Sparkles,
  SprayCan,
  Store,
  TrendingUp,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/reusuable/Navbar";
import {
  BillingPeriod,
  getBillingPeriodSuffix,
  PLAN_ORDER,
  SUBSCRIPTION_FEATURES,
  SUBSCRIPTION_PLANS,
} from "@/components/reusuable/Plan";

/* Design tokens (from the reset-password page)
   primary #763C92 · hover #5D2D75 · ink #351B46
   tint #F7F0FA · line #EADFF0 / #E8D5F0 · page #FCFAFD */

const easing = [0.22, 1, 0.36, 1] as const;

const faqs = [
  {
    q: "Do I need a website or app already?",
    a: "No. Bukka gives you a ready-to-use online storefront. Add your products, share your link and start receiving orders.",
  },
  {
    q: "What kind of businesses can use Bukka?",
    a: "Bukka works for thrift vendors, fashion stores, fragrance sellers, beauty and skincare brands, accessories vendors, gift businesses and other product-based businesses.",
  },
  {
    q: "How do customers place orders?",
    a: "Customers browse your products, choose what they want and send their order directly to your WhatsApp.",
  },
  {
    q: "Can I update my products anytime?",
    a: "Yes. Add new products, change prices, update availability and manage your storefront directly from your dashboard.",
  },
  {
    q: "Can I change plans later?",
    a: "Yes. You can switch between Monthly, 6 Months and Annual from your dashboard. The change applies when your current period ends.",
  },
  {
    q: "Is there a free trial?",
    a: "Every plan starts with a 14-day free trial. No card is required to get your store online.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. There's no lock-in contract. You can cancel from your account settings whenever you like.",
  },
];

const vendorCategories = [
  {
    icon: <Shirt size={25} />,
    title: "Thrift & Fashion",
    description:
      "Show customers your latest thrift drops, clothing, footwear and fashion collections.",
  },
  {
    icon: <SprayCan size={25} />,
    title: "Fragrances",
    description:
      "Showcase perfumes, body sprays, oils and fragrance collections beautifully.",
  },
  {
    icon: <Heart size={25} />,
    title: "Beauty & Skincare",
    description:
      "Display skincare, cosmetics, hair products and beauty essentials in one place.",
  },
  {
    icon: <Gem size={25} />,
    title: "Accessories",
    description:
      "Sell jewellery, bags, watches, sunglasses and everyday accessories.",
  },
  {
    icon: <Package size={25} />,
    title: "Gifts & Lifestyle",
    description:
      "Create a simple storefront for gift items, handmade products and lifestyle goods.",
  },
  {
    icon: <ShoppingBag size={25} />,
    title: "And much more",
    description:
      "If you sell physical products, Bukka gives you a simpler way to showcase and sell them.",
  },
];

const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#763C92] px-8 py-4 font-semibold text-white shadow-lg shadow-[#763C92]/20 transition-all duration-300 hover:bg-[#5D2D75] hover:shadow-xl hover:shadow-[#763C92]/25";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-[#FCFAFD]">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[450px] w-[450px] rounded-full bg-[#D9BDE8]/35 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 top-[420px] h-[400px] w-[400px] rounded-full bg-[#F6DFE7]/60 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 pb-28 pt-16 md:grid-cols-2 lg:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easing }}
          >
            <Badge>Built for modern vendors</Badge>

            <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight text-[#351B46] md:text-6xl lg:text-7xl">
              Take your business online
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-gray-500 md:text-xl">
              Showcase your products beautifully, receive orders on WhatsApp and
              give customers an easier way to shop. No website or app needed.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/register" className={`group ${btnPrimary}`}>
                Create my store
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <a
                href="#pricing"
                className="inline-flex items-center rounded-full border border-[#E8D5F0] bg-white px-8 py-4 font-semibold text-[#351B46] transition-colors hover:border-[#763C92] hover:text-[#763C92]"
              >
                See pricing
              </a>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-500">
              <Benefit text="14-day free trial" />
              <Benefit text="No card required" />
              <Benefit text="Setup in minutes" />
            </div>
          </motion.div>

          {/* Hero visual: the one animated moment on the page */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.9, ease: easing }}
            className="relative"
          >
            <div className="absolute inset-6 rotate-3 rounded-[40px] bg-[#EADFF0]/80" />
            <div className="relative overflow-hidden rounded-[32px] shadow-2xl shadow-[#351B46]/15">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8"
                alt="Modern fashion and lifestyle store"
                className="h-[500px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#351B46]/35 via-transparent to-transparent" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -bottom-8 -left-3 flex max-w-[280px] items-center gap-4 rounded-2xl border border-[#EADFF0] bg-white px-5 py-4 shadow-xl shadow-[#351B46]/10 md:-left-8"
            >
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#763C92] text-white">
                <MessageCircle size={23} />
                <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-red-500" />
              </div>
              <div>
                <p className="text-[11px] font-semibold tracking-wide text-[#763C92]">
                  NEW ORDER
                </p>
                <p className="mt-0.5 text-sm font-semibold text-[#351B46]">
                  1 × Signature Fragrance
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  Just now • WhatsApp
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -right-5 top-14 hidden rounded-2xl border border-[#EADFF0] bg-white px-4 py-3 shadow-xl shadow-[#351B46]/10 md:block"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag size={17} className="text-[#763C92]" />
                <p className="text-xs text-gray-500">Orders today</p>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xl font-bold text-[#351B46]">24</span>
                <span className="flex items-center gap-1 rounded-full bg-[#F7F0FA] px-2 py-1 text-xs font-medium text-[#763C92]">
                  <TrendingUp size={12} />
                  18%
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <SectionHeading
          badge="Everything in one place"
          title="Everything you need to sell online"
          description="One simple platform to showcase your products, receive orders and make it easier for customers to buy from you."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <Card
            icon={<Store size={24} />}
            title="Digital storefront"
            description="Showcase your products, prices, photos and availability in one beautiful online store."
          />
          <Card
            icon={<MessageCircle size={24} />}
            title="WhatsApp orders"
            description="Customers choose what they want and send their order directly to your WhatsApp."
          />
          <Card
            icon={<QrCode size={24} />}
            title="Share anywhere"
            description="Share your store link or QR code on Instagram, TikTok, WhatsApp, flyers, packaging and your physical shop."
          />
        </div>
      </section>

      {/* VENDOR CATEGORIES */}
      <section id="vendors" className="scroll-mt-20 bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            badge="Made for vendors"
            title="Whatever you sell, Bukka helps you sell it better"
            description="Build a simple online storefront for your products and make it easier for customers to discover and order from you."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {vendorCategories.map((c) => (
              <Card
                key={c.title}
                icon={c.icon}
                title={c.title}
                description={c.description}
                tinted
              />
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT SHOWCASE */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="pointer-events-none absolute -right-40 top-40 h-[500px] w-[500px] rounded-full bg-[#D9BDE8]/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6">
          <SectionHeading
            badge="Built for you and your customers"
            title="Run your business from one simple platform"
            description="Bukka gives you the tools to manage your products, monitor orders and share your store online, while giving customers a simple way to discover what you sell and place orders."
          />

          {/* Dashboard */}
          <div className="mt-20 grid items-center gap-12 lg:grid-cols-[0.9fr_1.4fr]">
            <div>
              <p className="text-sm font-semibold tracking-wide text-[#763C92]">
                Your business dashboard
              </p>
              <h3 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-[#351B46] md:text-4xl">
                See what&apos;s happening in your business at a glance.
              </h3>
              <p className="mt-5 leading-7 text-gray-500 md:text-lg">
                Your Bukka dashboard brings your products, orders and business
                performance together in one place. Track sales, manage products
                and share your storefront without switching between tools.
              </p>
              <div className="mt-8 space-y-5">
                <Point
                  icon={<BarChart3 size={20} />}
                  title="Track business performance"
                  description="See your sales, orders and product activity from one simple overview."
                />
                <Point
                  icon={<CheckCircle2 size={20} />}
                  title="Stay on top of every order"
                  description="Monitor pending, completed and cancelled orders as they happen."
                />
                <Point
                  icon={<QrCode size={20} />}
                  title="Share your store anywhere"
                  description="Copy your store link or QR code for WhatsApp, Instagram, TikTok, packaging and flyers."
                />
              </div>
              <Link
                href="/register"
                className="group mt-8 inline-flex items-center gap-2 font-semibold text-[#763C92] hover:text-[#351B46]"
              >
                Start managing your business
                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-8 rounded-[32px] bg-[#D9BDE8]/40 blur-2xl" />
              <div className="relative overflow-hidden rounded-3xl border border-[#EADFF0] bg-white shadow-2xl shadow-[#351B46]/10">
                <Image
                  src="/images/dash.png"
                  alt="Bukka vendor dashboard showing sales, orders, products and QR code"
                  width={1800}
                  height={1000}
                  className="h-auto w-full"
                />
              </div>
            </div>
          </div>

          {/* Customer experience */}
          <div className="mt-28 grid items-center gap-14 lg:grid-cols-2">
            <div className="relative flex justify-center lg:justify-start">
              <div className="absolute left-1/2 top-1/2 h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F6DFE7]/70 blur-3xl" />
              <div className="relative w-[270px] sm:w-[300px]">
                <div className="overflow-hidden rounded-[34px] border-[7px] border-[#351B46] bg-white shadow-2xl shadow-[#351B46]/20">
                  <Image
                    src="/images/phone.png"
                    alt="Bukka mobile online storefront"
                    width={500}
                    height={1100}
                    className="h-auto w-full"
                  />
                </div>
                <div className="absolute -right-16 top-[38%] hidden items-center gap-3 rounded-2xl border border-[#EADFF0] bg-white p-4 shadow-xl shadow-[#351B46]/10 sm:flex">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#763C92] text-white">
                    <ShoppingBag size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#763C92]">
                      Ready to shop
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-[#351B46]">
                      One tap away
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold tracking-wide text-[#763C92]">
                Customer experience
              </p>
              <h3 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-[#351B46] md:text-4xl">
                Give customers a storefront that makes shopping easy.
              </h3>
              <p className="mt-5 leading-7 text-gray-500 md:text-lg">
                Customers get a clean, mobile-friendly storefront built around
                your brand. They can browse products, view prices and
                availability, and place an order without downloading another
                app.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <Mini
                  icon={<Smartphone size={19} />}
                  title="Mobile first"
                  description="Designed for the phones your customers already use every day."
                />
                <Mini
                  icon={<ShoppingBag size={19} />}
                  title="Beautiful products"
                  description="Clear photos, descriptions, prices and availability."
                />
                <Mini
                  icon={<MessageCircle size={19} />}
                  title="Easy ordering"
                  description="From browsing to placing an order in just a few taps."
                />
                <Mini
                  icon={<QrCode size={19} />}
                  title="Share and sell"
                  description="Turn Instagram, TikTok, WhatsApp, flyers and your shop into sales channels."
                />
              </div>
              <Link href="/register" className={`group mt-9 ${btnPrimary}`}>
                Create your online store
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="relative scroll-mt-20 overflow-hidden bg-white py-24"
      >
        <div className="relative mx-auto max-w-7xl px-6">
          <SectionHeading
            badge="Simple setup"
            title="Get your store online in minutes"
            description="No technical skills. No website. Add your products, share your store and start selling."
          />
          <div className="relative mt-16 grid gap-12 md:grid-cols-3">
            <div className="absolute left-[16%] right-[16%] top-6 hidden h-px bg-[#EADFF0] md:block" />
            <Step
              number={1}
              title="Add your products"
              description="Upload your products, photos, prices, descriptions and availability."
            />
            <Step
              number={2}
              title="Share your store"
              description="Share your link or QR code on WhatsApp, Instagram, TikTok, flyers or your physical shop."
            />
            <Step
              number={3}
              title="Receive orders"
              description="Customers browse your products and send their orders directly to your WhatsApp."
            />
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section
        id="pricing"
        className="mx-auto max-w-7xl scroll-mt-20 px-6 py-24"
      >
        <SectionHeading
          badge="Flexible pricing"
          title="Simple, honest pricing"
          description="Start free for 14 days. Every plan includes everything. The longer you stay, the less you pay."
        />

        <div className="mt-14 grid items-start gap-6 md:grid-cols-3">
          {PLAN_ORDER.map((key) => (
            <PlanCard key={key} periodKey={key} />
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-[#EADFF0] bg-white p-8">
          <h3 className="text-center text-lg font-bold text-[#351B46]">
            Every plan includes
          </h3>
          <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {SUBSCRIPTION_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F7F0FA]">
                  <Check size={13} strokeWidth={3} className="text-[#763C92]" />
                </div>
                <span className="text-sm text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="bg-[#F7F0FA] py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="mb-7 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#763C92] text-white shadow-lg shadow-[#763C92]/20">
              <MessageCircle size={25} />
            </div>
          </div>
          <p className="text-2xl font-medium leading-snug text-[#351B46] md:text-3xl">
            “Before Bukka, customers had to message me asking for pictures and
            prices. Now I just send them my store link and they can see
            everything available before placing their order.”
          </p>
          <p className="mt-6 text-gray-500">Online vendor</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-6 py-24">
        <SectionHeading
          badge="Need help?"
          title="Questions, answered"
          description="Everything you need to know before putting your store online."
        />
        <div className="mt-12 divide-y divide-[#EADFF0] border-y border-[#EADFF0]">
          {faqs.map((item, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={item.q} className="py-5">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-center justify-between gap-5 text-left"
                >
                  <span
                    className={`font-semibold transition-colors ${isOpen ? "text-[#763C92]" : "text-[#351B46] group-hover:text-[#763C92]"}`}
                  >
                    {item.q}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#763C92]" : "text-gray-400"}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pt-3 leading-7 text-gray-500">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-[#351B46] py-24">
        <div className="pointer-events-none absolute -right-20 -top-32 h-96 w-96 rounded-full bg-[#763C92]/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#D9BDE8]/10 blur-3xl" />

        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-[#EADFF0]">
            <Sparkles size={15} />
            Start selling smarter
          </div>
          <h2 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">
            Your next customer could be ordering in minutes.
          </h2>
          <p className="mt-5 text-lg text-white/70">
            Create your online store, showcase your products and start receiving
            WhatsApp orders today.
          </p>
          <Link
            href="/register"
            className="group mt-9 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-semibold text-[#351B46] shadow-xl transition-colors hover:bg-[#F7F0FA]"
          >
            Create my store
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
          <p className="mt-5 text-sm text-white/50">
            14-day free trial • No card required
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#EADFF0] bg-[#FCFAFD]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <span className="text-lg font-bold text-[#351B46]">Bukka</span>
            <p className="mt-3 max-w-[240px] text-sm leading-6 text-gray-500">
              The simple online storefront for modern vendors.
            </p>
          </div>
          <FooterColumn
            title="Product"
            links={[
              { label: "Pricing", href: "#pricing" },
              { label: "Create my store", href: "/register" },
              { label: "Log in", href: "/login" },
            ]}
          />
          <FooterColumn
            title="Company"
            links={[
              { label: "About", href: "#" },
              { label: "Contact", href: "#" },
            ]}
          />
          <FooterColumn
            title="Legal"
            links={[
              { label: "Privacy policy", href: "#" },
              { label: "Terms of service", href: "#" },
            ]}
          />
        </div>
        <div className="border-t border-[#EADFF0] py-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Bukka. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

/* ---------------------------------- */
/* SMALL COMPONENTS                   */
/* ---------------------------------- */

function Badge({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#E8D5F0] bg-[#F7F0FA] px-4 py-2 text-sm font-semibold text-[#763C92]">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#763C92] opacity-60 motion-reduce:animate-none" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#763C92]" />
      </span>
      {children}
    </div>
  );
}

function Benefit({ text }: { text: string }) {
  return (
    <span className="flex items-center gap-2">
      <BadgeCheck size={17} className="text-[#763C92]" />
      {text}
    </span>
  );
}

function SectionHeading({
  badge,
  title,
  description,
}: {
  badge: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-[#E8D5F0] bg-[#F7F0FA] px-4 py-2 text-sm font-semibold text-[#763C92]">
        <Sparkles size={14} />
        {badge}
      </div>
      <h2 className="mt-5 text-3xl font-bold tracking-tight text-[#351B46] md:text-4xl">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-500">
        {description}
      </p>
    </div>
  );
}

function Card({
  icon,
  title,
  description,
  tinted = false,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  tinted?: boolean;
}) {
  return (
    <div
      className={`group rounded-3xl border border-[#EADFF0] p-7 transition-shadow duration-300 hover:shadow-xl hover:shadow-[#351B46]/5 ${
        tinted ? "bg-[#FCFAFD]" : "bg-white p-8"
      }`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F7F0FA] text-[#763C92] transition-colors duration-300 group-hover:bg-[#763C92] group-hover:text-white">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-bold text-[#351B46]">{title}</h3>
      <p className="mt-2 leading-7 text-gray-500">{description}</p>
    </div>
  );
}

function Point({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F7F0FA] text-[#763C92]">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-[#351B46]">{title}</h4>
        <p className="mt-1 text-sm leading-6 text-gray-500">{description}</p>
      </div>
    </div>
  );
}

function Mini({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[#EADFF0] bg-white p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F0FA] text-[#763C92]">
        {icon}
      </div>
      <h4 className="mt-4 font-semibold text-[#351B46]">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="relative text-center md:text-left">
      <div className="relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#763C92] font-bold text-white shadow-lg shadow-[#763C92]/20 md:mx-0">
        {number}
      </div>
      <h3 className="mt-5 text-xl font-bold text-[#351B46]">{title}</h3>
      <p className="mt-2 leading-7 text-gray-500">{description}</p>
    </div>
  );
}

function PlanCard({ periodKey }: { periodKey: BillingPeriod }) {
  const plan = SUBSCRIPTION_PLANS[periodKey];
  const monthlyPrice = SUBSCRIPTION_PLANS.monthly.price;
  const perMonth = Math.round(plan.price / plan.durationMonths);
  const savings = monthlyPrice * plan.durationMonths - plan.price;

  return (
    <div
      className={`flex flex-col rounded-3xl bg-white p-8 ${
        plan.popular
          ? "shadow-xl shadow-[#763C92]/10 ring-2 ring-[#763C92] md:-translate-y-3"
          : "border border-[#EADFF0] shadow-sm"
      }`}
    >
      <div className="mb-4 flex min-h-[28px]">
        {plan.badge && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F7F0FA] px-3 py-1 text-xs font-semibold text-[#763C92]">
            <Sparkles size={12} />
            {plan.badge}
          </span>
        )}
      </div>

      <h3 className="text-xl font-bold text-[#351B46]">{plan.name}</h3>
      <p className="mt-2 text-sm leading-6 text-gray-500">{plan.description}</p>

      <div className="mt-6 flex flex-wrap items-baseline gap-x-1.5">
        <span className="text-4xl font-bold text-[#351B46]">
          ₦{plan.price.toLocaleString()}
        </span>
        <span className="text-gray-500">
          {getBillingPeriodSuffix(periodKey)}
        </span>
      </div>

      <p className="mt-1 min-h-[20px] text-sm text-gray-500">
        {plan.durationMonths > 1
          ? `Just ₦${perMonth.toLocaleString()} per month`
          : ""}
      </p>

      <div className="mt-3 min-h-[28px]">
        {savings > 0 && (
          <span className="inline-block rounded-full bg-[#F7F0FA] px-3 py-1 text-xs font-semibold text-[#763C92]">
            Save ₦{savings.toLocaleString()}
          </span>
        )}
      </div>

      <Link
        href={`/register?plan=${periodKey}`}
        className={`mt-6 block rounded-full py-3.5 text-center font-semibold transition-all duration-300 ${
          plan.popular
            ? "bg-[#763C92] text-white shadow-lg shadow-[#763C92]/20 hover:bg-[#5D2D75]"
            : "border border-[#E8D5F0] text-[#351B46] hover:border-[#763C92] hover:text-[#763C92]"
        }`}
      >
        Start free trial
      </Link>
    </div>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="font-semibold text-[#351B46]">{title}</h4>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-gray-500 transition-colors hover:text-[#763C92]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
