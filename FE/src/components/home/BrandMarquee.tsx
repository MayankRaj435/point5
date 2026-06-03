import { motion, useAnimation } from 'motion/react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BRAND_LOGOS } from '../../data/content';

export const BrandMarquee = () => {
  const logos = [...BRAND_LOGOS, ...BRAND_LOGOS, ...BRAND_LOGOS, ...BRAND_LOGOS];
  const [isPaused, setIsPaused] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    if (isPaused) {
      controls.stop();
    } else {
      controls.start({
        x: '-50%',
        transition: { duration: 40, repeat: Infinity, ease: 'linear' },
      });
    }
  }, [isPaused, controls]);

  // Kick off on mount
  useEffect(() => {
    controls.start({
      x: '-50%',
      transition: { duration: 40, repeat: Infinity, ease: 'linear' },
    });
  }, [controls]);

  return (
    <section className="py-24 border-y border-white/5 bg-background overflow-hidden relative">
      {/* Background glow behind marquee matching reference */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-accent/5 blur-[100px] pointer-events-none" />

      <div className="flex flex-col gap-12">
        <div className="px-6 md:px-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-foreground/30 text-[10px] font-bold uppercase tracking-[0.5em] text-center"
          >
            Trusted by global brands &amp; industry leaders
          </motion.p>
        </div>

        <div className="relative w-full overflow-hidden">
          {/* Gradient edges for seamless transition */}
          <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="flex whitespace-nowrap">
            <motion.div
              animate={controls}
              className="flex items-center gap-24 md:gap-48 pr-24 md:pr-48"
            >
              {logos.map((logo, i) => (
                <Link
                  key={`${logo.name}-${i}`}
                  to={`/services/branding#${logo.slug}`}
                  className="flex-shrink-0 group relative"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                  title={logo.name}
                >
                  {/* Tooltip */}
                  <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white/10 backdrop-blur-sm border border-white/10 text-white text-[10px] font-semibold tracking-widest uppercase px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 shadow-lg">
                    {logo.name}
                  </span>

                  {/* Click-to-view indicator */}
                  <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-accent text-[9px] font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                    View Work ↗
                  </span>

                  <img
                    src={logo.src}
                    alt={logo.name}
                    className="h-16 md:h-24 lg:h-32 w-auto object-contain opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_16px_rgba(255,255,255,0.25)]"
                    loading="lazy"
                    draggable={false}
                  />
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
