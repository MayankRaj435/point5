import { motion } from 'motion/react';
import { PageHero } from '../components/PageHero';
import { ProcessSteps } from '../components/services/ProcessSteps';
import { ServiceCards } from '../components/services/ServiceCards';
import { GridBackground } from '../components/ui/GridBackground';
import { BackgroundBeams } from '../components/ui/BackgroundBeams';
import { PageDetailing } from '../components/ui/PageDetailing';

export const ServicesPage = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-background text-foreground min-h-screen relative selection:bg-accent/30"
    >
      <PageDetailing />
      {/* Background Layering */}
      <div className="fixed inset-0 z-0">
        <GridBackground className="opacity-[0.03]" />
        <BackgroundBeams className="opacity-20" />
        <div className="noise-bg fixed inset-0 opacity-[0.02]" />
      </div>

      <div className="relative z-10">
        <PageHero title="Expertise In" accentTitle="Production" breadcrumb="Services" />
        
        <div className="relative">
          {/* Section separator with glow */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
          <ServiceCards />
          
          <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/10 to-transparent" />
          <ProcessSteps />
        </div>
      </div>

      {/* Final CTA or Footer Spacer */}
      <div className="h-32 bg-gradient-to-t from-accent/5 to-transparent" />
    </motion.main>
  );
};