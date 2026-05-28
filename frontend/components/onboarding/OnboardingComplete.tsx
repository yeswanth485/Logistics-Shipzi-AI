"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { ArrowRight, Check } from "lucide-react";

export default function OnboardingComplete({ companyName, onFinish }: { companyName: string, onFinish: () => void }) {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Trigger confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    // Countdown
    const countInterval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(countInterval);
          onFinish();
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(countInterval);
    };
  }, [onFinish]);

  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-tr from-packiq-blue to-packiq-cyan shadow-[0_0_50px_rgba(6,182,212,0.4)]"
      >
        <div className="absolute inset-1 rounded-full bg-packiq-dark flex items-center justify-center">
          <Check className="h-12 w-12 text-packiq-cyan" strokeWidth={3} />
        </div>
      </motion.div>

      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-4 font-heading text-4xl font-bold text-white md:text-5xl"
      >
        Welcome to PackIQ, <br/>
        <span className="text-gradient-blue">{companyName || "your workspace"}!</span>
      </motion.h2>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-12 text-xl text-gray-400"
      >
        Your premium analytics command center is ready.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7 }}
      >
        <button 
          onClick={onFinish}
          className="group flex items-center space-x-3 rounded-full bg-white px-8 py-4 font-bold text-packiq-dark shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all hover:scale-105 hover:bg-gray-100 hover:shadow-[0_0_40px_rgba(255,255,255,0.5)]"
        >
          <span>Enter Your Dashboard</span>
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>
      </motion.div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-6 text-sm text-gray-500"
      >
        Redirecting automatically in {countdown}...
      </motion.p>
    </div>
  );
}
