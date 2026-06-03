import { motion } from "motion/react";
import { cn } from "../../lib/utils";
import { useIsMobile } from "../../hooks/useIsMobile";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "absolute inset-0 h-full w-full pointer-events-none overflow-hidden",
        className
      )}
    >
      <svg
        className="absolute h-full w-full opacity-50"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C4EF17" stopOpacity="0" />
            <stop offset="50%" stopColor="#C4EF17" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#C4EF17" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[...Array(6)].map((_, i) => (
          isMobile ? (
            <path
              key={i}
              d={`M${-100 + i * 200} ${-100} L${200 + i * 200} ${1200}`}
              stroke="url(#beam-gradient)"
              strokeWidth="1"
              fill="none"
              opacity="0.5"
            />
          ) : (
            <motion.path
              key={i}
              d={`M${-100 + i * 200} ${-100} L${200 + i * 200} ${1200}`}
              stroke="url(#beam-gradient)"
              strokeWidth="1"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 1, 0],
                opacity: [0, 1, 0],
                x: [0, 100, 0],
                y: [0, 50, 0],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: "linear",
                delay: i * 2,
              }}
            />
          )
        ))}
      </svg>
    </div>
  );
};
