"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { OnboardingStepProps } from "./types";

export default function Step1_CompanyName({ data, update, onNext }: OnboardingStepProps) {
  const [displayText, setDisplayText] = useState("");
  const targetText = "What's your company called?";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(targetText.slice(0, i));
      i++;
      if (i > targetText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-8 h-12 w-full">
        {data.companyName && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-packiq-blue/30 bg-packiq-blue/10 px-4 py-2 font-heading font-bold text-packiq-cyan backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.2)]"
          >
            {data.companyName}
          </motion.div>
        )}
      </div>

      <h2 className="mb-10 font-heading text-4xl font-bold text-white md:text-5xl h-14">
        {displayText}
        <span className="animate-pulse">|</span>
      </h2>

      <input 
        type="text"
        value={data.companyName}
        onChange={(e) => update({ companyName: e.target.value })}
        onKeyDown={(e) => e.key === "Enter" && data.companyName.length >= 2 && onNext()}
        placeholder="Acme Corp"
        autoFocus
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 px-6 py-6 text-center text-4xl font-bold text-white placeholder-white/20 backdrop-blur-xl transition-all focus:border-packiq-blue focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-packiq-blue/50"
      />
      
      <div className="mt-4 flex w-full max-w-lg justify-between px-2 text-sm text-gray-500">
        <span>This will be displayed across your PackIQ workspace</span>
        <span className={data.companyName.length > 100 ? "text-red-500" : ""}>
          {data.companyName.length}/100
        </span>
      </div>
    </div>
  );
}
