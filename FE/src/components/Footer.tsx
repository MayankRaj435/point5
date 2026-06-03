import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { COMPANY } from '../data/content';
import { Instagram, Facebook, Linkedin, Twitter, MessageCircle } from 'lucide-react';

const FOOTER_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact Us', path: '/contact' },
];

const SOCIAL_LINKS = [
  { icon: Twitter, href: COMPANY.socials.twitter, label: 'Twitter' },
  { icon: Instagram, href: COMPANY.socials.instagram, label: 'Instagram' },
  { icon: Linkedin, href: COMPANY.socials.linkedin, label: 'LinkedIn' },
  { icon: Facebook, href: COMPANY.socials.facebook, label: 'Facebook' },
  { icon: MessageCircle, href: COMPANY.socials.whatsapp, label: 'WhatsApp' },
];

export const Footer = () => {
  return (
    <footer className="relative bg-black border-t border-white/5 overflow-hidden">
      {/* Animated gradient border on top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <span className="font-display font-bold text-2xl tracking-tighter uppercase text-white">
                POINT
                <span className="inline-flex items-center justify-center w-8 h-8 bg-accent rounded text-black font-bold text-xs mx-[1px] align-middle shadow-lg">
                  5
                </span>
                MEDIA
              </span>
            </div>
            <p className="text-foreground/40 text-lg leading-relaxed max-w-md mb-8">
              Creative minds building impactful digital experiences. We help brands stand out through storytelling and strategic design.
            </p>
            <a
              href={`mailto:${COMPANY.email}`}
              className="text-2xl md:text-3xl font-display font-bold text-white hover:text-accent transition-colors"
            >
              {COMPANY.email}
            </a>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-accent mb-8">
              Quick Navigation
            </h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-white/40 hover:text-white font-bold text-base transition-colors"
                    onClick={(e) => {
                      if (window.location.pathname === link.path) {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-accent mb-8">
              Social Media
            </h4>
            <div className="grid grid-cols-3 gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-accent hover:bg-white/10 hover:border-accent/30 transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs uppercase tracking-widest text-white/20 font-bold">
            © All rights reserved
          </p>
          <p className="text-xs uppercase tracking-widest text-white/20 font-bold">
            Made with <span className="text-accent">♥</span> by{' '}
            <a href="/" className="text-white/40 hover:text-accent transition-colors">
              POINT5MEDIA
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
