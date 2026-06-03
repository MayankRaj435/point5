import type {HTMLAttributes} from 'react';
import {cn} from '@/src/lib/utils';

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  size?: 'default' | 'wide';
};

export function Container({className, size = 'default', ...props}: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-6 md:px-12 lg:px-20',
        size === 'wide' ? 'max-w-[90rem]' : 'max-w-7xl',
        className,
      )}
      {...props}
    />
  );
}

