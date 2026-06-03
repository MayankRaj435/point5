import { motion } from 'motion/react';
import { WHY_CHOOSE_US } from '../../data/content';
import { SectionLabel } from '../SectionLabel';
import { TextReveal } from '../TextReveal';
import { Users, Lightbulb, Award, Clock } from 'lucide-react';

const ICONS: Record<string, any> = { Users, Lightbulb, Award, Clock };

export const WhyChooseUs = () => {
  return (
    <section className="py-24 px-6 md:px-12 relative border-t border-white/5 bg-black">
      <div className="max-w-7xl mx-auto">
        <SectionLabel number="03" text="Why Choose Us?" />

        <div className="flex flex-col md:flex-row justify-between gap-8 mb-20 mt-12">
          <h2 className="text-4xl md:text-6xl font-bold font-display tracking-tighter leading-tight max-w-2xl">
            <TextReveal>We are offering the best solutions</TextReveal>
          </h2>
          <p className="text-foreground/40 text-lg md:text-xl max-w-sm leading-relaxed self-end font-medium">
            We offer a full range of digital services to help your brand stand out, connect, and grow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_CHOOSE_US.map((item, i) => {
            const Icon = ICONS[item.icon] || Users;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-accent/30 transition-all duration-500 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-all mb-8">
                  <Icon className="w-8 h-8" />
                </div>

                <h3 className="text-xl font-bold font-display mb-4 group-hover:text-accent transition-colors">
                  {item.title}
                </h3>
                <p className="text-foreground/40 text-sm leading-relaxed">{item.desc}</p>

                {item.stat && (
                  <div className="mt-6 pt-6 border-t border-white/5 w-full">
                    <span className="text-accent text-lg font-bold">{item.stat}</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
