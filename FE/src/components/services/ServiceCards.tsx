import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useRef, type MouseEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { SERVICES } from '../../data/content';
import { SectionLabel } from '../SectionLabel';
import { Palette, Share2, TrendingUp, Camera, Heart, Video, Monitor, ArrowUpRight } from 'lucide-react';

const ICONS: Record<string, any> = { Palette, Share2, TrendingUp, Camera, Heart, Video, Monitor };

const ServiceCard = ({ service, index }: { service: typeof SERVICES[0]; index: number }) => {
  const Icon = ICONS[service.icon] || Palette;
  const ref = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-200, 200], [10, -10]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-200, 200], [-10, 10]), { stiffness: 150, damping: 20 });

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseX.set(x - rect.width / 2);
    mouseY.set(y - rect.height / 2);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
      }}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformPerspective: 1000,
      }}
      className="relative h-full"
    >
      <Link to={`/services/${service.slug}`} className="block h-full group">
        <div className="glass h-full rounded-[2rem] p-8 md:p-10 transition-all duration-500 hover:border-accent/30 overflow-hidden relative shadow-2xl">
          {/* Dynamic Spotlight Glow */}
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 group-hover:opacity-100 transition duration-300"
            style={{
              background: useTransform(
                [mouseX, mouseY],
                ([x, y]) => `radial-gradient(600px circle at ${Number(x) + (ref.current?.clientWidth || 0) / 2}px ${Number(y) + (ref.current?.clientHeight || 0) / 2}px, rgba(196, 239, 23, 0.1), transparent 80%)`
              ),
            }}
          />

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-12">
              <motion.div
                className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-accent group-hover:text-background transition-all duration-500 shadow-xl"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Icon className="w-8 h-8 text-accent group-hover:text-background transition-colors" />
              </motion.div>
              
              <div className="text-4xl font-display font-bold text-white/[0.02] group-hover:text-accent/10 transition-colors">
                {String(index + 1).padStart(2, '0')}
              </div>
            </div>

            <h3 className="text-3xl font-bold font-display uppercase mb-4 text-foreground tracking-tight group-hover:text-accent transition-colors leading-tight">
              {service.title}
            </h3>

            <p className="text-foreground/50 text-base font-medium leading-relaxed mb-8 italic">
              {service.shortDesc}
            </p>

            {service.features.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10">
                {service.features.map((feature) => (
                  <span
                    key={feature}
                    className="text-[10px] uppercase tracking-widest font-bold px-4 py-1.5 bg-white/5 rounded-full border border-white/5 text-foreground/40 group-hover:text-accent group-hover:border-accent/20 transition-all"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 text-accent text-xs font-bold uppercase tracking-[0.2em] group-hover:gap-5 transition-all duration-500">
              View Case Studies
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          
          {/* Bottom decorative line */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
        </div>
      </Link>
    </motion.div>
  );
};

export const ServiceCards = () => {
  return (
    <section className="py-32 px-6 md:px-12 relative">
      <div className="absolute left-0 bottom-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] -z-10 -translate-x-1/2 translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div className="max-w-2xl">
            <SectionLabel number="02" text="Services" />
            <h2 className="text-5xl md:text-7xl font-bold font-display tracking-tighter text-foreground uppercase leading-none mt-4">
              Our Core <span className="text-accent italic">Expertise</span>
            </h2>
          </div>
          <p className="text-foreground/40 text-sm md:text-base font-bold uppercase tracking-[0.2em] max-w-sm mb-2">
            Delivering cutting-edge digital experiences that define the next generation of brands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.slug} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
