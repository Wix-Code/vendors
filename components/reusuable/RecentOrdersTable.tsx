import { Dropbox } from "iconsax-react";
import EmptyState from "@/components/reusuable/EmptyState";
import DashboardSection from "./DashboardSection";
import OrderStatusBadge from "./OrderStatusBadge";

export interface RecentOrder {
  id: string;
  item_name: string;
  item_price: number | string;
  status: string | null;
  created_at: string;
}

interface RecentOrdersTableProps {
  orders: RecentOrder[];
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatCurrency(amount: number | string) {
  return `₦${Number(amount).toLocaleString("en-NG")}`;
}

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  return (
    <DashboardSection
      title="Recent orders"
      viewAllHref="/dashboard/orders"
      viewAllLabel="View all"
    >
      {!orders.length ? (
        <EmptyState
          icon={<Dropbox size={28} color="#763C92" />}
          title="No orders available"
          description="No orders yet — they'll show up here once a customer orders from your menu."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <thead>
              <tr className="bg-[#FCFAFD] text-left text-gray-500">
                <th className="px-6 py-4 font-medium">Item</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Placed</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F0E7F4]">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="transition-colors hover:bg-[#FCFAFD]"
                >
                  <td className="px-6 py-4 font-medium text-[#351B46]">
                    {order.item_name}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                    {formatCurrency(order.item_price)}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                    {formatTime(order.created_at)}
                  </td>

                  <td className="px-6 py-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardSection>
  );
}
