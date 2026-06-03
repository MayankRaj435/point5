// src/components/admin/BlogCrudPanel.tsx

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { deleteBlog, getBlogs, resolveBlogImageUrl } from "../../api/blogs";

import type { Blog } from "../../types/blog";

export const BlogCrudPanel = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const [loading, setLoading] = useState(true);

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const data = await getBlogs();

      setBlogs(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Delete this blog?");

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await deleteBlog(id);

      setBlogs((prev) => prev.filter((blog) => blog.id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete blog");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-10 text-center text-white/60">Loading blogs...</div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-500/20 bg-red-500/10 text-red-300 rounded-2xl px-4 py-3">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* TOP ACTIONS */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">All Blogs</h3>

          <p className="text-white/50 text-sm mt-1">
            Manage blog posts from here.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/blogs/create")}
          className="px-5 py-3 rounded-2xl bg-white text-black font-semibold hover:opacity-90 transition"
        >
          Create Blog
        </button>
      </div>

      {/* EMPTY */}
      {blogs.length === 0 && (
        <div className="border border-dashed border-white/10 rounded-2xl py-16 text-center text-white/50">
          No blogs found.
        </div>
      )}

      {/* BLOGS */}
      <div className="grid gap-5">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="border border-white/10 bg-white/[0.03] rounded-3xl overflow-hidden"
          >
            <div className="grid md:grid-cols-[180px_1fr]">
              {/* IMAGE */}
              <div className="h-full min-h-[180px] bg-black">
                {blog.thumbnail ? (
                  <img
                    src={resolveBlogImageUrl(blog.thumbnail)}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/30 text-sm">
                    No Image
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="p-6 flex flex-col justify-between gap-5">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`text-xs px-3 py-1 rounded-full border ${
                        blog.published
                          ? "border-green-500/30 bg-green-500/10 text-green-300"
                          : "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
                      }`}
                    >
                      {blog.published ? "Published" : "Draft"}
                    </span>

                    <span className="text-white/30 text-sm">#{blog.id}</span>
                  </div>

                  <h4 className="text-2xl font-semibold mb-2">{blog.title}</h4>

                  <p className="text-white/50 line-clamp-3">
                    {blog.excerpt || blog.content || "No content"}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-3">
                  <button
                    className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition"
                    onClick={() => navigate(`/admin/blogs/edit/${blog.id}`)}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(blog.id)}
                    disabled={deletingId === blog.id}
                    className="px-4 py-2 rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20 transition disabled:opacity-50"
                  >
                    {deletingId === blog.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
