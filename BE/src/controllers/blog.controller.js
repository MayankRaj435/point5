import prisma from "../helper/pooler.js";

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ success: true, blogs });
  } catch (error) {
    console.error("❌ Get all blogs failed:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch blogs" });
  }
};

// Get single blog by ID

export const getBlogById = async (req, res) => {
  try {
    const blogId = Number(req.params.id);
    if (Number.isNaN(blogId)) {
      return res.status(400).json({ success: false, error: "Invalid blog id" });
    }

    const blog = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog) {
      return res.status(404).json({ success: false, error: "Blog not found" });
    }

    return res.json({ success: true, blog });
  } catch (error) {
    console.error("❌ Get blog failed:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch blog" });
  }
};

/* ================= EDITOR IMAGE UPLOAD ================= */

export const uploadEditorImageController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    const fileUrl = `/uploads/editor/${req.file.filename}`;

    return res.json({
      success: true,
      result: [
        {
          url: fileUrl,
          name: req.file.filename,
          size: req.file.size,
        },
      ],
    });
  } catch (error) {
    console.error("❌ Editor image upload failed:", error);
    return res.status(500).json({ success: false, error: "Image upload failed" });
  }
};

/* ================= PROTECTED ROUTES ================= */

// Create blog
export const createBlog = async (req, res) => {
  try {
    const { title, content, published } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, error: "Title is required" });
    }

    const thumbnailFile = req.files?.thumbnail?.[0];
    const coverFile = req.files?.cover?.[0];
    if (!thumbnailFile || !coverFile) {
      return res.status(400).json({
        success: false,
        error: "Thumbnail and cover images are required",
      });
    }

    const thumbnailPath = `/uploads/blogs/${thumbnailFile.filename}`;
    const coverPath = `/uploads/blogs/${coverFile.filename}`;

    const blog = await prisma.blog.create({
      data: {
        title: title.trim(),
        content: content ? content.toString() : "",
        published: published === "true" || published === true || published === "1",
        thumbnail: thumbnailPath,
        cover: coverPath,
      },
    });

    return res.status(201).json({ success: true, message: "Blog created successfully", blog });
  } catch (error) {
    console.error("❌ Blog creation failed:", error);
    return res.status(500).json({ success: false, error: "Failed to create blog" });
  }
};

// Update blog
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, published } = req.body;

    const thumbnailFile = req.files?.thumbnail?.[0];
    const coverFile = req.files?.cover?.[0];

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (published !== undefined)
      updateData.published = published === "true" || published === true || published === "1";
    if (thumbnailFile) updateData.thumbnail = `/uploads/blogs/${thumbnailFile.filename}`;
    if (coverFile) updateData.cover = `/uploads/blogs/${coverFile.filename}`;

    const blog = await prisma.blog.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return res.json({ success: true, message: "Blog updated successfully", blog });
  } catch (error) {
    console.error("❌ Blog update failed:", error);
    return res.status(500).json({ success: false, error: "Failed to update blog" });
  }
};

// Delete blog
export const deleteBlog = async (req, res) => {
  try {
    const blogId = Number(req.params.id);
    if (Number.isNaN(blogId)) {
      return res.status(400).json({ success: false, error: "Invalid blog id" });
    }

    await prisma.blog.delete({ where: { id: blogId } });
    return res.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    console.error("❌ Blog delete failed:", error);
    return res.status(500).json({ success: false, error: "Failed to delete blog" });
  }
};