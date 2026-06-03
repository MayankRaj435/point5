import { motion, useScroll, useTransform } from 'motion/react';

export const PageDetailing = () => {
  const { scrollYProgress } = useScroll();
  const yTranslate = useTransform(scrollYProgress, [0, 1], [0, -500]);

  return (
    <>
      {/* Left Vertical Text */}
      <div className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-12 pointer-events-none">
        <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-accent/30 to-transparent" />
        <div className="overflow-hidden h-[400px] flex items-center">
          <motion.div 
            style={{ y: yTranslate }}
            className="flex flex-col gap-8 text-[10px] font-mono font-bold uppercase tracking-[0.5em] text-white/10 whitespace-nowrap [writing-mode:vertical-rl]"
          >
            <span className="text-accent/40">Creative Productions</span>
            <span>Digital Renaissance</span>
            <span>Impactful Storytelling</span>
            <span>Future Driven</span>
            <span className="text-accent/40">POINT5MEDIA</span>
            <span>Creative Productions</span>
            <span>Digital Renaissance</span>
            <span>Impactful Storytelling</span>
            <span>Future Driven</span>
            <span className="text-accent/40">POINT5MEDIA</span>
          </motion.div>
        </div>
        <div className="w-[1px] h-32 bg-gradient-to-t from-transparent via-accent/30 to-transparent" />
      </div>

      {/* Right Coordinate Detailing */}
      <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-6 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.2 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="text-[8px] font-mono text-accent/30">
              0{i + 1}
            </div>
            <div className={`w-1 h-1 rounded-full ${i === 2 ? 'bg-accent' : 'bg-white/10'}`} />
          </motion.div>
        ))}
        
        <div className="mt-8 flex flex-col items-center gap-1">
           <div className="w-4 h-[1px] bg-white/20" />
           <div className="text-[8px] font-mono text-white/20 uppercase tracking-tighter">
             Active
           </div>
        </div>
      </div>
    </>
  );
};
