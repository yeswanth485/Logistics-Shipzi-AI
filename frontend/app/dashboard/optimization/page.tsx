"use client";

import { useState } from "react";
import OptimizationForm, { ShipmentItem } from "@/components/optimization/OptimizationForm";
import ResultsViewer3D from "@/components/optimization/ResultsViewer3D";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

type OptimizationResult = {
  box: {
    name: string;
    dimensions: [number, number, number];
  };
  placements: Array<{
    dimensions: [number, number, number];
    position: [number, number, number];
    color: string;
  }>;
  metrics: {
    utilization: number;
    voidSpace: number;
    savings: number;
    co2Reduction: number;
  };
};

export default function OptimizationPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState("");

  const handleOptimize = async (items: ShipmentItem[]) => {
    setIsProcessing(true);
    setResults(null);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/optimize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        throw new Error("Optimization request failed.");
      }

      setResults(await response.json());
    } catch (err) {
      console.error(err);
      setError("Could not reach the optimization API. Check NEXT_PUBLIC_API_URL and backend deployment.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-white">AI Optimization Engine</h1>
        <p className="mt-2 text-gray-400">Calculate the perfect box and layout for your shipments.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="flex flex-col space-y-6">
          <OptimizationForm onOptimize={handleOptimize} isProcessing={isProcessing} />
          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}
        </div>

        <div className="relative flex min-h-[500px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="border-b border-white/10 bg-black/40 px-6 py-4">
            <h3 className="font-semibold text-white">3D Configuration</h3>
          </div>
          
          <div className="relative flex-1 bg-black/20">
            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-packiq-dark/50 backdrop-blur-sm z-10"
                >
                  <Loader2 className="h-10 w-10 animate-spin text-packiq-blue" />
                  <p className="mt-4 font-medium text-white">Running FFD Algorithm...</p>
                  <p className="text-sm text-gray-400">Analyzing 1,000+ combinations</p>
                </motion.div>
              ) : results ? (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="absolute inset-0"
                >
                  <ResultsViewer3D box={results.box} placements={results.placements} />
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center p-8 text-center"
                >
                  <div className="text-gray-500">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-gray-600 bg-white/5">
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <p>Add items and run optimization to view 3D layout.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {results && !isProcessing && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="border-t border-white/10 bg-black/60 p-6"
            >
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-gray-400">Selected Box</p>
                  <p className="font-bold text-white">{results.box.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Utilization</p>
                  <p className="font-bold text-packiq-cyan">{results.metrics.utilization}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Void Space</p>
                  <p className="font-bold text-packiq-amber">{results.metrics.voidSpace}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Cost Savings</p>
                  <p className="font-bold text-packiq-emerald">${results.metrics.savings}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
