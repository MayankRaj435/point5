import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MagneticButton } from './MagneticButton';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-500 px-4 md:px-8 lg:px-12",
          isScrolled ? "py-3" : "py-5"
        )}
      >
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "max-w-7xl mx-auto flex justify-between items-center px-6 md:px-8 py-3 rounded-full border transition-all duration-500 shadow-2xl",
            isScrolled
              ? "bg-background/80 backdrop-blur-xl border-white/10"
              : "bg-background/40 backdrop-blur-md border-white/5"
          )}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={(e) => {
            if (location.pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}>
            <motion.span
              className="font-display font-bold text-lg md:text-xl tracking-tighter uppercase text-white"
              whileHover={{ scale: 1.02 }}
            >
              POINT
              <span className="inline-flex items-center justify-center w-6 h-6 bg-accent rounded text-background font-bold text-[10px] mx-[1px] align-middle shadow-lg">
                5
              </span>
              <span className="text-white">MEDIA</span>
            </motion.span>
            <span className="hidden md:block text-[9px] uppercase tracking-[0.25em] text-accent/30 font-medium mt-0.5">
              Productions
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((item, i) => (
              <div key={item.label} className="relative" onMouseEnter={() => item.children && setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-1 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] rounded-full transition-all duration-300",
                    location.pathname === item.path
                      ? "text-background bg-accent shadow-[0_0_15px_rgba(196,239,23,0.3)]"
                      : "text-white/70 hover:text-accent hover:bg-white/5"
                  )}
                  onClick={(e) => {
                    if (location.pathname === item.path) {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown className={cn("w-3 h-3 transition-transform", dropdownOpen && "rotate-180")} />
                  )}
                </Link>

                {/* Dropdown */}
                {item.children && (
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 py-2 px-1 bg-background/95 backdrop-blur-xl rounded-xl border border-white/10 min-w-[200px] shadow-2xl"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className="block px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground/60 hover:text-accent hover:bg-accent/5 rounded-lg transition-all"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}

            <Link to="/contact" onClick={(e) => {
              if (location.pathname === "/contact") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}>
              <MagneticButton className="ml-4 bg-accent text-background px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-3 hover:scale-105 transition-all duration-300 group shadow-[0_0_30px_rgba(196,239,23,0.5)]">
                <span className="w-7 h-7 rounded-full bg-background flex items-center justify-center text-accent group-hover:rotate-45 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </span>
                Get in Touch
              </MagneticButton>
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-accent w-10 h-10 flex items-center justify-center rounded-full bg-white/10 shadow-lg"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </motion.div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-2xl flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-2">
              {NAV_LINKS.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={item.path}
                    className={cn(
                      "text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter py-3 transition-colors",
                      location.pathname === item.path ? "text-accent" : "text-white/40 hover:text-accent"
                    )}
                    onClick={(e) => {
                      setMobileOpen(false);
                      if (location.pathname === item.path) {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12"
            >
              <Link to="/contact" onClick={(e) => {
                setMobileOpen(false);
                if (location.pathname === "/contact") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}>
                <MagneticButton className="bg-accent text-background px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider shadow-xl">
                  Get in Touch
                </MagneticButton>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
