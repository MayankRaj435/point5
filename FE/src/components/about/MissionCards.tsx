import { motion, useMotionValue, useTransform } from 'motion/react';
import { useRef, type MouseEvent } from 'react';
import { MISSION_CARDS } from '../../data/content';
import { Target, Eye, Handshake } from 'lucide-react';

const ICONS: Record<string, any> = { Target, Eye, Handshake };

const FlipCard = ({ card, index }: { card: typeof MISSION_CARDS[0]; index: number }) => {
  const Icon = ICONS[card.icon] || Target;
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-100, 100], [5, -5]);
  const rotateY = useTransform(mouseX, [-100, 100], [-5, 5]);

  const handleMouse = (e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
      style={{ rotateX, rotateY, transformPerspective: 600 }}
      className="group"
    >
      <div className="glass rounded-2xl p-8 md:p-10 h-full hover:border-accent/20 transition-all duration-500 hover-lift relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
            <Icon className="w-7 h-7 text-accent" />
          </div>

          <h3 className="text-xl md:text-2xl font-bold font-display uppercase mb-4 group-hover:text-accent transition-colors">
            {card.title}
          </h3>

          <p className="text-foreground/50 text-sm leading-relaxed">
            {card.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export const MissionCards = () => {
  return (
    <section className="py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MISSION_CARDS.map((card, i) => (
            <FlipCard key={card.title} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
