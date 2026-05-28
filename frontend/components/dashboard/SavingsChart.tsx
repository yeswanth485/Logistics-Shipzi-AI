"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", standard: 4000, optimized: 2400 },
  { name: "Feb", standard: 3000, optimized: 1398 },
  { name: "Mar", standard: 2000, optimized: 9800 },
  { name: "Apr", standard: 2780, optimized: 3908 },
  { name: "May", standard: 1890, optimized: 4800 },
  { name: "Jun", standard: 2390, optimized: 3800 },
  { name: "Jul", standard: 3490, optimized: 4300 },
];

export default function SavingsChart() {
  const [timeframe, setTimeframe] = useState("6M");

  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm shadow-xl">
      <div className="mb-6 flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h3 className="font-heading text-xl font-bold text-white">Cost Reduction Analysis</h3>
          <p className="text-sm text-gray-400">Standard packaging vs PackIQ AI optimization</p>
        </div>
        
        <div className="flex space-x-1 rounded-lg bg-black/40 p-1 border border-white/10">
          {["1M", "3M", "6M", "1Y"].map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                timeframe === t
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorStandard" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#64748b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOptimized" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
              formatter={(value) => [
                typeof value === "number" ? `$${value.toLocaleString()}` : value,
                "",
              ]}
            />
            <Area type="monotone" dataKey="standard" name="Standard Cost" stroke="#64748b" strokeWidth={2} fillOpacity={1} fill="url(#colorStandard)" />
            <Area type="monotone" dataKey="optimized" name="Optimized Cost" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorOptimized)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-400">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 rounded-full bg-slate-500"></div>
          <span>Standard Cost</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 rounded-full bg-packiq-emerald"></div>
          <span>Optimized Cost</span>
        </div>
      </div>
    </div>
  );
}
