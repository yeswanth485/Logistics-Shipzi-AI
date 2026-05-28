"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Box, Leaf, Brain, Ruler } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    title: "AI Optimization Engine",
    description: "Minimize packaging waste by 35% with our proprietary First Fit Decreasing algorithm.",
    icon: <Box className="h-8 w-8 text-packiq-blue" />,
    color: "group-hover:border-packiq-blue/50",
  },
  {
    title: "Sustainability Analytics",
    description: "Track CO₂ reduction in real-time and achieve your corporate sustainability goals.",
    icon: <Leaf className="h-8 w-8 text-packiq-emerald" />,
    color: "group-hover:border-packiq-emerald/50",
  },
  {
    title: "Shipment Intelligence",
    description: "Smart carrier & box recommendations based on fragility, weight, and dimensions.",
    icon: <Brain className="h-8 w-8 text-packiq-cyan" />,
    color: "group-hover:border-packiq-cyan/50",
  },
  {
    title: "Dimensional Weight",
    description: "Cut DIM weight charges by 28% through perfect-fit packaging AI.",
    icon: <Ruler className="h-8 w-8 text-packiq-amber" />,
    color: "group-hover:border-packiq-amber/50",
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          delay: index * 0.1,
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-packiq-dark py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="font-heading text-4xl font-bold text-white md:text-5xl">
            Intelligent Logistics. <span className="text-gradient-blue">Automated.</span>
          </h2>
          <p className="mt-4 text-gray-400">Transform your shipping operations with enterprise-grade AI.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) cardsRef.current[i] = el;
              }}
              className={`group glass-card relative overflow-hidden p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${feature.color}`}
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5 blur-3xl transition-all duration-500 group-hover:bg-white/10"></div>
              
              <div className="mb-6 inline-block rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                {feature.icon}
              </div>
              <h3 className="mb-3 font-heading text-2xl font-bold text-white">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
