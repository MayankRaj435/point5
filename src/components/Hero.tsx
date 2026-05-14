import { motion, useScroll, useTransform, useAnimationFrame } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { COMPANY, HERO_BG } from '../data/content';
import { KineticText } from './motion/KineticText';
import { MagneticButton } from './MagneticButton';
import { Spotlight } from './ui/Spotlight';
import { BackgroundBeams } from './ui/BackgroundBeams';
import { GridBackground } from './ui/GridBackground';
import { EmeraldSphere3D } from './EmeraldSphere3D';
import { useIsMobile } from '../hooks/useIsMobile';

const SOCIAL_ORBIT = [
  { icon: '💬', href: COMPANY.socials.whatsapp, label: 'WhatsApp', angle: 0 },
  { icon: '𝕏', href: COMPANY.socials.twitter, label: 'Twitter', angle: 72 },
  { icon: 'in', href: COMPANY.socials.linkedin, label: 'LinkedIn', angle: 144 },
  { icon: '📷', href: COMPANY.socials.instagram, label: 'Instagram', angle: 216 },
  { icon: 'f', href: COMPANY.socials.facebook, label: 'Facebook', angle: 288 },
];

const ORBIT_SPEED = 0.05; // degrees per frame (~3 deg/sec at 60fps → full rotation ~120s)

export const Hero = () => {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);


  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-background"
    >
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
      <BackgroundBeams />
      <GridBackground className="opacity-20" />

      {/* Background Image with Parallax */}
      <motion.div style={{ y: isMobile ? 0 : bgY, scale: isMobile ? 1 : bgScale }} className="absolute inset-0 z-0">

        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </motion.div>

      {/* Noise overlay */}
      <div className="noise-bg absolute inset-0 z-[2]" />

      {/* 3D Sphere Background */}
      <div className="absolute inset-0 z-[1] flex items-center justify-center opacity-50">
         <EmeraldSphere3D />
      </div>

      {/* Main Content */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto w-full pt-24 flex flex-col md:flex-row items-center justify-between gap-12"
      >
        <div className="flex-1 text-left">
          {/* Social tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-accent text-xs uppercase tracking-[0.3em] font-bold mb-6 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            We're on social media:
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-[14vw] md:text-[7rem] lg:text-[8rem] font-display font-bold uppercase leading-[0.8] tracking-tighter mb-8 text-shadow-glow"
          >
            <KineticText className="block">POINT5MEDIA</KineticText>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="max-w-xl text-foreground/70 text-base md:text-lg leading-relaxed font-medium mb-10"
          >
            {COMPANY.heroDescription}
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <Link to="/about">
              <MagneticButton className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 text-foreground px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-accent hover:text-background transition-all duration-500 group shadow-2xl">
                <span className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-background transition-transform group-hover:rotate-45">
                  <ArrowRight className="w-4 h-4" />
                </span>
                About Our Agency
              </MagneticButton>
            </Link>
          </motion.div>
        </div>

        {/* Social Media Orbital Ring (right side) */}
        <div className="flex-shrink-0 relative z-20 lg:translate-x-[5vw]">
          <div
            className="relative w-[280px] h-[280px] md:w-[400px] md:h-[400px]"
          >
            {/* Outer decorative rings */}
            <motion.div
              className="absolute inset-0 border border-accent/20 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-8 border border-white/10 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            />

            {/* Rotating orbit group: arc + dot + social icons */}
            <motion.div
              className="absolute inset-0 will-change-transform"
              animate={isMobile ? { rotate: 0 } : { rotate: 360 }}
              transition={isMobile ? { duration: 0 } : { duration: 120, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: 'center' }}
            >
              {/* Glowing arc segment */}
              <svg className="absolute inset-0 w-full h-full rotate-[-45deg] opacity-80" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray="100 200"
                  className="text-accent"
                />
              </svg>

              {/* Accent dot at top */}
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-accent rounded-full shadow-[0_0_20px_#C4EF17]"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Social icons positioned around the circle */}
              {SOCIAL_ORBIT.map((social, i) => {
                // Responsive radius: smaller on mobile
                const radius = typeof window !== 'undefined' && window.innerWidth < 768 ? 130 : 180;
                const rad = (social.angle * Math.PI) / 180;
                const x = Math.cos(rad) * radius;
                const y = Math.sin(rad) * radius;

                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute w-12 h-12 md:w-16 md:h-16 rounded-full bg-background border border-white/10 flex items-center justify-center text-foreground hover:bg-accent hover:text-background transition-all duration-500 hover:scale-125 z-30 shadow-xl"
                    style={{
                      left: `calc(50% + ${x}px - 24px)`,
                      top: `calc(50% + ${y}px - 24px)`,
                      // This transform counter-rotates the icon so it stays upright
                      // We'll use a CSS animation on the parent and counter it here if possible, 
                      // but since we want performance, let's just let them rotate for now or fix them to parent.
                      // Actually, let's keep them fixed to parent for better perf.
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 + i * 0.1, type: 'spring' }}
                    aria-label={social.label}
                  >
                    <span className="text-sm md:text-xl font-bold">{social.icon}</span>
                  </motion.a>
                );
              })}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent z-[5]" />
    </section>
  );
};
