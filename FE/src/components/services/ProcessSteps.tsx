import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { useRef } from 'react';
import { PROCESS_STEPS } from '../../data/content';
import { SectionLabel } from '../SectionLabel';
import { TextReveal } from '../TextReveal';

export const ProcessSteps = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section ref={containerRef} className="py-32 px-6 md:px-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/4" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-32">
          <SectionLabel number="07" text="Process" />
          <h2 className="text-5xl md:text-7xl font-bold font-display tracking-tighter text-foreground uppercase leading-none">
            <TextReveal>How we bring your vision to life</TextReveal>
          </h2>
          <p className="text-foreground/40 mt-6 max-w-2xl mx-auto text-sm md:text-base font-bold uppercase tracking-[0.2em]">
            A strategic six-step method engineered for excellence and impact
          </p>
        </div>

        <div className="relative">
          {/* Tracing Beam Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-white/5 -translate-x-1/2 hidden md:block" />
          <motion.div 
            style={{ scaleY, transformOrigin: "top" }}
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-accent via-accent/50 to-transparent -translate-x-1/2 hidden md:block z-10"
          />

          <div className="space-y-24 md:space-y-40">
            {PROCESS_STEPS.map((step, i) => {
              const isLeft = i % 2 === 0;

              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative flex flex-col md:flex-row items-start md:items-center gap-12 md:gap-0 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Content card */}
                  <div className={`flex-1 w-full ${isLeft ? 'md:pr-24 md:text-right' : 'md:pl-24'}`}>
                    <div className="group relative">
                      {/* Floating Number */}
                      <div className={`absolute -top-12 ${isLeft ? 'right-0' : 'left-0'} text-8xl font-display font-bold text-white/[0.03] group-hover:text-accent/10 transition-colors duration-500`}>
                        {step.num}
                      </div>

                      <div className="glass p-8 md:p-10 rounded-3xl hover:border-accent/30 transition-all duration-500 relative z-10 hover-lift">
                        {/* Inner Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                        
                        <div className={`flex items-center gap-3 mb-6 ${isLeft ? 'md:justify-end' : ''}`}>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-background bg-accent px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(196,239,23,0.3)]">
                            {step.duration}
                          </span>
                        </div>
                        
                        <h3 className="text-2xl md:text-3xl font-bold font-display mb-4 text-foreground uppercase tracking-tight">
                          {step.title}
                        </h3>
                        <p className="text-foreground/50 text-base font-medium leading-relaxed italic max-w-lg ml-auto mr-0 md:mr-auto">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Animated Node */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-20">
                    <motion.div
                      className="w-16 h-16 rounded-full bg-background border border-white/10 flex items-center justify-center text-foreground font-display font-bold text-lg relative group"
                      whileInView={{ borderColor: 'rgba(196, 239, 23, 0.5)', scale: 1.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="absolute inset-0 rounded-full bg-accent/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="relative z-10 group-hover:text-accent transition-colors">{step.num}</span>
                    </motion.div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block flex-1" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
