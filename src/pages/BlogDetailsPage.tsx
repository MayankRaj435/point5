import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { Link, useParams } from "react-router-dom";
import { resolveBlogImageUrl } from "../api/blogs";
import { BlogErrorState } from "../components/blogs/BlogErrorState";
import { BlogNotFoundState } from "../components/blogs/BlogNotFoundState";
import { PageDetailing } from "../components/ui/PageDetailing";
import { useBlog } from "../hooks/useBlog";

const formatBlogDate = (value?: string) => {
  if (!value) {
    return "Journal article";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Journal article";
  }

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export const BlogDetailsPage = () => {
  const { id } = useParams();
  const { data: blog, isLoading, error, isNotFound, retry } = useBlog(id);

  if (isLoading) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-background text-foreground min-h-screen relative pt-32 pb-24"
      >
        <PageDetailing />

        <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
          <div className="animate-pulse space-y-6">
            <div className="h-4 w-32 rounded-full bg-white/5" />
            <div className="h-10 w-4/5 rounded-[1.5rem] bg-white/5" />
            <div className="aspect-[16/9] rounded-[2rem] border border-white/10 bg-white/[0.03]" />
            <div className="space-y-4 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-10">
              <div className="h-4 w-40 rounded-full bg-white/5" />
              <div className="h-6 w-full rounded-full bg-white/5" />
              <div className="h-6 w-5/6 rounded-full bg-white/5" />
              <div className="h-6 w-4/6 rounded-full bg-white/5" />
            </div>
          </div>
        </div>
      </motion.main>
    );
  }

  if (error) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-background text-foreground min-h-screen relative pt-32 pb-24"
      >
        <PageDetailing />

        <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
          <BlogErrorState
            title="We could not load this article."
            message={error.message}
            onRetry={retry}
          />
        </div>
      </motion.main>
    );
  }

  if (isNotFound || !blog) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-background text-foreground min-h-screen relative pt-32 pb-24"
      >
        <PageDetailing />

        <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
          <BlogNotFoundState />
        </div>
      </motion.main>
    );
  }

  const heroImage = resolveBlogImageUrl(blog.cover ?? blog.thumbnail);
  const content = blog.content?.trim() ?? "";

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-background text-foreground min-h-screen relative pt-32 pb-24"
    >
      <PageDetailing />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[38vw] h-[28vh] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
        <div className="mb-8 flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-foreground/35">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white transition-all duration-300 hover:border-accent/30 hover:bg-accent/10"
          >
            Back to journal
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
            {formatBlogDate(blog.createdAt)}
          </span>
        </div>

        <article className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.03] shadow-[0_30px_100px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative min-h-[18rem] lg:min-h-[32rem]">
              {heroImage ? (
                <img
                  src={heroImage}
                  alt={blog.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[18rem] lg:min-h-[32rem] items-end bg-linear-to-br from-[#0b1020] via-[#141d33] to-[#06070d] p-8 md:p-12">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_45%)]" />
                  <div className="absolute inset-0 opacity-70 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                  <div className="relative max-w-lg">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent/70">
                      Point 5 Journal
                    </p>
                    <h1 className="mt-3 text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-[0.92] text-white">
                      {blog.title}
                    </h1>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/15 to-transparent" />
            </div>

            <div className="flex flex-col p-6 md:p-10 lg:p-12">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent/70">
                Journal article
              </p>
              <h1 className="mt-4 text-4xl md:text-6xl font-bold font-display uppercase tracking-tighter leading-[0.92] text-white">
                {blog.title}
              </h1>

              <p className="mt-6 text-sm md:text-base text-foreground/55 leading-relaxed max-w-xl">
                {blog.excerpt ??
                  (content
                    ? content.slice(0, 180).trimEnd().replace(/\s+/g, " ")
                    : "New editorial stories are being prepared for this journal section.")}
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/35">
                    Date
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {formatBlogDate(blog.createdAt)}
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/35">
                    Status
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {blog.published === false ? "Draft" : "Published"}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-xs font-black uppercase tracking-[0.25em] text-foreground/35">
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  Insights
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  Strategy
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  Creative thinking
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 p-6 md:p-10 lg:p-12">
            <div className="max-w-3xl">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-foreground/35">
                Article content
              </p>
              <div
                className="mt-5 prose prose-invert max-w-none prose-headings:text-white prose-p:text-foreground/70 prose-p:leading-8 prose-strong:text-white prose-li:text-foreground/70"
                dangerouslySetInnerHTML={{
                  __html:
                    content ||
                    "<p>This article is still being prepared. Please check back soon for the full story.</p>",
                }}
              />
            </div>
          </div>
        </article>
      </div>
    </motion.main>
  );
};
