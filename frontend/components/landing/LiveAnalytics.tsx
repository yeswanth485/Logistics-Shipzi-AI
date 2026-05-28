"use client";

import { useRef, useEffect, useState } from "react";
import { AreaChart, Area, LineChart, Line, BarChart, Bar, RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from "recharts";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const data = [
  { name: "Week 1", savings: 1200, opt: 45, co2: 300 },
  { name: "Week 2", savings: 2100, opt: 52, co2: 500 },
  { name: "Week 3", savings: 3800, opt: 68, co2: 800 },
  { name: "Week 4", savings: 5400, opt: 82, co2: 1200 },
  { name: "Week 5", savings: 7200, opt: 91, co2: 1800 },
];

const radialData = [{ name: "Utilization", value: 87, fill: "#2563EB" }];

export default function LiveAnalytics() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 70%",
      onEnter: () => setIsVisible(true),
      once: true,
    });
  }, []);

  return (
    <section ref={sectionRef} className="bg-packiq-dark py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
          {/* Live Badge */}
          <div className="absolute -top-4 right-8 flex items-center space-x-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
            </span>
            <span className="text-xs font-bold tracking-wider text-red-500">LIVE PREVIEW</span>
          </div>

          <div className="mb-10">
            <h3 className="font-heading text-3xl font-bold text-white">Platform Intelligence</h3>
            <p className="text-gray-400">Real-time performance metrics</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Chart 1: Area */}
            <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
              <h4 className="mb-4 text-sm font-medium text-gray-400">Savings Generated</h4>
              <div className="h-40 w-full">
                {isVisible && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333' }} />
                      <Area type="monotone" dataKey="savings" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorSavings)" animationDuration={2000} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Chart 2: Line */}
            <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
              <h4 className="mb-4 text-sm font-medium text-gray-400">Optimization Rate</h4>
              <div className="h-40 w-full">
                {isVisible && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333' }} />
                      <Line type="monotone" dataKey="opt" stroke="#2563EB" strokeWidth={3} dot={false} animationDuration={2000} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Chart 3: Bar */}
            <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
              <h4 className="mb-4 text-sm font-medium text-gray-400">CO₂ Reduction</h4>
              <div className="h-40 w-full">
                {isVisible && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                      <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333' }} />
                      <Bar dataKey="co2" fill="#06B6D4" radius={[4, 4, 0, 0]} animationDuration={2000} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Chart 4: Radial */}
            <div className="rounded-2xl border border-white/5 bg-black/20 p-4 flex flex-col items-center">
              <h4 className="w-full mb-2 text-sm font-medium text-gray-400">Box Utilization</h4>
              <div className="h-32 w-full relative">
                {isVisible && (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={10} data={radialData} startAngle={90} endAngle={-270}>
                      <RadialBar background={{ fill: '#ffffff10' }} dataKey="value" animationDuration={2000} cornerRadius={5} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">87%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
