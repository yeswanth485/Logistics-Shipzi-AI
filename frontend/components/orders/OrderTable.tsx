"use client";

import OrderStatusBadge from "./OrderStatusBadge";
import { MoreHorizontal, Search, Filter } from "lucide-react";
import { useState } from "react";

const mockOrders = [
  { id: "ORD-9283", date: "2024-05-28", items: 4, status: "Optimized", savings: 12.45, box: "Medium Corrugated" },
  { id: "ORD-9284", date: "2024-05-28", items: 1, status: "Pending", savings: null, box: "Calculating..." },
  { id: "ORD-9285", date: "2024-05-27", items: 12, status: "Shipped", savings: 34.20, box: "Large Cube" },
  { id: "ORD-9286", date: "2024-05-27", items: 2, status: "Optimized", savings: 4.50, box: "Small Corrugated Cube" },
  { id: "ORD-9287", date: "2024-05-26", items: 5, status: "Failed", savings: 0, box: "N/A" },
];

export default function OrderTable() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = mockOrders.filter(o => o.id.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
      <div className="p-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between border-b border-white/10">
        <h3 className="font-heading text-xl font-bold text-white">Recent Orders</h3>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search Order ID..."
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

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-black/40 text-xs uppercase text-gray-500 border-b border-white/10">
            <tr>
              <th scope="col" className="px-6 py-4">Order ID</th>
              <th scope="col" className="px-6 py-4">Date</th>
              <th scope="col" className="px-6 py-4">Items</th>
              <th scope="col" className="px-6 py-4">Selected Box</th>
              <th scope="col" className="px-6 py-4">Status</th>
              <th scope="col" className="px-6 py-4 text-right">Savings</th>
              <th scope="col" className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{order.id}</td>
                <td className="px-6 py-4">{order.date}</td>
                <td className="px-6 py-4">{order.items}</td>
                <td className="px-6 py-4">{order.box}</td>
                <td className="px-6 py-4">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-6 py-4 text-right font-medium text-packiq-emerald">
                  {order.savings !== null ? `$${order.savings.toFixed(2)}` : "-"}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-500 hover:text-white transition-colors">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-white/10 flex justify-between items-center text-sm text-gray-500">
        <span>Showing {filteredOrders.length} of {mockOrders.length} results</span>
        <div className="flex space-x-2">
          <button className="rounded-lg border border-white/10 px-3 py-1 hover:bg-white/5 disabled:opacity-50" disabled>Previous</button>
          <button className="rounded-lg border border-white/10 px-3 py-1 hover:bg-white/5 disabled:opacity-50" disabled>Next</button>
        </div>
      </div>
    </div>
  );
}
