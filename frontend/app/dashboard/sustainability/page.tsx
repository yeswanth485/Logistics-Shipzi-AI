"use client";

import { Leaf, TrendingDown, Recycle, TreePine } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { motion } from "framer-motion";

export default function SustainabilityPage() {
  const { bulkSummary, bulkOrders } = useAppStore();

  const totalCo2 = bulkSummary?.total_co2_reduction ?? 0;
  const totalSavings = bulkSummary?.total_savings ?? 0;
  const avgEfficiency = bulkSummary?.avg_space_efficiency ?? 0;
  const totalProducts = bulkSummary?.total_products ?? 0;
  const wasteReduction = totalProducts > 0 ? Math.round(totalCo2 * 8.2) : 0;

  const metrics = [
    {
      title: "CO₂ Emissions Reduced",
      value: `${totalCo2.toFixed(2)} kg`,
      icon: <Leaf className="h-6 w-6" />,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
    },
    {
      title: "Packaging Waste Saved",
      value: `${wasteReduction} g`,
      icon: <Recycle className="h-6 w-6" />,
      color: "text-packiq-cyan",
      bgColor: "bg-packiq-cyan/20",
    },
    {
      title: "Cost Savings from Optimization",
      value: `$${totalSavings.toFixed(2)}`,
      icon: <TrendingDown className="h-6 w-6" />,
      color: "text-packiq-emerald",
      bgColor: "bg-packiq-emerald/20",
    },
    {
      title: "Avg Space Efficiency",
      value: `${avgEfficiency}%`,
      icon: <TreePine className="h-6 w-6" />,
      color: "text-packiq-amber",
      bgColor: "bg-packiq-amber/20",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white flex items-center gap-3">
          <Leaf className="h-8 w-8 text-green-400" />
          Sustainability Dashboard
        </h1>
        <p className="mt-2 text-gray-400">
          Track your environmental impact from packaging optimization.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m, idx) => (
          <motion.div
            key={m.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
          >
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${m.bgColor} ${m.color}`}>
              {m.icon}
            </div>
            <p className="text-sm text-gray-400">{m.title}</p>
            <p className={`mt-1 text-2xl font-bold ${m.color}`}>{m.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Impact Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
      >
        <h3 className="font-heading text-xl font-bold text-white mb-4">Environmental Impact Summary</h3>
        {totalProducts > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Products optimized</span>
              <span className="text-white font-bold">{totalProducts}</span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Total CO₂ reduction</span>
              <span className="text-green-400 font-bold">{totalCo2.toFixed(2)} kg</span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Equivalent trees saved per year</span>
              <span className="text-packiq-emerald font-bold">{(totalCo2 / 21.77).toFixed(2)}</span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Average space utilization</span>
              <span className="text-packiq-cyan font-bold">{avgEfficiency}%</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Leaf className="mx-auto h-12 w-12 text-gray-600 mb-3" />
            <p className="text-gray-400">No optimization data yet.</p>
            <p className="text-sm text-gray-500 mt-1">Run a bulk optimization to see your sustainability impact.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
