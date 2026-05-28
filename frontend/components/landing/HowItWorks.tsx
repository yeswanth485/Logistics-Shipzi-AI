"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Cpu, Truck } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Upload Data",
    description: "Import your product dimensions and weights via CSV or API integration.",
    icon: <Upload className="h-6 w-6" />,
  },
  {
    num: "02",
    title: "AI Optimization",
    description: "Our FFD algorithm calculates the perfect box and orientation for every shipment.",
    icon: <Cpu className="h-6 w-6" />,
  },
  {
    num: "03",
    title: "Save & Ship",
    description: "Reduce empty space, cut dimensional weight costs, and lower your carbon footprint.",
    icon: <Truck className="h-6 w-6" />,
  }
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <section ref={containerRef} className="bg-packiq-dark py-32 px-6 overflow-hidden">
      <div className="mx-auto max-w-6xl">
        <div className="mb-20 text-center">
          <h2 className="font-heading text-4xl font-bold text-white md:text-5xl">
            How It Works
          </h2>
          <p className="mt-4 text-gray-400">Three simple steps to logistics perfection.</p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-12 hidden h-0.5 w-3/4 -translate-x-1/2 bg-white/10 md:block">
            <motion.div 
              initial={{ scaleX: 0, transformOrigin: "left" }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-full w-full bg-gradient-to-r from-packiq-blue via-packiq-cyan to-packiq-emerald"
            />
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/5 border border-white/10 text-packiq-cyan shadow-[0_0_30px_rgba(6,182,212,0.15)] relative z-10 backdrop-blur-md">
                  {step.icon}
                </div>
                <div className="absolute top-0 -z-10 text-[120px] font-bold leading-none text-white/5 select-none">
                  {step.num}
                </div>
                <h3 className="mb-3 font-heading text-2xl font-bold text-white">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
