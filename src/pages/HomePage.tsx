import { motion } from 'motion/react';
import { Hero } from '../components/Hero';
import { BrandMarquee } from '../components/home/BrandMarquee';
import { Testimonials } from '../components/home/Testimonials';
import { Founders } from '../components/home/Founders';
import { ContactSection } from '../components/home/ContactSection';
import { FaqSection } from '../components/home/FaqSection';
import { TextCarousel } from '../components/ui/text-carousel';

export const HomePage = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-background text-foreground min-h-screen overflow-hidden"
    >
      <Hero />
      <BrandMarquee />

      <div className="py-20 bg-white/[0.01] border-y border-white/5 overflow-hidden">
        <TextCarousel 
          words={["POINT5MEDIA", "CINEMATIC", "INNOVATIVE", "STORYTELLING"]} 
          className="py-12"
        />
      </div>

      <Testimonials />
      <Founders />
      <ContactSection />
      <FaqSection />
    </motion.main>
  );
};
