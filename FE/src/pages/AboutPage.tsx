import { motion } from 'motion/react';
import { AboutHero } from '../components/about/AboutHero';
import { AboutIntro } from '../components/about/AboutIntro';
import { WhyChooseUs } from '../components/about/WhyChooseUs';
import { FunFacts } from '../components/about/FunFacts';
import { AboutServices } from '../components/about/AboutServices';
import { PageDetailing } from '../components/ui/PageDetailing';
import GoogleGeminiEffectDemo from '../components/google-gemini-effect-demo';
import { Team } from '../components/about/Team';

export const AboutPage = () => {
  return (
    <main className="bg-black text-white min-h-screen relative">
      <PageDetailing />
      <AboutHero />
      <AboutIntro />
      <Team />
      <GoogleGeminiEffectDemo />
      <WhyChooseUs />
      <FunFacts />
      <AboutServices />
    </main>
  );
};
