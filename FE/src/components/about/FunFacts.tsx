import { motion } from 'motion/react';
import { FUN_FACTS } from '../../data/content';
import { SectionLabel } from '../SectionLabel';
import { TextReveal } from '../TextReveal';

export const FunFacts = () => {
  return (
    <section className="py-24 px-6 md:px-12 relative bg-black overflow-hidden">
      {/* Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
        <span className="text-[20vw] font-black font-display leading-none whitespace-nowrap">
          POINT5MEDIA
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionLabel number="04" text="FunFacts" />

        <div className="mt-12 text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight leading-tight max-w-4xl mx-auto italic">
            <TextReveal>"A streamlined solution build to power business."</TextReveal>
          </h2>
          <p className="text-foreground/40 text-lg mt-8 max-w-2xl mx-auto">
            We’re more than pixels and code — we’re coffee lovers, cat people, meme sharers, and design geeks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FUN_FACTS.map((fact, i) => (
            <motion.div
              key={fact.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="p-10 rounded-3xl bg-white/[0.03] border border-white/10 text-center group hover:bg-accent transition-all duration-500"
            >
              <h3 className="text-5xl md:text-6xl font-bold font-display mb-2 text-white group-hover:text-black transition-colors">
                {fact.number}
              </h3>
              <p className="text-foreground/40 text-sm font-mono uppercase tracking-widest group-hover:text-black/60 transition-colors">
                {fact.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
