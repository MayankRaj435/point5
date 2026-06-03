import { motion, useMotionValue, useTransform } from 'motion/react';
import { FOUNDERS } from '../../data/content';
import { SectionLabel } from '../SectionLabel';
import { useRef, type MouseEvent } from 'react';
import { KineticText } from '../motion/KineticText';
import { useScrollTypeLink } from '../../motion/useScrollTypeLink';

const FounderCard = ({ founder, index }: { founder: typeof FOUNDERS[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-150, 150], [8, -8]);
  const rotateY = useTransform(mouseX, [-150, 150], [-8, 8]);

  const handleMouse = (e: MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800, willChange: 'transform' }}
      className="relative group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-3xl bg-white/[0.03] border border-white/5 group-hover:border-accent/20 transition-all duration-500 shadow-2xl">
        {/* Image */}
        <div className="aspect-[4/5] overflow-hidden">
          <motion.img
            src={founder.image}
            alt={founder.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
        </div>



        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <h3 className="text-3xl font-bold font-display uppercase tracking-tighter text-white mb-2">
              {founder.name}
            </h3>
            <p className="text-accent text-sm font-bold uppercase tracking-widest">
              {founder.role}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export const Founders = () => {
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  useScrollTypeLink(headingRef);

  return (
    <section className="py-32 px-6 md:px-12 relative overflow-hidden bg-background">
      {/* Background text 'EXPERT FOUNDERS' */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-0 pointer-events-none select-none overflow-hidden">
        <h2 className="text-[18vw] font-display font-bold uppercase tracking-tighter text-white/[0.02] leading-none whitespace-nowrap">
          Expert
        </h2>
        <h2 className="text-[18vw] font-display font-bold uppercase tracking-tighter text-white/[0.02] leading-none whitespace-nowrap -mt-[5vw]">
          Founders
        </h2>
      </div>

      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-[20vw] h-[20vw] bg-accent/5 rounded-full blur-[60px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[15vw] h-[15vw] bg-accent/5 rounded-full blur-[60px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
          <div>
            <SectionLabel number="08" text="Founders" />
            <h2
              ref={headingRef}
              className="text-5xl md:text-7xl font-bold font-display uppercase tracking-tighter leading-none text-white"
            >
              <KineticText as="span" className="block">
                Meet our
              </KineticText>
              <KineticText as="span" className="block text-white/20" delay={0.05}>
                visionary leaders
              </KineticText>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {FOUNDERS.map((founder, i) => (
            <FounderCard key={founder.name} founder={founder} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
