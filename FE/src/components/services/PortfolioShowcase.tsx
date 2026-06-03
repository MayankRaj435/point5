import { motion } from "motion/react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { SectionLabel } from "../SectionLabel";

import { usePortfolio } from "../../hooks/usePortfolio";

interface PortfolioShowcaseProps {
  serviceType: any;
  sectionNumber?: string;
  sectionTitle?: string;
  featured?: boolean;
}

export const PortfolioShowcase = ({
  serviceType,
  sectionNumber = "04",
  sectionTitle = "Featured Work",
  featured = true,
}: PortfolioShowcaseProps) => {
  const { hash } = useLocation();

  const {
    data: items,
    isLoading,
    error,
    retry,
  } = usePortfolio({ serviceType, featured });

  useEffect(() => {
    if (!hash || items.length === 0) return;

    const id = hash.replace("#", "");

    const timer = setTimeout(() => {
      const el = document.getElementById(id);

      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 100;

        window.scrollTo({
          top,
          behavior: "smooth",
        });

        el.classList.add("ring-2", "ring-white/30", "ring-offset-0");

        setTimeout(() => {
          el.classList.remove("ring-2", "ring-white/30", "ring-offset-0");
        }, 2000);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [hash, items]);

  if (isLoading) {
    return (
      <div className="mb-20">
        <SectionLabel number={sectionNumber} text={sectionTitle} />

        <div className="space-y-8 mt-12">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-[320px] rounded-3xl border border-white/5 bg-white/[0.02] animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-20">
        <SectionLabel number={sectionNumber} text={sectionTitle} />

        <div className="mt-8 p-8 glass rounded-3xl border border-red-500/10">
          <p className="text-sm text-red-400 mb-4">{error}</p>

          <button
            onClick={retry}
            className="text-accent font-bold uppercase text-xs tracking-widest"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mb-20">
        <SectionLabel number={sectionNumber} text={sectionTitle} />

        <div className="mt-12 glass rounded-3xl border border-white/5 p-12 text-center">
          <p className="text-foreground/40 text-sm md:text-base font-medium italic">
            No portfolio items currently available for this service.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-20">
      <SectionLabel number={sectionNumber} text={sectionTitle} />

      <div className="space-y-8 mt-12">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            id={item.slug}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: i * 0.08,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br ${
              item.bg || "from-[#111111] to-[#0d0d0d]"
            } group hover:border-white/10 transition-all duration-500 scroll-mt-28`}
          >
            {/* Glow accent */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 60% 50% at 10% 50%, ${
                  item.accent || "#C4EF17"
                }18 0%, transparent 70%)`,
              }}
            />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8 p-8 md:p-10">
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                }}
                className="flex-shrink-0 w-36 h-36 md:w-44 md:h-44 rounded-2xl overflow-hidden bg-white/5 border border-white/8 flex items-center justify-center p-3 shadow-lg"
                style={{
                  boxShadow: `0 0 30px ${item.accent || "#C4EF17"}22`,
                }}
              >
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}${item.logo}`}
                  alt={`${item.name} logo`}
                  className="w-full h-full object-contain drop-shadow-lg"
                  loading="lazy"
                />
              </motion.div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Header row */}
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span
                    className="text-[10px] font-black uppercase tracking-[0.25em] px-3 py-1 rounded-full border"
                    style={{
                      color: item.accent || "#C4EF17",
                      borderColor: `${item.accent || "#C4EF17"}40`,
                      background: `${item.accent || "#C4EF17"}12`,
                    }}
                  >
                    {item.category}
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-foreground mb-1 group-hover:text-white transition-colors">
                  {item.name}
                </h3>

                {item.tagline && (
                  <p
                    className="text-sm font-semibold uppercase tracking-widest mb-4"
                    style={{
                      color: item.accent || "#C4EF17",
                    }}
                  >
                    {item.tagline}
                  </p>
                )}

                <p className="text-foreground/60 text-sm md:text-[15px] leading-relaxed mb-6 max-w-2xl">
                  {item.description}
                </p>

                {/* Deliverables pills */}
                <div className="flex flex-wrap gap-2">
                  {item.deliverables.map((deliverable) => (
                    <span
                      key={deliverable}
                      className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/8 text-foreground/40 group-hover:text-foreground/60 transition-colors"
                    >
                      {deliverable}
                    </span>
                  ))}
                </div>
              </div>

              {/* Index number */}
              <div
                className="hidden lg:flex flex-shrink-0 items-center justify-center w-16 h-16 rounded-2xl border border-white/5 text-2xl font-black font-display opacity-20 group-hover:opacity-60 transition-opacity"
                style={{
                  color: item.accent || "#C4EF17",
                }}
              >
                0{i + 1}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
