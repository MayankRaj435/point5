import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useReducedMotion } from '../motion/useReducedMotion';

export const CustomCursor = () => {
  const reducedMotion = useReducedMotion();
  const isPointer = useRef(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  // Raw mouse motion values — no React state, no re-renders on mousemove
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  // Smooth spring for the ring cursor
  const x = useSpring(rawX, { damping: 25, stiffness: 200, mass: 0.5 });
  const y = useSpring(rawY, { damping: 25, stiffness: 200, mass: 0.5 });

  // Faster spring for the center dot
  const dotX = useSpring(rawX, { damping: 40, stiffness: 400, mass: 0.1 });
  const dotY = useSpring(rawY, { damping: 40, stiffness: 400, mass: 0.1 });

  useEffect(() => {
    if (reducedMotion) return;
    const coarse = window.matchMedia?.('(pointer: coarse)')?.matches;
    if (coarse) return;

    const handleMouseMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);

      // Imperatively update pointer state — avoids any React re-render
      const target = e.target as HTMLElement;
      const nowPointer =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        !!target.closest('a') ||
        !!target.closest('button') ||
        window.getComputedStyle(target).cursor === 'pointer';

      if (nowPointer !== isPointer.current) {
        isPointer.current = nowPointer;
        if (ringRef.current) {
          ringRef.current.style.width = nowPointer ? '56px' : '32px';
          ringRef.current.style.height = nowPointer ? '56px' : '32px';
          ringRef.current.style.backgroundColor = nowPointer
            ? 'rgba(196,239,23,0.15)'
            : 'rgba(196,239,23,0)';
          ringRef.current.style.borderColor = nowPointer
            ? 'rgba(196,239,23,0.6)'
            : 'rgba(196,239,23,1)';
        }
        if (dotRef.current) {
          dotRef.current.style.transform = nowPointer ? 'translate(-50%,-50%) scale(0)' : 'translate(-50%,-50%) scale(1)';
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [reducedMotion, rawX, rawY]);

  // Don't render on touch devices or when reduced motion is preferred
  if (reducedMotion) return null;
  if (typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)')?.matches) return null;

  return (
    <>
      {/* Main cursor ring */}
      <motion.div
        ref={ringRef}
        className="fixed pointer-events-none z-[9999] mix-blend-difference border-2 border-accent rounded-full"
        style={{
          left: x,
          top: y,
          translateX: '-50%',
          translateY: '-50%',
          width: 32,
          height: 32,
          backgroundColor: 'rgba(196,239,23,0)',
          borderColor: 'rgba(196,239,23,1)',
          transition: 'width 0.2s ease, height 0.2s ease, background-color 0.2s ease, border-color 0.2s ease',
          willChange: 'transform',
        }}
      />
      {/* Center dot */}
      <motion.div
        ref={dotRef}
        className="fixed pointer-events-none z-[9999] bg-accent rounded-full"
        style={{
          left: dotX,
          top: dotY,
          translateX: '-50%',
          translateY: '-50%',
          transform: 'translate(-50%,-50%) scale(1)',
          width: 5,
          height: 5,
          transition: 'transform 0.15s ease',
          willChange: 'transform',
        }}
      />
    </>
  );
};
