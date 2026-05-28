import OrderTable from "@/components/orders/OrderTable";
import { ShoppingCart } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders | PackIQ",
};

export default function OrdersPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-end md:space-y-0">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-packiq-emerald" />
            Orders Management
          </h1>
          <p className="mt-2 text-gray-400">Track and manage your optimized shipments.</p>
        </div>
        
        <button className="rounded-xl bg-packiq-blue px-4 py-2 text-sm font-semibold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all hover:bg-blue-600">
          Export CSV
        </button>
      </div>

      <OrderTable />
    </div>
  );
}
