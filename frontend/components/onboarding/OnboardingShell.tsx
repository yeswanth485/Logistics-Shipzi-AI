"use client";

import { Canvas } from "@react-three/fiber";
import { motion, AnimatePresence } from "framer-motion";
import { Box, ChevronLeft } from "lucide-react";
import Onboarding3DBackground from "./Onboarding3DBackground";

export default function OnboardingShell({ 
  step, 
  onBack, 
  onNext,
  children 
}: { 
  step: number; 
  onBack: () => void; 
  onNext: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 5, 20], fov: 60 }}>
          <Onboarding3DBackground />
        </Canvas>
      </div>

      {/* Overlay & Content */}
      <div className="absolute inset-0 z-10 flex flex-col pointer-events-none">
        
        {/* Header / Progress */}
        {step < 5 && (
          <header className="flex w-full items-center justify-between p-6 pointer-events-auto">
            <div className="flex items-center space-x-2">
              <Box className="h-6 w-6 text-packiq-blue" />
              <span className="font-heading text-xl font-bold text-white">PackIQ</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map((s) => (
                <div 
                  key={s} 
                  className={`h-1.5 w-8 rounded-full transition-colors duration-500 ${
                    s < step ? "bg-packiq-cyan" : s === step ? "bg-packiq-blue" : "bg-white/20"
                  }`}
                />
              ))}
            </div>
            
            <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Save & Exit
            </button>
          </header>
        )}

        {/* Main Step Area */}
        <main className="flex-1 flex items-center justify-center p-6 pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full max-w-2xl"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer / Navigation */}
        {step < 5 && (
          <footer className="flex w-full justify-between p-8 pointer-events-auto">
            <button 
              onClick={onBack}
              disabled={step === 1}
              className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                step === 1 ? "text-transparent" : "text-gray-400 hover:text-white"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            
            <button 
              onClick={onNext}
              className="rounded-full bg-white px-8 py-3 font-bold text-packiq-dark shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:bg-gray-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
            >
              {step === 4 ? "Complete Setup" : "Continue"}
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}
