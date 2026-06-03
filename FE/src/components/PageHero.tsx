import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { TextReveal } from './TextReveal';
import { Cover } from './ui/cover';

interface PageHeroProps {
  title: string;
  accentTitle?: string;
  breadcrumb: string;
}

export const PageHero = ({ title, accentTitle, breadcrumb }: PageHeroProps) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const blur = useTransform(scrollYProgress, [0, 0.5], [0, 10]);

  return (
    <section ref={ref} className="relative min-h-[70vh] flex items-start md:items-center overflow-hidden pt-36 md:pt-32 pb-20 bg-background">
      {/* Parallax Background */}
      <motion.div style={{ y, scale, filter: `blur(${blur}px)` }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </motion.div>

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="flex flex-col items-center text-center">
          
          {/* Breadcrumbs matching AboutHero */}
          <nav className="flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-accent/40 mb-12">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <span className="w-4 h-[1px] bg-accent/20" />
            <span className="text-foreground/80">{breadcrumb}</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full mb-16"
          >
            <Cover containerClassName="w-full py-16 md:py-24 bg-white/[0.01] border-y border-white/5">
              <h1 className="text-[12vw] md:text-8xl lg:text-[10rem] font-bold font-display tracking-tighter text-white leading-[0.8] uppercase">
                <TextReveal>{title}</TextReveal>
                {accentTitle && (
                  <>
                    <br />
                    <span className="text-accent italic">{accentTitle}</span>
                  </>
                )}
              </h1>
            </Cover>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-foreground/40 text-lg md:text-xl font-medium max-w-2xl italic"
          >
            Crafting premium digital experiences through strategic design and cinematic storytelling.
          </motion.p>
        </div>
      </motion.div>
      
      {/* Decorations */}
      <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};
