// src/pages/EditBlogPage.tsx

import { useEffect, useMemo, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { BlogEditor } from "../components/blog/BlogEditor";

import {
  createBlog,
  getBlogById,
  resolveBlogImageUrl,
  updateBlog,
} from "../api/blogs";

export const EditBlogPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [title, setTitle] = useState("");

  const [excerpt, setExcerpt] = useState("");

  const [content, setContent] = useState("");

  const [published, setPublished] = useState(false);

  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [cover, setCover] = useState<File | null>(null);

  const [existingThumbnail, setExistingThumbnail] = useState("");

  const [existingCover, setExistingCover] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchBlog = async () => {
      try {
        setLoading(true);

        const blog = await getBlogById(id);

        if (!blog) {
          setError("Blog not found");
          return;
        }

        setTitle(blog.title || "");

        setExcerpt(blog.excerpt || "");

        setContent(blog.content || "");

        setPublished(Boolean(blog.published));

        setExistingThumbnail(resolveBlogImageUrl(blog.thumbnail));

        setExistingCover(resolveBlogImageUrl(blog.cover));
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to fetch blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const thumbnailPreview = useMemo(() => {
    if (thumbnail) {
      return URL.createObjectURL(thumbnail);
    }

    return existingThumbnail;
  }, [thumbnail, existingThumbnail]);

  const coverPreview = useMemo(() => {
    if (cover) {
      return URL.createObjectURL(cover);
    }

    return existingCover;
  }, [cover, existingCover]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      setError("");

      const payload = {
        title,
        excerpt,
        content,
        published,
        thumbnail,
        cover,
      };

      if (isEditMode && id) {
        await updateBlog(id, payload);
      } else {
        await createBlog(payload);
      }

      navigate("/admin");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to save blog");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/40 mb-3">
              Content Management
            </p>

            <h1 className="text-5xl font-bold tracking-tight">
              {isEditMode ? "Edit Blog" : "Create Blog"}
            </h1>

            <p className="text-white/50 mt-4 max-w-2xl">
              Write, edit, and publish premium editorial content with rich
              visuals and structured storytelling.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin")}
              className="px-5 py-3 rounded-2xl border border-white/10 hover:bg-white/5 transition"
            >
              Back
            </button>

            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-6 py-3 rounded-2xl bg-white text-black font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : isEditMode
                  ? "Update Blog"
                  : "Publish Blog"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 border border-red-500/20 bg-red-500/10 text-red-300 rounded-2xl px-5 py-4">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid xl:grid-cols-[1fr_380px] gap-8"
        >
          {/* LEFT */}
          <div className="space-y-8">
            {/* TITLE */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <p className="text-sm text-white/40 mb-4">Blog Title</p>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Write a strong blog title..."
                className="w-full bg-transparent text-4xl font-bold outline-none placeholder:text-white/20"
              />
            </div>

            {/* EXCERPT */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-white/40">Excerpt</p>

                <p className="text-xs text-white/30">{excerpt.length} chars</p>
              </div>

              <textarea
                rows={4}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Short summary for cards and SEO..."
                className="w-full bg-transparent outline-none resize-none text-white/80 placeholder:text-white/20"
              />
            </div>

            {/* EDITOR */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden">
              <div className="px-7 py-5 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Editor</h3>

                  <p className="text-sm text-white/40 mt-1">
                    Write your article content here.
                  </p>
                </div>

                <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white/50">
                  Markdown / HTML
                </div>
              </div>

              <BlogEditor content={content} onChange={setContent} />
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-8">
            {/* PUBLISH */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <h3 className="text-lg font-semibold mb-6">Publishing</h3>

              <label className="flex items-center justify-between">
                <span className="text-white/70">Published</span>

                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="h-5 w-5"
                />
              </label>
            </div>

            {/* THUMBNAIL */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <h3 className="text-lg font-semibold mb-5">Thumbnail Image</h3>

              {thumbnailPreview && (
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail Preview"
                  className="w-full h-52 object-cover rounded-2xl mb-5"
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                className="w-full text-sm text-white/60"
              />
            </div>

            {/* COVER */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <h3 className="text-lg font-semibold mb-5">Cover Image</h3>

              {coverPreview && (
                <img
                  src={coverPreview}
                  alt="Cover Preview"
                  className="w-full h-64 object-cover rounded-2xl mb-5"
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCover(e.target.files?.[0] || null)}
                className="w-full text-sm text-white/60"
              />
            </div>

            {/* QUICK INFO */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-7">
              <h3 className="text-lg font-semibold mb-4">Writing Tips</h3>

              <ul className="space-y-3 text-sm text-white/50 leading-relaxed">
                <li>• Keep titles concise and attention-grabbing</li>

                <li>• Use excerpts for SEO and previews</li>

                <li>• Use cover images with cinematic framing</li>

                <li>• Structure content with headings and spacing</li>
              </ul>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
