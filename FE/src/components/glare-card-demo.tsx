import { GlareCard } from "./ui/glare-card";

export default function GlareCardDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 py-20">
      <GlareCard className="flex flex-col items-center justify-center p-6">
        <svg
          width="66"
          height="65"
          viewBox="0 0 66 65"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-accent"
        >
          <path
            d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696"
            stroke="currentColor"
            strokeWidth="15"
            strokeMiterlimit="3.86874"
            strokeLinecap="round"
          />
        </svg>
        <p className="text-white font-bold text-2xl mt-4 font-display uppercase tracking-widest italic">Digital</p>
      </GlareCard>
      
      <GlareCard className="flex flex-col items-center justify-center p-6">
        <div className="text-6xl font-bold text-accent font-display">0.5</div>
        <p className="text-white font-bold text-2xl mt-4 font-display uppercase tracking-widest italic">Renaissance</p>
      </GlareCard>
    </div>
  );
}
