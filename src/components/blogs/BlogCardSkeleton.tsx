export const BlogCardSkeleton = () => {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-4 md:p-5 animate-pulse">
      <div className="aspect-[16/10] rounded-[1.5rem] bg-white/5" />

      <div className="mt-5 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="h-3 w-24 rounded-full bg-white/5" />
          <div className="h-6 w-16 rounded-full bg-white/5" />
        </div>

        <div className="space-y-3">
          <div className="h-5 w-5/6 rounded-full bg-white/5" />
          <div className="h-5 w-2/3 rounded-full bg-white/5" />
        </div>

        <div className="space-y-2">
          <div className="h-3 w-full rounded-full bg-white/5" />
          <div className="h-3 w-11/12 rounded-full bg-white/5" />
          <div className="h-3 w-4/5 rounded-full bg-white/5" />
        </div>

        <div className="h-10 w-36 rounded-full bg-white/5" />
      </div>
    </div>
  );
};
