import { Router } from "express";

import { authenticate, requireAdmin } from "../middlewares/authenticate.js";
import { createUploader } from "../middlewares/upload.js";

import {
    createBlog,
    deleteBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    uploadEditorImageController,
} from "../controllers/blog.controller.js";

const blogRouter = Router();

/* ================= UPLOAD CONFIG ================= */

// For thumbnail + cover
const uploadBlogImages = createUploader("data/uploads/blogs", [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
]);

// For images inside editor
const uploadEditorImage = createUploader("data/uploads/editor", [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
]);

/* ================= PUBLIC GET ROUTES ================= */

blogRouter.get("/", getAllBlogs);

blogRouter.get("/:id", getBlogById);

/* ================= EDITOR IMAGE UPLOAD ================= */

blogRouter.post(
  "/editor-image",
  authenticate,
  requireAdmin,
  uploadEditorImage.single("file"),
  uploadEditorImageController,
);

/* ================= PROTECTED ROUTES ================= */

// Create blog
blogRouter.post(
  "/",
  authenticate,
  requireAdmin,
  uploadBlogImages.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  createBlog,
);

// Update blog
blogRouter.put(
  "/:id",
  authenticate,
  requireAdmin,
  uploadBlogImages.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  updateBlog,
);

// Delete blog
blogRouter.delete("/:id", authenticate, requireAdmin, deleteBlog);

export default blogRouter;