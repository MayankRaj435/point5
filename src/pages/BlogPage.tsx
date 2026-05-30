import { motion } from 'motion/react';
import { SectionLabel } from '../components/SectionLabel';
import { BlogCard } from '../components/blog/BlogCard';
import { BlogCardSkeleton } from '../components/blogs/BlogCardSkeleton';
import { BlogErrorState } from '../components/blogs/BlogErrorState';
import { EmptyBlogs } from '../components/blogs/EmptyBlogs';
import { KineticText } from '../components/motion/KineticText';
import { PageDetailing } from '../components/ui/PageDetailing';
import { useBlogs } from '../hooks/useBlogs';

export const BlogPage = () => {
  const { data: blogs, isLoading, error, isEmpty, retry } = useBlogs();

  return (
    <main className="bg-background text-foreground min-h-screen relative pt-32 pb-24">
      <PageDetailing />
      
      {/* Decorative background — reduced to prevent scroll lag */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40vw] h-[30vh] bg-accent/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-20 md:mb-32">
          <div className="mb-8">
            <SectionLabel number="05" text="Our Journal" />
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold font-display uppercase tracking-tighter leading-none text-white">
            <KineticText as="span" className="block">
              Latest
            </KineticText>
            <KineticText as="span" className="block text-accent/80 italic" delay={0.1}>
              Thoughts
            </KineticText>
          </h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-8 max-w-2xl text-foreground/50 text-lg md:text-xl font-medium"
          >
            Insights, strategies, and creative perspectives from the minds at Point 5 Media Productions.
          </motion.p>
        </div>

        {/* Blog Grid */}
        <div className="rounded-[2.5rem] border border-white/5 bg-white/2 p-4 md:p-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
              {Array.from({ length: 4 }).map((_, index) => (
                <motion.div
                  key={`blog-skeleton-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06, duration: 0.45 }}
                >
                  <BlogCardSkeleton />
                </motion.div>
              ))}
            </div>
          ) : error ? (
            <BlogErrorState
              title="We could not load the journal right now."
              message={error.message}
              onRetry={retry}
            />
          ) : isEmpty ? (
            <EmptyBlogs />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
              {blogs.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: Math.min(index * 0.07, 0.35), duration: 0.6 }}
                  className="group relative flex flex-col"
                >
                  <BlogCard blog={post} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
