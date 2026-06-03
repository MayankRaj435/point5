import Lenis from 'lenis';
import {useEffect, useRef} from 'react';
import {useReducedMotion} from './useReducedMotion';

type LenisOptions = ConstructorParameters<typeof Lenis>[0];

export function useLenis(options?: LenisOptions) {
  const reducedMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const isMobile = window.matchMedia('(pointer: coarse)').matches;
    if (reducedMotion || isMobile) return;

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      ...options,
    });
    lenisRef.current = lenis;

    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [options, reducedMotion]);

  return lenisRef;
}

