import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

interface FlippingImagesProps {
  images: { src: string; alt: string; title: string; subtitle: string }[];
  interval?: number;
}

export const FlippingImages = ({ images, interval = 5000 }: FlippingImagesProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="relative w-full aspect-[4/5] sm:aspect-square md:aspect-[3/4] max-w-sm mx-auto overflow-hidden rounded-2xl bg-white/5 border border-white/10 group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          {/* Base grayscale image */}
          <img
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-50"
          />

          {/* Color image revealed by scanning bar */}
          <motion.div
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={{ clipPath: 'inset(0 0% 0 0)' }}
            transition={{ duration: 2.5, ease: 'easeInOut', delay: 0.5 }}
            className="absolute inset-0"
          >
            <img
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Scanning Bar */}
          <motion.div
            initial={{ left: '0%' }}
            animate={{ left: '100%' }}
            transition={{ duration: 2.5, ease: 'easeInOut', delay: 0.5 }}
            className="absolute top-0 bottom-0 w-[2px] bg-accent z-10 shadow-[0_0_15px_2px_rgba(196,239,23,0.8)]"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-32 bg-accent/30 blur-xl rounded-full" />
          </motion.div>

          {/* Overlay Text */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 z-20">
            <motion.h3 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="text-2xl font-bold font-display text-white"
            >
              {images[currentIndex].title}
            </motion.h3>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.7, duration: 0.5 }}
              className="text-accent text-sm font-bold uppercase tracking-wider"
            >
              {images[currentIndex].subtitle}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Technical Grid aesthetic */}
      <div className="absolute inset-0 border border-white/5 pointer-events-none rounded-2xl">
        <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-white/5 border-dashed" />
        <div className="absolute bottom-1/3 left-0 right-0 h-[1px] bg-white/5 border-dashed" />
        <div className="absolute left-1/3 top-0 bottom-0 w-[1px] bg-white/5 border-dashed" />
        <div className="absolute right-1/3 top-0 bottom-0 w-[1px] bg-white/5 border-dashed" />
      </div>
    </div>
  );
};
