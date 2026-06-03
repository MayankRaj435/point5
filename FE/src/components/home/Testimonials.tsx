import { motion, AnimatePresence } from 'motion/react';
import { useRef, useState } from 'react';
import { Star, Quote, ArrowRight } from 'lucide-react';
import { MagneticButton } from '../MagneticButton';
import { TESTIMONIALS } from '../../data/content';
import { SectionLabel } from '../SectionLabel';
import { GridBackground } from '../ui/GridBackground';
import { cn } from '../../lib/utils';
import { KineticText } from '../motion/KineticText';
import { useScrollTypeLink } from '../../motion/useScrollTypeLink';

export const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  useScrollTypeLink(headingRef);

  return (
    <section className="py-32 px-6 md:px-12 relative overflow-hidden bg-background">
      <GridBackground className="opacity-10" />
      
      {/* Background blobs for depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <SectionLabel number="06" text="Testimonial" />
            <h2
              ref={headingRef}
              className="text-5xl md:text-7xl font-bold font-display uppercase tracking-tighter leading-none mb-6"
            >
              <KineticText as="span" className="block">
                The best reviews
              </KineticText>
              <KineticText as="span" className="block text-white/20" delay={0.05}>
                from clients
              </KineticText>
            </h2>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-6">
            <p className="text-foreground/60 max-w-sm text-left md:text-right font-medium">
              Don't just take our word for it — see what our clients think.
            </p>
            <MagneticButton className="bg-white/5 border border-white/10 text-foreground px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-accent hover:text-background transition-all group">
              <span className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-background">
                <ArrowRight className="w-4 h-4" />
              </span>
              More Review
            </MagneticButton>
          </div>
        </div>

        {/* Testimonial Display Area */}
        <div className="relative min-h-[650px] flex items-center justify-center">
          {/* Floating Avatars */}
          <div className="absolute inset-0 pointer-events-none">
            {TESTIMONIALS.map((t, i) => {
              const angle = (i / TESTIMONIALS.length) * Math.PI * 2;
              const radiusX = 450;
              const radiusY = 280;
              const floatDelay = i * 0.5;
              
              return (
                <div
                  key={i}
                  className="absolute hidden md:block"
                  style={{
                    left: `calc(50% + ${Math.cos(angle) * radiusX}px - 40px)`,
                    top: `calc(50% + ${Math.sin(angle) * radiusY}px - 40px)`,
                    animation: `floatAvatar ${5 + i}s ease-in-out infinite`,
                    animationDelay: `${floatDelay}s`,
                  }}
                >
                  <div 
                    className={cn(
                      "relative rounded-full border transition-all duration-500 cursor-pointer pointer-events-auto bg-white/5",
                      i === activeIndex 
                        ? "border-accent ring-4 ring-accent/30 scale-125 z-20" 
                        : "border-white/10 opacity-40 hover:opacity-100 scale-100 grayscale hover:grayscale-0",
                      "flex items-center justify-center w-16 h-16 md:w-20 md:h-20"
                    )}
                    onClick={() => setActiveIndex(i)}
                  >
                    {t.avatar ? (
                      <img
                        src={t.avatar}
                        className="w-full h-full rounded-full object-cover p-1"
                        alt={t.author}
                      />
                    ) : (
                      <span className="text-2xl font-bold font-display text-white/50 uppercase">
                        {t.author.charAt(0)}
                      </span>
                    )}
                    {i === activeIndex && (
                      <div className="absolute inset-0 rounded-full shadow-[0_0_40px_rgba(196,239,23,0.4)] animate-pulse pointer-events-none" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <style>{`
            @keyframes floatAvatar {
              0%, 100% { transform: translateY(0px) translateX(0px); }
              33% { transform: translateY(-12px) translateX(8px); }
              66% { transform: translateY(-6px) translateX(-4px); }
            }
          `}</style>

          {/* Central Active Testimonial */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={(_, info) => {
                const swipeThreshold = 50;
                if (info.offset.x < -swipeThreshold) {
                  // Swipe left -> next testimonial
                  setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
                } else if (info.offset.x > swipeThreshold) {
                  // Swipe right -> prev testimonial
                  setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
                }
              }}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, y: -20 }}
              className="max-w-2xl text-center relative z-10 px-6 cursor-grab active:cursor-grabbing select-none w-full flex flex-col items-center"
            >
              <motion.div
                initial={{ rotate: -10, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center mb-8"
              >
                <Quote className="w-16 h-16 text-accent fill-accent" />
              </motion.div>

              <blockquote className="text-xl md:text-3xl font-bold font-display leading-relaxed mb-10 text-foreground italic">
                "{TESTIMONIALS[activeIndex].quote}"
              </blockquote>

              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-1">
                  {[...Array(TESTIMONIALS[activeIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                  ))}
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-foreground font-bold text-lg">{TESTIMONIALS[activeIndex].author}</span>
                  <span className="text-foreground/40 text-sm font-bold uppercase tracking-widest mt-1">
                    Client Partner
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Mobile dots */}
        <div className="flex md:hidden gap-2 justify-center mt-12">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                i === activeIndex ? "w-8 bg-accent" : "w-1.5 bg-white/20"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
