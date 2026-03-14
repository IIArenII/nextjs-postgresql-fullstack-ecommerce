"use client";

import { useTransition } from "react";
import { updateOrderStatus } from "@/app/orders/actions";

export function StatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      disabled={isPending}
      value={currentStatus}
      onChange={(e) => {
        startTransition(async () => {
          await updateOrderStatus(orderId, e.target.value);
        });
      }}
      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
    >
      <option value="Pending">Pending</option>
      <option value="Processing">Processing</option>
      <option value="In Cargo">In Cargo</option>
      <option value="Delivered">Delivered</option>
      <option value="Cancelled">Cancelled</option>
    </select>
  );
}
