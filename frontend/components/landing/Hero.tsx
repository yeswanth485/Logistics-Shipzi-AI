"use client";

import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import CountUp from "react-countup";
import HeroBox3D from "./HeroBox3D";
import ParticleField from "./ParticleField";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section
      ref={containerRef}
      className="relative flex h-[86svh] max-h-[760px] min-h-[620px] w-full overflow-hidden bg-packiq-dark"
    >
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <ParticleField count={800} />
          <HeroBox3D />
        </Canvas>
      </div>

      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.16),transparent_42%)]" />
      <div className="absolute inset-x-0 bottom-0 z-0 h-28 bg-gradient-to-t from-packiq-dark to-transparent" />

      <motion.div
        style={{ opacity, y }}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-5 pb-8 pt-10 text-center sm:px-8"
      >
        <motion.h1
          initial={{ opacity: 0, y: 42 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4 max-w-5xl text-balance font-heading text-[clamp(2.4rem,7vw,5.6rem)] font-bold leading-[0.98] tracking-normal text-white"
        >
          Ship Smarter. Pack Perfectly. Save More.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.45, ease: "easeOut" }}
          className="mb-7 max-w-2xl text-sm leading-6 text-gray-300 sm:text-base md:text-lg"
        >
          AI-powered packaging optimization that reduces shipping costs by up to 40%
          and cuts CO2 emissions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.65, ease: "easeOut" }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <Link
            href="/register"
            className="rounded-full bg-packiq-blue px-7 py-3.5 font-semibold text-white shadow-[0_0_20px_rgba(37,99,235,0.35)] transition-all hover:scale-105 hover:bg-blue-600"
          >
            Start Free Trial
          </Link>
          <button className="rounded-full border border-white/20 bg-white/5 px-7 py-3.5 font-semibold text-white backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/10">
            Watch Demo
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.85 }}
          className="mt-7 grid w-full max-w-3xl grid-cols-3 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 backdrop-blur-lg"
        >
          {[
            ["Shipments", <CountUp key="shipments" end={12400} separator="," duration={2.5} suffix="+" />],
            ["Savings", <>$<CountUp end={840} duration={2.5} suffix="K" /></>],
            ["CO2 reduced", <CountUp key="co2" end={2.1} decimals={1} duration={2.5} suffix="T" />],
          ].map(([label, value]) => (
            <div key={String(label)} className="bg-packiq-dark/70 px-3 py-4">
              <span className="block text-[11px] font-medium uppercase text-gray-400 sm:text-xs">
                {label}
              </span>
              <span className="mt-1 block text-xl font-bold text-white sm:text-2xl">
                {value}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
