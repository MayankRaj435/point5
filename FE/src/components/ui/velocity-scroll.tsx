import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  useMotionValue,
} from "motion/react";
import { cn } from "../../lib/utils";

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

interface VelocityScrollProps {
  text: string;
  defaultVelocity?: number;
  className?: string;
}

interface ParallaxProps {
  children: string;
  baseVelocity: number;
  className?: string;
}

function ParallaxText({ children, baseVelocity = 100, className }: ParallaxProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="flex flex-nowrap overflow-hidden whitespace-nowrap">
      <motion.div
        className={cn("flex flex-nowrap whitespace-nowrap text-5xl md:text-7xl lg:text-9xl font-black font-display uppercase tracking-tighter", className)}
        style={{ x }}
      >
        <span className="mr-12">{children} </span>
        <span className="mr-12">{children} </span>
        <span className="mr-12">{children} </span>
        <span className="mr-12">{children} </span>
      </motion.div>
    </div>
  );
}

export function VelocityScroll({
  text,
  defaultVelocity = 5,
  className,
}: VelocityScrollProps) {
  return (
    <section className="relative w-full">
      <ParallaxText baseVelocity={defaultVelocity} className={className}>
        {text}
      </ParallaxText>
      <ParallaxText baseVelocity={-defaultVelocity} className={className}>
        {text}
      </ParallaxText>
    </section>
  );
}
