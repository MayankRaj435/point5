import {forwardRef, type HTMLAttributes} from 'react';
import {cn} from '@/src/lib/utils';

type SectionProps = HTMLAttributes<HTMLElement> & {
  bleed?: boolean;
};

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  {className, bleed = false, ...props},
  ref,
) {
  return (
    <section
      ref={ref}
      className={cn('relative w-full', bleed ? 'px-0' : 'py-20 md:py-28', className)}
      {...props}
    />
  );
});

