import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { SERVICES } from '../../data/content';
import { SectionLabel } from '../SectionLabel';
import { TextReveal } from '../TextReveal';

export const AboutServices = () => {
  // Using the first two services for the prominent cards
  const displayServices = SERVICES.slice(0, 2);

  return (
    <section className="py-32 px-6 md:px-12 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <SectionLabel number="05" text="Our Services" />

        <div className="flex flex-col md:flex-row justify-between gap-8 mb-16">
          <h2 className="text-4xl md:text-6xl font-bold font-display tracking-tighter leading-[0.9] max-w-lg">
            <TextReveal>We are offering the best solutions</TextReveal>
          </h2>
          <p className="text-foreground/40 text-sm max-w-sm leading-relaxed self-end">
            We offer a full range of digital services to help your brand stand out, connect, and grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayServices.map((service, i) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="group relative"
            >
              <Link to={`/services/${service.slug}`} className="block relative w-full aspect-[4/3] rounded-3xl overflow-hidden glass border border-white/10 hover:border-accent/30 transition-all duration-500">
                {/* Simulated Mockup Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center p-8">
                  <div className="w-full h-full rounded-xl bg-black shadow-2xl overflow-hidden border border-white/10 flex flex-col group-hover:scale-105 transition-transform duration-700">
                    {/* Mockup Header */}
                    <div className="h-8 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                    </div>
                    {/* Mockup Body */}
                    <div className="flex-1 p-6 relative overflow-hidden bg-gradient-to-br from-background to-black">
                       <h3 className="text-2xl font-display font-bold mb-2">{service.title}</h3>
                       <p className="text-sm text-foreground/40">{service.shortDesc}</p>
                       <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/20 blur-3xl rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Lime Green Pills */}
                <div className="absolute top-6 right-6 flex gap-2">
                  <span className="px-4 py-1.5 rounded-full bg-accent text-background text-xs font-bold uppercase tracking-wider shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                    Web Design
                  </span>
                  <span className="px-4 py-1.5 rounded-full bg-accent text-background text-xs font-bold uppercase tracking-wider shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-150">
                    Portfolio
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
