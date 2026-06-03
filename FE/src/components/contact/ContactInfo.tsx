import { motion } from 'motion/react';
import { COMPANY } from '../../data/content';
import { MapPin, Phone, Clock } from 'lucide-react';

const INFO_CARDS = [
  {
    icon: MapPin,
    title: 'Office Address',
    content: COMPANY.address,
  },
  {
    icon: Phone,
    title: 'Quick Support',
    content: `Phone: ${COMPANY.phones.join(', ')}\nEmail: ${COMPANY.email}`,
  },
  {
    icon: Clock,
    title: 'Business Hours',
    content: COMPANY.hours,
  },
];

export const ContactInfo = () => {
  return (
    <section className="px-6 md:px-12 pb-32">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {INFO_CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-[2rem] p-10 group hover:border-accent/40 transition-all duration-700 relative overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10">
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-inner group-hover:bg-accent group-hover:text-background transition-all duration-500"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <card.icon className="w-8 h-8 text-accent group-hover:text-background transition-colors" />
                </motion.div>

                <h3 className="text-xl font-bold font-display uppercase mb-4 text-foreground tracking-tight group-hover:translate-x-1 transition-transform">
                  {card.title}
                </h3>

                {card.content.split('\n').map((line, j) => (
                  <p key={j} className="text-foreground/50 text-base font-medium leading-relaxed italic mb-1 group-hover:text-foreground/80 transition-colors">
                    {line}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
