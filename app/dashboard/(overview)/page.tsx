import { redirect } from "next/navigation";
import {
  Wallet2,
  Bag2,
  Book1,
  Clock,
  TickCircle,
  CloseCircle,
  Eye,
} from "iconsax-react";
import Link from "next/link";

import MenuQRCard from "@/components/dashboard/MenuQrCode";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import RecentOrdersTable from "@/components/dashboard/RecentOrdersTable";
import { createSupabaseServerClient } from "@/lib/server";
import TrialBanner from "@/components/reusuable/TrialBanner";

export default async function DashboardOverview() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    { data: vendor },
    { data: monthOrders },
    { count: menuItemCount },
    { count: viewCount },
    { data: recentOrders },
  ] = await Promise.all([
    supabase
      .from("vendors")
      .select("name, slug, plan_status, trial_ends_at")
      .eq("id", user.id)
      .single(),

    supabase
      .from("orders")
      .select("item_price, status")
      .eq("vendor_id", user.id)
      .gte("created_at", startOfMonth.toISOString()),

    supabase
      .from("menu_items")
      .select("id", { count: "exact", head: true })
      .eq("vendor_id", user.id),

    supabase
      .from("page_views")
      .select("id", { count: "exact", head: true })
      .eq("vendor_id", user.id)
      .gte("created_at", startOfMonth.toISOString()),

    supabase
      .from("orders")
      .select("id, item_name, item_price, status, created_at")
      .eq("vendor_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const ordersThisMonth = monthOrders ?? [];

  const revenueThisMonth = ordersThisMonth
    .filter((order) => order.status === "completed")
    .reduce((total, order) => total + Number(order.item_price), 0);

  const countByStatus = (status: string) =>
    ordersThisMonth.filter((order) => order.status === status).length;

  const pendingOrders = countByStatus("pending");
  const completedOrders = countByStatus("completed");
  const cancelledOrders = countByStatus("cancelled");

  const stats = [
    {
      label: "Revenue this month",
      value: `₦${revenueThisMonth.toLocaleString("en-NG")}`,
      icon: <Wallet2 size={20} color="#763C92" variant="Bold" />,
      tone: "primary" as const,
    },
    {
      label: "Orders this month",
      value: ordersThisMonth.length.toString(),
      icon: <Bag2 size={20} color="#763C92" variant="Bold" />,
      tone: "primary" as const,
    },
    {
      label: "Menu items",
      value: (menuItemCount ?? 0).toString(),
      icon: <Book1 size={20} color="#763C92" variant="Bold" />,
      tone: "primary" as const,
    },
    {
      label: "Pending orders",
      value: pendingOrders.toString(),
      icon: <Clock size={20} color="#D97706" variant="Bold" />,
      tone: "warning" as const,
    },
    {
      label: "Completed orders",
      value: completedOrders.toString(),
      icon: <TickCircle size={20} color="#16A34A" variant="Bold" />,
      tone: "success" as const,
    },
    {
      label: "Cancelled orders",
      value: cancelledOrders.toString(),
      icon: <CloseCircle size={20} color="#DC2626" variant="Bold" />,
      tone: "danger" as const,
    },
    {
      label: "Menu views this month",
      value: (viewCount ?? 0).toString(),
      icon: <Eye size={20} color="#763C92" variant="Bold" />,
      tone: "primary" as const,
    },
  ];

  return (
    <div className="min-h-full space-y-7 bg-[#FCFAFD]">
      {/* Dashboard introduction */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#351B46]">
          Dashboard overview
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
          Here&rsquo;s how {vendor?.name ?? "your restaurant"} is doing today.
        </p>
      </div>

      {/* Subscription / trial information */}
      <TrialBanner
        planStatus={vendor?.plan_status ?? "inactive"}
        trialEndsAt={vendor?.trial_ends_at ?? null}
      />

      {/* Dashboard statistics */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-[#351B46]">Your performance</h2>

          <span className="text-xs text-gray-500">This month</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <DashboardStatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              tone={stat.tone}
            />
          ))}
        </div>
      </section>

      {/* Menu QR code */}
      {vendor?.slug && <MenuQRCard slug={vendor.slug} />}

      {/* Recent orders */}
      <RecentOrdersTable orders={recentOrders ?? []} />

      {/* Optional dashboard navigation */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#EADFF0] bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="font-bold text-[#351B46]">Manage your store</h2>

          <p className="mt-1 text-sm text-gray-500">
            Keep your menu updated and manage incoming orders.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/menu"
            className="rounded-full border border-[#EADFF0] px-5 py-2.5 text-sm font-semibold text-[#763C92] transition-colors hover:bg-[#F7F0FA]"
          >
            Manage menu
          </Link>

          <Link
            href="/dashboard/orders"
            className="rounded-full bg-[#763C92] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#5D2D75]"
          >
            View orders
          </Link>
        </div>
      </div>
    </div>
  );
}
