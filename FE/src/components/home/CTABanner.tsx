import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { MagneticButton } from '../MagneticButton';
import { FOUNDERS } from '../../data/content';

export const CTABanner = () => {
  return (
    <section className="py-24 px-6 md:px-12 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5 animate-gradient-shift bg-[length:200%_200%]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 py-16 px-8 md:px-16 rounded-3xl border border-white/5 glass shadow-2xl">
          {/* Left - Text */}
          <div className="flex-1">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold font-display uppercase tracking-tighter mb-4 text-white"
            >
              Tell details about <br /><span className="text-accent opacity-40">your project</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/contact">
                <MagneticButton className="mt-6 bg-accent text-background px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider hover:shadow-[0_0_20px_rgba(196,239,23,0.4)] transition-all group inline-flex items-center gap-3">
                  Start a Project
                  <span className="w-6 h-6 rounded-full bg-background/20 flex items-center justify-center text-background group-hover:rotate-45 transition-transform">
                    →
                  </span>
                </MagneticButton>
              </Link>
            </motion.div>
          </div>

          {/* Right - Founder card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-5 bg-white/[0.03] rounded-2xl px-6 py-5 border border-white/10 shadow-2xl"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-accent/20 flex-shrink-0">
              <img
                src={FOUNDERS[0].image}
                alt={FOUNDERS[0].name}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div>
              <h4 className="font-bold font-display text-lg text-white">{FOUNDERS[0].name}</h4>
              <p className="text-accent text-sm font-bold uppercase tracking-wider">{FOUNDERS[0].role}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs text-white/40 font-medium">Response time: 4 hours</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
