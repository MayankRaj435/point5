import { motion, useScroll, useTransform, useAnimationFrame } from 'motion/react';
import { ArrowRight, Instagram, Facebook, Linkedin } from 'lucide-react';
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

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6" {...props}>
    <path d="M19.005 4.908A9.817 9.817 0 0 0 11.992 2C6.534 2 2.085 6.448 2.08 11.91c0 1.748.458 3.45 1.321 4.956L2 22l5.251-1.378a9.808 9.808 0 0 0 4.74 1.226h.004c5.454 0 9.905-4.449 9.91-9.913a9.813 9.813 0 0 0-2.899-6.927zM12 20.354a8.17 8.17 0 0 1-4.173-1.144l-.299-.177-3.1 3.1 3.155-3.03-.326-.188A8.172 8.172 0 0 1 3.75 11.91c0-4.502 3.666-8.169 8.178-8.169a8.17 8.17 0 0 1 5.782 2.396 8.175 8.175 0 0 1 2.392 5.79c-.005 4.505-3.673 8.177-8.102 8.177zm4.473-6.096c-.244-.122-1.448-.715-1.673-.797-.225-.082-.39-.122-.553.122-.163.245-.631.797-.773.96-.143.163-.286.184-.53.062a6.673 6.673 0 0 1-1.967-1.214 7.37 7.37 0 0 1-1.36-1.693c-.143-.245-.015-.378.107-.5a6.45 6.45 0 0 0 .5-.674c.061-.122.03-.245-.015-.327-.045-.082-.39-.939-.533-1.286-.14-.337-.295-.29-.405-.296-.105-.005-.225-.005-.347-.005s-.327.046-.49.225c-.163.18-.633.619-.633 1.512s.653 1.758.744 1.88c.092.122 1.284 1.962 3.112 2.753.435.188.775.3 1.04.385.437.14.835.12 1.15.073.35-.053 1.448-.592 1.653-1.164.205-.572.205-1.063.143-1.165-.062-.102-.225-.184-.469-.306z"/>
  </svg>
);

const SOCIAL_ORBIT = [
  { icon: WhatsAppIcon, href: COMPANY.socials.whatsapp, label: 'WhatsApp', angle: 0 },
  { icon: XIcon, href: COMPANY.socials.twitter, label: 'Twitter', angle: 72 },
  { icon: Linkedin, href: COMPANY.socials.linkedin, label: 'LinkedIn', angle: 144 },
  { icon: Instagram, href: COMPANY.socials.instagram, label: 'Instagram', angle: 216 },
  { icon: Facebook, href: COMPANY.socials.facebook, label: 'Facebook', angle: 288 },
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
            Lets explore new realms of creativity!
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

            {/* Centered Company Logo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="flex flex-col items-center justify-center bg-background/50 backdrop-blur-xl border border-white/10 w-24 h-24 md:w-36 md:h-36 rounded-full shadow-[0_0_50px_rgba(196,239,23,0.15)]"
              >
                <span className="font-display font-bold text-[10px] md:text-sm tracking-[0.25em] text-white/50 leading-none mb-1 uppercase">
                  POINT
                </span>
                <span className="inline-flex items-center justify-center w-8 h-8 md:w-12 md:h-12 bg-accent rounded-xl text-background font-bold text-sm md:text-2xl shadow-[0_0_25px_rgba(196,239,23,0.5)] my-0.5 animate-pulse">
                  5
                </span>
                <span className="font-display font-bold text-[10px] md:text-sm tracking-[0.25em] text-white/50 leading-none mt-1 uppercase">
                  MEDIA
                </span>
              </motion.div>
            </div>

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
                    <social.icon className="w-5 h-5 md:w-6 md:h-6" />
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
