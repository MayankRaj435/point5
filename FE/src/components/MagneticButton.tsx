import { motion, useMotionValue, useSpring } from 'motion/react';
import { useRef, type ReactNode, type MouseEvent } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
}

export const MagneticButton = ({ children, className = '', onClick, strength = 0.3 }: MagneticButtonProps) => {
  const isMobile = useIsMobile();
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouse = (e: MouseEvent) => {
    if (!ref.current || isMobile) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleLeave = () => {
    if (isMobile) return;
    x.set(0);
    y.set(0);
  };

  if (isMobile) {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className={className}
      >
        {children}
      </button>
    );
  }

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      onClick={onClick}
      className={className}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};
