import { Link } from 'react-router-dom';

interface EmptyBlogsProps {
  title?: string;
  message?: string;
  className?: string;
}

export const EmptyBlogs = ({
  title = 'No blog posts available yet.',
  message = 'Articles coming soon.',
  className = '',
}: EmptyBlogsProps) => {
  return (
    <section
      className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-10 md:px-10 md:py-14 ${className}`.trim()}
    >
      <div className="absolute inset-0 bg-linear-to-br from-accent/10 via-transparent to-transparent opacity-80" />

      <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent/70">Journal</p>
          <h2 className="mt-4 text-3xl md:text-5xl font-bold font-display uppercase tracking-tighter leading-[0.94] text-white">
            {title}
          </h2>
          <p className="mt-5 max-w-2xl text-base md:text-lg text-foreground/55 leading-relaxed">
            {message}
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-xs font-black uppercase tracking-[0.25em] text-foreground/35">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Thought pieces</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Case studies</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Behind the scenes</span>
          </div>

          <div className="mt-8">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-xs font-black uppercase tracking-[0.3em] text-white transition-all duration-300 hover:border-accent/30 hover:bg-accent/10"
            >
              Start a conversation
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-36 rounded-[1.75rem] border border-white/10 bg-white/[0.02]" />
          <div className="h-36 rounded-[1.75rem] border border-white/10 bg-linear-to-br from-white/[0.08] to-transparent" />
          <div className="h-36 rounded-[1.75rem] border border-white/10 bg-linear-to-br from-accent/10 to-transparent sm:col-span-2" />
        </div>
      </div>
    </section>
  );
};
