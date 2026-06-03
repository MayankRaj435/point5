import { motion } from 'motion/react';
import type { ReactNode } from 'react';

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
}

export const TextReveal = ({ children, className = '', delay = 0 }: TextRevealProps) => {
  const words = children.split(' ');

  return (
    <div className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="inline-block mr-[0.3em] py-[0.1em]">
          <motion.span
            className="inline-block"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: delay + i * 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </div>
  );
};


// Char-by-char variant for headings
export const TextRevealChars = ({ children, className = '', delay = 0 }: TextRevealProps) => {
  const chars = children.split('');

  return (
    <motion.span className={className} aria-label={children}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.02,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
};
