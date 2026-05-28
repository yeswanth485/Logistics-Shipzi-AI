"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Head of Logistics",
    company: "GlobalRetail",
    content: "PackIQ reduced our dimensional weight charges by 28% in the first quarter alone. The ROI was immediate.",
    rating: 5,
  },
  {
    name: "David Chen",
    role: "Operations Director",
    company: "EcoGoods",
    content: "We've hit our sustainability targets two years early thanks to the packaging waste reductions identified by this AI.",
    rating: 5,
  },
  {
    name: "Elena Rodriguez",
    role: "Fulfillment Manager",
    company: "TechBox",
    content: "The 3D visualization makes it incredibly easy for our warehouse team to pack exactly as the AI suggests. Brilliant UI.",
    rating: 5,
  }
];

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-packiq-dark py-32 px-6">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute -left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-packiq-blue/20 blur-[120px]"></div>
        <div className="absolute -right-1/4 bottom-1/4 h-[500px] w-[500px] rounded-full bg-packiq-cyan/20 blur-[120px]"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-20 text-center">
          <h2 className="font-heading text-4xl font-bold text-white md:text-5xl">
            Trusted by Industry Leaders
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card flex flex-col justify-between p-8 transition-transform hover:-translate-y-2"
            >
              <div>
                <div className="mb-6 flex space-x-1 text-packiq-amber">
                  {[...Array(t.rating)].map((_, j) => (
                    <svg key={j} className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mb-6 text-lg leading-relaxed text-gray-300">&quot;{t.content}&quot;</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-packiq-blue to-packiq-cyan text-xl font-bold text-white">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-white">{t.name}</h4>
                  <p className="text-sm text-gray-400">{t.role}, {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
