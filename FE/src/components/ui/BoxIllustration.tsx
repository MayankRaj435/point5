import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface BoxIllustrationProps {
  items: ReactNode[];
}

export const BoxIllustration = ({ items }: BoxIllustrationProps) => {
  return (
    <div className="relative w-full h-[500px] flex items-center justify-center pointer-events-none perspective-[1000px]">
      
      {/* Floating Items coming out of the box */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-auto">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 100, scale: 0.5 }}
            whileInView={{ opacity: 1, y: -50 - (i * 80), scale: 1 }}
            viewport={{ once: true }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 15,
              delay: 0.2 + (i * 0.2)
            }}
            animate={{
              y: [-50 - (i * 80), -60 - (i * 80), -50 - (i * 80)],
            }}
            style={{
              position: 'absolute',
              zIndex: items.length - i,
            }}
            className="transition-all duration-300 hover:z-50 hover:scale-105 cursor-pointer"
          >
             {/* We apply a subtle 3D rotation to the floating cards to match the Aceternity reference */}
             <div style={{ transform: `rotateZ(${i % 2 === 0 ? '-2deg' : '2deg'})` }}>
                {item}
             </div>
          </motion.div>
        ))}
      </div>

      {/* The 3D Open Box */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative w-64 h-48 z-10 translate-y-24"
      >
        {/* Back face */}
        <div className="absolute inset-0 bg-[#111] border border-white/10 rounded-sm transform translate-z-[-64px]" />
        
        {/* Inside bottom */}
        <div className="absolute bottom-0 w-full h-32 bg-[#050505] origin-bottom transform rotateX-[90deg] translate-z-[-64px] border border-white/5" />

        {/* Left Flap */}
        <motion.div 
          initial={{ rotateY: 90 }}
          whileInView={{ rotateY: 120 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute left-0 top-0 w-32 h-16 bg-[#222] origin-right transform border border-white/10"
          style={{ transformOrigin: '0% 0%', transform: 'rotateZ(-20deg) skewX(-30deg) translate(-100%, 0)' }}
        />

        {/* Right Flap */}
        <motion.div 
          initial={{ rotateY: -90 }}
          whileInView={{ rotateY: -120 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute right-0 top-0 w-32 h-16 bg-[#222] origin-left transform border border-white/10"
          style={{ transformOrigin: '100% 0%', transform: 'rotateZ(20deg) skewX(30deg) translate(100%, 0)' }}
        />
        
        {/* Front Face */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#333] to-[#111] border-t border-white/20 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] rounded-t-sm" />
      </motion.div>
      
      {/* Box shadow on the ground */}
      <div className="absolute bottom-[10%] w-64 h-8 bg-black blur-xl rounded-[100%] opacity-80" />
    </div>
  );
};
