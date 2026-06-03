import { motion } from 'motion/react';

interface SectionLabelProps {
  number?: string;
  text: string;
}

export const SectionLabel = ({ number, text }: SectionLabelProps) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6 }}
    className="flex items-center gap-3 mb-6"
  >
    <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse-glow" />
    <span className="text-sm md:text-base text-foreground/50 tracking-wide font-medium">
      {text}
    </span>
  </motion.div>
);
