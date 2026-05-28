"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-packiq-dark py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-packiq-blue/10"></div>
      
      {/* Particle effect simplified with CSS */}
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at center, #2563EB 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading text-4xl font-bold text-white md:text-6xl"
        >
          Ready to optimize your logistics?
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-6 mb-10 text-xl text-gray-400"
        >
          Join thousands of companies saving money and the planet.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Link 
            href="/register"
            className="inline-block rounded-full bg-white px-10 py-5 text-lg font-bold text-packiq-dark shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all hover:scale-105 hover:bg-gray-100 hover:shadow-[0_0_40px_rgba(255,255,255,0.5)]"
          >
            Start Your Free Trial
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
