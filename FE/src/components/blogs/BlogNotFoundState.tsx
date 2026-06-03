import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogNotFoundStateProps {
  title?: string;
  message?: string;
}

export const BlogNotFoundState = ({
  title = 'Blog post not found.',
  message = 'The article you are looking for may have been removed or is unavailable right now.',
}: BlogNotFoundStateProps) => {
  return (
    <section className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/[0.03] px-6 py-10 md:px-10 md:py-14">
      <div className="absolute inset-0 bg-linear-to-br from-white/[0.06] via-transparent to-transparent opacity-80" />

      <div className="relative max-w-2xl">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/35">404</p>
        <h2 className="mt-4 text-3xl md:text-5xl font-bold font-display uppercase tracking-tighter leading-[0.94] text-white">
          {title}
        </h2>
        <p className="mt-5 text-base md:text-lg text-foreground/55 leading-relaxed">
          {message}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/blog"
            className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-xs font-black uppercase tracking-[0.3em] text-white transition-all duration-300 hover:border-accent/30 hover:bg-accent/10"
          >
            Back to journal
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-3 rounded-full border border-white/10 px-6 py-3 text-xs font-black uppercase tracking-[0.3em] text-foreground/70 transition-all duration-300 hover:border-white/20 hover:bg-white/5 hover:text-white"
          >
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
};
