import {useLayoutEffect} from 'react';
import type {MutableRefObject} from 'react';
import {ensureGsap} from './gsap';
import {useReducedMotion} from './useReducedMotion';

export function useScrollTypeLink(ref: MutableRefObject<HTMLElement | null>) {
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    const {gsap} = ensureGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {letterSpacing: '-0.06em'},
        {
          letterSpacing: '-0.02em',
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            end: 'top 40%',
            scrub: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [reducedMotion, ref]);
}

