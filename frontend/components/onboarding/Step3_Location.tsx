"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Search } from "lucide-react";
import type { OnboardingStepProps } from "./types";

export default function Step3_Location({ data, update, onNext }: OnboardingStepProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  // Dummy locations for suggestion
  const suggestions = [
    "New York, United States",
    "London, United Kingdom",
    "Toronto, Canada",
    "Berlin, Germany",
    "Sydney, Australia",
    "Singapore, Singapore"
  ].filter(l => l.toLowerCase().includes(data.location.toLowerCase()));

  const handleSelect = (loc: string) => {
    update({ location: loc });
    setIsFocused(false);
  };

  return (
    <div className="flex flex-col items-center text-center">
      <h2 className="mb-10 font-heading text-4xl font-bold text-white md:text-5xl">
        Where are you shipping from?
      </h2>

      <div className="relative w-full max-w-lg z-20">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
          <Search className={`h-6 w-6 transition-colors ${isFocused ? "text-packiq-blue" : "text-gray-500"}`} />
        </div>
        
        <input 
          type="text"
          value={data.location}
          onChange={(e) => update({ location: e.target.value })}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onKeyDown={(e) => e.key === "Enter" && data.location && onNext()}
          placeholder="City, Country"
          autoFocus
          className="w-full rounded-2xl border border-white/10 bg-white/5 pl-16 pr-6 py-5 text-xl font-medium text-white placeholder-white/20 backdrop-blur-xl transition-all focus:border-packiq-blue focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-packiq-blue/50"
        />
        
        <AnimatePresence>
          {isFocused && data.location.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute left-0 right-0 mt-2 overflow-hidden rounded-xl border border-white/10 bg-packiq-dark/95 backdrop-blur-xl shadow-2xl"
            >
              {suggestions.length > 0 ? (
                <ul className="py-2 text-left">
                  {suggestions.map((loc, i) => (
                    <li 
                      key={i}
                      onClick={() => handleSelect(loc)}
                      className="flex cursor-pointer items-center space-x-3 px-6 py-3 hover:bg-white/5 transition-colors"
                    >
                      <MapPin className="h-5 w-5 text-packiq-cyan" />
                      <span className="text-gray-200">{loc}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-gray-400 text-sm">
                  Press enter to use &quot;{data.location}&quot;
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* 3D Pin representation (CSS visual hack for simplicity, actual 3D globe is in background) */}
      <div className="mt-16 relative flex items-center justify-center h-40 w-40">
        <div className="absolute inset-0 rounded-full border border-white/5 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm"></div>
        <div className="absolute inset-2 rounded-full border border-dashed border-white/10 animate-[spin_20s_linear_infinite]"></div>
        
        <AnimatePresence>
          {data.location && (
            <motion.div 
              initial={{ scale: 0, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="h-12 w-12 rounded-full bg-packiq-cyan flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                <MapPin className="h-6 w-6 text-packiq-dark" />
              </div>
              <div className="mt-2 text-xs font-bold text-packiq-cyan uppercase tracking-wider bg-packiq-dark/50 px-2 py-1 rounded backdrop-blur-md">
                {data.location.split(",")[0]}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
