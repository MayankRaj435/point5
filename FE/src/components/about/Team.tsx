import { motion, useMotionValue, useTransform } from 'motion/react';
import { TEAM_MEMBERS } from '../../data/content';
import { SectionLabel } from '../SectionLabel';
import { useRef, type MouseEvent } from 'react';
import { KineticText } from '../motion/KineticText';
import { useScrollTypeLink } from '../../motion/useScrollTypeLink';

const TeamCard = ({ member, index }: { member: typeof TEAM_MEMBERS[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-150, 150], [5, -5]);
  const rotateY = useTransform(mouseX, [-150, 150], [-5, 5]);

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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: Math.min(index * 0.06, 0.4), duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000, willChange: 'transform' }}
      className="relative group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-3xl bg-white/[0.03] border border-white/5 group-hover:border-accent/20 transition-colors duration-300 shadow-xl">
        {/* Image */}
        <div className="aspect-[4/5] overflow-hidden">
          <img
            src={member.image}
            alt={member.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ willChange: 'transform' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
        </div>



        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
          <h3 className="text-xl md:text-2xl font-bold font-display uppercase leading-tight text-white mb-1">
            {member.name}
          </h3>
          <p className="text-accent text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-80">
            {member.role}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export const Team = () => {
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  useScrollTypeLink(headingRef);

  return (
    <section
      className="py-32 px-6 md:px-12 relative overflow-hidden bg-background border-t border-white/5"
      style={{ contain: 'layout style' }}
    >
      {/* Background text — isolated from scroll repaints */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center z-0 pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <h2 className="text-[18vw] font-display font-bold uppercase tracking-tighter text-white/[0.02] leading-none whitespace-nowrap">
          Creative
        </h2>
        <h2 className="text-[18vw] font-display font-bold uppercase tracking-tighter text-white/[0.02] leading-none whitespace-nowrap -mt-[5vw]">
          Team
        </h2>
      </div>

      {/* Decorative blobs — reduced size & blur to avoid costly recompositing on scroll */}
      <div className="absolute top-0 left-0 w-[20vw] h-[20vw] bg-accent/5 rounded-full blur-[60px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ willChange: 'auto' }} />
      <div className="absolute bottom-0 right-0 w-[15vw] h-[15vw] bg-accent/5 rounded-full blur-[60px] translate-x-1/3 translate-y-1/3 pointer-events-none" style={{ willChange: 'auto' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
          <div>
            <SectionLabel number="04" text="The Team" />
            <h2
              ref={headingRef}
              className="text-5xl md:text-7xl font-bold font-display uppercase tracking-tighter leading-none text-white"
            >
              <KineticText as="span" className="block">
                Meet our
              </KineticText>
              <KineticText as="span" className="block text-white/20" delay={0.05}>
                creative team
              </KineticText>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {TEAM_MEMBERS.map((member, i) => (
            <TeamCard key={member.name} member={member} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
