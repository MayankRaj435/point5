import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { COMPANY } from '../../data/content';
import { SectionLabel } from '../SectionLabel';
import { TextReveal } from '../TextReveal';
import { Cover } from '../ui/cover';
import { TextCarousel } from '../ui/text-carousel';
import { Instagram, Facebook, Linkedin, Twitter, MessageCircle } from 'lucide-react';

const WORDS = ["POINT5MEDIA", "STORYTELLING", "PRODUCTION", "CREATIVITY"];

const SOCIAL_LINKS = [
  { icon: Twitter, href: COMPANY.socials.twitter, label: 'Twitter', color: 'hover:bg-sky-500/10 hover:border-sky-500/30 hover:text-sky-400' },
  { icon: Instagram, href: COMPANY.socials.instagram, label: 'Instagram', color: 'hover:bg-pink-500/10 hover:border-pink-500/30 hover:text-pink-400' },
  { icon: Linkedin, href: COMPANY.socials.linkedin, label: 'Linkedin', color: 'hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-400' },
  { icon: Facebook, href: COMPANY.socials.facebook, label: 'Facebook', color: 'hover:bg-blue-600/10 hover:border-blue-600/30 hover:text-blue-500' },
  { icon: MessageCircle, href: COMPANY.socials.whatsapp, label: 'Whatsapp', color: 'hover:bg-green-500/10 hover:border-green-500/30 hover:text-green-400' },
];

export const ContactHero = () => {

  return (
    <section className="relative min-h-[70vh] flex items-start md:items-center overflow-hidden pt-36 md:pt-32 pb-20 text-center">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-16">
          {/* Breadcrumbs matching AboutHero/PageHero */}
          <nav className="flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-accent/40 mb-12">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <span className="w-4 h-[1px] bg-accent/20" />
            <span className="text-foreground/80">Contact</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full mb-12"
          >
            <Cover containerClassName="w-full py-16 md:py-24 bg-white/[0.01] border-y border-white/5">
              <h2 className="text-[12vw] md:text-8xl lg:text-[10rem] font-bold font-display tracking-tighter leading-[0.8] text-white uppercase">
                <TextReveal>Let's Start a</TextReveal>
                <br />
                <span className="text-accent italic">Conversation</span>
              </h2>
            </Cover>
          </motion.div>

          <TextCarousel words={WORDS} />

          <p className="text-foreground/40 text-lg md:text-xl font-medium max-w-2xl mb-16 italic">
            Whether you have a fully-formed idea or just the spark of an ambition, we're here to help you turn it into a digital masterpiece.
          </p>

          {/* Social links */}
          <div className="flex flex-wrap justify-center gap-4">
            {SOCIAL_LINKS.map((social, i) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.08, type: 'spring' }}
                className="flex items-center gap-3 px-6 py-4 rounded-full border border-white/10 bg-white/5 text-foreground font-bold uppercase tracking-widest text-xs transition-all duration-300 hover:scale-105 hover:bg-accent hover:text-background shadow-2xl"
              >
                <social.icon className="w-4 h-4" />
                {social.label}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
