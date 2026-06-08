"use client";

import { useState } from "react";
import { useAppStore, BulkOrderResult } from "@/store/appStore";
import { Search, Filter, Package, Eye, ArrowDownRight, ArrowUpRight } from "lucide-react";
import ResultsViewer3D from "@/components/optimization/ResultsViewer3D";
import { motion, AnimatePresence } from "framer-motion";

export default function OrderTable() {
  const { bulkOrders } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<BulkOrderResult | null>(null);

  const filteredOrders = bulkOrders.filter(
    (o) =>
      o.product_sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
        <div className="p-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between border-b border-white/10">
          <h3 className="font-heading text-xl font-bold text-white">Optimized Orders</h3>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search SKU or Product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-xl border border-white/10 bg-black/40 pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-packiq-blue focus:outline-none"
              />
            </div>
            <button className="flex items-center space-x-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-gray-300 hover:bg-white/5">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {bulkOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-gray-600 bg-white/5">
              <Package className="h-8 w-8 text-gray-500" />
            </div>
            <p className="text-gray-400 font-medium">No optimized orders yet</p>
            <p className="mt-1 text-sm text-gray-500">Upload a CSV in the Optimization tab to see results here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-black/40 text-xs uppercase text-gray-500 border-b border-white/10">
                <tr>
                  <th scope="col" className="px-4 py-4">SKU</th>
                  <th scope="col" className="px-4 py-4">Product</th>
                  <th scope="col" className="px-4 py-4">Product Dims</th>
                  <th scope="col" className="px-4 py-4">Used Box</th>
                  <th scope="col" className="px-4 py-4">Used Dims</th>
                  <th scope="col" className="px-4 py-4">Used Price</th>
                  <th scope="col" className="px-4 py-4">Optimized Box</th>
                  <th scope="col" className="px-4 py-4">Opt. Dims</th>
                  <th scope="col" className="px-4 py-4">Opt. Price</th>
                  <th scope="col" className="px-4 py-4 text-right">Savings</th>
                  <th scope="col" className="px-4 py-4">Fragility</th>
                  <th scope="col" className="px-4 py-4">3D</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map((order) => (
                  <tr key={order.row_index} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-medium text-white font-mono text-xs">{order.product_sku}</td>
                    <td className="px-4 py-3 text-white">{order.product_name}</td>
                    <td className="px-4 py-3 font-mono text-xs">{order.product_dimensions}</td>
                    <td className="px-4 py-3">{order.used_box_name}</td>
                    <td className="px-4 py-3 font-mono text-xs">{order.used_box_dimensions}</td>
                    <td className="px-4 py-3 text-packiq-amber">${order.used_box_price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-packiq-cyan font-medium">{order.optimized_box_name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-packiq-cyan">{order.optimized_box_dimensions}</td>
                    <td className="px-4 py-3 text-packiq-emerald">${order.optimized_box_price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">
                      {order.savings > 0 ? (
                        <span className="inline-flex items-center text-packiq-emerald font-bold">
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                          ${order.savings.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-gray-500 flex items-center justify-end">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          $0.00
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                        order.fragility_score >= 0.8
                          ? "bg-red-500/20 text-red-400"
                          : order.fragility_score >= 0.5
                          ? "bg-packiq-amber/20 text-packiq-amber"
                          : "bg-packiq-emerald/20 text-packiq-emerald"
                      }`}>
                        {order.fragility_score >= 0.8 ? "High" : order.fragility_score >= 0.5 ? "Med" : "Low"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="rounded-lg bg-packiq-blue/20 p-1.5 text-packiq-blue hover:bg-packiq-blue/30 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {bulkOrders.length > 0 && (
          <div className="p-4 border-t border-white/10 flex justify-between items-center text-sm text-gray-500">
            <span>Showing {filteredOrders.length} of {bulkOrders.length} results</span>
          </div>
        )}
      </div>

      {/* 3D Viewer Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl rounded-2xl border border-white/10 bg-packiq-dark overflow-hidden"
            >
              <div className="border-b border-white/10 bg-black/40 px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white">3D View: {selectedOrder.optimized_box_name}</h3>
                  <p className="text-xs text-gray-400">{selectedOrder.product_name} ({selectedOrder.product_sku})</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white text-xl">✕</button>
              </div>
              <div className="h-[400px] bg-black/20">
                <ResultsViewer3D
                  box={{
                    name: selectedOrder.optimized_box_name,
                    dimensions: [selectedOrder.optimized_box_l, selectedOrder.optimized_box_h, selectedOrder.optimized_box_w],
                  }}
                  placements={[
                    {
                      dimensions: [selectedOrder.product_l, selectedOrder.product_h, selectedOrder.product_w],
                      position: [0, selectedOrder.product_h / 2, 0],
                      color: "#06B6D4",
                    },
                  ]}
                />
              </div>
              <div className="border-t border-white/10 bg-black/60 p-4 grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Space Efficiency</p>
                  <p className="text-lg font-bold text-packiq-cyan">{selectedOrder.space_efficiency}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Savings</p>
                  <p className="text-lg font-bold text-packiq-emerald">${selectedOrder.savings.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">CO₂ Saved</p>
                  <p className="text-lg font-bold text-green-400">{selectedOrder.co2_reduction} kg</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Fragility</p>
                  <p className={`text-lg font-bold ${selectedOrder.fragility_score >= 0.8 ? "text-red-400" : selectedOrder.fragility_score >= 0.5 ? "text-packiq-amber" : "text-packiq-emerald"}`}>
                    {(selectedOrder.fragility_score * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
