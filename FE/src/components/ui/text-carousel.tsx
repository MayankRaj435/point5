import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { TextHoverEffect } from './text-hover-effect';

interface TextCarouselProps {
  words: string[];
  interval?: number;
  className?: string;
}

export const TextCarousel = ({ 
  words, 
  interval = 3000,
  className 
}: TextCarouselProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <div className={`py-12 md:py-24 flex items-center justify-center w-full relative overflow-visible ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 flex items-center justify-center will-change-[transform,opacity,filter]"
        >
          <div className="w-full h-full max-w-full overflow-visible flex items-center justify-center">
             <TextHoverEffect text={words[index]} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
