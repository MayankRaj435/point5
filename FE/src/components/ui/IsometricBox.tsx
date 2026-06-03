import { motion } from 'motion/react';

export const IsometricBox = () => {
  return (
    <div className="relative w-full aspect-video md:aspect-[2/1] rounded-2xl bg-black flex items-center justify-center overflow-hidden border border-white/5 group">
      {/* Background dot grid for the box area */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
      
      <motion.div 
        className="relative w-32 h-32 md:w-48 md:h-48 z-10"
        initial="rest"
        whileHover="hover"
        animate="rest"
      >
        {/* Top Face */}
        <motion.div
          variants={{
            rest: { y: 0 },
            hover: { y: -20 }
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="absolute inset-0 origin-bottom"
          style={{ transform: 'rotateX(60deg) rotateZ(-45deg)' }}
        >
          <div className="w-full h-full border-2 border-white/20 rounded-xl bg-white/5 flex items-center justify-center">
             <div className="w-1/2 h-1/2 border-2 border-white/20 rounded-lg" />
          </div>
        </motion.div>

        {/* Left Face */}
        <motion.div
          variants={{
            rest: { x: 0, y: 0 },
            hover: { x: -20, y: 15 }
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="absolute inset-0 origin-top-right"
          style={{ transform: 'rotateY(-60deg) rotateZ(-15deg) skewY(-30deg) translate(28%, 57%) scaleY(0.866)' }}
        >
          <div className="w-full h-full border-2 border-white/20 rounded-xl bg-black/50 overflow-hidden flex flex-col justify-between p-2">
             {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-2 h-full py-1">
                   {[...Array(4)].map((_, j) => (
                      <div key={j} className="flex-1 bg-white/10 border border-white/5 rounded-sm" />
                   ))}
                </div>
             ))}
          </div>
        </motion.div>

        {/* Right Face */}
        <motion.div
          variants={{
            rest: { x: 0, y: 0 },
            hover: { x: 20, y: 15 }
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="absolute inset-0 origin-top-left"
          style={{ transform: 'rotateY(60deg) rotateZ(15deg) skewY(30deg) translate(-28%, 57%) scaleY(0.866)' }}
        >
          <div className="w-full h-full border-2 border-white/20 rounded-xl bg-black/50 overflow-hidden flex flex-col justify-between p-2">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-2 h-full py-1">
                   {[...Array(4)].map((_, j) => (
                      <div key={j} className="flex-1 bg-white/10 border border-white/5 rounded-sm" />
                   ))}
                </div>
             ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Subtle bottom glow */}
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-32 h-8 bg-accent/20 blur-2xl rounded-[100%]" />
    </div>
  );
};
