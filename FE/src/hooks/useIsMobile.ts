import { useState, useEffect } from 'react';

/**
 * Returns true when the viewport is a mobile/tablet device.
 * Uses pointer media query (coarse = touch) as primary signal,
 * falls back to viewport width < 1024.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    // Treat touch-primary devices (phones, tablets) as mobile
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const narrow = window.innerWidth < 1024;
    return coarse || narrow;
  });

  useEffect(() => {
    const coarseMq = window.matchMedia('(pointer: coarse)');
    const narrowMq = window.matchMedia('(max-width: 1023px)');

    const update = () => {
      setIsMobile(coarseMq.matches || narrowMq.matches);
    };

    coarseMq.addEventListener('change', update);
    narrowMq.addEventListener('change', update);
    return () => {
      coarseMq.removeEventListener('change', update);
      narrowMq.removeEventListener('change', update);
    };
  }, []);

  return isMobile;
}
