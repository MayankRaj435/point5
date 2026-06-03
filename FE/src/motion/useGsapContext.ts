import {useLayoutEffect, useRef} from 'react';
import type {DependencyList, MutableRefObject} from 'react';
import {ensureGsap} from './gsap';

type GsapScope = Element | string | null | undefined;

export function useGsapContext(
  fn: (ctx: gsap.Context) => void,
  deps: DependencyList,
  scope?: MutableRefObject<GsapScope>,
) {
  const ctxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => {
    const {gsap} = ensureGsap();
    const ctx = gsap.context(() => fn(ctxRef.current!), scope?.current ?? undefined);
    ctxRef.current = ctx;
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ctxRef;
}

