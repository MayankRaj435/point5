import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { HERO_BG } from '../../data/content';
import { EmeraldSphere3D } from '../EmeraldSphere3D';
import { Cover } from '../ui/cover';
import { TextReveal } from '../TextReveal';

export const AboutHero = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden pt-32 pb-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent" />
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Content Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="flex flex-col items-center text-center">
          
          {/* Left Content (Now Centered) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {/* Breadcrumbs */}
            <nav className="flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-accent/40 mb-12">
              <Link to="/" className="hover:text-accent transition-colors">Home</Link>
              <span className="w-4 h-[1px] bg-accent/20" />
              <span className="text-foreground/80">About Us</span>
            </nav>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="mb-16"
            >
              <Cover containerClassName="w-full py-12 md:py-20 bg-white/[0.01] border-y border-white/5">
                <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-bold font-display tracking-tighter text-white leading-[0.8] uppercase">
                  Defining the <br /> <span className="text-accent italic">Future</span>
                </h1>
              </Cover>
            </motion.div>
            
            <div className="max-w-2xl mx-auto">
              <p className="text-foreground/50 text-lg md:text-xl leading-relaxed font-medium mb-16 italic">
                We are a multidisciplinary team of creative minds passionate about crafting visual stories and digital experiences that push the boundaries of what's possible.
              </p>

              <div className="flex items-center justify-center gap-12">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-white tracking-tighter">03+</span>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold mt-1">Years Experience</span>
                </div>
                <div className="w-[1px] h-12 bg-white/10" />
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-white tracking-tighter">50+</span>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold mt-1">Global Brands</span>
                </div>
                <div className="w-[1px] h-12 bg-white/10" />
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-white tracking-tighter">24/7</span>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold mt-1">Creative Support</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Visual - 3D Sphere & HUD */}
          <div className="relative h-[500px] hidden lg:flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="w-full h-full relative"
            >
              {/* HUD Detailing Overlay */}
              <div className="absolute inset-0 z-10 pointer-events-none">
                {/* Rotating Outer Ring */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-10 border border-accent/10 rounded-full border-dashed" 
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-20 border border-white/5 rounded-full" 
                />
                
                {/* Coordinate Labels */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[10px] font-mono text-accent/40 uppercase tracking-widest">
                  Lat: 25.4358° N
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] font-mono text-accent/40 uppercase tracking-widest">
                  Lon: 81.8463° E
                </div>
                
                {/* Decorative Brackets */}
                <div className="absolute top-1/4 left-10 w-4 h-20 border-l border-t border-b border-white/20" />
                <div className="absolute bottom-1/4 right-10 w-4 h-20 border-r border-t border-b border-white/20" />
              </div>

              {/* The 3D Sphere */}
              <EmeraldSphere3D />
              
              {/* Hover Instructions */}
              <div className="absolute bottom-10 right-0 text-[9px] font-mono text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-10 h-[1px] bg-white/10" />
                Dwell to activate core
              </div>
            </motion.div>
          </div>

        </div>
      </div>
      
      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};
