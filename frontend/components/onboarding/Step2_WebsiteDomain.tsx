"use client";

import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import type { OnboardingStepProps } from "./types";

export default function Step2_WebsiteDomain({ data, update, onNext }: OnboardingStepProps) {
  
  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    update({ websiteDomain: val });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      let val = data.websiteDomain;
      if (val && !val.startsWith("http")) {
        val = `https://${val}`;
        update({ websiteDomain: val });
      }
      onNext();
    }
  };

  const getCleanDomain = () => {
    try {
      return new URL(data.websiteDomain.startsWith("http") ? data.websiteDomain : `https://${data.websiteDomain}`).hostname;
    } catch {
      return data.websiteDomain || "acme.com";
    }
  };

  return (
    <div className="flex flex-col items-center text-center">
      <h2 className="mb-10 font-heading text-4xl font-bold text-white md:text-5xl">
        Your company&apos;s online home?
      </h2>

      <div className="relative w-full max-w-lg">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
          <Globe className="h-6 w-6 text-gray-500" />
        </div>
        <input 
          type="text"
          value={data.websiteDomain}
          onChange={handleDomainChange}
          onKeyDown={handleKeyDown}
          placeholder="https://acmecorp.com"
          autoFocus
          className="w-full rounded-2xl border border-white/10 bg-white/5 pl-16 pr-6 py-5 text-xl font-medium text-white placeholder-white/20 backdrop-blur-xl transition-all focus:border-packiq-blue focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-packiq-blue/50"
        />
      </div>
      
      {/* Live Preview Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: data.websiteDomain ? 1 : 0.5, y: 0 }}
        className="mt-12 w-full max-w-sm rounded-xl border border-white/5 bg-black/40 p-4 shadow-lg backdrop-blur-md"
      >
        <div className="flex items-center space-x-3 mb-3 border-b border-white/10 pb-3">
          <div className="flex space-x-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/50"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-500/50"></div>
            <div className="h-3 w-3 rounded-full bg-green-500/50"></div>
          </div>
          <div className="flex-1 rounded-md bg-white/5 px-2 py-1 text-center text-xs text-gray-400 font-mono overflow-hidden text-ellipsis">
            {data.websiteDomain ? (data.websiteDomain.startsWith("http") ? data.websiteDomain : `https://${data.websiteDomain}`) : "https://..."}
          </div>
        </div>
        <div className="flex items-center space-x-4 px-2 py-2">
          <div className="h-10 w-10 flex items-center justify-center rounded bg-white/10 font-bold text-white">
            {data.companyName ? data.companyName.charAt(0) : "A"}
          </div>
          <div className="flex flex-col text-left">
            <span className="font-medium text-white">{data.companyName || "Company Name"}</span>
            <span className="text-xs text-packiq-blue">{getCleanDomain()}</span>
          </div>
        </div>
      </motion.div>

      <button onClick={onNext} className="mt-8 text-sm text-gray-500 hover:text-white transition-colors underline underline-offset-4">
        Don&apos;t have a website? Skip
      </button>
    </div>
  );
}
