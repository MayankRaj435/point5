import {useLayoutEffect, useRef} from 'react';
import type {ElementType, HTMLAttributes} from 'react';
import {cn} from '@/src/lib/utils';
import {ensureGsap} from '@/src/motion/gsap';
import {useReducedMotion} from '@/src/motion/useReducedMotion';
import SplitType from 'split-type';

type KineticTextProps<TAs extends ElementType> = {
  as?: TAs;
  children: string;
  className?: string;
  delay?: number;
} & Omit<HTMLAttributes<HTMLElement>, 'children'>;

export function KineticText<TAs extends ElementType = 'span'>({
  as,
  children,
  className,
  delay = 0,
  ...rest
}: KineticTextProps<TAs>) {
  const Comp = (as ?? 'span') as any;
  const elRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const el = elRef.current;
    if (!el || reducedMotion) return;

    const split = new SplitType(el, {types: ['lines', 'words']});
    const lines = split.lines ?? [];

    if (lines.length === 0) return () => split.revert();

    const {gsap, ScrollTrigger} = ensureGsap();

    gsap.set(lines, {overflow: 'hidden'});
    const targets = lines.map((l) => l.firstChild).filter(Boolean) as ChildNode[];

    gsap.set(targets, {yPercent: 120, rotateX: -70, opacity: 0, filter: 'blur(10px)'});

    const ctx = gsap.context(() => {
      gsap.to(targets, {
        yPercent: 0,
        rotateX: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.05,
        ease: 'power4.out',
        stagger: 0.08,
        delay,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      });
    }, el);

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
      split.revert();
    };
  }, [delay, reducedMotion]);

  return (
    <Comp
      ref={elRef as any}
      className={cn('inline-block [perspective:1000px]', className)}
      aria-label={children}
      {...rest}
    >
      {children}
    </Comp>
  );
}

