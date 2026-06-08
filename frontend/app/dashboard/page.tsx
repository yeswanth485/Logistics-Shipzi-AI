"use client";

import { motion } from "framer-motion";
import MetricCard from "@/components/dashboard/MetricCard";
import SavingsChart from "@/components/dashboard/SavingsChart";
import { DollarSign, Package, TrendingDown, Leaf } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/store/appStore";

export default function DashboardOverview() {
  const { bulkSummary, bulkOrders } = useAppStore();

  const totalSavings = bulkSummary?.total_savings ?? 0;
  const totalProducts = bulkSummary?.total_products ?? 0;
  const avgEfficiency = bulkSummary?.avg_space_efficiency ?? 0;
  const totalCo2 = bulkSummary?.total_co2_reduction ?? 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-end md:space-y-0">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="mt-1 text-gray-400">Your packaging performance at a glance.</p>
        </div>
        
        <Link 
          href="/dashboard/optimization"
          className="inline-flex items-center justify-center rounded-xl bg-packiq-blue px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all hover:bg-blue-600 hover:shadow-[0_0_25px_rgba(37,99,235,0.6)]"
        >
          New Optimization
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <MetricCard 
            title="Total Savings" 
            value={totalSavings} 
            prefix="$" 
            trend={totalSavings > 0 ? 12.5 : 0} 
            icon={<DollarSign className="h-6 w-6" />} 
            colorClass="text-packiq-emerald" 
            decimals={2}
          />
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <MetricCard 
            title="Products Optimized" 
            value={totalProducts} 
            trend={totalProducts > 0 ? 8.2 : 0} 
            icon={<Package className="h-6 w-6" />} 
            colorClass="text-packiq-blue" 
          />
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <MetricCard 
            title="Avg Space Efficiency" 
            value={avgEfficiency} 
            suffix="%" 
            trend={avgEfficiency > 0 ? 4.1 : 0} 
            icon={<TrendingDown className="h-6 w-6" />} 
            colorClass="text-packiq-amber" 
            decimals={1}
          />
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <MetricCard 
            title="CO₂ Reduced" 
            value={totalCo2} 
            suffix=" kg" 
            trend={totalCo2 > 0 ? 15.3 : 0} 
            icon={<Leaf className="h-6 w-6" />} 
            colorClass="text-packiq-cyan" 
            decimals={2}
          />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
            <SavingsChart />
          </motion.div>
        </div>
        
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 0.6 }}
            className="flex h-full flex-col rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm"
          >
            <h3 className="font-heading text-xl font-bold text-white mb-6">Recent Optimizations</h3>
            
            <div className="flex-1 space-y-4">
              {bulkOrders.length > 0 ? (
                bulkOrders.slice(0, 4).map((order) => (
                  <div key={order.row_index} className="flex items-center justify-between rounded-xl border border-white/5 bg-black/40 p-4 transition-colors hover:bg-white/5">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-packiq-blue/20 text-packiq-blue">
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{order.product_sku}</p>
                        <p className="text-xs text-gray-500">{order.product_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-packiq-emerald">
                        {order.savings > 0 ? `-$${order.savings.toFixed(2)}` : "$0.00"}
                      </p>
                      <p className="text-xs text-gray-500">{order.optimized_box_name}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                  <Package className="h-10 w-10 mb-3 text-gray-600" />
                  <p className="text-sm">No optimizations yet.</p>
                  <p className="text-xs text-gray-600 mt-1">Upload a CSV to get started.</p>
                </div>
              )}
            </div>
            
            <Link href="/dashboard/orders" className="mt-6 w-full rounded-xl border border-white/10 bg-transparent py-3 text-sm font-medium text-white transition-colors hover:bg-white/5 text-center block">
              View All Orders
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
