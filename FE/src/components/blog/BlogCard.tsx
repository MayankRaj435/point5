import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { buildBlogExcerpt, resolveBlogImageUrl } from '../../api/blogs';
import type { Blog } from '../../types/blog';

interface BlogCardProps {
  blog: Blog;
}

const formatBlogDate = (value?: string) => {
  if (!value) {
    return 'Latest story';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Latest story';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const BlogCard = ({ blog }: BlogCardProps) => {
  const [hasImageError, setHasImageError] = useState(false);
  const imageUrl = resolveBlogImageUrl(blog.thumbnail ?? blog.cover);
  const excerpt = blog.excerpt ?? buildBlogExcerpt(blog.content, 150);

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl"
    >
      <div className="absolute inset-0 bg-linear-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none" />

      <Link to={`/blog/${blog.id}`} className="relative block">
        <div className="relative aspect-[16/10] overflow-hidden bg-black/20">
          {imageUrl && !hasImageError ? (
            <img
              src={imageUrl}
              alt={blog.title}
              loading="lazy"
              decoding="async"
              onError={() => setHasImageError(true)}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="relative flex h-full items-end overflow-hidden bg-linear-to-br from-[#0b1020] via-[#141d33] to-[#06070d] p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_48%)]" />
              <div className="absolute inset-0 opacity-70 bg-linear-to-t from-black/60 via-transparent to-transparent" />
              <div className="relative max-w-[18rem]">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent/70">Point 5 Journal</p>
                <h3 className="mt-3 text-2xl font-bold uppercase tracking-tighter leading-[0.92] text-white">
                  {blog.title}
                </h3>
              </div>
            </div>
          )}
        </div>
      </Link>

      <div className="relative flex flex-1 flex-col p-5 md:p-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-foreground/35">
            {formatBlogDate(blog.createdAt)}
          </p>

          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/50">
            Article
          </span>
        </div>

        <h2 className="mt-4 text-2xl md:text-[1.9rem] font-bold font-display uppercase tracking-tighter leading-[0.95] text-white transition-colors duration-300 group-hover:text-accent/90">
          {blog.title}
        </h2>

        <p
          className="mt-4 text-sm md:text-base text-foreground/58 leading-7"
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
            overflow: 'hidden',
          }}
        >
          {excerpt || 'New articles are being prepared for this section.'}
        </p>

        <div className="mt-auto pt-6">
          <Link
            to={`/blog/${blog.id}`}
            className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-white/85 transition-colors duration-300 hover:text-accent"
          >
            Read story
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
};
