import { RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface BlogErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const BlogErrorState = ({
  title = 'We could not load the latest articles.',
  message = 'Please try again in a moment.',
  onRetry,
  className = '',
}: BlogErrorStateProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-10 md:px-10 md:py-14 ${className}`.trim()}
    >
      <div className="absolute inset-0 bg-linear-to-br from-red-500/10 via-transparent to-transparent opacity-80" />

      <div className="relative max-w-2xl">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-red-300/70">Error</p>
        <h2 className="mt-4 text-3xl md:text-5xl font-bold font-display uppercase tracking-tighter leading-[0.94] text-white">
          {title}
        </h2>
        <p className="mt-5 text-base md:text-lg text-foreground/55 leading-relaxed">
          {message}
        </p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-xs font-black uppercase tracking-[0.3em] text-white transition-all duration-300 hover:border-accent/30 hover:bg-accent/10"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        )}
      </div>
    </motion.section>
  );
};
