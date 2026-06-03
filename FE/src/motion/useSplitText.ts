import {useEffect, useMemo, useRef} from 'react';
import SplitType from 'split-type';

type SplitTypes = 'lines' | 'words' | 'chars';

type SplitOptions = {
  types?: SplitTypes | SplitTypes[];
  tagName?: string;
};

export function useSplitText<T extends HTMLElement>(options?: SplitOptions) {
  const elRef = useRef<T | null>(null);

  const opts = useMemo(() => {
    return {
      types: options?.types ?? ['lines', 'words'],
      tagName: options?.tagName,
    } as any;
  }, [options?.tagName, options?.types]);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const split = new SplitType(el, opts);
    return () => split.revert();
  }, [opts]);

  return elRef;
}

