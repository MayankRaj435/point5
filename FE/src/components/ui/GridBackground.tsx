import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export const GridBackground = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "absolute inset-0 h-full w-full bg-background bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]",
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"
      />
    </div>
  );
};
