import { motion } from 'motion/react';
import { SectionLabel } from '../SectionLabel';

const BRANDING_PARTNERS = [
  {
    name: 'Swarnaavya',
    category: 'Jewellery',
    logo: '/brands/swarnaavya.png',
    accent: '#C9A84C',
    bg: 'from-[#1a1508] to-[#0d0d0d]',
    tagline: 'Crafting a Timeless Visual Identity',
    description:
      'We handled the complete branding for Swarnaavya, crafting a cohesive visual identity from the ground up. This included logo design, brand guidelines, and a well-defined typography and color system, all guided by a clear art direction to ensure a strong, consistent, and premium brand presence across every touchpoint.',
    deliverables: ['Logo Design', 'Brand Guidelines', 'Typography System', 'Color System', 'Art Direction'],
  },
  {
    name: 'Magadh Delight',
    category: 'FMCG',
    logo: '/brands/magadh-delight.png',
    accent: '#D4631A',
    bg: 'from-[#1a0d05] to-[#0d0d0d]',
    tagline: 'From Concept to Complete Brand Identity',
    description:
      'We built Magadh Delight\'s complete branding from concept to execution, including helping define the brand name and tagline. Our work covered logo design, detailed brand guidelines, and a cohesive typography and color system, all guided by a clear art direction to create a consistent and premium brand presence across every touchpoint.',
    deliverables: ['Brand Name & Tagline', 'Logo Design', 'Brand Guidelines', 'Typography System', 'Color System'],
  },
  {
    name: 'Gungun Properties',
    category: 'Real Estate',
    logo: '/brands/gungun-green.png',
    accent: '#2B65A8',
    bg: 'from-[#050d1a] to-[#0d0d0d]',
    tagline: 'Building Credibility Through Design',
    description:
      'We developed the entire brand identity for Gungun Properties, creating a refined and unified visual presence from scratch. Our scope included logo design, comprehensive brand guidelines, and a structured typography and color system, all shaped by a strong art direction to ensure consistency, credibility, and a lasting brand impression across all platforms.',
    deliverables: ['Logo Design', 'Brand Guidelines', 'Typography System', 'Color System', 'Art Direction'],
  },
  {
    name: 'Kashiyatra Tours and Travels',
    category: 'Travel',
    logo: '/brands/kashi-yatra.png',
    accent: '#C98B2A',
    bg: 'from-[#1a1005] to-[#0d0d0d]',
    tagline: 'A Journey-Worthy Brand Experience',
    description:
      'We developed the complete brand identity for Kashiyatra Tours and Travels, creating a cohesive and engaging visual presence from the ground up. Our work included logo design, detailed brand guidelines, and a thoughtfully crafted typography and color system, all guided by a clear art direction to ensure consistency, trust, and a memorable brand experience across every platform.',
    deliverables: ['Logo Design', 'Brand Guidelines', 'Typography System', 'Color System', 'Art Direction'],
  },
  {
    name: 'The Paan Banarasi',
    category: 'Food Unit',
    logo: '/brands/paan-banarasi.png',
    accent: '#6B9E2A',
    bg: 'from-[#0a1505] to-[#0d0d0d]',
    tagline: 'Authenticity Captured in Every Detail',
    description:
      'We developed the complete brand identity for The Paan Banarasi, creating a distinctive and cohesive visual presence from the ground up. Our work included logo design, detailed brand guidelines, and a carefully curated typography and color system, all guided by a strong art direction to ensure consistency, authenticity, and a memorable brand experience across every platform.',
    deliverables: ['Logo Design', 'Brand Guidelines', 'Typography System', 'Color System', 'Art Direction'],
  },
  {
    name: 'Tea Castle',
    category: 'Food Unit',
    logo: '/brands/tea-castle.png',
    accent: '#7A9E3B',
    bg: 'from-[#0d1508] to-[#0d0d0d]',
    tagline: 'A Distinctive Brand World, Steeped in Character',
    description:
      'For Tea Castle, we built a distinctive brand world that reflects its essence. From designing the logo to defining brand guidelines, typography, and color palettes, every element was carefully curated under a strong creative direction to deliver a consistent, engaging, and recognizable presence across all touchpoints.',
    deliverables: ['Logo Design', 'Brand Guidelines', 'Typography System', 'Color Palettes', 'Creative Direction'],
  },
  {
    name: 'Mahajan Greens',
    category: 'Events & Hospitality',
    logo: '/brands/mahajan-greens.png',
    accent: '#C9A84C',
    bg: 'from-[#0d1508] to-[#0d0d0d]',
    tagline: 'Elegance and Credibility, Rooted in Design',
    description:
      'We crafted the complete brand identity for Mahajan Greens, building a clean and cohesive visual presence from the ground up. Our work included logo design, detailed brand guidelines, and a thoughtfully developed typography and color system, all guided by a clear art direction to ensure consistency, credibility, and a lasting brand impression across all platforms.',
    deliverables: ['Logo Design', 'Brand Guidelines', 'Typography System', 'Color System', 'Art Direction'],
  },
  {
    name: 'Sarvaga Fashions',
    category: 'Fashion',
    logo: '/brands/sarvaga-fashions.png',
    accent: '#9B59B6',
    bg: 'from-[#150a1a] to-[#0d0d0d]',
    tagline: 'Style, Refined into a Visual Language',
    description:
      'We developed the complete brand identity for Sarvaga Fashions, creating a refined and cohesive visual presence from the ground up. Our work included logo design, comprehensive brand guidelines, and a carefully curated typography and color system, all guided by a strong art direction to ensure consistency, style, and a memorable brand impression across every platform.',
    deliverables: ['Logo Design', 'Brand Guidelines', 'Typography System', 'Color System', 'Art Direction'],
  },
];

export const BrandingPartners = () => {
  return (
    <div className="mb-20">
      <SectionLabel number="04" text="Our Branding Work" />
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-foreground/50 italic text-sm mb-12 mt-3 max-w-2xl"
      >
        Brands we've built from the ground up — each with a unique identity, guided by strategy and elevated by craft.
      </motion.p>

      <div className="space-y-8">
        {BRANDING_PARTNERS.map((partner, i) => (
          <motion.div
            key={partner.name}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br ${partner.bg} group hover:border-white/10 transition-all duration-500`}
          >
            {/* Glow accent */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 60% 50% at 10% 50%, ${partner.accent}18 0%, transparent 70%)`,
              }}
            />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8 p-8 md:p-10">
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="flex-shrink-0 w-36 h-36 md:w-44 md:h-44 rounded-2xl overflow-hidden bg-white/5 border border-white/8 flex items-center justify-center p-3 shadow-lg"
                style={{ boxShadow: `0 0 30px ${partner.accent}22` }}
              >
                <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
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
                    style={{ color: partner.accent, borderColor: `${partner.accent}40`, background: `${partner.accent}12` }}
                  >
                    {partner.category}
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-foreground mb-1 group-hover:text-white transition-colors">
                  {partner.name}
                </h3>

                <p
                  className="text-sm font-semibold uppercase tracking-widest mb-4"
                  style={{ color: partner.accent }}
                >
                  {partner.tagline}
                </p>

                <p className="text-foreground/60 text-sm md:text-[15px] leading-relaxed mb-6 max-w-2xl">
                  {partner.description}
                </p>

                {/* Deliverables pills */}
                <div className="flex flex-wrap gap-2">
                  {partner.deliverables.map((d) => (
                    <span
                      key={d}
                      className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/8 text-foreground/40 group-hover:text-foreground/60 transition-colors"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Index number */}
              <div
                className="hidden lg:flex flex-shrink-0 items-center justify-center w-16 h-16 rounded-2xl border border-white/5 text-2xl font-black font-display opacity-20 group-hover:opacity-60 transition-opacity"
                style={{ color: partner.accent }}
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
