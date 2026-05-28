import { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import CountUp from "react-countup";

interface MetricCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend: number;
  icon: ReactNode;
  colorClass: string;
  decimals?: number;
}

export default function MetricCard({ 
  title, 
  value, 
  prefix = "", 
  suffix = "", 
  trend, 
  icon, 
  colorClass,
  decimals = 0 
}: MetricCardProps) {
  const isPositive = trend >= 0;
  
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-white/10 hover:bg-white/10 hover:shadow-xl">
      {/* Glow effect */}
      <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-10 blur-3xl transition-opacity group-hover:opacity-20 ${
        colorClass === "text-packiq-blue" ? "bg-packiq-blue" :
        colorClass === "text-packiq-emerald" ? "bg-packiq-emerald" :
        colorClass === "text-packiq-cyan" ? "bg-packiq-cyan" : "bg-packiq-amber"
      }`}></div>
      
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <div className="mt-2 flex items-baseline space-x-1">
            <span className="text-3xl font-bold text-white tracking-tight">
              {prefix}
              <CountUp end={value} decimals={decimals} duration={2} separator="," />
              {suffix}
            </span>
          </div>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 ${colorClass}`}>
          {icon}
        </div>
      </div>
      
      <div className="mt-4 flex items-center space-x-2 text-sm relative z-10">
        <div className={`flex items-center space-x-1 rounded-md px-2 py-1 ${isPositive ? 'bg-packiq-emerald/10 text-packiq-emerald' : 'bg-red-500/10 text-red-500'}`}>
          {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          <span className="font-semibold">{Math.abs(trend)}%</span>
        </div>
        <span className="text-gray-500">vs last month</span>
      </div>
    </div>
  );
}
