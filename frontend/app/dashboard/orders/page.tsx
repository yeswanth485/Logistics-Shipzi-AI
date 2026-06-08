"use client";

import OrderTable from "@/components/orders/OrderTable";
import { ShoppingCart } from "lucide-react";
import { useAppStore } from "@/store/appStore";

export default function OrdersPage() {
  const { bulkOrders, bulkSummary } = useAppStore();

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-end md:space-y-0">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-packiq-emerald" />
            Orders Management
          </h1>
          <p className="mt-2 text-gray-400">View and manage your optimized shipments.</p>
        </div>

        {bulkSummary && (
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase">Total Savings</p>
              <p className="text-xl font-bold text-packiq-emerald">${bulkSummary.total_savings.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase">Products</p>
              <p className="text-xl font-bold text-white">{bulkSummary.total_products}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase">CO₂ Saved</p>
              <p className="text-xl font-bold text-green-400">{bulkSummary.total_co2_reduction} kg</p>
            </div>
          </div>
        )}
      </div>

      <OrderTable />
    </div>
  );
}
