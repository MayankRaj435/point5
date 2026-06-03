// src/api/blogs.ts

import axiosInstance from "../lib/axiosInstance";

import type {
  Blog,
  BlogListQueryParams,
  BlogRequestOptions,
} from "../types/blog";

const BACKEND_ORIGIN =
  import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") ?? "";

/* =========================================================
   HELPERS
========================================================= */

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const toOptionalString = (value: unknown) =>
  typeof value === "string" && value.trim() ? value : undefined;

const toOptionalBoolean = (value: unknown) =>
  typeof value === "boolean" ? value : undefined;

const toOptionalDate = (value: unknown) =>
  typeof value === "string" && value.trim() ? value : undefined;

const isBlogLike = (value: unknown) =>
  isRecord(value) && ("id" in value || "title" in value || "content" in value);

const extractBlogCollection = (value: unknown): unknown[] => {
  if (Array.isArray(value)) {
    return value;
  }

  if (!isRecord(value)) {
    return [];
  }

  for (const key of ["blogs", "items", "results", "data", "payload"]) {
    const nested = extractBlogCollection(value[key]);

    if (nested.length > 0) {
      return nested;
    }
  }

  return [];
};

const extractBlogObject = (value: unknown): unknown | null => {
  if (isBlogLike(value)) {
    return value;
  }

  if (!isRecord(value)) {
    return null;
  }

  for (const key of ["blog", "data", "result", "item", "payload"]) {
    const nested = extractBlogObject(value[key]);

    if (nested) {
      return nested;
    }
  }

  return null;
};

const normalizeBlog = (value: unknown): Blog | null => {
  if (!isRecord(value)) {
    return null;
  }

  const id = Number(value.id);

  if (!Number.isFinite(id)) {
    return null;
  }

  const title = toOptionalString(value.title);

  if (!title) {
    return null;
  }

  return {
    id,
    title,
    content: toOptionalString(value.content),
    excerpt: toOptionalString(value.excerpt),
    thumbnail: toOptionalString(value.thumbnail),
    cover: toOptionalString(value.cover),
    published: toOptionalBoolean(value.published),
    createdAt: toOptionalDate(value.createdAt),
    updatedAt: toOptionalDate(value.updatedAt),
  };
};

const normalizeBlogCollection = (value: unknown): Blog[] =>
  extractBlogCollection(value)
    .map((entry) => normalizeBlog(entry))
    .filter((entry): entry is Blog => Boolean(entry));

/* =========================================================
   UTILITIES
========================================================= */

export const resolveBlogImageUrl = (path?: string | null) => {
  if (!path) {
    return "";
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  if (!BACKEND_ORIGIN) {
    return path;
  }

  return `${BACKEND_ORIGIN}${path.startsWith("/") ? "" : "/"}${path}`;
};

export const buildBlogExcerpt = (content?: string | null, limit = 160) => {
  if (!content) {
    return "";
  }

  const collapsed = content.replace(/\s+/g, " ").trim();

  if (collapsed.length <= limit) {
    return collapsed;
  }

  return `${collapsed.slice(0, limit).trimEnd()}…`;
};

/* =========================================================
   PUBLIC BLOG APIs
========================================================= */

export const getBlogs = async (
  params?: BlogListQueryParams,
  options?: BlogRequestOptions,
): Promise<Blog[]> => {
  const response = await axiosInstance.get("/blogs", {
    params,
    signal: options?.signal,
  });

  return normalizeBlogCollection(response.data);
};

export const getBlogById = async (
  id: string | number,
  options?: BlogRequestOptions,
): Promise<Blog | null> => {
  const response = await axiosInstance.get(`/blogs/${id}`, {
    signal: options?.signal,
  });

  const candidate = extractBlogObject(response.data);

  return normalizeBlog(candidate ?? response.data);
};

/* =========================================================
   ADMIN BLOG APIs
========================================================= */

export interface CreateBlogPayload {
  title: string;
  content: string;
  excerpt?: string;
  published?: boolean;
  thumbnail?: File | null;
  cover?: File | null;
}

export interface UpdateBlogPayload {
  title?: string;
  content?: string;
  excerpt?: string;
  published?: boolean;
  thumbnail?: File | null;
  cover?: File | null;
}

export const createBlog = async (payload: CreateBlogPayload) => {
  const formData = new FormData();

  formData.append("title", payload.title);

  formData.append("content", payload.content);

  if (payload.excerpt) {
    formData.append("excerpt", payload.excerpt);
  }

  if (typeof payload.published === "boolean") {
    formData.append("published", String(payload.published));
  }

  if (payload.thumbnail) {
    formData.append("thumbnail", payload.thumbnail);
  }

  if (payload.cover) {
    formData.append("cover", payload.cover);
  }

  const response = await axiosInstance.post("/blogs", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateBlog = async (
  id: string | number,
  payload: UpdateBlogPayload,
) => {
  const formData = new FormData();

  if (payload.title) {
    formData.append("title", payload.title);
  }

  if (payload.content) {
    formData.append("content", payload.content);
  }

  if (payload.excerpt) {
    formData.append("excerpt", payload.excerpt);
  }

  if (typeof payload.published === "boolean") {
    formData.append("published", String(payload.published));
  }

  if (payload.thumbnail) {
    formData.append("thumbnail", payload.thumbnail);
  }

  if (payload.cover) {
    formData.append("cover", payload.cover);
  }

  const response = await axiosInstance.put(`/blogs/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deleteBlog = async (id: string | number) => {
  const response = await axiosInstance.delete(`/blogs/${id}`);

  return response.data;
};

/* =========================================================
   EDITOR IMAGE UPLOAD
========================================================= */

export const uploadEditorImage = async (file: File) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await axiosInstance.post("/blogs/editor-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
